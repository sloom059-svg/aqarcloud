import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Building2, Phone, Upload, Hotel, Tent, Leaf, Trees } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const CITIES = ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "الطائف", "تبوك", "بريدة", "حائل", "أبها", "خميس مشيط", "جازان", "نجران", "ينبع", "الجبيل", "الأحساء", "القطيف", "الرس", "عنيزة", "الزلفي", "المجمعة", "شقراء", "الدوادمي", "الأفلاج", "وادي الدواسر", "سكاكا", "القريات", "عرعر", "رفحاء", "طريف", "الوجه", "أملج", "ضباء", "البدع", "بيشة", "محايل عسير", "صبيا", "أبو عريش", "صامطة", "الليث", "رابغ", "القنفذة", "الباحة", "بلجرشي", "المندق", "مدينة الملك عبدالله الاقتصادية"];

const ROLES = [
  { id: 'وسيط',    label: 'وسيط عقاري',   Icon: Building2, desc: 'إدارة وعرض العقارات للبيع والإيجار' },
  { id: 'شاليه',   label: 'مالك شاليه',    Icon: Hotel,     desc: 'إدارة الشاليه وحجوزاته' },
  { id: 'مخيم',    label: 'مالك مخيم',     Icon: Tent,      desc: 'إدارة المخيم والحجوزات' },
  { id: 'مزرعة',   label: 'مالك مزرعة',    Icon: Leaf,      desc: 'إدارة المزرعة وخدماتها' },
  { id: 'استراحة', label: 'مالك استراحة',  Icon: Trees,     desc: 'إدارة الاستراحة وحجوزاتها' },
];

export default function CompleteProfile() {
  const [step, setStep] = useState("role"); // role | form
  const [role, setRole] = useState("");
  const [form, setForm] = useState({ office_name: "", phone: "", city: "", office_logo_url: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, office_logo_url: file_url }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.office_name || !form.phone || !form.city) {
      setError("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }
    setLoading(true);
    await base44.auth.updateMe({ ...form, business_type: role });
    window.location.href = role === 'وسيط' ? "/" : "/venue";
  };

  const roleConfig = ROLES.find(r => r.id === role);

  // خطوة 1: اختيار نوع النشاط
  if (step === "role") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8" dir="rtl">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-heading">أهلاً بك!</h1>
            <p className="text-muted-foreground mt-2">اختر نوع نشاطك لإكمال إعداد حسابك</p>
          </div>
          <div className="space-y-3">
            {ROLES.map(r => (
              <button key={r.id} onClick={() => { setRole(r.id); setStep("form"); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-primary bg-card hover:bg-primary/5 transition-all text-right">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <r.Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-base">{r.label}</div>
                  <div className="text-sm text-muted-foreground">{r.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // خطوة 2: بيانات الحساب
  return (
    <AuthLayout
      title="إكمال بيانات الحساب"
      subtitle={roleConfig ? `${roleConfig.label} — أدخل بياناتك لإكمال التسجيل` : 'أدخل بياناتك لإكمال التسجيل'}
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
      )}

      <button type="button" onClick={() => setStep("role")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 -mt-2">
        ← تغيير نوع النشاط
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>{role === 'وسيط' ? 'اسم المكتب العقاري *' : 'الاسم أو اسم المكان *'}</Label>
          <div className="relative">
            <Building2 className="absolute right-3 top-3.5 w-4 h-4 text-muted-foreground" />
            <Input
              value={form.office_name}
              onChange={(e) => setForm(prev => ({ ...prev, office_name: e.target.value }))}
              placeholder={role === 'وسيط' ? 'مثال: مكتب النخبة العقاري' : 'مثال: محمد العتيبي'}
              className="h-12 pr-9"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>رقم الجوال *</Label>
          <div className="relative">
            <Phone className="absolute right-3 top-3.5 w-4 h-4 text-muted-foreground" />
            <Input
              value={form.phone}
              onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="05xxxxxxxx"
              className="h-12 pr-9"
              dir="ltr"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>المدينة *</Label>
          <Select value={form.city} onValueChange={(v) => setForm(prev => ({ ...prev, city: v }))} required>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="اختر مدينتك" />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>الشعار (اختياري)</Label>
          <label className="flex items-center gap-3 h-12 px-4 border border-input rounded-md cursor-pointer hover:bg-muted/30 transition">
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            ) : form.office_logo_url ? (
              <img src={form.office_logo_url} alt="شعار" className="h-8 w-8 object-contain rounded" />
            ) : (
              <Upload className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground">
              {form.office_logo_url ? "تم رفع الشعار" : "رفع الشعار"}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
          </label>
        </div>

        <Button type="submit" className="w-full h-12 font-medium" disabled={loading || uploading}>
          {loading ? (
            <><Loader2 className="w-4 h-4 ml-2 animate-spin" />جاري الحفظ...</>
          ) : "حفظ والمتابعة"}
        </Button>
      </form>
    </AuthLayout>
  );
}