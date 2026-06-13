import React, { useState, useRef, useEffect } from "react";
import { base44, supabase } from "@/api/base44Client";
import { Loader2, Upload, Trash2, Check, Sun, Crown, Eye, LayoutDashboard, PartyPopper, Sparkles, ArrowLeft, X } from "lucide-react";
import { getFeaturesForType, FeatureIcons } from '@/lib/featureCatalog';

const IconHome=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>;
const IconTent=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2L2 20h20L12 2z"/><path d="M12 2v18M7 20l5-8 5 8"/></svg>;
const IconTree=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2L6 10h4l-3 5h5v5h2v-5h5l-3-5h4L12 2z"/></svg>;
const IconCouch=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 9V7a2 2 0 00-2-2H6a2 2 0 00-2 2v2"/><path d="M2 11a2 2 0 012 2v2h16v-2a2 2 0 012-2 2 2 0 01-2 2H4a2 2 0 01-2-2z"/><path d="M4 15v2M20 15v2"/></svg>;
const IconBuilding=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M3 9h6M3 15h6M15 9h3M15 13h3M15 17h3"/></svg>;
const IconPin=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>;
const IconPool=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 12h20M2 16c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2"/><circle cx="7" cy="8" r="2"/><path d="M7 10v2"/></svg>;
const IconWifi=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></svg>;
const IconGrill=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 12h16M12 12V6M8 12l-2 6M16 12l2 6M6 6h12a1 1 0 000-2H6a1 1 0 000 2z"/></svg>;
const IconBed=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 20v-8a2 2 0 012-2h16a2 2 0 012 2v8"/><path d="M2 12V6a2 2 0 012-2h16a2 2 0 012 2v6"/><path d="M2 18h20M7 12v-2h10v2"/></svg>;
const IconSnow=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 7l-5-5-5 5M17 17l-5 5-5-5M2 12l5-5 5 5-5 5-5-5zM22 12l-5-5-5 5 5 5 5-5z"/></svg>;
const IconFire=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2c0 6-6 8-6 14a6 6 0 0012 0c0-4-2-7-3-9-1 2-1 4-3 5 1-3 0-7 0-10z"/></svg>;
const IconKids=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="5" r="2"/><path d="M12 7v5l-3 3M12 12l3 3M8 21l2-5M16 21l-2-5"/></svg>;
const IconGarden=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22V12M12 12C12 7 7 4 3 6c3 0 6 2 9 6M12 12c0-5 5-8 9-6-3 0-6 2-9 6"/></svg>;
const IconCar=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 17H3v-5l2-5h14l2 5v5h-2M5 17h14M7 17v2M17 17v2"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/></svg>;
const IconPower=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18.36 6.64a9 9 0 11-12.73 0M12 2v8"/></svg>;
const IconKey=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6M15.5 7.5l3 3"/></svg>;
const IconMen=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="5" r="3"/><path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>;
const IconWomen=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="7" r="4"/><path d="M12 11v10M9 18h6"/></svg>;
const IconKitchen=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 9h20M7 3v6M12 3v6M17 3v6"/></svg>;
const IconStar=(p)=><svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const IconGoogleMaps=(p)=><svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="#EA4335"/><path d="M12 2c1.93 0 3.68.78 4.95 2.05L14 7c-.52-.63-1.25-1-2-1-1.38 0-2.5 1.12-2.5 2.5 0 .54.17 1.04.45 1.45L7.05 12.9A6.98 6.98 0 015 9c0-3.87 3.13-7 7-7z" fill="#4285F4"/><path d="M12 16c-.87 0-1.69-.16-2.45-.45l-2.5 3.06A10.96 10.96 0 0012 20c2.5 0 4.81-.84 6.66-2.24l-2.51-3.08A6.97 6.97 0 0112 16z" fill="#34A853"/><path d="M19 9c0 1.86-.73 3.55-1.92 4.8l2.5 3.06A10.93 10.93 0 0021 9c0-1.56-.33-3.04-.92-4.38l-3.08 2.51C17.63 7.77 19 8.31 19 9z" fill="#FBBC05"/></svg>;
const TikTokIcon=(p)=><svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.41-.02-.34-.02-.68-.02-1.02.13-1.6.82-3.08 1.94-4.21 1.52-1.52 3.8-2.26 5.86-1.92V14.3c-1.11-.27-2.31-.1-3.29.41-.85.45-1.46 1.25-1.63 2.21-.07.39-.07.79-.02 1.18.17 1.25 1.05 2.34 2.19 2.81 1.29.54 2.8.46 4.02-.2 1.19-.65 1.95-1.9 2.05-3.26.2-2.9.06-5.82.09-8.73z"/></svg>;
const XIcon=(p)=><svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>;
const SnapchatIcon=(p)=><svg viewBox="0 0 448 512" fill="currentColor" {...p}><path d="M424.2 263.8c-2.4-10.6-20.2-13.1-34.4-11-20.2 2.9-46.7 9-61.1 5.9-9.1-2-12.7-10.1-10.6-20.9 2-10.2 10.1-26.6 15.8-37.5 44-84.3 13.3-145-38.3-177.3C268.4 6 226.5-.4 191 1.7c-47.5 2.8-82 17.5-104.9 51.5-17.7 26.2-22.1 63.3-10.1 94.6 7.6 19.8 23 48.2 24.3 64.9 1.1 13.7-8.1 20.3-19.1 23-14.7 3.6-43.2-3.1-61.9-5.5-13.7-1.7-27.1 2-30.7 13.1-4 12.3 8.9 25 15.5 29.8 17.3 12.5 40 24.1 64.1 36.8 6.5 3.5 12.1 12 11.2 21.6-1 10.5-6.8 19.3-15.1 24.8-14.6 9.8-33.1 15.1-49.8 18.2-15.6 2.9-32.9 2.5-44.5 11.2C-5.5 391-2.9 405.3 6 414.2c16 16.1 41 18.9 62.1 22.1 19.1 2.9 38.6 3.6 57 8.3 16 4.1 30.6 11 41.5 23.3 7 7.9 13.9 17.8 24.4 23.4 12 6.5 26.7 8.7 39.5 8.7 12.5 0 25.5-2 37.2-7.8 10.7-5.3 17.8-15.5 24.9-23.7 11-12.7 25.9-19.8 42-23.9 18.6-4.8 38.3-5.3 57.6-8.2 21.2-3.2 46.5-6.1 62.6-22.4 8.7-8.8 11.5-23.4 5.2-32.2z"/></svg>;
const InstagramIcon=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>;

