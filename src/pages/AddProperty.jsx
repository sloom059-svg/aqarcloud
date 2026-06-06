import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PropertyForm from '@/components/property/PropertyForm';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowRight className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-heading font-bold">إضافة عقار جديد</h1>
      </div>
      <PropertyForm onSubmit={createMutation.mutate} isLoading={createMutation.isPending} />
    </div>
  );
}