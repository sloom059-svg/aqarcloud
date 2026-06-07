import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import {
  ArrowRight, Loader2, MapPin, Upload, X, Sparkles,
  Home, Building, Building2, LandPlot, Store, Warehouse, Trees, Briefcase,
  CheckCircle2, PartyPopper, Eye, Share2, Download, Tag, Layers, Maximize,
  BedDouble, Bath, Sofa, Compass, Ruler, FileText, Image as ImageIcon
} from 'lucide-react';

// ───────────────────────────────────────────
// ثوابت
// ───────────────────────────────────────────
const CITIES = ["الرياض","جدة","مكة المكرمة","المدينة المنورة","الدمام","الخبر","الطائف","تبوك","بريدة","حائل","أبها","خميس مشيط","جازان","نجران","ينبع","الجبيل","الأحساء","القطيف","الرس","عنيزة","الزلفي","المجمعة","شقراء","الدوادمي","الأفلاج","وادي الدواسر","سكاكا","القريات","عرعر","رفحاء","طريف","الوجه","أملج","ضباء","البدع","بيشة","محايل عسير","صبيا","أبو عريش","صامطة","الليث","رابغ","القنفذة","الباحة","بلجرشي","المندق","مدينة الملك عبدالله الاقتصادية"];

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
  { id: 'مستودع',     Icon: Warehouse, desc: 'مستودع أو صالة' },
];

// تصنيف الأنواع
const LAND_TYPES = ['أرض'];
const UNIT_TYPES = ['شقة', 'فيلا', 'عمارة'];
const COMMERCIAL_TYPES = ['محل تجاري', 'مكتب'];
const REST_TYPES = ['استراحة'];
const WAREHOUSE_TYPES = ['مستودع'];
const SALE_ONLY_TYPES = ['أرض'];

