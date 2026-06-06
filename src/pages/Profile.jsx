import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2, ArrowRight, Building2, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CITIES = ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "الطائف", "تبوك", "بريدة", "حائل", "أبها", "خميس مشيط", "جازان", "نجران", "ينبع", "الجبيل", "الأحساء", "القطيف", "الرس", "عنيزة", "الزلفي", "المجمعة", "شقراء", "الدوادمي", "الأفلاج", "وادي الدواسر", "سكاكا", "القريات", "عرعر", "رفحاء", "طريف", "الوجه", "أملج", "ضباء", "البدع", "بيشة", "محايل عسير", "صبيا", "أبو عريش", "صامطة", "الليث", "رابغ", "القنفذة", "الباحة", "بلجرشي", "المندق", "مدينة الملك عبدالله الاقتصادية"];
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    office_name: user?.office_name || '',
    phone: user?.phone || '',
    whatsapp: user?.whatsapp || '',
    bio: user?.bio || '',
    license_number: user?.license_number || '',
    city: user?.city || '',
    avatar_url: user?.avatar_url || '',
    office_logo_url: user?.office_logo_url || '',
  });
  const [uploading, setUploading] = useState(false);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      toast.success('تم تحديث الملف الشخصي');
      const bt = user?.business_type;
      navigate(bt && bt !== 'وسيط' ? '/venue' : '/');
    },
  });

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, avatar_url: file_url }));
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '؟';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowRight className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-heading font-bold">الملف الشخصي</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={form.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">{initials}</AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
                </label>
              </div>
              <h2 className="font-heading font-bold text-lg mt-3">{user?.full_name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{user?.business_type === 'وسيط' ? 'اسم المكتب العقاري' : 'الاسم أو اسم المكان'}</Label>
                <div className="relative">
                  <Building2 className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={form.office_name}
                    onChange={(e) => setForm(prev => ({ ...prev, office_name: e.target.value }))}
                    placeholder={user?.business_type === 'وسيط' ? 'مثال: مكتب النخبة العقاري' : 'مثال: شاليه الورد'}
                    className="pr-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{user?.business_type === 'وسيط' ? 'شعار المكتب' : 'الشعار أو الصورة'}</Label>
                <div className="flex items-center gap-3">
                  {form.office_logo_url && (
                    <img src={form.office_logo_url} alt="شعار" className="h-12 w-12 object-contain rounded-lg border border-border" />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-muted/30 transition text-sm text-muted-foreground">
                    <Upload className="w-4 h-4" />
                    {form.office_logo_url ? "تغيير الشعار" : "رفع شعار المكتب"}
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const { file_url } = await base44.integrations.Core.UploadFile({ file });
                      setForm(prev => ({ ...prev, office_logo_url: file_url }));
                    }} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>رقم الجوال</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="05xxxxxxxx"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>رقم الواتساب</Label>
                  <Input
                    value={form.whatsapp}
                    onChange={(e) => setForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="966xxxxxxxxx"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المدينة</Label>
                  <Select value={form.city} onValueChange={(v) => setForm(prev => ({ ...prev, city: v }))}>
                    <SelectTrigger><SelectValue placeholder="اختر المدينة" /></SelectTrigger>
                    <SelectContent>
                      {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {user?.business_type === 'وسيط' && (
                <div className="space-y-2">
                  <Label>رقم رخصة الوساطة</Label>
                  <Input
                    value={form.license_number}
                    onChange={(e) => setForm(prev => ({ ...prev, license_number: e.target.value }))}
                    placeholder="رقم الرخصة"
                    dir="ltr"
                  />
                </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>نبذة عنك</Label>
                <Textarea
                  value={form.bio}
                  onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="اكتب نبذة مختصرة عنك وعن خبراتك..."
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'حفظ التغييرات'}
        </Button>
      </form>
    </div>
  );
}
