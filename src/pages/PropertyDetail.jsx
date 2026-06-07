import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  MapPin, BedDouble, Bath, Maximize, Phone, MessageCircle, Share2,
  Building, CheckCircle2, Map, Sofa, Compass, ChevronLeft, ChevronRight,
  Loader2, ArrowRight, Ruler
} from 'lucide-react';

const formatPrice = (p) => p ? new Intl.NumberFormat('en-US').format(p) : '';
const formatWa = (phone) => {
  if (!phone) return '';
  let p = phone.replace(/\D/g, '');
  if (p.startsWith('05')) return '966' + p.substring(1);
  if (p.startsWith('5') && p.length === 9) return '966' + p;
  return p;
};
const ARABIC = { بيع: 'للبيع', إيجار: 'للإيجار' };
const periodLabel = (p) => ({ سنوي: 'سنوياً', شهري: 'شهرياً', يومي: 'يومياً' }[p] || 'ريال');

export default function PropertyDetail() {
  const navigate = useNavigate();
  const propertyId = window.location.pathname.split('/').pop();
  const [currentImage, setCurrentImage] = useState(0);

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
    <div dir="rtl" className="min-h-screen flex justify-center items-center bg-[#F8FAFC]"><Loader2 className="w-8 h-8 animate-spin text-[#15317E]" /></div>
  );
  if (!property) return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <Building className="w-12 h-12 text-slate-300 mb-3" /><p className="text-slate-500 text-lg font-bold">العقار غير موجود</p>
    </div>
  );

  const isLand = property.type === 'أرض';
  const images = property.images?.length ? property.images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'];
  const priceText = property.price_negotiable ? 'على السوم' : (property.price ? formatPrice(property.price) : '');
  const priceDetail = property.price_negotiable ? '' : (property.listing_type === 'إيجار' ? periodLabel(property.rental_period) : 'ريال');
  const dims = (property.length_street && property.length_depth) ? `${property.length_street} × ${property.length_depth}` : null;
  const waNumber = formatWa(agent?.whatsapp || agent?.phone);
  const officeName = agent?.office_name || agent?.full_name || '';

  const shareProperty = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: property.title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success('تم نسخ الرابط');
    }
  };

  // المواصفات الرقمية (تظهر فقط لو لها قيمة)
  const stats = [];
  if (property.area) stats.push({ icon: Maximize, label: 'المساحة', value: `${property.area} م²` });
  if (isLand) {
    if (dims) stats.push({ icon: Map, label: 'الأبعاد', value: dims });
    if (property.street_width) stats.push({ icon: Ruler, label: 'عرض الشارع', value: `${property.street_width}م` });
    if (property.facade) stats.push({ icon: Compass, label: 'الواجهة', value: property.facade });
  } else {
    if (property.bedrooms) stats.push({ icon: BedDouble, label: 'غرف النوم', value: property.bedrooms });
    if (property.bathrooms) stats.push({ icon: Bath, label: 'دورات مياه', value: property.bathrooms });
    if (property.halls) stats.push({ icon: Sofa, label: 'الصالات', value: property.halls });
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] font-sans pb-28">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
      `}} />

      <div className="max-w-md mx-auto">
        {/* الصورة + المعرض */}
        <div className="relative h-72">
          <img src={images[currentImage]} alt={property.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#15317E] via-[#15317E]/40 to-transparent" />

          <button onClick={() => navigate(-1)} className="absolute top-5 right-5 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-colors">
            <ArrowRight className="w-5 h-5" />
          </button>
          <button onClick={shareProperty} className="absolute top-5 left-5 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-colors">
            <Share2 className="w-5 h-5" />
          </button>

          {images.length > 1 && (
            <>
              <button onClick={() => setCurrentImage(p => p > 0 ? p - 1 : images.length - 1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition">
                <ChevronRight className="w-5 h-5" />
              </button>
              <button onClick={() => setCurrentImage(p => p < images.length - 1 ? p + 1 : 0)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setCurrentImage(i)} className={`h-2 rounded-full transition-all ${i === currentImage ? 'bg-white w-6' : 'bg-white/50 w-2'}`} />
                ))}
              </div>
            </>
          )}

          <div className="absolute bottom-5 right-5 left-5 text-white">
            <span className="inline-block px-3 py-1 rounded-lg text-[11px] font-bold mb-2 shadow-sm bg-white/20 backdrop-blur-sm">{ARABIC[property.listing_type] || property.listing_type || 'للبيع'}</span>
            <h2 className="text-2xl font-black leading-tight mb-1">{property.title}</h2>
            {(property.city || property.neighborhood) && (
              <p className="text-sm text-white/80 flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {[property.neighborhood, property.city].filter(Boolean).join('، ')}</p>
            )}
          </div>
        </div>

        <div className="px-5 pt-6">
          {/* السعر + الواجهة */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">السعر المطلوب</p>
              <p className="text-3xl font-black text-[#15317E]">{priceText} {priceDetail && <span className="text-sm font-normal text-slate-500">{priceDetail}</span>}</p>
            </div>
            {isLand && property.facade && (
              <span className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#15317E] bg-slate-50 border border-slate-200 flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> واجهة {property.facade}
              </span>
            )}
          </div>

          {/* المواصفات الرقمية */}
          {stats.length > 0 && (
            <div className={`grid gap-2 sm:gap-3 mb-8 ${stats.length === 4 ? 'grid-cols-4' : stats.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {stats.map((s, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-2xl flex flex-col items-center justify-center text-center border border-slate-100">
                  <s.icon className="w-5 h-5 text-[#15317E] mb-2" />
                  <span className="text-[10px] text-slate-500 font-bold mb-0.5">{s.label}</span>
                  <span className="text-xs sm:text-sm font-black text-slate-900">{s.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* المميزات — تنزل كلها */}
          {property.features?.length > 0 && (
            <>
              <h3 className="text-lg font-bold text-[#15317E] mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#15317E]" /> مواصفات العقار</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {property.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white border border-slate-200 p-3.5 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
                    <div className="text-[#15317E] bg-slate-50 p-2 rounded-lg"><CheckCircle2 className="w-4 h-4" /></div>
                    {f}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* الوصف */}
          {property.description && (
            <>
              <h3 className="text-lg font-bold text-[#15317E] mb-3">الوصف</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-8 bg-slate-50 rounded-xl p-4 border border-slate-100">{property.description}</p>
            </>
          )}

          {/* الموقع والخدمات */}
          {property.nearby_places?.length > 0 && (
            <>
              <h3 className="text-lg font-bold text-[#15317E] mb-4 flex items-center gap-2"><Map className="w-5 h-5 text-[#15317E]" /> الموقع وأقرب الخدمات</h3>
              <div className="space-y-3 mb-8">
                {property.nearby_places.map((perk, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="text-[#15317E] bg-white p-2 rounded-lg shadow-sm border border-slate-100"><MapPin className="w-4 h-4" /></div>
                    <span className="text-sm font-medium text-slate-700">{perk.label} · {perk.distance_label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* شريط التواصل السفلي */}
      {(waNumber || agent?.phone) && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-slate-100 z-40">
          <div className="max-w-md mx-auto flex gap-3">
            {waNumber && (
              <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`أهلاً، أستفسر عن عقار: ${property.title}`)}`} target="_blank" rel="noreferrer" className="flex-1 bg-[#15317E] hover:bg-[#0d1e4c] text-white flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all shadow-md">
                <MessageCircle className="w-5 h-5" /> مراسلة واتساب
              </a>
            )}
            {agent?.phone && (
              <a href={`tel:${agent.phone}`} className="flex items-center justify-center px-6 bg-slate-100 hover:bg-slate-200 text-[#15317E] border border-slate-200 rounded-xl transition-all">
                <Phone className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
