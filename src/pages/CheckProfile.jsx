import { useEffect } from "react";
import { supabase } from "@/api/base44Client";

export default function CheckProfile() {
  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }

      // تحقق من profiles مباشرة (مو user_metadata)
      const { data: profile } = await supabase
        .from('profiles')
        .select('office_name, phone, business_type')
        .eq('id', user.id)
        .single();

      // لو ما فيه profile أو ناقص → فورم الاختيار
      if (!profile || !profile.office_name || !profile.phone) {
        window.location.href = "/complete-profile";
        return;
      }

      // فيه profile كامل → وديه للداشبورد المناسب
      if (profile.business_type && profile.business_type !== 'وسيط') {
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
