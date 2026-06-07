import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  MapPin, Award, Building2, Share2, Loader2, Home
} from "lucide-react";
import PropertyCard from '@/components/property/PropertyCard';

// ── أيقونات التواصل ──
const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const PhoneIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

export default function AgentProfile() {
  const agentId = window.location.pathname.split('/').pop();

  const { data: agent, isLoading: agentLoading } = useQuery({
    queryKey: ['agent-profile', agentId],
    queryFn: async () => {
      const users = await base44.entities.User.filter({ id: agentId });
      return users[0];
    },
    enabled: !!agentId,
  });

  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['agent-properties', agentId],
    queryFn: () => base44.entities.Property.filter({ created_by_id: agentId, status: 'نشط' }, '-created_date'),
    enabled: !!agentId,
  });

  const shareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('تم نسخ رابط البروفايل');
  };

  if (agentLoading) {
    return (
      <div dir="rtl" className="min-h-screen flex justify-center items-center bg-[#F8FAFC]">
        <Loader2 className="w-8 h-8 animate-spin text-[#15317E]" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Building2 className="w-12 h-12 text-slate-300 mb-3" />
        <p className="text-slate-500 text-lg font-bold">الوسيط غير موجود</p>
      </div>
    );
  }

  const initials = agent.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '؟';

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] font-sans pb-20 relative">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
      `}} />

      {/* الخلفية الزرقاء العلوية */}
      <div className="absolute top-0 left-0 right-0 h-[260px] bg-[#15317E] rounded-b-[2.5rem] shadow-lg" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-6">

        {/* شريط علوي بسيط */}
        <div className="flex items-center justify-between text-white mb-6">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold opacity-90 hover:opacity-100 transition">
            <Home className="w-4 h-4" /> عقار كلاود
          </Link>
          <button onClick={shareProfile}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold transition-all">
            <Share2 className="w-3.5 h-3.5" /> مشاركة
          </button>
        </div>

        {/* بطاقة المكتب */}
        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 mb-6">
          <div className="flex flex-col items-center text-center">
            {/* الشعار / الأحرف */}
            <div className="relative -mt-16 mb-3">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-[#15317E] overflow-hidden flex items-center justify-center shadow-lg">
                {agent.avatar_url || agent.office_logo_url ? (
                  <img src={agent.avatar_url || agent.office_logo_url} alt="شعار" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-white">{initials}</span>
                )}
              </div>
            </div>

            <h1 className="text-2xl font-black text-[#15317E]">{agent.full_name}</h1>
            {agent.office_name && (
              <div className="flex items-center gap-1.5 mt-1.5 text-slate-500">
                <Building2 className="w-4 h-4" />
                <span className="font-bold text-sm">{agent.office_name}</span>
              </div>
            )}

            {/* الشارات */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              {agent.city && (
                <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-600">
                  <MapPin className="w-3 h-3 text-[#15317E]" /> {agent.city}
                </span>
              )}
              {agent.license_number && (
                <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-600">
                  <Award className="w-3 h-3 text-[#15317E]" /> رخصة: {agent.license_number}
                </span>
              )}
            </div>

            {agent.bio && (
              <p className="text-slate-500 text-sm mt-4 max-w-md leading-relaxed">{agent.bio}</p>
            )}

            {/* أيقونات التواصل */}
            <div className="flex items-center justify-center gap-3 mt-5">
              {agent.whatsapp && (
                <a href={`https://wa.me/${agent.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center bg-[#15317E] hover:bg-[#0d1e4c] text-white rounded-2xl transition-all shadow-md shadow-[#15317E]/20 hover:-translate-y-0.5"
                  title="مراسلة واتساب">
                  <WhatsAppIcon className="w-5 h-5" />
                </a>
              )}
              {agent.phone && (
                <a href={`tel:${agent.phone}`}
                  className="w-12 h-12 flex items-center justify-center bg-[#15317E] hover:bg-[#0d1e4c] text-white rounded-2xl transition-all shadow-md shadow-[#15317E]/20 hover:-translate-y-0.5"
                  title="اتصال">
                  <PhoneIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* العقارات */}
        <h2 className="text-lg font-bold text-[#15317E] mb-4 mt-8">عقارات {agent.full_name}</h2>

        {propertiesLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#15317E]" /></div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm">
            <Building2 className="w-12 h-12 text-slate-300 mb-3 mx-auto" />
            <p className="text-slate-500 font-bold">لا توجد عقارات مضافة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {properties.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
