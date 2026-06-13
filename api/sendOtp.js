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

// رابط الشعار العام (يجب أن يكون رابطاً مباشراً لصورة على الإنترنت).
// اتركه فارغاً '' إذا لم يتوفر بعد — سيظهر الاسم وحده دون كسر التصميم.
// مثال: 'https://aqacloud.com/logo.png'
const LOGO_URL = 'https://unptzucothzejcgntmpi.supabase.co/storage/v1/object/public/images/aqar-cloud-logo.png';

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

function brandHeader() {
  const logoCell = LOGO_URL
    ? `<td style="padding:0 8px 0 0;vertical-align:middle;"><img src="${LOGO_URL}" alt="عقار كلاود" width="40" height="40" style="width:40px;height:40px;object-fit:contain;border-radius:10px;display:block;" /></td>`
    : '';
  return `
    <table role="presentation" align="center" style="margin:0 auto 8px;border-collapse:collapse;">
      <tr>
        ${logoCell}
        <td style="vertical-align:middle;font-size:22px;font-weight:bold;color:#181818;">عقار كلاود</td>
      </tr>
    </table>`;
}

function otpEmailHtml(code, purpose) {
  const isReset = purpose === 'reset';
  const title = isReset ? 'إعادة تعيين كلمة المرور' : 'تأكيد إنشاء الحساب';
  const welcome = isReset
    ? 'تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك.'
    : 'أهلاً بك في عقار كلاود 👋 يسعدنا انضمامك! استخدم الرمز التالي لتأكيد بريدك وإكمال إنشاء حسابك.';

  return `
  <div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;background:#F7F7F7;padding:32px;">
    <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:18px;padding:32px;border:1px solid #eee;">
      ${brandHeader()}
      <p style="color:#FF385C;font-weight:bold;text-align:center;margin:0 0 20px;font-size:14px;">${title}</p>
      <p style="color:#333;font-size:15px;line-height:1.8;margin:0 0 18px;text-align:center;">${welcome}</p>
      <p style="color:#555;font-size:14px;margin:0 0 10px;text-align:center;">رمز التحقق الخاص بك:</p>
      <div style="font-size:34px;font-weight:bold;letter-spacing:8px;color:#FF385C;text-align:center;background:#FFF1F3;padding:18px;border-radius:14px;margin:0 0 20px;">
        ${code}
      </div>
      <p style="color:#888;font-size:13px;margin:0;text-align:center;">صالح لمدة ${OTP_TTL_MINUTES} دقائق. إذا لم تطلب هذا الرمز، تجاهل هذه الرسالة.</p>
      <hr style="border:none;border-top:1px solid #f0f0f0;margin:24px 0 16px;" />
      <p style="color:#bbb;font-size:12px;margin:0;text-align:center;">© عقار كلاود · منصة إدارة الشاليهات والعقارات</p>
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
