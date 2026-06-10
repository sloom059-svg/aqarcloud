import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import PropertyForm from '@/components/property/PropertyForm';
import { ChevronRight, Building2 } from 'lucide-react';

const AIRBNB = '#FF385C';

export default function AddProperty() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [successData, setSuccessData] = useState(null);

  const { data: properties = [] } = useQuery({
    queryKey: ['my-properties'],
    queryFn: () => base44.entities.Property.filter({ created_by_id: user?.id }, '-created_date'),
    enabled: !!user?.id,
  });

  const activeProperties = properties.filter(p => p.status === 'نشط');

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Property.create(data),
    onSuccess: (created, vars) => {
      const id = created?.id || created?.[0]?.id;
      const url = id ? `${window.location.origin}/property/${id}` : '';
      setSuccessData({ title: vars?.title, url });
    },
  });

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7] font-sans pb-20 relative overflow-x-hidden text-zinc-950">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
      `}} />

      <div className="absolute inset-x-0 top-0 h-[180px] bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-28 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ backgroundColor: AIRBNB }} />
      <div className="absolute top-24 left-[-90px] w-72 h-72 rounded-full bg-zinc-900/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-5 lg:px-8 pt-4 sm:pt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-2xl bg-white border border-zinc-200 text-zinc-800 flex items-center justify-center transition-all shadow-sm hover:bg-zinc-50 active:scale-[0.98]"
            title="رجوع"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="text-center flex-1">
            <p className="text-[11px] font-black text-zinc-400 leading-none mb-1">نموذج إضافة عقار</p>
            <h1 className="text-lg sm:text-2xl font-black text-zinc-950">أضف عقارك بخطوات بسيطة</h1>
          </div>

          <div className="h-10 w-10 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
            <Building2 className="w-5 h-5" style={{ color: AIRBNB }} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 items-start">
          <aside className="hidden lg:block rounded-[2rem] bg-white border border-zinc-100 shadow-sm p-5 sticky top-5">
            <div className="w-12 h-12 rounded-2xl bg-[#FF385C]/10 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" style={{ color: AIRBNB }} />
            </div>
            <h2 className="text-xl font-black text-zinc-950">نظام أونبوردنق خفيف</h2>
            <p className="text-sm font-bold text-zinc-500 leading-7 mt-2">
              نفس خيارات إضافة العقار، لكن مرتبة على خطوات واضحة وتعرض لاحقًا داخل بطاقة التسويق.
            </p>

            <div className="mt-5 grid gap-2 text-xs font-bold text-zinc-500">
              <div className="rounded-2xl bg-zinc-50 border border-zinc-100 px-3 py-2">١. نوع العقار</div>
              <div className="rounded-2xl bg-zinc-50 border border-zinc-100 px-3 py-2">٢. البيانات الأساسية</div>
              <div className="rounded-2xl bg-zinc-50 border border-zinc-100 px-3 py-2">٣. التفاصيل والموقع</div>
              <div className="rounded-2xl bg-zinc-50 border border-zinc-100 px-3 py-2">٤. الصور والسعر</div>
            </div>

            <div className="mt-5 rounded-2xl bg-zinc-950 text-white p-4">
              <p className="text-[11px] font-black text-white/50">عقارات نشطة</p>
              <p className="text-2xl font-black mt-1" dir="ltr">{activeProperties.length}</p>
            </div>
          </aside>

          <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-100 p-4 sm:p-6">
            <PropertyForm
              onSubmit={createMutation.mutate}
              isLoading={createMutation.isPending}
              successData={successData}
              onReset={() => { setSuccessData(null); window.location.reload(); }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
