import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';
import {
  Loader2, Check, ArrowRight, ArrowLeft, X, Upload, Trash2,
  PartyPopper, Eye, LayoutDashboard, Crown, Sun, Image as ImageIcon,
  MapPin, Home, DollarSign, Sparkles, Clock, Phone
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const TOTAL_STEPS = 7;

const CITIES = ["الرياض","جدة","مكة المكرمة","المدينة المنورة","الدمام","الخبر","الطائف","تبوك","بريدة","حائل","أبها","خميس مشيط","جازان","نجران","ينبع","الجبيل","الأحساء","القطيف","الرس","عنيزة","الزلفي","المجمعة","شقراء","الدوادمي","سكاكا","القريات","عرعر","بيشة","الباحة","رابغ","القنفذة"];

const ALL_FEATURES = ["مسبح","جلسات خارجية","واي فاي","ملعب","مطبخ","دخول ذاتي","ألعاب أطفال","شواء","قسم رجال","قسم نساء","غرف نوم","حديقة","مولد كهرباء","مكيف","مدفأة"];

const VENUE_TYPES = [
  { id: 'شاليه', label: 'شاليه', Icon: Home },
  { id: 'مخيم', label: 'مخيم', Icon: Sun },
  { id: 'مزرعة', label: 'مزرعة', Icon: Sparkles },
  { id: 'استراحة', label: 'استراحة', Icon: Home },
];

export default function VenueWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();

  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successVenue, setSuccessVenue] = useState(null);

  const [form, setForm] = useState({
    name: '', venue_type: '', description: '', city: '',
    maps_url: '', images: [], youtube_urls: [],
    custom_features: [],
    social: { instagram: '', snapchat: '', tiktok: '', x: '' },
    page_theme: 'classic',
    price_weekday: '', price_weekend: '',
    whatsapp: '', check_in_time: '14:00', check_out_time: '12:00',
    booking_terms: '', features: [], status: 'نشط', slug: '',
    theme_color: '#c9a96e',
  });

  useEffect(() => {
    if (user?.business_type && !form.venue_type) {
      setForm(prev => ({ ...prev, venue_type: user.business_type }));
    }
  }, [user]);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const toggleFeature = (f) => setForm(prev => ({
    ...prev,
    features: prev.features.includes(f) ? prev.features.filter(x => x !== f) : [...prev.features, f]
  }));

  const handleImgUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const urls = [...form.images];
    for (const file of files.slice(0, 10 - urls.length)) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        urls.push(file_url);
      } catch (_) {}
    }
    set('images', urls);
    setUploading(false);
  };

  const removeImg = (i) => set('images', form.images.filter((_, idx) => idx !== i));

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  // التحقق من كل خطوة
  const canProceed = () => {
    if (step === 1) return !!form.venue_type;
    if (step === 2) return form.name.trim() && form.city;
    if (step === 5) return form.images.length > 0;
    if (step === 6) return !!form.whatsapp.trim();
    return true;
  };

  const handleSubmit = async () => {
    setSaving(true);
    const cleanSocial = {};
    Object.entries(form.social || {}).forEach(([k, v]) => { if (v && v.trim()) cleanSocial[k] = v.trim(); });

    const data = {
      ...form,
      price_weekday: form.price_weekday ? Number(form.price_weekday) : undefined,
      price_weekend: form.price_weekend ? Number(form.price_weekend) : undefined,
      owner_id: user?.id,
      slug: form.slug || `venue-${Date.now()}`,
      social: cleanSocial,
    };

    try {
      const created = await base44.entities.Venue.create(data);
      await qc.invalidateQueries({ queryKey: ['venues'] });
      const slug = created?.slug || data.slug;
      setSuccessVenue({ name: form.name, slug, url: `${window.location.origin}/place/${slug}` });
    } catch (err) {
      toast.error('حدث خطأ: ' + (err?.message || 'تعذّر الحفظ'));
    } finally {
      setSaving(false);
    }
  };

  // ══════════ شاشة النجاح ══════════
  if (successVenue) {
    const isRoyal = form.page_theme === 'royal';
    return (
      <div dir="rtl" className={`min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden ${isRoyal ? 'bg-[#0a0e1a]' : 'bg-gradient-to-b from-[#15317E] to-[#0a1840]'}`}>
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
          * { font-family: 'Cairo', sans-serif; }
          @keyframes pop { 0% { transform: scale(0); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
          @keyframes fadeUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        `}} />
        {/* دوائر زخرفية */}
        <div className={`absolute top-10 right-10 w-40 h-40 rounded-full blur-3xl opacity-20 ${isRoyal ? 'bg-[#d4af37]' : 'bg-white'}`} />
        <div className={`absolute bottom-10 left-10 w-52 h-52 rounded-full blur-3xl opacity-10 ${isRoyal ? 'bg-[#d4af37]' : 'bg-white'}`} />

        <div className="relative z-10 max-w-sm w-full">
          <div className="mb-8" style={{ animation: 'pop 0.6s cubic-bezier(0.16,1,0.3,1)' }}>
            <div className={`w-28 h-28 rounded-full mx-auto flex items-center justify-center shadow-2xl ${isRoyal ? 'bg-[#d4af37]' : 'bg-white'}`}>
              <PartyPopper className={`w-14 h-14 ${isRoyal ? 'text-[#0a0e1a]' : 'text-[#15317E]'}`} />
            </div>
          </div>

          <div style={{ animation: 'fadeUp 0.6s ease-out 0.2s both' }}>
            <h1 className={`text-3xl font-black mb-3 ${isRoyal ? 'text-[#d4af37]' : 'text-white'}`}>🎉 مبروك!</h1>
            <p className="text-white/80 text-base mb-2 leading-relaxed">
              تم نشر صفحة <span className="font-bold">{successVenue.name}</span> بنجاح
            </p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-8 ${isRoyal ? 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30' : 'bg-white/15 text-white border border-white/20'}`}>
              <Sparkles className="w-4 h-4" /> معك تجربة مجانية ١٤ يوم
            </div>
          </div>

          <div className="space-y-3" style={{ animation: 'fadeUp 0.6s ease-out 0.4s both' }}>
            <button onClick={() => window.open(successVenue.url, '_blank')}
              className={`w-full py-4 rounded-2xl font-bold text-base shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 ${isRoyal ? 'bg-[#d4af37] text-[#0a0e1a] hover:bg-[#c9a227]' : 'bg-white text-[#15317E] hover:bg-slate-50'}`}>
              <Eye className="w-5 h-5" /> عرض صفحتي
            </button>
            <button onClick={() => navigate('/venue')}
              className="w-full py-4 rounded-2xl font-bold text-base border transition-all flex items-center justify-center gap-2 active:scale-95 bg-white/10 text-white border-white/20 hover:bg-white/20">
              <LayoutDashboard className="w-5 h-5" /> الدخول إلى لوحة التحكم
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = (step / TOTAL_STEPS) * 100;
  const isLast = step === TOTAL_STEPS;
  const isAutoStep = step === 1;

  return (
    <div dir="rtl" className="min-h-screen bg-[#f4f7fb] font-sans flex flex-col items-center py-8 px-4"
      style={{ backgroundImage: 'radial-gradient(at 0% 0%, hsla(225,39%,30%,0.05) 0px, transparent 50%), radial-gradient(at 100% 0%, hsla(40,45%,61%,0.05) 0px, transparent 50%)', backgroundAttachment: 'fixed' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');
        body { font-family: 'IBM Plex Sans Arabic', sans-serif; }
      `}} />

      <div className="w-full max-w-xl mx-auto">
        {/* الهيدر والتقدم */}
        <div className="mb-6 px-2 flex justify-between items-center">
          <button onClick={prev} disabled={step === 1}
            className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-[#15317E] transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}>
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="flex-1 px-6">
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#15317E] transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-center text-[11px] text-slate-400 font-bold mt-2">{step} من {TOTAL_STEPS}</p>
          </div>
          <button onClick={() => navigate('/venue')}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(21,49,126,0.08)] p-6 md:p-10 min-h-[460px] flex flex-col">
          <div className="flex-1">

            {/* خطوة ١: نوع المكان */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">ما نوع منشأتك؟</h2>
                <p className="text-slate-400 text-sm mb-8">اختر النوع المناسب لبدء الإعداد</p>
                <div className="grid grid-cols-2 gap-4">
                  {VENUE_TYPES.map(t => (
                    <button key={t.id} onClick={() => { set('venue_type', t.id); setTimeout(next, 250); }}
                      className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all active:scale-95 ${form.venue_type === t.id ? 'border-[#15317E] bg-[#15317E]/5' : 'border-slate-100 hover:border-slate-200'}`}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${form.venue_type === t.id ? 'bg-[#15317E] text-white' : 'bg-slate-50 text-slate-400'}`}>
                        <t.Icon className="w-7 h-7" />
                      </div>
                      <span className="font-bold text-slate-700">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* خطوة ٢: الاسم والمدينة */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">المعلومات الأساسية</h2>
                <p className="text-slate-400 text-sm mb-8">اسم المنشأة والمدينة</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">اسم المنشأة *</label>
                    <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="مثال: شاليه الواحة"
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#15317E] focus:ring-2 focus:ring-[#15317E]/10 outline-none transition-all text-sm font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">المدينة *</label>
                    <select value={form.city} onChange={e => set('city', e.target.value)}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#15317E] focus:ring-2 focus:ring-[#15317E]/10 outline-none transition-all text-sm font-medium">
                      <option value="">اختر المدينة</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">وصف مختصر <span className="text-slate-400 font-normal">(اختياري)</span></label>
                    <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="نبذة جميلة عن المنشأة..."
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#15317E] focus:ring-2 focus:ring-[#15317E]/10 outline-none transition-all text-sm font-medium resize-none" />
                  </div>
                </div>
              </div>
            )}

            {/* خطوة ٣: المميزات */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">المميزات والخدمات</h2>
                <p className="text-slate-400 text-sm mb-8">اختر ما يتوفر في منشأتك</p>
                <div className="flex flex-wrap gap-2.5">
                  {ALL_FEATURES.map(f => (
                    <button key={f} onClick={() => toggleFeature(f)}
                      className={`px-4 py-2.5 rounded-full text-sm font-bold border transition-all active:scale-95 ${form.features.includes(f) ? 'bg-[#15317E] text-white border-[#15317E]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* خطوة ٤: الأسعار */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">الأسعار</h2>
                <p className="text-slate-400 text-sm mb-8">سعر الليلة (يمكنك تركها فارغة)</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">سعر أيام الأسبوع</label>
                    <div className="relative">
                      <input type="number" value={form.price_weekday} onChange={e => set('price_weekday', e.target.value)} placeholder="0"
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#15317E] focus:ring-2 focus:ring-[#15317E]/10 outline-none text-sm font-bold" dir="ltr" />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">ر.س</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">سعر نهاية الأسبوع <span className="text-slate-400 font-normal">(خميس/جمعة)</span></label>
                    <div className="relative">
                      <input type="number" value={form.price_weekend} onChange={e => set('price_weekend', e.target.value)} placeholder="0"
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#15317E] focus:ring-2 focus:ring-[#15317E]/10 outline-none text-sm font-bold" dir="ltr" />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">ر.س</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* خطوة ٥: الصور */}
            {step === 5 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">صور المنشأة</h2>
                <p className="text-slate-400 text-sm mb-3">أضف صوراً جذابة (حتى ١٠ صور)</p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-6 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <p className="text-[12px] text-amber-700 font-bold">أول صورة ستكون الغلاف العلوي للصفحة</p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {i === 0 && <span className="absolute top-1.5 right-1.5 bg-[#15317E] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">الغلاف</span>}
                      <button onClick={() => removeImg(i)} className="absolute top-1.5 left-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {form.images.length < 10 && (
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#15317E] hover:bg-slate-50 transition-all">
                      {uploading ? <Loader2 className="w-6 h-6 text-[#15317E] animate-spin" /> : <><Upload className="w-6 h-6 text-slate-400" /><span className="text-[10px] text-slate-400 font-bold">إضافة</span></>}
                      <input type="file" accept="image/*" multiple onChange={handleImgUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* خطوة ٦: التواصل والمظهر */}
            {step === 6 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">التواصل والمظهر</h2>
                <p className="text-slate-400 text-sm mb-8">رقم الحجز وثيم الصفحة</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">رقم واتساب للحجز *</label>
                    <input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="9665xxxxxxxx" dir="ltr"
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#15317E] focus:ring-2 focus:ring-[#15317E]/10 outline-none text-sm font-bold text-right" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-3">ثيم الصفحة</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => set('page_theme', 'classic')}
                        className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${form.page_theme === 'classic' ? 'border-[#15317E] bg-[#15317E]/5' : 'border-slate-100'}`}>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#15317E] to-[#4a6cb3] flex items-center justify-center"><Sun className="w-6 h-6 text-white" /></div>
                        <span className="font-bold text-sm text-slate-700">كلاسيكي</span>
                      </button>
                      <button onClick={() => set('page_theme', 'royal')}
                        className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${form.page_theme === 'royal' ? 'border-[#d4af37] bg-[#d4af37]/5' : 'border-slate-100'}`}>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0a0e1a] to-[#1a2238] flex items-center justify-center"><Crown className="w-6 h-6 text-[#d4af37]" /></div>
                        <span className="font-bold text-sm text-slate-700">ملكي فاخر</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* خطوة ٧: المراجعة */}
            {step === 7 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">مراجعة أخيرة</h2>
                <p className="text-slate-400 text-sm mb-8">تأكد من البيانات قبل النشر</p>
                <div className="space-y-3">
                  {[
                    { icon: Home, label: 'النوع', val: form.venue_type },
                    { icon: MapPin, label: 'الاسم والمدينة', val: `${form.name} · ${form.city}` },
                    { icon: Sparkles, label: 'المميزات', val: `${form.features.length} ميزة` },
                    { icon: DollarSign, label: 'السعر', val: form.price_weekday ? `${form.price_weekday} ر.س` : 'غير محدد' },
                    { icon: ImageIcon, label: 'الصور', val: `${form.images.length} صورة` },
                    { icon: Phone, label: 'واتساب', val: form.whatsapp || '—' },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#15317E] shadow-sm"><r.icon className="w-4 h-4" /></div>
                      <span className="text-xs text-slate-400 font-bold">{r.label}</span>
                      <span className="text-sm font-bold text-slate-700 mr-auto">{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* أزرار التنقل */}
          <div className="mt-8 pt-4 flex justify-end items-center">
            {isLast ? (
              <button onClick={handleSubmit} disabled={saving}
                className="px-8 py-3.5 rounded-full font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-60">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري النشر...</> : <>احفظ وانشر <Check className="w-4 h-4" /></>}
              </button>
            ) : !isAutoStep ? (
              <button onClick={next} disabled={!canProceed()}
                className="px-8 py-3.5 rounded-full font-bold text-white bg-[#15317E] hover:bg-[#0d1e4c] shadow-lg shadow-[#15317E]/30 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
                متابعة <ArrowLeft className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
