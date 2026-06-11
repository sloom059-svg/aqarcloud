import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  Bed,
  Camera,
  CalendarDays,
  Check,
  Clock,
  Crown,
  Dumbbell,
  Eye,
  Flame,
  Home,
  Image as ImageIcon,
  Instagram,
  LayoutDashboard,
  Link as LinkIcon,
  Loader2,
  MapPin,
  MessageCircle,
  Palette,
  PartyPopper,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Trash2,
  Tv,
  Upload,
  UtensilsCrossed,
  Waves,
  Wifi,
  Wind,
  X,
  Youtube,
} from 'lucide-react';

const TOTAL_STEPS = 9;
const MAX_YOUTUBE = 5;

const DEFAULT_BOOKING_TERMS = `- يتم تأكيد الحجز بعد دفع العربون المتفق عليه.
- وقت الدخول حسب الموعد المحدد في الصفحة، ووقت الخروج حسب الموعد المحدد.
- يرجى المحافظة على نظافة المكان والممتلكات.
- يمنع إزعاج الجيران أو استخدام المكان بما يخالف الأنظمة.
- في حال الإلغاء أو تغيير الموعد يتم التنسيق مسبقاً مع الإدارة.`;

const BRAND = '#FF385C';
const BRAND_DARK = '#E31C5F';

const ALL_FEATURES = [
  'مسبح',
  'جلسات خارجية',
  'واي فاي',
  'ملعب',
  'مطبخ',
  'دخول ذاتي',
  'ألعاب أطفال',
  'شواء',
  'قسم رجال',
  'قسم نساء',
  'غرف نوم',
  'حديقة',
  'مولد كهرباء',
  'مكيف',
  'مدفأة',
];

const VENUE_TYPES = [
  { id: 'شاليه', label: 'شاليه', Icon: Home },
  { id: 'مخيم', label: 'مخيم', Icon: Sun },
  { id: 'مزرعة', label: 'مزرعة', Icon: Sparkles },
  { id: 'استراحة', label: 'استراحة', Icon: Home },
];

const CUSTOM_ICON_OPTIONS = [
  { key: 'star', label: 'نجمة', Icon: Star },
  { key: 'shield', label: 'درع', Icon: ShieldCheck },
  { key: 'waves', label: 'مسبح', Icon: Waves },
  { key: 'wifi', label: 'واي فاي', Icon: Wifi },
  { key: 'grill', label: 'مطبخ', Icon: UtensilsCrossed },
  { key: 'tv', label: 'تلفاز', Icon: Tv },
  { key: 'gym', label: 'رياضة', Icon: Dumbbell },
  { key: 'bath', label: 'دورة مياه', Icon: Bath },
  { key: 'ac', label: 'تكييف', Icon: Wind },
  { key: 'sun', label: 'خارجي', Icon: Sun },
];

const THEME_COLORS = [
  { name: 'ذهبي', value: '#c9a96e' },
  { name: 'أخضر زمردي', value: '#0f3d36' },
  { name: 'كحلي', value: '#1e304a' },
  { name: 'نبيتي', value: '#7c2d3a' },
  { name: 'بني فاخر', value: '#6b4f3a' },
  { name: 'تركوازي', value: '#1d7874' },
  { name: 'بنفسجي', value: '#5b3a70' },
  { name: 'أزرق ملكي', value: '#2c4a7c' },
  { name: 'رمادي فحمي', value: '#2f3640' },
  { name: 'وردي هادئ', value: '#b56576' },
];

const TIME_OPTIONS = (() => {
  const out = [];
  for (let h = 0; h < 24; h += 1) {
    for (const m of [0, 30]) {
      const val = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const period = h < 12 ? 'ص' : 'م';
      let h12 = h % 12;
      if (h12 === 0) h12 = 12;
      out.push({ val, label: `${h12}:${String(m).padStart(2, '0')} ${period}` });
    }
  }
  return out;
})();

const TikTokIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.41-.02-.34-.02-.68-.02-1.02.13-1.6.82-3.08 1.94-4.21 1.52-1.52 3.8-2.26 5.86-1.92V14.3c-1.11-.27-2.31-.1-3.29.41-.85.45-1.46 1.25-1.63 2.21-.07.39-.07.79-.02 1.18.17 1.25 1.05 2.34 2.19 2.81 1.29.54 2.8.46 4.02-.2 1.19-.65 1.95-1.9 2.05-3.26.2-2.9.06-5.82.09-8.73z" />
  </svg>
);

const XIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const SnapchatIcon = (props) => (
  <svg viewBox="0 0 448 512" fill="currentColor" {...props}>
    <path d="M424.2 263.8c-2.4-10.6-20.2-13.1-34.4-11-20.2 2.9-46.7 9-61.1 5.9-9.1-2-12.7-10.1-10.6-20.9 2-10.2 10.1-26.6 15.8-37.5 44-84.3 13.3-145-38.3-177.3C268.4 6 226.5-.4 191 1.7c-47.5 2.8-82 17.5-104.9 51.5-17.7 26.2-22.1 63.3-10.1 94.6 7.6 19.8 23 48.2 24.3 64.9 1.1 13.7-8.1 20.3-19.1 23-14.7 3.6-43.2-3.1-61.9-5.5-13.7-1.7-27.1 2-30.7 13.1-4 12.3 8.9 25 15.5 29.8 17.3 12.5 40 24.1 64.1 36.8 6.5 3.5 12.1 12 11.2 21.6-1 10.5-6.8 19.3-15.1 24.8-14.6 9.8-33.1 15.1-49.8 18.2-15.6 2.9-32.9 2.5-44.5 11.2C-5.5 391-2.9 405.3 6 414.2c16 16.1 41 18.9 62.1 22.1 19.1 2.9 38.6 3.6 57 8.3 16 4.1 30.6 11 41.5 23.3 7 7.9 13.9 17.8 24.4 23.4 12 6.5 26.7 8.7 39.5 8.7 12.5 0 25.5-2 37.2-7.8 10.7-5.3 17.8-15.5 24.9-23.7 11-12.7 25.9-19.8 42-23.9 18.6-4.8 38.3-5.3 57.6-8.2 21.2-3.2 46.5-6.1 62.6-22.4 8.7-8.8 11.5-23.4 5.2-32.2z" />
  </svg>
);

const SOCIAL_FIELDS = [
  { key: 'instagram', label: 'انستقرام', placeholder: '@yourname', Icon: Instagram },
  { key: 'snapchat', label: 'سناب شات', placeholder: '@yourname', Icon: SnapchatIcon },
  { key: 'tiktok', label: 'تيك توك', placeholder: '@yourname', Icon: TikTokIcon },
  { key: 'x', label: 'إكس', placeholder: '@yourname', Icon: XIcon },
];

const inputClass = 'w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/10 outline-none transition-all text-sm font-medium';
const labelClass = 'block text-sm font-bold text-zinc-800 mb-2';

function StepBadge({ icon: Icon, children }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-[#FF385C]/10 text-[#FF385C] border border-[#FF385C]/15 px-3 py-1.5 text-xs font-bold mb-4">
      <Icon className="w-3.5 h-3.5" />
      {children}
    </div>
  );
}

