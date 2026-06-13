// إعادة تعيين كلمة المرور بعد التحقق من رمز OTP (الغرض: reset).
// يتحقق من الرمز أولاً ثم يغيّر كلمة المرور عبر صلاحية الخادم.
// يُستدعى: POST /api/resetPassword  { email, code, newPassword }
//
// متغيرات البيئة المطلوبة في Vercel:
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

import { createClient } from '@supabase/supabase-js';

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
    const { email, code, newPassword } = req.body || {};
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'الإيميل والرمز وكلمة المرور الجديدة مطلوبة' });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanCode = String(code).trim();
    const supabase = getAdminClient();

    // 1) تحقق من رمز OTP (غرض reset)
    const { data: row, error: readErr } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', cleanEmail)
      .eq('purpose', 'reset')
      .eq('consumed', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (readErr) throw new Error('خطأ في قراءة الرمز: ' + readErr.message);
    if (!row) return res.status(400).json({ error: 'لا يوجد رمز فعّال. اطلب رمزاً جديداً.' });

    if (new Date(row.expires_at).getTime() < Date.now()) {
      await supabase.from('otp_codes').update({ consumed: true }).eq('id', row.id);
      return res.status(400).json({ error: 'انتهت صلاحية الرمز. اطلب رمزاً جديداً.' });
    }
    if (row.attempts >= 5) {
      await supabase.from('otp_codes').update({ consumed: true }).eq('id', row.id);
      return res.status(429).json({ error: 'تجاوزت عدد المحاولات. اطلب رمزاً جديداً.' });
    }
    if (row.code !== cleanCode) {
      await supabase.from('otp_codes').update({ attempts: row.attempts + 1 }).eq('id', row.id);
      const left = 5 - (row.attempts + 1);
      return res.status(400).json({ error: left > 0 ? `رمز غير صحيح. محاولات متبقية: ${left}` : 'رمز غير صحيح.' });
    }

    // 2) ابحث عن المستخدم بالإيميل
    // listUsers مع فلترة يدوية (Supabase لا يوفّر بحثاً مباشراً بالإيميل في كل النسخ)
    let userId = null;
    let page = 1;
    const perPage = 200;
    // نبحث في أول صفحات قليلة (كافٍ لمعظم المشاريع)
    while (page <= 10 && !userId) {
      const { data: list, error: listErr } = await supabase.auth.admin.listUsers({ page, perPage });
      if (listErr) throw new Error('خطأ في جلب المستخدم: ' + listErr.message);
      const found = list?.users?.find((u) => (u.email || '').toLowerCase() === cleanEmail);
      if (found) userId = found.id;
      if (!list?.users?.length || list.users.length < perPage) break;
      page += 1;
    }

    if (!userId) {
      // لأمان الخصوصية لا نكشف إن كان الإيميل غير موجود، لكن لا يمكن المتابعة
      await supabase.from('otp_codes').update({ consumed: true }).eq('id', row.id);
      return res.status(400).json({ error: 'تعذر إكمال العملية. تأكد من البريد أو اطلب رمزاً جديداً.' });
    }

    // 3) غيّر كلمة المرور
    const { error: updErr } = await supabase.auth.admin.updateUserById(userId, {
      password: String(newPassword),
    });
    if (updErr) throw new Error('تعذر تحديث كلمة المرور: ' + updErr.message);

    // 4) استهلك الرمز
    await supabase.from('otp_codes').update({ consumed: true }).eq('id', row.id);

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
