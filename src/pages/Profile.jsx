import React, { useState, useRef } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  Loader2,
  ArrowRight,
  Building2,
  Check,
  X,
  UserRound,
  Phone,
  MessageCircle,
  MapPin,
  BadgeCheck,
  FileText,
  Sparkles,
  Save,
  Mail,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AIRBNB = '#FF385C';
const DARK = '#222222';

const CITIES = ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "الطائف", "تبوك", "بريدة", "حائل", "أبها", "خميس مشيط", "جازان", "نجران", "ينبع", "الجبيل", "الأحساء", "القطيف", "الرس", "عنيزة", "الزلفي", "المجمعة", "شقراء", "الدوادمي", "الأفلاج", "وادي الدواسر", "سكاكا", "القريات", "عرعر", "رفحاء", "طريف", "الوجه", "أملج", "ضباء", "البدع", "بيشة", "محايل عسير", "صبيا", "أبو عريش", "صامطة", "الليث", "رابغ", "القنفذة", "الباحة", "بلجرشي", "المندق", "مدينة الملك عبدالله الاقتصادية"];

// ════════════════════════════════════════════
// نافذة قص الصورة الدائرية (زي واتساب وتويتر)
// ════════════════════════════════════════════
function ImageCropper({ imageSrc, onConfirm, onCancel, uploading }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const BOX = 260; // حجم منطقة القص

  const startDrag = (clientX, clientY) => {
    dragging.current = true;
    lastPos.current = { x: clientX, y: clientY };
  };
  const moveDrag = (clientX, clientY) => {
    if (!dragging.current) return;
    const dx = clientX - lastPos.current.x;
    const dy = clientY - lastPos.current.y;
    lastPos.current = { x: clientX, y: clientY };
    setPos(p => ({ x: p.x + dx, y: p.y + dy }));
  };
  const endDrag = () => { dragging.current = false; };

  // قص الصورة على canvas دائري
  const handleConfirm = () => {
    const canvas = document.createElement('canvas');
    const size = 400;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const img = imgRef.current;
    if (!img) return;

    // نسبة العرض للصورة المعروضة
    const displayedW = img.naturalWidth * (BOX / Math.min(img.naturalWidth, img.naturalHeight)) * scale;
    const displayedH = img.naturalHeight * (BOX / Math.min(img.naturalWidth, img.naturalHeight)) * scale;

    const ratio = size / BOX;

    // خلفية بيضاء
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);

    // رسم الصورة بنفس الإزاحة والتكبير
    const drawW = displayedW * ratio;
    const drawH = displayedH * ratio;
    const drawX = (size - drawW) / 2 + pos.x * ratio;
    const drawY = (size - drawH) / 2 + pos.y * ratio;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    canvas.toBlob((blob) => {
      const file = new File([blob], 'logo.png', { type: 'image/png' });
      onConfirm(file);
    }, 'image/png', 0.92);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/65 backdrop-blur-sm" dir="rtl">
      <div className="w-full max-w-sm overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.22)] border border-white">
        <div className="p-6">
          <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-[#FF385C]/10 text-[#FF385C] flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-center text-zinc-950 mb-1">ضبط الشعار</h3>
          <p className="text-xs font-bold text-zinc-400 text-center mb-5">اسحب الصورة وكبّرها لتناسب الدائرة</p>

          {/* منطقة القص */}
          <div
            ref={containerRef}
            className="relative mx-auto overflow-hidden bg-zinc-100 select-none touch-none shadow-inner"
            style={{ width: BOX, height: BOX, borderRadius: '1.5rem' }}
            onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
            onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onTouchStart={(e) => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={endDrag}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="قص"
              draggable={false}
              className="absolute top-1/2 left-1/2 pointer-events-none"
              style={{
                height: BOX,
                width: 'auto',
                minWidth: BOX,
                objectFit: 'cover',
                transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(${scale})`,
                transformOrigin: 'center',
              }}
            />
            {/* قناع دائري مظلل */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: `0 0 0 9999px rgba(0,0,0,0.45)`,
                borderRadius: '50%',
                margin: 'auto',
                width: BOX - 20,
                height: BOX - 20,
                top: 10, left: 10, right: 10, bottom: 10,
              }}
            />
            <div className="absolute inset-0 m-[10px] rounded-full border-2 border-white/85 pointer-events-none" />
          </div>

          {/* شريط التكبير */}
          <div className="flex items-center gap-3 mt-5">
            <span className="text-xs font-black text-zinc-400">−</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="flex-1 accent-[#FF385C]"
            />
            <span className="text-xs font-black text-zinc-400">+</span>
          </div>

          {/* الأزرار */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={onCancel}
              disabled={uploading}
              className="py-3 rounded-2xl font-black text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <X className="w-4 h-4" /> إلغاء
            </button>
            <button
              onClick={handleConfirm}
              disabled={uploading}
              className="py-3 rounded-2xl font-black text-white bg-[#222222] hover:bg-black transition text-sm flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-black/15"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> حفظ</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldIcon({ children }) {
  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-500 pointer-events-none">
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-11 h-11 rounded-2xl bg-[#FF385C]/10 text-[#FF385C] flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-base sm:text-lg font-black text-zinc-950 leading-tight">{title}</h2>
        {subtitle && <p className="text-xs sm:text-sm font-bold text-zinc-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// صفحة الملف الشخصي
// ════════════════════════════════════════════
export default function Profile() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const isAgent = user?.business_type === 'وسيط';

  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    office_name: user?.office_name || '',
    phone: user?.phone || '',
    whatsapp: user?.whatsapp || '',
    bio: user?.bio || '',
    license_number: user?.license_number || '',
    city: user?.city || '',
    office_logo_url: user?.office_logo_url || '',
  });

  const [cropSrc, setCropSrc] = useState(null);   // الصورة المراد قصها
  const [uploadingCrop, setUploadingCrop] = useState(false);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: async () => {
      await refreshUser();
      toast.success('تم تحديث الملف الشخصي');
      navigate(isAgent ? '/' : '/venue');
    },
  });

  // عند اختيار ملف → افتح نافذة القص
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result);
    reader.readAsDataURL(file);
    e.target.value = ''; // إعادة تعيين الإدخال
  };

  // بعد القص → رفع الصورة وحفظها فوراً
  const handleCropConfirm = async (croppedFile) => {
    setUploadingCrop(true);
    try {
      // حذف الشعار القديم لو موجود
      if (form.office_logo_url) {
        await base44.integrations.Core.DeleteFile(form.office_logo_url);
      }
      const { file_url } = await base44.integrations.Core.UploadFile({ file: croppedFile });
      setForm(prev => ({ ...prev, office_logo_url: file_url }));

      // حفظ الشعار مباشرة في قاعدة البيانات
      await base44.auth.updateMe({ office_logo_url: file_url });
      await refreshUser();

      setCropSrc(null);
      toast.success('تم حفظ الشعار ✅');
    } catch (err) {
      toast.error('تعذّر رفع الصورة');
    } finally {
      setUploadingCrop(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  const initials = (form.full_name || user?.full_name || '؟').split(' ').map(n => n[0]).join('').slice(0, 2);
  const displayName = form.office_name || form.full_name || user?.office_name || user?.full_name || 'ملفي الشخصي';

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7] text-zinc-950 font-sans relative overflow-hidden pb-14">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
      `}} />

      {/* نافذة قص الصورة */}
      {cropSrc && (
        <ImageCropper
          imageSrc={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropSrc(null)}
          uploading={uploadingCrop}
        />
      )}

      {/* خلفية خفيفة بنفس روح الثيم الجديد */}
      <div className="absolute inset-x-0 top-0 h-[230px] bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute -top-36 -right-28 w-80 h-80 rounded-full bg-[#FF385C]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-20 -left-28 w-72 h-72 rounded-full bg-zinc-900/5 blur-3xl pointer-events-none" />

      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* الهيدر */}
        <div className="rounded-[1.75rem] sm:rounded-[2.25rem] bg-white/95 border border-zinc-200 shadow-[0_18px_55px_rgba(0,0,0,0.07)] backdrop-blur-xl p-4 sm:p-5 mb-5 sm:mb-7">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="h-11 w-11 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-all text-zinc-900 flex items-center justify-center shadow-sm active:scale-[0.98]"
              aria-label="رجوع"
            >
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF385C]/10 text-[#FF385C] text-[11px] sm:text-xs font-black mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                تعديل الملف الشخصي
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-zinc-950 leading-tight truncate">{displayName}</h1>
              <p className="text-xs sm:text-sm font-bold text-zinc-400 mt-1">حدّث بياناتك وشعارك ومعلومات التواصل من مكان واحد</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-[320px_1fr] gap-5 sm:gap-6 items-start">
          {/* بطاقة الهوية */}
          <aside className="lg:sticky lg:top-6 rounded-[2rem] bg-white border border-zinc-200 shadow-[0_18px_55px_rgba(0,0,0,0.07)] overflow-hidden">
            <div className="h-24 bg-[#FF385C] relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/15 blur-2xl" />
              <div className="absolute -bottom-12 right-6 w-32 h-32 rounded-full bg-white/10 blur-xl" />
            </div>

            <div className="px-6 pb-6 -mt-14 relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-28 h-28 rounded-[2rem] border-4 border-white bg-zinc-100 overflow-hidden flex items-center justify-center shadow-[0_18px_45px_rgba(0,0,0,0.16)]">
                    {form.office_logo_url ? (
                      <img src={form.office_logo_url} alt="شعار" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-black text-zinc-950/35">{initials}</span>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -left-2 w-11 h-11 rounded-2xl bg-[#222222] text-white flex items-center justify-center cursor-pointer hover:bg-black transition shadow-lg shadow-black/20 active:scale-95">
                    {uploadingCrop ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                  </label>
                </div>

                <h2 className="mt-5 text-lg font-black text-zinc-950 leading-tight max-w-full truncate">{displayName}</h2>
                <p className="mt-1 text-xs font-bold text-zinc-400 max-w-full truncate">{user?.email}</p>

                <div className="mt-5 grid grid-cols-1 gap-2 w-full">
                  <div className="rounded-2xl bg-zinc-50 border border-zinc-100 px-4 py-3 flex items-center gap-3 text-right">
                    <div className="w-9 h-9 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center text-[#FF385C] shrink-0">
                      <UserRound className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-black text-zinc-400">نوع الحساب</p>
                      <p className="text-sm font-black text-zinc-900 truncate">{user?.business_type || 'غير محدد'}</p>
                    </div>
                  </div>

                  {isAgent && form.license_number && (
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-100 px-4 py-3 flex items-center gap-3 text-right">
                      <div className="w-9 h-9 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center text-[#FF385C] shrink-0">
                        <BadgeCheck className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-zinc-400">رخصة موثوق</p>
                        <p dir="ltr" className="text-sm font-black text-zinc-900 truncate text-right">{form.license_number}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* النموذج */}
          <section className="space-y-5 sm:space-y-6">
            <div className="rounded-[2rem] bg-white border border-zinc-200 shadow-[0_18px_55px_rgba(0,0,0,0.07)] p-5 sm:p-6">
              <SectionTitle
                icon={UserRound}
                title="المعلومات الأساسية"
                subtitle="الأسماء والبيانات التي تظهر في حسابك"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* الاسم الشخصي */}
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-black text-zinc-800">الاسم الشخصي</Label>
                  <div className="relative">
                    <FieldIcon><UserRound className="w-4 h-4" /></FieldIcon>
                    <Input
                      value={form.full_name}
                      onChange={(e) => setForm(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="اسمك الكامل"
                      className="h-[52px] rounded-2xl border-zinc-200 bg-zinc-50/70 pr-14 font-bold text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-[#FF385C]/25 focus-visible:border-[#FF385C]"
                    />
                  </div>
                </div>

                {/* اسم المكتب - للوسطاء فقط */}
                {isAgent && (
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-sm font-black text-zinc-800">اسم المكتب العقاري</Label>
                    <div className="relative">
                      <FieldIcon><Building2 className="w-4 h-4" /></FieldIcon>
                      <Input
                        value={form.office_name}
                        onChange={(e) => setForm(prev => ({ ...prev, office_name: e.target.value }))}
                        placeholder="مثال: مكتب النخبة العقاري"
                        className="h-[52px] rounded-2xl border-zinc-200 bg-zinc-50/70 pr-14 font-bold text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-[#FF385C]/25 focus-visible:border-[#FF385C]"
                      />
                    </div>
                  </div>
                )}

                {/* المدينة */}
                <div className="space-y-2">
                  <Label className="text-sm font-black text-zinc-800">المدينة</Label>
                  <div className="relative">
                    <FieldIcon><MapPin className="w-4 h-4" /></FieldIcon>
                    <Input
                      value={form.city}
                      onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="اكتب اسم المدينة"
                      className="h-[52px] rounded-2xl border-zinc-200 bg-zinc-50/70 pr-14 font-bold text-zinc-900 focus:ring-[#FF385C]/25 focus:border-[#FF385C]"
                    />
                  </div>
                </div>

                {/* رخصة الوساطة */}
                {isAgent && (
                  <div className="space-y-2">
                    <Label className="text-sm font-black text-zinc-800">رقم رخصة الوساطة</Label>
                    <div className="relative">
                      <FieldIcon><BadgeCheck className="w-4 h-4" /></FieldIcon>
                      <Input
                        value={form.license_number}
                        onChange={(e) => setForm(prev => ({ ...prev, license_number: e.target.value }))}
                        placeholder="رقم الرخصة"
                        dir="ltr"
                        className="h-[52px] rounded-2xl border-zinc-200 bg-zinc-50/70 pr-14 font-bold text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-[#FF385C]/25 focus-visible:border-[#FF385C]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] bg-white border border-zinc-200 shadow-[0_18px_55px_rgba(0,0,0,0.07)] p-5 sm:p-6">
              <SectionTitle
                icon={Phone}
                title="بيانات التواصل"
                subtitle="الأرقام التي يستخدمها العملاء للتواصل معك"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-black text-zinc-800">رقم الجوال</Label>
                  <div className="relative">
                    <FieldIcon><Phone className="w-4 h-4" /></FieldIcon>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="05xxxxxxxx"
                      dir="ltr"
                      className="h-[52px] rounded-2xl border-zinc-200 bg-zinc-50/70 pr-14 font-bold text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-[#FF385C]/25 focus-visible:border-[#FF385C]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-black text-zinc-800">رقم الواتساب</Label>
                  <div className="relative">
                    <FieldIcon><MessageCircle className="w-4 h-4" /></FieldIcon>
                    <Input
                      value={form.whatsapp}
                      onChange={(e) => setForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                      placeholder="966xxxxxxxxx"
                      dir="ltr"
                      className="h-[52px] rounded-2xl border-zinc-200 bg-zinc-50/70 pr-14 font-bold text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-[#FF385C]/25 focus-visible:border-[#FF385C]"
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-black text-zinc-800">البريد الإلكتروني</Label>
                  <div className="relative">
                    <FieldIcon><Mail className="w-4 h-4" /></FieldIcon>
                    <Input
                      value={user?.email || ''}
                      readOnly
                      dir="ltr"
                      className="h-[52px] rounded-2xl border-zinc-200 bg-zinc-100/70 pr-14 font-bold text-zinc-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white border border-zinc-200 shadow-[0_18px_55px_rgba(0,0,0,0.07)] p-5 sm:p-6">
              <SectionTitle
                icon={FileText}
                title="نبذة مختصرة"
                subtitle="اكتب وصفاً بسيطاً يظهر لعملائك"
              />

              <div className="space-y-2">
                <Label className="text-sm font-black text-zinc-800">نبذة عنك</Label>
                <Textarea
                  value={form.bio}
                  onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="اكتب نبذة مختصرة عنك..."
                  rows={5}
                  className="rounded-2xl border-zinc-200 bg-zinc-50/70 p-4 font-bold text-zinc-900 placeholder:text-zinc-400 resize-none focus-visible:ring-[#FF385C]/25 focus-visible:border-[#FF385C]"
                />
              </div>
            </div>

            <div className="rounded-[2rem] bg-white/95 border border-zinc-200 shadow-[0_18px_55px_rgba(0,0,0,0.07)] p-4 sm:p-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="text-sm font-bold text-zinc-500 leading-relaxed">
                تأكد من صحة البيانات قبل الحفظ، لأنها تظهر في صفحة العرض والتواصل.
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={updateMutation.isPending}
                className="h-[52px] rounded-2xl px-8 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-black shadow-xl shadow-[#FF385C]/20 active:scale-[0.98] transition-all"
              >
                {updateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 ml-2" /> حفظ التغييرات</>}
              </Button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}
