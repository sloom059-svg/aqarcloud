import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  Building, MapPin, Calendar, Maximize, Bath, BedDouble, Armchair,
  ChefHat, Sun, Diamond, Home, Crosshair, Phone, MessageCircle,
  Download, X, Car, Waves, Trees, ShieldCheck, Wifi, Snowflake,
  CheckCircle2, Sparkles, Ruler
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const toEn = (v) => new Intl.NumberFormat('en-US').format(Number(v || 0));
const formatPrice = (p) => (p ? toEn(p) : '');
const periodLabel = (p) => ({ سنوي: 'سنوياً', شهري: 'شهرياً', يومي: 'يومياً' }[p] || '');

const getFeatureIcon = (feature = '') => {
  if (feature.includes('موقف') || feature.includes('سيارة')) return Car;
  if (feature.includes('مسبح')) return Waves;
  if (feature.includes('حديقة') || feature.includes('حوش') || feature.includes('نخيل')) return Trees;
  if (feature.includes('تكييف')) return Snowflake;
  if (feature.includes('أمن') || feature.includes('حراسة') || feature.includes('سور')) return ShieldCheck;
  if (feature.includes('انترنت') || feature.includes('واي')) return Wifi;
  if (feature.includes('راقي') || feature.includes('فاخر') || feature.includes('مميز')) return Sparkles;
  if (feature.includes('إضاءة') || feature.includes('ضوء')) return Sun;
  if (feature.includes('موقع')) return Crosshair;
  return CheckCircle2;
};

