import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Loader2, MapPin } from "lucide-react";
import { supabase } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

const PROPERTY_TYPES = ["شقة", "فيلا", "أرض", "مكتب", "محل تجاري", "عمارة", "استراحة", "مستودع"];
const LISTING_TYPES = ["بيع", "إيجار"];
const CITIES = ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "الطائف", "تبوك", "بريدة", "حائل", "أبها", "خميس مشيط", "جازان", "نجران", "ينبع", "الجبيل", "الأحساء", "القطيف", "الرس", "عنيزة", "الزلفي", "المجمعة", "شقراء", "الدوادمي", "الأفلاج", "وادي الدواسر", "سكاكا", "القريات", "عرعر", "رفحاء", "طريف", "الوجه", "أملج", "ضباء", "البدع", "بيشة", "محايل عسير", "صبيا", "أبو عريش", "صامطة", "الليث", "رابغ", "القنفذة", "الباحة", "بلجرشي", "المندق", "مدينة الملك عبدالله الاقتصادية"];
const FACADES = ["شرقية", "غربية", "شمالية", "جنوبية", "شمالية شرقية", "شمالية غربية", "جنوبية شرقية", "جنوبية غربية"];
const FLOORS = ["أرضي", "علوي", "ملحق", "الأول", "الثاني", "الثالث"];

const FEATURES_BY_TYPE = {
  default: ["مصعد", "موقف سيارات", "حديقة", "مسبح", "غرفة خادمة", "مجلس", "مطبخ مجهز", "تكييف مركزي", "شرفة", "مدخل خاص"],
  أرض:    ["مسوّرة", "على شارعين", "قريبة من خدمات", "صالحة للبناء التجاري", "صالحة للبناء السكني"],
  مستودع: ["رافعة شوكية", "تبريد", "حارس أمن", "بوابة كبيرة", "كهرباء صناعية", "حوش واسع", "منطقة تحميل", "أرضية مقواة"],
  مكتب:   ["مصعد", "موقف سيارات", "تكييف مركزي", "قاعة اجتماعات", "استقبال", "مدخل خاص"],
  استراحة: ["حوش واسع", "مسبح", "مجلس كبير", "مطبخ خارجي", "مواقف متعددة", "أشجار ونخيل"],
  فيلا:    ["حديقة خاصة", "مسبح", "مجلس", "غرفة خادمة", "مطبخ مجهز", "موقفين سيارات"],
  شقة:     ["مصعد", "موقف سيارات", "حراسة", "تكييف مركزي"],
  "محل تجاري": ["واجهة زجاجية", "موقف عملاء", "تكييف", "إضاءة جيدة"],
  عمارة:   ["مصعد", "موقف سيارات", "حراسة", "صيانة دورية"],
};

const SALE_ONLY_TYPES = ["أرض"];
const MAX_IMAGES = 10;

// أنواع العقارات حسب الفئة
const LAND_TYPES = ["أرض"];
const UNIT_TYPES = ["شقة", "فيلا", "بيت", "عمارة", "مكتب", "محل تجاري"];
const REST_TYPES = ["استراحة"];
const WAREHOUSE_TYPES = ["مستودع"];

