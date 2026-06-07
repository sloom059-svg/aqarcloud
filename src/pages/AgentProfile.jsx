import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Phone, MessageCircle, MapPin, Award, Building2, Share2, Loader2, Home
} from "lucide-react";
import PropertyCard from '@/components/property/PropertyCard';

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

  const activeCount = properties.length;
  const forSale = properties.filter(p => p.listing_type === 'للبيع').length;
  const forRent = properties.filter(p => p.listing_type === 'للإيجار').length;
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

            {/* أزرار التواصل */}
            <div className="flex flex-wrap gap-2.5 mt-5 w-full max-w-sm">
              {agent.phone && (
                <a href={`tel:${agent.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-[#15317E] hover:bg-[#0d1e4c] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-[#15317E]/20">
                  <Phone className="w-4 h-4" /> اتصال
                </a>
              )}
              {agent.whatsapp && (
                <a href={`https://wa.me/${agent.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-500/20">
                  <MessageCircle className="w-4 h-4" /> واتساب
                </a>
              )}
            </div>
          </div>
        </div>

        {/* كروت الإحصائيات */}
        <div className="flex gap-2 mb-8">
          <div className="flex-1 bg-white rounded-2xl py-3 px-2 shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <p className="text-2xl font-black text-[#15317E] leading-none">{activeCount}</p>
            <p className="text-[11px] font-bold text-slate-500 mt-1">إجمالي العقارات</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl py-3 px-2 shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <p className="text-2xl font-black text-emerald-600 leading-none">{forSale}</p>
            <p className="text-[11px] font-bold text-slate-500 mt-1">للبيع</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl py-3 px-2 shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <p className="text-2xl font-black text-amber-500 leading-none">{forRent}</p>
            <p className="text-[11px] font-bold text-slate-500 mt-1">للإيجار</p>
          </div>
        </div>

        {/* العقارات */}
        <h2 className="text-lg font-bold text-[#15317E] mb-4">عقارات {agent.full_name}</h2>

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
