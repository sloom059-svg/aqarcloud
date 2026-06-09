import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  PartyPopper, Share2, LayoutDashboard, Eye, ChevronRight, LogOut, User,
  Bell, Wallet, Upload, X, Loader2, Plus, Trash2, Check, Sun, Crown,
  Star, ShieldCheck, Waves, Wifi, UtensilsCrossed, Tv, Dumbbell, Bath,
  Wind, Music, Camera, Heart, Gift, Mountain, Car, Bed, Flame, Trees, Instagram,
  Home, Tent, TreePine, Armchair, MapPin, Youtube
} from 'lucide-react';

const ALL_FEATURES = [
  { id: 'pool', name: 'مسبح', icon: Waves },
  { id: 'outdoor', name: 'جلسات خارجية', icon: TreePine },
  { id: 'wifi', name: 'واي فاي', icon: Wifi },
  { id: 'kitchen', name: 'مطبخ', icon: UtensilsCrossed },
  { id: 'kids', name: 'ألعاب أطفال', icon: Star },
  { id: 'grill', name: 'شواء', icon: Flame },
  { id: 'men', name: 'قسم رجال', icon: ShieldCheck },
  { id: 'women', name: 'قسم نساء', icon: Heart },
  { id: 'bed', name: 'غرف نوم', icon: Bed },
  { id: 'ac', name: 'مكيف', icon: Wind },
  { id: 'garden', name: 'حديقة', icon: Trees },
  { id: 'self', name: 'دخول ذاتي', icon: Home }
];

const CUSTOM_ICON_OPTIONS = [
  { key: 'star', Icon: Star },
  { key: 'shield', Icon: ShieldCheck },
  { key: 'waves', Icon: Waves },
  { key: 'wifi', Icon: Wifi },
  { key: 'grill', Icon: UtensilsCrossed },
  { key: 'tv', Icon: Tv },
  { key: 'gym', Icon: Dumbbell },
  { key: 'bath', Icon: Bath },
  { key: 'ac', Icon: Wind },
  { key: 'sun', Icon: Sun },
];

const MAX_YOUTUBE = 5;

const TikTokIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.41-.02-.34-.02-.68-.02-1.02.13-1.6.82-3.08 1.94-4.21 1.52-1.52 3.8-2.26 5.86-1.92V14.3c-1.11-.27-2.31-.1-3.29.41-.85.45-1.46 1.25-1.63 2.21-.07.39-.07.79-.02 1.18.17 1.25 1.05 2.34 2.19 2.81 1.29.54 2.8.46 4.02-.2 1.19-.65 1.95-1.9 2.05-3.26.2-2.9.06-5.82.09-8.73z"/></svg>
);
const XIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
);
const SnapchatIcon = (props) => (
  <svg viewBox="0 0 448 512" fill="currentColor" {...props}><path d="M424.2 263.8c-2.4-10.6-20.2-13.1-34.4-11-20.2 2.9-46.7 9-61.1 5.9-9.1-2-12.7-10.1-10.6-20.9 2-10.2 10.1-26.6 15.8-37.5 44-84.3 13.3-145-38.3-177.3C268.4 6 226.5-.4 191 1.7c-47.5 2.8-82 17.5-104.9 51.5-17.7 26.2-22.1 63.3-10.1 94.6 7.6 19.8 23 48.2 24.3 64.9 1.1 13.7-8.1 20.3-19.1 23-14.7 3.6-43.2-3.1-61.9-5.5-13.7-1.7-27.1 2-30.7 13.1-4 12.3 8.9 25 15.5 29.8 17.3 12.5 40 24.1 64.1 36.8 6.5 3.5 12.1 12 11.2 21.6-1 10.5-6.8 19.3-15.1 24.8-14.6 9.8-33.1 15.1-49.8 18.2-15.6 2.9-32.9 2.5-44.5 11.2C-5.5 391-2.9 405.3 6 414.2c16 16.1 41 18.9 62.1 22.1 19.1 2.9 38.6 3.6 57 8.3 16 4.1 30.6 11 41.5 23.3 7 7.9 13.9 17.8 24.4 23.4 12 6.5 26.7 8.7 39.5 8.7 12.5 0 25.5-2 37.2-7.8 10.7-5.3 17.8-15.5 24.9-23.7 11-12.7 25.9-19.8 42-23.9 18.6-4.8 38.3-5.3 57.6-8.2 21.2-3.2 46.5-6.1 62.6-22.4 8.7-8.8 11.5-23.4 5.2-32.2z"/></svg>
);

