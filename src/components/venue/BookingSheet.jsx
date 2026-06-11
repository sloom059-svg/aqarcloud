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
}) {
  if (!open) return null;

  const today = new Date().toLocaleDateString('ar-SA', { day: 'numeric', month: 'long' });

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
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', fontFamily: "'Tajawal', sans-serif" }}
    >
      {/* خلفية */}
      <div
        onClick={close}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      />

      {/* النافذة */}
      <div
        dir="rtl"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          maxHeight: '80vh',
          overflowY: 'auto',
          background: '#fff',
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* رأس ثابت */}
        <div style={{
          position: 'sticky', top: 0, background: '#fff', zIndex: 10,
          padding: '16px 20px 12px',
          borderBottom: `2px solid ${accent}20`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarDays size={16} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: '#111' }}>{venueName}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: accent }}>طلب حجز إقامة</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#aaa', borderRight: `2px solid ${accent}`, paddingRight: 8 }}>{today}</span>
              <button onClick={close}
                style={{ width: 28, height: 28, borderRadius: '50%', background: '#f3f4f6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={14} color="#666" />
              </button>
            </div>
          </div>
        </div>

        {/* محتوى */}
        {bookingDone ? (
          <div style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <CheckCircle2 size={28} color={accent} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 900, color: '#111', marginBottom: 6 }}>تم إرسال الطلب!</div>
            <div style={{ fontSize: 13, color: '#999', fontWeight: 700, marginBottom: 20 }}>سيتواصل معك صاحب الشاليه قريباً</div>
            <button onClick={close}
              style={{ width: '100%', height: 44, borderRadius: 12, background: accent, color: '#fff', fontWeight: 900, fontSize: 14, border: 'none', cursor: 'pointer' }}>
              حسناً، شكراً
            </button>
          </div>
        ) : (
          <div style={{ padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* تحذير */}
            {hasConflict && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <AlertCircle size={14} color="#ef4444" style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#dc2626' }}>الفترة المختارة تحتوي على أيام محجوزة، يرجى اختيار تواريخ أخرى.</span>
              </div>
            )}

            {/* الاسم */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#6b7280', marginBottom: 6 }}>
                الاسم الكريم <span style={{ color: '#f87171' }}>*</span>
              </label>
              <input
                style={{ width: '100%', height: 44, borderRadius: 12, border: '2px solid #e5e7eb', background: '#f9fafb', padding: '0 12px', fontSize: 14, fontWeight: 700, color: '#111', outline: 'none', boxSizing: 'border-box', fontFamily: "'Tajawal', sans-serif" }}
                onFocus={e => e.target.style.borderColor = accent}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                value={bookingForm.client_name}
                onChange={e => setBookingForm(p => ({ ...p, client_name: e.target.value }))}
                placeholder="الاسم الثلاثي"
              />
            </div>

            {/* الجوال */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#6b7280', marginBottom: 6 }}>
                رقم الجوال <span style={{ color: '#f87171' }}>*</span>
              </label>
              <input
                dir="ltr"
                style={{ width: '100%', height: 44, borderRadius: 12, border: '2px solid #e5e7eb', background: '#f9fafb', padding: '0 12px', fontSize: 14, fontWeight: 700, color: '#111', outline: 'none', boxSizing: 'border-box', fontFamily: "'Tajawal', sans-serif" }}
                onFocus={e => e.target.style.borderColor = accent}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                value={bookingForm.client_phone}
                onChange={e => setBookingForm(p => ({ ...p, client_phone: e.target.value }))}
                placeholder="05xxxxxxxx"
              />
            </div>

            {/* التواريخ */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#6b7280', marginBottom: 6 }}>
                فترة الإقامة <span style={{ color: '#f87171' }}>*</span>
              </label>
              {(bookingForm.check_in && bookingForm.check_out) ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 12, border: `2px solid ${accent}50`, background: '#f9fafb', padding: '10px 14px' }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: '#111' }}>{bookingForm.check_in} ← {bookingForm.check_out}</span>
                  <button onClick={() => setBookingForm(p => ({ ...p, check_in: '', check_out: '' }))}
                    style={{ fontSize: 11, fontWeight: 700, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}>تغيير</button>
                </div>
              ) : (
                <div style={{ border: '2px solid #e5e7eb', borderRadius: 12, padding: 8, background: '#f9fafb' }}>
                  <VenueCalendar
                    bookedDates={bookedDates}
                    onRangeSelect={(start, end) => setBookingForm(p => ({ ...p, check_in: start, check_out: end }))}
                    readOnly={false}
                    accent={accent}
                  />
                </div>
              )}
            </div>

            {/* ملاحظات */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#6b7280', marginBottom: 6 }}>
                ملاحظات <span style={{ color: '#d1d5db' }}>(اختياري)</span>
              </label>
              <textarea
                style={{ width: '100%', borderRadius: 12, border: '2px solid #e5e7eb', background: '#f9fafb', padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#111', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: "'Tajawal', sans-serif" }}
                onFocus={e => e.target.style.borderColor = accent}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                value={bookingForm.notes}
                onChange={e => setBookingForm(p => ({ ...p, notes: e.target.value }))}
                placeholder="أي طلبات خاصة..."
                rows={2}
              />
            </div>

            {/* زر الإرسال */}
            <button
              onClick={handleBook}
              disabled={isPending || !bookingForm.client_name || !bookingForm.client_phone || !bookingForm.check_in || !bookingForm.check_out}
              style={{
                width: '100%', height: 48, borderRadius: 14, background: accent,
                color: '#fff', fontWeight: 900, fontSize: 15, border: 'none',
                cursor: 'pointer', opacity: (isPending || !bookingForm.client_name || !bookingForm.client_phone || !bookingForm.check_in || !bookingForm.check_out) ? 0.5 : 1,
                fontFamily: "'Tajawal', sans-serif",
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {isPending ? <><Loader2 size={16} className="animate-spin" /> جاري الإرسال...</> : 'تأكيد إرسال الطلب'}
            </button>

            {/* فوتر */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: accent }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#d1d5db', letterSpacing: 2 }}>Powered by Aqar Cloud</span>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: accent }} />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
