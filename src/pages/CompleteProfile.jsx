import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Loader2, Building2, Phone, Upload, Hotel, Tent, Leaf, Trees,
  Home, MapPin, ArrowRight, PartyPopper, Share2, Eye, Rocket, ChevronRight,
  X, Plus, Trash2, Check, Sun, Crown, Star, ShieldCheck, Waves, Wifi,
  UtensilsCrossed, Tv, Dumbbell, Bath, Wind, Instagram, ChevronDown,
  CheckCircle2, Coins, Users
} from "lucide-react";
import CityCombobox from "@/components/venue/CityCombobox";

// ── ثوابت ──
const CITIES = ["الرياض","جدة","مكة المكرمة","المدينة المنورة","الدمام","الخبر","الطائف","تبوك","بريدة","حائل","أبها","خميس مشيط","جازان","نجران","ينبع","الجبيل","الأحساء","القطيف","الرس","عنيزة","الزلفي","المجمعة","شقراء","الدوادمي","الأفلاج","وادي الدواسر","سكاكا","القريات","عرعر","رفحاء","طريف","الوجه","أملج","ضباء","البدع","بيشة","محايل عسير","صبيا","أبو عريش","صامطة","الليث","رابغ","القنفذة","الباحة","بلجرشي","المندق","مدينة الملك عبدالله الاقتصادية"];

const ROLES = [
  { id: 'وسيط',    label: 'وسيط عقاري',   Icon: Building2, desc: 'إدارة وعرض العقارات للبيع والإيجار' },
  { id: 'شاليه',   label: 'مالك شاليه',    Icon: Hotel,     desc: 'إدارة الشاليه وحجوزاته' },
  { id: 'مخيم',    label: 'مالك مخيم',     Icon: Tent,      desc: 'إدارة المخيم والحجوزات' },
  { id: 'مزرعة',   label: 'مالك مزرعة',    Icon: Leaf,      desc: 'إدارة المزرعة وخدماتها' },
  { id: 'استراحة', label: 'مالك استراحة',  Icon: Trees,     desc: 'إدارة الاستراحة وحجوزاتها' },
];
const VENUE_ROLES = ['شاليه','مخيم','مزرعة','استراحة'];

const ALL_FEATURES = ["مسبح","جلسات خارجية","واي فاي","ملعب","مطبخ","دخول ذاتي","ألعاب أطفال","شواء","قسم رجال","قسم نساء","غرف نوم","حديقة","مولد كهرباء","مكيف","مدفأة"];

const CUSTOM_ICON_OPTIONS = [
  { key: 'star', Icon: Star }, { key: 'shield', Icon: ShieldCheck },
  { key: 'waves', Icon: Waves }, { key: 'wifi', Icon: Wifi },
  { key: 'grill', Icon: UtensilsCrossed }, { key: 'tv', Icon: Tv },
  { key: 'gym', Icon: Dumbbell }, { key: 'bath', Icon: Bath },
  { key: 'ac', Icon: Wind }, { key: 'sun', Icon: Sun },
];

const MAX_YOUTUBE = 5;

