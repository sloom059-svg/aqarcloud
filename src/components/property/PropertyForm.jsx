import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import {
  ArrowRight, Loader2, MapPin, Upload, X, Sparkles,
  Home, Building, Building2, LandPlot, Store, Warehouse, Trees, Briefcase, Sprout,
  CheckCircle2, PartyPopper, Eye, Share2, Download, Tag, Layers, Maximize,
  BedDouble, Bath, Sofa, Compass, Ruler, FileText, Image as ImageIcon
} from 'lucide-react';

// ───────────────────────────────────────────
// ثوابت
// ───────────────────────────────────────────
const CITIES = ["الرياض","جدة","مكة المكرمة","المدينة المنورة","الدمام","الخبر","الطائف","تبوك","بريدة","حائل","أبها","خميس مشيط","جازان","نجران","ينبع","الجبيل","الأحساء","القطيف","الرس","عنيزة","الزلفي","المجمعة","شقراء","الدوادمي","الأفلاج","وادي الدواسر","سكاكا","القريات","عرعر","رفحاء","طريف","الوجه","أملج","ضباء","البدع","بيشة","محايل عسير","صبيا","أبو عريش","صامطة","الليث","رابغ","القنفذة","الباحة","بلجرشي","المندق","مدينة الملك عبدالله الاقتصادية"];

const AIRBNB = '#FF385C';

const FACADES = ["شمالية","جنوبية","شرقية","غربية","شمالية شرقية","شمالية غربية","جنوبية شرقية","جنوبية غربية"];

// أنواع العقارات مع الأيقونات
const PROPERTY_TYPES = [
  { id: 'أرض',        Icon: LandPlot,  desc: 'أرض سكنية أو تجارية' },
  { id: 'شقة',        Icon: Building,  desc: 'شقة سكنية' },
  { id: 'فيلا',       Icon: Home,      desc: 'فيلا أو دور' },
  { id: 'محل تجاري',  Icon: Store,     desc: 'محل أو معرض' },
  { id: 'مكتب',       Icon: Briefcase, desc: 'مكتب إداري' },
  { id: 'عمارة',      Icon: Building2, desc: 'عمارة سكنية كاملة' },
  { id: 'استراحة',    Icon: Trees,     desc: 'استراحة للإيجار' },
  { id: 'مزرعة',      Icon: Sprout,    desc: 'مزرعة أو شبه' },
  { id: 'مستودع',     Icon: Warehouse, desc: 'مستودع أو صالة' },
];

// تصنيف الأنواع
const LAND_TYPES = ['أرض'];
const UNIT_TYPES = ['شقة', 'فيلا', 'عمارة'];
const COMMERCIAL_TYPES = ['محل تجاري', 'مكتب'];
const REST_TYPES = ['استراحة', 'مزرعة'];
const WAREHOUSE_TYPES = ['مستودع'];
const SALE_ONLY_TYPES = ['أرض'];

