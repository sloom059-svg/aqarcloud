import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus, Building2, Pencil, Trash2, Share2, Home, Download,
  Bell, Wallet, LogOut, User, ChevronDown, Loader2, CheckCircle
} from "lucide-react";
import PropertyCard from '@/components/property/PropertyCard';
import PropertyCardExport from '@/components/property/PropertyCardExport';

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
  });

  const activeProperties = properties.filter(p => p.status === 'نشط');

  const copyProfileLink = async () => {
    const url = `${window.location.origin}/agent/${user.id}`;
    const shareData = {
      title: user?.office_name || user?.full_name || 'صفحتي العقارية',
      text: `تصفّح عقارات ${user?.office_name || user?.full_name || ''}`,
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (_) {
        return; // المستخدم ألغى المشاركة
      }
    }
    // احتياطي: نسخ الرابط
    try {
      await navigator.clipboard.writeText(url);
      showToast('تم نسخ رابط البروفايل');
    } catch (_) {
      showToast('تعذّرت المشاركة');
    }
  };

  // إيرادات وهمية (الوسيط ما عنده bookings — نعرض عدد العقارات النشطة كمؤشر)
  const totalActive = activeProperties.length;

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

      {/* الخلفية الزرقاء العلوية */}
      <div className="absolute top-0 left-0 right-0 h-[190px] bg-[#15317E] rounded-b-[2.5rem] shadow-lg" />

      <div className="relative z-10 max-w-md mx-auto">

        {/* ══════════════ الهيدر ══════════════ */}
        <header className="px-5 pt-8 pb-6 flex items-center justify-between text-white">

          {/* بيانات المالك */}
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full border-2 border-white/30 bg-white/10 overflow-hidden flex items-center justify-center shadow-lg">
                {user?.office_logo_url || user?.profile_image_url ? (
                  <img src={user.office_logo_url || user.profile_image_url} alt="شعار" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-white">
                    {(user?.office_name || user?.full_name || 'م')[0]}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#15317E] rounded-full" />
            </div>
            <div>
              <p className="text-[11px] text-white/70 mb-0.5 tracking-wider">مرحباً بك،</p>
              <h1 className="text-base font-bold">{user?.office_name || user?.full_name || 'المكتب'}</h1>
            </div>
          </div>

          {/* أيقونات التحكم */}
          <div className="flex items-center gap-2">

            {/* الإشعارات */}
            <div className="relative" ref={notifsRef}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className={`relative p-2.5 rounded-xl backdrop-blur-md transition-all ${showNotifs ? 'bg-white text-[#15317E]' : 'bg-white/10 hover:bg-white/20 text-white/90 hover:text-white'}`}
              >
                <Bell className="w-4 h-4" />
              </button>
              {showNotifs && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 bg-[#15317E] text-white">
                    <span className="text-sm font-bold">الإشعارات</span>
                  </div>
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-slate-400">لا توجد إشعارات جديدة</p>
                  </div>
                </div>
              )}
            </div>

            {/* المحفظة */}
            <div className="relative" ref={revenueRef}>
              <button
                onClick={() => setShowRevenue(!showRevenue)}
                className={`p-2.5 rounded-xl backdrop-blur-md transition-all ${showRevenue ? 'bg-white text-[#15317E]' : 'bg-white/10 hover:bg-white/20 text-white/90'}`}
              >
                <Wallet className="w-4 h-4" />
              </button>
              {showRevenue && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 text-center animate-in fade-in slide-in-from-top-2">
                  <p className="text-[11px] text-slate-500 font-medium mb-1">العقارات النشطة</p>
                  <p className="text-xl font-bold text-[#15317E]">{totalActive} <span className="text-[10px] font-normal text-slate-400">عقار</span></p>
                </div>
              )}
            </div>

            {/* زر الخروج */}
            <ProfileMenu onLogout={handleLogout} />
          </div>
        </header>

        {/* ══════════════ المحتوى ══════════════ */}
        <main className="px-4 space-y-6">

          {/* كروت الإحصائيات */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#15317E]/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-[#15317E]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">إجمالي العقارات</p>
                <p className="text-2xl font-black text-[#15317E] leading-none mt-0.5">{properties.length}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Home className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">عقارات نشطة</p>
                <p className="text-2xl font-black text-emerald-600 leading-none mt-0.5">{activeProperties.length}</p>
              </div>
            </div>
          </div>

          {/* عنوان القسم + الأزرار */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#15317E]">عقاراتي</h2>
            <div className="flex gap-2">
              <button
                onClick={copyProfileLink}
                className="flex items-center gap-1.5 bg-white text-[#15317E] px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" /> شارك بروفايلك
              </button>
              <button
                onClick={() => navigate('/add-property')}
                className="flex items-center gap-1.5 bg-[#15317E] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm hover:bg-[#0d1e4c] transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> أضف عقار
              </button>
            </div>
          </div>

          {/* قائمة العقارات */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#15317E]" />
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm">
              <Building2 className="w-12 h-12 text-slate-300 mb-3 mx-auto" />
              <h3 className="font-bold text-base text-slate-700 mb-1">لا توجد عقارات بعد</h3>
              <p className="text-sm text-slate-400 mb-5">ابدأ بإضافة أول عقار لك</p>
              <button
                onClick={() => navigate('/add-property')}
                className="inline-flex items-center gap-2 bg-[#15317E] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#0d1e4c] transition-all"
              >
                <Plus className="w-4 h-4" /> أضف عقار
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map((property, i) => (
                <div key={property.id} className="relative group">
                  <PropertyCard property={property} index={i} />
                  <div className="absolute top-3 left-3 flex gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      className="h-8 w-8 bg-white shadow-lg rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
                      onClick={(e) => { e.preventDefault(); navigate(`/edit-property/${property.id}`); }}
                    >
                      <Pencil className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                    <button
                      className="h-8 w-8 bg-[#15317E] shadow-lg rounded-lg flex items-center justify-center hover:bg-[#0d1e4c] transition-colors"
                      onClick={(e) => { e.preventDefault(); setExportProperty(property); }}
                    >
                      <Download className="w-3.5 h-3.5 text-white" />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="h-8 w-8 bg-rose-500 shadow-lg rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors"
                          onClick={(e) => e.preventDefault()}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>حذف العقار</AlertDialogTitle>
                          <AlertDialogDescription>
                            هل أنت متأكد من حذف هذا العقار؟ لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-2">
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMutation.mutate(property.id)}>حذف</AlertDialogAction>
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

      {/* Export Dialog */}
      <Dialog open={!!exportProperty} onOpenChange={() => setExportProperty(null)}>
        <DialogContent className="max-w-md p-5 max-h-[92vh] overflow-y-auto bg-transparent border-0 shadow-none">
          {exportProperty && <PropertyCardExport property={exportProperty} agent={user} onClose={() => setExportProperty(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