// المميزات حسب النوع
const FEATURES_BY_TYPE = {
  default: ["مصعد","موقف سيارات","حديقة","مسبح","غرفة خادمة","مجلس","مطبخ مجهز","تكييف مركزي","شرفة","مدخل خاص"],
  'أرض': ["مسوّرة","على شارعين","على ثلاثة شوارع","على أربعة شوارع","زاوية","قريبة من خدمات","صالحة للبناء التجاري","صالحة للبناء السكني","أرض مستوية"],
  'مستودع': ["رافعة شوكية","تبريد","حارس أمن","بوابة كبيرة","كهرباء صناعية","حوش واسع","منطقة تحميل","أرضية مقواة"],
  'مكتب': ["مصعد","موقف سيارات","تكييف مركزي","قاعة اجتماعات","استقبال","مدخل خاص","مفروش","انترنت"],
  'استراحة': ["حوش واسع","مسبح","مجلس كبير","مطبخ خارجي","مواقف متعددة","أشجار ونخيل","ملعب"],
  'فيلا': ["مطبخ راكب","مدخل سيارة","عداد مستقل","دور علوي","دور أرضي","ملحق علوي","ملحق خارجي","حديقة خاصة","مسبح","مجلس","غرفة خادمة","مصعد"],
  'شقة': ["مطبخ راكب","مدخل خاص","عداد مستقل","دور أرضي","دور علوي","مصعد","موقف سيارات","تكييف مركزي","شرفة"],
  'محل تجاري': ["واجهة زجاجية","موقف عملاء","تكييف","إضاءة جيدة","مستودع ملحق","دورة مياه","تأسيس مطعم"],
  'عمارة': ["مصعد","موقف سيارات","حراسة","صيانة دورية","عدادات مستقلة","شقق مفروشة"],
};

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
          <button type="button" onClick={onBack} className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center justify-center text-slate-600">
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : <div className="w-9 h-9" />}
        <h2 className="flex-1 text-center text-base font-bold text-[#15317E]">{title}</h2>
        <div className="w-9 h-9" />
      </div>
      <div className="flex items-center gap-1.5 px-2">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
            <div className="h-full rounded-full bg-[#15317E] transition-all duration-500" style={{ width: i < step ? '100%' : '0%' }} />
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
      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-[#15317E]" />}
        {label}
        {optional && <span className="text-[10px] font-medium text-slate-400">(اختياري)</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-[#15317E] focus:ring-1 focus:ring-[#15317E] outline-none transition-all text-sm font-medium shadow-sm";

// زر التالي
function NextButton({ onClick, disabled, label = "التالي" }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className="w-full mt-6 py-4 bg-[#15317E] text-white rounded-2xl font-bold text-base shadow-lg shadow-[#15317E]/20 disabled:opacity-50 transition-all">
      {label}
    </button>
  );
}

// شريحة اختيار (للمميزات)
function Chip({ active, onClick, label }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-3 py-2 rounded-xl text-sm font-bold border transition-all ${active ? 'bg-[#15317E] text-white border-[#15317E] shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-[#15317E]/40'}`}>
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
            className={`w-9 h-9 rounded-xl text-sm font-bold border transition-all ${value === n ? 'bg-[#15317E] text-white border-[#15317E]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#15317E]/40'}`}>
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
export default function PropertyForm({ initialData, onSubmit, isLoading, successData, onReset }) {
  const { user } = useAuth();
  const isEdit = !!initialData;

  const [step, setStep] = useState(isEdit ? 1 : 0);
  const [uploading, setUploading] = useState(false);
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
  });

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
  const availableFeatures = FEATURES_BY_TYPE[form.type] || FEATURES_BY_TYPE.default;

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

  const fetchNearbyPlaces = async () => {
    if (!form.maps_url) return;
    setFetchingPlaces(true);
    setPlacesError('');
    try {
      const res = await base44.functions.invoke('getNearbyPlaces', { maps_url: form.maps_url });
      if (res.data?.places) {
        setForm(prev => ({ ...prev, nearby_places: res.data.places }));
      } else {
        setPlacesError(res.data?.error || 'تعذر جلب الأماكن القريبة');
      }
    } catch (_) {
      setPlacesError('تعذر جلب الأماكن القريبة');
    }
    setFetchingPlaces(false);
  };

  const submit = () => {
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
          <div className="absolute inset-0 bg-[#15317E] rounded-full blur-2xl opacity-20 animate-pulse" />
          <div className="w-24 h-24 bg-[#15317E] rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-white mx-auto">
            <PartyPopper className="w-11 h-11 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-[#15317E] mb-2">تم إضافة العقار بنجاح</h1>
        <p className="text-slate-500 text-sm mb-8 max-w-[280px] mx-auto leading-relaxed">
          تم نشر <span className="font-bold text-[#15317E]">{successData.title || 'عقارك'}</span> في صفحتك. يمكنك مشاركته مع عملائك الآن.
        </p>
        <div className="w-full space-y-3 max-w-sm mx-auto">
          {url && (
            <button onClick={() => window.open(url, '_blank')}
              className="w-full py-4 bg-[#15317E] hover:bg-[#0d1e4c] text-white rounded-2xl font-bold text-sm shadow-xl shadow-[#15317E]/30 transition-all flex items-center justify-center gap-2">
              <Eye className="w-5 h-5" /> مشاهدة صفحة العقار
            </button>
          )}
          <button onClick={() => { if (url) navigator.clipboard.writeText(url); }}
            className="w-full py-4 bg-white border border-slate-200 hover:border-[#15317E] hover:text-[#15317E] text-slate-700 rounded-2xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" /> نسخ رابط العقار
          </button>
          {successData.onDownloadCard && (
            <button onClick={successData.onDownloadCard}
              className="w-full py-4 bg-white border border-slate-200 hover:border-[#15317E] hover:text-[#15317E] text-slate-700 rounded-2xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2">
              <Download className="w-5 h-5" /> تنزيل بطاقة النشر
            </button>
          )}
          {onReset && (
            <button onClick={onReset}
              className="w-full py-3 text-slate-400 hover:text-[#15317E] rounded-2xl font-bold text-sm transition-all">
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
          <h2 className="text-xl font-bold text-[#15317E] mb-1">نوع العقار</h2>
          <p className="text-slate-500 text-xs">اختر نوع العقار الذي تريد إضافته</p>
        </div>
        <div className="space-y-2.5">
          {PROPERTY_TYPES.map(t => (
            <button key={t.id} type="button"
              onClick={() => { handleChange('type', t.id); setStep(1); }}
              className={`w-full relative p-4 rounded-2xl border-2 text-right transition-all flex items-center gap-4 shadow-sm
                ${form.type === t.id ? 'border-[#15317E] bg-[#15317E]/5' : 'border-slate-100 bg-white hover:border-[#15317E]/40 hover:bg-slate-50'}`}>
              <div className={`p-2.5 rounded-xl ${form.type === t.id ? 'bg-[#15317E] text-white' : 'bg-slate-100 text-slate-500'}`}>
                <t.Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-base ${form.type === t.id ? 'text-[#15317E]' : 'text-slate-700'}`}>{t.id}</h3>
                <p className="text-xs text-slate-500">{t.desc}</p>
              </div>
              {form.type === t.id && <CheckCircle2 className="w-5 h-5 text-[#15317E]" />}
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
            <h2 className="text-lg font-bold text-[#15317E]">المعلومات الأساسية</h2>
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
                    className={`flex-1 py-3 rounded-2xl text-sm font-bold border transition-all ${form.listing_type === lt ? 'bg-[#15317E] text-white border-[#15317E]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#15317E]/40'}`}>
                    {lt}
                  </button>
                ))}
              </div>
            </Field>
          ) : (
            <div className="bg-[#15317E]/5 border border-[#15317E]/10 rounded-2xl px-4 py-3 text-sm font-bold text-[#15317E] flex items-center gap-2">
              <Tag className="w-4 h-4" /> الأرض للبيع فقط
            </div>
          )}

          {form.listing_type === 'إيجار' && (
            <Field label="مدة الإيجار" icon={Layers}>
              <div className="flex gap-2">
                {RENTAL_PERIODS.map(rp => (
                  <button key={rp} type="button" onClick={() => handleChange('rental_period', rp)}
                    className={`flex-1 py-3 rounded-2xl text-sm font-bold border transition-all ${form.rental_period === rp ? 'bg-[#15317E] text-white border-[#15317E]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#15317E]/40'}`}>
                    {rp}
                  </button>
                ))}
              </div>
            </Field>
          )}

          <Field label="المدينة" icon={MapPin}>
            <select value={form.city} onChange={e => handleChange('city', e.target.value)} className={inputClass}>
              <option value="">اختر المدينة</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
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
          <div className="mb-1"><h2 className="text-lg font-bold text-[#15317E]">تفاصيل العقار</h2></div>

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
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-2xl border border-slate-200 bg-white hover:border-[#15317E]/40 transition-colors">
                <input type="checkbox" checked={form.has_lengths} onChange={e => handleChange('has_lengths', e.target.checked)} className="w-4 h-4 accent-[#15317E]" />
                <span className="text-sm font-bold text-slate-600">إضافة الأطوال</span>
                <span className="text-[10px] font-medium text-slate-400">(اختياري)</span>
              </label>
              {form.has_lengths && (
                <div className="grid grid-cols-2 gap-3 pr-2 border-r-2 border-[#15317E]/10">
                  <Field label="على الشارع (م)">
                    <input type="number" dir="ltr" value={form.length_street} onChange={e => handleChange('length_street', e.target.value)} placeholder="25" className={inputClass} />
                  </Field>
                  <Field label="العمق / داخل (م)">
                    <input type="number" dir="ltr" value={form.length_depth} onChange={e => handleChange('length_depth', e.target.value)} placeholder="40" className={inputClass} />
                  </Field>
                </div>
              )}

              {/* رقم المخطط والقطعة اختياري */}
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-2xl border border-slate-200 bg-white hover:border-[#15317E]/40 transition-colors">
                <input type="checkbox" checked={form.has_plot_info} onChange={e => handleChange('has_plot_info', e.target.checked)} className="w-4 h-4 accent-[#15317E]" />
                <span className="text-sm font-bold text-slate-600">رقم المخطط والقطعة</span>
                <span className="text-[10px] font-medium text-slate-400">(اختياري)</span>
              </label>
              {form.has_plot_info && (
                <div className="grid grid-cols-2 gap-3 pr-2 border-r-2 border-[#15317E]/10">
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
          <div className="mb-1"><h2 className="text-lg font-bold text-[#15317E]">الموقع والخدمات</h2></div>

          <Field label="رابط الموقع (Google Maps)" icon={MapPin} optional>
            <div className="flex gap-2">
              <input dir="ltr" value={form.maps_url} onChange={e => handleChange('maps_url', e.target.value)}
                placeholder="https://maps.google.com/..." className={inputClass + ' flex-1'} />
              <button type="button" onClick={fetchNearbyPlaces} disabled={!form.maps_url || fetchingPlaces}
                className="px-4 bg-[#15317E] text-white rounded-2xl font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-all whitespace-nowrap shadow-sm shadow-[#15317E]/20">
                {fetchingPlaces ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                سحب
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> جلب الخدمات القريبة بالذكاء الاصطناعي
            </p>
          </Field>

          {placesError && <p className="text-xs text-rose-500 font-medium">{placesError}</p>}

          {form.nearby_places?.length > 0 && (
            <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm">
              <p className="text-xs font-bold text-[#15317E] mb-2">الخدمات القريبة:</p>
              <div className="flex flex-wrap gap-2">
                {form.nearby_places.map((p, i) => (
                  <span key={i} className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-600">
                    <MapPin className="w-3 h-3 text-[#15317E]" /> {p.label} · {p.distance_label}
                  </span>
                ))}
              </div>
            </div>
          )}

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
            <h2 className="text-lg font-bold text-[#15317E]">مميزات العقار</h2>
            <p className="text-slate-500 text-xs">اختر ما ينطبق على عقارك</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableFeatures.map(f => (
              <Chip key={f} active={form.features.includes(f)} onClick={() => toggleFeature(f)} label={f} />
            ))}
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
          <div className="mb-1"><h2 className="text-lg font-bold text-[#15317E]">الصور والسعر</h2></div>

          {/* الصور */}
          <Field label="صور العقار" icon={ImageIcon}>
            <div className="grid grid-cols-3 gap-2">
              {form.images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                  <img src={img} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute top-1 left-1 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {form.images.length < MAX_IMAGES && (
                <label className="aspect-square rounded-2xl border-2 border-dashed border-[#15317E]/30 bg-[#15317E]/5 flex flex-col items-center justify-center cursor-pointer hover:border-[#15317E]/50 hover:bg-[#15317E]/10 transition">
                  {uploading ? <Loader2 className="w-6 h-6 animate-spin text-[#15317E]" /> : <><Upload className="w-5 h-5 text-[#15317E]" /><span className="text-xs text-[#15317E] mt-1 font-medium">إضافة</span></>}
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              )}
            </div>
          </Field>

          {/* السعر */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2">
              <Tag className="w-3.5 h-3.5 text-[#15317E]" /> السعر
            </label>

            {!form.price_negotiable && (
              <input type="number" dir="ltr" value={form.price} onChange={e => handleChange('price', e.target.value)}
                placeholder="مثال: 500000" className={inputClass} />
            )}

            {form.listing_type !== 'إيجار' && (
              <div className="flex gap-2 mt-2">
                <button type="button"
                  onClick={() => { handleChange('price_negotiable', !form.price_negotiable); if (!form.price_negotiable) handleChange('price', ''); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${form.price_negotiable ? 'bg-[#15317E] text-white border-[#15317E]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#15317E]/40'}`}>
                  على السوم
                </button>
              </div>
            )}

            {form.price && !form.price_negotiable && (
              <p className="text-sm font-bold text-[#15317E] bg-[#15317E]/5 rounded-xl px-3 py-2 mt-2">
                {Number(form.price).toLocaleString('en-US')} ر.س
              </p>
            )}
          </div>

          <button type="button" onClick={submit} disabled={!canSubmit || isLoading}
            className="w-full mt-4 py-4 bg-[#15317E] text-white rounded-2xl font-bold text-base shadow-lg shadow-[#15317E]/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
            {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" />جاري النشر...</> : <><CheckCircle2 className="w-5 h-5" />{isEdit ? 'حفظ التعديلات' : 'نشر العقار'}</>}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