// المميزات حسب النوع
const FEATURES_BY_TYPE = {
  default: ["مصعد","موقف سيارات","حديقة","مسبح","غرفة خادمة","مجلس","مطبخ مجهز","تكييف مركزي","شرفة","مدخل خاص","حي راقي","قريب من الخدمات","تشطيب فاخر","موقع مميز"],
  'أرض': ["مسوّرة","على شارعين","على ثلاثة شوارع","على أربعة شوارع","زاوية","قريبة من خدمات","صالحة للبناء التجاري","صالحة للبناء السكني","أرض مستوية","منطقة سكنية","منطقة تجارية","قريبة من مسجد","قريبة من مدارس","موقع مميز","فرصة استثمارية"],
  'مستودع': ["رافعة شوكية","تبريد","حارس أمن","بوابة كبيرة","كهرباء صناعية","حوش واسع","منطقة تحميل","أرضية مقواة"],
  'مكتب': ["مصعد","موقف سيارات","تكييف مركزي","قاعة اجتماعات","استقبال","مدخل خاص","مفروش","انترنت","موقع مميز","قريب من الخدمات"],
  'استراحة': ["حوش واسع","مسبح","مجلس كبير","مطبخ خارجي","مواقف متعددة","أشجار ونخيل","ملعب","ألعاب أطفال","جلسات خارجية","مشبّ / شبّة","مسطحات خضراء"],
  'مزرعة': ["بئر ماء","مسبح","مجلس","مطبخ","نخيل","أشجار مثمرة","مزروعات","حظيرة مواشي","بيت ريفي","خزان مياه","مولد كهرباء","مسطحات خضراء","جلسات خارجية","مشبّ / شبّة","سور كامل","مضخة ماء"],
  'فيلا': ["مطبخ راكب","مدخل سيارة","عداد مستقل","دور أول","دور ثاني","دور علوي","دور أرضي","ملحق علوي مع السطح","ملحق خارجي","حديقة خاصة","مسبح","مجلس","غرفة خادمة","مصعد","درج داخلي","حي راقي","قريب من الخدمات","تشطيب فاخر","موقع مميز"],
  'شقة': ["مطبخ راكب","مدخل خاص","عداد مستقل","دور أول","دور ثاني","دور أرضي","دور علوي","ملحق علوي مع السطح","مصعد","موقف سيارات","تكييف مركزي","شرفة","حي راقي","قريب من الخدمات","تشطيب فاخر","موقع مميز"],
  'محل تجاري': ["واجهة زجاجية","موقف عملاء","تكييف","إضاءة جيدة","مستودع ملحق","دورة مياه","تأسيس مطعم","موقع حيوي","قريب من الخدمات"],
  'عمارة': ["مصعد","موقف سيارات","حراسة","صيانة دورية","عدادات مستقلة","شقق مفروشة","حي راقي","موقع مميز","دخل استثماري"],
};

// خيارات الاستثمار للأرض (مناسبة لمكاتب العقار)
const LAND_INVESTMENT_FEATURES = ["مخطط معتمد","فرصة استثمارية","عائد إيجاري متوقع","قابلة للتقسيم","ترخيص تجاري","نمو عمراني بالمنطقة","قريبة من مشاريع حكومية","مناسبة لبناء عمائر","مناسبة لمجمع تجاري"];

const RENTAL_PERIODS = ["سنوي","شهري","يومي"];
const MAX_IMAGES = 10;

