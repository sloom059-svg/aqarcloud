import React, { useRef } from 'react';
import { toast } from 'sonner';
import {
  MapPin, Maximize, Compass, CheckCircle2, Download, X, Building2,
  Phone, Sofa, Home, FileText, CalendarClock, Car, Waves, Trees,
  Utensils, Wind, DoorOpen, ShieldCheck, Wifi, Plug, Snowflake,
  BedDouble, Bath, Layers, Ruler, MessageCircle, Sparkles,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const AIRBNB = '#FF385C';
const toEn = (value) => new Intl.NumberFormat('en-US').format(Number(value || 0));
const formatPrice = (p) => (p ? toEn(p) : '');
const periodLabel = (p) => ({ سنوي: 'سنوياً', شهري: 'شهرياً', يومي: 'يومياً' }[p] || '');

const getFeatureIcon = (feature = '') => {
  if (feature.includes('موقف') || feature.includes('سيارة')) return Car;
  if (feature.includes('مسبح')) return Waves;
  if (feature.includes('حديقة') || feature.includes('أشجار') || feature.includes('نخيل') || feature.includes('حوش') || feature.includes('مزروعات') || feature.includes('مسطح')) return Trees;
  if (feature.includes('مطبخ') || feature.includes('مطعم')) return Utensils;
  if (feature.includes('تكييف')) return Wind;
  if (feature.includes('تبريد') || feature.includes('ثلاجة')) return Snowflake;
  if (feature.includes('مدخل') || feature.includes('بوابة') || feature.includes('واجهة') || feature.includes('زجاج')) return DoorOpen;
  if (feature.includes('حارس') || feature.includes('أمن') || feature.includes('حراسة') || feature.includes('سور')) return ShieldCheck;
  if (feature.includes('انترنت') || feature.includes('واي')) return Wifi;
  if (feature.includes('كهرباء') || feature.includes('عداد') || feature.includes('مولد')) return Plug;
  if (feature.includes('راقي') || feature.includes('مميز') || feature.includes('فاخر') || feature.includes('فرصة')) return Sparkles;
  return CheckCircle2;
};

function SpecCell({ icon: Icon, label, value }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="spec-cell">
      <div className="spec-ic"><Icon className="spec-ic-svg" /></div>
      <div className="spec-label">{label}</div>
      <div className="spec-value">{value}</div>
    </div>
  );
}

function DetailRow({ label, value }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  );
}

