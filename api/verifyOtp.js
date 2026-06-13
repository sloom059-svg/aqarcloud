// التحقق من رمز OTP الذي أدخله المستخدم.
// يُستدعى: POST /api/verifyOtp  { email, code, purpose }
// يرجّع { success: true } إذا الرمز صحيح وغير منتهٍ.
//
// متغيرات البيئة المطلوبة في Vercel:
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

import { createClient } from '@supabase/supabase-js';

const MAX_ATTEMPTS = 5; // أقصى محاولات إدخال خاطئة لكل رمز

function getAdminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('إعدادات Supabase للخادم غير مضبوطة (URL / SERVICE_ROLE_KEY)');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST فقط' });

  try {
    const { email, code, purpose = 'signup' } = req.body || {};
    if (!email || !code) {
      return res.status(400).json({ error: 'الإيميل والرمز مطلوبان' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanCode = String(code).trim();
    const supabase = getAdminClient();

    // نجيب أحدث رمز فعّال لهذا الإيميل/الغرض
    const { data: row, error } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', cleanEmail)
      .eq('purpose', purpose)
      .eq('consumed', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error('خطأ في قراءة الرمز: ' + error.message);
    if (!row) {
      return res.status(400).json({ error: 'لا يوجد رمز فعّال. اطلب رمزاً جديداً.' });
    }

    // انتهت الصلاحية؟
    if (new Date(row.expires_at).getTime() < Date.now()) {
      await supabase.from('otp_codes').update({ consumed: true }).eq('id', row.id);
      return res.status(400).json({ error: 'انتهت صلاحية الرمز. اطلب رمزاً جديداً.' });
    }

    // تجاوز عدد المحاولات؟
    if (row.attempts >= MAX_ATTEMPTS) {
      await supabase.from('otp_codes').update({ consumed: true }).eq('id', row.id);
      return res.status(429).json({ error: 'تجاوزت عدد المحاولات. اطلب رمزاً جديداً.' });
    }

    // رمز خاطئ؟
    if (row.code !== cleanCode) {
      await supabase
        .from('otp_codes')
        .update({ attempts: row.attempts + 1 })
        .eq('id', row.id);
      const left = MAX_ATTEMPTS - (row.attempts + 1);
      return res.status(400).json({
        error: left > 0 ? `رمز غير صحيح. محاولات متبقية: ${left}` : 'رمز غير صحيح.',
      });
    }

    // صحيح → نستهلك الرمز
    await supabase.from('otp_codes').update({ consumed: true }).eq('id', row.id);

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
