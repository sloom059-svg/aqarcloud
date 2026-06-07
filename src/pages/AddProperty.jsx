import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import PropertyForm from '@/components/property/PropertyForm';
import {
  ChevronRight, Bell, Wallet, LogOut, User, ChevronDown, Calendar
} from 'lucide-react';
import { toast } from 'sonner';

const DRAFT_KEY = 'add-property-draft';

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
        className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-all text-white/90 hover:text-white flex items-center gap-1">
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

  // ── بيانات الإحصائيات والإشعارات (نفس لوحة التحكم) ──
  const { data: properties = [] } = useQuery({
    queryKey: ['my-properties'],
    queryFn: () => base44.entities.Property.filter({ created_by_id: user?.id }, '-created_date'),
    enabled: !!user?.id,
  });
  const activeProperties = properties.filter(p => p.status === 'نشط');

  // ── المسودة المحفوظة ──
  const [draft, setDraft] = useState(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (_) { return null; }
  });

  const handleDraftChange = (formData) => {
    setDraft(formData);
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(formData)); } catch (_) {}
  };

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Property.create(data),
    onSuccess: () => {
      try { sessionStorage.removeItem(DRAFT_KEY); } catch (_) {}
      toast.success('تم إضافة العقار بنجاح');
      navigate('/dashboard');
    },
  });

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] font-sans pb-20 relative">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
      `}} />

      {/* الخلفية الزرقاء العلوية */}
      <div className="absolute top-0 left-0 right-0 h-[150px] bg-[#15317E] rounded-b-[2.5rem] shadow-lg" />

      <div className="relative z-10 max-w-3xl mx-auto px-4">

        {/* ══════════════ الهيدر — نفس لوحة تحكم المكتب ══════════════ */}
        <header className="pt-8 pb-6 flex items-center justify-between text-white">

          {/* يسار: رجوع + شعار + عنوان الصفحة */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full border-2 border-white/30 bg-white/10 overflow-hidden flex items-center justify-center shadow-lg">
                {user?.office_logo_url || user?.avatar_url ? (
                  <img src={user.office_logo_url || user.avatar_url} alt="شعار" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-white">{(user?.full_name || user?.office_name || 'م')[0]}</span>
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#15317E] rounded-full" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">إضافة عقار جديد</h1>
              <p className="text-[11px] text-white/70 mt-0.5">{user?.office_name || user?.full_name || 'المكتب'}</p>
            </div>
          </div>

          {/* يمين: إشعارات + محفظة + خروج */}
          <div className="flex items-center gap-2">
            <div className="relative" ref={notifsRef}>
              <button onClick={() => setShowNotifs(!showNotifs)}
                className={`relative p-2.5 rounded-xl backdrop-blur-md transition-all ${showNotifs ? 'bg-white text-[#15317E]' : 'bg-white/10 hover:bg-white/20 text-white/90 hover:text-white'}`}>
                <Bell className="w-4 h-4" />
              </button>
              {showNotifs && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 bg-[#15317E] text-white"><span className="text-sm font-bold">الإشعارات</span></div>
                  <div className="px-4 py-6 text-center"><p className="text-sm text-slate-400">لا توجد إشعارات جديدة</p></div>
                </div>
              )}
            </div>

            <div className="relative" ref={revenueRef}>
              <button onClick={() => setShowRevenue(!showRevenue)}
                className={`p-2.5 rounded-xl backdrop-blur-md transition-all ${showRevenue ? 'bg-white text-[#15317E]' : 'bg-white/10 hover:bg-white/20 text-white/90'}`}>
                <Wallet className="w-4 h-4" />
              </button>
              {showRevenue && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 text-center animate-in fade-in slide-in-from-top-2">
                  <p className="text-[11px] text-slate-500 font-medium mb-1">العقارات النشطة</p>
                  <p className="text-xl font-bold text-[#15317E]">{activeProperties.length} <span className="text-[10px] font-normal text-slate-400">عقار</span></p>
                </div>
              )}
            </div>

            <ProfileMenu onLogout={handleLogout} />
          </div>
        </header>

        {/* ══════════════ النموذج ══════════════ */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-4 sm:p-6">
          <PropertyForm
            initialData={draft}
            onSubmit={createMutation.mutate}
            isLoading={createMutation.isPending}
            onChange={handleDraftChange}
          />
        </div>
      </div>
    </div>
  );
}
