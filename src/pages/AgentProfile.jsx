import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import {
  MapPin, BedDouble, Bath, Maximize, Phone, MessageCircle, Share2,
  Building, CheckCircle2, X, Map, Sofa, Compass, Download, QrCode,
  BadgeCheck, Loader2, Sparkles
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

export default function AgentProfile() {
  const agentId = window.location.pathname.split('/').pop();
  const [selected, setSelected] = useState(null);
  const [promoCard, setPromoCard] = useState(null);
  const cardRef = useRef(null);

  const { data: agent, isLoading: agentLoading } = useQuery({
    queryKey: ['agent-profile', agentId],
    queryFn: async () => (await base44.entities.User.filter({ id: agentId }))[0],
    enabled: !!agentId,
  });

  const { data: properties = [], isLoading: propsLoading } = useQuery({
    queryKey: ['agent-properties', agentId],
    queryFn: () => base44.entities.Property.filter({ created_by_id: agentId, status: 'نشط' }, '-created_date'),
    enabled: !!agentId,
  });

  const officeName = agent?.office_name || agent?.full_name || 'مكتب عقاري';
  const officeLogo = agent?.office_logo_url || agent?.avatar_url;
  const waNumber = formatWa(agent?.whatsapp || agent?.phone);

  const shareProperty = (e, prop) => {
    e?.stopPropagation();
    const url = `${window.location.origin}/property/${prop.id}`;
    navigator.clipboard.writeText(url);
    toast.success('تم نسخ رابط العقار');
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `${promoCard.title || 'عقار'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('تم حفظ البطاقة');
      setPromoCard(null);
    } catch (_) {
      toast.error('تعذر حفظ البطاقة');
    }
  };

  // ── معطيات عرض العقار ──
  const isLand = (p) => p.type === 'أرض';
  const priceText = (p) => p.price_negotiable ? 'على السوم' : (p.price ? formatPrice(p.price) : '—');
  const priceDetail = (p) => p.price_negotiable ? '' : (p.listing_type === 'إيجار' ? periodLabel(p.rental_period) : 'ريال');
  const dims = (p) => (p.length_street && p.length_depth) ? `${p.length_street} × ${p.length_depth}` : (p.street_width ? `شارع ${p.street_width}م` : null);

  // المواصفات اللي تطلع بأسفل البطاقة — فقط الموجود
  const cardStats = (p) => {
    const s = [];
    if (p.area) s.push({ icon: Maximize, value: `${p.area} م²` });
    if (isLand(p)) {
      const d = dims(p);
      if (d) s.push({ icon: Map, value: d });
      if (p.facade) s.push({ icon: Compass, value: p.facade });
    } else {
      if (p.bedrooms) s.push({ icon: BedDouble, value: `${p.bedrooms} غرف` });
      if (p.bathrooms) s.push({ icon: Bath, value: `${p.bathrooms} حمامات` });
    }
    return s;
  };

  // مواصفات النافذة التفصيلية — فقط الموجود
  const modalStats = (p) => {
    const s = [];
    if (p.area) s.push({ icon: Maximize, label: 'المساحة', value: `${p.area} م²` });
    if (isLand(p)) {
      const d = dims(p);
      if (d) s.push({ icon: Map, label: 'الأبعاد', value: d });
      if (p.street_width) s.push({ icon: Maximize, label: 'عرض الشارع', value: `${p.street_width}م` });
      if (p.facade) s.push({ icon: Compass, label: 'الواجهة', value: p.facade });
    } else {
      if (p.bedrooms) s.push({ icon: BedDouble, label: 'غرف النوم', value: p.bedrooms });
      if (p.bathrooms) s.push({ icon: Bath, label: 'دورات مياه', value: p.bathrooms });
      if (p.halls) s.push({ icon: Sofa, label: 'الصالات', value: p.halls });
    }
    return s;
  };

  if (agentLoading) return (
    <div dir="rtl" className="min-h-screen flex justify-center items-center bg-[#F8FAFC]"><Loader2 className="w-8 h-8 animate-spin text-[#15317E]" /></div>
  );
  if (!agent) return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <Building className="w-12 h-12 text-slate-300 mb-3" /><p className="text-slate-500 text-lg font-bold">الوسيط غير موجود</p>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] font-sans pb-24">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
      `}} />

      {/* الهيدر */}
      <header className="bg-[#15317E] text-white shadow-lg sticky top-0 z-40 rounded-b-[2rem]">
        <div className="max-w-md mx-auto px-5 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-white/20 shadow-sm overflow-hidden flex-shrink-0">
              {officeLogo ? <img src={officeLogo} alt="شعار" className="w-full h-full object-cover" /> : <Building className="w-6 h-6 text-[#15317E]" />}
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-base font-black tracking-wide leading-tight">{officeName}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {agent.city && (
                  <p className="text-[10px] text-white/90 flex items-center gap-1 font-medium"><MapPin className="w-3 h-3" /> {agent.city}</p>
                )}
                {agent.license_number && (
                  <>
                    <div className="w-1 h-1 bg-white/40 rounded-full" />
                    <p className="text-[10px] text-white/90 flex items-center gap-1 font-medium">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" /> رخصة فال: {agent.license_number}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {waNumber && (
              <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer" className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all border border-white/10 shadow-sm" title="مراسلة واتساب">
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
            )}
            {agent.phone && (
              <a href={`tel:${agent.phone}`} className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all border border-white/10 shadow-sm" title="اتصال">
                <Phone className="w-5 h-5 text-white" />
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-md mx-auto pt-6">
        <main className="px-4 space-y-5">
          {propsLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#15317E]" /></div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm">
              <Building className="w-12 h-12 text-slate-300 mb-3 mx-auto" />
              <p className="text-slate-500 font-bold">لا توجد عقارات حالياً</p>
            </div>
          ) : properties.map((property) => (
            <div key={property.id} onClick={() => setSelected(property)}
              className="bg-white rounded-[1.5rem] p-2.5 shadow-xl shadow-slate-200/50 border border-slate-100 cursor-pointer transform transition-transform hover:-translate-y-1">
              <div className="relative h-56 rounded-[1.2rem] overflow-hidden">
                <img src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'} alt={property.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#15317E]/90 via-[#15317E]/20 to-transparent" />

                <div className="absolute top-3 right-3">
                  <span className="px-4 py-1.5 rounded-lg text-xs font-bold text-[#15317E] bg-white/95 backdrop-blur-md shadow-sm">
                    {ARABIC[property.listing_type] || property.listing_type || 'للبيع'}
                  </span>
                </div>

                <div className="absolute top-3 left-3 flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setPromoCard(property); }} className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-lg transition-colors border border-white/20" title="تنزيل كبطاقة إعلانية">
                    <Download className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => shareProperty(e, property)} className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-lg transition-colors border border-white/20" title="نسخ الرابط">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col justify-end mt-1">
                      <h3 className="text-xl font-bold mb-1.5">{property.title}</h3>
                      <p className="text-xs text-white/80 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> {property.city}{property.neighborhood ? `، ${property.neighborhood}` : ''}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-left">
                        <p className="text-xl font-black leading-none">{priceText(property)}</p>
                        {priceDetail(property) && <p className="text-[10px] text-white/70">{priceDetail(property)}</p>}
                      </div>
                      {isLand(property) && property.facade && (
                        <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-white bg-black/40 backdrop-blur-md shadow-sm flex items-center gap-1.5 border border-white/20">
                          <Compass className="w-3.5 h-3.5" /> واجهة {property.facade}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {cardStats(property).length > 0 && (
                <div className="flex items-center justify-around px-4 py-3.5 bg-slate-50 mt-2.5 rounded-[1rem]">
                  {cardStats(property).map((s, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <div className="w-px h-6 bg-slate-200" />}
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <s.icon className="w-4 h-4 text-[#15317E]" />
                        <span className="text-xs font-bold">{s.value}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          ))}
        </main>
      </div>

      {/* النافذة التفصيلية */}
      {selected && !promoCard && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-[#15317E]/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full sm:w-[450px] h-[92vh] sm:h-auto sm:max-h-[90vh] rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
            <div className="relative h-64 flex-shrink-0">
              <img src={selected.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'} alt={selected.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#15317E] via-[#15317E]/40 to-transparent" />
              <button onClick={() => setSelected(null)} className="absolute top-5 right-5 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-5 right-5 left-5 text-white">
                <span className="inline-block px-3 py-1 rounded-lg text-[11px] font-bold mb-2 shadow-sm bg-white/20 backdrop-blur-sm">{ARABIC[selected.listing_type] || selected.listing_type || 'للبيع'}</span>
                <h2 className="text-2xl font-black leading-tight mb-1">{selected.title}</h2>
                <p className="text-sm text-white/80 flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {selected.city}{selected.neighborhood ? `، ${selected.neighborhood}` : ''}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pb-28">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">السعر المطلوب</p>
                  <p className="text-3xl font-black text-[#15317E]">{priceText(selected)} {priceDetail(selected) && <span className="text-sm font-normal text-slate-500">{priceDetail(selected)}</span>}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <button onClick={(e) => shareProperty(e, selected)} className="p-3.5 bg-slate-50 text-[#15317E] rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  {isLand(selected) && selected.facade && (
                    <span className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#15317E] bg-slate-50 border border-slate-200 flex items-center gap-1.5">
                      <Compass className="w-4 h-4" /> واجهة {selected.facade}
                    </span>
                  )}
                </div>
              </div>

              <div className={`grid gap-2 sm:gap-3 mb-8 ${modalStats(selected).length >= 4 ? 'grid-cols-4' : modalStats(selected).length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {modalStats(selected).map((s, i) => (
                  <div key={i} className="bg-slate-50 p-2 sm:p-3 rounded-2xl flex flex-col items-center justify-center text-center border border-slate-100">
                    <s.icon className="w-5 h-5 text-[#15317E] mb-2" />
                    <span className="text-[10px] text-slate-500 font-bold mb-0.5">{s.label}</span>
                    <span className="text-xs sm:text-sm font-black text-slate-900">{s.value}</span>
                  </div>
                ))}
              </div>

              {selected.features?.length > 0 && (
                <>
                  <h3 className="text-lg font-bold text-[#15317E] mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#15317E]" /> مواصفات العقار</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {selected.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white border border-slate-200 p-3.5 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
                        <div className="text-[#15317E] bg-slate-50 p-2 rounded-lg"><CheckCircle2 className="w-4 h-4" /></div>
                        {f}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {selected.description && (
                <>
                  <h3 className="text-lg font-bold text-[#15317E] mb-3">الوصف</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-8 bg-slate-50 rounded-xl p-4 border border-slate-100">{selected.description}</p>
                </>
              )}

              {selected.nearby_places?.length > 0 && (
                <>
                  <h3 className="text-lg font-bold text-[#15317E] mb-4 flex items-center gap-2"><Map className="w-5 h-5 text-[#15317E]" /> الموقع وأقرب الخدمات</h3>
                  <div className="space-y-3">
                    {selected.nearby_places.map((perk, i) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <div className="text-[#15317E] bg-white p-2 rounded-lg shadow-sm border border-slate-100"><MapPin className="w-4 h-4" /></div>
                        <span className="text-sm font-medium text-slate-700">{perk.label} · {perk.distance_label}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-slate-100 flex gap-3">
              {waNumber && (
                <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`أهلاً، أستفسر عن عقار: ${selected.title}`)}`} target="_blank" rel="noreferrer" className="flex-1 bg-[#15317E] hover:bg-[#0d1e4c] text-white flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all shadow-md">
                  <MessageCircle className="w-5 h-5" /> مراسلة واتساب
                </a>
              )}
              {agent.phone && (
                <a href={`tel:${agent.phone}`} className="flex items-center justify-center px-6 bg-slate-100 hover:bg-slate-200 text-[#15317E] border border-slate-200 rounded-xl transition-all">
                  <Phone className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* البطاقة الإعلانية */}
      {promoCard && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#15317E]/90 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-[400px] flex flex-col items-center my-auto py-4">
            <div ref={cardRef} className="bg-white w-full rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="h-48 relative">
                <img src={promoCard.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'} alt="عقار" className="w-full h-full object-cover" crossOrigin="anonymous" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#15317E]/80 to-transparent" />
                <div className="absolute top-4 right-4">
                  <div className="bg-white text-[#15317E] px-3 py-1 rounded-lg text-xs font-bold shadow-md">{ARABIC[promoCard.listing_type] || promoCard.listing_type || 'للبيع'}</div>
                </div>
              </div>

              <div className="p-5 text-center">
                <h2 className="text-xl font-black text-[#15317E] mb-1.5">{promoCard.title}</h2>
                <p className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-[#15317E]" /> {promoCard.city}{promoCard.neighborhood ? `، ${promoCard.neighborhood}` : ''}
                </p>
                <div className="inline-flex flex-col bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 mb-5 shadow-sm">
                  <span className="text-[10px] text-slate-500 font-bold mb-1">السعر المطلوب</span>
                  <span className="text-2xl font-black text-[#15317E]">{priceText(promoCard)} {priceDetail(promoCard) && <span className="text-[11px] font-normal text-slate-500">{priceDetail(promoCard)}</span>}</span>
                  {isLand(promoCard) && promoCard.facade && (
                    <div className="mt-2 flex items-center justify-center gap-1.5 text-[#15317E] bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm">
                      <Compass className="w-3.5 h-3.5" /> واجهة {promoCard.facade}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-4 sm:gap-6 mb-5">
                  <div className="flex flex-col items-center gap-1.5">
                    <Maximize className="w-5 h-5 text-[#15317E]" />
                    <span className="text-[11px] font-bold text-slate-700">{promoCard.area ? promoCard.area + ' م²' : ''}</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200" />
                  {isLand(promoCard) ? (
                    <>
                      <div className="flex flex-col items-center gap-1.5">
                        <Map className="w-5 h-5 text-[#15317E]" />
                        <span className="text-[11px] font-bold text-slate-700">{dims(promoCard)}</span>
                      </div>
                      <div className="w-px h-6 bg-slate-200" />
                      <div className="flex flex-col items-center gap-1.5">
                        <Compass className="w-5 h-5 text-[#15317E]" />
                        <span className="text-[11px] font-bold text-slate-700">{promoCard.facade || ''}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col items-center gap-1.5">
                        <BedDouble className="w-5 h-5 text-[#15317E]" />
                        <span className="text-[11px] font-bold text-slate-700">{promoCard.bedrooms || 0} نوم</span>
                      </div>
                      <div className="w-px h-6 bg-slate-200" />
                      <div className="flex flex-col items-center gap-1.5">
                        <Bath className="w-5 h-5 text-[#15317E]" />
                        <span className="text-[11px] font-bold text-slate-700">{promoCard.bathrooms || 0} حمامات</span>
                      </div>
                    </>
                  )}
                </div>

                {(promoCard.features?.length > 0 || promoCard.nearby_places?.length > 0) && (
                  <div className="bg-slate-50/80 rounded-2xl p-4 text-right border border-slate-100">
                    <div className="flex flex-col gap-4">
                      {promoCard.features?.length > 0 && (
                        <div>
                          <p className="text-[11px] font-black text-[#15317E] mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> أبرز المواصفات</p>
                          <div className="flex flex-wrap gap-1.5">
                            {promoCard.features.map((f, i) => (
                              <div key={i} className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1.5 rounded-lg text-[10px] font-bold text-slate-600 shadow-sm">
                                <CheckCircle2 className="w-3 h-3 text-[#15317E]" /> <span>{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {promoCard.nearby_places?.length > 0 && (
                        <>
                          <div className="w-full h-px bg-slate-200/60" />
                          <div>
                            <p className="text-[11px] font-black text-[#15317E] mb-2 flex items-center gap-1.5"><Map className="w-4 h-4" /> الموقع والخدمات</p>
                            <div className="flex flex-col gap-2">
                              {promoCard.nearby_places.map((perk, i) => (
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
                  {(agent.whatsapp || agent.phone) && (
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-white/90" />
                      <span className="text-2xl font-black tracking-wider" dir="ltr">{agent.whatsapp || agent.phone}</span>
                    </div>
                  )}
                </div>
                <div className="bg-white p-1.5 rounded-xl shadow-inner">
                  <QrCode className="w-12 h-12 text-[#15317E]" />
                </div>
              </div>
            </div>

            <div className="mt-5 flex w-full gap-3">
              <button onClick={downloadCard} className="flex-1 bg-white text-[#15317E] py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg">
                <Download className="w-5 h-5" /> حفظ كصورة
              </button>
              <button onClick={() => setPromoCard(null)} className="p-3.5 bg-white/10 text-white rounded-xl border border-white/20 hover:bg-white/20">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
