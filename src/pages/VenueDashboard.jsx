import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
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
  Eye,
  Share2,
  Pencil,
  Trash2,
} from 'lucide-react';

const AIRBNB = '#FF385C';

const VerifiedBadge = () => (
  <span className="relative group inline-flex items-center align-middle">
    <svg
      viewBox="0 0 24 24"
      className="w-4.5 h-4.5 sm:w-5 sm:h-5"
      aria-label="مشترك"
      role="img"
    >
      <path
        fill={AIRBNB}
        d="M12 2.25l2.02 1.51 2.52-.21 1.06 2.29 2.32 1.01-.23 2.52L21.2 12l-1.51 2.63.23 2.52-2.32 1.01-1.06 2.29-2.52-.21L12 21.75l-2.02-1.51-2.52.21-1.06-2.29-2.32-1.01.23-2.52L2.8 12l1.51-2.63-.23-2.52L6.4 5.84l1.06-2.29 2.52.21L12 2.25z"
      />
      <path
        d="M8.7 12.2l2.05 2.05 4.7-5"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="pointer-events-none absolute right-1/2 top-full z-[60] mt-2 translate-x-1/2 whitespace-nowrap rounded-xl bg-zinc-950 px-3 py-1.5 text-[11px] font-black text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
      مشترك
    </span>
  </span>
);

// ────────────────────────────────────────────
// Dropdown الملف الشخصي
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
        className="h-11 w-11 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-all text-zinc-800 flex items-center justify-center gap-1 shadow-sm active:scale-[0.98]"
        title="القائمة"
      >
        <LogOut className="w-4 h-4" />
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-3 w-48 bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors font-bold"
          >
            <User className="w-4 h-4" style={{ color: AIRBNB }} />
            الملف الشخصي
          </Link>
          <div className="h-px bg-zinc-100" />
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-bold"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
}

const EmptyHouseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-11 h-11">
    <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5Z" />
    <path d="M9 21v-8h6v8" />
  </svg>
);

const IconButton = ({ children, onClick, title, className = '' }) => (
  <button
    onClick={onClick}
    className={`h-11 w-full sm:h-12 sm:w-12 flex items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-all shadow-sm active:scale-[0.98] ${className}`}
    title={title}
  >
    {children}
  </button>
);

