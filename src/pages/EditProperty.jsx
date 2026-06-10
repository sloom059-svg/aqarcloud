import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import PropertyForm from '@/components/property/PropertyForm';
import {
  BadgeCheck,
  Building2,
  ChevronRight,
  Home,
  Loader2,
  MapPin,
  Pencil,
} from 'lucide-react';
import { toast } from 'sonner';

const AIRBNB = '#FF385C';

export default function EditProperty() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const propertyId = window.location.pathname.split('/').pop();

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const items = await base44.entities.Property.filter({ id: propertyId });
      return items[0];
    },
    enabled: !!propertyId,
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['my-properties'],
    queryFn: () => base44.entities.Property.filter({ created_by_id: user?.id }, '-created_date'),
    enabled: !!user?.id,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Property.update(propertyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
      toast.success('تم تحديث العقار بنجاح');
      navigate('/dashboard');
    },
  });

  const activeProperties = properties.filter(p => p.status === 'نشط');
  const logoUrl = user?.office_logo_url || user?.profile_image_url;
  const officeName = user?.office_name || 'مكتبي العقاري';

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7] font-sans pb-20 relative overflow-x-hidden text-zinc-950">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
      `}} />

      <div className="absolute inset-x-0 top-0 h-[180px] bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-28 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ backgroundColor: AIRBNB }} />
      <div className="absolute top-24 left-[-90px] w-72 h-72 rounded-full bg-zinc-900/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-5 lg:px-8">
        <header className="pt-4 sm:pt-6 pb-4">
          <div className="rounded-[1.6rem] sm:rounded-[2rem] bg-white/95 border border-zinc-200 shadow-[0_14px_44px_rgba(0,0,0,0.07)] backdrop-blur-xl p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3 sm:gap-5">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-all text-zinc-800 flex items-center justify-center shadow-sm active:scale-[0.98] flex-shrink-0"
                  title="رجوع للوحة التحكم"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="relative flex-shrink-0">
                  <div className="w-[58px] h-[58px] sm:w-[68px] sm:h-[68px] rounded-[1.35rem] bg-gradient-to-br from-white to-zinc-100 overflow-hidden flex items-center justify-center border border-zinc-200 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                    {logoUrl ? (
                      <img src={logoUrl} alt="شعار المكتب" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl sm:text-2xl font-black text-zinc-950">
                        {officeName[0]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs font-black text-zinc-400 leading-none mb-1">تعديل عقار</p>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h1 className="text-[15px] sm:text-xl font-black text-zinc-950 truncate leading-tight max-w-[150px] sm:max-w-[420px] lg:max-w-none">
                      {property?.title || officeName}
                    </h1>
                  </div>

                  <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                    {user?.city && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-50 border border-zinc-100 px-2 py-1 text-[10px] sm:text-[11px] font-bold text-zinc-500">
                        <MapPin className="w-3 h-3" />
                        {user.city}
                      </span>
                    )}

                    {user?.license_number && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-50 border border-zinc-100 px-2 py-1 text-[10px] sm:text-[11px] font-bold text-zinc-500">
                        <BadgeCheck className="w-3.5 h-3.5" style={{ color: AIRBNB }} />
                        رخصة موثوق: <span dir="ltr">{user.license_number}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 sm:gap-2 flex-nowrap shrink-0">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center justify-center gap-1.5 bg-zinc-950 text-white px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs font-black shadow-sm hover:bg-black transition-all active:scale-[0.98]"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">لوحة التحكم</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 items-start">
            <aside className="hidden lg:block rounded-[2rem] bg-white border border-zinc-100 shadow-sm p-5 sticky top-5">
              <div className="w-12 h-12 rounded-2xl bg-[#FF385C]/10 flex items-center justify-center mb-4">
                <Pencil className="w-6 h-6" style={{ color: AIRBNB }} />
              </div>
              <h2 className="text-xl font-black text-zinc-950">تعديل بيانات العقار</h2>
              <p className="text-sm font-bold text-zinc-500 leading-7 mt-2">
                نفس تجربة لوحة تحكم الوسيط بثيم BNB الفاتح، عدّل التفاصيل والصور والسعر ثم احفظ التغييرات.
              </p>

              <div className="mt-5 grid gap-2 text-xs font-bold text-zinc-500">
                <div className="rounded-2xl bg-zinc-50 border border-zinc-100 px-3 py-2">١. المعلومات الأساسية</div>
                <div className="rounded-2xl bg-zinc-50 border border-zinc-100 px-3 py-2">٢. التفاصيل والموقع</div>
                <div className="rounded-2xl bg-zinc-50 border border-zinc-100 px-3 py-2">٣. المميزات والصور</div>
                <div className="rounded-2xl bg-zinc-50 border border-zinc-100 px-3 py-2">٤. حفظ التعديلات</div>
              </div>

              <div className="mt-5 rounded-2xl bg-zinc-950 text-white p-4">
                <p className="text-[11px] font-black text-white/50">عقارات نشطة</p>
                <p className="text-2xl font-black mt-1" dir="ltr">{activeProperties.length}</p>
              </div>
            </aside>

            <section className="bg-white rounded-[2rem] shadow-sm border border-zinc-100 p-4 sm:p-6 min-h-[420px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: AIRBNB }} />
                  <p className="text-sm font-bold text-zinc-500">جاري تحميل بيانات العقار...</p>
                </div>
              ) : property ? (
                <PropertyForm
                  initialData={property}
                  onSubmit={updateMutation.mutate}
                  isLoading={updateMutation.isPending}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Building2 className="w-12 h-12 text-zinc-300 mb-3" />
                  <h3 className="font-black text-base text-zinc-700 mb-1">لم يتم العثور على العقار</h3>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-4 inline-flex items-center justify-center gap-1.5 bg-zinc-950 text-white px-5 py-2.5 rounded-2xl text-sm font-black shadow-sm hover:bg-black transition-all"
                  >
                    رجوع للوحة التحكم
                  </button>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