export default function PropertyCardExport({ property, agent, onClose }) {
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedImage, setExportedImage] = useState(null);

  if (!property) return null;

  // ── بيانات العقار الحقيقية ──
  const isRent = property.listing_type === 'إيجار';
  const isLand = property.type === 'أرض';

  const priceText = property.price_on_request
    ? 'بانتظار العروض'
    : property.price_negotiable
    ? 'على السوم'
    : formatPrice(property.price);
  const isNumericPrice = !property.price_on_request && !property.price_negotiable && property.price;
  const priceLabel = isRent ? `إيجار ${periodLabel(property.rental_period) || 'سنوياً'}` : 'السعر';

  const images = (property.images || []).filter(Boolean);
  const mainImage = images[0];
  const subImage1 = images[1];
  const subImage2 = images[2];

  const location = [property.city, property.neighborhood].filter(Boolean).join(' - ');
  const offerNo = property.offer_number || (property.id ? `A-${String(property.id).slice(0, 8)}` : '');
  const features = (property.features || []).slice(0, 4);

  // ── بيانات الوسيط الحقيقية ──
  const officeName = agent?.office_name || agent?.full_name || 'مكتب عقاري';
  const officeDesc = agent?.bio || 'خدمات عقارية متكاملة';
  const officeLogo = agent?.office_logo_url || agent?.profile_image_url;
  const phoneNum = agent?.phone || '';
  const waNum = agent?.whatsapp || agent?.phone || '';
  const snap = agent?.social?.snapchat || agent?.snapchat || '';
  const licenseNo = property.ad_license || agent?.license_number || '';

  // ── مواصفات العقار — تظهر دائماً ──
  const visibleSpecs = isLand
    ? [
        { label: 'المساحة',       value: property.area           ? `${toEn(property.area)} م²`                              : '—', Icon: Maximize },
        { label: 'نوع الأرض',    value: property.type           || '—',                                                           Icon: Home },
        { label: 'الواجهة',      value: property.facade          || '—',                                                           Icon: Crosshair },
        { label: 'عرض الشارع',  value: property.street_width   ? `${toEn(property.street_width)} م`                   : '—', Icon: Maximize },
        { label: 'على الشارع',  value: property.length_street  ? `${toEn(property.length_street)} م`                  : '—', Icon: Ruler },
        { label: 'العمق',         value: property.length_depth   ? `${toEn(property.length_depth)} م`                   : '—', Icon: Ruler },
      ]
    : [
        { label: 'المساحة',        value: property.area          ? `${toEn(property.area)} م²`  : '—', Icon: Maximize },
        { label: 'عمر العقار',    value: property.property_age   || '—',                        Icon: Calendar },
        { label: 'عدد الغرف',     value: property.bedrooms       ? toEn(property.bedrooms)      : '—', Icon: BedDouble },
        { label: 'دورات المياه',  value: property.bathrooms      ? toEn(property.bathrooms)     : '—', Icon: Bath },
        { label: 'الصالات',       value: property.halls          ? toEn(property.halls)         : '—', Icon: Armchair },
        { label: 'المطبخ',        value: property.kitchens ? toEn(property.kitchens) : (property.features?.some(f => f.includes('مطبخ')) ? '1' : '—'), Icon: ChefHat },
      ];

  // ── QR Code URL ──
  const qrUrl = property.maps_url
    || (typeof window !== 'undefined'
        ? `${window.location.origin}/agent/${agent?.id || ''}#${property.id}`
        : 'https://aqarcloud.com');

  // ── التصدير كصورة ──
  const handleExport = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
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
        windowWidth: 800,
        windowHeight: cardRef.current.scrollHeight,
      });
      const dataUrl = canvas.toDataURL('image/png');
      setExportedImage(dataUrl);
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ أثناء إنشاء الصورة');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto" style={{ fontFamily: "'Tajawal', sans-serif", direction: 'rtl' }}>
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');` }} />

      {/* أزرار التحكم */}
      <div className="w-full flex justify-between mb-4 gap-3">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 bg-zinc-950 hover:bg-black text-white font-bold py-2.5 px-6 rounded-xl shadow transition text-sm"
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'جاري الإنشاء...' : 'تصدير البطاقة كصورة'}
        </button>
        {onClose && (
          <button onClick={onClose} className="p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* البطاقة */}
      <div className="bg-gray-100 p-6 rounded-2xl w-full flex justify-center overflow-x-auto">
        <div
          ref={cardRef}
          id="card-to-export"
          className="bg-white w-[800px] min-w-[800px] rounded-2xl shadow-xl overflow-hidden pb-8 relative"
          dir="rtl"
          style={{ fontFamily: "'Tajawal', sans-serif" }}
        >
          {/* ── الهيدر ── */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            {/* شعار المكتب */}
            <div className="flex flex-col items-center min-w-[120px]">
              {officeLogo ? (
                <img
                  src={officeLogo}
                  alt={officeName}
                  crossOrigin="anonymous"
                  className="w-14 h-14 rounded-xl object-cover border border-gray-200 mb-1"
                />
              ) : (
                <div className="w-14 h-14 border-2 border-gray-800 rounded-xl flex items-center justify-center mb-1">
                  <Building className="w-7 h-7 text-gray-800" />
                </div>
              )}
              <span className="text-sm font-bold text-gray-800 text-center leading-tight">{officeName}</span>
              <span className="text-[10px] text-gray-400 text-center">{officeDesc}</span>
            </div>

            {/* العنوان والموقع */}
            <div className="text-center flex-grow px-4">
              <h1 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{property.title}</h1>
              {location && (
                <div className="flex items-center justify-center text-gray-500 gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-base font-semibold">{location}</span>
                </div>
              )}
            </div>

            {/* نوع العرض */}
            <div className="flex flex-col items-center min-w-[90px]">
              <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-black border border-red-100">
                {isRent ? 'للإيجار' : 'للبيع'}
              </span>
              {property.status && (
                <span className="mt-1.5 text-[10px] text-gray-400 font-bold">{property.status}</span>
              )}
            </div>
          </div>

          {/* ── الصور ── */}
          <div className="relative p-5">
            {/* badge رقم العرض */}
            {offerNo && (
              <div className="absolute top-9 right-9 z-10 bg-white/95 backdrop-blur rounded-xl p-2.5 shadow-md border border-gray-100 text-center">
                <div className="text-[9px] text-gray-400 font-bold">رقم العرض</div>
                <div className="font-black text-gray-800 text-xs">{offerNo}</div>
              </div>
            )}

            {/* badge السعر */}
            <div className="absolute bottom-9 right-9 z-10 bg-white/95 backdrop-blur rounded-xl p-3 shadow-md border border-gray-100 text-center min-w-[130px]">
              <div className="flex items-center justify-center gap-1 text-gray-400 text-[10px] font-bold mb-1 border-b border-gray-100 pb-1">
                <Calendar className="w-3 h-3" />
                <span>{priceLabel}</span>
              </div>
              <div className="text-2xl font-black text-gray-900 leading-none">{priceText}</div>
              {isNumericPrice && <div className="text-[11px] text-gray-500 font-semibold mt-0.5">ريال سعودي</div>}
            </div>

            {/* شبكة الصور */}
            <div className="grid gap-3 h-[260px]" style={{ gridTemplateColumns: subImage1 || subImage2 ? '2fr 1fr' : '1fr' }}>
              {/* الصورة الرئيسية */}
              <div className="rounded-xl overflow-hidden bg-gray-100 h-full">
                {mainImage
                  ? <img src={mainImage} alt="" crossOrigin="anonymous" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-gray-300"><Home className="w-16 h-16" /></div>
                }
              </div>
              {/* الصور الجانبية */}
              {(subImage1 || subImage2) && (
                <div className="grid grid-rows-2 gap-3 h-full">
                  <div className="rounded-xl overflow-hidden bg-gray-100">
                    {subImage1
                      ? <img src={subImage1} alt="" crossOrigin="anonymous" className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-gray-100" />
                    }
                  </div>
                  <div className="rounded-xl overflow-hidden bg-gray-100">
                    {subImage2
                      ? <img src={subImage2} alt="" crossOrigin="anonymous" className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-gray-100" />
                    }
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── المواصفات ── */}
          {(
            <div className="px-8 mt-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px bg-gray-100 flex-grow" />
                <span className="text-gray-600 font-black text-base">مواصفات العقار</span>
                <div className="h-px bg-gray-100 flex-grow" />
              </div>
              <div className="grid grid-cols-6 gap-3 text-center">
                {visibleSpecs.map(({ label, value, Icon }, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl mb-2 text-gray-500">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-gray-400 mb-0.5">{label}</span>
                    <span className="font-black text-sm text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── المميزات ── */}
          {features.length > 0 && (
            <div className="px-8 mt-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px bg-gray-100 flex-grow" />
                <span className="text-gray-600 font-black text-base">مميزات العقار</span>
                <div className="h-px bg-gray-100 flex-grow" />
              </div>
              <div className="flex justify-around text-center px-6">
                {features.map((f, i) => {
                  const Icon = getFeatureIcon(f);
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-400" />
                      </div>
                      <span className="text-xs text-gray-600 font-semibold max-w-[80px] text-center leading-tight">{f}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── الفوتر: تواصل + QR + تفاصيل ── */}
          <div className="px-8 mt-8 grid grid-cols-3 gap-5">
            {/* للتواصل */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <h4 className="text-center font-black text-gray-700 mb-3 border-b border-gray-100 pb-2 text-sm">للتواصل والاستفسار</h4>
              <div className="space-y-2.5 text-sm">
                {phoneNum && (
                  <div className="flex items-center gap-2.5" dir="ltr">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-bold text-gray-800 flex-grow text-right">{phoneNum}</span>
                  </div>
                )}
                {waNum && (
                  <div className="flex items-center gap-2.5" dir="ltr">
                    <MessageCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="font-bold text-gray-800 flex-grow text-right">{waNum}</span>
                  </div>
                )}
                {snap && (
                  <div className="flex items-center gap-2.5" dir="ltr">
                    <span className="text-yellow-400 w-4 font-black text-center flex-shrink-0 text-base">@</span>
                    <span className="font-bold text-gray-800 flex-grow text-right truncate">{snap}</span>
                  </div>
                )}
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center gap-2">
              <QRCodeSVG value={qrUrl} size={100} bgColor="#ffffff" fgColor="#1a1a1a" level="M" />
              <span className="text-[10px] text-gray-400 font-bold text-center leading-tight">
                {property.maps_url ? 'امسح الكود للوصول للموقع' : 'امسح الكود لعرض العقار'}
              </span>
            </div>

            {/* تفاصيل إضافية */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <h4 className="text-center font-black text-gray-700 mb-3 border-b border-gray-100 pb-2 text-sm">تفاصيل إضافية</h4>
              <table className="w-full text-xs text-right">
                <tbody>
                  {property.type && (
                    <tr className="border-b border-gray-100">
                      <td className="py-1.5 text-gray-400 font-semibold">نوع العقار</td>
                      <td className="py-1.5 font-black text-gray-800 text-left">{property.type}</td>
                    </tr>
                  )}
                  {(property.status) && (
                    <tr className="border-b border-gray-100">
                      <td className="py-1.5 text-gray-400 font-semibold">حالة العقار</td>
                      <td className="py-1.5 font-black text-gray-800 text-left">{property.status || 'متاح'}</td>
                    </tr>
                  )}
                  {licenseNo && (
                    <tr className="border-b border-gray-100">
                      <td className="py-1.5 text-gray-400 font-semibold">رقم الإعلان</td>
                      <td className="py-1.5 font-black text-gray-800 text-left text-[10px]">{licenseNo}</td>
                    </tr>
                  )}
                  {property.price_negotiable !== undefined && (
                    <tr>
                      <td className="py-1.5 text-gray-400 font-semibold">قابل للتفاوض</td>
                      <td className="py-1.5 font-black text-gray-800 text-left">{property.price_negotiable ? 'نعم' : 'لا'}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* معاينة + تحميل الصورة */}
      {exportedImage && (
        <div className="fixed inset-0 bg-black/80 z-[300] flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-lg font-black text-gray-800">تم إنشاء البطاقة بنجاح!</h3>
              <button onClick={() => setExportedImage(null)} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-grow overflow-auto border rounded-xl bg-gray-50 flex items-center justify-center p-4">
              <img src={exportedImage} alt="بطاقة العقار" className="shadow-lg rounded-xl max-w-full h-auto" />
            </div>
            <div className="mt-5 flex justify-center">
              <a
                href={exportedImage}
                download={`${property.title || 'property'}.png`}
                className="bg-green-600 hover:bg-green-700 text-white font-black py-3 px-10 rounded-xl shadow transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> تحميل الصورة
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
