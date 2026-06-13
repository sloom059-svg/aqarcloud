// توليد رمز OTP، تخزينه في Supabase، وإرساله عبر Resend.
// يُستدعى: POST /api/sendOtp  { email, purpose }  (purpose: signup | reset)
//
// متغيرات البيئة المطلوبة في Vercel:
//   SUPABASE_URL              = رابط مشروع Supabase
//   SUPABASE_SERVICE_ROLE_KEY = مفتاح service role السري (ليس anon!)
//   RESEND_API_KEY            = مفتاح Resend
//   EMAIL_FROM                = اختياري

import { createClient } from '@supabase/supabase-js';
import { sendEmail } from './sendEmail.js';

const OTP_TTL_MINUTES = 10;        // صلاحية الرمز
const RESEND_COOLDOWN_SECONDS = 60; // أقل فاصل بين إرسالين لنفس الإيميل

function getAdminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('إعدادات Supabase للخادم غير مضبوطة (URL / SERVICE_ROLE_KEY)');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

function generateCode() {
  // رمز من 6 أرقام (100000 - 999999)
  return String(Math.floor(100000 + Math.random() * 900000));
}

function otpEmailHtml(code, purpose) {
  const title = purpose === 'reset' ? 'إعادة تعيين كلمة المرور' : 'تأكيد إنشاء الحساب';
  return `
  <div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;background:#F7F7F7;padding:32px;">
    <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:18px;padding:32px;border:1px solid #eee;">
      <h2 style="color:#181818;margin:0 0 8px;">عقار كلاود</h2>
      <p style="color:#555;margin:0 0 24px;font-size:15px;">${title}</p>
      <p style="color:#333;font-size:15px;margin:0 0 16px;">رمز التحقق الخاص بك هو:</p>
      <div style="font-size:34px;font-weight:bold;letter-spacing:8px;color:#FF385C;text-align:center;background:#FFF1F3;padding:18px;border-radius:14px;margin:0 0 20px;">
        ${code}
      </div>
      <p style="color:#888;font-size:13px;margin:0;">صالح لمدة ${OTP_TTL_MINUTES} دقائق. إذا لم تطلب هذا الرمز، تجاهل هذه الرسالة.</p>
    </div>
  </div>`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST فقط' });

  try {
    const { email, purpose = 'signup' } = req.body || {};
    if (!email) return res.status(400).json({ error: 'الإيميل مطلوب' });

    const cleanEmail = String(email).trim().toLowerCase();
    const supabase = getAdminClient();

    // منع الإرسال المتكرر السريع (cooldown)
    const { data: recent } = await supabase
      .from('otp_codes')
      .select('created_at')
      .eq('email', cleanEmail)
      .eq('purpose', purpose)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recent?.created_at) {
      const secondsSince = (Date.now() - new Date(recent.created_at).getTime()) / 1000;
      if (secondsSince < RESEND_COOLDOWN_SECONDS) {
        const wait = Math.ceil(RESEND_COOLDOWN_SECONDS - secondsSince);
        return res.status(429).json({ error: `الرجاء الانتظار ${wait} ثانية قبل طلب رمز جديد` });
      }
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString();

    // نلغي الرموز السابقة غير المستهلكة لنفس الإيميل/الغرض
    await supabase
      .from('otp_codes')
      .update({ consumed: true })
      .eq('email', cleanEmail)
      .eq('purpose', purpose)
      .eq('consumed', false);

    const { error: insertError } = await supabase
      .from('otp_codes')
      .insert({ email: cleanEmail, code, purpose, expires_at: expiresAt });

    if (insertError) throw new Error('تعذر حفظ الرمز: ' + insertError.message);

    await sendEmail({
      to: cleanEmail,
      subject: `رمز التحقق: ${code}`,
      html: otpEmailHtml(code, purpose),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
