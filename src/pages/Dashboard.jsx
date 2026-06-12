import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Building2,
  Pencil,
  Trash2,
  Share2,
  Download,
  Eye,
  Bell,
  BarChart3,
  LogOut,
  User,
  ChevronDown,
  Loader2,
  CheckCircle,
  BadgeCheck,
  Crown,
} from "lucide-react";
import PropertyCard from '@/components/property/PropertyCard';
import PropertyCardExport from '@/components/property/PropertyCardExport';
import SiteFooter from '@/components/layout/SiteFooter';

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
      <button
        onClick={() => setOpen(!open)}
        className="h-9 w-9 sm:h-11 sm:w-11 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-all text-zinc-800 flex items-center justify-center gap-1 shadow-sm active:scale-[0.98]"
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
          <Link
            to="/subscription"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors font-bold"
          >
            <Crown className="w-4 h-4" style={{ color: AIRBNB }} />
            اشتراكاتي
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

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [exportProperty, setExportProperty] = useState(null);
  const [toastMessage, setToastMessage]     = useState('');
  const [showRevenue, setShowRevenue]       = useState(false);
  const [showNotifs, setShowNotifs]         = useState(false);

  const revenueRef = useRef(null);
  const notifsRef  = useRef(null);

  useEffect(() => {
    if (user?.business_type && user.business_type !== 'وسيط') {
      navigate('/venue', { replace: true });
    }
  }, [user, navigate]);

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

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['my-properties'],
    queryFn: () => base44.entities.Property.filter({ created_by_id: user.id }, '-created_date'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Property.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      showToast('تم حذف العقار بنجاح');
    },
    onError: (err) => {
      showToast('فشل الحذف: ' + (err?.message || 'تحقق من صلاحيات RLS في Supabase'));
    },
  });


  const copyProfileLink = async () => {
    const url = `${window.location.origin}/agent/${user.id}`;
    const shareData = {
      title: user?.office_name || 'مكتبي العقاري',
      text: `تصفّح عقارات ${user?.office_name || ''}`,
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (_) {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast('تم نسخ رابط البروفايل');
    } catch (_) {
      showToast('تعذّرت المشاركة');
    }
  };

  const logoUrl = user?.office_logo_url || user?.profile_image_url;
  const officeName = user?.office_name || 'مكتبي العقاري';

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7] font-sans pb-20 relative overflow-x-hidden text-zinc-950">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
      `}} />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[150] bg-zinc-950 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
          <CheckCircle className="w-5 h-5" style={{ color: AIRBNB }} />
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* خلفية خفيفة مثل لوحة تحكم الشاليهات */}
      <div className="absolute inset-x-0 top-0 h-[180px] bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-28 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ backgroundColor: AIRBNB }} />
      <div className="absolute top-24 left-[-90px] w-72 h-72 rounded-full bg-zinc-900/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-5 lg:px-8">

        {/* هيدر موحّد مع لوحة تحكم الشاليه */}
        <header className="pt-4 sm:pt-6 pb-4">
          <div className="rounded-[1.6rem] sm:rounded-[2rem] bg-white/95 border border-zinc-200 shadow-[0_14px_44px_rgba(0,0,0,0.07)] backdrop-blur-xl p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3 sm:gap-5">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <div className="w-[58px] h-[58px] sm:w-[68px] sm:h-[68px] rounded-[1.35rem] bg-gradient-to-br from-white to-zinc-100 overflow-hidden flex items-center justify-center border border-zinc-200 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                    {logoUrl ? (
                      <img src={logoUrl} alt="شعار المكتب" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl sm:text-2xl font-black text-zinc-950">
                        {officeName[0]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs font-black text-zinc-400 leading-none mb-1">مرحباً بك</p>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h1 className="text-[15px] sm:text-xl font-black text-zinc-950 truncate leading-tight max-w-[150px] sm:max-w-[420px] lg:max-w-none">
                      {officeName}
                    </h1>
                  </div>

                  <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                    {user?.license_number && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-50 border border-zinc-100 px-2 py-1 text-[10px] sm:text-[11px] font-bold text-zinc-500 max-w-[calc(100vw-185px)] sm:max-w-none">
                        <BadgeCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: AIRBNB }} />
                        <span className="whitespace-nowrap">رخصة موثوق:</span>
                        <span dir="ltr" className="truncate">{user.license_number}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 sm:gap-2 flex-nowrap shrink-0">
                {/* الإشعارات */}
                <div className="relative" ref={notifsRef}>
                  <button
                    onClick={() => setShowNotifs(!showNotifs)}
                    className={`relative h-9 w-9 sm:h-11 sm:w-11 rounded-2xl border transition-all flex items-center justify-center shadow-sm active:scale-[0.98] ${showNotifs ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'}`}
                    title="الإشعارات"
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                  {showNotifs && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[270px] sm:w-80 max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-zinc-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="px-3.5 py-2.5 bg-zinc-950 text-white">
                        <span className="text-sm font-black">الإشعارات</span>
                      </div>
                      <div className="px-4 py-5 text-center">
                        <p className="text-sm text-zinc-400 font-bold">لا توجد إشعارات جديدة</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* الإحصائيات */}
                <div className="relative" ref={revenueRef}>
                  <button
                    onClick={() => setShowRevenue(!showRevenue)}
                    className={`h-9 w-9 sm:h-11 sm:w-11 rounded-2xl border transition-all flex items-center justify-center shadow-sm active:scale-[0.98] ${showRevenue ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'}`}
                    title="إحصائيات العقارات"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  {showRevenue && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-zinc-100 p-4 z-50 text-center animate-in fade-in slide-in-from-top-2">
                      <p className="text-[11px] text-zinc-500 font-bold mb-1">إحصائيات العقارات</p>
                      <p className="text-xl font-black text-zinc-950">
                        {properties.length} <span className="text-[10px] font-bold text-zinc-400">عقار</span>
                      </p>
                    </div>
                  )}
                </div>

                <ProfileMenu onLogout={handleLogout} />
              </div>
            </div>
          </div>
        </header>

        {/* المحتوى */}
        <main className="space-y-6 pb-6">

          {/* عنوان القسم + الأزرار */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-zinc-950">عقاراتي</h2>
              <p className="text-xs font-bold text-zinc-400 mt-1">إدارة عقارات مكتبك ومشاركة صفحتك العامة</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
              <button
                onClick={() => window.open(`${window.location.origin}/agent/${user.id}`, '_blank')}
                className="inline-flex items-center justify-center gap-1.5 bg-white text-zinc-800 px-4 py-2.5 rounded-2xl text-xs font-black shadow-sm border border-zinc-200 hover:bg-zinc-50 transition-all active:scale-[0.98]"
              >
                <Eye className="w-3.5 h-3.5" /> عرض صفحتي
              </button>

              <button
                onClick={copyProfileLink}
                className="inline-flex items-center justify-center gap-1.5 bg-white text-zinc-800 px-4 py-2.5 rounded-2xl text-xs font-black shadow-sm border border-zinc-200 hover:bg-zinc-50 transition-all active:scale-[0.98]"
              >
                <Share2 className="w-3.5 h-3.5" /> شارك
              </button>

              <button
                onClick={() => navigate('/add-property')}
                className="inline-flex items-center justify-center gap-1.5 bg-zinc-950 text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-sm hover:bg-black transition-all active:scale-[0.98]"
              >
                <Plus className="w-3.5 h-3.5" /> أضف عقار
              </button>
            </div>
          </div>

          {/* قائمة العقارات */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 rounded-full border-[3px] border-zinc-100 border-t-[#FF385C] animate-spin" />
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[2rem] border border-zinc-100 shadow-sm">
              <Building2 className="w-12 h-12 text-zinc-300 mb-3 mx-auto" />
              <h3 className="font-black text-base text-zinc-700 mb-1">لا توجد عقارات بعد</h3>
              <p className="text-sm text-zinc-400 mb-5 font-bold">ابدأ بإضافة أول عقار لك</p>
              <button
                onClick={() => navigate('/add-property')}
                className="inline-flex items-center gap-2 bg-zinc-950 text-white px-5 py-2.5 rounded-2xl text-sm font-black hover:bg-black transition-all"
              >
                <Plus className="w-4 h-4" /> أضف عقار
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
              {properties.map((property, i) => (
                <div key={property.id} className="relative group">
                  <PropertyCard property={property} index={i} />
                  <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                    <button
                      className="h-8 w-8 bg-white shadow-lg rounded-xl flex items-center justify-center hover:bg-zinc-50 transition-colors"
                      onClick={(e) => { e.preventDefault(); navigate(`/edit-property/${property.id}`); }}
                      title="تعديل"
                    >
                      <Pencil className="w-3.5 h-3.5 text-zinc-600" />
                    </button>

                    <button
                      className="h-8 w-8 bg-zinc-950 shadow-lg rounded-xl flex items-center justify-center hover:bg-black transition-colors"
                      onClick={(e) => { e.preventDefault(); setExportProperty(property); }}
                      title="تحميل البطاقة"
                    >
                      <Download className="w-3.5 h-3.5 text-white" />
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="h-8 w-8 bg-rose-500 shadow-lg rounded-xl flex items-center justify-center hover:bg-rose-600 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-xs rounded-3xl p-0 overflow-hidden border-0 shadow-2xl" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
                        <div className="px-6 pt-6 pb-2 text-right">
                          <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 mr-auto" style={{ backgroundColor: '#FFF1F2' }}>
                            <Trash2 className="w-5 h-5" style={{ color: AIRBNB }} />
                          </div>
                          <AlertDialogTitle className="text-base font-bold text-zinc-900 mb-1">حذف العقار</AlertDialogTitle>
                          <AlertDialogDescription className="text-sm text-zinc-400 font-medium leading-relaxed">
                            هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </div>
                        <AlertDialogFooter className="flex flex-row-reverse gap-2 px-6 pb-5 pt-3">
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(property.id)}
                            className="flex-1 h-10 rounded-2xl text-sm font-bold text-white border-0"
                            style={{ backgroundColor: AIRBNB }}
                          >
                            حذف
                          </AlertDialogAction>
                          <AlertDialogCancel className="flex-1 h-10 rounded-2xl text-sm font-bold bg-zinc-100 text-zinc-700 border-0 hover:bg-zinc-200">
                            إلغاء
                          </AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <SiteFooter className="mt-4" />

      {/* Export Dialog */}
      <Dialog open={!!exportProperty} onOpenChange={() => setExportProperty(null)}>
        <DialogContent className="max-w-md p-5 max-h-[92vh] overflow-y-auto bg-transparent border-0 shadow-none">
          {exportProperty && <PropertyCardExport property={exportProperty} agent={user} onClose={() => setExportProperty(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
