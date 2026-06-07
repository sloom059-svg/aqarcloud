import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Loader2, ArrowRight, Building2, Upload, Check, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-lg font-bold text-center text-slate-800 mb-1">ضبط الشعار</h3>
        <p className="text-xs text-slate-400 text-center mb-5">اسحب الصورة وكبّرها لتناسب الدائرة</p>

        {/* منطقة القص */}
        <div
          ref={containerRef}
          className="relative mx-auto overflow-hidden bg-slate-100 select-none touch-none"
          style={{ width: BOX, height: BOX, borderRadius: '1rem' }}
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
          <div className="absolute inset-0 m-[10px] rounded-full border-2 border-white/80 pointer-events-none" />
        </div>

        {/* شريط التكبير */}
        <div className="flex items-center gap-3 mt-5">
          <span className="text-xs text-slate-400">−</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="flex-1 accent-[#15317E]"
          />
          <span className="text-xs text-slate-400">+</span>
        </div>

        {/* الأزرار */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={uploading}
            className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition text-sm flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" /> إلغاء
          </button>
          <button
            onClick={handleConfirm}
            disabled={uploading}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-[#15317E] hover:bg-[#0d1e4c] transition text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> حفظ</>}
          </button>
        </div>
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

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">

      {/* نافذة قص الصورة */}
      {cropSrc && (
        <ImageCropper
          imageSrc={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropSrc(null)}
          uploading={uploadingCrop}
        />
      )}

      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowRight className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-heading font-bold">الملف الشخصي</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6">

            {/* ── الشعار الدائري (وحدة فقط فوق الاسم) ── */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-2 border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shadow-sm">
                  {form.office_logo_url ? (
                    <img src={form.office_logo_url} alt="شعار" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-[#15317E]/30">{initials}</span>
                  )}
                </div>
                <label className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-[#15317E] text-white flex items-center justify-center cursor-pointer hover:bg-[#0d1e4c] transition shadow-md">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                </label>
              </div>
              <p className="text-sm font-bold text-slate-700 mt-3">{form.full_name || 'بدون اسم'}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>

            <div className="space-y-4">

              {/* الاسم الشخصي */}
              <div className="space-y-2">
                <Label>الاسم الشخصي</Label>
                <Input
                  value={form.full_name}
                  onChange={(e) => setForm(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="اسمك الكامل"
                />
              </div>

              {/* اسم المكتب - للوسطاء فقط */}
              {isAgent && (
                <div className="space-y-2">
                  <Label>اسم المكتب العقاري</Label>
                  <div className="relative">
                    <Building2 className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={form.office_name}
                      onChange={(e) => setForm(prev => ({ ...prev, office_name: e.target.value }))}
                      placeholder="مثال: مكتب النخبة العقاري"
                      className="pr-9"
                    />
                  </div>
                </div>
              )}

              {/* الجوال والواتساب */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>رقم الجوال</Label>
                  <Input value={form.phone} onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))} placeholder="05xxxxxxxx" dir="ltr" />
                </div>
                <div className="space-y-2">
                  <Label>رقم الواتساب</Label>
                  <Input value={form.whatsapp} onChange={(e) => setForm(prev => ({ ...prev, whatsapp: e.target.value }))} placeholder="966xxxxxxxxx" dir="ltr" />
                </div>
              </div>

              {/* المدينة ورخصة الوساطة */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المدينة</Label>
                  <Select value={form.city} onValueChange={(v) => setForm(prev => ({ ...prev, city: v }))}>
                    <SelectTrigger><SelectValue placeholder="اختر المدينة" /></SelectTrigger>
                    <SelectContent>
                      {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {isAgent && (
                  <div className="space-y-2">
                    <Label>رقم رخصة الوساطة</Label>
                    <Input value={form.license_number} onChange={(e) => setForm(prev => ({ ...prev, license_number: e.target.value }))} placeholder="رقم الرخصة" dir="ltr" />
                  </div>
                )}
              </div>

              {/* نبذة */}
              <div className="space-y-2">
                <Label>نبذة عنك</Label>
                <Textarea value={form.bio} onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))} placeholder="اكتب نبذة مختصرة عنك..." rows={4} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'حفظ التغييرات'}
        </Button>
      </form>
    </div>
  );
}
