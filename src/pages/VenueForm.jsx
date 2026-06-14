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
  Upload, X, Loader2, Plus, Trash2, Check, Sun, Crown, Sparkles,
  Star, ShieldCheck, Waves, Wifi, UtensilsCrossed, Tv, Dumbbell, Bath,
  Wind, Music, Camera, Heart, Gift, Mountain, Car, Bed, Flame, Trees, Instagram, ChevronDown,
  Bell, Wallet, LogOut, User, ChevronRight, CalendarCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CityCombobox from '@/components/venue/CityCombobox';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getFeaturesForType, FeatureIcons } from '@/lib/featureCatalog';

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
const AIRBNB = '#FF385C';
const DEFAULT_BOOKING_TERMS = `- يتم تأكيد الحجز بعد دفع العربون المتفق عليه.
- وقت الدخول حسب الموعد المحدد في الصفحة، ووقت الخروج حسب الموعد المحدد.
- يرجى المحافظة على نظافة المكان والممتلكات.
- يمنع إزعاج الجيران أو استخدام المكان بما يخالف الأنظمة.
- في حال الإلغاء أو تغيير الموعد يتم التنسيق مسبقاً مع الإدارة.`;

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
const SnapchatIcon = (props) => (
  <svg viewBox="0 0 448 512" fill="currentColor" {...props}>
    <path d="M424.2 263.8c-2.4-10.6-20.2-13.1-34.4-11-20.2 2.9-46.7 9-61.1 5.9-9.1-2-12.7-10.1-10.6-20.9 2-10.2 10.1-26.6 15.8-37.5 44-84.3 13.3-145-38.3-177.3C268.4 6 226.5-.4 191 1.7c-47.5 2.8-82 17.5-104.9 51.5-17.7 26.2-22.1 63.3-10.1 94.6 7.6 19.8 23 48.2 24.3 64.9 1.1 13.7-8.1 20.3-19.1 23-14.7 3.6-43.2-3.1-61.9-5.5-13.7-1.7-27.1 2-30.7 13.1-4 12.3 8.9 25 15.5 29.8 17.3 12.5 40 24.1 64.1 36.8 6.5 3.5 12.1 12 11.2 21.6-1 10.5-6.8 19.3-15.1 24.8-14.6 9.8-33.1 15.1-49.8 18.2-15.6 2.9-32.9 2.5-44.5 11.2C-5.5 391-2.9 405.3 6 414.2c16 16.1 41 18.9 62.1 22.1 19.1 2.9 38.6 3.6 57 8.3 16 4.1 30.6 11 41.5 23.3 7 7.9 13.9 17.8 24.4 23.4 12 6.5 26.7 8.7 39.5 8.7 12.5 0 25.5-2 37.2-7.8 10.7-5.3 17.8-15.5 24.9-23.7 11-12.7 25.9-19.8 42-23.9 18.6-4.8 38.3-5.3 57.6-8.2 21.2-3.2 46.5-6.1 62.6-22.4 8.7-8.8 11.5-23.4 5.2-32.2z"/>
  </svg>
);

