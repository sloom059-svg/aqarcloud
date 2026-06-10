import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  MessageCircle,
  Share2,
  Building2,
  CheckCircle2,
  Map,
  Sofa,
  Compass,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowRight,
  Ruler,
  X,
  Layers,
  Home,
  FileText,
  CalendarClock,
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
} from 'lucide-react';

const AIRBNB = '#FF385C';
const toEn = (value) => new Intl.NumberFormat('en-US').format(Number(value || 0));
const formatPrice = (p) => p ? `${toEn(p)} ر.س` : '';

const formatWa = (phone) => {
  if (!phone) return '';
  let p = String(phone).replace(/\D/g, '');
  if (p.startsWith('05')) return '966' + p.substring(1);
  if (p.startsWith('5') && p.length === 9) return '966' + p;
  return p;
};

const periodLabel = (p) => ({ سنوي: 'سنوياً', شهري: 'شهرياً', يومي: 'يومياً' }[p] || '');

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

function InfoCard({ icon: Icon, label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="rounded-3xl bg-white border border-zinc-100 p-4 shadow-sm">
      <div className="flex items-center gap-1.5 text-xs font-black text-zinc-400 mb-2">
        <Icon className="w-4 h-4" style={{ color: AIRBNB }} />
        {label}
      </div>
      <p className="text-base font-black text-zinc-950 leading-tight">{value}</p>
    </div>
  );
}

