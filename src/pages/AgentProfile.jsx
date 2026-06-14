import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Building2,
  BadgeCheck,
  MessageCircle,
  Share2,
  Loader2,
  Search,
  Compass,
  Tag,
  Maximize,
  BedDouble,
  Bath,
  Sofa,
  Ruler,
  Layers,
  CheckCircle2,
  Car,
  Waves,
  Trees,
  Utensils,
  Wind,
  DoorOpen,
  ShieldCheck,
  Wifi,
  Plug,
  Phone,
  ArrowUpLeft,
  FileText,
} from 'lucide-react';

const AIRBNB = '#FF385C';
const toEn = (value) => new Intl.NumberFormat('en-US').format(Number(value || 0));
const formatPrice = (p) => p ? `${toEn(p)} ر.س` : '—';

const formatWa = (phone) => {
  if (!phone) return '';
  let p = String(phone).replace(/\D/g, '');
  if (p.startsWith('05')) return '966' + p.substring(1);
  if (p.startsWith('5') && p.length === 9) return '966' + p;
  return p;
};

const getFeatureIcon = (feature = '') => {
  if (feature.includes('موقف') || feature.includes('سيارة')) return Car;
  if (feature.includes('مسبح')) return Waves;
  if (feature.includes('حديقة') || feature.includes('أشجار') || feature.includes('نخيل') || feature.includes('حوش')) return Trees;
  if (feature.includes('مطبخ') || feature.includes('مطعم')) return Utensils;
  if (feature.includes('تكييف') || feature.includes('تبريد')) return Wind;
  if (feature.includes('مدخل') || feature.includes('بوابة') || feature.includes('واجهة') || feature.includes('زجاج')) return DoorOpen;
  if (feature.includes('حارس') || feature.includes('أمن') || feature.includes('حراسة')) return ShieldCheck;
  if (feature.includes('انترنت')) return Wifi;
  if (feature.includes('كهرباء') || feature.includes('عداد')) return Plug;
  return CheckCircle2;
};

function hasValue(value) {
  return value !== undefined && value !== null && value !== '' && value !== 0;
}

const getPropertyKindLabel = (property) => {
  const parts = [property.listing_type, property.type].filter(Boolean);
  return parts.join(' / ') || 'عقار';
};

const getFloorLabel = (property) => {
  if (hasValue(property.floor)) return property.floor;
  const floorFeature = property.features?.find((feature) =>
    ['دور أرضي', 'الدور الأرضي', 'دور علوي', 'الدور العلوي', 'دور أول', 'الدور الأول', 'دور ثاني', 'الدور الثاني', 'ملحق علوي'].some((term) => feature.includes(term))
  );
  return floorFeature || '';
};

function SmartSpec({ icon: Icon, label, value }) {
  if (!hasValue(value)) return null;
  return (
    <div className="min-h-[72px] sm:min-h-[78px] rounded-[1.1rem] border border-zinc-100 bg-white px-2.5 py-3 flex flex-col justify-center gap-1.5 overflow-hidden">
      <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-zinc-400 leading-tight">
        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: AIRBNB }} />
        <span className="truncate">{label}</span>
      </span>
      <strong className="text-[13px] sm:text-base font-black text-zinc-900 leading-snug break-words">{value}</strong>
    </div>
  );
}

function FeatureChip({ feature }) {
  if (!feature) return null;
  const Icon = getFeatureIcon(feature);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-zinc-100 px-2.5 py-1 text-[11px] font-black text-zinc-500">
      <Icon className="w-3 h-3" style={{ color: AIRBNB }} />
      {feature}
    </span>
  );
}