// ───────────────────────────────────────────
// مكوّنات مساعدة
// ───────────────────────────────────────────
function StepHeader({ step, total, onBack, title }) {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        {onBack ? (
          <button type="button" onClick={onBack} className="w-10 h-10 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-2xl transition-all flex items-center justify-center text-zinc-700">
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : <div className="w-10 h-10" />}
        <div className="flex-1 text-center">
          <h2 className="text-base font-black text-zinc-950">{title}</h2>
          <p className="text-[11px] font-bold text-zinc-400 mt-1">الخطوة {step + 1} من {total}</p>
        </div>
        <div className="w-10 h-10" />
      </div>
      <div className="flex items-center gap-1.5 px-2">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-zinc-100">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: i <= step ? '100%' : '0%', backgroundColor: AIRBNB }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// حقل إدخال موحّد
function Field({ label, icon: Icon, children, optional }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-black text-zinc-600 mb-2">
        {Icon && <Icon className="w-3.5 h-3.5" style={{ color: AIRBNB }} />}
        {label}
        {optional && <span className="text-[10px] font-bold text-zinc-400">(اختياري)</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full px-4 py-3 bg-white border border-zinc-200 rounded-2xl focus:border-[#FF385C] focus:ring-1 focus:ring-[#FF385C] outline-none transition-all text-sm font-bold shadow-sm text-zinc-800 placeholder:text-zinc-400";

// زر التالي
function NextButton({ onClick, disabled, label = "التالي" }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className="w-full mt-6 py-4 bg-zinc-950 hover:bg-black text-white rounded-2xl font-black text-base shadow-lg disabled:opacity-50 transition-all active:scale-[0.99]">
      {label}
    </button>
  );
}

// شريحة اختيار (للمميزات)
function Chip({ active, onClick, label }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-3 py-2 rounded-2xl text-sm font-black border transition-all ${active ? 'bg-[#FF385C] text-white border-[#FF385C] shadow-sm' : 'bg-white text-zinc-600 border-zinc-200 hover:border-[#FF385C]/40 hover:bg-[#FF385C]/5'}`}>
      {label}
    </button>
  );
}

// منتقي رقم
function NumberPicker({ label, icon, value, onChange, max = 10 }) {
  return (
    <Field label={label} icon={icon}>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: max }, (_, i) => i + 1).map(n => (
          <button key={n} type="button" onClick={() => onChange(value === n ? '' : n)}
            className={`w-9 h-9 rounded-2xl text-sm font-black border transition-all ${value === n ? 'bg-[#FF385C] text-white border-[#FF385C]' : 'bg-white text-zinc-600 border-zinc-200 hover:border-[#FF385C]/40 hover:bg-[#FF385C]/5'}`}>
            {n}
          </button>
        ))}
      </div>
    </Field>
  );
}

const Style = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
    body { font-family: 'Tajawal', sans-serif; }
  `}} />
);

// ───────────────────────────────────────────
// المكوّن الرئيسي
// ───────────────────────────────────────────
const DRAFT_KEY = 'add-property-draft';

export default function PropertyForm({ initialData, onSubmit, isLoading, successData, onReset }) {
  const { user } = useAuth();
  const isEdit = !!initialData;

  // تحميل المسودة من sessionStorage (فقط لصفحة إضافة جديدة)
  const savedDraft = !isEdit ? (() => {
    try { const s = sessionStorage.getItem(DRAFT_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
  })() : null;

  const [step, setStep] = useState(() => {
    if (isEdit) return 1;
    return savedDraft?.step || 0;
  });
  const [uploading, setUploading] = useState(false);
  const [customFeature, setCustomFeature] = useState('');
  const [fetchingPlaces, setFetchingPlaces] = useState(false);
  const [placesError, setPlacesError] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', type: '', listing_type: '',
    price: '', price_negotiable: false, price_on_request: false,
    area: '', rental_period: '', street_width: '', facade: '',
    has_lengths: false, length_street: '', length_depth: '',
    bedrooms: '', bathrooms: '', halls: '', floor: '', property_age: '',
    has_plot_info: false, plot_number: '', parcel_number: '',
    city: '', neighborhood: '', maps_url: '', nearby_places: [],
    images: [], features: [], status: 'نشط',
    ...initialData,
    ...(savedDraft?.form || {}),
  });

  // حفظ المسودة تلقائياً عند كل تغيير (للتنقّل)
  useEffect(() => {
    if (!isEdit) {
      try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ form, step })); } catch {}
    }
  }, [form, step]);

  useEffect(() => {
    if (!form.city && user?.city) setForm(prev => ({ ...prev, city: user.city }));
  }, [user?.city]);

  // تصنيف النوع الحالي
  const isLand = LAND_TYPES.includes(form.type);
  const isUnit = UNIT_TYPES.includes(form.type);
  const isCommercial = COMMERCIAL_TYPES.includes(form.type);
  const isRest = REST_TYPES.includes(form.type);
  const isWarehouse = WAREHOUSE_TYPES.includes(form.type);
  const isSaleOnly = SALE_ONLY_TYPES.includes(form.type);
  const baseFeatures = FEATURES_BY_TYPE[form.type] || FEATURES_BY_TYPE.default;
  const availableFeatures = (form.type === 'أرض' && form.listing_type === 'استثمار')
    ? [...baseFeatures, ...LAND_INVESTMENT_FEATURES]
    : baseFeatures;

  const handleChange = (field, value) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'type') {
        if (SALE_ONLY_TYPES.includes(value)) updated.listing_type = 'بيع';
        const newFeatures = FEATURES_BY_TYPE[value] || FEATURES_BY_TYPE.default;
        updated.features = (prev.features || []).filter(f => newFeatures.includes(f));
      }
    return updated;
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const remaining = MAX_IMAGES - form.images.length;
    if (remaining <= 0) return;
    setUploading(true);
    const newImages = [...form.images];
    for (const file of files.slice(0, remaining)) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        newImages.push(file_url);
      } catch (_) {}
    }
    setForm(prev => ({ ...prev, images: newImages }));
    setUploading(false);
  };

  const removeImage = async (index) => {
    const url = form.images[index];
    try { if (url?.startsWith('http')) await base44.integrations.Core.DeleteFile(url); } catch (_) {}
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const toggleFeature = (feature) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(feature) ? prev.features.filter(f => f !== feature) : [...prev.features, feature]
    }));
  };

  // إضافة ميزة مخصّصة كتبها المستخدم
  const addCustomFeature = () => {
    const val = customFeature.trim();
    if (!val) return;
    if (!form.features.includes(val)) {
      setForm(prev => ({ ...prev, features: [...prev.features, val] }));
    }
    setCustomFeature('');
  };

  const fetchNearbyPlaces = async () => {
    if (!form.maps_url) return;
    setFetchingPlaces(true);
    setPlacesError('');
    try {
      const res = await fetch('/api/getNearbyPlaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maps_url: form.maps_url }),
      });
      const data = await res.json();
      if (data?.places?.length) {
        setForm(prev => ({ ...prev, nearby_places: data.places }));
      } else {
        setPlacesError(data?.error || 'لم يتم العثور على أماكن قريبة، جرّب رابطاً مختلفاً');
      }
    } catch (_) {
      setPlacesError('تعذر جلب الأماكن القريبة');
    }
    setFetchingPlaces(false);
  };

  const submit = () => {
    try { sessionStorage.removeItem(DRAFT_KEY); } catch {}
    const data = {
      ...form,
      price: form.price_negotiable ? undefined : (form.price ? Number(form.price) : undefined),
      area: form.area ? Number(form.area) : undefined,
      rental_period: form.listing_type === 'إيجار' ? (form.rental_period || undefined) : undefined,
      street_width: form.street_width ? Number(form.street_width) : undefined,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      halls: form.halls ? Number(form.halls) : undefined,
      property_age: form.property_age ? Number(form.property_age) : undefined,
      length_street: form.has_lengths && form.length_street ? Number(form.length_street) : undefined,
      length_depth: form.has_lengths && form.length_depth ? Number(form.length_depth) : undefined,
      plot_number: form.has_plot_info ? form.plot_number : undefined,
      parcel_number: form.has_plot_info ? form.parcel_number : undefined,
    };
    // استبعاد حقول النظام حتى لا تُرسل ضمن قيم التحديث (تسبب فشل/تجاهل الحفظ)
    ['id', 'created_date', 'updated_date', 'created_at', 'updated_at', 'created_by', 'created_by_id', 'owner_id'].forEach(k => delete data[k]);
    onSubmit(data);
  };

  // ───────── الخطوات حسب النوع ─────────
  // 0: النوع | 1: الأساسيات | 2: التفاصيل | 3: الموقع والخدمات | 4: المميزات | 5: الصور والسعر
  const TOTAL_STEPS = 6;

  // ════════ شاشة النجاح ════════
  if (successData) {
    const url = successData.url || '';
    return (
      <div className="text-center py-6">
        <Style />
        <div className="relative mb-6 inline-block">
          <div className="absolute inset-0 bg-[#FF385C] rounded-full blur-2xl opacity-20 animate-pulse" />
          <div className="w-24 h-24 bg-[#FF385C] rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-white mx-auto">
            <PartyPopper className="w-11 h-11 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-[#FF385C] mb-2">تم إضافة العقار بنجاح</h1>
        <p className="text-zinc-500 text-sm mb-8 max-w-[280px] mx-auto leading-relaxed">
          تم نشر <span className="font-bold text-[#FF385C]">{successData.title || 'عقارك'}</span> في صفحتك. يمكنك مشاركته مع عملائك الآن.
        </p>
        <div className="w-full space-y-3 max-w-sm mx-auto">
          {url && (
            <button onClick={() => window.open(url, '_blank')}
              className="w-full py-4 bg-[#FF385C] hover:bg-[#E31C5F] text-white rounded-2xl font-bold text-sm shadow-xl shadow-zinc-950/20 transition-all flex items-center justify-center gap-2">
              <Eye className="w-5 h-5" /> مشاهدة صفحة العقار
            </button>
          )}
          <button onClick={() => { if (url) navigator.clipboard.writeText(url); }}
            className="w-full py-4 bg-white border border-zinc-200 hover:border-[#FF385C] hover:text-[#FF385C] text-zinc-700 rounded-2xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" /> نسخ رابط العقار
          </button>
          {successData.onDownloadCard && (
            <button onClick={successData.onDownloadCard}
              className="w-full py-4 bg-white border border-zinc-200 hover:border-[#FF385C] hover:text-[#FF385C] text-zinc-700 rounded-2xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2">
              <Download className="w-5 h-5" /> تنزيل بطاقة النشر
            </button>
          )}
          {onReset && (
            <button onClick={() => { try { sessionStorage.removeItem(DRAFT_KEY); } catch {} onReset(); }}
              className="w-full py-3 text-zinc-400 hover:text-[#FF385C] rounded-2xl font-bold text-sm transition-all">
              إضافة عقار آخر
            </button>
          )}
        </div>
      </div>
    );
  }

  // ════════ خطوة 0: اختيار النوع ════════
  if (step === 0) {
    return (
      <div>
        <Style />
        <div className="mb-5">
          <h2 className="text-xl font-bold text-[#FF385C] mb-1">نوع العقار</h2>
          <p className="text-zinc-500 text-xs">اختر نوع العقار الذي تريد إضافته</p>
        </div>
        <div className="space-y-2.5">
          {PROPERTY_TYPES.map(t => (
            <button key={t.id} type="button"
              onClick={() => { handleChange('type', t.id); setStep(1); }}
              className={`w-full relative p-4 rounded-2xl border-2 text-right transition-all flex items-center gap-4 shadow-sm
                ${form.type === t.id ? 'border-[#FF385C] bg-[#FF385C]/5' : 'border-zinc-100 bg-white hover:border-[#FF385C]/40 hover:bg-zinc-50'}`}>
              <div className={`p-2.5 rounded-xl ${form.type === t.id ? 'bg-[#FF385C] text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                <t.Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-base ${form.type === t.id ? 'text-[#FF385C]' : 'text-zinc-700'}`}>{t.id}</h3>
                <p className="text-xs text-zinc-500">{t.desc}</p>
              </div>
              {form.type === t.id && <CheckCircle2 className="w-5 h-5 text-[#FF385C]" />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ════════ خطوة 1: الأساسيات ════════
  if (step === 1) {
    const canNext = form.title && form.listing_type && form.city;
    return (
      <div>
        <Style />
        <StepHeader step={1} total={TOTAL_STEPS} onBack={() => isEdit ? null : setStep(0)} title={`إضافة ${form.type}`} />
        <div className="space-y-4">
          <div className="mb-1">
            <h2 className="text-lg font-bold text-[#FF385C]">المعلومات الأساسية</h2>
          </div>

          <Field label="عنوان العقار" icon={Tag}>
            <input value={form.title} onChange={e => handleChange('title', e.target.value)}
              placeholder={`مثال: ${form.type} في حي الحمراء`} className={inputClass} />
          </Field>

          {!isSaleOnly ? (
            <Field label="نوع العرض" icon={Layers}>
              <div className="flex gap-2">
                {['بيع', 'إيجار'].map(lt => (
                  <button key={lt} type="button" onClick={() => handleChange('listing_type', lt)}
                    className={`flex-1 py-3 rounded-2xl text-sm font-bold border transition-all ${form.listing_type === lt ? 'bg-[#FF385C] text-white border-[#FF385C]' : 'bg-white text-zinc-600 border-zinc-200 hover:border-[#FF385C]/40'}`}>
                    {lt}
                  </button>
                ))}
              </div>
            </Field>
          ) : (
            <Field label="نوع العرض" icon={Layers}>
              <div className="flex gap-2">
                {['بيع', 'استثمار'].map(lt => (
                  <button key={lt} type="button" onClick={() => handleChange('listing_type', lt)}
                    className={`flex-1 py-3 rounded-2xl text-sm font-bold border transition-all ${form.listing_type === lt ? 'bg-[#FF385C] text-white border-[#FF385C]' : 'bg-white text-zinc-600 border-zinc-200 hover:border-[#FF385C]/40'}`}>
                    {lt}
                  </button>
                ))}
              </div>
            </Field>
          )}

          {form.listing_type === 'إيجار' && (
            <Field label="مدة الإيجار" icon={Layers}>
              <div className="flex gap-2">
                {RENTAL_PERIODS.map(rp => (
                  <button key={rp} type="button" onClick={() => handleChange('rental_period', rp)}
                    className={`flex-1 py-3 rounded-2xl text-sm font-bold border transition-all ${form.rental_period === rp ? 'bg-[#FF385C] text-white border-[#FF385C]' : 'bg-white text-zinc-600 border-zinc-200 hover:border-[#FF385C]/40'}`}>
                    {rp}
                  </button>
                ))}
              </div>
            </Field>
          )}

          <Field label="المدينة" icon={MapPin}>
            <input
              list="cities-list"
              value={form.city}
              onChange={e => handleChange('city', e.target.value)}
              placeholder="اكتب اسم المدينة"
              className={inputClass}
            />
            <datalist id="cities-list">
              {CITIES.map(c => <option key={c} value={c} />)}
            </datalist>
          </Field>

          <Field label="الحي" icon={MapPin} optional>
            <input value={form.neighborhood} onChange={e => handleChange('neighborhood', e.target.value)}
              placeholder="مثال: حي الياسمين" className={inputClass} />
          </Field>

          <NextButton onClick={() => setStep(2)} disabled={!canNext} />
        </div>
      </div>
    );
  }

  // ════════ خطوة 2: التفاصيل (ذكية حسب النوع) ════════
  if (step === 2) {
    return (
      <div>
        <Style />
        <StepHeader step={2} total={TOTAL_STEPS} onBack={() => setStep(1)} title={`تفاصيل ${form.type}`} />
        <div className="space-y-4">
          <div className="mb-1"><h2 className="text-lg font-bold text-[#FF385C]">تفاصيل العقار</h2></div>

          {/* المساحة - للجميع ماعدا لا أحد، الكل يحتاج مساحة */}
          <Field label="المساحة (م²)" icon={Maximize} optional={isUnit || isRest}>
            <input type="number" dir="ltr" value={form.area} onChange={e => handleChange('area', e.target.value)}
              placeholder="مثال: 500" className={inputClass} />
          </Field>

          {/* الأرض: عرض الشارع + الواجهة */}
          {isLand && (
            <>
              <Field label="عرض الشارع (م)" icon={Ruler} optional>
                <input type="number" dir="ltr" value={form.street_width} onChange={e => handleChange('street_width', e.target.value)}
                  placeholder="مثال: 20" className={inputClass} />
              </Field>
              <Field label="الواجهة" icon={Compass} optional>
                <select value={form.facade} onChange={e => handleChange('facade', e.target.value)} className={inputClass}>
                  <option value="">اختر الواجهة</option>
                  {FACADES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>

              {/* الأطوال اختياري */}
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-2xl border border-zinc-200 bg-white hover:border-[#FF385C]/40 transition-colors">
                <input type="checkbox" checked={form.has_lengths} onChange={e => handleChange('has_lengths', e.target.checked)} className="w-4 h-4 accent-[#FF385C]" />
                <span className="text-sm font-bold text-zinc-600">إضافة الأطوال</span>
                <span className="text-[10px] font-medium text-zinc-400">(اختياري)</span>
              </label>
              {form.has_lengths && (
                <div className="grid grid-cols-2 gap-3 pr-2 border-r-2 border-[#FF385C]/10">
                  <Field label="على الشارع (م)">
                    <input type="number" dir="ltr" value={form.length_street} onChange={e => handleChange('length_street', e.target.value)} placeholder="25" className={inputClass} />
                  </Field>
                  <Field label="العمق / داخل (م)">
                    <input type="number" dir="ltr" value={form.length_depth} onChange={e => handleChange('length_depth', e.target.value)} placeholder="40" className={inputClass} />
                  </Field>
                </div>
              )}

              {/* رقم المخطط والقطعة اختياري */}
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-2xl border border-zinc-200 bg-white hover:border-[#FF385C]/40 transition-colors">
                <input type="checkbox" checked={form.has_plot_info} onChange={e => handleChange('has_plot_info', e.target.checked)} className="w-4 h-4 accent-[#FF385C]" />
                <span className="text-sm font-bold text-zinc-600">رقم المخطط والقطعة</span>
                <span className="text-[10px] font-medium text-zinc-400">(اختياري)</span>
              </label>
              {form.has_plot_info && (
                <div className="grid grid-cols-2 gap-3 pr-2 border-r-2 border-[#FF385C]/10">
                  <Field label="رقم المخطط">
                    <input value={form.plot_number} onChange={e => handleChange('plot_number', e.target.value)} placeholder="1234" className={inputClass} />
                  </Field>
                  <Field label="رقم القطعة">
                    <input value={form.parcel_number} onChange={e => handleChange('parcel_number', e.target.value)} placeholder="56" className={inputClass} />
                  </Field>
                </div>
              )}
            </>
          )}

          {/* الوحدات السكنية: غرف، دورات، صالات، عمر */}
          {isUnit && (
            <>
              <NumberPicker label="غرف النوم" icon={BedDouble} value={form.bedrooms} onChange={v => handleChange('bedrooms', v)} max={8} />
              <NumberPicker label="دورات المياه" icon={Bath} value={form.bathrooms} onChange={v => handleChange('bathrooms', v)} max={8} />
              <NumberPicker label="الصالات" icon={Sofa} value={form.halls} onChange={v => handleChange('halls', v)} max={6} />
              <Field label="عمر العقار (سنوات)" icon={Ruler} optional>
                <input type="number" dir="ltr" value={form.property_age} onChange={e => handleChange('property_age', e.target.value)} placeholder="0" className={inputClass} />
              </Field>
            </>
          )}

          {/* التجاري: الواجهة + دورات مياه */}
          {isCommercial && (
            <>
              <Field label="الواجهة" icon={Compass} optional>
                <select value={form.facade} onChange={e => handleChange('facade', e.target.value)} className={inputClass}>
                  <option value="">اختر الواجهة</option>
                  {FACADES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>
              <NumberPicker label="دورات المياه" icon={Bath} value={form.bathrooms} onChange={v => handleChange('bathrooms', v)} max={6} />
            </>
          )}

          {/* الاستراحة: المجالس وغرف */}
          {isRest && (
            <>
              <NumberPicker label="غرف النوم" icon={BedDouble} value={form.bedrooms} onChange={v => handleChange('bedrooms', v)} max={8} />
              <NumberPicker label="دورات المياه" icon={Bath} value={form.bathrooms} onChange={v => handleChange('bathrooms', v)} max={8} />
            </>
          )}

          <NextButton onClick={() => setStep(3)} />
        </div>
      </div>
    );
  }

  // ════════ خطوة 3: الموقع والخدمات القريبة ════════
  if (step === 3) {
    return (
      <div>
        <Style />
        <StepHeader step={3} total={TOTAL_STEPS} onBack={() => setStep(2)} title="الموقع" />
        <div className="space-y-4">
          <div className="mb-1"><h2 className="text-lg font-bold text-[#FF385C]">الموقع والخدمات</h2></div>

          <Field label="رابط الموقع (Google Maps)" icon={MapPin} optional>
            <input dir="ltr" value={form.maps_url} onChange={e => handleChange('maps_url', e.target.value)}
              placeholder="https://maps.google.com/..." className={inputClass} />
          </Field>

          <NextButton onClick={() => setStep(4)} />
        </div>
      </div>
    );
  }

  // ════════ خطوة 4: المميزات ════════
  if (step === 4) {
    return (
      <div>
        <Style />
        <StepHeader step={4} total={TOTAL_STEPS} onBack={() => setStep(3)} title="المميزات" />
        <div className="space-y-4">
          <div className="mb-1">
            <h2 className="text-lg font-bold text-[#FF385C]">مميزات العقار</h2>
            <p className="text-zinc-500 text-xs">اختر ما ينطبق على عقارك</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableFeatures.map(f => (
              <Chip key={f} active={form.features.includes(f)} onClick={() => toggleFeature(f)} label={f} />
            ))}
            {/* المميزات المخصّصة التي أضافها المستخدم (غير الموجودة في القائمة) */}
            {form.features.filter(f => !availableFeatures.includes(f)).map(f => (
              <Chip key={f} active={true} onClick={() => toggleFeature(f)} label={f} />
            ))}
          </div>

          {/* إضافة ميزة مخصّصة */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-2">مميزات إضافية (اكتب أي ميزة غير موجودة)</label>
            <div className="flex gap-2">
              <input
                value={customFeature}
                onChange={e => setCustomFeature(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomFeature(); } }}
                placeholder="مثال: بئر ارتوازي، غرفة حارس..."
                className={inputClass + ' flex-1'}
              />
              <button
                type="button"
                onClick={addCustomFeature}
                disabled={!customFeature.trim()}
                className="shrink-0 px-5 rounded-2xl bg-zinc-950 text-white text-sm font-black transition-all hover:bg-black disabled:opacity-40"
              >
                إضافة
              </button>
            </div>
          </div>

          <Field label="وصف إضافي" icon={FileText} optional>
            <textarea value={form.description} onChange={e => handleChange('description', e.target.value)}
              placeholder="اكتب وصفاً جذاباً للعقار..." rows={3}
              className={inputClass + ' resize-none'} />
          </Field>

          <NextButton onClick={() => setStep(5)} />
        </div>
      </div>
    );
  }

  // ════════ خطوة 5: الصور والسعر ════════
  if (step === 5) {
    const canSubmit = form.images.length > 0 && (form.price_negotiable || form.price);
    return (
      <div>
        <Style />
        <StepHeader step={5} total={TOTAL_STEPS} onBack={() => setStep(4)} title="الصور والسعر" />
        <div className="space-y-5">
          <div className="mb-1"><h2 className="text-lg font-bold text-[#FF385C]">الصور والسعر</h2></div>

          {/* الصور */}
          <Field label="صور العقار" icon={ImageIcon}>
            <div className="grid grid-cols-3 gap-2">
              {form.images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-200 shadow-sm">
                  <img src={img} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute top-1 left-1 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {form.images.length < MAX_IMAGES && (
                <label className="aspect-square rounded-2xl border-2 border-dashed border-[#FF385C]/30 bg-[#FF385C]/5 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF385C]/50 hover:bg-[#FF385C]/10 transition">
                  {uploading ? <Loader2 className="w-6 h-6 animate-spin text-[#FF385C]" /> : <><Upload className="w-5 h-5 text-[#FF385C]" /><span className="text-xs text-[#FF385C] mt-1 font-medium">إضافة</span></>}
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              )}
            </div>
          </Field>

          {/* السعر */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 mb-2">
              <Tag className="w-3.5 h-3.5 text-[#FF385C]" /> السعر
            </label>

            {!form.price_negotiable && (
              <input type="number" dir="ltr" value={form.price} onChange={e => handleChange('price', e.target.value)}
                placeholder="مثال: 500000" className={inputClass} />
            )}

            {form.listing_type !== 'إيجار' && (
              <div className="flex gap-2 mt-2">
                <button type="button"
                  onClick={() => { handleChange('price_negotiable', !form.price_negotiable); if (!form.price_negotiable) handleChange('price', ''); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${form.price_negotiable ? 'bg-[#FF385C] text-white border-[#FF385C]' : 'bg-white text-zinc-600 border-zinc-200 hover:border-[#FF385C]/40'}`}>
                  على السوم
                </button>
              </div>
            )}

            {form.price && !form.price_negotiable && (
              <p className="text-sm font-bold text-[#FF385C] bg-[#FF385C]/5 rounded-xl px-3 py-2 mt-2">
                {Number(form.price).toLocaleString('en-US')} ر.س
              </p>
            )}
          </div>

          <button type="button" onClick={submit} disabled={!canSubmit || isLoading}
            className="w-full mt-4 py-4 bg-zinc-950 text-white rounded-2xl font-black text-base shadow-lg shadow-zinc-950/10 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
            {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" />جاري النشر...</> : <><CheckCircle2 className="w-5 h-5" />{isEdit ? 'حفظ التعديلات' : 'نشر العقار'}</>}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
