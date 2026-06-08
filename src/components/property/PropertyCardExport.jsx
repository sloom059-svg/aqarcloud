import React, { useRef } from 'react';
import { toast } from 'sonner';
import {
  MapPin, BedDouble, Bath, Maximize, MessageCircle, Map, Compass,
  CheckCircle2, Download, QrCode, X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const formatPrice = (p) => p ? new Intl.NumberFormat('en-US').format(p) : '';
const ARABIC = { بيع: 'للبيع', إيجار: 'للإيجار' };
const periodLabel = (p) => ({ سنوي: 'سنوياً', شهري: 'شهرياً', يومي: 'يومياً' }[p] || 'ريال');

export default function PropertyCardExport({ property, agent, onClose }) {
  const cardRef = useRef(null);
  if (!property) return null;

  const isLand = property.type === 'أرض';
  const priceText = property.price_negotiable ? 'على السوم' : (property.price ? formatPrice(property.price) : '—');
  const priceDetail = property.price_negotiable ? '' : (property.listing_type === 'إيجار' ? periodLabel(property.rental_period) : 'ريال');
  const dims = (property.length_street && property.length_depth) ? `${property.length_street} × ${property.length_depth}` : (property.street_width ? `شارع ${property.street_width}م` : '—');
  const officeName = agent?.office_name || agent?.full_name || 'مكتب عقاري';
  const contactNum = agent?.whatsapp || agent?.phone || '';

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `${property.title || 'عقار'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('تم حفظ البطاقة');
      onClose?.();
    } catch (_) {
      toast.error('تعذر حفظ البطاقة');
    }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto flex flex-col items-center">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
      `}} />
      <div ref={cardRef} dir="rtl" className="bg-white w-full rounded-3xl overflow-hidden shadow-2xl relative" style={{ fontFamily: 'Tajawal, sans-serif' }}>
        <div className="h-64 relative">
          <img src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'} alt="عقار" className="w-full h-full object-cover" crossOrigin="anonymous" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute top-4 right-4">
            <div className="bg-white text-[#15317E] px-3 py-1 rounded-lg text-xs font-bold shadow-md">{ARABIC[property.listing_type] || property.listing_type || 'للبيع'}</div>
          </div>
        </div>

        <div className="p-5 text-center">
          <h2 className="text-xl font-black text-[#15317E] mb-1.5">{property.title}</h2>
          <p className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1 mb-4">
            <MapPin className="w-3.5 h-3.5 text-[#15317E]" /> {property.city}{property.neighborhood ? `، ${property.neighborhood}` : ''}
          </p>
          <div className="inline-flex flex-col bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 mb-5 shadow-sm">
            <span className="text-[10px] text-slate-500 font-bold mb-1">السعر المطلوب</span>
            <span className="text-2xl font-black text-[#15317E]">{priceText} {priceDetail && <span className="text-[11px] font-normal text-slate-500">{priceDetail}</span>}</span>
            {isLand && property.facade && (
              <div className="mt-2 flex items-center justify-center gap-1.5 text-[#15317E] bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm">
                <Compass className="w-3.5 h-3.5" /> واجهة {property.facade}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-5">
            <div className="flex flex-col items-center gap-1.5">
              <Maximize className="w-5 h-5 text-[#15317E]" />
              <span className="text-[11px] font-bold text-slate-700">{property.area ? property.area + ' م²' : '—'}</span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            {isLand ? (
              <>
                <div className="flex flex-col items-center gap-1.5">
                  <Map className="w-5 h-5 text-[#15317E]" />
                  <span className="text-[11px] font-bold text-slate-700">{dims}</span>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div className="flex flex-col items-center gap-1.5">
                  <Compass className="w-5 h-5 text-[#15317E]" />
                  <span className="text-[11px] font-bold text-slate-700">{property.facade || '—'}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center gap-1.5">
                  <BedDouble className="w-5 h-5 text-[#15317E]" />
                  <span className="text-[11px] font-bold text-slate-700">{property.bedrooms || 0} نوم</span>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div className="flex flex-col items-center gap-1.5">
                  <Bath className="w-5 h-5 text-[#15317E]" />
                  <span className="text-[11px] font-bold text-slate-700">{property.bathrooms || 0} حمامات</span>
                </div>
              </>
            )}
          </div>

          {(property.features?.length > 0 || property.nearby_places?.length > 0) && (
            <div className="bg-slate-50/80 rounded-2xl p-4 text-right border border-slate-100">
              <div className="flex flex-col gap-4">
                {property.features?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-black text-[#15317E] mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> أبرز المواصفات</p>
                    <div className="flex flex-wrap gap-1.5">
                      {property.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1.5 rounded-lg text-[10px] font-bold text-slate-600 shadow-sm">
                          <CheckCircle2 className="w-3 h-3 text-[#15317E]" /> <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {property.nearby_places?.length > 0 && (
                  <>
                    <div className="w-full h-px bg-slate-200/60" />
                    <div>
                      <p className="text-[11px] font-black text-[#15317E] mb-2 flex items-center gap-1.5"><Map className="w-4 h-4" /> الموقع والخدمات</p>
                      <div className="flex flex-col gap-2">
                        {property.nearby_places.map((perk, i) => (
                          <div key={i} className="flex items-start gap-2 text-[10px] font-bold text-slate-600">
                            <MapPin className="w-3 h-3 text-[#15317E] flex-shrink-0 mt-0.5" /> <span className="leading-tight">{perk.label} · {perk.distance_label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#15317E] p-5 flex items-center justify-between text-white">
          <div>
            <p className="text-[10px] text-white/80 font-medium mb-1">{officeName}</p>
            {contactNum && (
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-white/90" />
                <span className="text-2xl font-black tracking-wider" dir="ltr">{contactNum}</span>
              </div>
            )}
          </div>
          <div className="bg-white p-1.5 rounded-xl shadow-inner">
            <QRCodeSVG
              value={`${window.location.origin}/property/${property.id}`}
              size={48}
              bgColor="#ffffff"
              fgColor="#15317E"
              level="M"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 flex w-full gap-3">
        <button onClick={downloadCard} className="flex-1 bg-[#15317E] hover:bg-[#0d1e4c] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all">
          <Download className="w-5 h-5" /> حفظ كصورة
        </button>
        {onClose && (
          <button onClick={onClose} className="p-3.5 bg-slate-100 text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-200 transition-all">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
