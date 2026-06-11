import React from 'react';
import { Loader2, CalendarDays, CheckCircle2, AlertCircle, X } from 'lucide-react';
import VenueCalendar from './VenueCalendar';

export default function BookingSheet({
  open, onClose,
  accent, venueName,
  bookingForm, setBookingForm,
  bookingDone, setBookingDone,
  bookedDates,
  handleBook,
  isPending,
  dark = false,
}) {
  if (!open) return null;

  const today = new Date().toLocaleDateString('ar-SA', { day: 'numeric', month: 'long' });

  // ألوان حسب الثيم
  const bg        = dark ? '#0f172a' : '#ffffff';
  const headerBg  = dark ? '#0f172a' : '#ffffff';
  const inputBg   = dark ? '#1e293b' : '#f9fafb';
  const inputBorder = dark ? '#334155' : '#e5e7eb';
  const textColor = dark ? '#f1f5f9' : '#111111';
  const labelColor= dark ? '#94a3b8' : '#6b7280';
  const closeBg   = dark ? '#1e293b' : '#f3f4f6';
  const closeColor= dark ? '#94a3b8' : '#666666';

  const hasConflict = bookingForm.check_in && bookingForm.check_out && (() => {
    const s = new Set(bookedDates);
    let c = new Date(bookingForm.check_in);
    const e = new Date(bookingForm.check_out);
    while (c <= e) {
      if (s.has(c.toISOString().split('T')[0])) return true;
      c.setDate(c.getDate() + 1);
    }
    return false;
  })();

  const close = () => { onClose(); setBookingDone(false); };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', fontFamily: "'Tajawal', sans-serif" }}>
      {/* خلفية */}
      <div onClick={close} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />

      {/* النافذة */}
      <div dir="rtl" style={{
        position: 'relative', width: '100%', maxWidth: '420px', maxHeight: '80vh',
        overflowY: 'auto', background: bg,
        borderRadius: '24px 24px 0 0',
        boxShadow: dark ? `0 -8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${accent}30` : '0 -8px 40px rgba(0,0,0,0.15)',
        WebkitOverflowScrolling: 'touch',
      }}>
        {/* رأس */}
        <div style={{ position: 'sticky', top: 0, background: headerBg, zIndex: 10, padding: '16px 20px 12px', borderBottom: `2px solid ${accent}30` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarDays size={16} color={dark ? '#0f172a' : '#fff'} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: textColor }}>{venueName}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: accent }}>طلب حجز إقامة</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: labelColor, borderRight: `2px solid ${accent}`, paddingRight: 8 }}>{today}</span>
              <button onClick={close} style={{ width: 28, height: 28, borderRadius: '50%', background: closeBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={14} color={closeColor} />
              </button>
            </div>
          </div>
        </div>

        {bookingDone ? (
          <div style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <CheckCircle2 size={28} color={accent} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 900, color: textColor, marginBottom: 6 }}>تم إرسال الطلب!</div>
            <div style={{ fontSize: 13, color: labelColor, fontWeight: 700, marginBottom: 20 }}>سيتواصل معك صاحب الشاليه قريباً</div>
            <button onClick={close} style={{ width: '100%', height: 44, borderRadius: 12, background: accent, color: dark ? '#0f172a' : '#fff', fontWeight: 900, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: "'Tajawal', sans-serif" }}>
              حسناً، شكراً
            </button>
          </div>
        ) : (
          <div style={{ padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

            {hasConflict && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <AlertCircle size={14} color="#ef4444" style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#dc2626' }}>الفترة المختارة تحتوي على أيام محجوزة، يرجى اختيار تواريخ أخرى.</span>
              </div>
            )}

            {/* الاسم */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: labelColor, marginBottom: 6 }}>الاسم الكريم <span style={{ color: '#f87171' }}>*</span></label>
              <input
                style={{ width: '100%', height: 44, borderRadius: 12, border: `2px solid ${inputBorder}`, background: inputBg, padding: '0 12px', fontSize: 14, fontWeight: 700, color: textColor, outline: 'none', boxSizing: 'border-box', fontFamily: "'Tajawal', sans-serif" }}
                onFocus={e => e.target.style.borderColor = accent}
                onBlur={e => e.target.style.borderColor = inputBorder}
                value={bookingForm.client_name}
                onChange={e => setBookingForm(p => ({ ...p, client_name: e.target.value }))}
                placeholder="الاسم الثلاثي"
              />
            </div>

            {/* الجوال */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: labelColor, marginBottom: 6 }}>رقم الجوال <span style={{ color: '#f87171' }}>*</span></label>
              <input
                dir="ltr"
                style={{ width: '100%', height: 44, borderRadius: 12, border: `2px solid ${inputBorder}`, background: inputBg, padding: '0 12px', fontSize: 14, fontWeight: 700, color: textColor, outline: 'none', boxSizing: 'border-box', fontFamily: "'Tajawal', sans-serif" }}
                onFocus={e => e.target.style.borderColor = accent}
                onBlur={e => e.target.style.borderColor = inputBorder}
                value={bookingForm.client_phone}
                onChange={e => setBookingForm(p => ({ ...p, client_phone: e.target.value }))}
                placeholder="05xxxxxxxx"
              />
            </div>

            {/* التواريخ */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: labelColor, marginBottom: 6 }}>فترة الإقامة <span style={{ color: '#f87171' }}>*</span></label>
              {(bookingForm.check_in && bookingForm.check_out) ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 12, border: `2px solid ${accent}50`, background: inputBg, padding: '10px 14px' }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: textColor }}>{bookingForm.check_in} ← {bookingForm.check_out}</span>
                  <button onClick={() => setBookingForm(p => ({ ...p, check_in: '', check_out: '' }))}
                    style={{ fontSize: 11, fontWeight: 700, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}>تغيير</button>
                </div>
              ) : (
                <div style={{ border: `2px solid ${inputBorder}`, borderRadius: 12, padding: 8, background: inputBg }}>
                  <VenueCalendar bookedDates={bookedDates} onRangeSelect={(start, end) => setBookingForm(p => ({ ...p, check_in: start, check_out: end }))} readOnly={false} accent={accent} />
                </div>
              )}
            </div>

            {/* ملاحظات */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: labelColor, marginBottom: 6 }}>ملاحظات <span style={{ color: dark ? '#475569' : '#d1d5db' }}>(اختياري)</span></label>
              <textarea
                style={{ width: '100%', borderRadius: 12, border: `2px solid ${inputBorder}`, background: inputBg, padding: '10px 12px', fontSize: 13, fontWeight: 600, color: textColor, outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: "'Tajawal', sans-serif" }}
                onFocus={e => e.target.style.borderColor = accent}
                onBlur={e => e.target.style.borderColor = inputBorder}
                value={bookingForm.notes}
                onChange={e => setBookingForm(p => ({ ...p, notes: e.target.value }))}
                placeholder="أي طلبات خاصة..." rows={2}
              />
            </div>

            {/* زر الإرسال */}
            <button
              onClick={handleBook}
              disabled={isPending || !bookingForm.client_name || !bookingForm.client_phone || !bookingForm.check_in || !bookingForm.check_out}
              style={{
                width: '100%', height: 48, borderRadius: 14, background: accent,
                color: dark ? '#0f172a' : '#fff', fontWeight: 900, fontSize: 15,
                border: 'none', cursor: 'pointer', fontFamily: "'Tajawal', sans-serif",
                opacity: (isPending || !bookingForm.client_name || !bookingForm.client_phone || !bookingForm.check_in || !bookingForm.check_out) ? 0.5 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {isPending ? <><Loader2 size={16} className="animate-spin" /> جاري الإرسال...</> : 'تأكيد إرسال الطلب'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: accent }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: labelColor, letterSpacing: 2 }}>Powered by Aqar Cloud</span>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: accent }} />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
