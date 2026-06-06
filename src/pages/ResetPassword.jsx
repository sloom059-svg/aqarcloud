import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, AlertTriangle } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }
    setLoading(true);
    try {
      await supabase.auth.updateUser({ password: newPassword });
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <AuthLayout
        icon={AlertTriangle}
        title="رابط غير صالح"
        subtitle="رابط إعادة التعيين غير صحيح أو منتهي"
        footer={
          <Link to="/forgot-password" className="text-primary font-medium hover:underline">
            طلب رابط جديد
          </Link>
        }
      >
        <p className="text-sm text-foreground text-center">
          يبدو أن الرابط غير مكتمل. يرجى طلب رابط جديد لإعادة تعيين كلمة المرور.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={Lock}
      title="كلمة مرور جديدة"
      subtitle="أدخل كلمة المرور الجديدة"
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور الجديدة</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            autoFocus
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
              جاري التعيين...
            </>
          ) : (
            "تعيين كلمة المرور"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