export default function PropertyCardExport({ property, agent, onClose }) {
  const cardRef = useRef(null);
  if (!property) return null;

  const isLand = property.type === 'أرض';
  const isRent = property.listing_type === 'إيجار';
  const officeName = agent?.office_name || agent?.full_name || 'مكتب عقاري';
  const officeDesc = agent?.bio || 'خدمات عقارية متكاملة';
  const phoneNum = agent?.phone || '';
  const waNum = agent?.whatsapp || agent?.phone || '';
  const snap = agent?.social?.snapchat || agent?.snapchat || '';
  const officeLogo = agent?.office_logo_url || agent?.profile_image_url;
  const location = [property.city, property.neighborhood].filter(Boolean).join(' - ');

  const priceText = property.price_on_request
    ? 'بانتظار العروض'
    : property.price_negotiable
    ? 'على السوم'
    : `${formatPrice(property.price)}`;
  const isNumericPrice = !property.price_on_request && !property.price_negotiable && property.price;
  const priceLabel = isRent ? `إيجار ${periodLabel(property.rental_period) || 'سنوي'}` : 'السعر';

  const dimensionText = property.length_street && property.length_depth
    ? `${toEn(property.length_street)} × ${toEn(property.length_depth)} م`
    : '';

  const images = (property.images || []).filter(Boolean);
  const mainImage = images[0];
  const sideImages = images.slice(1, 4);

  const features = (property.features || []).slice(0, 5);
  const offerNo = property.offer_number || (property.id ? `A-${String(property.id).slice(0, 8)}` : '');

  const specs = isLand
    ? [
        { icon: Maximize, label: 'المساحة', value: property.area ? `${toEn(property.area)} م²` : '' },
        { icon: Ruler, label: 'عرض الشارع', value: property.street_width ? `${toEn(property.street_width)} م` : '' },
        { icon: Compass, label: 'الواجهة', value: property.facade },
        { icon: Building2, label: 'نوع الأرض', value: property.type },
        { icon: Ruler, label: 'الأبعاد', value: dimensionText },
        { icon: FileText, label: 'المخطط', value: property.plot_number },
        { icon: FileText, label: 'القطعة', value: property.parcel_number },
        { icon: Ruler, label: 'العمق', value: property.length_depth ? `${toEn(property.length_depth)} م` : '' },
      ]
    : [
        { icon: Maximize, label: 'المساحة', value: property.area ? `${toEn(property.area)} م²` : '' },
        { icon: Utensils, label: 'المطبخ', value: property.features?.some(f => f.includes('مطبخ')) ? 'نعم' : '' },
        { icon: Sofa, label: 'الصالات', value: property.halls ? toEn(property.halls) : '' },
        { icon: Bath, label: 'دورات المياه', value: property.bathrooms ? toEn(property.bathrooms) : '' },
        { icon: BedDouble, label: 'عدد الغرف', value: property.bedrooms ? toEn(property.bedrooms) : '' },
        { icon: CalendarClock, label: 'عمر العقار', value: property.property_age },
        { icon: Car, label: 'مدخل سياره', value: property.features?.some(f => f.includes('مدخل سيارة') || f.includes('موقف')) ? 'نعم' : '' },
        { icon: Home, label: 'ملحق', value: property.features?.some(f => f.includes('ملحق')) ? 'نعم' : '' },
        { icon: Waves, label: 'مسبح', value: property.features?.some(f => f.includes('مسبح')) ? 'نعم' : '' },
        { icon: Trees, label: 'حوش', value: property.features?.some(f => f.includes('حوش') || f.includes('حديقة')) ? 'نعم' : '' },
        { icon: Layers, label: 'التأثيث', value: property.features?.some(f => f.includes('مفروش')) ? 'مفروشة' : 'غير مفروشة' },
        { icon: Layers, label: 'عدد الأدوار', value: property.features?.some(f => f.includes('دور ثاني')) ? '2' : '' },
      ];
  const visibleSpecs = specs.filter(s => s.value !== undefined && s.value !== null && s.value !== '').slice(0, 12);

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      await document.fonts?.ready?.catch?.(() => {});
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#f1f0ee',
        scrollX: 0,
        scrollY: 0,
        windowWidth: 860,
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
    <div className="w-full max-w-[860px] mx-auto flex flex-col items-center">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        .ex-card, .ex-card * { font-family: 'Tajawal', sans-serif !important; box-sizing: border-box; }
        .ex-card { width: 860px; background: #f1f0ee; padding: 30px; direction: rtl; }
        .ex-inner { background: #faf9f7; border-radius: 28px; padding: 28px; }
        .ex-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
        .ex-head-side { display: flex; align-items: center; gap: 12px; }
        .ex-office-name { font-size: 20px; font-weight: 900; color: #1a1a1a; line-height: 1.3; }
        .ex-office-desc { font-size: 12px; font-weight: 600; color: #9a9a9a; }
        .ex-logo { width: 58px; height: 58px; border-radius: 16px; object-fit: cover; border: 1px solid #eee; }
        .ex-logo-ph { width: 58px; height: 58px; border-radius: 16px; background: #fff; border: 1px solid #eee; display: flex; align-items: center; justify-content: center; color: ${AIRBNB}; }
        .ex-title-wrap { text-align: center; flex: 1; }
        .ex-title { font-size: 30px; font-weight: 900; color: #1a1a1a; line-height: 1.2; }
        .ex-loc { font-size: 15px; font-weight: 700; color: #6b6b6b; margin-top: 4px; display: inline-flex; align-items: center; gap: 5px; }
        .ex-loc svg { width: 16px; height: 16px; color: ${AIRBNB}; }
        .ex-gallery { display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 24px; }
        .ex-gallery.has-side { grid-template-columns: 2.1fr 1fr; }
        .ex-main-img-wrap { position: relative; border-radius: 22px; overflow: hidden; aspect-ratio: 4/3; background: #e8e6e3; }
        .ex-main-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ex-side { display: grid; grid-template-rows: repeat(3, 1fr); gap: 12px; }
        .ex-side-img { width: 100%; height: 100%; object-fit: cover; border-radius: 18px; background: #e8e6e3; display: block; min-height: 90px; }
        .ex-offer { position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.95); border-radius: 14px; padding: 8px 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .ex-offer-l { font-size: 9px; font-weight: 700; color: #9a9a9a; }
        .ex-offer-v { font-size: 14px; font-weight: 900; color: ${AIRBNB}; }
        .ex-price-tag { position: absolute; bottom: 16px; right: 16px; background: rgba(255,255,255,0.96); border-radius: 18px; padding: 14px 22px; box-shadow: 0 8px 20px rgba(0,0,0,0.12); text-align: center; }
        .ex-price-l { font-size: 12px; font-weight: 700; color: #9a9a9a; display: flex; align-items: center; gap: 5px; justify-content: center; }
        .ex-price-l svg { width: 13px; height: 13px; }
        .ex-price-v { font-size: 30px; font-weight: 900; color: #1a1a1a; line-height: 1.1; margin: 2px 0; }
        .ex-price-c { font-size: 12px; font-weight: 700; color: #6b6b6b; }
        .ex-section-t { text-align: center; font-size: 17px; font-weight: 900; color: #444; margin: 26px 0 16px; position: relative; }
        .ex-section-t::before, .ex-section-t::after { content: ''; position: absolute; top: 50%; width: 26%; height: 1px; background: #e2e0dc; }
        .ex-section-t::before { right: 0; } .ex-section-t::after { left: 0; }
        .ex-specs { display: grid; grid-template-columns: repeat(6, 1fr); gap: 0; background: #fff; border-radius: 18px; overflow: hidden; }
        .spec-cell { padding: 16px 6px; text-align: center; border-left: 1px solid #f0eeea; border-bottom: 1px solid #f0eeea; }
        .spec-cell:nth-child(6n) { border-left: none; }
        .spec-ic { display: flex; justify-content: center; margin-bottom: 8px; }
        .spec-ic-svg { width: 22px; height: 22px; color: #b8b8b8; stroke-width: 1.6; }
        .spec-label { font-size: 11px; font-weight: 600; color: #9a9a9a; margin-bottom: 3px; }
        .spec-value { font-size: 14px; font-weight: 900; color: #1a1a1a; }
        .ex-feats { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
        .ex-feat { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 150px; padding: 8px; }
        .ex-feat-ic { width: 52px; height: 52px; border-radius: 50%; background: #f3f1ee; display: flex; align-items: center; justify-content: center; }
        .ex-feat-ic svg { width: 22px; height: 22px; color: #8a8a8a; stroke-width: 1.6; }
        .ex-feat-l { font-size: 12px; font-weight: 700; color: #6b6b6b; text-align: center; }
        .ex-foot { display: grid; grid-template-columns: 1.1fr 0.9fr 1.1fr; gap: 14px; margin-top: 26px; }
        .ex-fbox { background: #f3f1ee; border-radius: 18px; padding: 18px; }
        .ex-fbox-t { font-size: 14px; font-weight: 900; color: #1a1a1a; margin-bottom: 14px; text-align: center; }
        .ex-contact-row { display: flex; align-items: center; gap: 10px; margin-bottom: 11px; font-size: 14px; font-weight: 700; color: #333; direction: ltr; justify-content: flex-end; }
        .ex-contact-row svg { width: 17px; height: 17px; color: ${AIRBNB}; flex-shrink: 0; }
        .ex-qr-box { display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ex-qr-label { font-size: 11px; font-weight: 700; color: #9a9a9a; margin-top: 10px; text-align: center; line-height: 1.5; }
        .detail-row { display: flex; justify-content: space-between; gap: 8px; padding: 7px 0; border-bottom: 1px solid #e8e6e2; font-size: 12.5px; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: 600; color: #9a9a9a; }
        .detail-value { font-weight: 800; color: #1a1a1a; }
        .ex-bottom { display: flex; align-items: center; justify-content: space-between; margin-top: 22px; padding-top: 16px; border-top: 1px solid #e6e4e0; }
        .ex-bottom-l { font-size: 12px; font-weight: 700; color: #9a9a9a; display: flex; align-items: center; gap: 6px; }
        .ex-bottom-l svg { width: 15px; height: 15px; color: ${AIRBNB}; }
      `}} />

      <div ref={cardRef} className="ex-card">
        <div className="ex-inner">

          <div className="ex-head">
            <div className="ex-head-side">
              {officeLogo ? (
                <img src={officeLogo} alt="" className="ex-logo" crossOrigin="anonymous" />
              ) : (
                <div className="ex-logo-ph"><Building2 style={{ width: 28, height: 28 }} /></div>
              )}
            </div>
            <div className="ex-title-wrap">
              <div className="ex-title">{property.title}</div>
              {location && <div className="ex-loc"><MapPin />{location}</div>}
            </div>
            <div className="ex-head-side" style={{ flexDirection: 'column', alignItems: 'flex-start', textAlign: 'right' }}>
              <div className="ex-office-name">{officeName}</div>
              <div className="ex-office-desc">{officeDesc}</div>
            </div>
          </div>

          <div className={`ex-gallery ${sideImages.length ? 'has-side' : ''}`}>
            <div className="ex-main-img-wrap">
              {mainImage && <img src={mainImage} alt="" className="ex-main-img" crossOrigin="anonymous" />}
              {offerNo && (
                <div className="ex-offer">
                  <div className="ex-offer-l">رقم العرض</div>
                  <div className="ex-offer-v">{offerNo}</div>
                </div>
              )}
              <div className="ex-price-tag">
                <div className="ex-price-l"><CalendarClock />{priceLabel}</div>
                <div className="ex-price-v">{priceText}</div>
                {isNumericPrice && <div className="ex-price-c">ريال سعودي</div>}
              </div>
            </div>
            {sideImages.length > 0 && (
              <div className="ex-side">
                {sideImages.map((img, i) => (
                  <img key={i} src={img} alt="" className="ex-side-img" crossOrigin="anonymous" />
                ))}
              </div>
            )}
          </div>

          {visibleSpecs.length > 0 && (
            <>
              <div className="ex-section-t">مواصفات العقار</div>
              <div className="ex-specs">
                {visibleSpecs.map((s, i) => (
                  <SpecCell key={i} icon={s.icon} label={s.label} value={s.value} />
                ))}
              </div>
            </>
          )}

          {features.length > 0 && (
            <>
              <div className="ex-section-t">مميزات العقار</div>
              <div className="ex-feats">
                {features.map((f, i) => {
                  const Icon = getFeatureIcon(f);
                  return (
                    <div key={i} className="ex-feat">
                      <div className="ex-feat-ic"><Icon /></div>
                      <div className="ex-feat-l">{f}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <div className="ex-foot">
            <div className="ex-fbox">
              <div className="ex-fbox-t">للتواصل والاستفسار</div>
              {phoneNum && <div className="ex-contact-row"><span>{phoneNum}</span><Phone /></div>}
              {waNum && <div className="ex-contact-row"><span>{waNum}</span><MessageCircle /></div>}
              {snap && <div className="ex-contact-row"><span>{snap}</span><Compass /></div>}
            </div>

            <div className="ex-fbox ex-qr-box">
              {property.maps_url ? (
                <>
                  <QRCodeSVG value={property.maps_url} size={110} bgColor="#f3f1ee" fgColor="#1a1a1a" level="M" />
                  <div className="ex-qr-label">امسح الكود للوصول للموقع</div>
                </>
              ) : (
                <>
                  <QRCodeSVG value={typeof window !== 'undefined' ? window.location.href : 'https://aqacloud.com'} size={110} bgColor="#f3f1ee" fgColor="#1a1a1a" level="M" />
                  <div className="ex-qr-label">امسح الكود لعرض العقار</div>
                </>
              )}
            </div>

            <div className="ex-fbox">
              <div className="ex-fbox-t">تفاصيل إضافية</div>
              <DetailRow label="نوع العقار" value={property.type} />
              <DetailRow label="حالة العقار" value={property.status || 'متاح'} />
              <DetailRow label={priceLabel} value={isNumericPrice ? `${priceText} ريال` : priceText} />
              <DetailRow label="رقم رخصة الإعلان" value={property.ad_license || agent?.license_number} />
              <DetailRow label="تاريخ النشر" value={property.created_at ? new Date(property.created_at).toLocaleDateString('en-GB') : ''} />
              <DetailRow label="قابل للتفاوض" value={property.price_negotiable ? 'نعم' : 'لا'} />
            </div>
          </div>

          <div className="ex-bottom">
            <div className="ex-bottom-l"><ShieldCheck />موثوقون في خدمتكم</div>
            <div className="ex-bottom-l">كل العروض العقارية بين يديك<Home /></div>
          </div>

        </div>
      </div>

      <div className="flex gap-3 mt-5 w-full max-w-[470px]">
        <button onClick={downloadCard}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 text-white py-4 font-black text-sm transition-all hover:bg-black">
          <Download className="w-5 h-5" /> تصدير البطاقة كصورة
        </button>
        {onClose && (
          <button onClick={onClose}
            className="px-5 rounded-2xl bg-zinc-100 text-zinc-700 font-black text-sm transition-all hover:bg-zinc-200">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
