import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';
import { PartyPopper, Eye, Share2, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Upload, X, Loader2, Plus, Trash2, Check, Sun, Crown,
  Star, ShieldCheck, Waves, Wifi, UtensilsCrossed, Tv, Dumbbell, Bath,
  Wind, Music, Camera, Heart, Gift, Mountain, Car, Bed, Flame, Trees, Instagram, ChevronDown,
  Bell, Wallet, LogOut, User, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CityCombobox from '@/components/venue/CityCombobox';
import { useQuery } from '@tanstack/react-query';

const ALL_FEATURES = ["مسبح","جلسات خارجية","واي فاي","ملعب","مطبخ","دخول ذاتي","ألعاب أطفال","شواء","قسم رجال","قسم نساء","غرف نوم","حديقة","مولد كهرباء","مكيف","مدفأة"];

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
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.41-.02-.34-.02-.68-.02-1.02.13-1.6.82-3.08 1.94-4.21 1.52-1.52 3.8-2.26 5.86-1.92V14.3c-1.11-.27-2.31-.1-3.29.41-.85.45-1.46 1.25-1.63 2.21-.07.39-.07.79-.02 1.18.17 1.25 1.05 2.34 2.19 2.81 1.29.54 2.8.46 4.02-.2 1.19-.65 1.95-1.9 2.05-3.26.2-2.9.06-5.82.09-8.73z"/>
  </svg>
);
const XIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
  </svg>
);

const SOCIAL_FIELDS = [
  { key: 'instagram', label: 'انستقرام', placeholder: 'https://instagram.com/...', Icon: Instagram },
  { key: 'tiktok', label: 'تيك توك', placeholder: 'https://tiktok.com/@...', Icon: (p) => <TikTokIcon {...p} /> },
  { key: 'x', label: 'إكس (تويتر)', placeholder: 'https://x.com/...', Icon: (p) => <XIcon {...p} /> },
];

const THEME_COLORS = [
  { name: 'ذهبي',    value: '#c9a96e' },
  { name: 'أخضر زمردي', value: '#0f3d36' },
  { name: 'كحلي',    value: '#1e304a' },
  { name: 'نبيتي',   value: '#7c2d3a' },
  { name: 'بني فاخر', value: '#6b4f3a' },
  { name: 'تركوازي', value: '#1d7874' },
  { name: 'بنفسجي',  value: '#5b3a70' },
  { name: 'أزرق ملكي', value: '#2c4a7c' },
  { name: 'رمادي فحمي', value: '#2f3640' },
  { name: 'وردي هادئ', value: '#b56576' },
];

const TIME_OPTIONS = (() => {
  const out = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const val = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
      const period = h < 12 ? 'ص' : 'م';
      let h12 = h % 12; if (h12 === 0) h12 = 12;
      const label = `${h12}:${String(m).padStart(2,'0')} ${period}`;
      out.push({ val, label });
    }
  }
  return out;
})();