function CheckRow({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-border bg-muted/30 hover:border-primary/40 transition-colors">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 accent-primary"
      />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}

function NumberPicker({ label, value, onChange, max = 10 }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value ? String(value) : ''} onValueChange={(v) => onChange(v ? Number(v) : '')}>
        <SelectTrigger><SelectValue placeholder={`اختر ${label}`} /></SelectTrigger>
        <SelectContent>
          {Array.from({ length: max }, (_, i) => i + 1).map(n => (
            <SelectItem key={n} value={String(n)}>{n}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function PropertyForm({ initialData, onSubmit, isLoading }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: '',
    listing_type: '',
    price: '',
    price_negotiable: false,
    has_limit: false,
    limit_price: '',
    area: '',
    rental_period: '',
    street_width: '',
    facade: '',
    has_lengths: false,
    length_north: '',
    length_south: '',
    length_east: '',
    length_west: '',
    bedrooms: '',
    bathrooms: '',
    halls: '',
    floor: '',
    property_age: '',
    has_kitchen: false,
    has_car_entrance: false,
    majalis: '',
    has_pool: false,
    has_mixed_section: false,
    has_two_sections: false,
    has_plot_info: false,
    plot_number: '',
    parcel_number: '',
    has_videos: false,
    youtube_url: '',
    tiktok_url: '',
    city: '',
    neighborhood: '',
    images: [],
    features: [],
    ...initialData,
  });

  useEffect(() => {
    if (!form.city && user?.city) {
      setForm(prev => ({ ...prev, city: user.city }));
    }
  }, [user?.city]);

  const [uploading, setUploading] = useState(false);
  const [fetchingPlaces, setFetchingPlaces] = useState(false);
  const [placesError, setPlacesError] = useState('');

  const isLand = LAND_TYPES.includes(form.type);
  const isUnit = UNIT_TYPES.includes(form.type);
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
      const fileExt = file.name.split('.').pop();
const fileName = `${Date.now()}.${fileExt}`;
const { data, error } = await supabase.storage.from('images').upload(fileName, file);
if (!error) {
  const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
  newImages.push(urlData.publicUrl);
}
    }
    setForm(prev => ({ ...prev, images: newImages }));
    setUploading(false);
  };

  const removeImage = (index) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const toggleFeature = (feature) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const fetchNearbyPlaces = async () => {
    setPlacesError('الميزة غير متاحة حالياً');

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      price: (form.price_negotiable && !form.price_on_call) ? undefined : (form.price ? Number(form.price) : undefined),
      area: (form.listing_type === 'بيع' || isWarehouse) && form.area ? Number(form.area) : undefined,
      rental_period: form.listing_type === 'إيجار' ? (form.rental_period || undefined) : undefined,
      street_width: form.street_width ? Number(form.street_width) : undefined,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      halls: form.halls ? Number(form.halls) : undefined,
      property_age: form.property_age ? Number(form.property_age) : undefined,
      majalis: form.majalis ? Number(form.majalis) : undefined,
      has_two_sections: form.has_two_sections || undefined,
      has_plot_info: form.has_plot_info || undefined,
      plot_number: form.has_plot_info ? form.plot_number : undefined,
      parcel_number: form.has_plot_info ? form.parcel_number : undefined,
      has_videos: form.has_videos || undefined,
      youtube_url: form.has_videos ? form.youtube_url : undefined,
      tiktok_url: form.has_videos ? form.tiktok_url : undefined,
      limit_price: form.has_limit && form.limit_price ? Number(form.limit_price) : undefined,
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ─── معلومات أساسية ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">بيانات العقار</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          <div className="space-y-2">
            <Label>عنوان العقار *</Label>
            <Input
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="مثال: أرض تجارية في حي الحمراء"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>نوع العقار *</Label>
              <Select value={form.type} onValueChange={(v) => handleChange('type', v)} required>
                <SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>نوع العرض *</Label>
              <Select value={form.listing_type} onValueChange={(v) => handleChange('listing_type', v)} required>
                <SelectTrigger><SelectValue placeholder="بيع / إيجار" /></SelectTrigger>
                <SelectContent>
                  {LISTING_TYPES.filter(t => isSaleOnly ? t === 'بيع' : true).map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isSaleOnly && <p className="text-xs text-muted-foreground">الأرض للبيع فقط</p>}
            </div>
          </div>

          {/* السعر + مساحة */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              {!form.price_negotiable && !form.price_on_call && <Label>السعر (ر.س)</Label>}
              {!form.price_negotiable && !form.price_on_call && (
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="0"
                />
              )}

              {form.listing_type !== 'إيجار' && (
                <>
                  <div className="flex gap-2">
                    <CheckRow
                      checked={form.price_negotiable}
                      onChange={(v) => { handleChange('price_negotiable', v); if (v) { handleChange('price', ''); handleChange('price_on_call', false); } }}
                      label="على السوم"
                    />
                    <CheckRow
                      checked={form.price_on_call}
                      onChange={(v) => { handleChange('price_on_call', v); if (v) { handleChange('price_negotiable', false); handleChange('price', ''); } }}
                      label="مسيوم"
                    />
                  </div>
                  {form.price_on_call && (
                    <div className="space-y-1">
                      <Input
                        type="number"
                        value={form.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                        placeholder="مثال: 200000"
                      />
                      {form.price && (
                        <p className="text-sm font-medium text-primary bg-primary/8 rounded-lg px-3 py-2">
                          مسيوم بـ {Number(form.price).toLocaleString('ar-SA')} ريال
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="space-y-2">
              {form.listing_type === 'إيجار' ? (
                <>
                  <Label>مدة الإيجار</Label>
                  <Select value={form.rental_period || ''} onValueChange={(v) => handleChange('rental_period', v)}>
                    <SelectTrigger><SelectValue placeholder="اختر المدة" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="شهري">شهري</SelectItem>
                      <SelectItem value="نصف سنوي">نصف سنوي</SelectItem>
                      <SelectItem value="سنوي">سنوي</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <>
                  <Label>المساحة (م²)</Label>
                  <Input
                    type="number"
                    value={form.area}
                    onChange={(e) => handleChange('area', e.target.value)}
                    placeholder="0"
                  />
                </>
              )}
            </div>
          </div>

          {/* حد اختياري — يظهر للبيع فقط */}
          {form.listing_type === 'بيع' && (
            <div className="space-y-2">
              <CheckRow
                checked={form.has_limit}
                onChange={(v) => { handleChange('has_limit', v); if (!v) handleChange('limit_price', ''); }}
                label="إضافة الحد"
              />
              {form.has_limit && (
                <Input
                  type="number"
                  value={form.limit_price}
                  onChange={(e) => handleChange('limit_price', e.target.value)}
                  placeholder="الحد (ر.س)"
                />
              )}
            </div>
          )}

        </CardContent>
      </Card>

      {/* ─── حقول الأرض ─── */}
      {isLand && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">تفاصيل الأرض</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>عرض الشارع (م)</Label>
                <Input
                  type="number"
                  value={form.street_width}
                  onChange={(e) => handleChange('street_width', e.target.value)}
                  placeholder="20"
                />
              </div>
              <div className="space-y-2">
                <Label>الواجهة</Label>
                <Select value={form.facade} onValueChange={(v) => handleChange('facade', v)}>
                  <SelectTrigger><SelectValue placeholder="اختر الواجهة" /></SelectTrigger>
                  <SelectContent>
                    {FACADES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <CheckRow
                checked={form.has_lengths}
                onChange={(v) => handleChange('has_lengths', v)}
                label="إضافة الأطوال"
              />
              {form.has_lengths && (
                <div className="bg-muted/40 rounded-xl p-4 space-y-3 border border-border">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">شمال</Label>
                      <Input value={form.length_north} onChange={(e) => handleChange('length_north', e.target.value)} placeholder="25" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">جنوب</Label>
                      <Input value={form.length_south} onChange={(e) => handleChange('length_south', e.target.value)} placeholder="25" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">شرق</Label>
                      <Input value={form.length_east} onChange={(e) => handleChange('length_east', e.target.value)} placeholder="25" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">غرب</Label>
                      <Input value={form.length_west} onChange={(e) => handleChange('length_west', e.target.value)} placeholder="25" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <CheckRow
                checked={form.has_plot_info}
                onChange={(v) => handleChange('has_plot_info', v)}
                label="رقم المخطط والقطعة"
              />
              {form.has_plot_info && (
                <div className="bg-muted/40 rounded-xl p-4 space-y-3 border border-border">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">رقم المخطط</Label>
                      <Input value={form.plot_number} onChange={(e) => handleChange('plot_number', e.target.value)} placeholder="1234" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">رقم القطعة</Label>
                      <Input value={form.parcel_number} onChange={(e) => handleChange('parcel_number', e.target.value)} placeholder="5678" />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </CardContent>
        </Card>
      )}

      {/* ─── حقول الوحدات السكنية/التجارية ─── */}
      {isUnit && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">تفاصيل الوحدة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <NumberPicker label="غرف النوم" value={form.bedrooms} onChange={(v) => handleChange('bedrooms', v)} />
              <NumberPicker label="دورات المياه" value={form.bathrooms} onChange={(v) => handleChange('bathrooms', v)} />
              <NumberPicker label="الصالات" value={form.halls} onChange={(v) => handleChange('halls', v)} />
              <div className="space-y-2">
                <Label className="text-xs">الدور</Label>
                <Select value={form.floor} onValueChange={(v) => handleChange('floor', v)}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="اختر" /></SelectTrigger>
                  <SelectContent>
                    {FLOORS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {form.listing_type !== 'إيجار' && (
                <div className="space-y-2">
                  <Label className="text-xs">عمر العقار</Label>
                  <Input type="number" value={form.property_age} onChange={(e) => handleChange('property_age', e.target.value)} placeholder="0" className="h-9" />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <CheckRow checked={form.has_kitchen} onChange={(v) => handleChange('has_kitchen', v)} label="يوجد مطبخ" />
              <CheckRow checked={form.has_car_entrance} onChange={(v) => handleChange('has_car_entrance', v)} label="مدخل سيارة" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── حقول المستودع ─── */}
      {isWarehouse && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">تفاصيل المستودع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>المساحة (م²)</Label>
              <Input
                type="number"
                value={form.area}
                onChange={(e) => handleChange('area', e.target.value)}
                placeholder="0"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── حقول الاستراحة ─── */}
      {isRest && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">تفاصيل الاستراحة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <NumberPicker label="عدد الغرف" value={form.bedrooms} onChange={(v) => handleChange('bedrooms', v)} />
              <NumberPicker label="دورات المياه" value={form.bathrooms} onChange={(v) => handleChange('bathrooms', v)} />
              <NumberPicker label="الصالات" value={form.halls} onChange={(v) => handleChange('halls', v)} />
              <div className="space-y-2">
                <Label className="text-xs">عدد المجالس</Label>
                <Input type="number" value={form.majalis} onChange={(e) => handleChange('majalis', e.target.value)} placeholder="0" className="h-9" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <CheckRow checked={form.has_pool} onChange={(v) => handleChange('has_pool', v)} label="يوجد مسبح" />
              <CheckRow checked={form.has_car_entrance} onChange={(v) => handleChange('has_car_entrance', v)} label="مدخل سيارة" />
              <CheckRow checked={form.has_two_sections} onChange={(v) => handleChange('has_two_sections', v)} label="قسمين" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── الموقع ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">الموقع</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>رابط قوقل ماب (اختياري)</Label>
            <div className="flex gap-2">
              <Input
                value={form.maps_url || ''}
                onChange={(e) => handleChange('maps_url', e.target.value)}
                placeholder="https://maps.google.com/..."
                dir="ltr"
              />
              <Button
                type="button"
                variant="outline"
                onClick={fetchNearbyPlaces}
                disabled={!form.maps_url || fetchingPlaces}
                className="shrink-0 gap-1"
              >
                {fetchingPlaces ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                جلب الأماكن
              </Button>
            </div>
            {placesError && <p className="text-xs text-destructive">{placesError}</p>}
            {form.nearby_places?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.nearby_places.map((p, i) => (
                  <span key={i} className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1">
                    {p.label} · {p.distance_label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>المدينة *</Label>
              <Select value={form.city} onValueChange={(v) => handleChange('city', v)} required>
                <SelectTrigger><SelectValue placeholder="اختر المدينة" /></SelectTrigger>
                <SelectContent>
                  {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>الحي</Label>
              <Input
                value={form.neighborhood}
                onChange={(e) => handleChange('neighborhood', e.target.value)}
                placeholder="اسم الحي"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── الصور ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">صور العقار</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{form.images.length} / {MAX_IMAGES} صور</span>
            {form.images.length >= MAX_IMAGES && (
              <span className="text-xs text-destructive font-medium">وصلت للحد الأقصى</span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-border">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 left-2 w-7 h-7 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {form.images.length < MAX_IMAGES && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-muted/30">
                {uploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">إضافة صورة</span>
                  </>
                )}
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ─── الفيديو ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">فيديو العقار (اختياري)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <CheckRow
              checked={form.has_videos}
              onChange={(v) => handleChange('has_videos', v)}
              label="إضافة فيديو"
            />
          </div>
          {form.has_videos && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>رابط يوتيوب</Label>
                <Input
                  value={form.youtube_url}
                  onChange={(e) => handleChange('youtube_url', e.target.value)}
                  placeholder="https://youtube.com/..."
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label>رابط تيك توك</Label>
                <Input
                  value={form.tiktok_url}
                  onChange={(e) => handleChange('tiktok_url', e.target.value)}
                  placeholder="https://tiktok.com/..."
                  dir="ltr"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── المميزات ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">المميزات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {availableFeatures.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => toggleFeature(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  form.features.includes(f)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-border hover:border-primary/30'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ─── الوصف ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">الوصف</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="أضف وصفاً تفصيلياً للعقار..."
            rows={4}
          />
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'حفظ العقار'}
      </Button>
    </form>
  );
}
