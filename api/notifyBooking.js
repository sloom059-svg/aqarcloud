// إشعار إيميل لصاحب الشاليه عند وصول حجز جديد.
// يُستدعى: POST /api/notifyBooking
// { venue_name, owner_id, client_name, client_phone, check_in, check_out, notes }
//
// متغيرات البيئة المطلوبة:
//   RESEND_API_KEY
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

import { createClient } from '@supabase/supabase-js';
import { sendEmail } from './sendEmail.js';

const LOGO_URL = 'https://unptzucothzejcgntmpi.supabase.co/storage/v1/object/public/images/aqar-cloud-logo.png';
const DASHBOARD_URL = 'https://www.aqacloud.com/venue/bookings';

function getAdminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('إعدادات Supabase للخادم غير مضبوطة');
  return createClient(url, key, { auth: { persistSession: false } });
}

// تنسيق التاريخ العربي
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function bookingHtml({ venue_name, client_name, client_phone, check_in, check_out, notes }) {
  const notesRow = notes
    ? `<div style="background:#F7F7F7;border-radius:14px;padding:14px 18px;margin-bottom:12px;">
        <p style="color:#888;font-size:12px;margin:0 0 4px;">📝 ملاحظات</p>
        <p style="color:#181818;font-weight:bold;font-size:15px;margin:0;">${notes}</p>
      </div>`
    : '';

  return `
  <div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;background:#F7F7F7;padding:32px;">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:18px;padding:32px;border:1px solid #eee;">

      <table role="presentation" align="center" style="margin:0 auto 20px;border-collapse:collapse;">
        <tr>
          <td style="padding:0 10px 0 0;vertical-align:middle;">
            <img src="${LOGO_URL}" alt="عقار كلاود" width="40" height="40"
              style="width:40px;height:40px;object-fit:contain;border-radius:10px;display:block;" />
          </td>
          <td style="vertical-align:middle;font-size:22px;font-weight:bold;color:#181818;">عقار كلاود</td>
        </tr>
      </table>

      <p style="color:#FF385C;font-weight:bold;text-align:center;font-size:16px;margin:0 0 6px;">🔔 طلب حجز جديد</p>
      <p style="color:#555;text-align:center;font-size:14px;margin:0 0 24px;">
        وصلك طلب حجز على <strong style="color:#181818;">${venue_name}</strong>
      </p>

      <div style="background:#FFF1F3;border-radius:14px;padding:14px 18px;margin-bottom:12px;">
        <p style="color:#888;font-size:12px;margin:0 0 4px;">👤 اسم العميل</p>
        <p style="color:#181818;font-weight:bold;font-size:16px;margin:0;">${client_name}</p>
      </div>

      <div style="background:#F7F7F7;border-radius:14px;padding:14px 18px;margin-bottom:12px;">
        <p style="color:#888;font-size:12px;margin:0 0 4px;">📱 رقم الجوال</p>
        <p style="color:#181818;font-weight:bold;font-size:16px;margin:0;" dir="ltr">${client_phone}</p>
      </div>

      <div style="background:#F7F7F7;border-radius:14px;padding:14px 18px;margin-bottom:12px;">
        <p style="color:#888;font-size:12px;margin:0 0 4px;">📅 تاريخ الدخول</p>
        <p style="color:#181818;font-weight:bold;font-size:16px;margin:0;">${formatDate(check_in)}</p>
      </div>

      <div style="background:#F7F7F7;border-radius:14px;padding:14px 18px;margin-bottom:12px;">
        <p style="color:#888;font-size:12px;margin:0 0 4px;">📅 تاريخ الخروج</p>
        <p style="color:#181818;font-weight:bold;font-size:16px;margin:0;">${formatDate(check_out)}</p>
      </div>

      ${notesRow}

      <div style="text-align:center;margin:24px 0 20px;">
        <a href="${DASHBOARD_URL}"
          style="display:inline-block;background:#181818;color:#fff;text-decoration:none;font-weight:bold;font-size:15px;padding:13px 32px;border-radius:14px;">
          عرض الحجوزات في لوحة التحكم
        </a>
      </div>

      <p style="color:#888;font-size:12px;text-align:center;margin:0 0 12px;">
        هذا الإشعار أُرسل تلقائياً من منصة عقار كلاود
      </p>
      <hr style="border:none;border-top:1px solid #f0f0f0;margin:0 0 12px;" />
      <p style="color:#bbb;font-size:12px;text-align:center;margin:0;">
        © عقار كلاود · منصة إدارة الشاليهات والعقارات
      </p>
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
    const { venue_name, owner_id, client_name, client_phone, check_in, check_out, notes } = req.body || {};

    if (!owner_id || !client_name || !venue_name) {
      return res.status(400).json({ error: 'بيانات الحجز ناقصة' });
    }

    // جيب إيميل المالك عبر service role
    const supabase = getAdminClient();
    let ownerEmail = null;

    // أول حاول من جدول profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', owner_id)
      .maybeSingle();

    if (profile?.email) {
      ownerEmail = profile.email;
    } else {
      // fallback: جيبه من auth.users
      const { data: authUser } = await supabase.auth.admin.getUserById(owner_id);
      ownerEmail = authUser?.user?.email || null;
    }

    if (!ownerEmail) {
      return res.status(404).json({ error: 'تعذر إيجاد إيميل صاحب الشاليه' });
    }

    await sendEmail({
      to: ownerEmail,
      subject: `🔔 حجز جديد على ${venue_name}`,
      html: bookingHtml({ venue_name, client_name, client_phone, check_in, check_out, notes }),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
