import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, X } from 'lucide-react';
import VenueCalendar from '@/components/venue/VenueCalendar';

// ── أيقونات SVG ──
const EditIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const DeleteIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

const PinIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconArrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const IconCheck = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>;
const IconXSm = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconWa = ({ className }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>;
const IconLock = ({ className }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className || "w-4 h-4"}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;

const IconNewBadge = ({ className }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const IconWaitBadge = ({ className }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>;
const IconConfirmBadge = ({ className }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>;
const IconCancelBadge = ({ className }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>;

const STATUS_CONFIG = {
  'جديد':      { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200',    Icon: IconNewBadge },
  'بالانتظار': { bg: 'bg-amber-50',   text: 'text-amber-500',   border: 'border-amber-200',   Icon: IconWaitBadge },
  'مؤكد':      { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', Icon: IconConfirmBadge },
  'ملغي':      { bg: 'bg-red-50',     text: 'text-red-500',     border: 'border-red-200',     Icon: IconCancelBadge },
};

const ARABIC_MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

const formatDateAr = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getDate()} ${ARABIC_MONTHS[d.getMonth()]}`;
};

const formatWhatsApp = (phone) => {
  if (!phone) return '';
  let p = phone.replace(/\D/g, '');
  if (p.startsWith('05')) return '966' + p.substring(1);
  return p;
};

const EMPTY_MANUAL = { client_name: '', client_phone: '', check_in: '', check_out: '', notes: '' };

export default function VenueBookings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showManual, setShowManual] = useState(false);
  const [manualForm, setManualForm] = useState(EMPTY_MANUAL);
  const [editBooking, setEditBooking] = useState(null);
  const [editForm, setEditForm] = useState({ client_name: '', client_phone: '', check_in: '', check_out: '' });
  const [editConflict, setEditConflict] = useState(false);

  const { data: venue } = useQuery({
    queryKey: ['venue-single', id],
    queryFn: () => base44.entities.Venue.filter({ id }).then(r => r[0]),
  });

  const { data: allBookings = [], isLoading } = useQuery({
    queryKey: ['venue-bookings', id],
    queryFn: () => base44.entities.Booking.filter({ venue_id: id }, '-created_date'),
  });

  const bookings = allBookings.filter(b => {
    if (!b.check_out) return true;
    const checkout = new Date(b.check_out);
    if (isNaN(checkout)) return true;
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - 30);
    return checkout >= cutoff;
  });

  const updateMutation = useMutation({
    mutationFn: ({ bookingId, data }) => base44.entities.Booking.update(bookingId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['venue-bookings', id] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (bookingId) => base44.entities.Booking.delete(bookingId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['venue-bookings', id] }); setConfirmDelete(null); },
  });

  const addBookingMutation = useMutation({
    mutationFn: (data) => base44.entities.Booking.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['venue-bookings', id] });
      setShowManual(false);
      setManualForm(EMPTY_MANUAL);
    },
  });

  const statusOrder = ['جديد', 'بالانتظار', 'مؤكد', 'ملغي'];

  const bookedDates = bookings
    .filter(b => b.status === 'مؤكد' || b.status === 'بالانتظار')
    .flatMap(b => {
      const dates = [];
      let cur = new Date(b.check_in);
      const end = new Date(b.check_out);
      while (cur <= end) { dates.push(cur.toISOString().split('T')[0]); cur.setDate(cur.getDate() + 1); }
      return dates;
    });

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualForm.client_name || !manualForm.client_phone || !manualForm.check_in || !manualForm.check_out) return;
    addBookingMutation.mutate({
      ...manualForm,
      venue_id: id,
      venue_name: venue?.name || '',
      status: 'مؤكد',
      owner_id: venue?.owner_id,
      is_manual: true,
    });
  };

  const openEdit = (booking) => {
    setEditBooking(booking.id);
    setEditForm({ client_name: booking.client_name, client_phone: booking.client_phone, check_in: booking.check_in, check_out: booking.check_out });
    setEditConflict(false);
  };

  const checkConflict = (check_in, check_out, currentId) => {
    if (!check_in || !check_out) return false;
    const otherBooked = bookings
      .filter(b => b.id !== currentId && (b.status === 'مؤكد' || b.status === 'بالانتظار'))
      .flatMap(b => {
        const dates = [];
        let cur = new Date(b.check_in);
        const end = new Date(b.check_out);
        while (cur <= end) { dates.push(cur.toISOString().split('T')[0]); cur.setDate(cur.getDate() + 1); }
        return dates;
      });
    const otherSet = new Set(otherBooked);
    let cur = new Date(check_in);
    const end = new Date(check_out);
    while (cur <= end) {
      if (otherSet.has(cur.toISOString().split('T')[0])) return true;
      cur.setDate(cur.getDate() + 1);
    }
    return false;
  };

  const handleEditFormChange = (field, value) => {
    const updated = { ...editForm, [field]: value };
    setEditForm(updated);
    if (updated.check_in && updated.check_out) {
      setEditConflict(checkConflict(updated.check_in, updated.check_out, editBooking));
    }
  };

  const handleEditSave = () => {
    if (editConflict) return;
    updateMutation.mutate({ bookingId: editBooking, data: editForm });
    setEditBooking(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
        body { font-family: 'Cairo', sans-serif; }
      `}} />

      {/* Modal تعديل */}
      {editBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setEditBooking(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base text-[#1E2F45]">تعديل بيانات الحجز</h3>
              <button onClick={() => setEditBooking(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-600">اسم العميل</Label>
                <Input value={editForm.client_name} onChange={e => handleEditFormChange('client_name', e.target.value)} className="h-11 rounded-xl text-sm" placeholder="مثال: محمد عبدالله" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-600">رقم الجوال</Label>
                <Input value={editForm.client_phone} onChange={e => handleEditFormChange('client_phone', e.target.value)} className="h-11 rounded-xl text-sm" placeholder="05xxxxxxxx" dir="ltr" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">تاريخ الدخول</Label>
                  <Input type="date" value={editForm.check_in} onChange={e => handleEditFormChange('check_in', e.target.value)} className="h-11 rounded-xl text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">تاريخ الخروج</Label>
                  <Input type="date" value={editForm.check_out} onChange={e => handleEditFormChange('check_out', e.target.value)} className="h-11 rounded-xl text-sm" />
                </div>
              </div>
              {editConflict && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-500 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span className="text-xs text-red-700 font-bold">الفترة المختارة تتعارض مع حجز موجود، يرجى اختيار تواريخ أخرى.</span>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-5">
              <Button onClick={handleEditSave} disabled={updateMutation.isPending} className="flex-1 h-10 text-sm font-bold bg-[#1E2F45] hover:bg-[#1E2F45]/90 text-white rounded-xl">
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'حفظ التعديلات'}
              </Button>
              <button onClick={() => setEditBooking(null)} className="px-4 h-10 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full bg-[#1E2F45] text-white py-5 px-4 shadow-md z-10 sticky top-0">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/venue')} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
              <IconArrow />
            </button>
            <div>
              <h1 className="text-lg font-bold tracking-wide">إدارة الحجوزات</h1>
              {venue && <p className="text-xs text-blue-100 opacity-80">{venue.name}</p>}
            </div>
          </div>
          <button
            onClick={() => setShowManual(v => !v)}
            className="flex items-center gap-1.5 bg-white text-[#1E2F45] hover:bg-slate-100 transition-colors rounded-xl px-4 py-2 text-xs font-bold shadow-sm"
          >
            <Plus className="w-4 h-4" /> حجز يدوي
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* الكروت الإحصائية */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {statusOrder.map(s => {
            const count = bookings.filter(b => b.status === s).length;
            const cfg = STATUS_CONFIG[s];
            const StatusIcon = cfg.Icon;
            return (
              <div key={s} className="bg-white rounded-2xl p-3 text-center border border-slate-100 shadow-sm flex flex-col justify-center items-center">
                <StatusIcon className={`w-5 h-5 mb-1.5 ${cfg.text} opacity-80`} />
                <div className={`text-xl font-black leading-none ${cfg.text}`}>{count}</div>
                <div className="text-[9px] md:text-[11px] mt-1 font-bold text-slate-500">{s}</div>
              </div>
            );
          })}
        </div>

        {/* فورم الحجز اليدوي */}
        {showManual && (
          <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] mb-8 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-base text-[#1E2F45]">إضافة حجز يدوي</h2>
              <button onClick={() => { setShowManual(false); setManualForm(EMPTY_MANUAL); }} className="text-slate-400 hover:text-red-500 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleManualSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">اسم العميل *</Label>
                  <Input value={manualForm.client_name} onChange={e => setManualForm(p => ({ ...p, client_name: e.target.value }))} placeholder="مثال: محمد عبدالله" required className="h-11 rounded-xl text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">رقم الجوال *</Label>
                  <Input value={manualForm.client_phone} dir="ltr" onChange={e => setManualForm(p => ({ ...p, client_phone: e.target.value }))} placeholder="05xxxxxxxx" required className="h-11 rounded-xl text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">تاريخ الدخول *</Label>
                  <Input type="date" value={manualForm.check_in} onChange={e => setManualForm(p => ({ ...p, check_in: e.target.value }))} required className="h-11 rounded-xl text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">تاريخ الخروج *</Label>
                  <Input type="date" value={manualForm.check_out} onChange={e => setManualForm(p => ({ ...p, check_out: e.target.value }))} required className="h-11 rounded-xl text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-600">ملاحظات (اختياري)</Label>
                <Input value={manualForm.notes} onChange={e => setManualForm(p => ({ ...p, notes: e.target.value }))} placeholder="أي تفاصيل إضافية..." className="h-11 rounded-xl text-sm" />
              </div>
              <Button type="submit" className="w-full h-11 rounded-xl font-bold bg-[#1E2F45] hover:bg-[#1E2F45]/90 text-white text-sm" disabled={addBookingMutation.isPending}>
                {addBookingMutation.isPending ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" />جاري الحفظ...</> : 'إضافة الحجز'}
              </Button>
            </form>
          </div>
        )}

        {/* التقويم */}
        <div className="bg-white border border-slate-100 rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base text-[#1E2F45]">التقويم والإتاحة</h2>
          </div>
          <VenueCalendar
            bookedDates={bookedDates}
            onRangeSelect={null}
            readOnly={true}
            venueName={venue?.name || ''}
          />
        </div>

        <h2 className="font-bold text-lg text-[#1E2F45] text-center mb-5">الحجوزات القادمة</h2>

        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[#1E2F45]" /></div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm">
            <p className="font-bold text-base">لا توجد حجوزات حالياً</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG['جديد'];
              const isDeleting = confirmDelete === booking.id;
              const isManualBlock = booking.client_phone === '000';

              return (
                <div key={booking.id} className="bg-white border-2 border-slate-100 rounded-[1.5rem] p-4 hover:border-[#1E2F45]/20 transition-all shadow-sm">

                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1.5">
                      <div className="text-[#1E2F45] text-base font-bold tracking-tight">
                        {formatDateAr(booking.check_in)} - {formatDateAr(booking.check_out)}
                      </div>

                      {!isManualBlock ? (
                        <div className="flex flex-col mt-0.5">
                          <div className="flex items-center flex-wrap gap-2 text-slate-600 font-semibold text-sm">
                            <div className="flex items-center gap-1">
                              <PinIcon className="w-3.5 h-3.5 text-slate-400" />
                              {booking.client_name}
                            </div>
                            {booking.client_phone && booking.client_phone !== '000' && (
                              <a
                                href={`https://wa.me/${formatWhatsApp(booking.client_phone)}?text=${encodeURIComponent(`مرحباً ${booking.client_name}، نتواصل معك بخصوص حجزك...`)}`}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs font-bold text-[#1E2F45] bg-slate-100 hover:bg-slate-200 transition-colors px-2 py-1 rounded-lg border border-slate-200"
                              >
                                <IconWa className="w-3.5 h-3.5" /> مراسلة
                              </a>
                            )}
                          </div>
                          {booking.client_phone && booking.client_phone !== '000' && (
                            <div className="text-xs text-slate-400 font-medium mr-[20px] mt-0.5">
                              {booking.client_phone}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm mt-0.5">
                          <IconLock className="w-3.5 h-3.5" /> إغلاق يدوي
                        </div>
                      )}

                      {booking.notes && !isManualBlock && (
                        <div className="text-xs text-slate-500 bg-slate-50 rounded-lg px-2.5 py-1.5 mt-0.5 border border-slate-100 inline-block">
                          {booking.notes}
                        </div>
                      )}
                    </div>

                    {/* الجهة اليسرى */}
                    <div className="flex flex-col items-end gap-2">
                      <span className={`font-bold text-sm flex items-center gap-1 ${cfg.text}`}>
                        <cfg.Icon className="w-4 h-4" />
                        {booking.status}
                      </span>

                      <div className="flex items-center gap-1">
                        {!isManualBlock && (
                          <button onClick={() => openEdit(booking)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="تعديل البيانات">
                            <EditIcon className="w-4 h-4" />
                          </button>
                        )}
                        {!isManualBlock && booking.status !== 'مؤكد' && booking.status !== 'ملغي' && (
                          <button onClick={() => updateMutation.mutate({ bookingId: booking.id, data: { status: 'مؤكد' } })}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="تأكيد الحجز">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>
                          </button>
                        )}
                        <button
                          onClick={() => setConfirmDelete(booking.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="حذف الحجز"
                        >
                          <DeleteIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {(!isManualBlock || isDeleting) && (
                    <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-slate-50">

                      {isDeleting && (
                        <div className="flex items-center gap-2 w-full bg-red-50 p-2.5 rounded-xl border border-red-100">
                          <span className="text-xs text-red-800 font-bold ml-auto">هل أنت متأكد من الحذف؟</span>
                          <button
                            onClick={() => deleteMutation.mutate(booking.id)}
                            disabled={deleteMutation.isPending}
                            className="flex items-center gap-1 text-xs font-bold text-white bg-red-600 rounded-lg px-3 py-1.5 hover:bg-red-700 transition"
                          >
                            {deleteMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'نعم، احذف'}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition"
                          >
                            تراجع
                          </button>
                        </div>
                      )}

                      {!isDeleting && !isManualBlock && (
                        <>
                          {booking.status !== 'مؤكد' && booking.status !== 'ملغي' && (
                            <button onClick={() => updateMutation.mutate({ bookingId: booking.id, data: { status: 'مؤكد' } })}
                              className="flex items-center gap-1 text-xs font-bold text-white bg-[#1E2F45] border border-[#1E2F45] rounded-xl px-4 py-1.5 hover:bg-[#1E2F45]/90 transition shadow-sm">
                              <IconCheck /> تأكيد الحجز
                            </button>
                          )}

                          {booking.status !== 'ملغي' && (
                            <button onClick={() => updateMutation.mutate({ bookingId: booking.id, data: { status: 'ملغي' } })}
                              className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl px-4 py-1.5 hover:bg-slate-50 transition shadow-sm">
                              <IconXSm /> إلغاء الحجز
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}