// ────────────────────────────────────────────
// الصفحة الرئيسية
// ────────────────────────────────────────────
export default function VenueDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [toastMessage, setToastMessage] = useState('');
  const [showRevenue, setShowRevenue] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const revenueRef = useRef(null);
  const notifsRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (revenueRef.current && !revenueRef.current.contains(e.target)) setShowRevenue(false);
      if (notifsRef.current && !notifsRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['venues', user?.id],
    queryFn: () => base44.entities.Venue.filter({ owner_id: user?.id }, '-created_date'),
    enabled: !!user?.id,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings-all', user?.id],
    queryFn: () => base44.entities.Booking.filter({ owner_id: user?.id }),
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Venue.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['venues'] });
      setItemToDelete(null);
      showToast('تم حذف الوحدة بنجاح!');
    },
  });

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

  const monthlyRevenue = bookings
    .filter(b => b.status === 'مؤكد' && isThisMonth(b))
    .reduce((sum, b) => sum + (b.total_price ? Number(b.total_price) : venuePrice(b.venue_id)), 0);

  const newBookings = bookings.filter(b => b.status === 'جديد');
  const hasNotifications = newBookings.length > 0;
  const isSubscribed = [
    user?.subscription_status,
    user?.subscriptionStatus,
    user?.plan_status,
    user?.membership_status,
    user?.trial_status,
  ].some((status) => ['active', 'trialing', 'subscribed', 'مشترك', 'نشط', 'تجربة'].includes(String(status || '').toLowerCase()))
    || Boolean(user?.is_subscribed || user?.isSubscribed || user?.subscription_active || user?.trial_active);

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
    const newStatus = venue.status;
    try {
      await base44.entities.Venue.update(venue.id, { status: newStatus });
      qc.invalidateQueries({ queryKey: ['venues'] });
      showToast(newStatus === 'نشط' ? 'تم تفعيل الشاليه' : 'تم إيقاف الشاليه مؤقتاً');
    } catch (_) {
      showToast('تعذّر تحديث الحالة');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleLogout = async () => {
    await logout(false);
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="w-16 h-16 rounded-3xl bg-white border border-zinc-200 shadow-xl flex items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin" style={{ color: AIRBNB }} />
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7] font-sans pb-16 relative overflow-x-hidden text-zinc-950">
      <div className="absolute inset-x-0 top-0 h-[170px] bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-28 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ backgroundColor: AIRBNB }} />
      <div className="absolute top-24 left-[-90px] w-72 h-72 rounded-full bg-zinc-900/5 blur-3xl pointer-events-none" />

      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-zinc-950 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
          <CheckCircle className="w-5 h-5" style={{ color: AIRBNB }} />
          <span className="text-sm font-black tracking-wide">{toastMessage}</span>
        </div>
      )}

      {itemToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/65 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl border border-zinc-100">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-5 mx-auto border border-rose-100">
              <Trash2 className="w-7 h-7 text-rose-500" />
            </div>
            <h3 className="text-xl font-black text-center text-zinc-950 mb-2">تأكيد الحذف</h3>
            <p className="text-sm text-zinc-500 text-center mb-6 leading-relaxed font-medium">
              هل أنت متأكد من حذف<br />
              <span className="text-zinc-950 font-black text-base">{itemToDelete.name}</span>؟<br />
              <span className="text-xs text-zinc-400">لا يمكن التراجع عن هذا الإجراء لاحقاً.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-3.5 rounded-2xl font-black text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-all text-sm"
              >
                تراجع
              </button>
              <button
                onClick={() => deleteMutation.mutate(itemToDelete.id)}
                disabled={deleteMutation.isPending}
                className="flex-1 py-3.5 rounded-2xl font-black text-white bg-rose-500 hover:bg-rose-600 transition-all text-sm disabled:opacity-60"
              >
                {deleteMutation.isPending ? '...' : 'نعم، احذف'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="pt-5 sm:pt-7 pb-4">
          <div className="rounded-[2rem] bg-white/95 border border-zinc-200 shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl p-3.5 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

              <div className="flex items-center gap-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1.25rem] bg-zinc-100 overflow-hidden flex items-center justify-center border border-zinc-200">
                    {user?.office_logo_url ? (
                      <img src={user.office_logo_url} alt="شعار" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-black text-zinc-950">
                        {(user?.full_name || user?.office_name || 'م')[0]}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full" style={{ backgroundColor: AIRBNB }} />
                </div>

                <div className="min-w-0">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FF385C]/10 px-2.5 py-1 text-[10px] font-black text-[#FF385C] mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF385C]" />
                    لوحة التحكم
                  </div>
                  <h1 className="text-base sm:text-lg font-black text-zinc-950 truncate flex items-center gap-1.5">
                    <span className="truncate">{user?.full_name || user?.office_name || 'المالك'}</span>
                    {isSubscribed && <VerifiedBadge />}
                  </h1>
                  <p className="text-xs font-bold text-zinc-500 mt-0.5 truncate">
                    إدارة الأماكن والحجوزات من مكان واحد
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 flex-wrap sm:flex-nowrap">
                <div className="hidden md:inline-flex items-center gap-2 rounded-2xl bg-zinc-50 border border-zinc-200 px-3.5 py-2.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: AIRBNB }} />
                  <span className="text-xs font-black text-zinc-700">{venues.length} وحدات</span>
                </div>

                <div className="relative" ref={notifsRef}>
                  <button
                    onClick={() => setShowNotifs(!showNotifs)}
                    className={`relative h-11 w-11 rounded-2xl border transition-all flex items-center justify-center shadow-sm active:scale-[0.98] ${showNotifs ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'}`}
                    title="الإشعارات"
                  >
                    <Bell className="w-4.5 h-4.5" />
                    {hasNotifications && (
                      <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full shadow-[0_0_10px_rgba(255,56,92,0.9)]" style={{ backgroundColor: AIRBNB }} />
                    )}
                  </button>

                  {showNotifs && (
                    <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl border border-zinc-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-3 bg-zinc-950 text-white flex items-center justify-between">
                        <span className="text-sm font-black">الإشعارات</span>
                        {hasNotifications && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-black" style={{ backgroundColor: AIRBNB }}>{newBookings.length}</span>
                        )}
                      </div>
                      {newBookings.length === 0 ? (
                        <div className="px-4 py-7 text-center">
                          <p className="text-sm text-zinc-400 font-bold">لا توجد إشعارات جديدة</p>
                        </div>
                      ) : (
                        <div className="max-h-72 overflow-y-auto">
                          {newBookings.map(b => {
                            const v = venues.find(x => x.id === b.venue_id);
                            return (
                              <Link
                                key={b.id}
                                to={`/venue/bookings/${b.venue_id}`}
                                onClick={() => setShowNotifs(false)}
                                className="flex items-start gap-3 px-4 py-3.5 hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0"
                              >
                                <div className="w-10 h-10 rounded-2xl bg-[#FF385C]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Calendar className="w-4 h-4" style={{ color: AIRBNB }} />
                                </div>
                                <div className="flex-1 min-w-0 text-right">
                                  <p className="text-sm font-black text-zinc-800">حجز جديد</p>
                                  <p className="text-xs text-zinc-500 truncate font-medium">
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

                <div className="relative" ref={revenueRef}>
                  <button
                    onClick={() => setShowRevenue(!showRevenue)}
                    className={`h-11 w-11 rounded-2xl border transition-all flex items-center justify-center shadow-sm active:scale-[0.98] ${showRevenue ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'}`}
                    title="إيرادات الشهر"
                  >
                    <Wallet className="w-4.5 h-4.5" />
                  </button>

                  {showRevenue && (
                    <div className="absolute top-full left-0 mt-3 w-60 bg-white rounded-3xl shadow-2xl border border-zinc-100 p-4 z-50 text-center animate-in fade-in slide-in-from-top-2">
                      <p className="text-[11px] text-zinc-500 font-bold mb-1">إيرادات الشهر المؤكدة</p>
                      <p className="text-2xl font-black text-zinc-950" dir="ltr">
                        {monthlyRevenue.toLocaleString('en-US')} <span className="text-[11px] font-bold text-zinc-400">ر.س</span>
                      </p>
                    </div>
                  )}
                </div>

                <ProfileMenu onLogout={handleLogout} />
              </div>
            </div>
          </div>
        </header>

        <main className="space-y-6">
          <div className="rounded-[2rem] bg-white border border-zinc-200 shadow-[0_24px_70px_rgba(0,0,0,0.08)] px-4 py-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-zinc-950">وحداتي السكنية</h3>
              <p className="text-xs sm:text-sm text-zinc-500 font-bold mt-1">كل مكان تملكه يظهر هنا كبطاقة مستقلة.</p>
            </div>

            <Link
              to="/venue/add"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 hover:bg-black text-white px-5 py-3 text-sm font-black shadow-[0_16px_30px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              إضافة شاليه
            </Link>
          </div>

          {venues.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
              {venues.map((venue) => (
                <div key={venue.id} className="bg-white rounded-[2rem] p-2.5 shadow-[0_20px_55px_rgba(0,0,0,0.08)] border border-zinc-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(0,0,0,0.12)]">
                  <div className="relative h-56 sm:h-60 rounded-[1.55rem] overflow-hidden bg-zinc-100">
                    {venue.images?.[0] ? (
                      <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                        <EmptyHouseIcon />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                    {venue.status === 'معطّل' && (
                      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 opacity-80">
                          <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                        </svg>
                        <span className="text-white text-sm font-black opacity-90">متوقف عن العرض حالياً</span>
                      </div>
                    )}

                    <div className="absolute top-3 right-3 flex items-center bg-white/85 backdrop-blur-md p-1 rounded-full shadow-sm border border-white/70 z-20">
                      <button
                        onClick={() => handleToggleStatus({ ...venue, status: 'نشط' })}
                        className={`px-3 py-1.5 text-[11px] font-black rounded-full transition-all duration-300 ${venue.status === 'نشط' ? 'text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-950'}`}
                        style={venue.status === 'نشط' ? { backgroundColor: AIRBNB } : {}}
                      >
                        نشط
                      </button>
                      <button
                        onClick={() => handleToggleStatus({ ...venue, status: 'معطّل' })}
                        className={`px-3 py-1.5 text-[11px] font-black rounded-full transition-all duration-300 ${venue.status === 'معطّل' ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-950'}`}
                      >
                        معطّل
                      </button>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                      <h3 className="text-xl font-black mb-1 truncate">{venue.name}</h3>
                      <p className="text-sm text-white/78 flex items-center gap-1.5 font-bold">
                        <MapPin className="w-4 h-4" />
                        {venue.city}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 px-1 py-3">
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-3">
                      <p className="text-[11px] text-zinc-500 mb-1 font-bold">السعر / ليلة ويكند</p>
                      <p className="text-lg font-black text-zinc-950" dir="ltr">
                        {venue.price_weekend?.toLocaleString('en-US') ?? '—'} <span className="text-[10px] font-bold text-zinc-400">ر.س</span>
                      </p>
                    </div>
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-3 text-left">
                      <p className="text-[11px] text-zinc-500 mb-1 font-bold">حجوزات الشهر</p>
                      <p className="text-lg font-black text-zinc-950" dir="ltr">
                        {bookings.filter(b => b.venue_id === venue.id && b.status !== 'ملغي' && isThisMonth(b)).length}
                      </p>
                    </div>
                  </div>

                  <div className="bg-zinc-50 rounded-[1.35rem] p-2 flex flex-col sm:flex-row gap-2">
                    <Link
                      to={`/venue/bookings/${venue.id}`}
                      className="flex-1 min-h-12 bg-zinc-950 hover:bg-black text-white flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black text-sm transition-all shadow-md shadow-black/10 active:scale-[0.98]"
                    >
                      <Calendar className="w-5 h-5" />
                      إدارة الحجوزات
                    </Link>

                    <div className="grid grid-cols-4 sm:flex gap-1.5 sm:gap-2 w-full sm:w-auto">
                      <Link
                        to={`/venue/edit/${venue.id}`}
                        className="h-11 w-full sm:h-12 sm:w-12 flex items-center justify-center bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 rounded-2xl transition-all shadow-sm"
                        title="تعديل"
                      >
                        <Pencil className="w-4.5 h-4.5" />
                      </Link>

                      <IconButton onClick={() => handleViewPage(venue)} title="عرض الصفحة" className="text-zinc-800">
                        <Eye className="w-4.5 h-4.5" />
                      </IconButton>

                      <IconButton onClick={() => handleShare(venue)} title="مشاركة" className="text-zinc-800">
                        <Share2 className="w-4.5 h-4.5" />
                      </IconButton>

                      <IconButton onClick={() => setItemToDelete(venue)} title="حذف" className="bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100 hover:border-rose-200">
                        <Trash2 className="w-4.5 h-4.5" />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {venues.length === 0 && (
            <div className="text-center py-16 sm:py-20 bg-white rounded-[2rem] border border-zinc-200 shadow-[0_20px_55px_rgba(0,0,0,0.06)]">
              <div className="w-20 h-20 bg-zinc-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-zinc-400">
                <EmptyHouseIcon />
              </div>
              <p className="text-zinc-700 font-black mb-2">لا توجد وحدات سكنية حالياً</p>
              <p className="text-zinc-500 font-bold text-sm mb-5">أضف أول مكان وابدأ مشاركة صفحتك مع العملاء.</p>
              <Link to="/venue/add" className="inline-flex items-center gap-2 bg-zinc-950 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-black transition-all">
                <Plus className="w-4 h-4" /> أضف أول شاليه
              </Link>
            </div>
          )}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
      ` }} />
    </div>
  );
}
