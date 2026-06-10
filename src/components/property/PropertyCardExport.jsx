import React, { useRef } from 'react';
import { toast } from 'sonner';
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  MessageCircle,
  Map,
  Compass,
  CheckCircle2,
  Download,
  X,
  Building2,
  Phone,
  Ruler,
  Layers,
  Sofa,
  Home,
  FileText,
  CalendarClock,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const AIRBNB = '#FF385C';
const formatPrice = (p) => p ? new Intl.NumberFormat('ar-SA').format(p) : '';
const periodLabel = (p) => ({ سنوي: 'سنوياً', شهري: 'شهرياً', يومياً: 'يومياً', يومي: 'يومياً' }[p] || '');

const chip = (Icon, label, value) => {
  if (!value && value !== 0) return null;
  return (
    <div className="rounded-2xl bg-zinc-50 border border-zinc-100 px-3 py-2 text-right">
      <div className="flex items-center gap-1.5 text-[10px] font-black text-zinc-400 mb-1">
        <Icon className="w-3.5 h-3.5" style={{ color: AIRBNB }} />
        {label}
      </div>
      <div className="text-[13px] font-black text-zinc-950 leading-tight">{value}</div>
    </div>
  );
};

export default function PropertyCardExport({ property, agent, onClose }) {
  const cardRef = useRef(null);
  if (!property) return null;

  const isLand = property.type === 'أرض';
  const officeName = agent?.office_name || agent?.full_name || 'مكتب عقاري';
  const contactNum = agent?.whatsapp || agent?.phone || '';
  const officeLogo = agent?.office_logo_url || agent?.profile_image_url;
  const location = [property.city, property.neighborhood].filter(Boolean).join('، ');

  const priceText = property.price_on_request
    ? 'السعر عند الطلب'
    : property.price_negotiable
    ? 'السعر قابل للتفاوض'
    : `${formatPrice(property.price)} ر.س`;

  const priceSub = property.price_on_request
    ? ''
    : property.price_negotiable
    ? ''
    : property.listing_type === 'إيجار'
    ? periodLabel(property.rental_period)
    : '';

  const dimensionText = property.length_street && property.length_depth
    ? `${property.length_street} × ${property.length_depth} م`
    : property.street_width
    ? `شارع ${property.street_width} م`
    : '';

  const nearby = property.nearby_places?.slice(0, 4) || [];
  const features = property.features?.slice(0, 10) || [];

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2.2,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollY: -window.scrollY,
      });
      const link = document.createElement('a');
      link.download = `${property.title || 'property-card'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('تم حفظ البطاقة بنجاح');
      onClose?.();
    } catch (e) {
      console.error(e);
      toast.error('تعذر حفظ البطاقة');
    }
  };

  return (
    <div className="w-full max-w-[470px] mx-auto flex flex-col items-center">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
      `}} />

      <div
        ref={cardRef}
        dir="rtl"
        className="bg-white w-full rounded-[2rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.18)] relative"
        style={{ fontFamily: 'Tajawal, sans-serif' }}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: AIRBNB }} />

        {/* الصورة */}
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
          <img
            src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'}
            alt={property.title || 'عقار'}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <div className="absolute top-4 right-4 flex flex-wrap gap-2">
            {property.listing_type && (
              <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-black text-zinc-950 shadow-sm">
                {property.listing_type}
              </span>
            )}
            {property.type && (
              <span className="rounded-full bg-zinc-950/90 text-white px-3 py-1.5 text-[11px] font-black shadow-sm">
                {property.type}
              </span>
            )}
          </div>

          {property.facade && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur px-3 py-1.5 text-[11px] font-black text-zinc-800 shadow-sm">
                <Compass className="w-3.5 h-3.5" style={{ color: AIRBNB }} />
                واجهة {property.facade}
              </span>
            </div>
          )}

          <div className="absolute bottom-4 right-4 left-4 flex items-end justify-between gap-3">
            <div className="rounded-[1.2rem] bg-white px-4 py-3 shadow-lg min-w-[148px]">
              <p className="text-[10px] font-black text-zinc-400 mb-1">السعر</p>
              <div className="text-[22px] font-black leading-none" style={{ color: AIRBNB }}>{priceText}</div>
              {priceSub && <div className="text-[10px] font-bold text-zinc-400 mt-1">{priceSub}</div>}
            </div>

            {property.area && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 backdrop-blur px-3 py-1.5 text-[12px] font-black text-white">
                <Maximize className="w-3.5 h-3.5" />
                {property.area} م²
              </span>
            )}
          </div>
        </div>

        {/* العنوان */}
        <div className="p-5 pb-4">
          <h2 className="text-[22px] font-black text-zinc-950 leading-tight">{property.title || 'عقار مميز'}</h2>
          {location && (
            <div className="mt-2 flex items-center gap-1.5 text-zinc-500 text-sm font-bold">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{location}</span>
            </div>
          )}
          {property.description && (
            <p className="mt-3 text-[13px] leading-7 font-medium text-zinc-500 line-clamp-3">
              {property.description}
            </p>
          )}
        </div>

        {/* الخصائص */}
        <div className="px-5">
          <div className="grid grid-cols-2 gap-2.5">
            {chip(Building2, 'نوع العقار', property.type)}
            {chip(Layers, 'نوع العرض', property.listing_type)}
            {chip(Maximize, 'المساحة', property.area ? `${property.area} م²` : '')}
            {chip(Ruler, 'عرض الشارع', property.street_width ? `${property.street_width} م` : '')}
            {!isLand && chip(BedDouble, 'غرف النوم', property.bedrooms || '')}
            {!isLand && chip(Bath, 'دورات المياه', property.bathrooms || '')}
            {!isLand && chip(Sofa, 'الصالات', property.halls || '')}
            {!isLand && chip(Home, 'عمر العقار', property.property_age ? `${property.property_age} سنة` : '')}
            {isLand && chip(Compass, 'الواجهة', property.facade || '')}
            {isLand && chip(Map, 'الأبعاد', dimensionText)}
            {property.plot_number && chip(FileText, 'رقم المخطط', property.plot_number)}
            {property.parcel_number && chip(FileText, 'رقم القطعة', property.parcel_number)}
            {property.rental_period && chip(CalendarClock, 'مدة الإيجار', property.rental_period)}
          </div>
        </div>

        {/* المزايا */}
        {(features.length > 0 || nearby.length > 0) && (
          <div className="px-5 pt-4">
            <div className="rounded-[1.7rem] bg-[#FAFAFA] border border-zinc-100 p-4">
              {features.length > 0 && (
                <div>
                  <p className="text-[12px] font-black text-zinc-950 mb-2.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" style={{ color: AIRBNB }} />
                    أبرز المزايا
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {features.map((feature) => (
                      <span key={feature} className="inline-flex items-center gap-1 rounded-full bg-white border border-zinc-200 px-2.5 py-1.5 text-[11px] font-black text-zinc-700">
                        <CheckCircle2 className="w-3 h-3" style={{ color: AIRBNB }} />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {nearby.length > 0 && (
                <div className={features.length ? 'mt-4 pt-4 border-t border-zinc-200' : ''}>
                  <p className="text-[12px] font-black text-zinc-950 mb-2.5 flex items-center gap-1.5">
                    <Map className="w-4 h-4" style={{ color: AIRBNB }} />
                    المواقع والخدمات القريبة
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {nearby.map((place, i) => (
                      <div key={i} className="flex items-center justify-between gap-2 rounded-2xl bg-white border border-zinc-200 px-3 py-2 text-[11px]">
                        <span className="font-black text-zinc-700">{place.label}</span>
                        <span className="font-bold text-zinc-400">{place.distance_label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* الفوتر */}
        <div className="p-5 pt-4">
          <div className="rounded-[1.8rem] bg-zinc-950 text-white p-4 overflow-hidden relative">
            <div className="absolute -left-10 -top-10 w-36 h-36 rounded-full opacity-20" style={{ backgroundColor: AIRBNB }} />

            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                  {officeLogo ? (
                    <img src={officeLogo} alt={officeName} className="w-full h-full object-cover" crossOrigin="anonymous" />
                  ) : (
                    <Building2 className="w-6 h-6 text-zinc-700" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-black text-white/60 mb-1">تواصل الآن</p>
                  <h3 className="text-[16px] font-black truncate">{officeName}</h3>
                  {contactNum && (
                    <div className="mt-1 flex items-center gap-1.5 text-[13px] font-black" dir="ltr">
                      <MessageCircle className="w-4 h-4" style={{ color: '#25D366' }} />
                      <span>{contactNum}</span>
                    </div>
                  )}
                  {!contactNum && agent?.phone && (
                    <div className="mt-1 flex items-center gap-1.5 text-[13px] font-black" dir="ltr">
                      <Phone className="w-4 h-4" style={{ color: AIRBNB }} />
                      <span>{agent.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-2 rounded-[1.1rem] shadow-inner text-center flex-shrink-0">
                <QRCodeSVG
                  value={`${window.location.origin}/property/${property.id}`}
                  size={78}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                />
                <p className="text-[9px] font-black text-zinc-500 mt-1">امسح لعرض العقار</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex w-full gap-3">
        <button
          onClick={downloadCard}
          className="flex-1 bg-zinc-950 hover:bg-black text-white py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99]"
        >
          <Download className="w-5 h-5" /> تصدير البطاقة كصورة
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="p-3.5 bg-zinc-100 text-zinc-600 rounded-2xl border border-zinc-200 hover:bg-zinc-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
