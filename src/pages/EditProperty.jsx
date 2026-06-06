import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PropertyForm from '@/components/property/PropertyForm';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

export default function EditProperty() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = window.location.pathname.split('/').pop();

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const items = await base44.entities.Property.filter({ id: propertyId });
      return items[0];
    },
    enabled: !!propertyId,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Property.update(propertyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      toast.success('تم تحديث العقار بنجاح');
      navigate('/dashboard');
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowRight className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-heading font-bold">تعديل العقار</h1>
      </div>
      {property && (
        <PropertyForm
          initialData={property}
          onSubmit={updateMutation.mutate}
          isLoading={updateMutation.isPending}
        />
      )}
    </div>
  );
}