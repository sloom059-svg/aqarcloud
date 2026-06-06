import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Mail, Loader2, Building2, Phone, Home, Tent, Leaf, Trees, Hotel } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { toast } from "@/components/ui/use-toast";

const CITIES = ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "الطائف", "تبوك", "بريدة", "حائل", "أبها", "خميس مشيط", "جازان", "نجران", "ينبع", "الجبيل", "الأحساء", "القطيف", "الرس", "عنيزة", "الزلفي", "المجمعة", "شقراء", "الدوادمي", "الأفلاج", "وادي الدواسر", "سكاكا", "القريات", "عرعر", "رفحاء", "طريف", "الوجه", "أملج", "ضباء", "البدع", "بيشة", "محايل عسير", "صبيا", "أبو عريش", "صامطة", "الليث", "رابغ", "القنفذة", "الباحة", "بلجرشي", "المندق", "مدينة الملك عبدالله الاقتصادية"];

export default function Register() {
  const [step, setStep] = useState("role"); // role | form | otp
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [officeName, setOfficeName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setStep("otp");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      const updateData = { phone, city };
      if (role === 'وسيط') {
        updateData.office_name = officeName;
        updateData.business_type = 'وسيط';
      } else {
        updateData.office_name = officeName;
        updateData.business_type = role;
      }
      await base44.auth.updateMe(updateData);
      window.location.href = role === 'وسيط' ? "/" : "/venue";
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      toast({
        title: "Code sent",
        description: "Check your email for the new code.",
      });
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", "/check-profile");
  };

  // Step 1: اختيار نوع النشاط
  const ROLES = [
    { id: 'وسيط',    label: 'وسيط عقاري',   Icon: Building2, desc: 'إدارة وعرض العقارات للبيع والإيجار' },
    { id: 'شاليه',   label: 'مالك شاليه',    Icon: Hotel,     desc: 'إدارة الشاليه وحجوزاته' },
    { id: 'مخيم',    label: 'مالك مخيم',     Icon: Tent,      desc: 'إدارة المخيم والحجوزات' },
    { id: 'مزرعة',   label: 'مالك مزرعة',    Icon: Leaf,      desc: 'إدارة المزرعة وخدماتها' },
    { id: 'استراحة', label: 'مالك استراحة',  Icon: Trees,     desc: 'إدارة الاستراحة وحجوزاتها' },
  ];

  if (step === "role") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8" dir="rtl">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-heading">مرحباً بك!</h1>
            <p className="text-muted-foreground mt-2">اختر نوع نشاطك لإنشاء حساب مخصص لك</p>
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
          <p className="text-center text-sm text-muted-foreground mt-6">
            لديك حساب؟{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">تسجيل الدخول</Link>
          </p>
        </div>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <AuthLayout
        icon={Mail}
        title="تأكيد البريد الإلكتروني"
        subtitle={`أرسلنا رمز التحقق إلى ${email}`}
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}
        <div className="flex justify-center mb-6" dir="ltr">
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={setOtpCode}
            autoFocus
            autoComplete="one-time-code"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          className="w-full h-12 font-medium"
          onClick={handleVerify}
          disabled={loading || otpCode.length < 6}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              جاري التحقق...
            </>
          ) : (
            "تحقق"
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-4">
          لم يصلك الرمز؟{" "}
          <button onClick={handleResend} className="text-primary font-medium hover:underline">
            إعادة الإرسال
          </button>
        </p>
      </AuthLayout>
    );
  }

  const roleConfig = ROLES?.find(r => r.id === role);

  return (
    <AuthLayout
      icon={UserPlus}
      title="إنشاء حساب جديد"
      subtitle={roleConfig ? roleConfig.label : 'سجّل حسابك'}
      footer={
        <>
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            تسجيل الدخول
          </Link>
        </>
      }
    >
      <Button
        variant="outline"
        className="w-full h-12 text-sm font-medium mb-6"
        onClick={handleGoogle}
      >
        <GoogleIcon className="w-5 h-5 ml-2" />
        المتابعة مع Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-3 text-muted-foreground">أو</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <button type="button" onClick={() => setStep("role")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2 -mt-2">
        ← تغيير نوع النشاط
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>{role === 'وسيط' ? 'اسم المكتب العقاري *' : 'الاسم أو اسم المكان *'}</Label>
          <div className="relative">
            <Building2 className="absolute right-3 top-3.5 w-4 h-4 text-muted-foreground" />
            <Input
              value={officeName}
              onChange={(e) => setOfficeName(e.target.value)}
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05xxxxxxxx"
              className="h-12 pr-9"
              dir="ltr"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>المدينة *</Label>
          <Select value={city} onValueChange={setCity} required>
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
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            autoFocus
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12"
            dir="ltr"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12"
            dir="ltr"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">تأكيد كلمة المرور</Label>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-12"
            dir="ltr"
            required
          />
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              جاري إنشاء الحساب...
            </>
          ) : (
            "إنشاء حساب"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}