const ALL_FEATURES=[
  {id:'مسبح',Icon:IconPool},{id:'جلسات خارجية',Icon:IconGarden},{id:'واي فاي',Icon:IconWifi},
  {id:'مطبخ',Icon:IconKitchen},{id:'دخول ذاتي',Icon:IconKey},{id:'ألعاب أطفال',Icon:IconKids},
  {id:'شواء',Icon:IconGrill},{id:'قسم رجال',Icon:IconMen},{id:'قسم نساء',Icon:IconWomen},
  {id:'غرف نوم',Icon:IconBed},{id:'حديقة',Icon:IconGarden},{id:'مولد كهرباء',Icon:IconPower},
  {id:'مكيف',Icon:IconSnow},{id:'مدفأة',Icon:IconFire},{id:'ملعب',Icon:IconKids},
  {id:'موقف سيارات',Icon:IconCar},{id:'جاكوزي',Icon:IconPool},{id:'ملعب تنس',Icon:IconStar},
  {id:'صالة ألعاب',Icon:IconStar},{id:'غرفة سينما',Icon:IconStar},
];
const VENUE_TYPES=[
  {id:'شاليه',Icon:IconHome},{id:'مخيم',Icon:IconTent},
  {id:'مزرعة',Icon:IconTree},{id:'استراحة',Icon:IconCouch},
];
const THEME_COLORS=['#15317E','#c9a96e','#0f3d36','#7c2d3a','#5b3a70','#1d7874','#2f3640','#b56576'];
const BTN='bg-[#222222] hover:bg-[#000000] text-white';
const STORAGE_KEY='complete_profile_state';
const SUCCESS_STORAGE_KEY='complete_profile_success';
const saveState=(s)=>{try{sessionStorage.setItem(STORAGE_KEY,JSON.stringify(s));}catch(_){}};
const loadState=()=>{try{const s=sessionStorage.getItem(STORAGE_KEY);return s?JSON.parse(s):null;}catch(_){return null;}};
const clearState=()=>{try{sessionStorage.removeItem(STORAGE_KEY);}catch(_){}};
const saveSuccess=(s)=>{try{sessionStorage.setItem(SUCCESS_STORAGE_KEY,JSON.stringify(s));}catch(_){}};
const loadSuccess=()=>{try{const s=sessionStorage.getItem(SUCCESS_STORAGE_KEY);return s?JSON.parse(s):null;}catch(_){return null;}};
const clearSuccess=()=>{try{sessionStorage.removeItem(SUCCESS_STORAGE_KEY);}catch(_){}};