export default function PropertyDetail() {
  const navigate = useNavigate();
  const propertyId = window.location.pathname.split('/').pop();
  const [currentImage, setCurrentImage] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => (await base44.entities.Property.filter({ id: propertyId }))[0],
    enabled: !!propertyId,
  });

  const { data: agent } = useQuery({
    queryKey: ['property-agent', property?.created_by_id],
    queryFn: async () => (await base44.entities.User.filter({ id: property.created_by_id }))[0],
    enabled: !!property?.created_by_id,
  });

  if (isLoading) return (
    <div dir="rtl" className="min-h-screen flex justify-center items-center bg-[#F7F7F7]">
      <div className="w-9 h-9 rounded-full border-[3px] border-zinc-100 border-t-[#FF385C] animate-spin" />
    </div>
  );

  if (!property) return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7F7]">
      <Building2 className="w-12 h-12 text-zinc-300 mb-3" />
      <p className="text-zinc-500 text-lg font-black">العقار غير موجود</p>
    </div>
  );

  const isLand = property.type === 'أرض';
  const images = property.images?.length ? property.images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'];
  const priceText = property.price_on_request
    ? 'السعر عند الطلب'
    : property.price_negotiable
    ? 'السعر قابل للتفاوض'
    : formatPrice(property.price);
  const priceDetail = property.price_on_request || property.price_negotiable
    ? ''
    : property.listing_type === 'إيجار'
    ? periodLabel(property.rental_period)
    : '';
  const dims = property.length_street && property.length_depth ? `${toEn(property.length_street)} × ${toEn(property.length_depth)} م` : '';
  const waNumber = formatWa(agent?.whatsapp || agent?.phone);
  const officeName = agent?.office_name || agent?.full_name || 'مكتب عقاري';
  const officeLogo = agent?.office_logo_url || agent?.avatar_url || agent?.profile_image_url;
  const location = [property.neighborhood, property.city].filter(Boolean).join('، ');

  const shareProperty = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: property.title, url }); return; } catch (_) {}
    }
    await navigator.clipboard.writeText(url);
    toast.success('تم نسخ الرابط');
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7] font-sans pb-28 relative overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
      `}} />

      <div className="absolute inset-x-0 top-0 h-[220px] bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-28 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ backgroundColor: AIRBNB }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.85fr] gap-5 items-start">
          <section className="rounded-[2rem] overflow-hidden bg-white border border-zinc-100 shadow-sm">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] bg-black">
              <img
                src={images[currentImage]}
                alt={property.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setLightbox(true)}
              />

              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 to-transparent" />

              <button onClick={() => navigate(-1)} className="absolute top-4 right-4 h-11 w-11 rounded-2xl bg-white/95 backdrop-blur text-zinc-950 flex items-center justify-center shadow-sm hover:bg-white transition">
                <ArrowRight className="w-5 h-5" />
              </button>

              <button onClick={shareProperty} className="absolute top-4 left-4 h-11 w-11 rounded-2xl bg-white/95 backdrop-blur text-zinc-950 flex items-center justify-center shadow-sm hover:bg-white transition">
                <Share2 className="w-5 h-5" />
              </button>

              {images.length > 1 && (
                <>
                  <button onClick={() => setCurrentImage(p => p > 0 ? p - 1 : images.length - 1)} className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-2xl bg-white/90 text-zinc-950 flex items-center justify-center shadow-sm hover:bg-white transition">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button onClick={() => setCurrentImage(p => p < images.length - 1 ? p + 1 : 0)} className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-2xl bg-white/90 text-zinc-950 flex items-center justify-center shadow-sm hover:bg-white transition">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 right-4 left-4 flex items-end justify-between gap-3">
                <div className="rounded-[1.4rem] bg-white px-4 py-3 shadow-xl">
                  <p className="text-[11px] font-black text-zinc-400 mb-1">السعر</p>
                  <p className="text-2xl font-black leading-none" style={{ color: AIRBNB }}>{priceText}</p>
                  {priceDetail && <p className="text-[11px] font-bold text-zinc-400 mt-1">{priceDetail}</p>}
                </div>

                <div className="flex flex-col items-end gap-2">
                  {property.facade && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur px-3 py-2 text-xs font-black text-zinc-800 shadow-sm">
                      <Compass className="w-4 h-4" style={{ color: AIRBNB }} />
                      واجهة {property.facade}
                    </span>
                  )}
                  {property.area && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 backdrop-blur px-3 py-2 text-xs font-black text-white">
                      <Maximize className="w-4 h-4" />
                      {toEn(property.area)} م²
                    </span>
                  )}
                </div>
              </div>
            </div>

            {images.length > 1 && (
              <div className="p-3 flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-20 h-16 rounded-2xl overflow-hidden border-2 flex-shrink-0 ${i === currentImage ? 'border-[#FF385C]' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <aside className="lg:sticky lg:top-5 space-y-4">
            <div className="rounded-[2rem] bg-white border border-zinc-100 shadow-sm p-5">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {property.listing_type && <span className="rounded-full bg-zinc-950 text-white px-3 py-1.5 text-xs font-black">{property.listing_type}</span>}
                {property.type && <span className="rounded-full bg-zinc-50 border border-zinc-100 text-zinc-700 px-3 py-1.5 text-xs font-black">{property.type}</span>}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 leading-tight">{property.title}</h1>

              {location && (
                <p className="mt-3 flex items-center gap-1.5 text-sm font-bold text-zinc-500">
                  <MapPin className="w-4 h-4" />
                  {location}
                </p>
              )}

              {property.description && (
                <p className="mt-4 text-sm font-medium text-zinc-500 leading-8">{property.description}</p>
              )}
            </div>

          </aside>
        </div>

        <section className="mt-5">
          <h2 className="text-xl font-black text-zinc-950 mb-3">تفاصيل العقار</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            <InfoCard icon={Building2} label="نوع العقار" value={property.type} />
            <InfoCard icon={Layers} label="نوع العرض" value={property.listing_type} />
            <InfoCard icon={Maximize} label="المساحة" value={property.area ? `${toEn(property.area)} م²` : ''} />
            <InfoCard icon={Ruler} label="عرض الشارع" value={property.street_width ? `${toEn(property.street_width)} م` : ''} />
            {isLand && <InfoCard icon={Compass} label="الواجهة" value={property.facade} />}
            {isLand && <InfoCard icon={Map} label="الأبعاد" value={dims} />}
            {!isLand && <InfoCard icon={BedDouble} label="غرف النوم" value={property.bedrooms ? toEn(property.bedrooms) : ''} />}
            {!isLand && <InfoCard icon={Bath} label="دورات المياه" value={property.bathrooms ? toEn(property.bathrooms) : ''} />}
            {!isLand && <InfoCard icon={Sofa} label="الصالات" value={property.halls ? toEn(property.halls) : ''} />}
            {!isLand && <InfoCard icon={Home} label="عمر العقار" value={property.property_age ? `${toEn(property.property_age)} سنة` : ''} />}
            <InfoCard icon={FileText} label="رقم المخطط" value={property.plot_number} />
            <InfoCard icon={FileText} label="رقم القطعة" value={property.parcel_number} />
            <InfoCard icon={CalendarClock} label="مدة الإيجار" value={property.rental_period} />
          </div>
        </section>

        {property.features?.length > 0 && (
          <section className="mt-5 rounded-[2rem] bg-white border border-zinc-100 shadow-sm p-5">
            <h2 className="text-xl font-black text-zinc-950 mb-4">أبرز المزايا</h2>
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature) => {
                const Icon = getFeatureIcon(feature);
                return (
                  <span key={feature} className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 border border-zinc-100 px-3 py-2 text-sm font-bold text-zinc-500">
                    <Icon className="w-4 h-4" style={{ color: AIRBNB }} />
                    {feature}
                  </span>
                );
              })}
            </div>
          </section>
        )}

        {property.nearby_places?.length > 0 && (
          <section className="mt-5 rounded-[2rem] bg-white border border-zinc-100 shadow-sm p-5">
            <h2 className="text-xl font-black text-zinc-950 mb-4">المواقع والخدمات القريبة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {property.nearby_places.map((place, i) => (
                <div key={i} className="flex items-center justify-between gap-3 rounded-3xl bg-zinc-50 border border-zinc-100 p-4">
                  <span className="font-black text-zinc-700">{place.label}</span>
                  <span className="font-bold text-zinc-400">{place.distance_label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-5 rounded-[2rem] bg-white border border-zinc-100 shadow-sm p-5">
          <p className="text-sm font-black text-zinc-950 mb-4">بيانات المكتب</p>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center flex-shrink-0">
              {officeLogo ? <img src={officeLogo} alt={officeName} className="w-full h-full object-cover" /> : <Building2 className="w-6 h-6 text-zinc-600" />}
            </div>
            <div className="min-w-0">
              <p className="font-black text-zinc-950 truncate">{officeName}</p>
              {agent?.license_number && (
                <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-zinc-500 max-w-full">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: AIRBNB }} />
                  <span className="whitespace-nowrap">رخصة موثوق:</span>
                  <span dir="ltr" className="truncate">{agent.license_number}</span>
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {waNumber && (
              <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-black text-white px-4 py-3 rounded-2xl text-sm font-black transition">
                <MessageCircle className="w-4 h-4" style={{ color: '#25D366' }} />
                تواصل واتساب
              </a>
            )}
            {agent?.phone && (
              <a href={`tel:${agent.phone}`} className="w-full inline-flex items-center justify-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 px-4 py-3 rounded-2xl text-sm font-black transition">
                <Phone className="w-4 h-4" />
                اتصال
              </a>
            )}
          </div>
        </section>
      </div>

      {lightbox && (
        <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
          <button onClick={() => setLightbox(false)} className="absolute top-5 right-5 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full">
            <X className="w-6 h-6" />
          </button>
          {images.length > 1 && (
            <>
              <button onClick={() => setCurrentImage(p => p > 0 ? p - 1 : images.length - 1)} className="absolute right-5 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full">
                <ChevronRight className="w-6 h-6" />
              </button>
              <button onClick={() => setCurrentImage(p => p < images.length - 1 ? p + 1 : 0)} className="absolute left-5 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full">
                <ChevronLeft className="w-6 h-6" />
              </button>
            </>
          )}
          <img src={images[currentImage]} alt="" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
}
