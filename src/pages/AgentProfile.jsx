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

function SpecPill({ icon: Icon, children }) {
  if (!children) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 border border-zinc-100 px-2.5 py-1.5 text-[11px] font-bold text-zinc-600">
      <Icon className="w-3.5 h-3.5" style={{ color: AIRBNB }} />
      {children}
    </span>
  );
}

function PropertyPublicCard({ property }) {
  const image = property.images?.[0];
  const location = [property.neighborhood, property.city].filter(Boolean).join('، ');
  const isLand = property.type === 'أرض';
  const price = property.price_on_request
    ? 'السعر عند الطلب'
    : property.price_negotiable
    ? 'السعر قابل للتفاوض'
    : formatPrice(property.price);

  return (
    <Link
      to={`/property/${property.id}`}
      className="group block bg-white rounded-[1.8rem] overflow-hidden border border-zinc-100 shadow-sm hover:shadow-2xl hover:shadow-zinc-200/70 transition-all duration-500"
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

        <div className="absolute top-3 right-3 flex gap-2">
          {property.listing_type && (
            <span className="rounded-full bg-white/95 backdrop-blur px-3 py-1.5 text-[11px] font-black text-zinc-950 shadow-sm">
              {property.listing_type}
            </span>
          )}
          {property.type && (
            <span className="rounded-full bg-zinc-950/85 backdrop-blur px-3 py-1.5 text-[11px] font-black text-white shadow-sm">
              {property.type}
            </span>
          )}
        </div>

        <div className="absolute bottom-3 right-3 left-3 flex items-end justify-between gap-3">
          <div className="rounded-2xl bg-white px-3 py-2 shadow-lg">
            <p className="text-[10px] font-black text-zinc-400 mb-0.5">السعر</p>
            <p className="text-base font-black leading-none" style={{ color: AIRBNB }}>{price}</p>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {property.facade && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur px-3 py-1.5 text-[11px] font-black text-zinc-800 shadow-sm">
                <Compass className="w-3.5 h-3.5" style={{ color: AIRBNB }} />
                واجهة {property.facade}
              </span>
            )}
            {property.area && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 backdrop-blur px-3 py-1.5 text-[11px] font-black text-white">
                <Maximize className="w-3.5 h-3.5" />
                {toEn(property.area)} م²
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-black text-zinc-950 text-base leading-snug line-clamp-2 group-hover:text-[#FF385C] transition-colors">
            {property.title || 'عقار مميز'}
          </h3>
          {location && (
            <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-zinc-500">
              <MapPin className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{location}</span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-100">
          <SpecPill icon={Layers}>{property.listing_type}</SpecPill>
          <SpecPill icon={Building2}>{property.type}</SpecPill>
          {property.street_width && <SpecPill icon={Ruler}>شارع {toEn(property.street_width)} م</SpecPill>}
          {!isLand && property.bedrooms && <SpecPill icon={BedDouble}>{toEn(property.bedrooms)} غرف</SpecPill>}
          {!isLand && property.bathrooms && <SpecPill icon={Bath}>{toEn(property.bathrooms)} دورات</SpecPill>}
          {!isLand && property.halls && <SpecPill icon={Sofa}>{toEn(property.halls)} صالات</SpecPill>}
        </div>

        {property.features?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {property.features.slice(0, 4).map((feature) => {
              const Icon = getFeatureIcon(feature);
              return (
                <span key={feature} className="inline-flex items-center gap-1 rounded-full bg-zinc-50 border border-zinc-100 px-2.5 py-1 text-[11px] font-bold text-zinc-500">
                  <Icon className="w-3 h-3" style={{ color: AIRBNB }} />
                  {feature}
                </span>
              );
            })}
            {property.features.length > 4 && (
              <span className="rounded-full bg-zinc-100 border border-zinc-200 px-2.5 py-1 text-[11px] font-bold text-zinc-500">
                +{toEn(property.features.length - 4)}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-end pt-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-100 bg-zinc-50 px-3 py-1.5 text-[11px] font-black text-zinc-700 transition-all group-hover:border-[#FF385C]/20 group-hover:bg-[#FFF1F2] group-hover:text-[#FF385C]"
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
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
      `}} />

      <div className="absolute inset-x-0 top-0 h-[240px] bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-28 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ backgroundColor: AIRBNB }} />
      <div className="absolute top-28 left-[-90px] w-72 h-72 rounded-full bg-zinc-900/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 pt-4 sm:pt-6">
        <header className="rounded-[2rem] bg-white/95 border border-zinc-200 shadow-[0_14px_44px_rgba(0,0,0,0.07)] backdrop-blur-xl p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.7rem] bg-gradient-to-br from-white to-zinc-100 overflow-hidden flex items-center justify-center border border-zinc-200 shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex-shrink-0">
                {officeLogo ? (
                  <img src={officeLogo} alt={officeName} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-9 h-9 text-zinc-700" />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-black text-zinc-400 mb-1">صفحة الوسيط العقاري</p>
                <h1 className="text-2xl sm:text-4xl font-black text-zinc-950 leading-tight truncate">{officeName}</h1>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {agent.city && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-50 border border-zinc-100 px-2.5 py-1.5 text-[11px] font-bold text-zinc-500 whitespace-nowrap">
                        <MapPin className="w-3.5 h-3.5" />
                        {agent.city}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-50 border border-zinc-100 px-2.5 py-1.5 text-[11px] font-bold text-zinc-500 whitespace-nowrap">
                      <Building2 className="w-3.5 h-3.5" />
                      {toEn(properties.length)} عقار
                    </span>
                  </div>

                  {agent.license_number && (
                    <div className="flex">
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-50 border border-zinc-100 px-2.5 py-1.5 text-[11px] font-bold text-zinc-500 max-w-full">
                        <BadgeCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: AIRBNB }} />
                        <span className="whitespace-nowrap">رخصة موثوق:</span>
                        <span dir="ltr" className="truncate">{agent.license_number}</span>
                      </span>
                    </div>
                  )}
                </div>

                {agent.bio && (
                  <p className="mt-3 text-sm font-bold text-zinc-500 leading-7 max-w-2xl">{agent.bio}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2 md:flex-col lg:flex-row">
              {waNumber && (
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-black text-white px-5 py-3 rounded-2xl text-sm font-black shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" style={{ color: '#25D366' }} />
                  واتساب
                </a>
              )}

              <button
                onClick={shareProfile}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 px-5 py-3 rounded-2xl text-sm font-black shadow-sm transition-all"
              >
                <Share2 className="w-4 h-4" />
                مشاركة
              </button>
            </div>
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
