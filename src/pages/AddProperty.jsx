import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PropertyForm from '@/components/property/PropertyForm';
import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function AddProperty() {
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Property.create(data),
    onSuccess: () => {
      toast.success('تم إضافة العقار بنجاح');
      navigate('/dashboard');
    },
  });

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
      `}} />

      {/* الهيدر الأزرق الثابت */}
      <div className="w-full bg-[#15317E] text-white py-5 px-4 shadow-md sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold tracking-wide">إضافة عقار جديد</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <PropertyForm onSubmit={createMutation.mutate} isLoading={createMutation.isPending} />
      </div>
    </div>
  );
}
