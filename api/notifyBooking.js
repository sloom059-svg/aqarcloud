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

const ICON = {
  person: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  phone:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  cal:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#fff" stroke-width="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="#fff" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="#fff" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
  notes:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="16" y1="13" x2="8" y2="13" stroke="#fff" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="17" x2="8" y2="17" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
};

function iconRow(svg, label, value, highlight = false, ltr = false) {
  const bg = highlight ? '#FFF1F3' : '#F7F7F7';
  const iconBg = highlight ? '#FF385C' : '#181818';
  const dirAttr = ltr ? ' dir="ltr"' : '';
  return `
  <div style="background:${bg};border-radius:14px;padding:14px 16px;margin-bottom:10px;">
    <table role="presentation" style="border-collapse:collapse;width:100%;"><tr>
      <td width="48" style="vertical-align:middle;padding:0 12px 0 0;">
        <table role="presentation" style="border-collapse:collapse;width:36px;height:36px;background:${iconBg};border-radius:10px;"><tr>
          <td style="text-align:center;vertical-align:middle;padding:9px;">${svg}</td>
        </tr></table>
      </td>
      <td style="vertical-align:middle;">
        <p style="color:#888;font-size:11px;margin:0 0 3px;">${label}</p>
        <p style="color:#181818;font-weight:bold;font-size:15px;margin:0;"${dirAttr}>${value}</p>
      </td>
    </tr></table>
  </div>`;
}

function bookingHtml({ venue_name, client_name, client_phone, check_in, check_out, notes }) {
  const notesRow = notes ? iconRow(ICON.notes, 'ملاحظات', notes) : '';
  return `
  <div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;background:#F7F7F7;padding:32px;">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:20px;padding:32px;border:1px solid #eee;">

      <div style="text-align:center;margin-bottom:22px;">
        <img src="https://unptzucothzejcgntmpi.supabase.co/storage/v1/object/public/images/aqar-cloud-logo.png" alt="عقار كلاود" height="56"
          style="height:56px;max-width:200px;object-fit:contain;display:inline-block;" />
      </div>

      <div style="text-align:center;margin-bottom:26px;">
        <table role="presentation" align="center" style="border-collapse:collapse;margin:0 auto 10px;">
          <tr><td style="width:52px;height:52px;background:#FFF1F3;border-radius:50%;text-align:center;vertical-align:middle;padding:13px;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="#FF385C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </td></tr>
        </table>
        <p style="color:#FF385C;font-weight:bold;font-size:17px;margin:0 0 6px;">طلب حجز جديد</p>
        <p style="color:#555;font-size:14px;margin:0;">وصلك طلب حجز على <strong style="color:#181818;">${venue_name}</strong></p>
      </div>

      ${iconRow(ICON.person, 'اسم العميل',   client_name,          true)}
      ${iconRow(ICON.phone,  'رقم الجوال',   client_phone,         false, true)}
      ${iconRow(ICON.cal,    'تاريخ الدخول', formatDate(check_in))}
      ${iconRow(ICON.cal,    'تاريخ الخروج', formatDate(check_out))}
      ${notesRow}

      <div style="text-align:center;margin:24px 0 20px;">
        <a href="https://www.aqacloud.com/venue/bookings"
          style="display:inline-block;background:#FF385C;color:#fff;text-decoration:none;font-weight:bold;font-size:15px;padding:14px 36px;border-radius:14px;">
          عرض الحجوزات في لوحة التحكم
        </a>
      </div>

      <hr style="border:none;border-top:1px solid #f0f0f0;margin:0 0 14px;" />
      <p style="color:#bbb;font-size:12px;text-align:center;margin:0;">© عقار كلاود · منصة إدارة الشاليهات والعقارات</p>
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
