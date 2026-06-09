import React, { useState, useRef, useEffect } from "react";
import { base44, supabase } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Loader2, Upload, Trash2, Check, Sun, Crown,
  Eye, LayoutDashboard, PartyPopper, Sparkles, ArrowRight, ArrowLeft, X
} from "lucide-react";

// ── أيقونات SVG مخصصة ──
const IconHome     = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>;
const IconTent     = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2L2 20h20L12 2z"/><path d="M12 2v18M7 20l5-8 5 8"/></svg>;
const IconTree     = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2L6 10h4l-3 5h5v5h2v-5h5l-3-5h4L12 2z"/></svg>;
const IconCouch    = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 9V7a2 2 0 00-2-2H6a2 2 0 00-2 2v2"/><path d="M2 11a2 2 0 012 2v2h16v-2a2 2 0 012-2 2 2 0 01-2 2H4a2 2 0 01-2-2z"/><path d="M4 15v2M20 15v2"/></svg>;
const IconBuilding = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M3 9h6M3 15h6M15 9h3M15 13h3M15 17h3"/></svg>;
const IconPin      = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>;
const IconPool     = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 12h20M2 16c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2"/><circle cx="7" cy="8" r="2"/><path d="M7 10v2"/></svg>;
const IconWifi     = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></svg>;
const IconGrill    = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 12h16M12 12V6M8 12l-2 6M16 12l2 6M6 6h12a1 1 0 000-2H6a1 1 0 000 2z"/></svg>;
const IconBed      = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 20v-8a2 2 0 012-2h16a2 2 0 012 2v8"/><path d="M2 12V6a2 2 0 012-2h16a2 2 0 012 2v6"/><path d="M2 18h20M7 12v-2h10v2"/></svg>;
const IconSnow     = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 7l-5-5-5 5M17 17l-5 5-5-5M2 12l5-5 5 5-5 5-5-5zM22 12l-5-5-5 5 5 5 5-5z"/></svg>;
const IconFire     = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2c0 6-6 8-6 14a6 6 0 0012 0c0-4-2-7-3-9-1 2-1 4-3 5 1-3 0-7 0-10z"/></svg>;
const IconKids     = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="5" r="2"/><path d="M12 7v5l-3 3M12 12l3 3M8 21l2-5M16 21l-2-5"/></svg>;
const IconGarden   = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22V12M12 12C12 7 7 4 3 6c3 0 6 2 9 6M12 12c0-5 5-8 9-6-3 0-6 2-9 6"/></svg>;
const IconCar      = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 17H3v-5l2-5h14l2 5v5h-2M5 17h14M7 17v2M17 17v2"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/></svg>;
const IconPower    = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18.36 6.64a9 9 0 11-12.73 0M12 2v8"/></svg>;
const IconKey      = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6M15.5 7.5l3 3"/></svg>;
const IconMen      = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="5" r="3"/><path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>;
const IconWomen    = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="7" r="4"/><path d="M12 11v10M9 18h6"/></svg>;
const IconKitchen  = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 9h20M7 3v6M12 3v6M17 3v6"/></svg>;
const IconStar     = (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const IconGoogle   = (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;

const TikTokIcon   = (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.41-.02-.34-.02-.68-.02-1.02.13-1.6.82-3.08 1.94-4.21 1.52-1.52 3.8-2.26 5.86-1.92V14.3c-1.11-.27-2.31-.1-3.29.41-.85.45-1.46 1.25-1.63 2.21-.07.39-.07.79-.02 1.18.17 1.25 1.05 2.34 2.19 2.81 1.29.54 2.8.46 4.02-.2 1.19-.65 1.95-1.9 2.05-3.26.2-2.9.06-5.82.09-8.73z"/></svg>;
const XIcon        = (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>;
const SnapchatIcon = (p) => <svg viewBox="0 0 448 512" fill="currentColor" {...p}><path d="M424.2 263.8c-2.4-10.6-20.2-13.1-34.4-11-20.2 2.9-46.7 9-61.1 5.9-9.1-2-12.7-10.1-10.6-20.9 2-10.2 10.1-26.6 15.8-37.5 44-84.3 13.3-145-38.3-177.3C268.4 6 226.5-.4 191 1.7c-47.5 2.8-82 17.5-104.9 51.5-17.7 26.2-22.1 63.3-10.1 94.6 7.6 19.8 23 48.2 24.3 64.9 1.1 13.7-8.1 20.3-19.1 23-14.7 3.6-43.2-3.1-61.9-5.5-13.7-1.7-27.1 2-30.7 13.1-4 12.3 8.9 25 15.5 29.8 17.3 12.5 40 24.1 64.1 36.8 6.5 3.5 12.1 12 11.2 21.6-1 10.5-6.8 19.3-15.1 24.8-14.6 9.8-33.1 15.1-49.8 18.2-15.6 2.9-32.9 2.5-44.5 11.2C-5.5 391-2.9 405.3 6 414.2c16 16.1 41 18.9 62.1 22.1 19.1 2.9 38.6 3.6 57 8.3 16 4.1 30.6 11 41.5 23.3 7 7.9 13.9 17.8 24.4 23.4 12 6.5 26.7 8.7 39.5 8.7 12.5 0 25.5-2 37.2-7.8 10.7-5.3 17.8-15.5 24.9-23.7 11-12.7 25.9-19.8 42-23.9 18.6-4.8 38.3-5.3 57.6-8.2 21.2-3.2 46.5-6.1 62.6-22.4 8.7-8.8 11.5-23.4 5.2-32.2z"/></svg>;
const InstagramIcon = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>;

const ALL_FEATURES = [
  { id:'مسبح',         Icon: IconPool },
  { id:'جلسات خارجية', Icon: IconGarden },
  { id:'واي فاي',      Icon: IconWifi },
  { id:'مطبخ',         Icon: IconKitchen },
  { id:'دخول ذاتي',    Icon: IconKey },
  { id:'ألعاب أطفال',  Icon: IconKids },
  { id:'شواء',         Icon: IconGrill },
  { id:'قسم رجال',     Icon: IconMen },
  { id:'قسم نساء',     Icon: IconWomen },
  { id:'غرف نوم',      Icon: IconBed },
  { id:'حديقة',        Icon: IconGarden },
  { id:'مولد كهرباء',  Icon: IconPower },
  { id:'مكيف',         Icon: IconSnow },
  { id:'مدفأة',        Icon: IconFire },
  { id:'ملعب',         Icon: IconKids },
  { id:'موقف سيارات',  Icon: IconCar },
  { id:'جاكوزي',       Icon: IconPool },
  { id:'ملعب تنس',     Icon: IconStar },
  { id:'صالة ألعاب',   Icon: IconStar },
  { id:'غرفة سينما',   Icon: IconStar },
];

const VENUE_TYPES = [
  { id:'شاليه',   Icon: IconHome,     color:'text-slate-700' },
  { id:'مخيم',    Icon: IconTent,     color:'text-slate-700' },
  { id:'مزرعة',   Icon: IconTree,     color:'text-slate-700' },
  { id:'استراحة', Icon: IconCouch,    color:'text-slate-700' },
];

const THEME_COLORS = ['#15317E','#c9a96e','#0f3d36','#7c2d3a','#5b3a70','#1d7874','#2f3640','#b56576'];

// ألوان الأزرار والشريط
const BTN = 'bg-[#2d2d2d] hover:bg-[#1a1a1a] text-white';
const PROGRESS_COLOR = '#2d2d2d';

// حفظ الحالة في sessionStorage
const STORAGE_KEY = 'complete_profile_state';
const saveState = (state) => { try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(_){} };
const loadState = () => { try { const s = sessionStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : null; } catch(_){ return null; } };
const clearState = () => { try { sessionStorage.removeItem(STORAGE_KEY); } catch(_){} };

export default function CompleteProfile() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const logoRef = useRef();
  const imgRef = useRef();

  const saved = loadState();

  const [mainRole, setMainRole] = useState(saved?.mainRole || ''); // 'venue' | 'broker'
  const [role, setRole] = useState(saved?.role || '');
  const [step, setStep] = useState(saved?.step || 0);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingImgs, setUploadingImgs] = useState(false);
  const [success, setSuccess] = useState(null);

  // فورم الوسيط
  const [broker, setBroker] = useState(saved?.broker || { office_name:'', city:'', office_logo_url:'', phone:'', license_number:'' });

  // فورم الشاليه
  const [venue, setVenue] = useState(saved?.venue || {
    name:'', city:'', description:'', images:[], youtube_urls:[''],
    features:[], social:{ instagram:'', snapchat:'', tiktok:'', x:'' },
    page_theme:'classic', theme_color:'#c9a96e',
    price_weekday:'', price_weekend:'', whatsapp:'',
    check_in_time:'14:00', check_out_time:'12:00',
    booking_terms:'', slug:'', maps_url:'',
    google_reviews: [],
  });

  // تقييمات Google
  const [reviewsQuery, setReviewsQuery] = useState('');
  const [fetchingReviews, setFetchingReviews] = useState(false);
  const [reviewsLeft, setReviewsLeft] = useState(() => {
    try { return parseInt(sessionStorage.getItem('reviews_left') ?? '3'); } catch(_){ return 3; }
  });
  const [reviewsFetched, setReviewsFetched] = useState(false);

  // حفظ الحالة عند كل تغيير
  useEffect(() => {
    if (success) return;
    saveState({ mainRole, role, step, broker, venue });
  }, [mainRole, role, step, broker, venue]);

  const isVenue = mainRole === 'venue';
  const venueSteps = 9; // أضفنا خطوة التقييمات
  const brokerSteps = 4;
  const totalSteps = isVenue ? venueSteps : brokerSteps;
  const progress = step === 0 ? 0 : (step / totalSteps) * 100;

  const setV = (k, v) => setVenue(prev => ({ ...prev, [k]: v }));
  const toggleFeature = (f) => setV('features', venue.features.includes(f) ? venue.features.filter(x=>x!==f) : [...venue.features, f]);

  const uploadLogo = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingLogo(true);
    try { const { file_url } = await base44.integrations.Core.UploadFile({ file }); setBroker(p=>({...p, office_logo_url: file_url})); } catch(_){}
    setUploadingLogo(false);
  };

  const uploadImgs = async (e) => {
    const files = Array.from(e.target.files); if (!files.length) return;
    setUploadingImgs(true);
    const urls = [...venue.images];
    for (const file of files.slice(0, 10 - urls.length)) {
      try { const { file_url } = await base44.integrations.Core.UploadFile({ file }); urls.push(file_url); } catch(_){}
    }
    setV('images', urls);
    setUploadingImgs(false);
  };

  const fetchGoogleReviews = async () => {
    if (reviewsLeft <= 0 || !reviewsQuery.trim()) return;
    setFetchingReviews(true);
    try {
      const res = await fetch(`/api/getNearbyPlaces?query=${encodeURIComponent(reviewsQuery)}&type=reviews`);
      const data = await res.json();
      const positive = (data?.reviews || [])
        .filter(r => r.rating >= 4)
        .slice(0, 4)
        .map(r => ({ author: r.author_name, text: r.text, rating: r.rating }));
      setV('google_reviews', positive);
      const newLeft = reviewsLeft - 1;
      setReviewsLeft(newLeft);
      sessionStorage.setItem('reviews_left', String(newLeft));
      setReviewsFetched(true);
    } catch(_) {}
    setFetchingReviews(false);
  };

  const saveBroker = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ ...broker, business_type: role });
      await refreshUser();
      clearState();
      setSuccess({ type:'broker' });
    } catch(e) { alert('خطأ: ' + e.message); }
    setSaving(false);
  };

  const saveVenue = async () => {
    setSaving(true);
    try {
      const { data:{ user } } = await supabase.auth.getUser();
      const cleanSocial = {};
      Object.entries(venue.social||{}).forEach(([k,v]) => { if(v?.trim()) cleanSocial[k]=v.trim(); });
      const slug = venue.slug || `venue-${Date.now()}`;
      const created = await base44.entities.Venue.create({
        ...venue, slug, venue_type: role,
        price_weekday: venue.price_weekday ? Number(venue.price_weekday) : undefined,
        price_weekend: venue.price_weekend ? Number(venue.price_weekend) : undefined,
        youtube_urls: venue.youtube_urls.filter(u=>u.trim()),
        social: cleanSocial, owner_id: user?.id, status:'نشط',
      });
      await base44.auth.updateMe({ business_type: role, office_name: venue.name, phone: venue.whatsapp });
      await refreshUser();
      clearState();
      const finalSlug = created?.slug || slug;
      setSuccess({ type:'venue', url:`${window.location.origin}/place/${finalSlug}`, theme: venue.page_theme });
    } catch(e) { alert('خطأ: ' + e.message); }
    setSaving(false);
  };

  const next = () => setStep(s => Math.min(s+1, totalSteps));
  const prev = () => { if (step > 1) setStep(s=>s-1); else { setStep(0); } };

  // ══════════ شاشة النجاح ══════════
  if (success) {
    const isRoyal = success.theme === 'royal';
    return (
      <div dir="rtl" className={`min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden ${isRoyal ? 'bg-[#0a0e1a]' : 'bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d]'}`}>
        <style dangerouslySetInnerHTML={{__html:`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700;800&display=swap'); *{font-family:'IBM Plex Sans Arabic',sans-serif;} @keyframes pop{0%{transform:scale(0)}60%{transform:scale(1.15)}100%{transform:scale(1)}} @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}} />
        <div className="absolute top-10 right-10 w-40 h-40 rounded-full blur-3xl opacity-10 bg-white"/>
        <div className="absolute bottom-10 left-10 w-52 h-52 rounded-full blur-3xl opacity-5 bg-white"/>
        <div className="relative z-10 max-w-sm w-full">
          <div className="mb-8" style={{animation:'pop 0.6s cubic-bezier(0.16,1,0.3,1)'}}>
            <div className="w-28 h-28 rounded-full mx-auto flex items-center justify-center shadow-2xl bg-white">
              <PartyPopper className="w-14 h-14 text-[#2d2d2d]"/>
            </div>
          </div>
          <div style={{animation:'fadeUp 0.6s ease-out 0.2s both'}}>
            <h1 className="text-3xl font-black mb-3 text-white">🎉 مبروك!</h1>
            <p className="text-white/70 text-base mb-2">تم إنشاء حسابك بنجاح</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-8 bg-white/10 text-white border border-white/20">
              <Sparkles className="w-4 h-4"/> معك تجربة مجانية ١٤ يوم
            </div>
          </div>
          <div className="space-y-3" style={{animation:'fadeUp 0.6s ease-out 0.4s both'}}>
            {success.url && (
              <button onClick={()=>window.open(success.url,'_blank')}
                className="w-full py-4 rounded-2xl font-bold text-base shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 bg-white text-[#1a1a1a] hover:bg-slate-100">
                <Eye className="w-5 h-5"/> عرض صفحتي
              </button>
            )}
            <button onClick={()=>{ success.type==='broker' ? navigate('/') : navigate('/venue'); }}
              className="w-full py-4 rounded-2xl font-bold text-base border transition-all flex items-center justify-center gap-2 active:scale-95 bg-white/10 text-white border-white/20 hover:bg-white/20">
              <LayoutDashboard className="w-5 h-5"/> الدخول إلى لوحة التحكم
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f4f7fb] flex flex-col items-center py-8 px-4"
      style={{backgroundImage:'radial-gradient(at 0% 0%, hsla(225,39%,30%,0.05) 0px, transparent 50%), radial-gradient(at 100% 0%, hsla(40,45%,61%,0.05) 0px, transparent 50%)', backgroundAttachment:'fixed'}}>
      <style dangerouslySetInnerHTML={{__html:`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap'); body{font-family:'IBM Plex Sans Arabic',sans-serif;} .feature-bubble.selected{background:#2d2d2d;color:white;transform:scale(1.03);} .city-chip.active{background:#2d2d2d;color:white;border-color:#2d2d2d;} .choice-card:hover{transform:translateY(-3px);} .choice-card:active{transform:scale(0.98);}`}} />
      <div className="w-full max-w-xl mx-auto">

        {/* شريط التقدم */}
        <div className="mb-6 px-2 flex justify-between items-center">
          <button onClick={prev} className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all ${step===0?'opacity-0 pointer-events-none':''}`}>
            <ArrowRight className="w-4 h-4"/>
          </button>
          <div className="flex-1 px-6">
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full transition-all duration-500 rounded-full" style={{width:`${progress}%`, backgroundColor: PROGRESS_COLOR}}/>
            </div>
            {step>0 && <p className="text-center text-[11px] text-slate-400 font-bold mt-1.5">{step} من {totalSteps}</p>}
          </div>
          <div className="w-10"/>
        </div>

        <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] p-6 md:p-10 min-h-[480px] flex flex-col">
          <div className="flex-1">

            {/* ══ خطوة 0: اختيار الدور الرئيسي ══ */}
            {step === 0 && (
              <div>
                <div className="text-center mb-8 mt-2">
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold mb-3">مرحباً بك!</span>
                  <h2 className="text-2xl font-bold text-slate-800">وش نوع نشاطك؟</h2>
                  <p className="text-slate-400 mt-2 text-sm">اختر المناسب لك</p>
                </div>
                <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
                  <button onClick={()=>{ setMainRole('venue'); setStep(0.5); }}
                    className="choice-card bg-white border-2 border-slate-100 rounded-2xl p-6 flex items-center gap-4 transition-all text-right">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <IconHome className="w-7 h-7 text-slate-700"/>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-base">مالك شاليه</p>
                      <p className="text-slate-400 text-xs mt-1">يشمل: شاليه، مخيم، مزرعة، استراحة</p>
                    </div>
                  </button>
                  <button onClick={()=>{ setMainRole('broker'); setRole('وسيط'); setStep(1); }}
                    className="choice-card bg-white border-2 border-slate-100 rounded-2xl p-6 flex items-center gap-4 transition-all text-right">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <IconBuilding className="w-7 h-7 text-slate-700"/>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-base">وسيط عقاري</p>
                      <p className="text-slate-400 text-xs mt-1">عرض وإدارة العقارات للبيع والإيجار</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* ══ خطوة 0.5: اختيار نوع الشاليه ══ */}
            {step === 0.5 && (
              <div>
                <div className="text-center mb-8 mt-2">
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold mb-3">اختر النوع</span>
                  <h2 className="text-2xl font-bold text-slate-800">وش نوع المكان؟</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {VENUE_TYPES.map(t=>(
                    <button key={t.id} onClick={()=>{ setRole(t.id); setStep(1); }}
                      className="choice-card bg-white border-2 border-slate-100 rounded-2xl p-6 flex flex-col items-center gap-3 transition-all">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                        <t.Icon className="w-7 h-7 text-slate-700"/>
                      </div>
                      <span className="font-bold text-slate-700">{t.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ══════ خطوات الوسيط ══════ */}
            {!isVenue && role && step===1 && (
              <div>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold mb-4">الخطوة ١</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">اسم مكتبك؟</h2>
                <p className="text-slate-400 text-sm mb-8">الاسم اللي يظهر للعملاء</p>
                <input value={broker.office_name} onChange={e=>setBroker(p=>({...p,office_name:e.target.value}))}
                  placeholder="مثال: مكتب النخبة العقاري"
                  className="w-full border-b-2 border-slate-200 focus:border-slate-700 outline-none py-3 text-xl font-bold text-slate-800 bg-transparent transition-all placeholder:text-slate-300"/>
              </div>
            )}
            {!isVenue && role && step===2 && (
              <div>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold mb-4">الخطوة ٢</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">في أي مدينة؟</h2>
                <div className="relative mt-8">
                  <IconPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
                  <input value={broker.city} onChange={e=>setBroker(p=>({...p,city:e.target.value}))} placeholder="اكتب اسم المدينة"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 pr-12 text-base font-medium outline-none focus:border-slate-700 transition-all"/>
                </div>
              </div>
            )}
            {!isVenue && role && step===3 && (
              <div>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold mb-4">الخطوة ٣</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">شعار المكتب</h2>
                <p className="text-slate-400 text-sm mb-8">اختياري</p>
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={uploadLogo}/>
                {broker.office_logo_url ? (
                  <div className="relative w-32 h-32 mx-auto">
                    <img src={broker.office_logo_url} alt="" className="w-full h-full object-cover rounded-2xl border border-slate-100"/>
                    <button onClick={()=>setBroker(p=>({...p,office_logo_url:''}))} className="absolute -top-2 -left-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center"><X className="w-3.5 h-3.5"/></button>
                  </div>
                ) : (
                  <button onClick={()=>logoRef.current?.click()} className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center gap-3 hover:border-slate-400 hover:bg-slate-50 transition-all">
                    {uploadingLogo ? <Loader2 className="w-8 h-8 text-slate-400 animate-spin"/> : <><Upload className="w-8 h-8 text-slate-300"/><span className="text-slate-400 font-bold text-sm">اضغط لرفع الشعار</span></>}
                  </button>
                )}
              </div>
            )}
            {!isVenue && role && step===4 && (
              <div>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold mb-4">الخطوة ٤</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">بيانات التواصل</h2>
                <p className="text-slate-400 text-sm mb-8">اختياري — تقدر تكملها لاحقاً</p>
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-slate-400 transition-all">
                    <label className="block text-xs font-bold text-slate-400 mb-1">رقم واتساب</label>
                    <input value={broker.phone} onChange={e=>setBroker(p=>({...p,phone:e.target.value}))} placeholder="9665xxxxxxxx" dir="ltr"
                      className="w-full bg-transparent border-none outline-none font-bold text-lg text-slate-800"/>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-slate-400 transition-all">
                    <label className="block text-xs font-bold text-slate-400 mb-1">رقم الرخصة <span className="font-normal">(اختياري)</span></label>
                    <input value={broker.license_number} onChange={e=>setBroker(p=>({...p,license_number:e.target.value}))} placeholder="1234567890" dir="ltr"
                      className="w-full bg-transparent border-none outline-none font-bold text-lg text-slate-800"/>
                  </div>
                </div>
              </div>
            )}

            {/* ══════ خطوات الشاليه ══════ */}
            {isVenue && step===1 && (
              <div>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold mb-4">الخطوة ١</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">اسم {role}ك *</h2>
                <p className="text-slate-400 text-sm mb-8">الاسم اللي يظهر للعملاء</p>
                <input value={venue.name} onChange={e=>setV('name',e.target.value)} placeholder={`مثال: ${role} الواحة`}
                  className="w-full border-b-2 border-slate-200 focus:border-slate-700 outline-none py-3 text-xl font-bold text-slate-800 bg-transparent transition-all placeholder:text-slate-300"/>
                {!venue.name.trim() && <p className="text-xs text-red-400 font-bold mt-2">مطلوب — لا يمكن المتابعة بدونه</p>}
              </div>
            )}
            {isVenue && step===2 && (
              <div>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold mb-4">الخطوة ٢</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">في أي مدينة؟</h2>
                <div className="relative mt-8">
                  <IconPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
                  <input value={venue.city} onChange={e=>setV('city',e.target.value)} placeholder="اكتب اسم المدينة"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 pr-12 text-base font-medium outline-none focus:border-slate-700 transition-all"/>
                </div>
              </div>
            )}
            {isVenue && step===3 && (
              <div>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold mb-4">الخطوة ٣</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">وصف {role}ك</h2>
                <p className="text-slate-400 text-sm mb-2">يمكن إعداده لاحقاً — اختياري</p>
                <textarea value={venue.description} onChange={e=>setV('description',e.target.value)} rows={5}
                  placeholder="اكتب وصفاً جميلاً عن المكان والأجواء..."
                  className="w-full border-b-2 border-slate-200 focus:border-slate-700 outline-none py-3 text-base font-medium text-slate-700 bg-transparent transition-all placeholder:text-slate-300 resize-none"/>
              </div>
            )}
            {isVenue && step===4 && (
              <div>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold mb-3">الخطوة ٤</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">صور {role}ك</h2>
                <p className="text-slate-400 text-sm mb-3">حتى ١٠ صور</p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-5 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-amber-600 flex-shrink-0"/>
                  <p className="text-[12px] text-amber-700 font-bold">أول صورة ستكون الغلاف العلوي للصفحة</p>
                </div>
                <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={uploadImgs}/>
                <div className="grid grid-cols-3 gap-3">
                  {venue.images.map((img,i)=>(
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover"/>
                      {i===0 && <span className="absolute top-1.5 right-1.5 bg-[#2d2d2d] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">الغلاف</span>}
                      <button onClick={()=>setV('images',venue.images.filter((_,j)=>j!==i))} className="absolute top-1.5 left-1.5 w-6 h-6 bg-red-500 text-white rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex"><Trash2 className="w-3 h-3"/></button>
                    </div>
                  ))}
                  {venue.images.length<10 && (
                    <button onClick={()=>imgRef.current?.click()} className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 hover:border-slate-400 hover:bg-slate-50 transition-all">
                      {uploadingImgs?<Loader2 className="w-6 h-6 text-slate-400 animate-spin"/>:<><Upload className="w-6 h-6 text-slate-300"/><span className="text-[10px] text-slate-400 font-bold">إضافة</span></>}
                    </button>
                  )}
                </div>
              </div>
            )}
            {isVenue && step===5 && (
              <div>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold mb-4">الخطوة ٥</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">فيديو يوتيوب</h2>
                <p className="text-slate-400 text-sm mb-8">جولة مصورة — حتى ٥ روابط — اختياري</p>
                <div className="space-y-3">
                  {venue.youtube_urls.map((url,i)=>(
                    <div key={i} className="flex gap-2">
                      <input value={url} onChange={e=>{ const a=[...venue.youtube_urls]; a[i]=e.target.value; setV('youtube_urls',a); }}
                        placeholder="https://youtube.com/..." dir="ltr"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-700 transition-all"/>
                      {venue.youtube_urls.length>1 && <button onClick={()=>setV('youtube_urls',venue.youtube_urls.filter((_,j)=>j!==i))} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center"><Trash2 className="w-4 h-4"/></button>}
                    </div>
                  ))}
                  {venue.youtube_urls.length<5 && (
                    <button onClick={()=>setV('youtube_urls',[...venue.youtube_urls,''])} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-bold hover:border-slate-400 transition-all">+ إضافة رابط</button>
                  )}
                </div>
              </div>
            )}
            {isVenue && step===6 && (
              <div>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold mb-4">الخطوة ٦</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">ثيم الصفحة</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button onClick={()=>{ setV('page_theme','classic'); setTimeout(next,280); }}
                    className={`choice-card p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${venue.page_theme==='classic'?'border-slate-700 bg-slate-50':'border-slate-100'}`}>
                    <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center"><Sun className="w-6 h-6 text-white"/></div>
                    <span className="font-bold text-sm text-slate-700">كلاسيكي فاتح</span>
                  </button>
                  <button onClick={()=>{ setV('page_theme','royal'); setTimeout(next,280); }}
                    className={`choice-card p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${venue.page_theme==='royal'?'border-[#d4af37] bg-[#d4af37]/5':'border-slate-100'}`}>
                    <div className="w-12 h-12 rounded-xl bg-[#0a0e1a] flex items-center justify-center"><Crown className="w-6 h-6 text-[#d4af37]"/></div>
                    <span className="font-bold text-sm text-slate-700">أسود ملكي</span>
                  </button>
                </div>
                {venue.page_theme==='classic' && (
                  <div>
                    <p className="text-sm font-bold text-slate-500 mb-3 text-center">لون الثيم</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {THEME_COLORS.map(c=>(
                        <button key={c} onClick={()=>setV('theme_color',c)}
                          style={{backgroundColor:c, outline: venue.theme_color===c ? `3px solid ${c}`:'none', outlineOffset:'3px'}}
                          className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"/>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {isVenue && step===7 && (
              <div>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold mb-4">الخطوة ٧</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">الأسعار والتواصل</h2>
                <p className="text-slate-400 text-sm mb-6">تقدر تعدلها لاحقاً</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-slate-400 transition-all">
                      <label className="block text-xs font-bold text-slate-400 mb-1">وسط الأسبوع (ر.س)</label>
                      <input type="number" value={venue.price_weekday} onChange={e=>setV('price_weekday',e.target.value)} placeholder="800"
                        className="w-full bg-transparent border-none outline-none font-bold text-xl text-slate-800"/>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-slate-400 transition-all">
                      <label className="block text-xs font-bold text-slate-400 mb-1">نهاية الأسبوع (ر.س)</label>
                      <input type="number" value={venue.price_weekend} onChange={e=>setV('price_weekend',e.target.value)} placeholder="1200"
                        className="w-full bg-transparent border-none outline-none font-bold text-xl text-slate-800"/>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-slate-400 transition-all">
                    <label className="block text-xs font-bold text-slate-400 mb-1">رقم واتساب *</label>
                    <input value={venue.whatsapp} onChange={e=>setV('whatsapp',e.target.value)} placeholder="9665xxxxxxxx" dir="ltr"
                      className="w-full bg-transparent border-none outline-none font-bold text-lg text-slate-800"/>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-slate-400 transition-all">
                      <label className="block text-xs font-bold text-slate-400 mb-1">وقت الدخول</label>
                      <input type="time" value={venue.check_in_time} onChange={e=>setV('check_in_time',e.target.value)}
                        className="w-full bg-transparent border-none outline-none font-bold text-base text-slate-700"/>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-slate-400 transition-all">
                      <label className="block text-xs font-bold text-slate-400 mb-1">وقت الخروج</label>
                      <input type="time" value={venue.check_out_time} onChange={e=>setV('check_out_time',e.target.value)}
                        className="w-full bg-transparent border-none outline-none font-bold text-base text-slate-700"/>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-slate-400 transition-all flex items-center gap-3">
                    <IconPin className="w-5 h-5 text-slate-400 flex-shrink-0"/>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-400 mb-1">رابط Google Maps — اختياري</label>
                      <input value={venue.maps_url} onChange={e=>setV('maps_url',e.target.value)} placeholder="https://maps.google.com/..." dir="ltr"
                        className="w-full bg-transparent border-none outline-none text-sm text-slate-700"/>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isVenue && step===8 && (
              <div>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold mb-4">الخطوة ٨</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">مميزات {role}ك</h2>
                <p className="text-slate-400 text-sm mb-6">اختر ما يتوفر عندك</p>
                <div className="flex flex-wrap gap-2.5">
                  {ALL_FEATURES.map(f=>(
                    <button key={f.id} onClick={()=>toggleFeature(f.id)}
                      className={`feature-bubble flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-bold transition-all ${venue.features.includes(f.id)?'selected border-transparent':'bg-white text-slate-600 border-slate-200'}`}>
                      <f.Icon className="w-4 h-4 flex-shrink-0"/>
                      {f.id}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {isVenue && step===9 && (
              <div>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold mb-4">الخطوة ٩</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">تقييمات عملائك من Google</h2>
                <p className="text-slate-400 text-sm mb-2 leading-relaxed">أدخل اسم مكانك بالضبط كما يظهر في Google Maps ليتم جلب أفضل التقييمات الإيجابية وعرضها في صفحتك تلقائياً بالذكاء الاصطناعي</p>
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 mb-5 border border-slate-100">
                  <div className={`w-2 h-2 rounded-full ${reviewsLeft > 1 ? 'bg-emerald-400' : reviewsLeft === 1 ? 'bg-amber-400' : 'bg-red-400'}`}/>
                  <span className="text-xs font-bold text-slate-500">متبقي {reviewsLeft} {reviewsLeft===1?'محاولة':'محاولات'}</span>
                </div>
                {reviewsLeft > 0 ? (
                  <>
                    <div className="flex gap-2 mb-4">
                      <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3 focus-within:border-slate-700 transition-all">
                        <IconGoogle className="w-5 h-5 flex-shrink-0"/>
                        <input value={reviewsQuery} onChange={e=>setReviewsQuery(e.target.value)}
                          placeholder={`مثال: ${venue.name || role + ' الواحة'} الرياض`}
                          className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-700"/>
                      </div>
                      <button onClick={fetchGoogleReviews} disabled={fetchingReviews || !reviewsQuery.trim()}
                        className={`px-4 py-3 rounded-2xl font-bold text-sm ${BTN} disabled:opacity-40 flex items-center gap-2 transition-all`}>
                        {fetchingReviews?<Loader2 className="w-4 h-4 animate-spin"/>:<Sparkles className="w-4 h-4"/>}
                        جلب
                      </button>
                    </div>
                    {reviewsLeft === 1 && !reviewsFetched && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4">
                        <p className="text-amber-700 text-xs font-bold">⚠️ هذه آخر محاولة متبقية</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                    <p className="text-red-600 text-sm font-bold">انتهت المحاولات المتاحة</p>
                  </div>
                )}
                {venue.google_reviews?.length > 0 && (
                  <div className="space-y-3 mt-4">
                    <p className="text-xs font-bold text-emerald-600">✓ تم جلب {venue.google_reviews.length} تقييمات إيجابية</p>
                    {venue.google_reviews.map((r,i)=>(
                      <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-sm text-slate-700">{r.author}</span>
                          <div className="flex gap-0.5">{Array(r.rating).fill(0).map((_,j)=><IconStar key={j} className="w-3 h-3 text-amber-400"/>)}</div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{r.text?.slice(0,150)}{r.text?.length>150?'...':''}</p>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-4">يمكنك تخطي هذه الخطوة</p>
              </div>
            )}

          </div>

          {/* أزرار التنقل */}
          {step > 0 && step !== 0.5 && (
            <div className="mt-8 pt-4 flex justify-end items-center">
              {isVenue && step===venueSteps ? (
                <button onClick={saveVenue} disabled={saving}
                  className={`px-8 py-3.5 rounded-full font-bold ${BTN} shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-60`}>
                  {saving?<><Loader2 className="w-4 h-4 animate-spin"/>جاري الحفظ...</>:<>احفظ وانشر <Check className="w-4 h-4"/></>}
                </button>
              ) : !isVenue && step===brokerSteps ? (
                <button onClick={saveBroker} disabled={saving || !broker.office_name.trim()}
                  className={`px-8 py-3.5 rounded-full font-bold ${BTN} shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-60`}>
                  {saving?<><Loader2 className="w-4 h-4 animate-spin"/>جاري الحفظ...</>:<>ابدأ <Check className="w-4 h-4"/></>}
                </button>
              ) : step !== 6 ? (
                <button onClick={next}
                  disabled={isVenue && step===1 && !venue.name.trim()}
                  className={`px-8 py-3.5 rounded-full font-bold ${BTN} shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed`}>
                  متابعة <ArrowLeft className="w-4 h-4"/>
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
