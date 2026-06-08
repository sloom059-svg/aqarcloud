import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Bell,
  Calendar,
  MapPin,
  CheckCircle,
  Wallet,
  LogOut,
  User,
  Loader2,
  Plus,
  ChevronDown
} from 'lucide-react';

// ────────────────────────────────────────────
// مساعد: شارة الحالة
// ────────────────────────────────────────────
const getStatusBadge = (status) => {
  const map = {
    'نشط':     { type: 'active',   label: 'متاح الآن' },
    'غير نشط': { type: 'stopped',  label: 'إيقاف مؤقت' },
    'معطّل':   { type: 'disabled', label: 'معطّل مؤقتاً' },
  };
  const info = map[status] || { type: 'busy', label: status };

  const styles = {
    active:   'bg-white/20 text-white backdrop-blur-md border border-white/30',
    busy:     'bg-amber-500/90 text-white backdrop-blur-md border border-amber-400/50',
    stopped:  'bg-rose-500/90 text-white backdrop-blur-md border border-rose-400/50',
    disabled: 'bg-slate-700/90 text-white backdrop-blur-md border border-slate-600/50',
  };

  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${styles[info.type]}`}>
      {info.label}
    </span>
  );
};

// ────────────────────────────────────────────
// Dropdown زر الخروج
// ────────────────────────────────────────────
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
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
          >
            <User className="w-4 h-4 text-[#15317E]" />
            الملف الشخصي
          </Link>
          <div className="h-px bg-slate-100" />
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────
// الصفحة الرئيسية
// ────────────────────────────────────────────
export default function VenueDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [toastMessage, setToastMessage]   = useState('');
  const [showRevenue, setShowRevenue]     = useState(false);
  const [showNotifs, setShowNotifs]       = useState(false);
  const [itemToDelete, setItemToDelete]   = useState(null);
  const revenueRef = useRef(null);
  const notifsRef = useRef(null);

  // ── إغلاق النوافذ المنبثقة عند الضغط خارجها ──
  useEffect(() => {
    const handler = (e) => {
      if (revenueRef.current && !revenueRef.current.contains(e.target)) setShowRevenue(false);
      if (notifsRef.current && !notifsRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── جلب الشاليهات ──
  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['venues', user?.id],
    queryFn: () => base44.entities.Venue.filter({ owner_id: user?.id }, '-created_date'),
    enabled: !!user?.id,
  });

  // ── جلب الحجوزات ──
  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings-all', user?.id],
    queryFn: () => base44.entities.Booking.filter({ owner_id: user?.id }),
    enabled: !!user?.id,
  });

  // ── حذف شاليه ──
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Venue.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['venues'] });
      setItemToDelete(null);
      showToast('تم حذف الوحدة بنجاح!');
    },
  });

  const getBookingCount = (venueId) => bookings.filter(b => b.venue_id === venueId).length;

  // ── إيرادات الشهر الحالي من الحجوزات المؤكدة فقط ──
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const isThisMonth = (b) => {
    const d = b.check_in ? new Date(b.check_in) : (b.created_date ? new Date(b.created_date) : null);
    return d && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  };

  const venuePrice = (venueId) => {
    const v = venues.find(x => x.id === venueId);
    return v?.price_weekend || 0;
  };

  // إجمالي إيرادات الشهر: الحجوزات المؤكدة فقط (الملغية لا تُحسب)
  const monthlyRevenue = bookings
    .filter(b => b.status === 'مؤكد' && isThisMonth(b))
    .reduce((sum, b) => sum + (b.total_price ? Number(b.total_price) : venuePrice(b.venue_id)), 0);

  // ── الإشعارات: الحجوزات الجديدة ──
  const newBookings = bookings.filter(b => b.status === 'جديد');
  const hasNotifications = newBookings.length > 0;

  const handleShare = (venue) => {
    const url = `${window.location.origin}/place/${venue.slug || venue.id}`;
    if (navigator.share) {
      navigator.share({ title: venue.name, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).catch(() => {});
      showToast('تم نسخ الرابط بنجاح!');
    }
  };

  const handleViewPage = (venue) => {
    const url = `${window.location.origin}/place/${venue.slug || venue.id}`;
    window.open(url, '_blank');
  };

  const handleToggleStatus = async (venue) => {
    const newStatus = venue.status === 'نشط' ? 'معطّل' : 'نشط';
    try {
      await base44.entities.Venue.update(venue.id, { status: newStatus });
      qc.invalidateQueries({ queryKey: ['venues'] });
      showToast(newStatus === 'نشط' ? 'تم تفعيل الشاليه' : 'تم تعطيل الشاليه مؤقتاً');
    } catch (_) {
      showToast('تعذّر تحديث الحالة');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // ── تسجيل الخروج ──
  const handleLogout = async () => {
    await logout(false);
    navigate('/login');
  };

  // ── شاشة التحميل ──
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-8 h-8 animate-spin text-[#15317E]" />
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] font-sans pb-20 relative">

      {/* ── Toast ── */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#15317E] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#0d1e4c]">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* ── Modal تأكيد الحذف ── */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-[#15317E] rounded-[2rem] p-6 w-full max-w-sm shadow-2xl border border-[#2a4db3]">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-5 mx-auto border border-white/20">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-white mb-2">تأكيد الحذف</h3>
            <p className="text-sm text-white/70 text-center mb-6 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف<br />
              <span className="text-emerald-400 font-bold text-base">{itemToDelete.name}</span>؟<br />
              <span className="text-xs opacity-60">لا يمكن التراجع عن هذا الإجراء لاحقاً.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-sm"
              >
                تراجع
              </button>
              <button
                onClick={() => deleteMutation.mutate(itemToDelete.id)}
                disabled={deleteMutation.isPending}
                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all border border-rose-400 text-sm disabled:opacity-60"
              >
                {deleteMutation.isPending ? '...' : 'نعم، احذف'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── الخلفية الزرقاء العلوية ── */}
      <div className="absolute top-0 left-0 right-0 h-[190px] bg-[#15317E] rounded-b-[2.5rem] shadow-lg" />

      <div className="relative z-10 max-w-md mx-auto">

        {/* ── الهيدر ── */}
        <header className="px-5 pt-8 pb-6 flex items-center justify-between text-white">

          {/* بيانات المالك */}
          <div className="flex items-center gap-3">
            {/* الشعار - دائرة ثابتة زي واتساب */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full border-2 border-white/30 bg-white/10 overflow-hidden flex items-center justify-center shadow-lg">
                {user?.office_logo_url ? (
                  <img src={user.office_logo_url} alt="شعار" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-white">
                    {(user?.full_name || user?.office_name || 'م')[0]}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#15317E] rounded-full" />
            </div>
            <div>
              <p className="text-[11px] text-white/70 mb-0.5 tracking-wider">مرحباً بك،</p>
              <h1 className="text-base font-bold">{user?.full_name || user?.office_name || 'المالك'}</h1>
            </div>
          </div>

          {/* أيقونات التحكم */}
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
                    {hasNotifications && (
                      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">{newBookings.length}</span>
                    )}
                  </div>
                  {newBookings.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm text-slate-400">لا توجد إشعارات جديدة</p>
                    </div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto">
                      {newBookings.map(b => {
                        const v = venues.find(x => x.id === b.venue_id);
                        return (
                          <Link
                            key={b.id}
                            to={`/venue/bookings/${b.venue_id}`}
                            onClick={() => setShowNotifs(false)}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                          >
                            <div className="w-9 h-9 rounded-xl bg-[#15317E]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Calendar className="w-4 h-4 text-[#15317E]" />
                            </div>
                            <div className="flex-1 min-w-0 text-right">
                              <p className="text-sm font-bold text-slate-700">حجز جديد</p>
                              <p className="text-xs text-slate-500 truncate">
                                {b.client_name || 'عميل'} — {v?.name || 'شاليه'}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* الإيرادات */}
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

            {/* زر الخروج مع Dropdown */}
            <ProfileMenu onLogout={handleLogout} />
          </div>
        </header>

        {/* ── المحتوى ── */}
        <main className="px-4 space-y-6 mt-4">

          {/* عنوان القسم */}
          <div className="flex items-center justify-between px-2 text-white mb-4">
            <h3 className="text-lg font-bold">وحداتي السكنية</h3>
            <div className="flex items-center gap-2.5">
              <span className="bg-white/10 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm border border-white/10">
                {venues.length} وحدات
              </span>
              <Link
                to="/venue/add"
                className="flex items-center gap-1.5 bg-white text-[#15317E] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-[0_4px_15px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_20px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 transition-all group"
              >
                <div className="bg-[#15317E]/10 rounded-full p-0.5">
                  <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
                </div>
                إضافة شاليه
              </Link>
            </div>
          </div>

          {/* بطاقات الشاليهات */}
          {venues.map((venue) => (
            <div key={venue.id} className="bg-white rounded-[2rem] p-2 shadow-xl shadow-slate-200/50 border border-slate-100 transition-all duration-300">

              {/* الصورة */}
              <div className="relative h-56 rounded-[1.5rem] overflow-hidden">
                {venue.images?.[0] ? (
                  <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/>
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#15317E]/90 via-[#15317E]/30 to-transparent" />

                {/* شارة الحالة */}
                <div className="absolute top-4 right-4">
                  {getStatusBadge(venue.status)}
                </div>

                {/* اسم + موقع */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{venue.name}</h3>
                  <p className="text-sm text-white/80 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {venue.city}
                  </p>
                </div>
              </div>

              {/* السعر والحجوزات */}
              <div className="flex items-center justify-between px-4 py-4">
                <div>
                  <p className="text-xs text-slate-500 mb-0.5 font-medium">السعر / ليلة ويكند</p>
                  <p className="text-lg font-bold text-[#15317E]" dir="ltr">
                    {venue.price_weekend?.toLocaleString('en-US') ?? '—'} <span className="text-xs font-normal text-slate-400">ر.س</span>
                  </p>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-left">
                  <p className="text-xs text-slate-500 mb-0.5 font-medium">حجوزات الشهر</p>
                  <p className="text-lg font-bold text-[#15317E]" dir="ltr">
                    {bookings.filter(b => b.venue_id === venue.id && b.status !== 'ملغي' && isThisMonth(b)).length}
                  </p>
                </div>
              </div>

              {/* شريط الإجراءات */}
              <div className="bg-slate-50 rounded-[1.2rem] p-2 flex gap-2">
                <Link
                  to={`/venue/bookings/${venue.id}`}
                  className="flex-1 bg-[#15317E] hover:bg-[#0d1e4c] text-white flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-[#15317E]/20"
                >
                  <Calendar className="w-5 h-5" />
                  إدارة الحجوزات
                </Link>

                <div className="flex gap-2">
                  {/* تعديل */}
                  <Link
                    to={`/venue/edit/${venue.id}`}
                    className="w-12 flex items-center justify-center bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 rounded-xl transition-all shadow-sm group"
                    title="تعديل"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                      <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                    </svg>
                  </Link>

                  {/* عرض الصفحة */}
                  <button
                    onClick={() => handleViewPage(venue)}
                    className="w-12 flex items-center justify-center bg-white text-[#15317E] border border-slate-200 hover:bg-blue-50 hover:border-blue-200 rounded-xl transition-all shadow-sm group"
                    title="عرض الصفحة"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>

                  {/* مشاركة */}
                  <button
                    onClick={() => handleShare(venue)}
                    className="w-12 flex items-center justify-center bg-white text-[#15317E] border border-slate-200 hover:bg-blue-50 hover:border-blue-200 rounded-xl transition-all shadow-sm group"
                    title="مشاركة"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="10.49" x2="8.59" y2="6.51"/>
                    </svg>
                  </button>

                  {/* تفعيل / تعطيل */}
                  <button
                    onClick={() => handleToggleStatus(venue)}
                    className={`w-12 flex items-center justify-center border rounded-xl transition-all shadow-sm group ${venue.status === 'معطّل' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'}`}
                    title={venue.status === 'معطّل' ? 'تفعيل الشاليه' : 'تعطيل مؤقت'}
                  >
                    {venue.status === 'معطّل' ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                        <circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                        <circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/>
                      </svg>
                    )}
                  </button>

                  {/* حذف */}
                  <button
                    onClick={() => setItemToDelete(venue)}
                    className="w-12 flex items-center justify-center bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 rounded-xl transition-all shadow-sm group"
                    title="حذف"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* حالة فارغة */}
          {venues.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/>
                </svg>
              </div>
              <p className="text-slate-500 font-medium mb-4">لا توجد وحدات سكنية حالياً</p>
              <Link to="/venue/add" className="inline-flex items-center gap-2 bg-[#15317E] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#0d1e4c] transition-all">
                <Plus className="w-4 h-4" /> أضف أول شاليه
              </Link>
            </div>
          )}
        </main>
      </div>

      {/* خط الخطوط */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
      ` }} />
    </div>
  );
}
