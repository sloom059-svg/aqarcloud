import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Loader2, Plus, X, CheckCircle,
  Bell, Wallet, LogOut, User, Calendar,
  ChevronDown, ChevronRight, Phone,
  Edit3, Inbox, Clock, CheckCircle2, XCircle, Calendar as CalendarIcon
} from 'lucide-react';
import VenueCalendar from '@/components/venue/VenueCalendar';

// ── أيقونات SVG ──
const EditIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);
const DeleteIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M10 11v6" /><path d="M14 11v6" />
  </svg>
);
const PinIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconWa = ({ className }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>;
const IconLock = ({ className }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className || "w-4 h-4"}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>;
const IconCheck = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12" /></svg>;
const IconXSm = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;

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

const STATUS_MAP = {
  'جديد':      { border: 'bg-blue-500',    select: 'bg-blue-50 text-blue-700 border-blue-200',         statBg: 'bg-blue-50',    statText: 'text-blue-600',    statIcon: Inbox },
  'بالانتظار': { border: 'bg-amber-500',   select: 'bg-amber-50 text-amber-700 border-amber-200',       statBg: 'bg-amber-50',   statText: 'text-amber-500',   statIcon: Clock },
  'مؤكد':      { border: 'bg-emerald-500', select: 'bg-emerald-50 text-emerald-700 border-emerald-200', statBg: 'bg-emerald-50', statText: 'text-emerald-600', statIcon: CheckCircle2 },
  'ملغي':      { border: 'bg-rose-500',    select: 'bg-rose-50 text-rose-700 border-rose-200',          statBg: 'bg-rose-50',    statText: 'text-rose-500',    statIcon: XCircle },
};

const EMPTY_MANUAL = { client_name: '', client_phone: '', check_in: '', check_out: '', notes: '' };

// ── Dropdown الملف الشخصي / الخروج ──
function ProfileMenu({ onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-all text-white/90 hover:text-white flex items-center gap-1"
        title="القائمة"
      >
        <LogOut className="w-4 h-4" />
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium">
            <User className="w-4 h-4 text-[#15317E]" /> الملف الشخصي
          </Link>
          <div className="h-px bg-slate-100" />
          <button onClick={() => { setOpen(false); onLogout(); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-medium">
            <LogOut className="w-4 h-4" /> تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
}

export default function VenueBookings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, logout } = useAuth();

  const [toastMessage, setToastMessage] = useState('');
  const [showRevenue, setShowRevenue]   = useState(false);
  const [showNotifs, setShowNotifs]     = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showManual, setShowManual]     = useState(false);
  const [manualForm, setManualForm]     = useState(EMPTY_MANUAL);
  const [editBooking, setEditBooking]   = useState(null);
  const [editForm, setEditForm]         = useState({ client_name: '', client_phone: '', check_in: '', check_out: '' });
  const [editConflict, setEditConflict] = useState(false);

  const revenueRef = useRef(null);
  const notifsRef  = useRef(null);

  // إغلاق الـ dropdowns عند الضغط خارجها
  useEffect(() => {
    const handler = (e) => {
      if (revenueRef.current && !revenueRef.current.contains(e.target)) setShowRevenue(false);
      if (notifsRef.current  && !notifsRef.current.contains(e.target))  setShowNotifs(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const showToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(''), 3000); };
  const handleLogout = async () => { await logout(false); navigate('/login'); };

  // ── Queries ──
  const { data: venue } = useQuery({
    queryKey: ['venue-single', id],
    queryFn: () => base44.entities.Venue.filter({ id }).then(r => r[0]),
  });

  const { data: allBookings = [], isLoading } = useQuery({
    queryKey: ['venue-bookings', id],
    queryFn: () => base44.entities.Booking.filter({ venue_id: id }, '-created_date'),
  });

  // كل حجوزات المالك للإشعارات والإيرادات
  const { data: ownerBookings = [] } = useQuery({
    queryKey: ['bookings-all', user?.id],
    queryFn: () => base44.entities.Booking.filter({ owner_id: user?.id }),
    enabled: !!user?.id,
  });

  const { data: venues = [] } = useQuery({
    queryKey: ['venues', user?.id],
    queryFn: () => base44.entities.Venue.filter({ owner_id: user?.id }, '-created_date'),
    enabled: !!user?.id,
  });

  // فلتر الحجوزات (آخر 30 يوم)
  const bookings = allBookings.filter(b => {
    if (!b.check_out) return true;
    const checkout = new Date(b.check_out);
    if (isNaN(checkout)) return true;
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - 30);
    return checkout >= cutoff;
  });

  // إيرادات الشهر
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear  = now.getFullYear();
  const isThisMonth = (b) => {
    const d = b.check_in ? new Date(b.check_in) : (b.created_date ? new Date(b.created_date) : null);
    return d && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  };
  const venuePrice = (venueId) => { const v = venues.find(x => x.id === venueId); return v?.price_weekend || 0; };
  const monthlyRevenue = ownerBookings
    .filter(b => b.status === 'مؤكد' && isThisMonth(b))
    .reduce((sum, b) => sum + (b.total_price ? Number(b.total_price) : venuePrice(b.venue_id)), 0);

  // الإشعارات
  const newBookings = ownerBookings.filter(b => b.status === 'جديد');
  const hasNotifications = newBookings.length > 0;

  // ── Mutations ──
  const updateMutation = useMutation({
    mutationFn: ({ bookingId, data }) => base44.entities.Booking.update(bookingId, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['venue-bookings', id] }); showToast('تم تحديث حالة الحجز بنجاح!'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (bookingId) => base44.entities.Booking.delete(bookingId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['venue-bookings', id] }); setConfirmDelete(null); showToast('تم حذف الحجز بنجاح!'); },
  });

  const addBookingMutation = useMutation({
    mutationFn: (data) => base44.entities.Booking.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['venue-bookings', id] }); setShowManual(false); setManualForm(EMPTY_MANUAL); showToast('تم إضافة الحجز اليدوي بنجاح!'); },
  });

  const bookedDates = bookings
    .filter(b => b.status === 'مؤكد' || b.status === 'بالانتظار')
    .flatMap(b => {
      const dates = []; let cur = new Date(b.check_in); const end = new Date(b.check_out);
      while (cur <= end) { dates.push(cur.toISOString().split('T')[0]); cur.setDate(cur.getDate() + 1); }
      return dates;
    });

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualForm.client_name || !manualForm.client_phone || !manualForm.check_in || !manualForm.check_out) return;
    addBookingMutation.mutate({ ...manualForm, venue_id: id, venue_name: venue?.name || '', status: 'مؤكد', owner_id: venue?.owner_id, is_manual: true });
  };

  const openEdit = (booking) => {
    setEditBooking(booking.id);
    setEditForm({ client_name: booking.client_name, client_phone: booking.client_phone, check_in: booking.check_in, check_out: booking.check_out });
    setEditConflict(false);
  };

  const checkConflict = (check_in, check_out, currentId) => {
    if (!check_in || !check_out) return false;
    const otherBooked = bookings.filter(b => b.id !== currentId && (b.status === 'مؤكد' || b.status === 'بالانتظار'))
      .flatMap(b => { const dates = []; let cur = new Date(b.check_in); const end = new Date(b.check_out); while (cur <= end) { dates.push(cur.toISOString().split('T')[0]); cur.setDate(cur.getDate() + 1); } return dates; });
    const otherSet = new Set(otherBooked);
    let cur = new Date(check_in); const end = new Date(check_out);
    while (cur <= end) { if (otherSet.has(cur.toISOString().split('T')[0])) return true; cur.setDate(cur.getDate() + 1); }
    return false;
  };

  const handleEditFormChange = (field, value) => {
    const updated = { ...editForm, [field]: value };
    setEditForm(updated);
    if (updated.check_in && updated.check_out) setEditConflict(checkConflict(updated.check_in, updated.check_out, editBooking));
  };

  const handleEditSave = () => {
    if (editConflict) return;
    updateMutation.mutate({ bookingId: editBooking, data: editForm });
    setEditBooking(null);
    showToast('تم تعديل تفاصيل الحجز بنجاح!');
  };

  const statusOrder = ['جديد', 'بالانتظار', 'مؤكد', 'ملغي'];

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] font-sans pb-20 relative">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
      `}} />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[150] bg-[#15317E] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#0d1e4c]">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Modal تعديل */}
      {editBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditBooking(null)}>
          <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-[#15317E] flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> تعديل تفاصيل الحجز
              </h3>
              <button onClick={() => setEditBooking(null)} className="p-1.5 bg-slate-200 text-slate-500 rounded-full hover:bg-slate-300"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">اسم العميل</Label>
                <Input value={editForm.client_name} onChange={e => handleEditFormChange('client_name', e.target.value)} className="h-11 rounded-xl text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">رقم الجوال</Label>
                <Input value={editForm.client_phone} onChange={e => handleEditFormChange('client_phone', e.target.value)} className="h-11 rounded-xl text-sm" dir="ltr" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500">تاريخ الدخول</Label>
                  <Input type="date" value={editForm.check_in} onChange={e => handleEditFormChange('check_in', e.target.value)} className="h-11 rounded-xl text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500">تاريخ الخروج</Label>
                  <Input type="date" value={editForm.check_out} onChange={e => handleEditFormChange('check_out', e.target.value)} className="h-11 rounded-xl text-sm" />
                </div>
              </div>
              {editConflict && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                  <span className="text-xs text-red-700 font-bold">الفترة المختارة تتعارض مع حجز موجود.</span>
                </div>
              )}
            </div>
            <div className="flex gap-2 px-5 pb-5">
              <Button onClick={handleEditSave} disabled={updateMutation.isPending || editConflict} className="flex-1 h-11 text-sm font-bold bg-[#15317E] hover:bg-[#0d1e4c] text-white rounded-xl">
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'حفظ التعديلات'}
              </Button>
              <button onClick={() => setEditBooking(null)} className="px-4 h-11 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal حجز يدوي */}
      {showManual && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowManual(false)}>
          <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-[#15317E] flex items-center gap-2">
                <div className="bg-[#15317E]/10 p-1.5 rounded-lg"><Plus className="w-4 h-4 text-[#15317E]" /></div>
                إضافة حجز يدوي
              </h3>
              <button onClick={() => { setShowManual(false); setManualForm(EMPTY_MANUAL); }} className="p-1.5 bg-slate-200 text-slate-500 rounded-full hover:bg-slate-300"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleManualSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">اسم العميل *</Label>
                <Input value={manualForm.client_name} onChange={e => setManualForm(p => ({ ...p, client_name: e.target.value }))} placeholder="محمد عبدالله" required className="h-11 rounded-xl text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">رقم الجوال *</Label>
                <Input value={manualForm.client_phone} dir="ltr" onChange={e => setManualForm(p => ({ ...p, client_phone: e.target.value }))} placeholder="05xxxxxxxx" required className="h-11 rounded-xl text-sm" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500">تاريخ الدخول *</Label>
                  <Input type="date" value={manualForm.check_in} onChange={e => setManualForm(p => ({ ...p, check_in: e.target.value }))} required className="h-11 rounded-xl text-sm" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500">تاريخ الخروج *</Label>
                  <Input type="date" value={manualForm.check_out} onChange={e => setManualForm(p => ({ ...p, check_out: e.target.value }))} required className="h-11 rounded-xl text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">ملاحظات (اختياري)</Label>
                <Input value={manualForm.notes} onChange={e => setManualForm(p => ({ ...p, notes: e.target.value }))} placeholder="أي تفاصيل إضافية..." className="h-11 rounded-xl text-sm" />
              </div>
              <Button type="submit" disabled={addBookingMutation.isPending} className="w-full h-11 rounded-xl font-bold bg-[#15317E] hover:bg-[#0d1e4c] text-white text-sm">
                {addBookingMutation.isPending ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" />جاري الحفظ...</> : 'تأكيد الحجز'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* الخلفية الزرقاء العلوية */}
      <div className="absolute top-0 left-0 right-0 h-[220px] bg-[#15317E] rounded-b-[2.5rem] shadow-lg" />

      <div className="relative z-10 max-w-md mx-auto">

        {/* ═══════════════════════════════════════
            الهيدر — نفس لوحة التحكم بالضبط
        ═══════════════════════════════════════ */}
        <header className="px-5 pt-8 pb-6 flex items-center justify-between text-white">

          {/* يسار: صورة المالك + رجوع + اسم الصفحة */}
          <div className="flex items-center gap-3">
            {/* زر رجوع */}
            <button
              onClick={() => navigate('/venue')}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all"
              title="رجوع"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* الشعار / الحرف الأول */}
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full border-2 border-white/30 bg-white/10 overflow-hidden flex items-center justify-center shadow-lg">
                {user?.office_logo_url ? (
                  <img src={user.office_logo_url} alt="شعار" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-white">
                    {(user?.full_name || user?.office_name || 'م')[0]}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#15317E] rounded-full" />
            </div>

            {/* العنوان */}
            <div>
              <h1 className="text-base font-bold leading-tight">إدارة الحجوزات</h1>
              {venue && <p className="text-[11px] text-white/70 mt-0.5">{venue.name}</p>}
            </div>
          </div>

          {/* يمين: الإشعارات + المحفظة + الخروج */}
          <div className="flex items-center gap-2">

            {/* الإشعارات */}
            <div className="relative" ref={notifsRef}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className={`relative p-2.5 rounded-xl backdrop-blur-md transition-all ${showNotifs ? 'bg-white text-[#15317E]' : 'bg-white/10 hover:bg-white/20 text-white/90 hover:text-white'}`}
                title="الإشعارات"
              >
                <Bell className="w-4 h-4" />
                {hasNotifications && (
                  <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                )}
              </button>
              {showNotifs && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 bg-[#15317E] text-white flex items-center justify-between">
                    <span className="text-sm font-bold">الإشعارات</span>
                    {hasNotifications && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">{newBookings.length}</span>}
                  </div>
                  {newBookings.length === 0 ? (
                    <div className="px-4 py-6 text-center"><p className="text-sm text-slate-400">لا توجد إشعارات جديدة</p></div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto">
                      {newBookings.map(b => {
                        const v = venues.find(x => x.id === b.venue_id);
                        return (
                          <Link key={b.id} to={`/venue/bookings/${b.venue_id}`} onClick={() => setShowNotifs(false)}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                            <div className="w-9 h-9 rounded-xl bg-[#15317E]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Calendar className="w-4 h-4 text-[#15317E]" />
                            </div>
                            <div className="flex-1 min-w-0 text-right">
                              <p className="text-sm font-bold text-slate-700">حجز جديد</p>
                              <p className="text-xs text-slate-500 truncate">{b.client_name || 'عميل'} — {v?.name || 'شاليه'}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* المحفظة / الإيرادات */}
            <div className="relative" ref={revenueRef}>
              <button
                onClick={() => setShowRevenue(!showRevenue)}
                className={`p-2.5 rounded-xl backdrop-blur-md transition-all ${showRevenue ? 'bg-white text-[#15317E]' : 'bg-white/10 hover:bg-white/20 text-white/90'}`}
                title="إيرادات الشهر"
              >
                <Wallet className="w-4 h-4" />
              </button>
              {showRevenue && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 text-center animate-in fade-in slide-in-from-top-2">
                  <p className="text-[11px] text-slate-500 font-medium mb-1">إيرادات الشهر (الحجوزات المؤكدة)</p>
                  <p className="text-xl font-bold text-[#15317E]" dir="ltr">
                    {monthlyRevenue.toLocaleString('en-US')} <span className="text-[10px] font-normal text-slate-400">ر.س</span>
                  </p>
                </div>
              )}
            </div>

            {/* زر الخروج */}
            <ProfileMenu onLogout={handleLogout} />
          </div>
        </header>

        {/* ═══════════════════════════════════════
            المحتوى
        ═══════════════════════════════════════ */}
        <div className="px-4 space-y-6">

          {/* كروت الإحصائيات */}
          <div className="flex gap-2">
            {statusOrder.map(s => {
              const count = bookings.filter(b => b.status === s).length;
              const cfg = STATUS_MAP[s];
              const Icon = cfg.statIcon;
              return (
                <div key={s} className="flex-1 bg-white rounded-2xl py-2 px-1 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-0.5">
                  <div className={`p-1 ${cfg.statBg} rounded-lg`}><Icon className={`w-3.5 h-3.5 ${cfg.statText}`} /></div>
                  <p className={`text-base font-black leading-none mt-0.5 ${cfg.statText}`}>{count}</p>
                  <p className="text-[10px] font-bold text-slate-500">{s}</p>
                </div>
              );
            })}
          </div>

          {/* التقويم */}
          <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-[#15317E] flex items-center gap-2 mb-4">
              <CalendarIcon className="w-4 h-4 text-[#15317E]/70" />
              التقويم والإتاحة
            </h3>
            <VenueCalendar bookedDates={bookedDates} onRangeSelect={null} readOnly={true} venueName={venue?.name || ''} />
          </div>

          {/* عنوان القائمة + زر حجز يدوي */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#15317E]">الحجوزات</h3>
            <button
              onClick={() => setShowManual(true)}
              className="flex items-center gap-1.5 bg-white text-[#15317E] px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> حجز يدوي
            </button>
          </div>

          {/* قائمة الحجوزات */}
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[#15317E]" /></div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 text-slate-400 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm">
              <p className="font-bold text-base">لا توجد حجوزات حالياً</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => {
                const cfg = STATUS_MAP[booking.status] || STATUS_MAP['جديد'];
                const isDeleting    = confirmDelete === booking.id;
                const isManualBlock = booking.client_phone === '000';

                return (
                  <div key={booking.id} className="bg-white rounded-[1.2rem] p-3 shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-1 h-full ${cfg.border}`} />

                    <div className="flex justify-between items-start mb-3 pl-1 pr-2">
                      {/* معلومات العميل */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {!isManualBlock ? (
                            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                              <PinIcon className="w-3.5 h-3.5 text-slate-400" />{booking.client_name}
                            </h4>
                          ) : (
                            <h4 className="text-sm font-bold text-slate-600 flex items-center gap-1">
                              <IconLock className="w-3.5 h-3.5" /> إغلاق يدوي
                            </h4>
                          )}
                        </div>
                        {!isManualBlock && booking.client_phone && booking.client_phone !== '000' && (
                          <div className="flex items-center gap-2">
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span dir="ltr">{booking.client_phone}</span>
                            </p>
                            <a href={`https://wa.me/${formatWhatsApp(booking.client_phone)}?text=${encodeURIComponent(`مرحباً ${booking.client_name}، نتواصل معك بخصوص حجزك...`)}`}
                              target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-medium transition-colors">
                              <IconWa className="w-3 h-3" /> مراسلة
                            </a>
                          </div>
                        )}
                        {booking.notes && !isManualBlock && (
                          <div className="text-xs text-slate-500 bg-slate-50 rounded-lg px-2.5 py-1 mt-1 border border-slate-100 inline-block">{booking.notes}</div>
                        )}
                      </div>

                      {/* الأزرار اليمين */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="relative">
                          <select
                            value={booking.status}
                            onChange={(e) => updateMutation.mutate({ bookingId: booking.id, data: { status: e.target.value } })}
                            className={`appearance-none pl-6 pr-2 py-1 rounded-lg text-[11px] font-bold border outline-none cursor-pointer transition-colors ${cfg.select}`}
                          >
                            <option value="جديد">جديد</option>
                            <option value="بالانتظار">بالانتظار</option>
                            <option value="مؤكد">مؤكد</option>
                            <option value="ملغي">ملغي</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute left-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                        </div>
                        <div className="flex items-center gap-1">
                          {!isManualBlock && (
                            <button onClick={() => openEdit(booking)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="تعديل">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => setConfirmDelete(booking.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="حذف">
                            <DeleteIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* شريط التواريخ */}
                    <div className="flex items-center justify-between bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 mx-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDateAr(booking.check_in)} ← {formatDateAr(booking.check_out)}</span>
                      </div>
                      <div className="w-px h-3 bg-slate-200" />
                      <div className="text-[11px] text-[#15317E] font-bold">
                        {booking.price ? `${booking.price} ر.س` : '—'}
                      </div>
                    </div>

                    {/* أزرار تأكيد / إلغاء / حذف */}
                    <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-slate-50">
                      {isDeleting ? (
                        <div className="flex items-center gap-2 w-full bg-red-50 p-2.5 rounded-xl border border-red-100">
                          <span className="text-xs text-red-800 font-bold ml-auto">تأكيد الحذف؟</span>
                          <button onClick={() => deleteMutation.mutate(booking.id)} disabled={deleteMutation.isPending}
                            className="flex items-center gap-1 text-xs font-bold text-white bg-red-600 rounded-lg px-3 py-1.5 hover:bg-red-700 transition">
                            {deleteMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'نعم، احذف'}
                          </button>
                          <button onClick={() => setConfirmDelete(null)} className="text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition">تراجع</button>
                        </div>
                      ) : !isManualBlock ? (
                        <>
                          {booking.status !== 'مؤكد' && booking.status !== 'ملغي' && (
                            <button onClick={() => updateMutation.mutate({ bookingId: booking.id, data: { status: 'مؤكد' } })}
                              className="flex items-center gap-1 text-xs font-bold text-white bg-[#15317E] border border-[#15317E] rounded-xl px-4 py-1.5 hover:bg-[#0d1e4c] transition shadow-sm">
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
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