const SOCIAL_FIELDS = [
  { key: 'instagram', label: 'انستقرام', placeholder: '@yourname', Icon: Instagram },
  { key: 'snapchat', label: 'سناب شات', placeholder: '@yourname', Icon: (p) => <SnapchatIcon {...p} /> },
  { key: 'tiktok', label: 'تيك توك', placeholder: '@yourname', Icon: (p) => <TikTokIcon {...p} /> },
  { key: 'x', label: 'إكس (تويتر)', placeholder: '@yourname', Icon: (p) => <XIcon {...p} /> },
];

const THEME_COLORS = [
  { name: 'ذهبي', value: '#c9a96e' }, { name: 'أخضر زمردي', value: '#0f3d36' },
  { name: 'كحلي', value: '#15317E' }, { name: 'نبيتي', value: '#7c2d3a' },
  { name: 'بني فاخر', value: '#6b4f3a' }, { name: 'تركوازي', value: '#1d7874' },
  { name: 'بنفسجي', value: '#5b3a70' }, { name: 'رمادي فحمي', value: '#2f3640' },
];

const REGIONS_DATA = {
  'الرياض': ['الرياض', 'الخرج', 'المجمعة', 'الدرعية', 'الدوادمي', 'الزلفي'],
  'مكة المكرمة': ['مكة المكرمة', 'جدة', 'الطائف', 'القنفذة', 'الليث'],
  'الشرقية': ['الدمام', 'الخبر', 'الظهران', 'الجبيل', 'الأحساء', 'حفر الباطن'],
  'القصيم': ['بريدة', 'عنيزة', 'الرس', 'البكيرية', 'البدائع'],
  'عسير': ['أبها', 'خميس مشيط', 'بيشة', 'النماص', 'محايل عسير']
};

const TIME_OPTIONS = (() => {
  const out = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const val = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
      const period = h < 12 ? 'ص' : 'م';
      let h12 = h % 12; if (h12 === 0) h12 = 12;
      out.push({ val, label: `${h12}:${String(m).padStart(2,'0')} ${period}` });
    }
  }
  return out;
})();