function PropertyPublicCard({ property }) {
  const image = property.images?.[0];
  const location = [property.neighborhood, property.city].filter(Boolean).join('، ');
  const isLand = property.type === 'أرض';
  const isRent = property.listing_type === 'إيجار';
  const floorLabel = getFloorLabel(property);
  const dimensions = property.length_street && property.length_depth
    ? `${toEn(property.length_street)} × ${toEn(property.length_depth)} م`
    : '';
  const priceStatusLabel = property.price_on_request
    ? 'بانتظار العروض'
    : property.price_negotiable
    ? 'على السوم'
    : '';
  const hasNumericPrice = !priceStatusLabel && hasValue(property.price);
  const price = hasNumericPrice ? formatPrice(property.price) : priceStatusLabel;

  const residentialSpecs = [
    { icon: BedDouble, label: 'الغرف', value: property.bedrooms ? `${toEn(property.bedrooms)} غرف` : '' },
    { icon: Bath, label: 'دورات المياه', value: property.bathrooms ? `${toEn(property.bathrooms)} دورات` : '' },
    { icon: Sofa, label: 'الصالات', value: property.halls ? `${toEn(property.halls)} صالات` : '' },
    { icon: Layers, label: 'الدور', value: floorLabel },
    { icon: Maximize, label: 'المساحة', value: property.area ? `${toEn(property.area)} م²` : '' },
  ].filter((item) => hasValue(item.value));

  const landSpecs = [
    { icon: Maximize, label: 'المساحة', value: property.area ? `${toEn(property.area)} م²` : '' },
    { icon: Ruler, label: 'عرض الشارع', value: property.street_width ? `${toEn(property.street_width)} م` : '' },
    { icon: Compass, label: 'الواجهة', value: property.facade },
    { icon: Building2, label: 'نوع الأرض', value: property.type },
  ].filter((item) => hasValue(item.value));

  const commercialSpecs = [
    { icon: Maximize, label: 'المساحة', value: property.area ? `${toEn(property.area)} م²` : '' },
    { icon: Bath, label: 'دورات المياه', value: property.bathrooms ? `${toEn(property.bathrooms)} دورات` : '' },
    { icon: Compass, label: 'الواجهة', value: property.facade },
    { icon: Ruler, label: 'عرض الشارع', value: property.street_width ? `${toEn(property.street_width)} م` : '' },
  ].filter((item) => hasValue(item.value));

  const specs = isLand ? landSpecs : (residentialSpecs.length ? residentialSpecs : commercialSpecs);
  const gridClass = !isLand && specs.length >= 5
    ? 'grid-cols-2 sm:grid-cols-5'
    : 'grid-cols-2 sm:grid-cols-4';

  return (
    <Link
      to={`/property/${property.id}`}
      className="group block bg-white rounded-[1.9rem] overflow-hidden border border-zinc-100 shadow-sm hover:shadow-2xl hover:shadow-zinc-200/70 transition-all duration-500"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        {image ? (
          <img src={image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
            <Building2 className="w-14 h-14 text-zinc-300" />
          </div>
        )}

        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute top-3 right-3 left-3 z-10 flex items-start justify-between gap-2">
          <div className="flex gap-2 flex-wrap">
            {property.listing_type && (
              <span className="rounded-full bg-zinc-950/90 backdrop-blur px-3 py-1.5 text-[11px] font-black text-white shadow-sm">
                {property.listing_type}
              </span>
            )}
            {property.type && (
              <span className="rounded-full bg-white/95 backdrop-blur px-3 py-1.5 text-[11px] font-black text-zinc-950 shadow-sm">
                {property.type}
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            {property.facade && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur px-3 py-1.5 text-[11px] font-black text-zinc-800 shadow-sm border border-white/70">
                <Compass className="w-3.5 h-3.5" style={{ color: AIRBNB }} />
                واجهة {property.facade}
              </span>
            )}
            {priceStatusLabel && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF385C] px-3 py-1.5 text-[11px] font-black text-white shadow-sm">
                <Tag className="w-3.5 h-3.5" />
                {priceStatusLabel}
              </span>
            )}
          </div>
        </div>

        <div className="absolute bottom-3 right-3 left-3 z-10 flex items-end justify-between gap-3">
          {hasNumericPrice && (
            <div className="rounded-2xl bg-white/95 backdrop-blur px-3 py-2.5 shadow-lg min-w-[130px] text-center">
              <p className="text-[10px] font-black text-zinc-400 mb-1">السعر</p>
              <p className="text-base sm:text-lg font-black leading-none text-zinc-950">{price}</p>
            </div>
          )}
          {!hasNumericPrice && <div />}

          {property.area && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur px-3 py-1.5 text-[11px] font-black text-white">
              <Maximize className="w-3.5 h-3.5" />
              {toEn(property.area)} م²
            </span>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-black text-zinc-950 text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-[#FF385C] transition-colors">
              {property.title || 'عقار مميز'}
            </h3>
            {location && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-zinc-500">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="line-clamp-1">{location}</span>
              </p>
            )}
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-2xl bg-zinc-50 border border-zinc-100 px-3 py-2 text-[11px] font-black text-zinc-600 whitespace-nowrap">
            <Building2 className="w-3.5 h-3.5" style={{ color: AIRBNB }} />
            {getPropertyKindLabel(property)}
          </span>
        </div>

        {specs.length > 0 && (
          <div className="rounded-[1.35rem] border border-zinc-100 bg-zinc-50/75 p-3.5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <strong className="text-sm font-black text-zinc-800">أهم التفاصيل</strong>
              <span className="text-[11px] font-black text-zinc-400">{getPropertyKindLabel(property)}</span>
            </div>
            <div className={`grid ${gridClass} gap-2.5`}>
              {specs.map((spec) => (
                <SmartSpec key={`${spec.label}-${spec.value}`} icon={spec.icon} label={spec.label} value={spec.value} />
              ))}
            </div>

            {isLand && (dimensions || property.length_street || property.length_depth || property.plot_number || property.parcel_number) && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {dimensions && (
                  <div className="flex flex-col items-start gap-1 rounded-2xl border border-dashed border-zinc-200 bg-white px-3 py-2.5">
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black text-zinc-400">
                      <Ruler className="w-3 h-3 shrink-0" style={{ color: AIRBNB }} />
                      الأبعاد
                    </span>
                    <strong className="text-[13px] sm:text-sm font-black text-zinc-900">{dimensions}</strong>
                  </div>
                )}
                {property.length_street && (
                  <div className="flex flex-col items-start gap-1 rounded-2xl border border-dashed border-zinc-200 bg-white px-3 py-2.5">
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black text-zinc-400">
                      <Ruler className="w-3 h-3 shrink-0" style={{ color: AIRBNB }} />
                      على الشارع
                    </span>
                    <strong className="text-[13px] sm:text-sm font-black text-zinc-900">{toEn(property.length_street)} م</strong>
                  </div>
                )}
                {property.length_depth && (
                  <div className="flex flex-col items-start gap-1 rounded-2xl border border-dashed border-zinc-200 bg-white px-3 py-2.5">
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black text-zinc-400">
                      <Ruler className="w-3 h-3 shrink-0" style={{ color: AIRBNB }} />
                      العمق
                    </span>
                    <strong className="text-[13px] sm:text-sm font-black text-zinc-900">{toEn(property.length_depth)} م</strong>
                  </div>
                )}
                {property.plot_number && (
                  <div className="flex flex-col items-start gap-1 rounded-2xl border border-dashed border-zinc-200 bg-white px-3 py-2.5">
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black text-zinc-400">
                      <FileText className="w-3 h-3 shrink-0" style={{ color: AIRBNB }} />
                      المخطط
                    </span>
                    <strong className="text-[13px] sm:text-sm font-black text-zinc-900">{toEn(property.plot_number)}</strong>
                  </div>
                )}
                {property.parcel_number && (
                  <div className="flex flex-col items-start gap-1 rounded-2xl border border-dashed border-zinc-200 bg-white px-3 py-2.5">
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black text-zinc-400">
                      <FileText className="w-3 h-3 shrink-0" style={{ color: AIRBNB }} />
                      القطعة
                    </span>
                    <strong className="text-[13px] sm:text-sm font-black text-zinc-900">{toEn(property.parcel_number)}</strong>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {property.features?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {property.features.slice(0, 4).map((feature) => <FeatureChip key={feature} feature={feature} />)}
            {property.features.length > 4 && (
              <span className="rounded-full bg-zinc-100 border border-zinc-200 px-2.5 py-1 text-[11px] font-bold text-zinc-500">
                +{toEn(property.features.length - 4)}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-end pt-1">
          <span
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-zinc-950 px-4 py-2.5 text-xs font-black text-white transition-all group-hover:bg-black"
            aria-hidden="true"
          >
            عرض التفاصيل
            <ArrowUpLeft className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function AgentProfile() {
  const agentParam = window.location.pathname.split('/').pop();

  const { data: agent, isLoading: agentLoading } = useQuery({
    queryKey: ['agent-profile', agentParam],
    queryFn: async () => {
      // نبحث بالـ slug أولاً، ثم بالـ id (توافق مع الروابط القديمة)
      let rows = await base44.entities.User.filter({ slug: agentParam });
      if (!rows || !rows.length) rows = await base44.entities.User.filter({ id: agentParam });
      return rows[0];
    },
    enabled: !!agentParam,
  });

  const agentId = agent?.id;

  const { data: properties = [], isLoading: propsLoading } = useQuery({
    queryKey: ['agent-properties', agentId],
    queryFn: () => base44.entities.Property.filter({ created_by_id: agentId, status: 'نشط' }, '-created_date'),
    enabled: !!agentId,
  });

  const officeName = agent?.office_name || agent?.full_name || 'مكتب عقاري';
  const officeLogo = agent?.office_logo_url || agent?.avatar_url || agent?.profile_image_url;
  const waNumber = formatWa(agent?.whatsapp || agent?.phone);

  const shareProfile = async () => {
    const url = window.location.href;
    const data = { title: officeName, text: `تصفح عقارات ${officeName}`, url };
    if (navigator.share) {
      try { await navigator.share(data); return; } catch (_) {}
    }
    await navigator.clipboard.writeText(url);
  };

  if (agentLoading) return (
    <div dir="rtl" className="min-h-screen flex justify-center items-center bg-[#F7F7F7]">
      <div className="w-9 h-9 rounded-full border-[3px] border-zinc-100 border-t-[#FF385C] animate-spin" />
    </div>
  );

  if (!agent) return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7F7]">
      <Building2 className="w-12 h-12 text-zinc-300 mb-3" />
      <p className="text-zinc-500 text-lg font-black">الوسيط غير موجود</p>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7] font-sans pb-20 relative overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'IBM Plex Sans Arabic', sans-serif; }
      `}} />

      <div className="absolute inset-x-0 top-0 h-[240px] bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-28 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ backgroundColor: AIRBNB }} />
      <div className="absolute top-28 left-[-90px] w-72 h-72 rounded-full bg-zinc-900/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 pt-4 sm:pt-6">
        <header className="relative overflow-hidden rounded-[2.1rem] bg-white/95 border border-zinc-100 shadow-[0_22px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl p-4 sm:p-7">
          <div className="absolute inset-0 bg-gradient-to-l from-white/80 via-transparent to-white/70 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto] gap-4 sm:gap-6 items-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[1.75rem] bg-gradient-to-b from-white to-zinc-50 overflow-hidden flex items-center justify-center border border-zinc-200 shadow-[0_16px_34px_rgba(0,0,0,0.06)] mx-auto sm:mx-0 flex-shrink-0">
              {officeLogo ? (
                <img src={officeLogo} alt={officeName} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-11 h-11 text-zinc-700" />
              )}
            </div>

            <div className="min-w-0 text-center sm:text-right">
              <p className="text-[13px] sm:text-[15px] font-black text-zinc-400 mb-1">صفحة الوسيط العقاري</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-[1.9rem] sm:text-5xl lg:text-6xl font-black text-zinc-950 leading-[1.25] sm:leading-tight tracking-[-0.04em] pb-1 max-w-full break-words">
                  {officeName}
                </h1>
                {agent.license_number && (
                  <span className="w-8 h-8 sm:w-9 sm:h-9 inline-flex items-center justify-center rounded-full bg-[#FFF1F2] border border-[#FF385C]/15 text-[#FF385C] flex-shrink-0" title="موثق">
                    <BadgeCheck className="w-5 h-5" />
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-center justify-center sm:justify-start flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 border border-zinc-100 px-3 py-2 text-[12px] font-black text-zinc-600 whitespace-nowrap">
                  <Building2 className="w-4 h-4 text-zinc-400" />
                  {toEn(properties.length)} عقارات
                </span>
                {agent.city && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 border border-zinc-100 px-3 py-2 text-[12px] font-black text-zinc-600 whitespace-nowrap">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    {agent.city}
                  </span>
                )}
                {agent.license_number && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF8F8] border border-[#FF385C]/15 px-3 py-2 text-[12px] font-black text-zinc-600 max-w-full">
                    <BadgeCheck className="w-4 h-4 flex-shrink-0" style={{ color: AIRBNB }} />
                    <span className="whitespace-nowrap">رخصة موثوقة:</span>
                    <span dir="ltr" className="truncate">{agent.license_number}</span>
                  </span>
                )}
              </div>

              {(agent.bio || agent.city) && (
                <p className="mt-4 text-sm sm:text-base font-bold text-zinc-500 leading-7 max-w-2xl mx-auto sm:mx-0">
                  {agent.bio || `مكتب عقاري في مدينة ${agent.city}`}
                </p>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-3 justify-end whitespace-nowrap">
              {waNumber && (
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-w-[128px] items-center justify-center gap-2 bg-zinc-950 hover:bg-black text-white px-5 py-3.5 rounded-[1.1rem] text-sm font-black shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" style={{ color: '#25D366' }} />
                  واتساب
                </a>
              )}

              <button
                onClick={shareProfile}
                className="inline-flex min-w-[116px] items-center justify-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 px-5 py-3.5 rounded-[1.1rem] text-sm font-black shadow-sm transition-all"
              >
                <Share2 className="w-4 h-4" />
                مشاركة
              </button>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-2 mt-4 lg:hidden">
            {waNumber && (
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-black text-white px-4 py-3 rounded-[1.1rem] text-sm font-black shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" style={{ color: '#25D366' }} />
                واتساب
              </a>
            )}

            <button
              onClick={shareProfile}
              className="inline-flex items-center justify-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 px-4 py-3 rounded-[1.1rem] text-sm font-black shadow-sm transition-all"
            >
              <Share2 className="w-4 h-4" />
              مشاركة
            </button>
          </div>
        </header>

        <section className="mt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950">العقارات المتاحة</h2>
            <p className="text-sm font-bold text-zinc-400 mt-1">اضغط على أي عقار لعرض الصور والتفاصيل الكاملة</p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl bg-white border border-zinc-100 px-4 py-3 text-sm font-bold text-zinc-500 shadow-sm">
            <Search className="w-4 h-4" style={{ color: AIRBNB }} />
            {toEn(properties.length)} نتيجة
          </div>
        </section>

        {propsLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: AIRBNB }} />
          </div>
        ) : properties.length === 0 ? (
          <div className="mt-6 text-center py-16 bg-white rounded-[2rem] border border-zinc-100 shadow-sm">
            <Building2 className="w-12 h-12 text-zinc-300 mb-3 mx-auto" />
            <h3 className="font-black text-base text-zinc-700 mb-1">لا توجد عقارات منشورة حالياً</h3>
            <p className="text-sm text-zinc-400 font-bold">سيتم عرض العقارات هنا عند توفرها.</p>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
            {properties.map((property) => (
              <PropertyPublicCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
