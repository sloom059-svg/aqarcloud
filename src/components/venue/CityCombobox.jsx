import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { ChevronDown, X } from 'lucide-react';

const ALL_CITIES = [
  // منطقة الرياض
  "الرياض","الخرج","الدوادمي","المجمعة","الزلفي","شقراء","الأفلاج","وادي الدواسر",
  "السليل","حوطة بني تميم","الدلم","ضرماء","المزاحمية","رماح","حريملاء","تمير",
  "مرات","الحريق","القويعية","عفيف","الغاط","ثادق","الوشم","السدير","رياض الخبراء",
  "البكيرية","البدائع","عيون الجواء","الشماسية","ضريه","الخبراء","صلبوخ","اليمامة",
  "الصفراء","مشيرفة","الرفيعة","خضار","حلبان","البير","عقلة الصقور",

  // منطقة مكة المكرمة
  "مكة المكرمة","جدة","الطائف","رابغ","الجموم","خليص","عمق","الكامل","المندق",
  "الليث","القنفذة","الحوية","المويه","محرم","الكعكية","أضم","ميسان","بحرة",

  // منطقة المدينة المنورة
  "المدينة المنورة","ينبع","العلا","الحناكية","بدر","خيبر","المهد","الصويدرة",
  "وادي الفرع","الويجه",

  // المنطقة الشرقية
  "الدمام","الخبر","الأحساء","القطيف","الجبيل","حفر الباطن","النعيرية","الجش",
  "بقيق","رأس تنورة","عنك","صفوى","سيهات","العوامية","الخفجي","قطيف",
  "أبقيق","العقير","الهفوف","المبرز","العيون","الجفر",

  // منطقة القصيم
  "بريدة","عنيزة","الرس","المذنب","البكيرية","رياض الخبراء","النبهانية","ضريه",
  "البدائع","عيون الجواء","الشماسية","أبانات","العلا",

  // منطقة حائل
  "حائل","بقعاء","الغزالة","موقق","الشنان","سميراء","الحائط",

  // منطقة تبوك
  "تبوك","تيماء","الوجه","ضباء","أملج","حقل","شرما","نيوم","قيال",

  // منطقة جازان
  "جازان","صبيا","أبو عريش","صامطة","الدرب","الريث","الحرجة","بيش","فرسان",
  "أحد المسارحة","العارضة","الدائر","هروب","فيفا","ضمد","العيدابي",

  // منطقة نجران
  "نجران","شرورة","حبونا","يدمة","بدر الجنوب","ثار",

  // منطقة الباحة
  "الباحة","بلجرشي","المخواة","العقيق","قلوة","سراة عبيدة","المندق","غامد الزناد",
  "القرى","الحجرة","العقيق",

  // منطقة عسير
  "أبها","خميس مشيط","بيشة","النماص","محايل عسير","رنية","تربة","سراة عبيدة",
  "أحد رفيدة","تنومة","ظهران الجنوب","البرك","المجاردة","قلوة","الحرجة",

  // منطقة الجوف
  "سكاكا","القريات","دومة الجندل","طبرجل",

  // منطقة الحدود الشمالية
  "عرعر","رفحاء","طريف","عويقيلة","لينة",

  // منطقة المدينة المنورة (إضافية)
  "أبحر","الأبواء","بدر الشمالي",

  // مدن أخرى
  "الوشم","واسط","شقيقة","تلعة","أثير","متالا","العيساوية","بدانة","المسلمية",
].sort();

export default function CityCombobox({ value, onChange }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = query.trim()
    ? ALL_CITIES.filter(c => c.includes(query.trim()))
    : ALL_CITIES;

  const handleSelect = (city) => {
    onChange(city);
    setQuery('');
    setOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setQuery('');
  };

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        <Input
          value={open ? query : (value || query)}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="ابحث عن مدينة..."
          className="pl-8 pr-3"
        />
        {value && !open ? (
          <button type="button" onClick={handleClear}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        ) : (
          <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        )}
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-xl shadow-lg max-h-52 overflow-y-auto">
          {filtered.map(city => (
            <button key={city} type="button" onClick={() => handleSelect(city)}
              className={`w-full text-right px-4 py-2 text-sm hover:bg-muted transition-colors ${value === city ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'}`}>
              {city}
            </button>
          ))}
        </div>
      )}

      {open && filtered.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-xl shadow-lg px-4 py-3 text-sm text-muted-foreground">
          لا توجد نتائج
        </div>
      )}
    </div>
  );
}