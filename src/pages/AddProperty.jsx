import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import PropertyForm from '@/components/property/PropertyForm';
import {
  ChevronRight, Bell, Wallet, LogOut, User, ChevronDown, Building2, BadgeCheck
} from 'lucide-react';
const AIRBNB = '#FF385C';

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
      <button onClick={() => setOpen(!open)}
        className="h-9 w-9 sm:h-11 sm:w-11 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-all text-zinc-800 flex items-center justify-center gap-1 shadow-sm active:scale-[0.98]">
        <LogOut className="w-4 h-4" />
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-3 w-48 bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors font-bold">
            <User className="w-4 h-4" style={{ color: AIRBNB }} /> الملف الشخصي
          </Link>
          <div className="h-px bg-zinc-100" />
          <button onClick={() => { setOpen(false); onLogout(); }} className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-bold">
            <LogOut className="w-4 h-4" /> تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
}

export default function AddProperty() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [showRevenue, setShowRevenue] = useState(false);
  const [showNotifs, setShowNotifs]   = useState(false);
  const revenueRef = useRef(null);
  const notifsRef  = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (revenueRef.current && !revenueRef.current.contains(e.target)) setShowRevenue(false);
      if (notifsRef.current  && !notifsRef.current.contains(e.target))  setShowNotifs(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => { await logout(false); navigate('/login'); };

  const [successData, setSuccessData] = useState(null);

  // ── بيانات الإحصائيات والإشعارات (نفس لوحة التحكم) ──
  const { data: properties = [] } = useQuery({
    queryKey: ['my-properties'],
    queryFn: () => base44.entities.Property.filter({ created_by_id: user?.id }, '-created_date'),
    enabled: !!user?.id,
  });
  const activeProperties = properties.filter(p => p.status === 'نشط');

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Property.create(data),
    onSuccess: (created, vars) => {
      const id = created?.id || created?.[0]?.id;
      const url = id ? `${window.location.origin}/property/${id}` : '';
      setSuccessData({ title: vars?.title, url });
    },
  });

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7] font-sans pb-20 relative overflow-x-hidden text-zinc-950">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
      `}} />

      <div className="absolute inset-x-0 top-0 h-[180px] bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-28 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ backgroundColor: AIRBNB }} />
      <div className="absolute top-24 left-[-90px] w-72 h-72 rounded-full bg-zinc-900/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-5 lg:px-8">
        <header className="pt-4 sm:pt-6 pb-4">
          <div className="rounded-[1.6rem] sm:rounded-[2rem] bg-white/95 border border-zinc-200 shadow-[0_14px_44px_rgba(0,0,0,0.07)] backdrop-blur-xl p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3 sm:gap-5">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <button onClick={() => navigate(-1)} className="h-9 w-9 sm:h-11 sm:w-11 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-800 flex items-center justify-center transition-all shadow-sm active:scale-[0.98]">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="w-[54px] h-[54px] sm:w-[62px] sm:h-[62px] rounded-[1.35rem] bg-gradient-to-br from-white to-zinc-100 overflow-hidden flex items-center justify-center border border-zinc-200 shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex-shrink-0">
                  {user?.office_logo_url || user?.avatar_url ? (
                    <img src={user.office_logo_url || user.avatar_url} alt="شعار" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-6 h-6 text-zinc-700" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs font-black text-zinc-400 leading-none mb-1">إضافة عقار جديد</p>
                  <h1 className="text-[15px] sm:text-xl font-black text-zinc-950 truncate leading-tight max-w-[160px] sm:max-w-none">
                    {user?.office_name || user?.full_name || 'المكتب'}
                  </h1>
                  {user?.license_number && (
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#FF385C]/10 border border-[#FF385C]/15 px-2 py-1 text-[10px] sm:text-[11px] font-black text-[#FF385C]">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      رخصة موثوق: <span dir="ltr">{user.license_number}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 sm:gap-2 flex-nowrap shrink-0">
                <div className="relative" ref={notifsRef}>
                  <button onClick={() => setShowNotifs(!showNotifs)}
                    className={`relative h-9 w-9 sm:h-11 sm:w-11 rounded-2xl border transition-all flex items-center justify-center shadow-sm active:scale-[0.98] ${showNotifs ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'}`}>
                    <Bell className="w-4 h-4" />
                  </button>
                  {showNotifs && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[270px] sm:w-80 max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-zinc-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="px-3.5 py-2.5 bg-zinc-950 text-white"><span className="text-sm font-black">الإشعارات</span></div>
                      <div className="px-4 py-5 text-center"><p className="text-sm text-zinc-400 font-bold">لا توجد إشعارات جديدة</p></div>
                    </div>
                  )}
                </div>

                <div className="relative" ref={revenueRef}>
                  <button onClick={() => setShowRevenue(!showRevenue)}
                    className={`h-9 w-9 sm:h-11 sm:w-11 rounded-2xl border transition-all flex items-center justify-center shadow-sm active:scale-[0.98] ${showRevenue ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'}`}>
                    <Wallet className="w-4 h-4" />
                  </button>
                  {showRevenue && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-zinc-100 p-4 z-50 text-center animate-in fade-in slide-in-from-top-2">
                      <p className="text-[11px] text-zinc-500 font-bold mb-1">العقارات النشطة</p>
                      <p className="text-xl font-black text-zinc-950">{activeProperties.length} <span className="text-[10px] font-bold text-zinc-400">عقار</span></p>
                    </div>
                  )}
                </div>

                <ProfileMenu onLogout={handleLogout} />
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 items-start">
          <aside className="hidden lg:block rounded-[2rem] bg-white border border-zinc-100 shadow-sm p-5 sticky top-5">
            <div className="w-12 h-12 rounded-2xl bg-[#FF385C]/10 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" style={{ color: AIRBNB }} />
            </div>
            <h2 className="text-xl font-black text-zinc-950">إضافة عقار بنظام خطوات</h2>
            <p className="text-sm font-bold text-zinc-500 leading-7 mt-2">
              أدخل بيانات العقار كما هي، وسيتم عرضها داخل بطاقات الوسيط وصفحة العقار بشكل مرتب.
            </p>
            <div className="mt-5 space-y-2 text-xs font-bold text-zinc-500">
              <div className="rounded-2xl bg-zinc-50 border border-zinc-100 px-3 py-2">١. نوع العقار</div>
              <div className="rounded-2xl bg-zinc-50 border border-zinc-100 px-3 py-2">٢. البيانات الأساسية</div>
              <div className="rounded-2xl bg-zinc-50 border border-zinc-100 px-3 py-2">٣. التفاصيل والموقع</div>
              <div className="rounded-2xl bg-zinc-50 border border-zinc-100 px-3 py-2">٤. الصور والسعر</div>
            </div>
          </aside>

          <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-100 p-4 sm:p-6">
            <PropertyForm
              onSubmit={createMutation.mutate}
              isLoading={createMutation.isPending}
              successData={successData}
              onReset={() => { setSuccessData(null); window.location.reload(); }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}