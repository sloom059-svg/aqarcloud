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
  ChevronDown,
  Home,
  Building2,
  Share2
} from 'lucide-react';

// ────────────────────────────────────────────
// مساعد: شارة الحالة
// ────────────────────────────────────────────
const getStatusBadge = (status) => {
  const map = {
    'نشط':     { type: 'active',  label: 'متاح الآن' },
    'غير نشط': { type: 'stopped', label: 'إيقاف مؤقت' },
  };
  const info = map[status] || { type: 'busy', label: status };

  const styles = {
    active:  'bg-white/20 text-white backdrop-blur-md border border-white/30',
    busy:    'bg-amber-500/90 text-white backdrop-blur-md border border-amber-400/50',
    stopped: 'bg-rose-500/90 text-white backdrop-blur-md border border-rose-400/50',
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
        <div className="absolute left-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            <User className="w-4 h-4 text-[#e56d6d]" />
            الملف الشخصي
          </Link>
          <div className="h-px bg-gray-100" />
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
    navigator.clipboard.writeText(url).catch(() => {});
    showToast('تم نسخ الرابط بنجاح!');
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
        <Loader2 className="w-8 h-8 animate-spin text-[#e56d6d]" />
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] font-sans pb-20 relative">

      {/* ── Toast (شكل فخم وحديث) ── */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white text-gray-800 px-6 py-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center gap-3 border border-gray-100 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* ── Modal تأكيد الحذف (مطور للفخامة) ── */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl border border-gray-100 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-5 mx-auto border border-rose-100">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </div>
            <h3 className="text-xl font-black text-center text-gray-800 mb-2">تأكيد الحذف</h3>
            <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed font-medium">
              هل أنت متأكد من رغبتك في حذف<br />
              <span className="text-[#e56d6d] font-bold text-base">{itemToDelete.name}</span>؟<br />
              <span className="text-xs opacity-80 block mt-1">لا يمكن التراجع عن هذا الإجراء لاحقاً.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all text-sm"
              >
                تراجع
              </button>
              <button
                onClick={() => deleteMutation.mutate(itemToDelete.id)}
                disabled={deleteMutation.isPending}
                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all text-sm disabled:opacity-60"
              >
                {deleteMutation.isPending ? '...' : 'نعم، احذف'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── الخلفية العلوية باللون الجديد ── */}
      <div className="absolute top-0 left-0 right-0 h-[190px] bg-gradient-to-b from-[#e56d6d] to-[#d85c5c] rounded-b-[2.5rem] shadow-sm" />

      <div className="relative z-10 max-w-md mx-auto">

        {/* ── الهيدر ── */}
        <header className="px-5 pt-8 pb-6 flex items-center justify-between text-white">

          {/* بيانات المالك */}
          <div className="flex items-center gap-3">
            {/* الشعار */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full border-2 border-white/40 bg-white/20 overflow-hidden flex items-center justify-center shadow-md backdrop-blur-sm">
                {user?.office_logo_url ? (
                  <img src={user.office_logo_url} alt="شعار" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-black text-white drop-shadow-sm">
                    {(user?.full_name || user?.office_name || 'م')[0]}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#e56d6d] rounded-full" />
            </div>
            <div>
              <p className="text-[11px] text-white/90 mb-0.5 tracking-wider font-medium">مرحباً بك،</p>
              <h1 className="text-base font-black drop-shadow-sm">{user?.full_name || user?.office_name || 'المالك'}</h1>
            </div>
          </div>

          {/* أيقونات التحكم */}
          <div className="flex items-center gap-2">

            {/* الإشعارات */}
            <div className="relative" ref={notifsRef}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className={`relative p-2.5 rounded-xl backdrop-blur-md transition-all ${showNotifs ? 'bg-white text-[#e56d6d] shadow-md' : 'bg-white/10 hover:bg-white/20 text-white shadow-sm'}`}
                title="الإشعارات"
              >
                <Bell className="w-4 h-4" />
                {hasNotifications && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] border border-[#e56d6d]" />
                )}
              </button>
              {showNotifs && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 bg-gradient-to-r from-[#e56d6d] to-[#d85c5c] text-white flex items-center justify-between">
                    <span className="text-sm font-bold">الإشعارات</span>
                    {hasNotifications && (
                      <span className="text-[10px] bg-white text-[#e56d6d] px-2 py-0.5 rounded-full font-bold shadow-sm">{newBookings.length}</span>
                    )}
                  </div>
                  {newBookings.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-gray-400 font-medium">لا توجد إشعارات جديدة</p>
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
                            className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                          >
                            <div className="w-9 h-9 rounded-xl bg-[#fff0f0] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Calendar className="w-4 h-4 text-[#e56d6d]" />
                            </div>
                            <div className="flex-1 min-w-0 text-right">
                              <p className="text-sm font-bold text-gray-800">حجز جديد</p>
                              <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">
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
                className={`p-2.5 rounded-xl backdrop-blur-md transition-all ${showRevenue ? 'bg-white text-[#e56d6d] shadow-md' : 'bg-white/10 hover:bg-white/20 text-white shadow-sm'}`}
                title="إيرادات الشهر"
              >
                <Wallet className="w-4 h-4" />
              </button>
              {showRevenue && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-5 z-50 text-center animate-in fade-in slide-in-from-top-2">
                  <p className="text-xs text-gray-500 font-bold mb-1.5">إيرادات الشهر (مؤكدة)</p>
                  <p className="text-2xl font-black text-[#e56d6d]" dir="ltr">
                    {monthlyRevenue.toLocaleString('en-US')} <span className="text-[11px] font-bold text-gray-400">ر.س</span>
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
            <h3 className="text-xl font-black drop-shadow-sm">وحداتي السكنية</h3>
            <div className="flex items-center gap-2.5">
              <span className="bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border border-white/20 shadow-sm">
                {venues.length} وحدات
              </span>
              <Link
                to="/venue/add"
                className="flex items-center gap-1.5 bg-white text-[#e56d6d] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all group"
              >
                <div className="bg-[#fff0f0] rounded-full p-0.5">
                  <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
                </div>
                إضافة شاليه
              </Link>
            </div>
          </div>

          {/* بطاقات الشاليهات */}
          {venues.map((venue) => (
            <div key={venue.id} className="bg-white rounded-[2rem] p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/60 hover:border-gray-200 transition-all duration-300">

              {/* الصورة */}
              <div className="relative h-56 rounded-[1.5rem] overflow-hidden">
                {venue.images?.[0] ? (
                  <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Home className="w-16 h-16 text-gray-300" strokeWidth={1.5} />
                  </div>
                )}
                {/* تدرج لوني فخم من الأسود للشفاف لإبراز النص */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* شارة الحالة */}
                <div className="absolute top-4 right-4">
                  {getStatusBadge(venue.status)}
                </div>

                {/* اسم + موقع */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <h3 className="text-2xl font-black mb-1.5 drop-shadow-md">{venue.name}</h3>
                  <p className="text-sm text-white/90 flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4" />
                    {venue.city}
                  </p>
                </div>
              </div>

              {/* السعر والحجوزات */}
              <div className="flex items-center justify-between px-5 py-5">
                <div>
                  <p className="text-xs text-gray-400 mb-1 font-bold">السعر / ليلة ويكند</p>
                  <p className="text-xl font-black text-gray-800" dir="ltr">
                    {venue.price_weekend?.toLocaleString('en-US') ?? '—'} <span className="text-xs font-bold text-gray-400">ر.س</span>
                  </p>
                </div>
                <div className="w-px h-10 bg-gray-100" />
                <div className="text-left">
                  <p className="text-xs text-gray-400 mb-1 font-bold">حجوزات الشهر</p>
                  <p className="text-xl font-black text-gray-800" dir="ltr">
                    {bookings.filter(b => b.venue_id === venue.id && b.status !== 'ملغي' && isThisMonth(b)).length}
                  </p>
                </div>
              </div>

              {/* شريط الإجراءات */}
              <div className="bg-gray-50/80 rounded-[1.2rem] p-2 flex gap-2">
                <Link
                  to={`/venue/bookings/${venue.id}`}
                  className="flex-1 bg-gradient-to-r from-[#e56d6d] to-[#d85c5c] hover:from-[#d85c5c] hover:to-[#c44e4e] text-white flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all shadow-[0_4px_12px_rgba(229,109,109,0.2)]"
                >
                  <Calendar className="w-5 h-5" />
                  إدارة الحجوزات
                </Link>

                <div className="flex gap-2">
                  {/* تعديل */}
                  <Link
                    to={`/venue/edit/${venue.id}`}
                    className="w-12 flex items-center justify-center bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-[#e56d6d] hover:border-gray-300 rounded-xl transition-all shadow-sm group"
                    title="تعديل"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                      <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                    </svg>
                  </Link>

                  {/* مشاركة */}
                  <button
                    onClick={() => handleShare(venue)}
                    className="w-12 flex items-center justify-center bg-white text-[#e56d6d] border border-gray-200 hover:bg-[#fff0f0] hover:border-[#f9d2d2] rounded-xl transition-all shadow-sm group"
                    title="مشاركة"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="10.49" x2="8.59" y2="6.51"/>
                    </svg>
                  </button>

                  {/* حذف */}
                  <button
                    onClick={() => setItemToDelete(venue)}
                    className="w-12 flex items-center justify-center bg-white text-rose-500 border border-gray-200 hover:bg-rose-50 hover:border-rose-200 rounded-xl transition-all shadow-sm group"
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
            <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm mt-8">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-gray-100">
                <Home className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
              </div>
              <p className="text-gray-500 font-bold mb-6">لا توجد وحدات سكنية حالياً</p>
              <Link
                to="/venue/add"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e56d6d] to-[#d85c5c] text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:shadow-[0_8px_20px_rgba(229,109,109,0.3)] transition-all hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                أضف أول شاليه لك
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