export default function VenueWizard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isEdit = !!id;
  const queryClient = useQueryClient();

  // Wizard State
  const TOTAL_STEPS = 8;
  const [currentStep, setCurrentStep] = useState(1);
  const hideNextButtonOnSteps = [1, 5]; 

  const handleLogout = async () => { await logout(false); navigate('/login'); };

  // Form State
  const [form, setForm] = useState({
    name: '', venue_type: '', description: '', city: '', maps_url: '', images: [], video_url: '',
    youtube_urls: [], custom_features: [], social: { instagram: '', snapchat: '', tiktok: '', x: '' },
    page_theme: 'classic', price_weekday: '', price_weekend: '', whatsapp: '',
    check_in_time: '14:00', check_out_time: '12:00', booking_terms: '', features: [],
    status: 'نشط', slug: '', theme_color: '#c9a96e',
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successVenue, setSuccessVenue] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('');

  const { data: existing } = useQuery({
    queryKey: ['venue', id],
    queryFn: () => base44.entities.Venue.filter({ id }),
    enabled: isEdit,
    select: (d) => d[0],
  });

  useEffect(() => {
    if (existing) setForm(prev => ({
      ...prev, ...existing,
      custom_features: existing.custom_features || [],
      youtube_urls: existing.youtube_urls || [],
      page_theme: existing.page_theme || 'classic',
      theme_color: existing.theme_color || '#c9a96e',
      social: { instagram: '', snapchat: '', tiktok: '', x: '', ...(existing.social || {}) },
    }));
  }, [existing]);

  useEffect(() => {
    if (user?.business_type && !form.venue_type) {
      setForm(prev => ({ ...prev, venue_type: user.business_type }));
    }
  }, [user]);

  // Handlers
  const nextStep = () => { if (currentStep < TOTAL_STEPS) setCurrentStep(c => c + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(c => c - 1); };

  const selectType = (type) => {
    setForm(p => ({ ...p, venue_type: type }));
    setTimeout(() => nextStep(), 350);
  };

  const selectTheme = (theme) => {
    setForm(p => ({ ...p, page_theme: theme }));
    if (theme === 'royal') setTimeout(() => nextStep(), 350);
  };

  const handleImgUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const urls = [...form.images];
    for (const file of files.slice(0, 10 - urls.length)) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      urls.push(file_url);
    }
    setForm(prev => ({ ...prev, images: urls }));
    setUploading(false);
  };

  const toggleFeature = (f) => {
    setForm(p => ({ ...p, features: p.features.includes(f) ? p.features.filter(x => x !== f) : [...p.features, f] }));
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
      custom_features: (form.custom_features || []).filter(cf => cf.label && cf.label.trim()),
      social: cleanSocial,
    };

    try {
      if (isEdit) {
        await base44.entities.Venue.update(id, data);
        await queryClient.invalidateQueries({ queryKey: ['venues'] });
        toast.success('تم تحديث الشاليه بنجاح');
        navigate('/venue');
      } else {
        const created = await base44.entities.Venue.create(data);
        await queryClient.invalidateQueries({ queryKey: ['venues'] });
        setSuccessVenue({ name: form.name, url: `${window.location.origin}/place/${created?.slug || data.slug}` });
      }
    } catch (err) {
      toast.error('حدث خطأ: ' + (err?.message || 'تعذّر الحفظ'));
    } finally {
      setSaving(false);
    }
  };

  const getStepClass = (step) => {
    if (step < currentStep) return 'passed';
    if (step === currentStep) return 'active';
    return '';
  };

  if (successVenue) return (
    <div dir="rtl" className="fixed inset-0 z-50 bg-[#f4f7fb] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-emerald-400 rounded-full blur-[60px] opacity-30 animate-pulse" />
        <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-emerald-50 text-emerald-500">
          <PartyPopper className="w-12 h-12" />
        </div>
      </div>
      <h1 className="text-4xl font-black text-slate-800 mb-3">يا سلام! خلصنا 🎉</h1>
      <p className="text-slate-500 text-lg mb-10 max-w-[320px] leading-relaxed mx-auto">
        تم تجهيز صفحة مكانك بأناقة تامة. تقدر الحين تستقبل حجوزاتك وترسل الرابط لعملائك.
      </p>
      <div className="w-full space-y-4 max-w-sm mx-auto">
        <button onClick={() => navigate('/venue')} className="w-full py-4 bg-[#15317E] hover:bg-[#0d1e4c] text-white rounded-2xl font-bold text-lg shadow-xl shadow-[#15317E]/20 transition-all flex items-center justify-center gap-2">
          <LayoutDashboard className="w-5 h-5" /> انطلق للوحة التحكم
        </button>
        <div className="flex gap-4">
          <button onClick={() => {
            if (navigator.share) navigator.share({ title: successVenue.name, url: successVenue.url }).catch(()=>{});
            else { navigator.clipboard.writeText(successVenue.url); toast.success('تم النسخ'); }
          }} className="flex-1 py-4 bg-white border border-slate-200 hover:border-[#15317E] text-slate-700 hover:text-[#15317E] rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm">
            <Share2 className="w-5 h-5" /> انسخ الرابط
          </button>
          <button onClick={() => window.open(successVenue.url, '_blank')} className="flex-1 py-4 bg-white border border-slate-200 hover:border-[#15317E] text-slate-700 hover:text-[#15317E] rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm">
            <Eye className="w-5 h-5" /> عاين الصفحة
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center py-10 px-4 relative bg-[#f4f7fb] font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;700&display=swap');
        body { font-family: 'IBM Plex Sans Arabic', sans-serif; background-image: radial-gradient(at 0% 0%, hsla(225,39%,30%,0.05) 0px, transparent 50%), radial-gradient(at 100% 0%, hsla(40,45%,61%,0.05) 0px, transparent 50%); background-attachment: fixed; }
        .steps-wrapper { position: relative; width: 100%; height: 100%; overflow: hidden; }
        .step-panel { position: absolute; top: 0; left: 0; width: 100%; visibility: hidden; opacity: 0; transform: translateX(-50px) scale(0.95); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; }
        .step-panel.active { position: relative; visibility: visible; opacity: 1; transform: translateX(0) scale(1); pointer-events: all; }
        .step-panel.passed { transform: translateX(50px) scale(0.95); opacity: 0; position: absolute; }
        .input-clean { border: none; border-bottom: 2px solid #e2e8f0; border-radius: 0; padding: 12px 0; background: transparent; font-size: 1.25rem; font-weight: 500; transition: border-color 0.3s ease; }
        .input-clean:focus { outline: none; border-color: #15317E; box-shadow: none; }
        .choice-card:hover { transform: translateY(-4px); border-color: #15317E; background-color: #f8faff; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}} />

      <div className="w-full max-w-xl mx-auto flex flex-col h-full min-h-[550px]">
        {/* Header / Progress */}
        <div className="mb-6 px-2 flex justify-between items-center transition-opacity duration-300">
          <button onClick={prevStep} className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-[#15317E] transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}>
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="flex-1 px-6">
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#15317E] transition-all duration-500 rounded-full" style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }} />
            </div>
          </div>
          <button onClick={() => navigate('/venue')} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(21,49,126,0.05)] p-6 md:p-10 flex-1 flex flex-col relative overflow-hidden">
          <div className="steps-wrapper flex-1 flex flex-col">

            {/* STEP 1: Venue Type */}
            <div className={`step-panel flex flex-col h-full ${getStepClass(1)}`}>
              <div className="mb-8 text-center mt-4">
                <span className="inline-block px-3 py-1 bg-[#15317E]/5 text-[#15317E] rounded-full text-xs font-bold mb-3">الخطوة ١</span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">وش نوع المكان اللي بتضيفه؟</h2>
                <p className="text-slate-500 mt-2 text-sm">اختر النوع المناسب عشان نجهز لك الخيارات الصح.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-auto mb-4">
                {[
                  { id: 'شاليه', icon: Waves, color: 'text-blue-500 bg-blue-50' },
                  { id: 'مخيم', icon: Tent, color: 'text-amber-500 bg-amber-50' },
                  { id: 'مزرعة', icon: TreePine, color: 'text-green-600 bg-green-50' },
                  { id: 'استراحة', icon: Armchair, color: 'text-purple-500 bg-purple-50' }
                ].map(t => (
                  <button key={t.id} onClick={() => selectType(t.id)}
                    className={`choice-card bg-white border-2 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-all ${form.venue_type === t.id ? 'border-[#15317E] bg-blue-50/30' : 'border-slate-100'}`}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${t.color}`}><t.icon className="w-8 h-8" /></div>
                    <span className="font-bold text-slate-700 text-lg">{t.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: Name & City & Desc */}
            <div className={`step-panel flex flex-col h-full ${getStepClass(2)}`}>
              <div className="mb-6 mt-4">
                <span className="inline-block px-3 py-1 bg-[#15317E]/5 text-[#15317E] rounded-full text-xs font-bold mb-3">الخطوة ٢</span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">أهلاً بك! وش اسم مكانك؟</h2>
              </div>
              <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
                <div>
                  <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: شاليه الريم الفاخر" className="w-full input-clean text-[#15317E]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2">وصف جذاب للمكان (اختياري)</label>
                  <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#15317E] text-sm resize-none" placeholder="اكتب وصف مميز يجذب عملائك..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-3">في أي منطقة؟</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(REGIONS_DATA).map(r => (
                      <button key={r} onClick={() => { setSelectedRegion(r); setForm(p => ({ ...p, city: '' })); }}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${selectedRegion === r ? 'bg-[#15317E] text-white border-[#15317E]' : 'bg-transparent text-slate-600 border-slate-200 hover:border-[#15317E]'}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                {selectedRegion && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-sm font-bold text-slate-500 mb-3">المدينة</label>
                    <div className="flex flex-wrap gap-2">
                      {REGIONS_DATA[selectedRegion].map(c => (
                        <button key={c} onClick={() => setForm(p => ({ ...p, city: c }))}
                          className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${form.city === c ? 'bg-[#15317E] text-white border-[#15317E]' : 'bg-transparent text-slate-600 border-slate-200 hover:border-[#15317E]'}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* STEP 3: Links */}
            <div className={`step-panel flex flex-col h-full ${getStepClass(3)}`}>
              <div className="mb-6 mt-4 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center text-slate-400 mb-4 text-2xl"><MapPin className="w-8 h-8" /></div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">الروابط والموقع</h2>
              </div>
              <div className="space-y-8 mt-4 flex flex-col items-center w-full max-w-sm mx-auto">
                <div className="w-full">
                  <label className="block text-sm font-bold text-slate-500 mb-2 text-right">الرابط المخصص (اختياري)</label>
                  <div className="flex items-center w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-2 focus-within:border-[#15317E] transition-all">
                    <span className="pl-3 pr-4 text-slate-400 font-mono text-sm border-l border-slate-200 dir-ltr text-left">
                      aqarcloud.com/
                    </span>
                    <input type="text" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-') }))} placeholder="my-chalet" dir="ltr" className="w-full bg-transparent border-none outline-none font-mono text-lg text-[#15317E] font-bold p-2" />
                  </div>
                </div>
                <div className="w-full">
                  <label className="block text-sm font-bold text-slate-500 mb-2 text-right">رابط خرائط قوقل</label>
                  <input type="url" value={form.maps_url} onChange={e => setForm(p => ({ ...p, maps_url: e.target.value }))} dir="ltr" placeholder="https://maps.google.com/..." className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 outline-none focus:border-[#15317E] transition-all" />
                </div>
              </div>
            </div>

            {/* STEP 4: Media */}
            <div className={`step-panel flex flex-col h-full ${getStepClass(4)}`}>
              <div className="mb-4 mt-2">
                <h2 className="text-2xl font-bold text-slate-800">الصور تجذب العملاء! 📸</h2>
                <p className="text-slate-500 mt-1 text-sm">ارفع أجمل صور للمكان وجولات الفيديو.</p>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                <label className="border-2 border-dashed border-slate-300 rounded-[2rem] bg-slate-50 hover:bg-slate-100 transition-all p-6 flex flex-col items-center justify-center cursor-pointer text-center group">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 text-[#15317E] group-hover:scale-110 transition-transform">
                    {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                  </div>
                  <h3 className="font-bold text-slate-700">اضغط لرفع الصور</h3>
                  <p className="text-xs text-slate-400 mt-1">حد أقصى ١٠ صور</p>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImgUpload} disabled={uploading} />
                </label>
                
                {form.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border">
                        <img src={img} className="w-full h-full object-cover" />
                        <button onClick={async () => { await base44.integrations.Core.DeleteFile(img); setForm(p => ({ ...p, images: p.images.filter((_,j)=>j!==i) })); }} className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-slate-600">روابط يوتيوب (اختياري)</label>
                    {form.youtube_urls.length < MAX_YOUTUBE && (
                      <button onClick={() => setForm(p => ({ ...p, youtube_urls: [...p.youtube_urls, ''] }))} className="text-xs text-[#15317E] font-bold flex items-center gap-1"><Plus className="w-3 h-3"/> إضافة</button>
                    )}
                  </div>
                  {form.youtube_urls.map((url, i) => (
                    <div key={i} className="relative flex items-center gap-2 mb-2">
                      <div className="relative flex-1">
                        <Youtube className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />
                        <input type="url" dir="ltr" value={url} onChange={e => { const arr = [...form.youtube_urls]; arr[i] = e.target.value; setForm(p => ({ ...p, youtube_urls: arr })); }} placeholder="https://youtube.com/..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10 outline-none focus:border-[#15317E] text-sm" />
                      </div>
                      <button onClick={() => setForm(p => ({ ...p, youtube_urls: p.youtube_urls.filter((_,j)=>j!==i) }))} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 5: Theme */}
            <div className={`step-panel flex flex-col h-full ${getStepClass(5)}`}>
              <div className="mb-6 mt-4 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">كيف تبي شكل صفحتك؟ 🎨</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <button onClick={() => selectTheme('classic')} className={`choice-card relative bg-white border-2 rounded-[2rem] p-6 text-right overflow-hidden group ${form.page_theme === 'classic' ? 'border-[#15317E] ring-2 ring-[#15317E]/20' : 'border-slate-100'}`}>
                  <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-blue-400 to-emerald-400" />
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-amber-500 text-xl mb-4"><Sun className="w-6 h-6" /></div>
                  <h3 className="font-bold text-lg text-slate-800">الكلاسيكي الفاتح</h3>
                  <p className="text-sm text-slate-500 mt-1">مشرق، نظيف، وتقدر تختار لونه.</p>
                </button>
                <button onClick={() => selectTheme('royal')} className={`choice-card relative bg-slate-900 border-2 rounded-[2rem] p-6 text-right overflow-hidden group hover:border-[#c9a96e] ${form.page_theme === 'royal' ? 'border-[#c9a96e]' : 'border-slate-800'}`}>
                  <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-yellow-600 to-yellow-300" />
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-yellow-500 text-xl mb-4"><Crown className="w-6 h-6" /></div>
                  <h3 className="font-bold text-lg text-white">الأسود الملكي</h3>
                  <p className="text-sm text-slate-400 mt-1">فخامة داكنة بلمسات ذهبية.</p>
                </button>
              </div>
              {form.page_theme === 'classic' && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 text-center">
                  <p className="text-sm font-bold text-slate-600 mb-4">اختر لون الثيم:</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {THEME_COLORS.map(c => (
                      <button key={c.value} onClick={() => setForm(p => ({ ...p, theme_color: c.value }))}
                        className={`w-10 h-10 rounded-full border-2 border-white shadow-md transition-transform flex items-center justify-center ${form.theme_color === c.value ? 'scale-110 ring-2 ring-offset-2' : 'hover:scale-110'}`}
                        style={{ backgroundColor: c.value, '--tw-ring-color': c.value }}>
                        {form.theme_color === c.value && <Check className="w-5 h-5 text-white" strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* STEP 6: Prices & Times */}
            <div className={`step-panel flex flex-col h-full ${getStepClass(6)}`}>
              <div className="mb-6 mt-4">
                <h2 className="text-2xl font-bold text-slate-800">الأسعار والمواعيد 💰</h2>
              </div>
              <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2">
                <div className="flex gap-4">
                  <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-[#15317E] transition-all">
                    <label className="block text-xs font-bold text-slate-500 mb-1">وسط الأسبوع (ر.س)</label>
                    <input type="number" value={form.price_weekday} onChange={e => setForm(p => ({ ...p, price_weekday: e.target.value }))} placeholder="مثال: 800" className="w-full bg-transparent border-none outline-none font-bold text-xl text-[#15317E]" />
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-[#15317E] transition-all">
                    <label className="block text-xs font-bold text-slate-500 mb-1">الويكند (ر.س)</label>
                    <input type="number" value={form.price_weekend} onChange={e => setForm(p => ({ ...p, price_weekend: e.target.value }))} placeholder="مثال: 1200" className="w-full bg-transparent border-none outline-none font-bold text-xl text-[#15317E]" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-[#15317E]">
                    <label className="block text-xs font-bold text-slate-500 mb-1">وقت الدخول</label>
                    <select value={form.check_in_time} onChange={e => setForm(p => ({ ...p, check_in_time: e.target.value }))} className="w-full bg-transparent border-none outline-none font-bold text-lg text-slate-800">
                      {TIME_OPTIONS.map(t => <option key={t.val} value={t.val}>{t.label}</option>)}
                    </select>
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-[#15317E]">
                    <label className="block text-xs font-bold text-slate-500 mb-1">وقت الخروج</label>
                    <select value={form.check_out_time} onChange={e => setForm(p => ({ ...p, check_out_time: e.target.value }))} className="w-full bg-transparent border-none outline-none font-bold text-lg text-slate-800">
                      {TIME_OPTIONS.map(t => <option key={t.val} value={t.val}>{t.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-[#15317E] flex items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 ml-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 mb-1">رقم واتساب للحجوزات</label>
                    <input type="tel" dir="ltr" value={form.whatsapp} onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))} placeholder="05XXXXXXXX" className="w-full bg-transparent border-none outline-none font-bold text-lg text-slate-800 text-left tracking-widest" />
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 7: Features */}
            <div className={`step-panel flex flex-col h-full ${getStepClass(7)}`}>
              <div className="mb-6 mt-4">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">المميزات ✨</h2>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex flex-wrap gap-2.5">
                  {ALL_FEATURES.map(f => {
                    const isSelected = form.features.includes(f.name);
                    return (
                      <button key={f.id} onClick={() => toggleFeature(f.name)} className={`px-5 py-3 rounded-full border font-bold text-sm flex items-center gap-2 transition-all ${isSelected ? 'bg-[#15317E] text-white border-[#15317E] shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200'}`}>
                        <f.icon className="w-4 h-4" /> {f.name}
                      </button>
                    );
                  })}
                </div>
                
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <label className="block text-sm font-bold text-slate-600 mb-3">مميزات إضافية مخصصة</label>
                  {form.custom_features.map((cf, i) => {
                    const ActiveIcon = CUSTOM_ICON_OPTIONS.find(o => o.key === cf.icon)?.Icon || Star;
                    return (
                      <div key={i} className="flex gap-2 mb-2">
                        <button onClick={() => setForm(p => ({ ...p, custom_features: p.custom_features.filter((_,j)=>j!==i) }))} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0"><Trash2 className="w-4 h-4" /></button>
                        <input value={cf.label} onChange={e => { const arr = [...form.custom_features]; arr[i].label = e.target.value; setForm(p => ({ ...p, custom_features: arr })); }} placeholder="اسم الميزة..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none focus:border-[#15317E]" />
                        <div className="relative group">
                          <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center"><ActiveIcon className="w-4 h-4 text-slate-600" /></button>
                          <div className="absolute right-0 bottom-full mb-2 hidden group-hover:grid grid-cols-5 gap-1 bg-white p-2 rounded-xl shadow-xl border z-10 w-44">
                            {CUSTOM_ICON_OPTIONS.map(opt => (
                              <button key={opt.key} onClick={() => { const arr = [...form.custom_features]; arr[i].icon = opt.key; setForm(p => ({ ...p, custom_features: arr })); }} className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded"><opt.Icon className="w-3.5 h-3.5" /></button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <button onClick={() => setForm(p => ({ ...p, custom_features: [...p.custom_features, { label: '', icon: 'star' }] }))} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold text-sm hover:border-[#15317E] hover:text-[#15317E] flex items-center justify-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" /> إضافة ميزة
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 8: Social & Terms */}
            <div className={`step-panel flex flex-col h-full ${getStepClass(8)}`}>
              <div className="mb-4 mt-2 text-center">
                <h2 className="text-2xl font-bold text-slate-800">أخيراً، اللمسات الأخيرة</h2>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-3">حسابات التواصل الاجتماعي (اختياري)</label>
                  <div className="grid grid-cols-2 gap-3">
                    {SOCIAL_FIELDS.map(({ key, label, placeholder, Icon }) => (
                      <div key={key} className="relative">
                        <Icon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input dir="ltr" value={form.social?.[key] || ''} onChange={e => setForm(p => ({ ...p, social: { ...p.social, [key]: e.target.value } }))} placeholder={placeholder} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pr-9 outline-none focus:border-[#15317E] text-sm" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">شروط الحجز (تطبع في سند الاستلام)</label>
                  <textarea rows={4} value={form.booking_terms} onChange={e => setForm(p => ({ ...p, booking_terms: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#15317E] text-sm resize-none" placeholder="اكتب شروطك الخاصة..." />
                </div>
              </div>
            </div>

          </div>

          {/* Footer Navigation */}
          <div className="mt-6 pt-4 flex justify-between items-center bg-white z-10 border-t border-slate-50">
            <div />
            {currentStep < TOTAL_STEPS && !hideNextButtonOnSteps.includes(currentStep) && (
              <button onClick={nextStep} className="px-8 py-3 rounded-full font-bold text-white bg-[#15317E] hover:bg-[#0d1e4c] shadow-lg shadow-[#15317E]/30 transition-all flex items-center gap-2 active:scale-95">
                <span>متابعة</span> <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            )}
            {currentStep === TOTAL_STEPS && (
              <button onClick={handleSubmit} disabled={saving} className="px-8 py-3 rounded-full font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 active:scale-95">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> <span>احفظ وانشر الشاليه</span></>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
