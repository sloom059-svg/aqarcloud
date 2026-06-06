import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Building2, Pencil, Trash2, Share2, Home, Download } from "lucide-react";
import PropertyCard from '@/components/property/PropertyCard';
import PropertyCardExport from '@/components/property/PropertyCardExport';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [exportProperty, setExportProperty] = useState(null);

  React.useEffect(() => {
    if (user?.business_type && user.business_type !== 'وسيط') {
      navigate('/venue', { replace: true });
    }
  }, [user, navigate]);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['my-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property')
        .select('*')
        .eq('created_by_id', user?.id)
        .order('created_date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('property').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      toast.success('تم حذف العقار بنجاح');
    },
  });

  const activeProperties = properties.filter(p => p.status === 'نشط');

  const copyProfileLink = () => {
    const url = `${window.location.origin}/agent/${user?.id}`;
    navigator.clipboard.writeText(url);
    toast.success('تم نسخ رابط البروفايل');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">لوحة التحكم</h1>
          <p className="text-muted-foreground mt-1">مرحباً {user?.full_name}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={copyProfileLink} className="gap-2">
            <Share2 className="w-4 h-4" />شارك بروفايلك
          </Button>
          <Button onClick={() => navigate('/add-property')} className="gap-2">
            <Plus className="w-4 h-4" />أضف عقار
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-bl from-primary/5 to-transparent border-primary/10">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي العقارات</p>
                <p className="text-2xl font-bold font-heading">{properties.length}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-bl from-primary/5 to-transparent border-primary/10">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Home className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">عقارات نشطة</p>
                <p className="text-2xl font-bold font-heading">{activeProperties.length}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <h2 className="text-lg font-heading font-bold mb-4">عقاراتي</h2>
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      ) : properties.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Building2 className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-heading font-semibold text-lg mb-2">لا توجد عقارات بعد</h3>
            <p className="text-muted-foreground mb-6">ابدأ بإضافة أول عقار لك</p>
            <Button onClick={() => navigate('/add-property')} className="gap-2">
              <Plus className="w-4 h-4" />أضف عقار
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((property, i) => (
            <div key={property.id} className="relative group">
              <PropertyCard property={property} index={i} />
              <div className="absolute top-3 left-3 flex gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Button size="icon" variant="secondary" className="h-8 w-8 shadow-lg"
                  onClick={(e) => { e.preventDefault(); navigate(`/edit-property/${property.id}`); }}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button size="icon" variant="secondary" className="h-8 w-8 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={(e) => { e.preventDefault(); setExportProperty(property); }}>
                  <Download className="w-3.5 h-3.5" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="destructive" className="h-8 w-8 shadow-lg" onClick={(e) => e.preventDefault()}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>حذف العقار</AlertDialogTitle>
                      <AlertDialogDescription>هل أنت متأكد من حذف هذا العقار؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(property.id)}>حذف</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!exportProperty} onOpenChange={() => setExportProperty(null)}>
        <DialogContent className="max-w-2xl p-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-right">بطاقة النشر</DialogTitle>
          </DialogHeader>
          {exportProperty && <PropertyCardExport property={exportProperty} agent={user} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
