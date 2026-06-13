// نقطة الإرسال الموحّدة عبر Resend API (بدون SMTP).
// كل الإيميلات في المشروع تمر من هنا: OTP، إشعار الحجز، نسيان كلمة المرور.
// يُستدعى داخلياً من باقي ملفات الـ API، أو مباشرة عبر POST.
//
// متغيرات البيئة المطلوبة في Vercel:
//   RESEND_API_KEY  = مفتاح Resend (re_...)
//   EMAIL_FROM      = اختياري، الافتراضي: عقار كلاود <no-reply@aqacloud.com>

const DEFAULT_FROM = 'عقار كلاود <no-reply@aqacloud.com>';

// دالة قابلة لإعادة الاستخدام من ملفات API ثانية (import).
export async function sendEmail({ to, subject, html, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY غير مضبوط في إعدادات الخادم');
  }
  if (!to || !subject || !html) {
    throw new Error('الحقول المطلوبة: to, subject, html');
  }

  const from = process.env.EMAIL_FROM || DEFAULT_FROM;

  const payload = {
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  };
  if (replyTo) payload.reply_to = replyTo;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Resend يرجّع رسالة الخطأ في data.message أو data.name
    const reason = data?.message || data?.name || `HTTP ${res.status}`;
    throw new Error(`فشل إرسال الإيميل عبر Resend: ${reason}`);
  }

  return data; // يحتوي على id الإيميل
}

// هاندلر HTTP للاستدعاء المباشر (POST /api/sendEmail)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST فقط' });
  }

  try {
    const { to, subject, html, replyTo } = req.body || {};
    const result = await sendEmail({ to, subject, html, replyTo });
    return res.status(200).json({ success: true, id: result?.id || null });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