const TikTokIcon = (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.41-.02-.34-.02-.68-.02-1.02.13-1.6.82-3.08 1.94-4.21 1.52-1.52 3.8-2.26 5.86-1.92V14.3c-1.11-.27-2.31-.1-3.29.41-.85.45-1.46 1.25-1.63 2.21-.07.39-.07.79-.02 1.18.17 1.25 1.05 2.34 2.19 2.81 1.29.54 2.8.46 4.02-.2 1.19-.65 1.95-1.9 2.05-3.26.2-2.9.06-5.82.09-8.73z"/></svg>;
const XIcon = (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>;
const SnapchatIcon = (p) => <svg viewBox="0 0 448 512" fill="currentColor" {...p}><path d="M424.2 263.8c-2.4-10.6-20.2-13.1-34.4-11-20.2 2.9-46.7 9-61.1 5.9-9.1-2-12.7-10.1-10.6-20.9 2-10.2 10.1-26.6 15.8-37.5 44-84.3 13.3-145-38.3-177.3C268.4 6 226.5-.4 191 1.7c-47.5 2.8-82 17.5-104.9 51.5-17.7 26.2-22.1 63.3-10.1 94.6 7.6 19.8 23 48.2 24.3 64.9 1.1 13.7-8.1 20.3-19.1 23-14.7 3.6-43.2-3.1-61.9-5.5-13.7-1.7-27.1 2-30.7 13.1-4 12.3 8.9 25 15.5 29.8 17.3 12.5 40 24.1 64.1 36.8 6.5 3.5 12.1 12 11.2 21.6-1 10.5-6.8 19.3-15.1 24.8-14.6 9.8-33.1 15.1-49.8 18.2-15.6 2.9-32.9 2.5-44.5 11.2C-5.5 391-2.9 405.3 6 414.2c16 16.1 41 18.9 62.1 22.1 19.1 2.9 38.6 3.6 57 8.3 16 4.1 30.6 11 41.5 23.3 7 7.9 13.9 17.8 24.4 23.4 12 6.5 26.7 8.7 39.5 8.7 12.5 0 25.5-2 37.2-7.8 10.7-5.3 17.8-15.5 24.9-23.7 11-12.7 25.9-19.8 42-23.9 18.6-4.8 38.3-5.3 57.6-8.2 21.2-3.2 46.5-6.1 62.6-22.4 8.7-8.8 11.5-23.4 5.2-32.2z"/></svg>;

const SOCIAL_FIELDS = [
  { key: 'instagram', label: 'انستقرام', placeholder: '@yourname', Icon: Instagram },
  { key: 'snapchat',  label: 'سناب شات', placeholder: '@yourname',  Icon: SnapchatIcon },
  { key: 'tiktok',    label: 'تيك توك',  placeholder: '@yourname',  Icon: TikTokIcon },
  { key: 'x',         label: 'إكس',      placeholder: '@yourname',         Icon: XIcon },
];

const THEME_COLORS = [
  { name: 'ذهبي', value: '#c9a96e' }, { name: 'أخضر زمردي', value: '#0f3d36' },
  { name: 'كحلي', value: '#1e304a' }, { name: 'نبيتي', value: '#7c2d3a' },
  { name: 'بني فاخر', value: '#6b4f3a' }, { name: 'تركوازي', value: '#1d7874' },
  { name: 'بنفسجي', value: '#5b3a70' }, { name: 'أزرق ملكي', value: '#2c4a7c' },
  { name: 'رمادي فحمي', value: '#2f3640' }, { name: 'وردي هادئ', value: '#b56576' },
];

const TIME_OPTIONS = (() => {
  const out = [];
  for (let h = 0; h < 24; h++) for (const m of [0,30]) {
    const val = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
    const period = h < 12 ? 'ص' : 'م'; let h12 = h % 12; if (!h12) h12 = 12;
    out.push({ val, label: `${h12}:${String(m).padStart(2,'0')} ${period}` });
  }
  return out;
})();

// ── مكوّن أيقونة مخصصة ──
function CustomFeatureRow({ cf, onUpdate, onRemove }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const ActiveIcon = CUSTOM_ICON_OPTIONS.find(o => o.key === cf.icon)?.Icon || Star;
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div className="flex items-center gap-2 mb-2">
      <button type="button" onClick={onRemove} className="text-rose-500 hover:text-rose-700 shrink-0"><Trash2 className="w-4 h-4" /></button>
      <Input value={cf.label} onChange={e => onUpdate({ label: e.target.value })} placeholder="مثال: إطلالة جبلية" className="flex-1 h-9" />
      <div className="relative" ref={ref}>
        <button type="button" onClick={() => setOpen(o => !o)} className="w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center hover:border-[#15317E]/50 transition shrink-0">
          <ActiveIcon className="w-4 h-4 text-slate-500" />
        </button>
        {open && (
          <div className="absolute right-0 top-10 z-50 bg-white border border-slate-200 rounded-xl shadow-lg p-2 grid grid-cols-5 gap-1.5 w-52">
            {CUSTOM_ICON_OPTIONS.map(({ key, Icon }) => (
              <button key={key} type="button" onClick={() => { onUpdate({ icon: key }); setOpen(false); }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${cf.icon === key ? 'bg-[#15317E] text-white border-[#15317E]' : 'bg-slate-50 text-slate-500 border-transparent hover:border-[#15317E]/40'}`}>
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── هيدر المراحل ──
function StepHeader({ step, total, onBack, title }) {
  return (
    <div className="bg-[#15317E] pt-6 pb-8 px-4 rounded-b-[2.5rem] shadow-lg mb-6">
      <div className="flex items-center mb-5">
        {onBack ? (
          <button onClick={onBack} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all flex items-center justify-center text-white">
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : <div className="w-10 h-10" />}
        <h1 className="flex-1 text-center text-white text-lg font-bold">{title}</h1>
        <div className="w-10 h-10" />
      </div>
      <div className="flex items-center gap-1.5 justify-center px-6">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/20">
            <div className="h-full rounded-full transition-all duration-500 bg-white" style={{ width: i < step ? '100%' : '0%' }} />
          </div>
        ))}
      </div>
      <p className="text-center text-white/70 text-[10px] font-bold mt-3">الخطوة {step} من {total}</p>
    </div>
  );
}

function Style() {
  return <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap'); body { font-family: 'Tajawal', sans-serif; }`}} />;
}

export default function CompleteProfile() {
  const [phase, setPhase] = useState("role-select");
  const [role, setRole]   = useState("");

  // بيانات الوسيط
  const [brokerForm, setBrokerForm] = useState({ office_name: "", phone: "", city: "", office_logo_url: "" });

  // بيانات الشاليه — نفس VenueForm
  const [form, setForm] = useState({
    name: '', venue_type: '', description: '', city: '',
    maps_url: '', images: [], youtube_urls: [],
    custom_features: [],
    social: { instagram: '', snapchat: '', tiktok: '', x: '' },
    page_theme: 'classic', theme_color: '#c9a96e',
    price_weekday: '', price_weekend: '',
    whatsapp: '', check_in_time: '14:00', check_out_time: '12:00',
    booking_terms: '', features: [], status: 'نشط', slug: '',
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [venueSlug, setVenueSlug] = useState("");
  const [showSocial, setShowSocial] = useState(false);
  const [showTerms, setShowTerms]   = useState(false);

  // ── رفع شعار الوسيط ──
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setBrokerForm(p => ({ ...p, office_logo_url: file_url }));
    setUploading(false);
  };

  // ── رفع صور الشاليه (متعدد) ──
  const handleImgUpload = async (e) => {
    const files = Array.from(e.target.files); if (!files.length) return;
    setUploading(true);
    const urls = [...form.images];
    for (const file of files.slice(0, 10 - urls.length)) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      urls.push(file_url);
    }
    setForm(p => ({ ...p, images: urls }));
    setUploading(false);
  };

  const toggleFeature = (f) => setForm(p => ({ ...p, features: p.features.includes(f) ? p.features.filter(x => x !== f) : [...p.features, f] }));
  const addCustomFeature  = () => setForm(p => ({ ...p, custom_features: [...(p.custom_features||[]), { label: '', icon: 'star' }] }));
  const updateCustomFeature = (i, patch) => setForm(p => { const arr = [...(p.custom_features||[])]; arr[i] = {...arr[i],...patch}; return {...p, custom_features: arr}; });
  const removeCustomFeature = (i) => setForm(p => ({ ...p, custom_features: (p.custom_features||[]).filter((_,j)=>j!==i) }));
  const updateSocial = (key, val) => setForm(p => ({ ...p, social: {...(p.social||{}), [key]: val} }));

  // ── حفظ الوسيط ──
  const saveBroker = async (e) => {
    e.preventDefault(); setError("");
    if (!brokerForm.office_name || !brokerForm.phone || !brokerForm.city) { setError("يرجى تعبئة جميع الحقول"); return; }
    setSaving(true);
    await base44.auth.updateMe({ ...brokerForm, business_type: role });
    window.location.href = "/";
  };

  // ── حفظ الشاليه ──
  const saveVenue = async () => {
    setSaving(true); setError("");
    try {
      const me = await base44.auth.me();
      await base44.auth.updateMe({ business_type: role, office_name: form.name, phone: form.whatsapp });
      const cleanSocial = {};
      Object.entries(form.social||{}).forEach(([k,v]) => { if (v?.trim()) cleanSocial[k] = v.trim(); });
      const slug = form.slug || form.name.trim().replace(/\s+/g,'-').toLowerCase() + '-' + Date.now();
      await base44.entities.Venue.create({
        ...form,
        price_weekday: form.price_weekday ? Number(form.price_weekday) : undefined,
        price_weekend: form.price_weekend ? Number(form.price_weekend) : undefined,
        owner_id: me?.id,
        slug,
        venue_type: role,
        custom_features: (form.custom_features||[]).filter(cf => cf.label?.trim()),
        social: cleanSocial,
      });
      setVenueSlug(slug);
      setPhase("success");
    } catch (_) { setError("حدث خطأ، حاول مجدداً"); }
    setSaving(false);
  };

  const roleLabel   = ROLES.find(r => r.id === role)?.label || '';
  const venuePublicUrl = `${window.location.origin}/place/${venueSlug}`;
  const isClassic   = form.page_theme === 'classic';

  // ══════════════════════════════════════════════════
  // PHASE: اختيار الدور
  // ══════════════════════════════════════════════════
  if (phase === "role-select") return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] font-sans flex justify-center">
      <div className="w-full max-w-md">
        <div className="bg-[#15317E] pt-8 pb-10 px-4 rounded-b-[2.5rem] shadow-lg mb-8 text-center">
          <h1 className="text-2xl font-black text-white mb-2">أهلاً بك معنا!</h1>
          <p className="text-white/70 text-sm">حدد صفتك للبدء في إعداد حسابك</p>
        </div>
        <div className="px-5 space-y-3">
          {ROLES.map(r => (
            <button key={r.id} onClick={() => { setRole(r.id); setForm(p=>({...p,venue_type:r.id})); setPhase(r.id==='وسيط'?"broker-form":"venue-step-1"); }}
              className="w-full relative p-5 rounded-[1.5rem] border-2 border-slate-100 bg-white hover:border-[#15317E]/40 hover:bg-[#15317E]/5 text-right transition-all flex items-center gap-4 shadow-sm">
              <div className="p-3 rounded-2xl bg-slate-100 text-slate-500"><r.Icon className="w-6 h-6" /></div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-700 mb-0.5">{r.label}</h3>
                <p className="text-xs text-slate-500">{r.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
      <Style />
    </div>
  );

  // ══════════════════════════════════════════════════
  // PHASE: فورم الوسيط
  // ══════════════════════════════════════════════════
  if (phase === "broker-form") return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] font-sans flex justify-center pb-10">
      <div className="w-full max-w-md">
        <StepHeader step={1} total={1} onBack={() => setPhase("role-select")} title="إكمال بيانات الحساب" />
        <div className="px-5">
          {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">{error}</div>}
          <form onSubmit={saveBroker} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">اسم المكتب العقاري *</label>
              <div className="relative">
                <input value={brokerForm.office_name} onChange={e=>setBrokerForm(p=>({...p,office_name:e.target.value}))} placeholder="مثال: مكتب النخبة العقاري"
                  className="w-full pl-4 pr-11 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-[#15317E] focus:ring-1 focus:ring-[#15317E] outline-none text-sm font-medium shadow-sm transition-all" />
                <Building2 className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">رقم الجوال *</label>
              <div className="relative">
                <input value={brokerForm.phone} onChange={e=>setBrokerForm(p=>({...p,phone:e.target.value}))} placeholder="05xxxxxxxx" dir="ltr"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-[#15317E] focus:ring-1 focus:ring-[#15317E] outline-none text-sm font-medium shadow-sm transition-all" />
                <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">المدينة *</label>
              <Select value={brokerForm.city} onValueChange={v=>setBrokerForm(p=>({...p,city:v}))}>
                <SelectTrigger className="h-12 rounded-2xl border-slate-200"><SelectValue placeholder="اختر مدينتك" /></SelectTrigger>
                <SelectContent>{CITIES.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">الشعار (اختياري)</label>
              <label className="flex items-center gap-3 h-12 px-4 border border-slate-200 bg-white rounded-2xl cursor-pointer hover:bg-slate-50 transition shadow-sm">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> :
                  brokerForm.office_logo_url ? <img src={brokerForm.office_logo_url} alt="شعار" className="h-8 w-8 object-contain rounded" /> :
                  <Upload className="w-4 h-4 text-slate-400" />}
                <span className="text-sm text-slate-500">{brokerForm.office_logo_url ? "تم رفع الشعار ✓" : "رفع الشعار"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
              </label>
            </div>
            <button type="submit" disabled={saving||uploading}
              className="w-full mt-4 py-4 bg-[#15317E] text-white rounded-2xl font-bold text-base shadow-lg shadow-[#15317E]/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin"/>جاري الحفظ...</> : 'حفظ والمتابعة'}
            </button>
          </form>
        </div>
      </div>
      <Style />
    </div>
  );

  // ══════════════════════════════════════════════════
  // PHASE: شاليه خطوة 1 — معلومات أساسية + ثيم
  // ══════════════════════════════════════════════════
  if (phase === "venue-step-1") return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] font-sans flex justify-center pb-10">
      <div className="w-full max-w-md">
        <StepHeader step={1} total={4} onBack={() => setPhase("role-select")} title="إعداد الحساب" />
        <div className="px-5 space-y-5">
          <div><h2 className="text-xl font-bold text-[#15317E] mb-1">المعلومات الأساسية</h2><p className="text-slate-500 text-xs">دعنا نتعرف على {roleLabel} الخاص بك</p></div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">اسم {roleLabel} *</label>
            <div className="relative">
              <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder={`مثال: ${roleLabel} سيمفوني الفاخر`}
                className="w-full pl-4 pr-11 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-[#15317E] focus:ring-1 focus:ring-[#15317E] outline-none text-sm font-medium shadow-sm transition-all" />
              <Home className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">الرابط المختصر (اختياري)</label>
            <input value={form.slug} onChange={e=>setForm(p=>({...p,slug:e.target.value}))} placeholder="alreem" dir="ltr"
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-[#15317E] focus:ring-1 focus:ring-[#15317E] outline-none text-sm font-medium shadow-sm transition-all" />
            <p className="text-xs text-slate-400 mt-1 pr-1">site.com/place/{form.slug||'alreem'}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">المدينة *</label>
            <CityCombobox value={form.city} onChange={v=>setForm(p=>({...p,city:v}))} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">الوصف</label>
            <Textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="اكتب وصفاً جذاباً..." rows={3}
              className="rounded-2xl border-slate-200 focus:border-[#15317E] focus:ring-1 focus:ring-[#15317E] resize-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">رابط الموقع (Google Maps)</label>
            <div className="relative">
              <input type="url" dir="ltr" value={form.maps_url} onChange={e=>setForm(p=>({...p,maps_url:e.target.value}))} placeholder="https://maps.google.com/..."
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-[#15317E] focus:ring-1 focus:ring-[#15317E] outline-none text-sm font-medium shadow-sm transition-all" />
              <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* ثيم الصفحة */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-3">شكل صفحة العرض</label>
            <div className="grid grid-cols-2 gap-3">
              {[{id:'classic',label:'فاتح كلاسيكي',sub:'تصميم نظيف بلون قابل للتخصيص'},{id:'royal',label:'الأسود الملكي',sub:'فخامة سوداء بلمسات ذهبية'}].map(t=>(
                <button key={t.id} type="button" onClick={()=>setForm(p=>({...p,page_theme:t.id}))}
                  className={`relative rounded-2xl border-2 p-4 text-right transition-all ${form.page_theme===t.id?'border-[#15317E] ring-2 ring-[#15317E]/20':'border-slate-200 hover:border-[#15317E]/40'}`}>
                  {form.page_theme===t.id&&<div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[#15317E] text-white flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3}/></div>}
                  <div className={`h-14 rounded-xl mb-2 flex items-center justify-center ${t.id==='classic'?'bg-gradient-to-br from-gray-50 to-gray-200':'bg-gradient-to-br from-[#020617] to-[#0f172a] border border-yellow-500/30'}`}>
                    {t.id==='classic'?<Sun className="w-5 h-5 text-amber-500"/>:<Crown className="w-5 h-5 text-yellow-400"/>}
                  </div>
                  <div className="font-bold text-sm text-slate-700">{t.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{t.sub}</div>
                </button>
              ))}
            </div>
            {isClassic && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-500 mb-2">لون الثيم</p>
                <div className="flex flex-wrap gap-2">
                  {THEME_COLORS.map(c=>(
                    <button key={c.value} type="button" title={c.name}
                      onClick={()=>setForm(p=>({...p,theme_color:c.value}))}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${form.theme_color===c.value?'scale-110':''}`}
                      style={{background:c.value,outline:form.theme_color===c.value?`2px solid ${c.value}`:'none',outlineOffset:'2px'}}>
                      {form.theme_color===c.value&&<Check className="w-3.5 h-3.5 text-white" strokeWidth={3}/>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={()=>setPhase("venue-step-2")} disabled={!form.name||!form.city}
            className="w-full mt-4 py-4 bg-[#15317E] text-white rounded-2xl font-bold text-base shadow-lg shadow-[#15317E]/20 disabled:opacity-50 transition-all">
            التالي
          </button>
        </div>
      </div>
      <Style />
    </div>
  );

  // ══════════════════════════════════════════════════
  // PHASE: شاليه خطوة 2 — الصور + يوتيوب
  // ══════════════════════════════════════════════════
  if (phase === "venue-step-2") return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] font-sans flex justify-center pb-10">
      <div className="w-full max-w-md">
        <StepHeader step={2} total={4} onBack={()=>setPhase("venue-step-1")} title="إعداد الحساب" />
        <div className="px-5 space-y-5">
          <div><h2 className="text-xl font-bold text-[#15317E] mb-1">الصور والفيديو</h2><p className="text-slate-500 text-xs">أضف صوراً جذابة تبرز جمال المكان</p></div>

          {/* شبكة الصور */}
          <div className="grid grid-cols-3 gap-2">
            {form.images.map((img,i)=>(
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <img src={img} className="w-full h-full object-cover" />
                <button type="button" onClick={async()=>{ await base44.integrations.Core.DeleteFile(img); setForm(p=>({...p,images:p.images.filter((_,j)=>j!==i)})); }}
                  className="absolute top-1 left-1 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  <X className="w-3 h-3"/>
                </button>
              </div>
            ))}
            {form.images.length < 10 && (
              <label className="aspect-square rounded-2xl border-2 border-dashed border-[#15317E]/30 bg-[#15317E]/5 flex flex-col items-center justify-center cursor-pointer hover:border-[#15317E]/50 hover:bg-[#15317E]/10 transition">
                {uploading ? <Loader2 className="w-6 h-6 animate-spin text-[#15317E]"/> : <><Upload className="w-5 h-5 text-[#15317E]"/><span className="text-xs text-[#15317E] mt-1 font-medium">إضافة</span></>}
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImgUpload} disabled={uploading} />
              </label>
            )}
          </div>

          {/* روابط يوتيوب */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">روابط يوتيوب (اختياري · حتى {MAX_YOUTUBE} مقاطع)</label>
            {(form.youtube_urls||[]).map((url,i)=>(
              <div key={i} className="flex gap-2 mb-2">
                <input value={url} dir="ltr" placeholder="https://youtube.com/..." onChange={e=>{const arr=[...(form.youtube_urls||[])];arr[i]=e.target.value;setForm(p=>({...p,youtube_urls:arr}));}}
                  className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-[#15317E] focus:ring-1 focus:ring-[#15317E] outline-none text-sm transition-all" />
                <button type="button" onClick={()=>setForm(p=>({...p,youtube_urls:(p.youtube_urls||[]).filter((_,j)=>j!==i)}))} className="text-rose-500 shrink-0"><Trash2 className="w-4 h-4"/></button>
              </div>
            ))}
            {(form.youtube_urls||[]).length < MAX_YOUTUBE && (
              <button type="button" onClick={()=>setForm(p=>({...p,youtube_urls:[...(p.youtube_urls||[]),'']}))}
                className="flex items-center gap-1.5 text-sm text-[#15317E] font-medium hover:underline mt-1">
                <Plus className="w-4 h-4"/> إضافة رابط يوتيوب
              </button>
            )}
          </div>

          <button onClick={()=>setPhase("venue-step-3")} disabled={form.images.length===0}
            className="w-full mt-4 py-4 bg-[#15317E] text-white rounded-2xl font-bold text-base shadow-lg shadow-[#15317E]/20 disabled:opacity-50 transition-all">
            التالي
          </button>
        </div>
      </div>
      <Style />
    </div>
  );

  // ══════════════════════════════════════════════════
  // PHASE: شاليه خطوة 3 — المميزات + السوشيال
  // ══════════════════════════════════════════════════
  if (phase === "venue-step-3") return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] font-sans flex justify-center pb-10">
      <div className="w-full max-w-md">
        <StepHeader step={3} total={4} onBack={()=>setPhase("venue-step-2")} title="إعداد الحساب" />
        <div className="px-5 space-y-5">
          <div><h2 className="text-xl font-bold text-[#15317E] mb-1">المميزات والمرافق</h2><p className="text-slate-500 text-xs">حدد ما يتوفر لتشجيع الحجز</p></div>

          {/* الميزات الجاهزة */}
          <div className="flex flex-wrap gap-2">
            {ALL_FEATURES.map(f=>(
              <button key={f} type="button" onClick={()=>toggleFeature(f)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${form.features.includes(f)?'bg-[#15317E] text-white border-[#15317E]':'bg-white text-slate-600 border-slate-200 hover:border-[#15317E]/30'}`}>
                {f}
              </button>
            ))}
          </div>

          {/* ميزات مخصصة */}
          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-bold text-slate-500 mb-3">مزايا إضافية مخصصة</p>
            {(form.custom_features||[]).map((cf,i)=>(
              <CustomFeatureRow key={i} cf={cf} onUpdate={patch=>updateCustomFeature(i,patch)} onRemove={()=>removeCustomFeature(i)} />
            ))}
            <button type="button" onClick={addCustomFeature}
              className="flex items-center gap-1.5 w-full border border-dashed border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#15317E] font-medium hover:border-[#15317E]/50 hover:bg-[#15317E]/5 transition mt-1">
              <Plus className="w-4 h-4"/> إضافة ميزة مخصصة
            </button>
          </div>

          {/* السوشيال */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button type="button" onClick={()=>setShowSocial(v=>!v)}
              className="w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-slate-50 transition">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${showSocial?'bg-[#15317E] border-[#15317E]':'border-slate-300'}`}>
                {showSocial&&<Check className="w-3 h-3 text-white" strokeWidth={3}/>}
              </div>
              <span className="font-bold text-sm text-slate-700 flex-1">حسابات التواصل الاجتماعي (اختياري)</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showSocial?'rotate-180':''}`}/>
            </button>
            {showSocial && (
              <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-500">ستظهر كأيقونات في أسفل صفحة العرض</p>
                {SOCIAL_FIELDS.map(({key,label,placeholder,Icon})=>(
                  <div key={key}>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1.5"><Icon className="w-4 h-4"/>{label}</label>
                    <input value={form.social?.[key]||''} dir="ltr" placeholder={placeholder} onChange={e=>updateSocial(key,e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#15317E] focus:ring-1 focus:ring-[#15317E] outline-none text-sm transition-all"/>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={()=>setPhase("venue-step-4")}
            className="w-full mt-4 py-4 bg-[#15317E] text-white rounded-2xl font-bold text-base shadow-lg shadow-[#15317E]/20 transition-all">
            التالي
          </button>
        </div>
      </div>
      <Style />
    </div>
  );

  // ══════════════════════════════════════════════════
  // PHASE: شاليه خطوة 4 — الأسعار والمواعيد والواتساب
  // ══════════════════════════════════════════════════
  if (phase === "venue-step-4") return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] font-sans flex justify-center pb-10">
      <div className="w-full max-w-md">
        <StepHeader step={4} total={4} onBack={()=>setPhase("venue-step-3")} title="إعداد الحساب" />
        <div className="px-5 space-y-5">
          <div><h2 className="text-xl font-bold text-[#15317E] mb-1">الأسعار والمواعيد</h2><p className="text-slate-500 text-xs">حدد التسعير وأوقات الدخول والخروج</p></div>
          {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">سعر أيام الأسبوع (ر.س)</label>
              <input type="number" value={form.price_weekday} onChange={e=>setForm(p=>({...p,price_weekday:e.target.value}))} placeholder="0" dir="ltr"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-[#15317E] focus:ring-1 focus:ring-[#15317E] outline-none text-sm font-bold text-center shadow-sm transition-all"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">سعر الويكند (ر.س)</label>
              <input type="number" value={form.price_weekend} onChange={e=>setForm(p=>({...p,price_weekend:e.target.value}))} placeholder="0" dir="ltr"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-[#15317E] focus:ring-1 focus:ring-[#15317E] outline-none text-sm font-bold text-center shadow-sm transition-all"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">وقت الدخول</label>
              <Select value={form.check_in_time} onValueChange={v=>setForm(p=>({...p,check_in_time:v}))}>
                <SelectTrigger className="h-11 rounded-2xl border-slate-200"><SelectValue/></SelectTrigger>
                <SelectContent className="max-h-60">{TIME_OPTIONS.map(t=><SelectItem key={t.val} value={t.val}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">وقت الخروج</label>
              <Select value={form.check_out_time} onValueChange={v=>setForm(p=>({...p,check_out_time:v}))}>
                <SelectTrigger className="h-11 rounded-2xl border-slate-200"><SelectValue/></SelectTrigger>
                <SelectContent className="max-h-60">{TIME_OPTIONS.map(t=><SelectItem key={t.val} value={t.val}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">رقم واتساب للتواصل *</label>
            <div className="relative">
              <input value={form.whatsapp} onChange={e=>setForm(p=>({...p,whatsapp:e.target.value}))} placeholder="05xxxxxxxx" dir="ltr"
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-[#15317E] focus:ring-1 focus:ring-[#15317E] outline-none text-sm font-medium shadow-sm transition-all"/>
              <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"/>
            </div>
          </div>

          {/* شروط الحجز */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button type="button" onClick={()=>setShowTerms(v=>!v)}
              className="w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-slate-50 transition">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${showTerms?'bg-[#15317E] border-[#15317E]':'border-slate-300'}`}>
                {showTerms&&<Check className="w-3 h-3 text-white" strokeWidth={3}/>}
              </div>
              <span className="font-bold text-sm text-slate-700 flex-1">شروط الحجز (اختياري)</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showTerms?'rotate-180':''}`}/>
            </button>
            {showTerms && (
              <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                <Textarea value={form.booking_terms} onChange={e=>setForm(p=>({...p,booking_terms:e.target.value}))} placeholder="اكتب شروط الحجز..." rows={3}
                  className="rounded-xl border-slate-200 resize-none focus:border-[#15317E] focus:ring-1 focus:ring-[#15317E]"/>
              </div>
            )}
          </div>

          <button onClick={saveVenue} disabled={!form.whatsapp||saving}
            className="w-full mt-4 py-4 bg-[#15317E] text-white rounded-2xl font-bold text-base shadow-lg shadow-[#15317E]/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
            {saving?<><Loader2 className="w-5 h-5 animate-spin"/>جاري الحفظ...</>:<><CheckCircle2 className="w-5 h-5"/>إنهاء الإعداد</>}
          </button>
        </div>
      </div>
      <Style />
    </div>
  );

  // ══════════════════════════════════════════════════
  // PHASE: مبروك!
  // ══════════════════════════════════════════════════
  if (phase === "success") return (
    <div dir="rtl" className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-[#15317E] rounded-full blur-2xl opacity-20 animate-pulse"/>
        <div className="w-28 h-28 bg-[#15317E] rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-white">
          <PartyPopper className="w-12 h-12 text-white"/>
        </div>
      </div>
      <h1 className="text-3xl font-black text-[#15317E] mb-3">مبروك! {roleLabel} جاهز</h1>
      <p className="text-slate-500 text-sm mb-10 max-w-[260px] leading-relaxed">
        تم إعداد صفحة <span className="font-bold text-[#15317E]">{form.name}</span> بنجاح. يمكنك الآن البدء في استقبال الحجوزات.
      </p>
      <div className="w-full space-y-3 max-w-sm">
        <button onClick={() => window.location.href = '/venue'}
          className="w-full py-4 bg-[#15317E] hover:bg-[#0d1e4c] text-white rounded-2xl font-bold text-sm shadow-xl shadow-[#15317E]/30 transition-all flex items-center justify-center gap-2">
          <Rocket className="w-5 h-5"/> انتقل إلى لوحة التحكم
        </button>
        <button onClick={() => { if (navigator.share) { navigator.share({ title: form.name, url: venuePublicUrl }).catch(() => {}); } else { navigator.clipboard.writeText(venuePublicUrl); }}}
          className="w-full py-4 bg-white border border-slate-200 hover:border-[#15317E] hover:text-[#15317E] text-slate-700 rounded-2xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2">
          <Share2 className="w-5 h-5"/> مشاركة الصفحة
        </button>
        <button onClick={() => window.open(venuePublicUrl, '_blank')}
          className="w-full py-4 bg-transparent text-slate-500 hover:text-[#15317E] rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
          <Eye className="w-4 h-4"/> شاهد صفحة {roleLabel}
        </button>
      </div>
      <Style />
    </div>
  );

  return null;
}
