// إرسال إيميل ترحيبي لمستخدم جديد (بعد إكمال بياناته أول مرة).
// يعمل لكل المستخدمين الجدد: تسجيل بالإيميل أو دخول عبر Google.
// يُستدعى: POST /api/sendWelcome  { email, name }
//
// متغيرات البيئة المطلوبة في Vercel:
//   RESEND_API_KEY
//   EMAIL_FROM (اختياري)

import { sendEmail } from './sendEmail.js';

const LOGO_URL = 'https://unptzucothzejcgntmpi.supabase.co/storage/v1/object/public/images/aqar-cloud-logo.png';
const SITE_URL = 'https://www.aqacloud.com';

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

function welcomeHtml(name) {
  const greeting = name ? `أهلاً ${name} 👋` : 'أهلاً بك 👋';
  return `
  <div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;background:#F7F7F7;padding:32px;">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:18px;padding:32px;border:1px solid #eee;">
      ${brandHeader()}
      <p style="color:#FF385C;font-weight:bold;text-align:center;margin:0 0 18px;font-size:15px;">تم تفعيل حسابك بنجاح 🎉</p>
      <h2 style="color:#181818;text-align:center;margin:0 0 14px;font-size:20px;">${greeting}</h2>
      <p style="color:#444;font-size:15px;line-height:1.9;margin:0 0 20px;text-align:center;">
        يسعدنا انضمامك إلى <strong>عقار كلاود</strong> — منصتك لإطلاق صفحة احترافية لعرض شاليهاتك وعقاراتك،
        واستقبال الحجوزات، وإدارة كل شيء من مكان واحد.
      </p>
      <div style="text-align:center;margin:0 0 24px;">
        <a href="${SITE_URL}/dashboard" style="display:inline-block;background:#181818;color:#fff;text-decoration:none;font-weight:bold;font-size:15px;padding:13px 32px;border-radius:14px;">
          ابدأ الآن من لوحة التحكم
        </a>
      </div>
      <table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 8px;">
        <tr><td style="color:#555;font-size:14px;line-height:1.9;padding:4px 0;">✅ أضف عقاراتك وشاليهاتك بالصور والتفاصيل</td></tr>
        <tr><td style="color:#555;font-size:14px;line-height:1.9;padding:4px 0;">✅ شارك صفحتك مع عملائك بضغطة واحدة</td></tr>
        <tr><td style="color:#555;font-size:14px;line-height:1.9;padding:4px 0;">✅ استقبل الحجوزات وتابعها بسهولة</td></tr>
      </table>
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
    const { email, name } = req.body || {};
    if (!email) return res.status(400).json({ error: 'الإيميل مطلوب' });

    await sendEmail({
      to: String(email).trim().toLowerCase(),
      subject: 'أهلاً بك في عقار كلاود 🎉',
      html: welcomeHtml(name),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
