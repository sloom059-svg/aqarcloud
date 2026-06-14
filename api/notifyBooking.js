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
const DASHBOARD_URL = 'https://www.aqacloud.com/venue';

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

// أيقونات emoji (تشتغل في كل برامج الإيميل، عكس SVG)
const EMOJI = { person: '👤', phone: '📱', cal: '📅', notes: '📝' };

function iconRow(emoji, label, value, highlight = false, ltr = false) {
  const bg = highlight ? '#FFF1F3' : '#F7F7F7';
  const iconBg = highlight ? '#FF385C' : '#181818';
  const dirAttr = ltr ? ' dir="ltr"' : '';
  return `
  <table role="presentation" width="100%" style="border-collapse:collapse;margin-bottom:10px;background:${bg};border-radius:14px;">
    <tr>
      <td width="60" style="padding:14px 16px;vertical-align:middle;">
        <table role="presentation" style="border-collapse:collapse;"><tr>
          <td width="38" height="38" style="background:${iconBg};border-radius:10px;text-align:center;vertical-align:middle;font-size:18px;line-height:38px;">${emoji}</td>
        </tr></table>
      </td>
      <td style="padding:14px 16px 14px 0;vertical-align:middle;">
        <div style="color:#888;font-size:11px;margin-bottom:3px;">${label}</div>
        <div style="color:#181818;font-weight:bold;font-size:15px;"${dirAttr}>${value}</div>
      </td>
    </tr>
  </table>`;
}

function bookingHtml({ venue_name, client_name, client_phone, check_in, check_out, notes }) {
  const notesRow = notes ? iconRow(EMOJI.notes, 'ملاحظات', notes) : '';
  return `
  <div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;background:#F7F7F7;padding:32px;">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:20px;padding:32px;border:1px solid #eee;">

      <div style="text-align:center;margin-bottom:20px;">
        <img src="${LOGO_URL}" alt="عقار كلاود" width="150" style="width:150px;max-width:70%;height:auto;display:inline-block;" />
      </div>

      <div style="text-align:center;margin-bottom:24px;">
        <div style="font-size:38px;line-height:1;margin-bottom:10px;">🔔</div>
        <div style="color:#FF385C;font-weight:bold;font-size:17px;margin-bottom:6px;">طلب حجز جديد</div>
        <div style="color:#555;font-size:14px;">وصلك طلب حجز على <strong style="color:#181818;">${venue_name}</strong></div>
      </div>

      ${iconRow(EMOJI.person, 'اسم العميل',   client_name,          true)}
      ${iconRow(EMOJI.phone,  'رقم الجوال',   client_phone,         false, true)}
      ${iconRow(EMOJI.cal,    'تاريخ الدخول', formatDate(check_in))}
      ${iconRow(EMOJI.cal,    'تاريخ الخروج', formatDate(check_out))}
      ${notesRow}

      <div style="text-align:center;margin:24px 0 20px;">
        <a href="${DASHBOARD_URL}" style="display:inline-block;background:#FF385C;color:#fff;text-decoration:none;font-weight:bold;font-size:15px;padding:14px 36px;border-radius:14px;">عرض الحجوزات في لوحة التحكم</a>
      </div>

      <hr style="border:none;border-top:1px solid #f0f0f0;margin:0 0 14px;" />
      <div style="color:#bbb;font-size:12px;text-align:center;">© عقار كلاود · منصة إدارة الشاليهات والعقارات</div>
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