export default function CompleteProfile() {
  const logoRef=useRef();
  const imgRef=useRef();
  const saved=loadState();
  const validSaved = (saved?.step > 0 && !saved?.mainRole) ? null : saved;

  const [mainRole,setMainRole]=useState(validSaved?.mainRole||'');
  const [role,setRole]=useState(validSaved?.role||'');
  const [step,setStep]=useState(()=>{
    const s=validSaved?.step;
    if(s===undefined||s===null)return 0;
    return Number(s);
  });
  const [saving,setSaving]=useState(false);
  const [uploadingLogo,setUploadingLogo]=useState(false);
  const [uploadingImgs,setUploadingImgs]=useState(false);
  const [draggingImgs,setDraggingImgs]=useState(false);
  const [success,setSuccess]=useState(()=>loadSuccess());
  const [broker,setBroker]=useState(validSaved?.broker||{office_name:'',city:'',office_logo_url:'',phone:'',license_number:'',slug:''});
  const [venue,setVenue]=useState(validSaved?.venue||{
    name:'',city:'',description:'',images:[],youtube_urls:[''],
    features:[],social:{instagram:'',snapchat:'',tiktok:'',x:''},
    page_theme:'classic',theme_color:'#c9a96e',
    price_weekday:'',price_weekend:'',whatsapp:'',
    check_in_time:'14:00',check_out_time:'12:00',
    booking_terms:'',slug:'',maps_url:'',google_reviews:[],google_rating:null,google_reviews_count:null,
  });
  const [reviewsQuery,setReviewsQuery]=useState('');
  const [fetchingReviews,setFetchingReviews]=useState(false);
  const [reviewsLeft,setReviewsLeft]=useState(()=>{try{return parseInt(sessionStorage.getItem('reviews_left')??'3');}catch(_){return 3;}});
  const [reviewsFetched,setReviewsFetched]=useState(false);
  const [fetchedReviews,setFetchedReviews]=useState([]); // التقييمات الـ5 المسحوبة للاختيار منها
  const [selectedReviewIdx,setSelectedReviewIdx]=useState([]); // مؤشرات التقييمات المختارة (٣ كحد أقصى)

  useEffect(()=>{
    if(success)return;
    saveState({mainRole,role,step,broker,venue});
  },[mainRole,role,step,broker,venue]);

  const isVenue=mainRole==='venue';
  const venueSteps=10;
  const brokerSteps=4;
  const totalSteps=isVenue?venueSteps:brokerSteps;
  const progress=step===0||step===0.5?0:(step/totalSteps)*100;
  const setV=(k,v)=>setVenue(prev=>({...prev,[k]:v}));
  const toggleFeature=(f)=>setV('features',venue.features.includes(f)?venue.features.filter(x=>x!==f):[...venue.features,f]);

  const uploadLogo=async(e)=>{const file=e.target.files?.[0];if(!file)return;setUploadingLogo(true);try{const{file_url}=await base44.integrations.Core.UploadFile({file});setBroker(p=>({...p,office_logo_url:file_url}));}catch(_){}setUploadingLogo(false);};
  const uploadImageFiles=async(fileList)=>{
    const files=Array.from(fileList||[]).filter(file=>file.type?.startsWith('image/'));
    if(!files.length||venue.images.length>=10)return;
    setUploadingImgs(true);
    const urls=[...venue.images];
    for(const file of files.slice(0,10-urls.length)){
      try{
        const{file_url}=await base44.integrations.Core.UploadFile({file});
        urls.push(file_url);
      }catch(_){}
    }
    setV('images',urls);
    setUploadingImgs(false);
  };
  const uploadImgs=async(e)=>{await uploadImageFiles(e.target.files);e.target.value='';};
  const handleImageDrop=async(e)=>{
    e.preventDefault();
    e.stopPropagation();
    setDraggingImgs(false);
    await uploadImageFiles(e.dataTransfer.files);
  };

  const fetchGoogleReviews=async()=>{
    if(reviewsLeft<=0||!reviewsQuery.trim())return;
    setFetchingReviews(true);
    try{
      // المفتاح محمي في الخادم — نكلم الـ API الداخلي فقط
      const res=await fetch(`/api/getReviews?query=${encodeURIComponent(reviewsQuery)}`);
      const data=await res.json();
      if(data?.error){alert('تعذّر جلب التقييمات: '+data.error);setFetchingReviews(false);return;}

      const positive=(data?.reviews||[]).slice(0,6).map(r=>({
        author:r.author||'ضيف',
        text:r.text||'',
        rating:r.rating||5,
      }));

      // حفظ التقييم العام وعدد التقييمات الحقيقية
      if(data?.rating)setV('google_rating',parseFloat(data.rating));
      if(data?.reviews_count)setV('google_reviews_count',parseInt(String(data.reviews_count).replace(/[^0-9]/g,''))||null);

      const newLeft=reviewsLeft-1;
      setReviewsLeft(newLeft);
      sessionStorage.setItem('reviews_left',String(newLeft));
      setReviewsFetched(true);

      if(positive.length===0){alert('لم يتم العثور على تقييمات إيجابية لهذا المكان، جرّب اسماً أدق');setFetchingReviews(false);return;}

      setFetchedReviews(positive);
      setSelectedReviewIdx(positive.slice(0,4).map((_,i)=>i));
    }catch(e){alert('حدث خطأ: '+e.message);}
    setFetchingReviews(false);
  };

  // اختيار/إلغاء اختيار تقييم (بحد أقصى 3)
  const toggleReview=(idx)=>{
    setSelectedReviewIdx(prev=>{
      if(prev.includes(idx))return prev.filter(i=>i!==idx); // إلغاء الاختيار
      if(prev.length>=4)return [...prev.slice(1),idx];       // استبدال الأقدم تلقائياً
      return [...prev,idx];
    });
  };

  const saveBroker=async()=>{if(!broker.office_name.trim()||!broker.city.trim()){alert('اسم المكتب والمدينة مطلوبة');return;}setSaving(true);try{const brokerSlug=(broker.slug&&broker.slug.trim())?broker.slug.trim():`a${Math.random().toString(36).slice(2,8)}`;await base44.auth.updateMe({...broker,slug:brokerSlug,business_type:role});const successData={type:'broker',theme:'classic',url:`${window.location.origin}/agent/${brokerSlug}`};clearState();saveSuccess(successData);setSuccess(successData);}catch(e){alert('خطأ: '+e.message);}setSaving(false);};

  const saveVenue=async()=>{
    if(!venue.name.trim()||!venue.city.trim()){alert('اسم المكان والمدينة مطلوبة');return;}
    setSaving(true);
    try{
      const{data:{user}}=await supabase.auth.getUser();
      const cleanSocial={};
      Object.entries(venue.social||{}).forEach(([k,v])=>{if(v?.trim())cleanSocial[k]=v.trim();});
      const slug=venue.slug||`venue-${Date.now()}`;
      const chosenReviews=selectedReviewIdx.map(i=>fetchedReviews[i]).filter(Boolean);
      const created=await base44.entities.Venue.create({
        ...venue,
        google_reviews:chosenReviews.length?chosenReviews:venue.google_reviews,
        slug,
        venue_type:role,
        price_weekday:venue.price_weekday?Number(venue.price_weekday):undefined,
        price_weekend:venue.price_weekend?Number(venue.price_weekend):undefined,
        youtube_urls:venue.youtube_urls.filter(u=>u.trim()),
        social:cleanSocial,
        owner_id:user?.id,
        status:'نشط'
      });

      // TRIAL_UPSERT_WITH_PROFILE_FIX_V2
      // نحفظ بيانات البروفايل + تجربة 30 يوم في نفس upsert عند أول إنشاء فقط.
      // هذا يحل مسار التسجيل العادي إذا لم يكن صف profiles موجوداً بعد.
      const profileUpdate={business_type:role,office_name:venue.name,phone:venue.whatsapp};
      let shouldStartTrial=false;
      let trialEnd=null;
      let trialStartedAt=null;

      if(user?.id){
        const{data:prof,error:profileReadError}=await supabase
          .from('profiles')
          .select('subscription_started, subscription_end, subscription_plan')
          .eq('id',user.id)
          .maybeSingle();

        if(profileReadError){
          throw profileReadError;
        }

        shouldStartTrial=!prof?.subscription_started&&!prof?.subscription_end;
        if(shouldStartTrial){
          trialEnd=new Date();
          trialEnd.setDate(trialEnd.getDate()+30);
          trialStartedAt=new Date().toISOString();
        }
      }

      await base44.auth.updateMe(
        shouldStartTrial
          ? {
              ...profileUpdate,
              subscription_plan:'trial',
              subscription_end:trialEnd.toISOString(),
              subscription_started:trialStartedAt
            }
          : profileUpdate
      );

      if(user?.id&&shouldStartTrial){
        try{
          await supabase.from('notifications').insert({
            user_id:user.id,
            type:'welcome',
            title:'نورتنا 🎉',
            body:'فعّلنا لك تجربة مجانية لمدة 30 يوم، خذ راحتك وجهّز صفحتك على مهلك'
          });
        }catch(notificationError){
          console.warn('TRIAL_NOTIFICATION_WARNING_V2',notificationError);
        }
      }

      const finalSlug=created?.slug||slug;
      const successData={type:'venue',url:`${window.location.origin}/place/${finalSlug}`,theme:venue.page_theme};
      clearState();
      saveSuccess(successData);
      setSuccess(successData);
    }catch(e){
      alert('خطأ: '+e.message);
    }
    setSaving(false);
  };

  const next=()=>{
    if(step===0.5){setStep(1);return;}
    const nextStep=Math.min(Math.round(step)+1, totalSteps);
    setStep(nextStep);
  };
  const prev=()=>{
    if(step===0.5){setStep(0);setMainRole('');return;}
    if(step>1){setStep(s=>Math.round(s)-1);return;}
    setStep(0);
  };

  const canGoNext=()=>{
    if(isVenue&&step===1)return !!venue.name.trim();
    if(isVenue&&step===3)return !!venue.city.trim();
    if(!isVenue&&step===1)return !!broker.office_name.trim();
    if(!isVenue&&step===2)return !!broker.city.trim();
    return true;
  };

  if(success){
    const isBroker=success.type==='broker';
    const dashboardPath=isBroker?'/':'/venue';
    const goDashboard=()=>{clearSuccess();clearState();window.location.href=dashboardPath;};
        return(
      <div dir="rtl" className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4 py-10 relative overflow-hidden"
        style={{backgroundImage:'radial-gradient(at 0% 0%, rgba(255,56,92,.08) 0px, transparent 45%), radial-gradient(at 100% 0%, rgba(34,34,34,.05) 0px, transparent 45%)',backgroundAttachment:'fixed'}}>
        <style dangerouslySetInnerHTML={{__html:`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap');*{font-family:'IBM Plex Sans Arabic',sans-serif;}@keyframes floatUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}@keyframes pop{0%{transform:scale(.75);opacity:0}70%{transform:scale(1.06);opacity:1}100%{transform:scale(1)}}`}}/>
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#FF385C]/10 blur-3xl"/>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-black/5 blur-3xl"/>

        <div className="w-full max-w-5xl grid lg:grid-cols-[1.05fr_.95fr] gap-6 items-stretch relative z-10">
          <section className="bg-white rounded-[2.25rem] shadow-[0_25px_70px_-30px_rgba(0,0,0,.18)] border border-white p-6 md:p-10 overflow-hidden relative" style={{animation:'floatUp .55s ease-out both'}}>
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-l from-[#FF385C] via-[#222222] to-[#FF385C]"/>
            <div className="w-24 h-24 rounded-[2rem] bg-[#222222] text-white flex items-center justify-center shadow-xl shadow-black/20 mb-7" style={{animation:'pop .6s cubic-bezier(.16,1,.3,1) both'}}>
              <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/><path d="M3 12l4 4L21 2" opacity=".35"/></svg>
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF385C]/10 text-[#FF385C] text-xs font-extrabold mb-4">
              <Sparkles className="w-4 h-4"/> تم تجهيز حسابك
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight mb-4">مبروك! صفحتك صارت جاهزة 🎉</h1>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8">
              {isBroker?'تم إكمال ملف الوسيط العقاري بنجاح. تقدر الآن تدخل لوحة التحكم وتبدأ إضافة عقاراتك وإدارة بياناتك.':'تم إنشاء صفحة مكانك بنجاح. تقدر تشارك الرابط مع عملائك، أو تدخل لوحة التحكم لإدارة الصور والأسعار والحجوزات.'}
            </p>

            <div className="grid sm:grid-cols-3 gap-3 mb-8">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <div className="w-10 h-10 rounded-xl bg-white text-[#FF385C] flex items-center justify-center mb-3 shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h5"/></svg>
                </div>
                <h3 className="font-extrabold text-slate-800 text-sm">صفحة جاهزة</h3>
                <p className="text-xs text-slate-400 mt-1">رابط مستقل لعملائك</p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <div className="w-10 h-10 rounded-xl bg-white text-[#FF385C] flex items-center justify-center mb-3 shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M3 12h18"/><path d="M7 7h10v10H7z"/></svg>
                </div>
                <h3 className="font-extrabold text-slate-800 text-sm">إدارة سهلة</h3>
                <p className="text-xs text-slate-400 mt-1">أسعار وصور ومميزات</p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <div className="w-10 h-10 rounded-xl bg-white text-[#FF385C] flex items-center justify-center mb-3 shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a4 4 0 01-4 4H7l-4 3V7a4 4 0 014-4h10a4 4 0 014 4z"/><path d="M8 9h8M8 13h5"/></svg>
                </div>
                <h3 className="font-extrabold text-slate-800 text-sm">جاهز للحجوزات</h3>
                <p className="text-xs text-slate-400 mt-1">واتساب وتواصل مباشر</p>
              </div>
            </div>

            <div className="space-y-3">
              <button type="button" onClick={goDashboard} className="w-full py-4 rounded-2xl font-extrabold text-sm md:text-base shadow-xl shadow-[#FF385C]/20 transition-all flex items-center justify-center gap-2 active:scale-95 bg-[#FF385C] text-white hover:bg-[#E31C5F]"><LayoutDashboard className="w-5 h-5"/> دخول لوحة التحكم</button>
              {success.url&&(<button type="button" onClick={()=>window.open(success.url,'_blank')} className="w-full py-4 rounded-2xl font-extrabold text-sm md:text-base border transition-all flex items-center justify-center gap-2 active:scale-95 bg-white text-[#222222] border-slate-200 hover:border-[#FF385C] hover:text-[#FF385C]"><Eye className="w-5 h-5"/> مشاهدة صفحتي</button>)}
              <div className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16.5 9"/></svg>
                اشتراك ٣٠ يوم مفعّل
              </div>
            </div>
          </section>

          <aside className="bg-[#222222] rounded-[2.25rem] p-6 md:p-8 text-white shadow-[0_25px_70px_-30px_rgba(0,0,0,.45)] relative overflow-hidden" style={{animation:'floatUp .65s ease-out .08s both'}}>
            <div className="absolute -top-20 -left-20 w-56 h-56 rounded-full bg-white/10 blur-3xl"/>
            <div className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full bg-[#FF385C]/25 blur-3xl"/>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-6">
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/></svg>
                </div>
                <h2 className="text-xl font-black mb-3">خطوتك الجاية</h2>
                <div className="space-y-4 text-sm text-white/75 leading-relaxed">
                  <p>١. شاهد صفحتك وتأكد أن الصور والمعلومات ظاهرة بالشكل المطلوب.</p>
                  <p>٢. ارجع هنا واضغط دخول لوحة التحكم لإدارة بياناتك.</p>
                  <p>٣. تجربتك المجانية مفعّلة لمدة ٣٠ يوم من الآن.</p>
                </div>
              </div>
              <div className="mt-8 rounded-3xl bg-white/10 border border-white/15 p-5">
                <p className="text-sm font-bold text-white/90">تجربتك المجانية</p>
                <p className="text-3xl font-black mt-1">٣٠ يوم</p>
                <p className="text-xs text-white/60 mt-2">ابدأ بإدارة صفحتك بدون تعقيد.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return(
    <div dir="rtl" className="min-h-screen bg-[#f7f7f7] flex flex-col items-center py-8 px-4"
      style={{backgroundImage:'radial-gradient(at 0% 0%, rgba(255,56,92,.06) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(34,34,34,.04) 0px, transparent 50%)',backgroundAttachment:'fixed'}}>
      <style dangerouslySetInnerHTML={{__html:`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');body{font-family:'IBM Plex Sans Arabic',sans-serif;}.feature-bubble.selected{background:#FF385C;color:white;transform:scale(1.03);}.choice-card:hover{transform:translateY(-3px);}.choice-card:active{transform:scale(0.98);}`}}/>
      <div className="w-full max-w-xl mx-auto">

        {/* شريط التقدم */}
        <div className="mb-6 px-2 flex justify-between items-center">
          <button onClick={prev} className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all ${step===0?'opacity-0 pointer-events-none':''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          <div className="flex-1 px-6">
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full transition-all duration-500 rounded-full bg-[#FF385C]" style={{width:`${progress}%`}}/>
            </div>
            {step>0&&step!==0.5&&<p className="text-center text-[11px] text-slate-400 font-bold mt-1.5">{step} من {totalSteps}</p>}
          </div>
          <div className="w-10"/>
        </div>

        <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] p-5 md:p-8 min-h-[480px] flex flex-col border border-white">
          <div className="flex-1">

            {/* خطوة 0: الدور */}
            {step===0&&(
              <div>
                <div className="text-center mb-8 mt-2">
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold mb-3">مرحباً بك!</span>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-800">وش نوع نشاطك؟</h2>
                  <p className="text-slate-500 mt-2 text-sm">اختر المناسب لك</p>
                </div>
                <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
                  <button onClick={()=>{setMainRole('venue');setStep(0.5);}} className="choice-card bg-white border-2 border-slate-100 rounded-2xl p-6 flex items-center gap-4 transition-all text-right">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0"><IconHome className="w-7 h-7 text-slate-700"/></div>
                    <div><p className="font-bold text-slate-800 text-base">مالك شاليه</p><p className="text-slate-400 text-xs mt-1">يشمل: شاليه، مخيم، مزرعة، استراحة</p></div>
                  </button>
                  <button onClick={()=>{setMainRole('broker');setRole('وسيط');setStep(1);}} className="choice-card bg-white border-2 border-slate-100 rounded-2xl p-6 flex items-center gap-4 transition-all text-right">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0"><IconBuilding className="w-7 h-7 text-slate-700"/></div>
                    <div><p className="font-bold text-slate-800 text-base">وسيط عقاري</p><p className="text-slate-400 text-xs mt-1">عرض وإدارة العقارات للبيع والإيجار</p></div>
                  </button>
                </div>
              </div>
            )}

            {/* خطوة 0.5: نوع الشاليه */}
            {step===0.5&&(
              <div>
                <div className="text-center mb-8 mt-2">
                  
                  <h2 className="text-xl md:text-2xl font-bold text-slate-800">وش نوع المكان اللي بتضيفه؟</h2>
                  <p className="text-slate-500 mt-2 text-sm">اختر النوع المناسب عشان نجهز لك الخيارات الصح.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {VENUE_TYPES.map(t=>(
                    <button key={t.id} onClick={()=>{setRole(t.id);setStep(1);}}
                      className="choice-card bg-white border-2 border-slate-100 rounded-2xl p-6 flex flex-col items-center gap-3 transition-all">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center"><t.Icon className="w-8 h-8 text-slate-600"/></div>
                      <span className="font-bold text-slate-700 text-base">{t.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ══ وسيط: خطوة ١ ══ */}
            {!isVenue&&role&&step===1&&(
              <div>
                
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">اسم مكتبك؟</h2>
                <p className="text-slate-500 text-sm mb-8">الاسم اللي راح يظهر للعملاء</p>
                <input value={broker.office_name} onChange={e=>setBroker(p=>({...p,office_name:e.target.value}))} placeholder="مثال: مكتب النخبة العقاري"
                  className="w-full border-b-2 border-slate-200 focus:border-[#FF385C] outline-none py-3 text-lg font-bold text-slate-800 bg-transparent transition-all placeholder:text-slate-300"/>
              </div>
            )}
            {!isVenue&&role&&step===2&&(
              <div>
                
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">في أي مدينة؟</h2>
                <div className="relative mt-8">
                  <IconPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
                  <input required value={broker.city} onChange={e=>setBroker(p=>({...p,city:e.target.value}))} placeholder="اكتب اسم المدينة"
                    aria-invalid={!broker.city.trim()}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 pr-12 text-base font-medium outline-none focus:border-[#FF385C] transition-all"/>
                  {!broker.city.trim()&&<p className="text-xs text-red-400 font-bold mt-2">مطلوب</p>}
                </div>
              </div>
            )}
            {!isVenue&&role&&step===3&&(
              <div>
                
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">شعار المكتب</h2>
                <p className="text-slate-500 text-sm mb-8">اختياري</p>
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={uploadLogo}/>
                {broker.office_logo_url?(
                  <div className="relative w-32 h-32 mx-auto">
                    <img src={broker.office_logo_url} alt="" className="w-full h-full object-cover rounded-2xl border border-slate-100"/>
                    <button onClick={()=>setBroker(p=>({...p,office_logo_url:''}))} className="absolute -top-2 -left-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center"><X className="w-3.5 h-3.5"/></button>
                  </div>
                ):(
                  <button onClick={()=>logoRef.current?.click()} className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center gap-3 hover:border-slate-400 hover:bg-slate-50 transition-all">
                    {uploadingLogo?<Loader2 className="w-8 h-8 text-slate-400 animate-spin"/>:<><Upload className="w-8 h-8 text-slate-300"/><span className="text-slate-400 font-bold text-sm">اضغط لرفع الشعار</span></>}
                  </button>
                )}
              </div>
            )}
            {!isVenue&&role&&step===4&&(
              <div>
                
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">بيانات التواصل</h2>
                <p className="text-slate-500 text-sm mb-8">اختياري — تقدر تكملها لاحقاً</p>
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-slate-400 transition-all">
                    <label className="block text-xs font-bold text-slate-400 mb-1">رقم واتساب</label>
                    <input value={broker.phone} onChange={e=>setBroker(p=>({...p,phone:e.target.value}))} placeholder="9665xxxxxxxx" dir="ltr" className="w-full bg-transparent border-none outline-none font-bold text-base text-slate-800"/>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-slate-400 transition-all">
                    <label className="block text-xs font-bold text-slate-400 mb-1">رقم الرخصة (اختياري)</label>
                    <input value={broker.license_number} onChange={e=>setBroker(p=>({...p,license_number:e.target.value}))} placeholder="1234567890" dir="ltr" className="w-full bg-transparent border-none outline-none font-bold text-base text-slate-800"/>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-slate-400 transition-all">
                    <label className="block text-xs font-bold text-slate-400 mb-1">رابط صفحتك (اختياري)</label>
                    <div className="flex items-center gap-1" dir="ltr">
                      <span className="text-xs text-slate-400 font-medium whitespace-nowrap">aqacloud.com/agent/</span>
                      <input value={broker.slug} onChange={e=>setBroker(p=>({...p,slug:e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'')}))} placeholder="my-office" dir="ltr" className="w-full bg-transparent border-none outline-none font-bold text-base text-slate-800"/>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">إنجليزي فقط — اتركه فارغاً ليتولّد تلقائياً</p>
                  </div>
                </div>
              </div>
            )}

            {/* ══ شاليه: خطوة ١ — الاسم ══ */}
            {isVenue&&step===1&&(
              <div>
                
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">أهلاً بك! وش اسم {role}ك؟</h2>
                <p className="text-slate-500 mt-1 text-sm mb-8">اكتب الاسم اللي راح يظهر للعملاء.</p>
                <input value={venue.name} onChange={e=>setV('name',e.target.value)} placeholder={`مثال: ${role} الريم الفاخر`}
                  className="w-full border-b-2 border-slate-200 focus:border-[#FF385C] outline-none py-3 text-lg font-bold text-slate-800 bg-transparent transition-all placeholder:text-slate-300"/>
                {!venue.name.trim()&&<p className="text-xs text-red-400 font-bold mt-2">مطلوب</p>}
              </div>
            )}

            {/* خطوة ٢ — الرابط المخصص */}
            {isVenue&&step===2&&(
              <div>
                
                <div className="text-center mb-8 mt-2">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center mb-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-800">اختر رابطك المخصص</h2>
                  <p className="text-slate-500 mt-2 text-sm">هذا الرابط اللي بتشاركه مع عملائك — اختياري، إنجليزي فقط</p>
                </div>
                <div className="flex items-center w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-2 focus-within:border-[#FF385C] focus-within:ring-4 focus-within:ring-[#FF385C]/10 transition-all" dir="ltr">
                  <input value={venue.slug} onChange={e=>setV('slug',e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'').replace(/--+/g,'-'))}
                    placeholder="my-chalet"
                    className="flex-1 bg-transparent border-none outline-none font-mono text-base text-slate-700 font-bold p-2"/>
                  <span className="pr-3 pl-4 text-slate-400 font-mono text-xs border-r border-slate-200">aqacloud.com/place/</span>
                </div>
                <p className="text-xs text-slate-400 mt-4 text-center">تقدر تتخطى هذه الخطوة وسنولّد لك رابط تلقائياً</p>
              </div>
            )}

            {/* خطوة ٣ — المدينة */}
            {isVenue&&step===3&&(
              <div>
                
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">في أي مدينة؟</h2>
                <p className="text-slate-500 text-sm mb-8">اكتب اسم المدينة اللي فيها {role}ك</p>
                <div className="relative">
                  <IconPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
                  <input required value={venue.city} onChange={e=>setV('city',e.target.value)} placeholder="مثال: الرياض"
                    aria-invalid={!venue.city.trim()}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 pr-12 text-base font-medium outline-none focus:border-[#FF385C] transition-all"/>
                  {!venue.city.trim()&&<p className="text-xs text-red-400 font-bold mt-2">مطلوب</p>}
                </div>
              </div>
            )}

            {/* خطوة ٤ — الوصف */}
            {isVenue&&step===4&&(
              <div>
                
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">وش يميّز مكانك؟</h2>
                <p className="text-slate-500 text-sm mb-2">وصف جميل يجذب العملاء — يمكن إعداده لاحقاً</p>
                <textarea value={venue.description} onChange={e=>setV('description',e.target.value)} rows={5}
                  placeholder="اكتب وصفاً يجذب العملاء — الأجواء، المميزات، التجربة..."
                  className="w-full border-b-2 border-slate-200 focus:border-[#FF385C] outline-none py-3 text-base font-medium text-slate-700 bg-transparent transition-all placeholder:text-slate-300 resize-none mt-4"/>
              </div>
            )}

            {/* خطوة ٥ — الصور */}
            {isVenue&&step===5&&(
              <div>
                
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">الصور تجذب العملاء! 📸</h2>
                <p className="text-slate-500 text-sm mb-4">ارفع أجمل صور {role}ك — حتى ١٠ صور</p>
                <div className="flex items-center gap-2 mb-5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                  <p className="text-[12px] text-slate-500 font-bold">أول صورة ستكون الغلاف العلوي للصفحة</p>
                </div>
                <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={uploadImgs}/>
                {venue.images.length<10&&(
                  <button
                    type="button"
                    onClick={()=>imgRef.current?.click()}
                    onDragEnter={(e)=>{e.preventDefault();e.stopPropagation();setDraggingImgs(true);}}
                    onDragOver={(e)=>{e.preventDefault();e.stopPropagation();setDraggingImgs(true);}}
                    onDragLeave={(e)=>{e.preventDefault();e.stopPropagation();setDraggingImgs(false);}}
                    onDrop={handleImageDrop}
                    className={`w-full min-h-[230px] md:min-h-[270px] rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 group mb-4 px-6 text-center ${draggingImgs?'border-[#FF385C] bg-[#FF385C]/5':'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}`}
                  >
                    {uploadingImgs?<Loader2 className="w-9 h-9 text-slate-400 animate-spin"/>:<>
                      <div className="w-20 h-20 bg-white rounded-[1.75rem] shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                      </div>
                      <span className="text-base text-slate-600 font-black">اضغط لرفع الصور أو اسحبها هنا</span>
                      <span className="text-xs text-slate-400 font-bold">يدعم رفع عدة صور دفعة واحدة — المتبقي {10-venue.images.length} صور</span>
                    </>}
                  </button>
                )}
                {venue.images.length>0&&(<div className="grid grid-cols-3 gap-3">
                  {venue.images.map((img,i)=>(
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover"/>
                      {i===0&&<span className="absolute top-1.5 right-1.5 bg-[#2d2d2d] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">الغلاف</span>}
                      <button onClick={()=>setV('images',venue.images.filter((_,j)=>j!==i))} className="absolute top-1.5 left-1.5 w-6 h-6 bg-red-500 text-white rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex"><Trash2 className="w-3 h-3"/></button>
                    </div>
                  ))}
                </div>)}
                {/* حسابات التواصل — اختيارية */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-400 mb-3">حسابات التواصل الاجتماعي — اختياري، يمكن إعدادها لاحقاً</p>
                  <div className="space-y-3">
                    <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 focus-within:border-slate-400 transition-all flex items-center gap-3">
                      <InstagramIcon className="w-5 h-5 text-slate-500 flex-shrink-0"/>
                      <div className="flex-1">
                        <input value={venue.social.instagram||''} onChange={e=>setV('social',{...venue.social,instagram:e.target.value})} placeholder="@yourname" dir="ltr" className="w-full bg-transparent border-none outline-none font-bold text-sm text-slate-700"/>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 focus-within:border-slate-400 transition-all flex items-center gap-3">
                      <TikTokIcon className="w-5 h-5 text-slate-500 flex-shrink-0"/>
                      <div className="flex-1">
                        <input value={venue.social.tiktok||''} onChange={e=>setV('social',{...venue.social,tiktok:e.target.value})} placeholder="@yourname" dir="ltr" className="w-full bg-transparent border-none outline-none font-bold text-sm text-slate-700"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isVenue&&step===6&&(
              <div>
                
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">جولة فيديو للمكان</h2>
                <p className="text-slate-500 text-sm mb-8">حتى ٥ روابط يوتيوب — اختياري</p>
                <div className="space-y-3">
                  {venue.youtube_urls.map((url,i)=>(
                    <div key={i} className="flex gap-2">
                      <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 px-4 focus-within:border-[#FF385C] transition-all">
                        <svg viewBox="0 0 24 24" fill="#ef4444" className="w-5 h-5 flex-shrink-0"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 00.5 6.2C0 8 0 12 0 12s0 4 .5 5.8a3 3 0 002.1 2.1C4.4 20.4 12 20.4 12 20.4s7.6 0 9.4-.5a3 3 0 002.1-2.1C24 16 24 12 24 12s0-4-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>
                        <input value={url} onChange={e=>{const a=[...venue.youtube_urls];a[i]=e.target.value;setV('youtube_urls',a);}} placeholder="https://youtube.com/..." dir="ltr"
                          className="flex-1 bg-transparent border-none outline-none text-sm py-3.5 text-slate-700"/>
                      </div>
                      {venue.youtube_urls.length>1&&<button onClick={()=>setV('youtube_urls',venue.youtube_urls.filter((_,j)=>j!==i))} className="w-11 h-11 bg-red-50 text-red-500 rounded-xl flex items-center justify-center flex-shrink-0 self-center"><Trash2 className="w-4 h-4"/></button>}
                    </div>
                  ))}
                  {venue.youtube_urls.length<5&&(<button onClick={()=>setV('youtube_urls',[...venue.youtube_urls,''])} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-bold hover:border-slate-400 transition-all">+ إضافة رابط</button>)}
                </div>
              </div>
            )}

            {/* خطوة ٧ — الثيم */}
            {isVenue&&step===7&&(
              <div>
                
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">كيف تبي شكل صفحتك؟ 🎨</h2>
                <p className="text-slate-500 text-sm mb-6">اختر الثيم اللي يناسب هوية مكانك.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <button onClick={()=>setV('page_theme','classic')}
                    className={`choice-card relative bg-white border-2 rounded-[2rem] p-6 text-right overflow-hidden transition-all ${venue.page_theme==='classic'?'border-slate-700':'border-slate-100'}`}>
                    <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-blue-400 to-emerald-400"/>
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4"><Sun className="w-6 h-6 text-amber-500"/></div>
                    <h3 className="font-bold text-base text-slate-800">الكلاسيكي الفاتح</h3>
                    <p className="text-sm text-slate-500 mt-1">مشرق، نظيف، وتقدر تختار لونه.</p>
                  </button>
                  <button onClick={()=>{setV('page_theme','royal');setTimeout(next,280);}}
                    className={`choice-card relative bg-slate-900 border-2 rounded-[2rem] p-6 text-right overflow-hidden transition-all hover:border-yellow-500 ${venue.page_theme==='royal'?'border-yellow-500':'border-slate-800'}`}>
                    <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-yellow-600 to-yellow-300"/>
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4"><Crown className="w-6 h-6 text-yellow-400"/></div>
                    <h3 className="font-bold text-base text-white">الأسود الملكي</h3>
                    <p className="text-sm text-slate-400 mt-1">فخامة داكنة بلمسات ذهبية.</p>
                  </button>
                  <button onClick={()=>{setV('page_theme','resort');setTimeout(next,280);}}
                    className={`choice-card relative border-2 rounded-[2rem] p-6 text-right overflow-hidden transition-all hover:border-[#0A2629] ${venue.page_theme==='resort'?'border-[#0A2629]':'border-slate-100'}`}
                    style={{background:'#E8F0F0'}}>
                    <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-[#0A2629] to-[#D4B982]"/>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{background:'#0A2629'}}><Sparkles className="w-6 h-6" style={{color:'#D4B982'}}/></div>
                    <h3 className="font-bold text-base" style={{color:'#0A2629'}}>المنتجع الفاخر</h3>
                    <p className="text-sm mt-1" style={{color:'#8DA3A5'}}>تيل داكن فاخر بلمسات ذهبية.</p>
                  </button>
                </div>
                {venue.page_theme==='classic'&&(
                  <div>
                    <p className="text-sm font-bold text-slate-500 mb-3 text-center">وش اللون اللي تفضله للثيم؟</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {THEME_COLORS.map(c=>(<button key={c} onClick={()=>setV('theme_color',c)} style={{backgroundColor:c,outline:venue.theme_color===c?`3px solid ${c}`:'none',outlineOffset:'3px'}} className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"/>))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* خطوة ٨ — الأسعار */}
            {isVenue&&step===8&&(
              <div>
                
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">الأسعار والمواعيد 💰</h2>
                <p className="text-slate-500 text-sm mb-6">حدد أسعارك المبدئية، وتقدر تعدلها بأي وقت لاحقاً بكل سهولة.</p>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-slate-400 focus-within:bg-white transition-all">
                      <label className="block text-xs font-bold text-slate-400 mb-1">وسط الأسبوع (ر.س)</label>
                      <input type="number" value={venue.price_weekday} onChange={e=>setV('price_weekday',e.target.value)} placeholder="800" className="w-full bg-transparent border-none outline-none font-bold text-xl text-slate-800"/>
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-slate-400 focus-within:bg-white transition-all">
                      <label className="block text-xs font-bold text-slate-400 mb-1">نهاية الأسبوع (ر.س)</label>
                      <input type="number" value={venue.price_weekend} onChange={e=>setV('price_weekend',e.target.value)} placeholder="1200" className="w-full bg-transparent border-none outline-none font-bold text-xl text-slate-800"/>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-slate-400 focus-within:bg-white transition-all flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-400 mb-1">رقم واتساب للحجوزات *</label>
                      <input value={venue.whatsapp} onChange={e=>setV('whatsapp',e.target.value)} placeholder="9665xxxxxxxx" dir="ltr" className="w-full bg-transparent border-none outline-none font-bold text-base text-slate-800"/>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-slate-400 transition-all">
                      <label className="block text-xs font-bold text-slate-400 mb-1">وقت الدخول</label>
                      <input type="time" value={venue.check_in_time} onChange={e=>setV('check_in_time',e.target.value)} className="w-full bg-transparent border-none outline-none font-bold text-base text-slate-700"/>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-slate-400 transition-all">
                      <label className="block text-xs font-bold text-slate-400 mb-1">وقت الخروج</label>
                      <input type="time" value={venue.check_out_time} onChange={e=>setV('check_out_time',e.target.value)} className="w-full bg-transparent border-none outline-none font-bold text-base text-slate-700"/>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-slate-400 transition-all flex items-center gap-3">
                    <IconPin className="w-5 h-5 text-slate-400 flex-shrink-0"/>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-400 mb-1">رابط Google Maps — اختياري</label>
                      <input value={venue.maps_url} onChange={e=>setV('maps_url',e.target.value)} placeholder="https://maps.google.com/..." dir="ltr" className="w-full bg-transparent border-none outline-none text-sm text-slate-700"/>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* خطوة ٩ — المميزات */}
            {isVenue&&step===9&&(
              <div>
                
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">أخيراً، وش يتميز فيه مكانك؟ ✨</h2>
                <p className="text-slate-500 text-sm mb-6">اختر المرافق المتوفرة عشان تظهر للعملاء بشكل أيقونات جميلة.</p>
                <div className="flex flex-wrap gap-2.5">
                  {getFeaturesForType(role).map(f=>{
                    const FIcon = FeatureIcons[f.icon];
                    return (
                    <button key={f.id} onClick={()=>toggleFeature(f.id)}
                      className={`feature-bubble flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all ${venue.features.includes(f.id)?'selected border-transparent':'bg-white text-slate-600 border-slate-200'}`}>
                      <FIcon className="w-4 h-4 flex-shrink-0"/>{f.id}
                    </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* خطوة ١٠ — تقييمات Google */}
            {isVenue&&step===10&&(
              <div>
                
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-1">اجلب تقييمات عملائك من Google Maps</h2>
                <p className="text-slate-500 text-sm mb-3 leading-relaxed">أدخل اسم مكانك بالضبط كما يظهر في Google Maps ليتم جلب أفضل التقييمات الإيجابية وعرضها في صفحتك تلقائياً</p>
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 mb-5 border border-slate-100">
                  <div className={`w-2 h-2 rounded-full ${reviewsLeft>1?'bg-emerald-400':reviewsLeft===1?'bg-amber-400':'bg-red-400'}`}/>
                  <span className="text-xs font-bold text-slate-500">لديك {reviewsLeft} {reviewsLeft===1?'محاولة':'محاولات'}</span>
                </div>
                {reviewsLeft>0?(
                  <>
                    <div className="flex gap-2 mb-4">
                      <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3 focus-within:border-[#FF385C] transition-all">
                        <IconGoogleMaps className="w-5 h-5 flex-shrink-0"/>
                        <input value={reviewsQuery} onChange={e=>setReviewsQuery(e.target.value)} placeholder={`مثال: شاليه الواحة جدة`} className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-700"/>
                      </div>
                      <button onClick={fetchGoogleReviews} disabled={fetchingReviews||!reviewsQuery.trim()} className={`px-4 py-3 rounded-2xl font-bold text-sm ${BTN} disabled:opacity-40 flex items-center gap-2 transition-all`}>
                        {fetchingReviews?<Loader2 className="w-4 h-4 animate-spin"/>:<Sparkles className="w-4 h-4"/>} جلب
                      </button>
                    </div>

                    {/* شريط تقدّم متحرك أثناء الجلب */}
                    {fetchingReviews&&(
                      <div className="mb-4 -mt-1">
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{width:'40%',background:'#222222',animation:'reviewsLoadBar 1.1s ease-in-out infinite'}}/>
                        </div>
                        <p className="text-[11px] text-slate-400 font-bold mt-1.5">جاري البحث وجلب التقييمات... قد يستغرق ثوانٍ</p>
                        <style>{`@keyframes reviewsLoadBar{0%{margin-inline-start:-40%}100%{margin-inline-start:100%}}`}</style>
                      </div>
                    )}
                    {reviewsLeft===1&&!reviewsFetched&&(<div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4"><p className="text-amber-700 text-xs font-bold">⚠️ هذه آخر محاولة متبقية</p></div>)}
                  </>
                ):(
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4"><p className="text-red-600 text-sm font-bold">انتهت المحاولات المتاحة</p></div>
                )}
                {fetchedReviews.length>0&&(
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-emerald-600">✓ تم جلب {fetchedReviews.length} تقييمات — اختر ٤ لعرضها</p>
                      <span className={`text-xs font-black px-2.5 py-1 rounded-full ${selectedReviewIdx.length===4?'bg-slate-900 text-white':'bg-slate-100 text-slate-500'}`}>{selectedReviewIdx.length} / 4</span>
                    </div>
                    {fetchedReviews.map((r,i)=>{
                      const isSelected=selectedReviewIdx.includes(i);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={()=>toggleReview(i)}
                          className={`w-full text-right rounded-2xl p-4 border-2 transition-all cursor-pointer ${isSelected?'border-slate-900 bg-slate-900/[0.04]':'border-slate-100 bg-slate-50 hover:border-slate-300'}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-700">{r.author}</span>
                              <div className="flex gap-0.5">{Array(r.rating).fill(0).map((_,j)=><IconStar key={j} className="w-3 h-3 text-amber-400"/>)}</div>
                            </div>
                            {isSelected&&(
                              <div className="w-5 h-5 rounded-md bg-slate-900 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-white"/>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{r.text?.slice(0,150)}{r.text?.length>150?'...':''}</p>
                        </button>
                      );
                    })}
                    <p className="text-[11px] text-slate-400 text-center">عند اختيار الخامسة سيتم استبدال الأقدم تلقائياً</p>
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-4">يمكنك تخطي هذه الخطوة</p>
              </div>
            )}

          </div>

          {/* أزرار التنقل */}
          {step>0&&step!==0.5&&(
            <div className="mt-8 pt-4 flex justify-end items-center">
              {isVenue&&step===venueSteps?(
                <button onClick={saveVenue} disabled={saving} className="px-8 py-3.5 rounded-full font-bold shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-60 bg-[#FF385C] hover:bg-[#E31C5F] text-white">
                  {saving?<><Loader2 className="w-4 h-4 animate-spin"/>جاري الحفظ...</>:<>احفظ وانشر <Check className="w-4 h-4"/></>}
                </button>
              ):!isVenue&&step===brokerSteps?(
                <button onClick={saveBroker} disabled={saving||!broker.office_name.trim()||!broker.city.trim()} className={`px-8 py-3.5 rounded-full font-bold ${BTN} shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-60`}>
                  {saving?<><Loader2 className="w-4 h-4 animate-spin"/>جاري الحفظ...</>:<>ابدأ <Check className="w-4 h-4"/></>}
                </button>
              ):step!==99?(
                <button onClick={next} disabled={!canGoNext()}
                  className={`px-8 py-3.5 rounded-full font-bold ${BTN} shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed`}>
                  متابعة <ArrowLeft className="w-4 h-4"/>
                </button>
              ):null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