export default function VenueWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();

  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successVenue, setSuccessVenue] = useState(null);

  const [form, setForm] = useState({
    name: '',
    venue_type: '',
    description: '',
    city: '',
    maps_url: '',
    images: [],
    video_url: '',
    youtube_urls: [],
    custom_features: [],
    social: { instagram: '', snapchat: '', tiktok: '', x: '' },
    page_theme: 'classic',
    price_weekday: '',
    price_weekend: '',
    whatsapp: '',
    check_in_time: '14:00',
    check_out_time: '12:00',
    booking_enabled: true,
    booking_terms: DEFAULT_BOOKING_TERMS,
    features: [],
    status: 'نشط',
    slug: '',
    theme_color: '#c9a96e',
  });

  useEffect(() => {
    if (user?.business_type && !form.venue_type) {
      setForm((prev) => ({ ...prev, venue_type: user.business_type }));
    }
  }, [user, form.venue_type]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateSocial = (key, value) => {
    setForm((prev) => ({ ...prev, social: { ...(prev.social || {}), [key]: value } }));
  };

  const toggleFeature = (feature) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((item) => item !== feature)
        : [...prev.features, feature],
    }));
  };

  const addCustomFeature = () => {
    setForm((prev) => ({
      ...prev,
      custom_features: [...(prev.custom_features || []), { label: '', icon: 'star' }],
    }));
  };

  const updateCustomFeature = (index, patch) => {
    setForm((prev) => {
      const next = [...(prev.custom_features || [])];
      next[index] = { ...next[index], ...patch };
      return { ...prev, custom_features: next };
    });
  };

  const removeCustomFeature = (index) => {
    setForm((prev) => ({
      ...prev,
      custom_features: (prev.custom_features || []).filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const addYoutubeUrl = () => {
    setForm((prev) => ({
      ...prev,
      youtube_urls: [...(prev.youtube_urls || []), ''],
    }));
  };

  const updateYoutubeUrl = (index, value) => {
    setForm((prev) => {
      const next = [...(prev.youtube_urls || [])];
      next[index] = value;
      return { ...prev, youtube_urls: next };
    });
  };

  const removeYoutubeUrl = (index) => {
    setForm((prev) => ({
      ...prev,
      youtube_urls: (prev.youtube_urls || []).filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleImgUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploading(true);
    const urls = [...form.images];

    for (const file of files.slice(0, 10 - urls.length)) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        urls.push(file_url);
      } catch (error) {
        toast.error('تعذر رفع إحدى الصور');
      }
    }

    set('images', urls);
    setUploading(false);
  };

  const removeImg = (index) => {
    set('images', form.images.filter((_, itemIndex) => itemIndex !== index));
  };

  const next = () => setStep((current) => Math.min(current + 1, TOTAL_STEPS));
  const prev = () => setStep((current) => Math.max(current - 1, 1));

  const canProceed = () => {
    if (step === 1) return !!form.venue_type;
    if (step === 2) return !!form.name.trim() && !!form.city.trim();
    if (step === 3) return form.images.length > 0;
    if (step === 6) return !!form.whatsapp.trim();
    return true;
  };

  const handleSubmit = async () => {
    setSaving(true);

    const cleanSocial = {};
    Object.entries(form.social || {}).forEach(([key, value]) => {
      if (value && value.trim()) cleanSocial[key] = value.trim();
    });

    const data = {
      ...form,
      price_weekday: form.price_weekday ? Number(form.price_weekday) : undefined,
      price_weekend: form.price_weekend ? Number(form.price_weekend) : undefined,
      owner_id: user?.id,
      slug: form.slug || `venue-${Date.now()}`,
      youtube_urls: (form.youtube_urls || []).filter((url) => url && url.trim()),
      custom_features: (form.custom_features || []).filter((feature) => feature.label && feature.label.trim()),
      social: cleanSocial,
    };

    try {
      const created = await base44.entities.Venue.create(data);
      await qc.invalidateQueries({ queryKey: ['venues'] });
      const slug = created?.slug || data.slug;
      setSuccessVenue({ name: form.name, slug, url: `${window.location.origin}/place/${slug}` });
    } catch (error) {
      toast.error('حدث خطأ: ' + (error?.message || 'تعذّر الحفظ'));
    } finally {
      setSaving(false);
    }
  };

  if (successVenue) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#F7F7F7] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden text-zinc-950">
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap');
          body, button, input, textarea, select { font-family: 'IBM Plex Sans Arabic', sans-serif; }
          @keyframes pop { 0% { transform: scale(0); } 60% { transform: scale(1.12); } 100% { transform: scale(1); } }
          @keyframes fadeUp { from { opacity:0; transform: translateY(18px); } to { opacity:1; transform: translateY(0); } }
        ` }} />
        <div className="absolute top-10 right-8 w-48 h-48 rounded-full blur-3xl opacity-20 bg-[#FF385C]" />
        <div className="absolute bottom-8 left-6 w-56 h-56 rounded-full blur-3xl opacity-10 bg-[#222222]" />

        <div className="relative z-10 max-w-sm w-full bg-white border border-zinc-200 rounded-[2rem] p-6 shadow-[0_22px_60px_-35px_rgba(34,34,34,0.45)]" style={{ animation: 'fadeUp 0.55s ease-out both' }}>
          <div className="mb-7" style={{ animation: 'pop 0.6s cubic-bezier(0.16,1,0.3,1)' }}>
            <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center shadow-xl bg-[#FF385C]/10 border border-[#FF385C]/15">
              <PartyPopper className="w-12 h-12 text-[#FF385C]" />
            </div>
          </div>

          <h1 className="text-2xl font-extrabold mb-3 text-zinc-950">تم إنشاء الصفحة بنجاح</h1>
          <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
            تم إنشاء صفحة <span className="font-bold text-zinc-900">{successVenue.name}</span> ويمكنك الآن معاينتها أو العودة للوحة التحكم.
          </p>

          <div className="space-y-3">
            <button type="button" onClick={() => window.open(successVenue.url, '_blank')}
              className="w-full py-4 rounded-2xl font-bold text-base shadow-lg shadow-[#FF385C]/20 transition-all flex items-center justify-center gap-2 active:scale-95 bg-[#FF385C] text-white hover:bg-[#E31C5F]">
              <Eye className="w-5 h-5" /> عرض الصفحة
            </button>
            <button type="button" onClick={() => navigate('/venue')}
              className="w-full py-4 rounded-2xl font-bold text-base border border-zinc-200 transition-all flex items-center justify-center gap-2 active:scale-95 bg-white text-zinc-900 hover:bg-zinc-50">
              <LayoutDashboard className="w-5 h-5" /> العودة للوحة التحكم
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = (step / TOTAL_STEPS) * 100;
  const isLast = step === TOTAL_STEPS;
  const activeThemeColor = THEME_COLORS.find((item) => item.value === form.theme_color)?.name || form.theme_color;

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7] font-sans flex flex-col items-center py-6 sm:py-8 px-4 text-zinc-950" style={{ backgroundImage: 'radial-gradient(at 0% 0%, rgba(255,56,92,0.08) 0px, transparent 46%), radial-gradient(at 100% 0%, rgba(34,34,34,0.05) 0px, transparent 48%)', backgroundAttachment: 'fixed' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap');
        body, button, input, textarea, select { font-family: 'IBM Plex Sans Arabic', sans-serif; }
      ` }} />

      <div className="w-full max-w-xl mx-auto">
        <div className="mb-6 px-2 flex justify-between items-center">
          <button type="button" onClick={prev} disabled={step === 1}
            className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-zinc-500 hover:text-[#FF385C] transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex-1 px-6">
            <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#FF385C] transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-center text-[11px] text-zinc-400 font-semibold mt-2">{step} من {TOTAL_STEPS}</p>
          </div>

          <button type="button" onClick={() => navigate('/venue')}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-zinc-500 hover:text-[#FF385C] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-[2rem] border border-zinc-200 shadow-[0_22px_55px_-28px_rgba(34,34,34,0.35)] p-6 md:p-10 min-h-[520px] flex flex-col">
          <div className="flex-1">
            {step === 1 && (
              <div>
                <StepBadge icon={Home}>الخطوة الأولى</StepBadge>
                <h2 className="text-2xl font-extrabold text-zinc-950 mb-1">ما نوع منشأتك؟</h2>
                <p className="text-zinc-500 text-sm mb-8">اختر النوع المناسب لصفحة العرض.</p>
                <div className="grid grid-cols-2 gap-4">
                  {VENUE_TYPES.map(({ id, label, Icon }) => (
                    <button key={id} type="button" onClick={() => set('venue_type', id)}
                      className={`p-5 rounded-3xl border-2 transition-all active:scale-95 text-center ${form.venue_type === id ? 'border-[#FF385C] bg-[#FF385C]/5 shadow-lg shadow-[#FF385C]/10' : 'border-zinc-100 bg-white hover:border-zinc-200'}`}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${form.venue_type === id ? 'bg-[#FF385C] text-white' : 'bg-zinc-50 text-zinc-500'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-zinc-900">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <StepBadge icon={MapPin}>البيانات الأساسية</StepBadge>
                <h2 className="text-2xl font-extrabold text-zinc-950 mb-1">عرّف العميل على منشأتك</h2>
                <p className="text-zinc-500 text-sm mb-8">اكتب الاسم والمدينة والرابط المختصر والوصف.</p>
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>اسم المكان *</label>
                    <input value={form.name} onChange={(event) => set('name', event.target.value)} placeholder="مثال: شاليه الريم" className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>المدينة *</label>
                    <input value={form.city} onChange={(event) => set('city', event.target.value)} placeholder="اكتب اسم المدينة" className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>الرابط المختصر <span className="text-xs text-zinc-400 font-normal">اختياري · إنجليزي فقط</span></label>
                    <input value={form.slug} dir="ltr" placeholder="my-chalet" className={`${inputClass} font-mono text-left`}
                      onChange={(event) => {
                        const value = event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-');
                        set('slug', value);
                      }} />
                    <p className="text-xs text-zinc-400 mt-2">site.com/place/{form.slug || 'my-chalet'}</p>
                  </div>

                  <div>
                    <label className={labelClass}>الوصف</label>
                    <textarea value={form.description} onChange={(event) => set('description', event.target.value)} rows={4} placeholder="اكتب وصفاً مختصراً وجذاباً..." className={`${inputClass} resize-none leading-7`} />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <StepBadge icon={Camera}>الصور</StepBadge>
                <h2 className="text-2xl font-extrabold text-zinc-950 mb-1">صور المكان</h2>
                <p className="text-zinc-500 text-sm mb-3">أضف صوراً جذابة، أول صورة ستكون الغلاف.</p>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5 mb-6 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <p className="text-[12px] text-amber-700 font-bold">أول صورة تظهر كغلاف أعلى صفحة الشاليه</p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {form.images.map((img, index) => (
                    <div key={img} className="relative aspect-square rounded-2xl overflow-hidden group bg-zinc-100">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {index === 0 && <span className="absolute top-1.5 right-1.5 bg-[#FF385C] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">الغلاف</span>}
                      <button type="button" onClick={() => removeImg(index)} className="absolute top-1.5 left-1.5 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {form.images.length < 10 && (
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#FF385C] hover:bg-zinc-50 transition-all">
                      {uploading ? <Loader2 className="w-6 h-6 text-[#FF385C] animate-spin" /> : <><Upload className="w-6 h-6 text-zinc-500" /><span className="text-[10px] text-zinc-400 font-semibold">إضافة</span></>}
                      <input type="file" accept="image/*" multiple onChange={handleImgUpload} className="hidden" disabled={uploading} />
                    </label>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <StepBadge icon={Youtube}>الموقع والوسائط</StepBadge>
                <h2 className="text-2xl font-extrabold text-zinc-950 mb-1">أضف الموقع والمقاطع</h2>
                <p className="text-zinc-500 text-sm mb-8">هذه الحقول تظهر في صفحة الشاليه للعملاء.</p>

                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>رابط الموقع على الخريطة</label>
                    <div className="relative">
                      <input value={form.maps_url} onChange={(event) => set('maps_url', event.target.value)} placeholder="https://maps.google.com/..." dir="ltr" className={`${inputClass} pl-11 text-left`} />
                      <MapPin className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <label className="text-sm font-bold text-zinc-800">روابط يوتيوب <span className="text-xs text-zinc-400 font-normal">حتى {MAX_YOUTUBE} مقاطع</span></label>
                      {(form.youtube_urls || []).length < MAX_YOUTUBE && (
                        <button type="button" onClick={addYoutubeUrl} className="text-xs font-bold text-[#FF385C] flex items-center gap-1">
                          <Plus className="w-3.5 h-3.5" /> إضافة
                        </button>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      {(form.youtube_urls || []).length === 0 && (
                        <button type="button" onClick={addYoutubeUrl} className="w-full rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 py-4 text-sm font-bold text-zinc-500 hover:border-[#FF385C] hover:text-[#FF385C] transition-all flex items-center justify-center gap-2">
                          <Youtube className="w-4 h-4" /> إضافة رابط يوتيوب
                        </button>
                      )}

                      {(form.youtube_urls || []).map((url, index) => (
                        <div key={index} className="flex gap-2">
                          <input value={url} dir="ltr" placeholder="https://youtube.com/..." className={`${inputClass} text-left`}
                            onChange={(event) => updateYoutubeUrl(index, event.target.value)} />
                          <button type="button" onClick={() => removeYoutubeUrl(index)} className="w-11 rounded-2xl border border-zinc-200 bg-white text-red-500 flex items-center justify-center hover:bg-red-50 transition-all shrink-0">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <StepBadge icon={Sparkles}>المميزات</StepBadge>
                <h2 className="text-2xl font-extrabold text-zinc-950 mb-1">ما الذي يميز المكان؟</h2>
                <p className="text-zinc-500 text-sm mb-8">اختر المميزات، وأضف مزايا مخصصة بأيقوناتها.</p>

                <div className="flex flex-wrap gap-2.5 mb-7">
                  {ALL_FEATURES.map((feature) => (
                    <button key={feature} type="button" onClick={() => toggleFeature(feature)}
                      className={`px-4 py-2.5 rounded-full text-sm font-bold border transition-all active:scale-95 ${form.features.includes(feature) ? 'bg-[#FF385C] text-white border-[#FF385C]' : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'}`}>
                      {feature}
                    </button>
                  ))}
                </div>

                <div className="rounded-3xl bg-zinc-50 border border-zinc-100 p-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-sm font-extrabold text-zinc-900">مزايا إضافية مخصصة</p>
                    <button type="button" onClick={addCustomFeature} className="text-xs font-bold text-[#FF385C] flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" /> إضافة
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(form.custom_features || []).length === 0 && (
                      <p className="text-xs text-zinc-400 leading-6">مثال: إطلالة جبلية، مسبح دافئ، شاشة سينما، جلسة خارجية خاصة.</p>
                    )}

                    {(form.custom_features || []).map((feature, index) => {
                      const ActiveIcon = CUSTOM_ICON_OPTIONS.find((item) => item.key === feature.icon)?.Icon || Star;
                      return (
                        <div key={index} className="rounded-2xl bg-white border border-zinc-200 p-3 space-y-3">
                          <div className="flex gap-2">
                            <div className="w-11 h-11 rounded-2xl bg-zinc-50 flex items-center justify-center text-[#FF385C] shrink-0">
                              <ActiveIcon className="w-4 h-4" />
                            </div>
                            <input value={feature.label} onChange={(event) => updateCustomFeature(index, { label: event.target.value })} placeholder="اسم الميزة" className={`${inputClass} py-2.5`} />
                            <button type="button" onClick={() => removeCustomFeature(index)} className="w-11 rounded-2xl text-red-500 flex items-center justify-center hover:bg-red-50 transition-all shrink-0">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-5 gap-2">
                            {CUSTOM_ICON_OPTIONS.map(({ key, Icon }) => (
                              <button key={key} type="button" onClick={() => updateCustomFeature(index, { icon: key })}
                                className={`h-9 rounded-xl border flex items-center justify-center transition-all ${feature.icon === key ? 'bg-[#FF385C] text-white border-[#FF385C]' : 'bg-zinc-50 text-zinc-500 border-zinc-100 hover:border-zinc-200'}`}>
                                <Icon className="w-4 h-4" />
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === 6 && (
              <div>
                <StepBadge icon={Clock}>الحجز والتواصل</StepBadge>
                <h2 className="text-2xl font-extrabold text-zinc-950 mb-1">الأسعار والمواعيد</h2>
                <p className="text-zinc-500 text-sm mb-8">أدخل الأسعار ورقم واتساب وشروط الحجز.</p>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>سعر أيام الأسبوع</label>
                      <div className="relative">
                        <input type="number" value={form.price_weekday} onChange={(event) => set('price_weekday', event.target.value)} placeholder="0" dir="ltr" className={`${inputClass} text-left pl-12 font-bold`} />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-bold">ر.س</span>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>سعر الويكند</label>
                      <div className="relative">
                        <input type="number" value={form.price_weekend} onChange={(event) => set('price_weekend', event.target.value)} placeholder="0" dir="ltr" className={`${inputClass} text-left pl-12 font-bold`} />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-bold">ر.س</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>وقت الدخول</label>
                      <select value={form.check_in_time} onChange={(event) => set('check_in_time', event.target.value)} className={inputClass}>
                        {TIME_OPTIONS.map((time) => <option key={time.val} value={time.val}>{time.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>وقت الخروج</label>
                      <select value={form.check_out_time} onChange={(event) => set('check_out_time', event.target.value)} className={inputClass}>
                        {TIME_OPTIONS.map((time) => <option key={time.val} value={time.val}>{time.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${form.booking_enabled ? 'bg-[#FF385C]/10 text-[#FF385C]' : 'bg-zinc-200 text-zinc-500'}`}>
                        <CalendarDays className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-zinc-900">تفعيل الحجوزات</p>
                        <p className="text-xs text-zinc-500 leading-6">مفعّلة تلقائياً. عند تعطيلها يختفي زر الحجز من صفحة المكان.</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => set('booking_enabled', !form.booking_enabled)}
                      className={`relative w-14 h-8 rounded-full transition-all shrink-0 ${form.booking_enabled ? 'bg-[#FF385C]' : 'bg-zinc-300'}`}>
                      <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${form.booking_enabled ? 'right-7' : 'right-1'}`} />
                    </button>
                  </div>

                  <div>
                    <label className={labelClass}>رقم واتساب للحجز *</label>
                    <div className="relative">
                      <input value={form.whatsapp} onChange={(event) => set('whatsapp', event.target.value)} placeholder="9665xxxxxxxx" dir="ltr" className={`${inputClass} pl-11 text-left font-bold`} />
                      <MessageCircle className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>شروط الحجز</label>
                    <textarea value={form.booking_terms} onChange={(event) => set('booking_terms', event.target.value)} rows={4} placeholder="اكتب شروط الحجز، العربون، وقت الدخول والخروج، أو أي تعليمات مهمة..." className={`${inputClass} resize-none leading-7`} />
                    <p className="text-[11px] text-zinc-400 mt-2">تظهر هذه الشروط للعميل، ويمكن تعديلها أو حذف أي بند منها قبل النشر.</p>
                  </div>
                </div>
              </div>
            )}

            {step === 7 && (
              <div>
                <StepBadge icon={Palette}>الثيم والمظهر</StepBadge>
                <h2 className="text-2xl font-extrabold text-zinc-950 mb-1">اختر شكل صفحة العرض</h2>
                <p className="text-zinc-500 text-sm mb-8">هذه الاختيارات تخص صفحة الشاليه نفسها، وليست ألوان لوحة التحكم.</p>

                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>ثيم الصفحة</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button type="button" onClick={() => set('page_theme', 'classic')}
                        className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${form.page_theme === 'classic' ? 'border-[#FF385C] bg-[#FF385C]/5' : 'border-zinc-100 bg-white'}`}>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF385C] to-[#E31C5F] flex items-center justify-center"><Sun className="w-6 h-6 text-white" /></div>
                        <span className="font-bold text-sm text-zinc-800">كلاسيكي</span>
                      </button>
                      <button type="button" onClick={() => set('page_theme', 'royal')}
                        className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${form.page_theme === 'royal' ? 'border-[#d4af37] bg-[#d4af37]/5' : 'border-zinc-100 bg-white'}`}>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0a0e1a] to-[#1a2238] flex items-center justify-center"><Crown className="w-6 h-6 text-[#d4af37]" /></div>
                        <span className="font-bold text-sm text-zinc-800">ملكي فاخر</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>لون الثيم</label>
                    <div className="grid grid-cols-5 gap-3">
                      {THEME_COLORS.map((color) => {
                        const active = form.theme_color === color.value;
                        return (
                          <button key={color.value} type="button" title={color.name} onClick={() => set('theme_color', color.value)}
                            className={`h-12 rounded-2xl border-2 transition-all flex items-center justify-center ${active ? 'border-zinc-950 scale-105 shadow-md' : 'border-zinc-100 hover:border-zinc-300'}`}>
                            <span className="w-7 h-7 rounded-full border border-black/10" style={{ background: color.value }} />
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-zinc-50 border border-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-600">
                      <span className="w-3 h-3 rounded-full" style={{ background: form.theme_color }} />
                      {activeThemeColor}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 8 && (
              <div>
                <StepBadge icon={Instagram}>التواصل الاجتماعي</StepBadge>
                <h2 className="text-2xl font-extrabold text-zinc-950 mb-1">حساباتك الاجتماعية</h2>
                <p className="text-zinc-500 text-sm mb-8">اختياري، وستظهر كأيقونات في صفحة العرض.</p>

                <div className="space-y-3">
                  {SOCIAL_FIELDS.map(({ key, label, placeholder, Icon }) => (
                    <div key={key}>
                      <label className="flex items-center gap-2 text-sm font-bold text-zinc-800 mb-2">
                        <Icon className="w-4 h-4 text-zinc-500" /> {label}
                      </label>
                      <input value={form.social?.[key] || ''} dir="ltr" placeholder={placeholder} className={`${inputClass} text-left`}
                        onChange={(event) => updateSocial(key, event.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 9 && (
              <div>
                <StepBadge icon={Check}>المراجعة الأخيرة</StepBadge>
                <h2 className="text-2xl font-extrabold text-zinc-950 mb-1">تأكد من البيانات قبل النشر</h2>
                <p className="text-zinc-500 text-sm mb-8">يمكنك الرجوع لأي خطوة وتعديلها قبل الحفظ.</p>

                <div className="space-y-3">
                  {[
                    { Icon: Home, label: 'النوع', val: form.venue_type || '—' },
                    { Icon: MapPin, label: 'الاسم والمدينة', val: `${form.name || '—'} · ${form.city || '—'}` },
                    { Icon: LinkIcon, label: 'رابط الموقع', val: form.maps_url ? 'مضاف' : 'غير مضاف' },
                    { Icon: Youtube, label: 'يوتيوب', val: `${(form.youtube_urls || []).filter((url) => url && url.trim()).length} رابط` },
                    { Icon: Sparkles, label: 'المميزات', val: `${form.features.length + (form.custom_features || []).filter((feature) => feature.label && feature.label.trim()).length} ميزة` },
                    { Icon: Clock, label: 'المواعيد', val: `${form.check_in_time} - ${form.check_out_time}` },
                    { Icon: CalendarDays, label: 'الحجوزات', val: form.booking_enabled ? 'مفعّلة' : 'معطّلة' },
                    { Icon: Phone, label: 'واتساب', val: form.whatsapp || '—' },
                    { Icon: Palette, label: 'الثيم', val: `${form.page_theme === 'royal' ? 'ملكي فاخر' : 'كلاسيكي'} · ${activeThemeColor}` },
                    { Icon: ImageIcon, label: 'الصور', val: `${form.images.length} صورة` },
                  ].map(({ Icon, label, val }) => (
                    <div key={label} className="flex items-center gap-3 bg-zinc-50 rounded-2xl p-3.5 border border-zinc-100">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#FF385C] shadow-sm"><Icon className="w-4 h-4" /></div>
                      <span className="text-xs text-zinc-400 font-semibold">{label}</span>
                      <span className="text-sm font-bold text-zinc-800 mr-auto text-left truncate max-w-[180px]">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 flex items-center justify-between gap-3">
            <button type="button" onClick={prev} disabled={step === 1}
              className={`px-5 py-3 rounded-full font-bold border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition-all flex items-center gap-2 ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}>
              <ArrowRight className="w-4 h-4" /> السابق
            </button>

            {isLast ? (
              <button type="button" onClick={handleSubmit} disabled={saving}
                className="px-8 py-3.5 rounded-full font-bold text-white bg-[#FF385C] hover:bg-[#E31C5F] shadow-lg shadow-[#FF385C]/25 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-60">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري النشر...</> : <>إنشاء الصفحة <Check className="w-4 h-4" /></>}
              </button>
            ) : (
              <button type="button" onClick={next} disabled={!canProceed()}
                className="px-8 py-3.5 rounded-full font-bold text-white bg-[#FF385C] hover:bg-[#E31C5F] shadow-lg shadow-[#FF385C]/25 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
                متابعة <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
