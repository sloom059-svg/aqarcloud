import { useEffect } from "react";
import { base44 } from "@/api/base44Client";

// صفحة مؤقتة: تتحقق من بيانات المستخدم بعد تسجيل الدخول بـ Google
// إذا ناقصة البيانات → توجه لصفحة الإكمال، وإلا → الصفحة الرئيسية
export default function CheckProfile() {
  useEffect(() => {
    const check = async () => {
      const user = await base44.auth.me();
      if (!user?.office_name || !user?.phone) {
        window.location.href = "/complete-profile";
      } else if (user?.business_type && user.business_type !== 'وسيط') {
        window.location.href = "/venue";
      } else {
        window.location.href = "/";
      }
    };
    check();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
}