const SOCIAL_FIELDS = [
  { key: 'instagram', label: 'انستقرام', placeholder: '@yourname', Icon: Instagram },
  { key: 'snapchat', label: 'سناب شات', placeholder: '@yourname', Icon: (p) => <SnapchatIcon {...p} /> },
  { key: 'tiktok', label: 'تيك توك', placeholder: '@yourname', Icon: (p) => <TikTokIcon {...p} /> },
  { key: 'x', label: 'إكس (تويتر)', placeholder: '@yourname', Icon: (p) => <XIcon {...p} /> },
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
        className="h-9 w-9 sm:h-11 sm:w-11 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-all text-zinc-800 flex items-center justify-center gap-1 shadow-sm active:scale-[0.98]">
        <LogOut className="w-4 h-4" />
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-3 w-48 bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors font-bold">
            <User className="w-4 h-4 text-[#FF385C]" /> الملف الشخصي
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

export default function VenueForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isEdit = !!id;
  const queryClient = useQueryClient();

  const handleLogout = async () => { await logout(false); navigate('/login'); };

  const [form, setForm] = useState({
    name: '', venue_type: '', description: '', city: '',
    maps_url: '', images: [], video_url: '',
    hero_badge: '', hero_title: '', footer_text: '',
    youtube_urls: [],
    custom_features: [],
    social: { instagram: '', snapchat: '', tiktok: '', x: '' },
    page_theme: 'classic',
    price_weekday: '', price_weekend: '',
    whatsapp: '', check_in_time: '14:00', check_out_time: '12:00',
    booking_enabled: true,
    booking_terms: DEFAULT_BOOKING_TERMS, show_terms: false, show_whatsapp_fab: true, features: [], status: 'نشط', slug: '',
    theme_color: '#c9a96e',
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successVenue, setSuccessVenue] = useState(null);
  const [showRevenue, setShowRevenue] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSocial, setShowSocial] = useState(false);

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
      hero_badge: existing.hero_badge || '',
      hero_title: existing.hero_title || '',
      footer_text: existing.footer_text || '',
      social: { instagram: '', snapchat: '', tiktok: '', x: '', ...(existing.social || {}) },
      booking_enabled: existing.booking_enabled !== false,
      booking_terms: existing.booking_terms || prev.booking_terms || DEFAULT_BOOKING_TERMS,
      show_terms: existing.show_terms === true,
      show_whatsapp_fab: existing.show_whatsapp_fab !== false,
    }));
  }, [existing]);

  // افتح قسم السوشيال تلقائياً عند تحميل البيانات لو فيه محتوى
  useEffect(() => {
    if (existing) {
      const hasSocial = Object.values(existing.social || {}).some(v => v?.trim());
      if (hasSocial) setShowSocial(true);
    }
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
      slug: form.slug || `venue-${Date.now()}`,
      custom_features: (form.custom_features || []).filter(cf => cf.label && cf.label.trim()),
      social: cleanSocial,
    };

    try {
      if (isEdit) {
        await base44.entities.Venue.update(id, data);
        await queryClient.invalidateQueries({ queryKey: ['venues'] });
        await queryClient.invalidateQueries({ queryKey: ['venue', id] });
        toast.success('تم تحديث الشاليه بنجاح');
        navigate('/venue');
      } else {
        const created = await base44.entities.Venue.create(data);
        await queryClient.invalidateQueries({ queryKey: ['venues'] });
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

  // ══ شاشة النجاح ══
  if (successVenue) return (
    <div dir="rtl" className="fixed inset-0 z-50 bg-[#F7F7F7] flex flex-col items-center justify-center p-6 text-center">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'IBM Plex Sans Arabic', sans-serif; }
      `}} />
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-zinc-950 rounded-full blur-2xl opacity-20 animate-pulse" />
        <div className="w-28 h-28 bg-zinc-950 rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-white">
          <PartyPopper className="w-12 h-12 text-white" />
        </div>
      </div>
      <h1 className="text-3xl font-black text-zinc-950 mb-3">تم الإضافة بنجاح</h1>
      <p className="text-slate-500 text-sm mb-10 max-w-[280px] leading-relaxed">
        تم إعداد صفحة <span className="font-bold text-zinc-950">{successVenue.name}</span> بنجاح. يمكنك الآن البدء في استقبال الحجوزات.
      </p>
      <div className="w-full space-y-3 max-w-sm">
        <button onClick={() => navigate('/venue')}
          className="w-full py-4 bg-zinc-950 hover:bg-black text-white rounded-2xl font-bold text-sm shadow-xl shadow-zinc-950/20 transition-all flex items-center justify-center gap-2">
          <LayoutDashboard className="w-5 h-5" /> انتقل إلى لوحة التحكم
        </button>
        <button onClick={() => {
          if (navigator.share) { navigator.share({ title: successVenue.name, url: successVenue.url }).catch(() => {}); }
          else { navigator.clipboard.writeText(successVenue.url); toast.success('تم نسخ الرابط'); }
        }}
          className="w-full py-4 bg-white border border-slate-200 hover:border-[#FF385C] hover:text-zinc-950 text-slate-700 rounded-2xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2">
          <Share2 className="w-5 h-5" /> مشاركة الصفحة
        </button>
        <button onClick={() => window.open(successVenue.url, '_blank')}
          className="w-full py-4 bg-transparent text-slate-500 hover:text-zinc-950 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
          <Eye className="w-4 h-4" /> شاهد صفحة الشاليه
        </button>
      </div>
    </div>
  );

  // ══ الصفحة الرئيسية ══
  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7] pb-10 relative">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'IBM Plex Sans Arabic', sans-serif; }
      `}} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* الهيدر الموحّد */}
        <header className="pt-4 sm:pt-5 pb-3">
          <div className="rounded-[1.6rem] bg-white/95 border border-zinc-200 shadow-[0_14px_44px_rgba(0,0,0,0.07)] backdrop-blur-xl p-3 sm:p-3.5">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => navigate('/venue')}
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-all text-zinc-800 flex items-center justify-center shadow-sm active:scale-[0.98] shrink-0"
                  title="العودة للوحة التحكم"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="relative flex-shrink-0">
                  <div className="w-[58px] h-[58px] sm:w-[68px] sm:h-[68px] rounded-[1.45rem] bg-gradient-to-br from-white to-zinc-100 overflow-hidden flex items-center justify-center border border-zinc-200 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                    {user?.office_logo_url ? (
                      <img src={user.office_logo_url} alt="شعار" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-black text-zinc-950">
                        {(user?.full_name || user?.office_name || form.name || 'م')[0]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs font-black text-zinc-400 leading-none mb-1">
                    لوحة التحكم
                  </p>
                  <h1 className="text-[15px] sm:text-xl font-black text-zinc-950 flex items-center gap-1.5 min-w-0 leading-tight">
                    <span className="truncate min-w-0 max-w-[160px] sm:max-w-none">{isEdit ? 'تعديل الشاليه' : 'إضافة مكان جديد'}</span>
                  </h1>
                  <p className="text-[11px] sm:text-xs text-zinc-500 font-bold mt-1 truncate max-w-[190px] sm:max-w-none">
                    {form.name || user?.office_name || 'بيانات المكان'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 sm:gap-2 flex-nowrap shrink-0">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowNotifs(!showNotifs)}
                    className={`relative h-9 w-9 sm:h-11 sm:w-11 rounded-2xl border transition-all flex items-center justify-center shadow-sm active:scale-[0.98] ${showNotifs ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'}`}
                    title="الإشعارات"
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                  {showNotifs && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[270px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-zinc-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="px-3.5 py-2.5 bg-zinc-950 text-white"><span className="text-sm font-black">الإشعارات</span></div>
                      <div className="px-4 py-5 text-center"><p className="text-sm text-zinc-400 font-bold">لا توجد إشعارات جديدة</p></div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowRevenue(!showRevenue)}
                    className={`h-9 w-9 sm:h-11 sm:w-11 rounded-2xl border transition-all flex items-center justify-center shadow-sm active:scale-[0.98] ${showRevenue ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'}`}
                    title="المحفظة"
                  >
                    <Wallet className="w-4 h-4" />
                  </button>
                  {showRevenue && (
                    <div className="absolute top-full left-0 mt-3 w-52 bg-white rounded-3xl shadow-2xl border border-zinc-100 p-4 z-50 text-center animate-in fade-in slide-in-from-top-2">
                      <p className="text-[11px] text-zinc-500 font-bold">المحفظة</p>
                      <p className="text-sm font-black text-zinc-950 mt-1">قريباً</p>
                    </div>
                  )}
                </div>

                <ProfileMenu onLogout={handleLogout} />
              </div>
            </div>
          </div>
        </header>

      <form onSubmit={handleSubmit} className="space-y-5 pt-3">
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
              <Label>الرابط المختصر <span className="text-xs text-slate-400 font-normal">(إنجليزي فقط)</span></Label>
              <Input
                value={form.slug}
                onChange={e => {
                  // يقبل فقط: حروف إنجليزية، أرقام، شرطة
                  const val = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, '')
                    .replace(/--+/g, '-');
                  setForm(p => ({ ...p, slug: val }));
                }}
                placeholder="my-chalet"
                dir="ltr"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">site.com/place/{form.slug || 'my-chalet'}</p>
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
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              <button type="button" onClick={() => setForm(p => ({ ...p, page_theme: 'classic' }))}
                className={`relative rounded-xl border-2 p-2.5 text-right transition-all ${form.page_theme === 'classic' ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/40'}`}>
                {form.page_theme === 'classic' && <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Check className="w-2.5 h-2.5" strokeWidth={3} /></div>}
                <div className="h-10 rounded-lg mb-2 bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-200 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-amber-500" />
                </div>
                <div className="font-bold text-xs leading-tight">فاتح كلاسيكي</div>
                <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">تصميم نظيف بلون قابل للتخصيص</div>
              </button>

              <button type="button" onClick={() => setForm(p => ({ ...p, page_theme: 'orchid' }))}
                className={`relative rounded-xl border-2 p-2.5 text-right transition-all ${form.page_theme === 'orchid' ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/40'}`}>
                {form.page_theme === 'orchid' && <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Check className="w-2.5 h-2.5" strokeWidth={3} /></div>}
                <div className="h-10 rounded-lg mb-2 border flex items-center justify-center" style={{ background: '#FCFBF8', borderColor: '#F4EAE6' }}>
                  <span style={{ fontSize: 20 }}>🌸</span>
                </div>
                <div className="font-bold text-xs leading-tight">أوركيد الناعم</div>
                <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">روز جولد ناعم وأنيق</div>
              </button>

              <button type="button" onClick={() => setForm(p => ({ ...p, page_theme: 'royal' }))}
                className={`relative rounded-xl border-2 p-2.5 text-right transition-all ${form.page_theme === 'royal' ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/40'}`}>
                {form.page_theme === 'royal' && <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Check className="w-2.5 h-2.5" strokeWidth={3} /></div>}
                <div className="h-10 rounded-lg mb-2 bg-gradient-to-br from-[#020617] to-[#0f172a] border border-[#d4af37]/30 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div className="font-bold text-xs leading-tight">الأسود الملكي</div>
                <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">فخامة سوداء بلمسات ذهبية</div>
              </button>

              <button type="button" onClick={() => setForm(p => ({ ...p, page_theme: 'resort' }))}
                className={`relative rounded-xl border-2 p-2.5 text-right transition-all ${form.page_theme === 'resort' ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/40'}`}>
                {form.page_theme === 'resort' && <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Check className="w-2.5 h-2.5" strokeWidth={3} /></div>}
                <div className="h-10 rounded-lg mb-2 border border-[#D4B982]/40 flex items-center justify-center" style={{ background: '#E8F0F0' }}>
                  <Sparkles className="w-5 h-5" style={{ color: '#0A2629' }} />
                </div>
                <div className="font-bold text-xs leading-tight">المنتجع الفاخر</div>
                <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">تيل داكن فاخر بلمسات ذهبية</div>
              </button>

              <button type="button" onClick={() => setForm(p => ({ ...p, page_theme: 'glass' }))}
                className={`relative rounded-xl border-2 p-2.5 text-right transition-all ${form.page_theme === 'glass' ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/40'}`}>
                {form.page_theme === 'glass' && <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Check className="w-2.5 h-2.5" strokeWidth={3} /></div>}
                <div className="h-10 rounded-lg mb-2 border border-[#CBA396]/40 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#fdfcfb,#e8ddd6)' }}>
                  <Sparkles className="w-5 h-5" style={{ color: '#CBA396' }} />
                </div>
                <div className="font-bold text-xs leading-tight">الكريستال</div>
                <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">زجاجي عصري بلمسة دافئة</div>
              </button>
            </div>

            {/* تخصيص نصوص ثيم أوركيد */}
            {form.page_theme === 'orchid' && (
              <div className="space-y-3 pt-3 border-t border-border">
                <p className="text-xs font-bold text-foreground">✏️ تخصيص نصوص الثيم</p>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">الشارة الصغيرة (فوق العنوان)</Label>
                  <Input
                    placeholder="اللطافة في كل تفصيلة"
                    value={form.hero_badge || ''}
                    onChange={e => setForm(p => ({ ...p, hero_badge: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">العنوان الرئيسي (الهيرو)</Label>
                  <Input
                    placeholder="الهدوء الذي تستحقه"
                    value={form.hero_title || ''}
                    onChange={e => setForm(p => ({ ...p, hero_title: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">نص الفوتر التسويقي</Label>
                  <Textarea
                    placeholder="صممنا هذا المكان بحب، ليكون وجهتك الأولى للراحة والسكينة..."
                    value={form.footer_text || ''}
                    onChange={e => setForm(p => ({ ...p, footer_text: e.target.value }))}
                    className="text-sm resize-none"
                    rows={2}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">اتركها فاضية لاستخدام النصوص الافتراضية</p>
              </div>
            )}

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
            {form.page_theme === 'royal' && (
              <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                الثيم الأسود الملكي يستخدم اللون الذهبي تلقائياً، لذلك لا حاجة لاختيار لون.
              </p>
            )}
            {form.page_theme === 'resort' && (
              <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                ثيم المنتجع الفاخر يستخدم ألوان التيل الداكن والذهبي تلقائياً، لذلك لا حاجة لاختيار لون.
              </p>
            )}

            {form.page_theme === 'glass' && (
              <div className="space-y-4 pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  ثيم الكريستال يستخدم لونه الأساسي الدافئ تلقائياً، لذلك لا حاجة لاختيار لون.
                </p>

                <label className="flex items-center justify-between gap-3 bg-muted/40 border border-border rounded-2xl px-4 py-3 cursor-pointer select-none">
                  <span className="text-sm font-bold">إظهار زر الواتساب العائم</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.show_whatsapp_fab !== false}
                    onClick={() => setForm(p => ({ ...p, show_whatsapp_fab: p.show_whatsapp_fab === false ? true : false }))}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${form.show_whatsapp_fab !== false ? 'bg-[#CBA396]' : 'bg-zinc-300'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${form.show_whatsapp_fab !== false ? 'translate-x-[-22px]' : 'translate-x-[-2px]'}`} />
                  </button>
                </label>
              </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>سعر أيام الأسبوع (ر.س)</Label>
                <Input type="number" value={form.price_weekday} onChange={e => setForm(p => ({ ...p, price_weekday: e.target.value }))} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>سعر الويكند (ر.س)</Label>
                <Input type="number" value={form.price_weekend} onChange={e => setForm(p => ({ ...p, price_weekend: e.target.value }))} placeholder="0" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${form.booking_enabled !== false ? 'bg-[#FF385C]/10 text-[#FF385C]' : 'bg-zinc-200 text-zinc-500'}`}>
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-zinc-950">تفعيل الحجوزات</p>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5 leading-relaxed">
                    عند التعطيل يتم إخفاء زر الحجز من صفحة العميل.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setForm(p => ({ ...p, booking_enabled: p.booking_enabled === false }))}
                className={`relative w-14 h-8 rounded-full transition-all shrink-0 ${form.booking_enabled !== false ? 'bg-[#FF385C]' : 'bg-zinc-300'}`}
                aria-pressed={form.booking_enabled !== false}
                title={form.booking_enabled !== false ? 'الحجوزات مفعلة' : 'الحجوزات معطلة'}
              >
                <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${form.booking_enabled !== false ? 'right-7' : 'right-1'}`} />
              </button>
            </div>

            <div className="space-y-2">
              <Label>رقم واتساب للتواصل *</Label>
              <Input value={form.whatsapp} onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))} placeholder="مثال: 0512345678" />
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <Label className="text-sm font-black text-zinc-950">شروط الحجز</Label>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                    هذه الشروط محفوظة مع بيانات الشاليه وتظهر تلقائياً في سند الاستلام، ويمكن تعديلها هنا في أي وقت.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, booking_terms: DEFAULT_BOOKING_TERMS }))}
                  className="text-xs font-bold text-[#FF385C] hover:text-[#E31C5F] shrink-0"
                >
                  استعادة الافتراضي
                </button>
              </div>
              <Textarea
                value={form.booking_terms || ''}
                onChange={e => setForm(p => ({ ...p, booking_terms: e.target.value }))}
                placeholder="اكتب شروط الحجز، العربون، وقت الدخول والخروج، أو أي تعليمات مهمة..."
                rows={5}
                className="resize-none leading-7"
              />
              <p className="text-[11px] text-zinc-950 font-bold flex items-center gap-1.5 bg-zinc-950/5 px-3 py-2 rounded-xl">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 flex-shrink-0"><path d="M9 12h6m-3-3v6M12 2a10 10 0 100 20A10 10 0 0012 2z"/></svg>
                يتم حفظ هذه الشروط في الحقل نفسه booking_terms المستخدم في سند الاستلام.
              </p>

              <label className="flex items-center justify-between gap-3 mt-3 bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 cursor-pointer select-none">
                <span className="text-sm font-bold text-zinc-800">عرض الشروط في صفحتك العامة؟</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.show_terms === true}
                  onClick={() => setForm(p => ({ ...p, show_terms: !p.show_terms }))}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${form.show_terms ? 'bg-[#FF385C]' : 'bg-zinc-300'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${form.show_terms ? 'translate-x-[-22px]' : 'translate-x-[-2px]'}`} />
                </button>
              </label>
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
              {getFeaturesForType(form.venue_type).map(f => {
                const FIcon = FeatureIcons[f.icon];
                return (
                <button key={f.id} type="button" onClick={() => toggleFeature(f.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${form.features.includes(f.id) ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:border-primary/30'}`}>
                  <FIcon className="w-4 h-4 flex-shrink-0" />{f.id}
                </button>
                );
              })}
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

        <Button type="submit" size="lg" className="w-full h-14 rounded-2xl bg-zinc-950 hover:bg-black text-white font-black shadow-[0_14px_30px_rgba(0,0,0,0.16)]" disabled={saving}>
          {saving ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" />جاري الحفظ...</> : isEdit ? 'حفظ التعديلات' : 'إضافة المكان'}
        </Button>
      </form>
      </div>
    </div>
  );
}