function CustomFeatureRow({ cf, onUpdate, onRemove }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const ActiveIcon = CUSTOM_ICON_OPTIONS.find(o => o.key === cf.icon)?.Icon || Star;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex items-center gap-2 mb-2">
      <button type="button" onClick={onRemove} className="text-destructive hover:text-destructive/80 shrink-0">
        <Trash2 className="w-4 h-4" />
      </button>
      <Input
        value={cf.label}
        onChange={e => onUpdate({ label: e.target.value })}
        placeholder="مثال: إطلالة جبلية"
        className="flex-1 h-9"
      />
      <div className="relative" ref={ref}>
        <button type="button" onClick={() => setOpen(o => !o)}
          className="w-9 h-9 rounded-lg border border-border bg-muted flex items-center justify-center hover:border-primary/50 transition shrink-0">
          <ActiveIcon className="w-4 h-4 text-muted-foreground" />
        </button>
        {open && (
          <div className="absolute right-0 top-10 z-50 bg-white border border-border rounded-xl shadow-lg p-2 grid grid-cols-5 gap-1.5 w-52">
            {CUSTOM_ICON_OPTIONS.map(({ key, Icon }) => {
              const active = cf.icon === key;
              return (
                <button key={key} type="button" title={key}
                  onClick={() => { onUpdate({ icon: key }); setOpen(false); }}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${active ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-transparent hover:border-primary/40'}`}>
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

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
        <div className="absolute left-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
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

export default function VenueForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isEdit = !!id;

  const handleLogout = async () => { await logout(false); navigate('/login'); };

  const [form, setForm] = useState({
    name: '', venue_type: '', description: '', city: '',
    maps_url: '', images: [], video_url: '',
    youtube_urls: [],
    custom_features: [],
    social: { instagram: '', tiktok: '', x: '' },
    page_theme: 'classic',
    price_weekday: '', price_weekend: '',
    whatsapp: '', check_in_time: '14:00', check_out_time: '12:00',
    booking_terms: '', features: [], status: 'نشط', slug: '',
    theme_color: '#c9a96e',
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successVenue, setSuccessVenue] = useState(null);
  const [showRevenue, setShowRevenue] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const { data: existing } = useQuery({
    queryKey: ['venue', id],
    queryFn: () => base44.entities.Venue.filter({ id }),
    enabled: isEdit,
    select: (d) => d[0],
  });

  useEffect(() => {
    if (existing) setForm(prev => ({
      ...prev,
      ...existing,
      custom_features: existing.custom_features || [],
      youtube_urls: existing.youtube_urls || [],
      page_theme: existing.page_theme || 'classic',
      theme_color: existing.theme_color || '#c9a96e',
      social: { instagram: '', tiktok: '', x: '', ...(existing.social || {}) },
    }));
  }, [existing]);

  useEffect(() => {
    if (user?.business_type && !form.venue_type) {
      setForm(prev => ({ ...prev, venue_type: user.business_type }));
    }
  }, [user]);

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
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(f) ? prev.features.filter(x => x !== f) : [...prev.features, f]
    }));
  };

  const addCustomFeature = () => {
    setForm(prev => ({
      ...prev,
      custom_features: [...(prev.custom_features || []), { label: '', icon: 'star' }]
    }));
  };
  const updateCustomFeature = (i, patch) => {
    setForm(prev => {
      const arr = [...(prev.custom_features || [])];
      arr[i] = { ...arr[i], ...patch };
      return { ...prev, custom_features: arr };
    });
  };
  const removeCustomFeature = (i) => {
    setForm(prev => ({
      ...prev,
      custom_features: (prev.custom_features || []).filter((_, j) => j !== i)
    }));
  };

  const updateSocial = (key, value) => {
    setForm(prev => ({ ...prev, social: { ...(prev.social || {}), [key]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const cleanSocial = {};
    Object.entries(form.social || {}).forEach(([k, v]) => { if (v && v.trim()) cleanSocial[k] = v.trim(); });

    const data = {
      ...form,
      price_weekday: form.price_weekday ? Number(form.price_weekday) : undefined,
      price_weekend: form.price_weekend ? Number(form.price_weekend) : undefined,
      owner_id: user?.id,
      slug: form.slug || form.name.replace(/\s+/g, '-').toLowerCase(),
      custom_features: (form.custom_features || []).filter(cf => cf.label && cf.label.trim()),
      social: cleanSocial,
    };

    try {
      if (isEdit) {
        await base44.entities.Venue.update(id, data);
        toast.success('تم تحديث الشاليه بنجاح');
        navigate('/venue');
      } else {
        const created = await base44.entities.Venue.create(data);
        const slug = created?.slug || data.slug;
        const url = `${window.location.origin}/place/${slug}`;
        setSuccessVenue({ name: form.name, url, type: user?.business_type || 'الشاليه' });
      }
    } catch (err) {
      toast.error('حدث خطأ: ' + (err?.message || 'تعذّر الحفظ'));
    } finally {
      setSaving(false);
    }
  };

  const isClassic = form.page_theme === 'classic';
  const [showSocial, setShowSocial] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // ══ شاشة النجاح ══
  if (successVenue) return (
    <div dir="rtl" className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
      `}} />
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-[#15317E] rounded-full blur-2xl opacity-20 animate-pulse" />
        <div className="w-28 h-28 bg-[#15317E] rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-white">
          <PartyPopper className="w-12 h-12 text-white" />
        </div>
      </div>
      <h1 className="text-3xl font-black text-[#15317E] mb-3">تم الإضافة بنجاح</h1>
      <p className="text-slate-500 text-sm mb-10 max-w-[280px] leading-relaxed">
        تم إعداد صفحة <span className="font-bold text-[#15317E]">{successVenue.name}</span> بنجاح. يمكنك الآن البدء في استقبال الحجوزات.
      </p>
      <div className="w-full space-y-3 max-w-sm">
        <button onClick={() => navigate('/venue')}
          className="w-full py-4 bg-[#15317E] hover:bg-[#0d1e4c] text-white rounded-2xl font-bold text-sm shadow-xl shadow-[#15317E]/30 transition-all flex items-center justify-center gap-2">
          <LayoutDashboard className="w-5 h-5" /> انتقل إلى لوحة التحكم
        </button>
        <button onClick={() => {
          if (navigator.share) { navigator.share({ title: successVenue.name, url: successVenue.url }).catch(() => {}); }
          else { navigator.clipboard.writeText(successVenue.url); toast.success('تم نسخ الرابط'); }
        }}
          className="w-full py-4 bg-white border border-slate-200 hover:border-[#15317E] hover:text-[#15317E] text-slate-700 rounded-2xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2">
          <Share2 className="w-5 h-5" /> مشاركة الصفحة
        </button>
        <button onClick={() => window.open(successVenue.url, '_blank')}
          className="w-full py-4 bg-transparent text-slate-500 hover:text-[#15317E] rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
          <Eye className="w-4 h-4" /> شاهد صفحة الشاليه
        </button>
      </div>
    </div>
  );

  // افتح القسم تلقائياً عند تحميل البيانات لو فيها محتوى
  useEffect(() => {
    if (existing) {
      const hasSocial = Object.values(existing.social || {}).some(v => v?.trim());
      const hasTerms = !!(existing.booking_terms?.trim());
      if (hasSocial) setShowSocial(true);
      if (hasTerms) setShowTerms(true);
    }
  }, [existing]);

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] font-sans pb-10 relative">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
      `}} />

      {/* الخلفية الزرقاء */}
      <div className="absolute top-0 left-0 right-0 h-[120px] bg-[#15317E] rounded-b-[2.5rem] shadow-lg" />

      <div className="relative z-10 max-w-2xl mx-auto px-4">
        {/* الهيدر الموحّد */}
        <header className="pt-7 pb-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/venue')} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full border-2 border-white/30 bg-white/10 overflow-hidden flex items-center justify-center shadow-lg">
                {user?.office_logo_url ? (
                  <img src={user.office_logo_url} alt="شعار" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-white">{(form.name || 'ش')[0]}</span>
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#15317E] rounded-full" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">{isEdit ? 'تعديل المكان' : 'إضافة مكان جديد'}</h1>
              <p className="text-[11px] text-white/70 mt-0.5">{form.name || 'منشأتي'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setShowNotifs(!showNotifs)}
                className={`relative p-2.5 rounded-xl backdrop-blur-md transition-all ${showNotifs ? 'bg-white text-[#15317E]' : 'bg-white/10 hover:bg-white/20 text-white/90'}`}>
                <Bell className="w-4 h-4" />
              </button>
              {showNotifs && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-[#15317E] text-white"><span className="text-sm font-bold">الإشعارات</span></div>
                  <div className="px-4 py-6 text-center"><p className="text-sm text-slate-400">لا توجد إشعارات جديدة</p></div>
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={() => setShowRevenue(!showRevenue)}
                className={`p-2.5 rounded-xl backdrop-blur-md transition-all ${showRevenue ? 'bg-white text-[#15317E]' : 'bg-white/10 hover:bg-white/20 text-white/90'}`}>
                <Wallet className="w-4 h-4" />
              </button>
              {showRevenue && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 text-center">
                  <p className="text-[11px] text-slate-500 font-medium">المحفظة</p>
                  <p className="text-sm font-bold text-[#15317E] mt-1">قريباً</p>
                </div>
              )}
            </div>
            <ProfileMenu onLogout={handleLogout} />
          </div>
        </header>

      <form onSubmit={handleSubmit} className="space-y-5 pt-2">
        {/* Basic Info */}
        <Card>
          <CardHeader><CardTitle className="text-base">المعلومات الأساسية</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>نوع المكان *</Label>
              <Select value={form.venue_type} onValueChange={v => setForm(p => ({ ...p, venue_type: v }))}>
                <SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger>
                <SelectContent>
                  {['شاليه','مخيم','مزرعة','استراحة'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>اسم المكان *</Label>
              <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: شاليه الريم" required />
            </div>
            <div className="space-y-2">
              <Label>الرابط المختصر (اختياري)</Label>
              <Input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="alreem" dir="ltr" />
              <p className="text-xs text-muted-foreground">site.com/place/{form.slug || 'alreem'}</p>
            </div>
            <div className="space-y-2">
              <Label>المدينة *</Label>
              <CityCombobox value={form.city} onChange={v => setForm(p => ({ ...p, city: v }))} />
            </div>
            <div className="space-y-2">
              <Label>الوصف</Label>
              <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="اكتب وصفاً جذاباً للمكان..." rows={4} />
            </div>
            <div className="space-y-2">
              <Label>رابط الموقع (قوقل ماب)</Label>
              <Input value={form.maps_url} onChange={e => setForm(p => ({ ...p, maps_url: e.target.value }))} placeholder="https://maps.google.com/..." dir="ltr" />
            </div>
          </CardContent>
        </Card>

        {/* شكل صفحة العرض */}
        <Card>
          <CardHeader><CardTitle className="text-base">شكل صفحة العرض (الثيم)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setForm(p => ({ ...p, page_theme: 'classic' }))}
                className={`relative rounded-2xl border-2 p-4 text-right transition-all ${isClassic ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/40'}`}>
                {isClassic && <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3} /></div>}
                <div className="h-16 rounded-xl mb-3 bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-200 flex items-center justify-center">
                  <Sun className="w-6 h-6 text-amber-500" />
                </div>
                <div className="font-bold text-sm">فاتح كلاسيكي</div>
                <div className="text-xs text-muted-foreground mt-0.5">تصميم نظيف بلون قابل للتخصيص</div>
              </button>

              <button type="button" onClick={() => setForm(p => ({ ...p, page_theme: 'royal' }))}
                className={`relative rounded-2xl border-2 p-4 text-right transition-all ${!isClassic ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/40'}`}>
                {!isClassic && <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3} /></div>}
                <div className="h-16 rounded-xl mb-3 bg-gradient-to-br from-[#020617] to-[#0f172a] border border-[#d4af37]/30 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-[#d4af37]" />
                </div>
                <div className="font-bold text-sm">الأسود الملكي</div>
                <div className="text-xs text-muted-foreground mt-0.5">فخامة سوداء بلمسات ذهبية</div>
              </button>
            </div>

            {isClassic && (
              <div className="space-y-2 pt-2 border-t border-border">
                <Label className="text-xs text-muted-foreground">لون الثيم</Label>
                <div className="flex flex-wrap gap-2">
                  {THEME_COLORS.map(c => {
                    const active = form.theme_color === c.value;
                    return (
                      <button key={c.value} type="button" title={c.name}
                        onClick={() => setForm(p => ({ ...p, theme_color: c.value }))}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${active ? 'scale-110' : 'hover:scale-110'}`}
                        style={{ background: c.value, outline: active ? `2px solid ${c.value}` : 'none', outlineOffset: '2px' }}>
                        {active && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: form.theme_color }} />
                  <span className="text-xs text-muted-foreground">
                    {THEME_COLORS.find(c => c.value === form.theme_color)?.name || form.theme_color}
                  </span>
                </div>
              </div>
            )}
            {!isClassic && (
              <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                الثيم الأسود الملكي يستخدم اللون الذهبي تلقائياً، لذلك لا حاجة لاختيار لون.
              </p>
            )}
          </CardContent>
        </Card>

        {/* الصور والفيديو */}
        <Card>
          <CardHeader><CardTitle className="text-base">الصور والفيديو</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {form.images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border">
                  <img src={img} className="w-full h-full object-cover" />
                  <button type="button" onClick={async () => {
                    await base44.integrations.Core.DeleteFile(img);
                    setForm(p => ({ ...p, images: p.images.filter((_,j)=>j!==i) }));
                  }}
                    className="absolute top-1 left-1 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {form.images.length < 10 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition">
                  {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Upload className="w-5 h-5 text-muted-foreground" /><span className="text-xs text-muted-foreground mt-1">إضافة</span></>}
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImgUpload} disabled={uploading} />
                </label>
              )}
            </div>

            <div className="space-y-2">
              <Label>روابط يوتيوب (اختياري · حتى {MAX_YOUTUBE} مقاطع)</Label>
              {(form.youtube_urls || []).map((url, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={url} dir="ltr" placeholder="https://youtube.com/..."
                    onChange={e => {
                      const arr = [...(form.youtube_urls || [])];
                      arr[i] = e.target.value;
                      setForm(p => ({ ...p, youtube_urls: arr }));
                    }} />
                  <button type="button" onClick={() => setForm(p => ({ ...p, youtube_urls: (p.youtube_urls || []).filter((_,j)=>j!==i) }))}
                    className="text-destructive hover:text-destructive/80 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(form.youtube_urls || []).length < MAX_YOUTUBE && (
                <button type="button" onClick={() => setForm(p => ({ ...p, youtube_urls: [...(p.youtube_urls || []), ''] }))}
                  className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline mt-1">
                  <Plus className="w-4 h-4" /> إضافة رابط يوتيوب
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* الأسعار والمواعيد */}
        <Card>
          <CardHeader><CardTitle className="text-base">الأسعار والمواعيد</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>سعر أيام الأسبوع (ر.س)</Label>
                <Input type="number" value={form.price_weekday} onChange={e => setForm(p => ({ ...p, price_weekday: e.target.value }))} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>سعر الويكند (ر.س)</Label>
                <Input type="number" value={form.price_weekend} onChange={e => setForm(p => ({ ...p, price_weekend: e.target.value }))} placeholder="0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>وقت الدخول</Label>
                <Select value={form.check_in_time} onValueChange={v => setForm(p => ({ ...p, check_in_time: v }))}>
                  <SelectTrigger><SelectValue placeholder="اختر الوقت" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {TIME_OPTIONS.map(t => <SelectItem key={t.val} value={t.val}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>وقت الخروج</Label>
                <Select value={form.check_out_time} onValueChange={v => setForm(p => ({ ...p, check_out_time: v }))}>
                  <SelectTrigger><SelectValue placeholder="اختر الوقت" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {TIME_OPTIONS.map(t => <SelectItem key={t.val} value={t.val}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>رقم واتساب للتواصل *</Label>
              <Input value={form.whatsapp} onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))} placeholder="مثال: 0512345678" />
            </div>
            <div className="border border-border rounded-xl overflow-hidden">
              <button type="button" onClick={() => setShowTerms(v => !v)}
                className="w-full flex items-center gap-3 px-4 py-3 text-right bg-muted/30 hover:bg-muted/50 transition">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${showTerms ? 'bg-primary border-primary' : 'border-border'}`}>
                  {showTerms && <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />}
                </div>
                <span className="font-medium text-sm flex-1">شروط الحجز</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showTerms ? 'rotate-180' : ''}`} />
              </button>
              {showTerms && (
                <div className="p-3 border-t border-border">
                  <Textarea value={form.booking_terms} onChange={e => setForm(p => ({ ...p, booking_terms: e.target.value }))} placeholder="اكتب شروط الحجز..." rows={3} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* السوشيال */}
        <Card>
          <CardHeader className="p-0">
            <button type="button" onClick={() => setShowSocial(v => !v)}
              className="w-full flex items-center gap-3 px-6 py-4 text-right">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${showSocial ? 'bg-primary border-primary' : 'border-border'}`}>
                {showSocial && <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />}
              </div>
              <CardTitle className="text-base flex-1">حسابات التواصل الاجتماعي</CardTitle>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showSocial ? 'rotate-180' : ''}`} />
            </button>
          </CardHeader>
          {showSocial && (
            <CardContent className="space-y-3 pt-0">
              <p className="text-xs text-muted-foreground">أضف روابط حساباتك، وستظهر كأيقونات في أسفل صفحة العرض.</p>
              {SOCIAL_FIELDS.map(({ key, label, placeholder, Icon }) => (
                <div key={key} className="space-y-1.5">
                  <Label className="flex items-center gap-2 text-sm">
                    <Icon className="w-4 h-4 text-muted-foreground" /> {label}
                  </Label>
                  <Input value={form.social?.[key] || ''} dir="ltr" placeholder={placeholder}
                    onChange={e => updateSocial(key, e.target.value)} />
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        {/* المميزات */}
        <Card>
          <CardHeader><CardTitle className="text-base">المميزات</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {ALL_FEATURES.map(f => (
                <button key={f} type="button" onClick={() => toggleFeature(f)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${form.features.includes(f) ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:border-primary/30'}`}>
                  {f}
                </button>
              ))}
            </div>

            <div className="border-t border-border pt-3">
              <p className="text-xs text-muted-foreground mb-3">مزايا إضافية مخصصة — اكتب اسمها واختر أيقونة</p>
              {(form.custom_features || []).map((cf, i) => (
                <CustomFeatureRow
                  key={i}
                  cf={cf}
                  onUpdate={patch => updateCustomFeature(i, patch)}
                  onRemove={() => removeCustomFeature(i)}
                />
              ))}
              <button type="button" onClick={addCustomFeature}
                className="flex items-center gap-1.5 w-full border border-dashed border-border rounded-xl px-4 py-2.5 text-sm text-primary font-medium hover:border-primary/50 hover:bg-primary/5 transition mt-1">
                <Plus className="w-4 h-4" /> إضافة ميزة مخصصة
              </button>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={saving}>
          {saving ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" />جاري الحفظ...</> : isEdit ? 'حفظ التعديلات' : 'إضافة المكان'}
        </Button>
      </form>
      </div>
    </div>
  );
}
