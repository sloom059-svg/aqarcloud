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
  Car,
  Waves,
  Trees,
  Utensils,
  Wind,
  DoorOpen,
  ShieldCheck,
  Wifi,
  Plug,
  Snowflake,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const AIRBNB = '#FF385C';
const toEn = (value) => new Intl.NumberFormat('en-US').format(Number(value || 0));
const formatPrice = (p) => p ? toEn(p) : '';
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
  if (feature.includes('تبريد')) return Snowflake;
  return CheckCircle2;
};

function InfoBox({ icon: Icon, label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="info-box">
      <div className="info-label">
        <Icon className="info-icon" />
        {label}
      </div>
      <div className="info-value">{value}</div>
    </div>
  );
}

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

  const priceSub = property.price_on_request || property.price_negotiable
    ? ''
    : property.listing_type === 'إيجار'
    ? periodLabel(property.rental_period)
    : '';

  const dimensionText = property.length_street && property.length_depth
    ? `${toEn(property.length_street)} × ${toEn(property.length_depth)} م`
    : property.street_width
    ? `شارع ${toEn(property.street_width)} م`
    : '';

  const features = property.features?.slice(0, 8) || [];
  const nearby = property.nearby_places?.slice(0, 3) || [];

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      await document.fonts?.ready?.catch?.(() => {});
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: 470,
        windowHeight: cardRef.current.scrollHeight,
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
        .export-card, .export-card * {
          box-sizing: border-box;
          font-family: "Tajawal", "Segoe UI", Tahoma, Arial, sans-serif !important;
          text-rendering: geometricPrecision;
        }

        .export-card {
          width: 470px;
          background: #ffffff;
          border-radius: 32px;
          overflow: hidden;
          color: #09090b;
          direction: rtl;
        }

        .photo-wrap {
          height: 285px;
          position: relative;
          overflow: hidden;
          background: #f4f4f5;
        }

        .photo-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .photo-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,.58), rgba(0,0,0,.08), rgba(0,0,0,.18));
        }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          padding: 8px 13px;
          font-size: 12px;
          font-weight: 900;
          line-height: 1;
          box-shadow: 0 8px 22px rgba(0,0,0,.12);
        }

        .top-tags {
          position: absolute;
          top: 16px;
          right: 16px;
          left: 16px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .price-card {
          position: absolute;
          right: 16px;
          bottom: 16px;
          min-width: 172px;
          background: #fff;
          border-radius: 22px;
          padding: 14px 16px;
          box-shadow: 0 18px 38px rgba(0,0,0,.22);
        }

        .price-label {
          color: #a1a1aa;
          font-weight: 900;
          font-size: 11px;
          margin-bottom: 5px;
        }

        .price-value {
          color: #FF385C;
          font-size: 24px;
          font-weight: 900;
          line-height: 1.1;
          direction: ltr;
          text-align: right;
        }

        .area-stack {
          position: absolute;
          left: 16px;
          bottom: 16px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .content {
          padding: 24px 24px 18px;
        }

        .title {
          font-size: 25px;
          font-weight: 900;
          line-height: 1.22;
          margin: 0;
          color: #09090b;
        }

        .location {
          margin-top: 9px;
          color: #71717a;
          font-size: 14px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .desc {
          margin-top: 13px;
          color: #52525b;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.8;
        }

        .grid {
          padding: 0 24px 18px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .info-box {
          background: #fafafa;
          border: 1px solid #eeeeee;
          border-radius: 20px;
          padding: 11px 12px;
          min-height: 67px;
        }

        .info-label {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #a1a1aa;
          font-size: 11px;
          font-weight: 900;
          margin-bottom: 6px;
        }

        .info-icon {
          width: 14px;
          height: 14px;
          color: #FF385C;
          flex-shrink: 0;
        }

        .info-value {
          color: #09090b;
          font-size: 14px;
          font-weight: 900;
          line-height: 1.25;
        }

        .section {
          margin: 0 24px 18px;
          background: #fafafa;
          border: 1px solid #eeeeee;
          border-radius: 26px;
          padding: 16px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #09090b;
          font-size: 13px;
          font-weight: 900;
          margin-bottom: 11px;
        }

        .feature-list {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .feature-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fafafa;
          border: 1px solid #eeeeee;
          color: #71717a;
          border-radius: 999px;
          padding: 7px 10px;
          font-size: 12px;
          font-weight: 800;
        }

        .feature-chip svg {
          width: 13px;
          height: 13px;
          color: #FF385C;
          flex-shrink: 0;
        }

        .nearby-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          background: #fff;
          border: 1px solid #e4e4e7;
          border-radius: 18px;
          padding: 10px 12px;
          font-size: 12px;
          font-weight: 900;
          margin-top: 7px;
        }

        .footer {
          margin: 0 24px 24px;
          background: #09090b;
          color: white;
          border-radius: 28px;
          padding: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          position: relative;
          overflow: hidden;
        }

        .footer::before {
          content: "";
          position: absolute;
          width: 160px;
          height: 160px;
          border-radius: 999px;
          background: rgba(255,56,92,.28);
          left: -56px;
          top: -70px;
        }

        .office {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          position: relative;
          z-index: 1;
        }

        .office-logo {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .office-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .office-name {
          font-size: 17px;
          font-weight: 900;
          line-height: 1.25;
          max-width: 180px;
        }

        .contact {
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 15px;
          font-weight: 900;
          direction: ltr;
          justify-content: flex-end;
        }

        .qr-box {
          background: #fff;
          border-radius: 20px;
          padding: 9px;
          text-align: center;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }

        .qr-label {
          color: #71717a;
          font-size: 10px;
          font-weight: 900;
          margin-top: 4px;
        }
      `}} />

      <div ref={cardRef} className="export-card">
        <div className="photo-wrap">
          <img
            src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'}
            alt={property.title || 'عقار'}
            crossOrigin="anonymous"
          />
          <div className="photo-shade" />

          <div className="top-tags">
            <div style={{ display: 'flex', gap: 8 }}>
              {property.listing_type && <span className="pill" style={{ background: '#fff', color: '#09090b' }}>{property.listing_type}</span>}
              {property.type && <span className="pill" style={{ background: 'rgba(9,9,11,.82)', color: '#fff' }}>{property.type}</span>}
            </div>
          </div>

          <div className="price-card">
            <div className="price-label">السعر</div>
            <div className="price-value">{priceText}</div>
            {priceSub && <div style={{ color: '#a1a1aa', fontSize: 11, fontWeight: 800, marginTop: 4 }}>{priceSub}</div>}
          </div>

          <div className="area-stack">
            {property.facade && (
              <span className="pill" style={{ background: 'rgba(255,255,255,.96)', color: '#27272a' }}>
                <Compass style={{ width: 15, height: 15, color: AIRBNB }} />
                واجهة {property.facade}
              </span>
            )}
            {property.area && (
              <span className="pill" style={{ background: 'rgba(9,9,11,.58)', color: '#fff' }}>
                <Maximize style={{ width: 15, height: 15 }} />
                {toEn(property.area)} م²
              </span>
            )}
          </div>
        </div>

        <div className="content">
          <h2 className="title">{property.title || 'عقار مميز'}</h2>
          {location && (
            <div className="location">
              <MapPin style={{ width: 16, height: 16, color: '#71717a' }} />
              <span>{location}</span>
            </div>
          )}
          {property.description && <div className="desc">{property.description}</div>}
        </div>

        <div className="grid">
          <InfoBox icon={Building2} label="نوع العقار" value={property.type} />
          <InfoBox icon={Layers} label="نوع العرض" value={property.listing_type} />
          <InfoBox icon={Maximize} label="المساحة" value={property.area ? `${toEn(property.area)} م²` : ''} />
          <InfoBox icon={Ruler} label="عرض الشارع" value={property.street_width ? `${toEn(property.street_width)} م` : ''} />
          {!isLand && <InfoBox icon={BedDouble} label="غرف النوم" value={property.bedrooms ? toEn(property.bedrooms) : ''} />}
          {!isLand && <InfoBox icon={Bath} label="دورات المياه" value={property.bathrooms ? toEn(property.bathrooms) : ''} />}
          {!isLand && <InfoBox icon={Sofa} label="الصالات" value={property.halls ? toEn(property.halls) : ''} />}
          {!isLand && <InfoBox icon={Home} label="عمر العقار" value={property.property_age ? `${toEn(property.property_age)} سنة` : ''} />}
          {isLand && <InfoBox icon={Compass} label="الواجهة" value={property.facade} />}
          {isLand && <InfoBox icon={Map} label="الأبعاد" value={dimensionText} />}
          <InfoBox icon={FileText} label="رقم المخطط" value={property.plot_number} />
          <InfoBox icon={FileText} label="رقم القطعة" value={property.parcel_number} />
          <InfoBox icon={CalendarClock} label="مدة الإيجار" value={property.rental_period} />
        </div>

        {features.length > 0 && (
          <div className="section">
            <div className="section-title">
              <CheckCircle2 style={{ width: 16, height: 16, color: AIRBNB }} />
              أبرز المزايا
            </div>
            <div className="feature-list">
              {features.map((feature) => {
                const FeatureIcon = getFeatureIcon(feature);
                return (
                  <span key={feature} className="feature-chip">
                    <FeatureIcon />
                    {feature}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {nearby.length > 0 && (
          <div className="section">
            <div className="section-title">
              <Map style={{ width: 16, height: 16, color: AIRBNB }} />
              المواقع والخدمات القريبة
            </div>
            {nearby.map((place, i) => (
              <div className="nearby-row" key={i}>
                <span>{place.label}</span>
                <span style={{ color: '#a1a1aa' }}>{place.distance_label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="footer">
          <div className="office">
            <div className="office-logo">
              {officeLogo ? (
                <img src={officeLogo} alt={officeName} crossOrigin="anonymous" />
              ) : (
                <Building2 style={{ width: 27, height: 27, color: '#3f3f46' }} />
              )}
            </div>

            <div>
              <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 11, fontWeight: 900, marginBottom: 4 }}>تواصل الآن</div>
              <div className="office-name">{officeName}</div>
              {contactNum && (
                <div className="contact">
                  <MessageCircle style={{ width: 17, height: 17, color: '#25D366' }} />
                  <span>{contactNum}</span>
                </div>
              )}
              {!contactNum && agent?.phone && (
                <div className="contact">
                  <Phone style={{ width: 17, height: 17, color: AIRBNB }} />
                  <span>{agent.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="qr-box">
            <QRCodeSVG
              value={`${window.location.origin}/property/${property.id}`}
              size={86}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
            />
            <div className="qr-label">امسح لعرض العقار</div>
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
