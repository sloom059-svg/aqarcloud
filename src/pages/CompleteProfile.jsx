import React, { useState, useRef } from "react";
import { base44, supabase } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Loader2, Building2, Hotel, Tent, Leaf, Trees, Home,
  Upload, Trash2, Check, Sun, Crown, Eye, LayoutDashboard,
  Instagram, PartyPopper, Sparkles, Phone, MapPin, ArrowRight, ArrowLeft, X
} from "lucide-react";

const CITIES = ["الرياض","جدة","مكة المكرمة","المدينة المنورة","الدمام","الخبر","الطائف","تبوك","بريدة","حائل","أبها","خميس مشيط","جازان","نجران","ينبع","الجبيل","الأحساء","القطيف","الرس","عنيزة","الزلفي","المجمعة","شقراء","الدوادمي","سكاكا","القريات","عرعر","بيشة","الباحة","رابغ","القنفذة"];
const ALL_FEATURES = ["مسبح","جلسات خارجية","واي فاي","ملعب","مطبخ","دخول ذاتي","ألعاب أطفال","شواء","قسم رجال","قسم نساء","غرف نوم","حديقة","مولد كهرباء","مكيف","مدفأة"];
const VENUE_TYPES = ['شاليه','مخيم','مزرعة','استراحة'];
const ROLES = [
  { id:'وسيط', label:'وسيط عقاري', Icon:Building2, color:'bg-blue-50 text-blue-600', desc:'عرض وإدارة العقارات' },
  { id:'شاليه', label:'مالك شاليه', Icon:Hotel, color:'bg-amber-50 text-amber-600', desc:'إدارة الشاليه والحجوزات' },
  { id:'مخيم', label:'مالك مخيم', Icon:Tent, color:'bg-green-50 text-green-600', desc:'إدارة المخيم والحجوزات' },
  { id:'مزرعة', label:'مالك مزرعة', Icon:Leaf, color:'bg-emerald-50 text-emerald-600', desc:'إدارة المزرعة وخدماتها' },
  { id:'استراحة', label:'مالك استراحة', Icon:Trees, color:'bg-purple-50 text-purple-600', desc:'إدارة الاستراحة والحجوزات' },
];
const THEME_COLORS = ['#15317E','#c9a96e','#0f3d36','#7c2d3a','#5b3a70','#1d7874','#2f3640','#b56576'];
const TikTokIcon = (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.41-.02-.34-.02-.68-.02-1.02.13-1.6.82-3.08 1.94-4.21 1.52-1.52 3.8-2.26 5.86-1.92V14.3c-1.11-.27-2.31-.1-3.29.41-.85.45-1.46 1.25-1.63 2.21-.07.39-.07.79-.02 1.18.17 1.25 1.05 2.34 2.19 2.81 1.29.54 2.8.46 4.02-.2 1.19-.65 1.95-1.9 2.05-3.26.2-2.9.06-5.82.09-8.73z"/></svg>;
const XIcon = (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>;
const SnapchatIcon = (p) => <svg viewBox="0 0 448 512" fill="currentColor" {...p}><path d="M424.2 263.8c-2.4-10.6-20.2-13.1-34.4-11-20.2 2.9-46.7 9-61.1 5.9-9.1-2-12.7-10.1-10.6-20.9 2-10.2 10.1-26.6 15.8-37.5 44-84.3 13.3-145-38.3-177.3C268.4 6 226.5-.4 191 1.7c-47.5 2.8-82 17.5-104.9 51.5-17.7 26.2-22.1 63.3-10.1 94.6 7.6 19.8 23 48.2 24.3 64.9 1.1 13.7-8.1 20.3-19.1 23-14.7 3.6-43.2-3.1-61.9-5.5-13.7-1.7-27.1 2-30.7 13.1-4 12.3 8.9 25 15.5 29.8 17.3 12.5 40 24.1 64.1 36.8 6.5 3.5 12.1 12 11.2 21.6-1 10.5-6.8 19.3-15.1 24.8-14.6 9.8-33.1 15.1-49.8 18.2-15.6 2.9-32.9 2.5-44.5 11.2C-5.5 391-2.9 405.3 6 414.2c16 16.1 41 18.9 62.1 22.1 19.1 2.9 38.6 3.6 57 8.3 16 4.1 30.6 11 41.5 23.3 7 7.9 13.9 17.8 24.4 23.4 12 6.5 26.7 8.7 39.5 8.7 12.5 0 25.5-2 37.2-7.8 10.7-5.3 17.8-15.5 24.9-23.7 11-12.7 25.9-19.8 42-23.9 18.6-4.8 38.3-5.3 57.6-8.2 21.2-3.2 46.5-6.1 62.6-22.4 8.7-8.8 11.5-23.4 5.2-32.2z"/></svg>;

export default function CompleteProfile() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const logoRef = useRef();
  const imgRef = useRef();

  const [role, setRole] = useState('');
  const [step, setStep] = useState(0); // 0=اختيار الدور، ثم خطوات الفورم
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingImgs, setUploadingImgs] = useState(false);
  const [success, setSuccess] = useState(null); // { url, type }

  // فورم الوسيط
  const [broker, setBroker] = useState({ office_name:'', city:'', office_logo_url:'', phone:'', license_number:'' });

  // فورم الشاليه
  const [venue, setVenue] = useState({
    name:'', city:'', description:'', images:[], youtube_urls:[''],
    features:[], custom_features:[], social:{ instagram:'', snapchat:'', tiktok:'', x:'' },
    page_theme:'classic', theme_color:'#c9a96e',
    price_weekday:'', price_weekend:'', whatsapp:'',
    check_in_time:'14:00', check_out_time:'12:00',
    booking_terms:'', slug:'', maps_url:'',
  });

  const isVenue = VENUE_TYPES.includes(role);
  // خطوات الوسيط: 1=اسم، 2=مدينة، 3=شعار، 4=ترخيص+واتس
  // خطوات الشاليه: 1=اسم+مدينة، 2=وصف، 3=صور، 4=فيديو، 5=ثيم+لون، 6=سعر+واتس، 7=مميزات، 8=تواصل اجتماعي
  const brokerSteps = 4;
  const venueSteps = 8;
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

  const saveBroker = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ ...broker, business_type: role });
      await refreshUser();
      setSuccess({ type: 'broker', url: null });
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
        ...venue, slug,
        price_weekday: venue.price_weekday ? Number(venue.price_weekday) : undefined,
        price_weekend: venue.price_weekend ? Number(venue.price_weekend) : undefined,
        youtube_urls: venue.youtube_urls.filter(u=>u.trim()),
        social: cleanSocial, owner_id: user?.id, status:'نشط',
      });
      await base44.auth.updateMe({ business_type: role, office_name: venue.name, phone: venue.whatsapp });
      await refreshUser();
      const finalSlug = created?.slug || slug;
      setSuccess({ type:'venue', url:`${window.location.origin}/place/${finalSlug}`, theme: venue.page_theme });
    } catch(e) { alert('خطأ: ' + e.message); }
    setSaving(false);
  };

  const next = () => { if (step < totalSteps) setStep(s=>s+1); };
  const prev = () => { if (step > 1) setStep(s=>s-1); else setStep(0); };

  // ══════════ شاشة النجاح ══════════
  if (success) {
    const isRoyal = success.theme === 'royal';
    const isBroker = success.type === 'broker';
    return (
      <div dir="rtl" className={`min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden ${isRoyal ? 'bg-[#0a0e1a]' : 'bg-gradient-to-b from-[#15317E] to-[#0a1840]'}`}>
        <style dangerouslySetInnerHTML={{__html:`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700;800&display=swap'); *{font-family:'IBM Plex Sans Arabic',sans-serif;} @keyframes pop{0%{transform:scale(0)}60%{transform:scale(1.15)}100%{transform:scale(1)}} @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}} />
        <div className={`absolute top-10 right-10 w-40 h-40 rounded-full blur-3xl opacity-20 ${isRoyal?'bg-[#d4af37]':'bg-white'}`}/>
        <div className={`absolute bottom-10 left-10 w-52 h-52 rounded-full blur-3xl opacity-10 ${isRoyal?'bg-[#d4af37]':'bg-white'}`}/>
        <div className="relative z-10 max-w-sm w-full">
          <div className="mb-8" style={{animation:'pop 0.6s cubic-bezier(0.16,1,0.3,1)'}}>
            <div className={`w-28 h-28 rounded-full mx-auto flex items-center justify-center shadow-2xl ${isRoyal?'bg-[#d4af37]':'bg-white'}`}>
              <PartyPopper className={`w-14 h-14 ${isRoyal?'text-[#0a0e1a]':'text-[#15317E]'}`}/>
            </div>
          </div>
          <div style={{animation:'fadeUp 0.6s ease-out 0.2s both'}}>
            <h1 className={`text-3xl font-black mb-3 ${isRoyal?'text-[#d4af37]':'text-white'}`}>🎉 مبروك!</h1>
            <p className="text-white/80 text-base mb-2 leading-relaxed">تم إنشاء حسابك بنجاح</p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-8 ${isRoyal?'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30':'bg-white/15 text-white border border-white/20'}`}>
              <Sparkles className="w-4 h-4"/> معك تجربة مجانية ١٤ يوم
            </div>
          </div>
          <div className="space-y-3" style={{animation:'fadeUp 0.6s ease-out 0.4s both'}}>
            {success.url && (
              <button onClick={()=>window.open(success.url,'_blank')}
                className={`w-full py-4 rounded-2xl font-bold text-base shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 ${isRoyal?'bg-[#d4af37] text-[#0a0e1a] hover:bg-[#c9a227]':'bg-white text-[#15317E] hover:bg-slate-50'}`}>
                <Eye className="w-5 h-5"/> عرض صفحتي
              </button>
            )}
            <button onClick={()=>{ isBroker ? navigate('/') : navigate('/venue'); }}
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
      <style dangerouslySetInnerHTML={{__html:`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap'); body{font-family:'IBM Plex Sans Arabic',sans-serif;} .feature-bubble.selected{background:#15317E;color:white;transform:scale(1.05);box-shadow:0 4px 15px rgba(21,49,126,0.2);} .city-chip.active{background:#15317E;color:white;border-color:#15317E;} .choice-card:hover{transform:translateY(-4px);} .choice-card:active{transform:scale(0.98);}`}} />
      <div className="w-full max-w-xl mx-auto">

        {/* شريط التقدم */}
        <div className="mb-6 px-2 flex justify-between items-center">
          <button onClick={prev} className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-[#15317E] transition-all ${step===0?'opacity-0 pointer-events-none':''}`}>
            <ArrowRight className="w-4 h-4"/>
          </button>
          <div className="flex-1 px-6">
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#15317E] transition-all duration-500 rounded-full" style={{width:`${progress}%`}}/>
            </div>
            {step>0 && <p className="text-center text-[11px] text-slate-400 font-bold mt-1.5">{step} من {totalSteps}</p>}
          </div>
          <div className="w-10"/>
        </div>

        <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(21,49,126,0.08)] p-6 md:p-10 min-h-[480px] flex flex-col">
          <div className="flex-1">

            {/* خطوة 0: اختيار الدور */}
            {step === 0 && (
              <div>
                <div className="text-center mb-8 mt-2">
                  <span className="inline-block px-3 py-1 bg-[#15317E]/5 text-[#15317E] rounded-full text-xs font-bold mb-3">مرحباً بك!</span>
                  <h2 className="text-2xl font-bold text-slate-800">وش نوع نشاطك؟</h2>
                  <p className="text-slate-500 mt-2 text-sm">اختر المناسب وسنجهّز لك ما تحتاجه</p>
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {ROLES.map(r => (
                    <button key={r.id} onClick={()=>{ setRole(r.id); setStep(1); }}
                      className="choice-card bg-white border-2 border-slate-100 rounded-2xl p-5 flex flex-col items-center gap-3 transition-all">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${r.color}`}>
                        <r.Icon className="w-7 h-7"/>
                      </div>
                      <span className="font-bold text-slate-700 text-sm text-center">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ══════ خطوات الوسيط ══════ */}
            {!isVenue && role && step===1 && (
              <div>
                <span className="inline-block px-3 py-1 bg-[#15317E]/5 text-[#15317E] rounded-full text-xs font-bold mb-4">الخطوة ١</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">اسم مكتبك؟</h2>
                <p className="text-slate-500 text-sm mb-8">الاسم اللي راح يظهر للعملاء</p>
                <input value={broker.office_name} onChange={e=>setBroker(p=>({...p,office_name:e.target.value}))}
                  placeholder="مثال: مكتب النخبة العقاري"
                  className="w-full border-b-2 border-slate-200 focus:border-[#15317E] outline-none py-3 text-xl font-bold text-[#15317E] bg-transparent transition-all placeholder:text-slate-300"/>
              </div>
            )}
            {!isVenue && role && step===2 && (
              <div>
                <span className="inline-block px-3 py-1 bg-[#15317E]/5 text-[#15317E] rounded-full text-xs font-bold mb-4">الخطوة ٢</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">في أي مدينة؟</h2>
                <p className="text-slate-500 text-sm mb-8">موقع المكتب الرئيسي</p>
                <div className="flex flex-wrap gap-2">
                  {CITIES.map(c=>(
                    <button key={c} onClick={()=>setBroker(p=>({...p,city:c}))}
                      className={`city-chip px-4 py-2 rounded-full border font-medium text-sm transition-all ${broker.city===c?'active':'border-slate-200 text-slate-600'}`}>{c}</button>
                  ))}
                </div>
              </div>
            )}
            {!isVenue && role && step===3 && (
              <div>
                <span className="inline-block px-3 py-1 bg-[#15317E]/5 text-[#15317E] rounded-full text-xs font-bold mb-4">الخطوة ٣</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">شعار المكتب</h2>
                <p className="text-slate-500 text-sm mb-8">اختياري — يظهر في صفحتك وبطاقاتك</p>
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={uploadLogo}/>
                {broker.office_logo_url ? (
                  <div className="relative w-32 h-32 mx-auto">
                    <img src={broker.office_logo_url} alt="" className="w-full h-full object-cover rounded-2xl border border-slate-100"/>
                    <button onClick={()=>setBroker(p=>({...p,office_logo_url:''}))} className="absolute -top-2 -left-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center"><X className="w-3.5 h-3.5"/></button>
                  </div>
                ) : (
                  <button onClick={()=>logoRef.current?.click()} className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center gap-3 hover:border-[#15317E] hover:bg-slate-50 transition-all">
                    {uploadingLogo ? <Loader2 className="w-8 h-8 text-[#15317E] animate-spin"/> : <><Upload className="w-8 h-8 text-slate-300"/><span className="text-slate-400 font-bold text-sm">اضغط لرفع الشعار</span></>}
                  </button>
                )}
              </div>
            )}
            {!isVenue && role && step===4 && (
              <div>
                <span className="inline-block px-3 py-1 bg-[#15317E]/5 text-[#15317E] rounded-full text-xs font-bold mb-4">الخطوة ٤</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">بيانات التواصل</h2>
                <p className="text-slate-500 text-sm mb-8">اختياري — تقدر تكملها لاحقاً</p>
                <div className="space-y-5">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-[#15317E] focus-within:bg-white transition-all">
                    <label className="block text-xs font-bold text-slate-500 mb-1">رقم واتساب</label>
                    <input value={broker.phone} onChange={e=>setBroker(p=>({...p,phone:e.target.value}))} placeholder="9665xxxxxxxx" dir="ltr"
                      className="w-full bg-transparent border-none outline-none font-bold text-lg text-slate-800"/>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-[#15317E] focus-within:bg-white transition-all">
                    <label className="block text-xs font-bold text-slate-500 mb-1">رقم الرخصة <span className="font-normal">(اختياري)</span></label>
                    <input value={broker.license_number} onChange={e=>setBroker(p=>({...p,license_number:e.target.value}))} placeholder="1234567890" dir="ltr"
                      className="w-full bg-transparent border-none outline-none font-bold text-lg text-slate-800"/>
                  </div>
                </div>
              </div>
            )}

            {/* ══════ خطوات الشاليه ══════ */}
            {isVenue && step===1 && (
              <div>
                <span className="inline-block px-3 py-1 bg-[#15317E]/5 text-[#15317E] rounded-full text-xs font-bold mb-4">الخطوة ١</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">اسم {role}ك ومدينته</h2>
                <p className="text-slate-500 text-sm mb-8">الاسم اللي راح يظهر للعملاء</p>
                <div className="space-y-6">
                  <input value={venue.name} onChange={e=>setV('name',e.target.value)} placeholder={`مثال: ${role} الواحة الفاخر`}
                    className="w-full border-b-2 border-slate-200 focus:border-[#15317E] outline-none py-3 text-xl font-bold text-[#15317E] bg-transparent transition-all placeholder:text-slate-300"/>
                  <div>
                    <p className="text-sm font-bold text-slate-500 mb-3">المدينة</p>
                    <div className="flex flex-wrap gap-2">
                      {CITIES.slice(0,12).map(c=>(
                        <button key={c} onClick={()=>setV('city',c)}
                          className={`city-chip px-4 py-2 rounded-full border font-medium text-sm transition-all ${venue.city===c?'active':'border-slate-200 text-slate-600'}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isVenue && step===2 && (
              <div>
                <span className="inline-block px-3 py-1 bg-[#15317E]/5 text-[#15317E] rounded-full text-xs font-bold mb-4">الخطوة ٢</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">وصف المنشأة</h2>
                <p className="text-slate-500 text-sm mb-8">نبذة تجذب العملاء — اختياري</p>
                <textarea value={venue.description} onChange={e=>setV('description',e.target.value)} rows={5}
                  placeholder="اكتب وصفاً جميلاً عن المكان، المميزات، والأجواء..."
                  className="w-full border-b-2 border-slate-200 focus:border-[#15317E] outline-none py-3 text-base font-medium text-slate-700 bg-transparent transition-all placeholder:text-slate-300 resize-none"/>
              </div>
            )}
            {isVenue && step===3 && (
              <div>
                <span className="inline-block px-3 py-1 bg-[#15317E]/5 text-[#15317E] rounded-full text-xs font-bold mb-3">الخطوة ٣</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">صور المنشأة</h2>
                <p className="text-slate-500 text-sm mb-3">حتى ١٠ صور</p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-5 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-amber-600 flex-shrink-0"/>
                  <p className="text-[12px] text-amber-700 font-bold">أول صورة ستكون الغلاف العلوي للصفحة</p>
                </div>
                <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={uploadImgs}/>
                <div className="grid grid-cols-3 gap-3">
                  {venue.images.map((img,i)=>(
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover"/>
                      {i===0 && <span className="absolute top-1.5 right-1.5 bg-[#15317E] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">الغلاف</span>}
                      <button onClick={()=>setV('images',venue.images.filter((_,j)=>j!==i))} className="absolute top-1.5 left-1.5 w-6 h-6 bg-red-500 text-white rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex"><Trash2 className="w-3 h-3"/></button>
                    </div>
                  ))}
                  {venue.images.length<10 && (
                    <button onClick={()=>imgRef.current?.click()} className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 hover:border-[#15317E] hover:bg-slate-50 transition-all">
                      {uploadingImgs?<Loader2 className="w-6 h-6 text-[#15317E] animate-spin"/>:<><Upload className="w-6 h-6 text-slate-400"/><span className="text-[10px] text-slate-400 font-bold">إضافة</span></>}
                    </button>
                  )}
                </div>
              </div>
            )}
            {isVenue && step===4 && (
              <div>
                <span className="inline-block px-3 py-1 bg-[#15317E]/5 text-[#15317E] rounded-full text-xs font-bold mb-4">الخطوة ٤</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">روابط يوتيوب</h2>
                <p className="text-slate-500 text-sm mb-8">جولة فيديو للمنشأة — حتى ٥ روابط — اختياري</p>
                <div className="space-y-3">
                  {venue.youtube_urls.map((url,i)=>(
                    <div key={i} className="flex gap-2">
                      <input value={url} onChange={e=>{ const a=[...venue.youtube_urls]; a[i]=e.target.value; setV('youtube_urls',a); }}
                        placeholder="https://youtube.com/..." dir="ltr"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#15317E] transition-all"/>
                      {venue.youtube_urls.length>1 && <button onClick={()=>setV('youtube_urls',venue.youtube_urls.filter((_,j)=>j!==i))} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center"><Trash2 className="w-4 h-4"/></button>}
                    </div>
                  ))}
                  {venue.youtube_urls.length<5 && (
                    <button onClick={()=>setV('youtube_urls',[...venue.youtube_urls,''])} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-bold hover:border-[#15317E] hover:text-[#15317E] transition-all">+ إضافة رابط</button>
                  )}
                </div>
              </div>
            )}
            {isVenue && step===5 && (
              <div>
                <span className="inline-block px-3 py-1 bg-[#15317E]/5 text-[#15317E] rounded-full text-xs font-bold mb-4">الخطوة ٥</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">ثيم الصفحة</h2>
                <p className="text-slate-500 text-sm mb-6">اختر شكل صفحتك</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button onClick={()=>{ setV('page_theme','classic'); setTimeout(next,300); }}
                    className={`choice-card p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${venue.page_theme==='classic'?'border-[#15317E] bg-[#15317E]/5':'border-slate-100'}`}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#15317E] to-[#4a6cb3] flex items-center justify-center"><Sun className="w-6 h-6 text-white"/></div>
                    <span className="font-bold text-sm text-slate-700">كلاسيكي فاتح</span>
                  </button>
                  <button onClick={()=>{ setV('page_theme','royal'); setTimeout(next,300); }}
                    className={`choice-card p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${venue.page_theme==='royal'?'border-[#d4af37] bg-[#d4af37]/5':'border-slate-100'}`}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0a0e1a] to-[#1a2238] flex items-center justify-center"><Crown className="w-6 h-6 text-[#d4af37]"/></div>
                    <span className="font-bold text-sm text-slate-700">أسود ملكي</span>
                  </button>
                </div>
                {venue.page_theme==='classic' && (
                  <div>
                    <p className="text-sm font-bold text-slate-500 mb-3 text-center">لون الثيم</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {THEME_COLORS.map(c=>(
                        <button key={c} onClick={()=>setV('theme_color',c)} style={{backgroundColor:c}}
                          className={`w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform ${venue.theme_color===c?'ring-2 ring-offset-2':''}` } style={{backgroundColor:c, outline: venue.theme_color===c ? `2px solid ${c}`:'none', outlineOffset:'3px'}}/>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {isVenue && step===6 && (
              <div>
                <span className="inline-block px-3 py-1 bg-[#15317E]/5 text-[#15317E] rounded-full text-xs font-bold mb-4">الخطوة ٦</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">الأسعار والتواصل</h2>
                <p className="text-slate-500 text-sm mb-8">تقدر تعدلها لاحقاً</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-[#15317E] focus-within:bg-white transition-all">
                      <label className="block text-xs font-bold text-slate-500 mb-1">وسط الأسبوع (ر.س)</label>
                      <input type="number" value={venue.price_weekday} onChange={e=>setV('price_weekday',e.target.value)} placeholder="800"
                        className="w-full bg-transparent border-none outline-none font-bold text-xl text-[#15317E]"/>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-[#15317E] focus-within:bg-white transition-all">
                      <label className="block text-xs font-bold text-slate-500 mb-1">نهاية الأسبوع (ر.س)</label>
                      <input type="number" value={venue.price_weekend} onChange={e=>setV('price_weekend',e.target.value)} placeholder="1200"
                        className="w-full bg-transparent border-none outline-none font-bold text-xl text-[#15317E]"/>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-[#15317E] focus-within:bg-white transition-all">
                    <label className="block text-xs font-bold text-slate-500 mb-1">رقم واتساب للحجوزات *</label>
                    <input value={venue.whatsapp} onChange={e=>setV('whatsapp',e.target.value)} placeholder="9665xxxxxxxx" dir="ltr"
                      className="w-full bg-transparent border-none outline-none font-bold text-lg text-slate-800"/>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-[#15317E] focus-within:bg-white transition-all">
                      <label className="block text-xs font-bold text-slate-500 mb-1">وقت الدخول</label>
                      <input type="time" value={venue.check_in_time} onChange={e=>setV('check_in_time',e.target.value)}
                        className="w-full bg-transparent border-none outline-none font-bold text-base text-slate-700"/>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-[#15317E] focus-within:bg-white transition-all">
                      <label className="block text-xs font-bold text-slate-500 mb-1">وقت الخروج</label>
                      <input type="time" value={venue.check_out_time} onChange={e=>setV('check_out_time',e.target.value)}
                        className="w-full bg-transparent border-none outline-none font-bold text-base text-slate-700"/>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-[#15317E] focus-within:bg-white transition-all">
                    <label className="block text-xs font-bold text-slate-500 mb-1">رابط الموقع (Google Maps) — اختياري</label>
                    <input value={venue.maps_url} onChange={e=>setV('maps_url',e.target.value)} placeholder="https://maps.google.com/..." dir="ltr"
                      className="w-full bg-transparent border-none outline-none text-sm text-slate-700"/>
                  </div>
                </div>
              </div>
            )}
            {isVenue && step===7 && (
              <div>
                <span className="inline-block px-3 py-1 bg-[#15317E]/5 text-[#15317E] rounded-full text-xs font-bold mb-4">الخطوة ٧</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">مميزات المنشأة</h2>
                <p className="text-slate-500 text-sm mb-8">اختر ما يتوفر عندك</p>
                <div className="flex flex-wrap gap-2.5">
                  {ALL_FEATURES.map(f=>(
                    <button key={f} onClick={()=>toggleFeature(f)}
                      className={`feature-bubble px-4 py-2.5 rounded-full border text-sm font-bold transition-all ${venue.features.includes(f)?'selected':'bg-white text-slate-600 border-slate-200'}`}>{f}</button>
                  ))}
                </div>
              </div>
            )}
            {isVenue && step===8 && (
              <div>
                <span className="inline-block px-3 py-1 bg-[#15317E]/5 text-[#15317E] rounded-full text-xs font-bold mb-4">الخطوة ٨</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">التواصل الاجتماعي</h2>
                <p className="text-slate-500 text-sm mb-8">اختياري — ضع اسم المستخدم فقط</p>
                <div className="space-y-4">
                  {[
                    { key:'instagram', label:'انستقرام', Icon:Instagram },
                    { key:'snapchat', label:'سناب شات', Icon:SnapchatIcon },
                    { key:'tiktok', label:'تيك توك', Icon:TikTokIcon },
                    { key:'x', label:'إكس (تويتر)', Icon:XIcon },
                  ].map(s=>(
                    <div key={s.key} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-[#15317E] focus-within:bg-white transition-all flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-500 flex-shrink-0"><s.Icon className="w-5 h-5"/></div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 mb-0.5">{s.label}</label>
                        <input value={venue.social[s.key]||''} onChange={e=>setV('social',{...venue.social,[s.key]:e.target.value})}
                          placeholder="@yourname" dir="ltr"
                          className="w-full bg-transparent border-none outline-none font-bold text-slate-700"/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* أزرار التنقل */}
          {step > 0 && (
            <div className="mt-8 pt-4 flex justify-end items-center">
              {(isVenue && step===totalSteps) ? (
                <button onClick={saveVenue} disabled={saving}
                  className="px-8 py-3.5 rounded-full font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-60">
                  {saving?<><Loader2 className="w-4 h-4 animate-spin"/>جاري الحفظ...</>:<>احفظ وانشر <Check className="w-4 h-4"/></>}
                </button>
              ) : (!isVenue && step===totalSteps) ? (
                <button onClick={saveBroker} disabled={saving || !broker.office_name}
                  className="px-8 py-3.5 rounded-full font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-60">
                  {saving?<><Loader2 className="w-4 h-4 animate-spin"/>جاري الحفظ...</>:<>ابدأ <Check className="w-4 h-4"/></>}
                </button>
              ) : step !== 5 ? (
                <button onClick={next}
                  className="px-8 py-3.5 rounded-full font-bold text-white bg-[#15317E] hover:bg-[#0d1e4c] shadow-lg transition-all flex items-center gap-2 active:scale-95">
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
