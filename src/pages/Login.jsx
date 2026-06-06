import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { Loader2, ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react';

const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("يرجى إدخال جميع البيانات المطلوبة");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden bg-[#f8fafc] px-4"
         style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif" }}>

      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Tajawal:wght@400;500;700;800&display=swap');`}} />

      <div className="relative w-full max-w-[420px] z-10">
        <div className="relative bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] p-8 sm:p-10 shadow-[0_30px_60px_-15px_rgba(26,43,66,0.12)]">

          <div className="text-center mb-8">
            <div className="w-40 h-40 mx-auto mb-4">
              <img src="https://media.base44.com/images/public/6a218975cdf06fe8cd10f742/4f84b960a_10000065611.png" alt="عقار كلاود" className="w-full h-full object-contain" />
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5 text-right">
              <label className="text-sm font-bold text-[#1a2b42] px-1">البريد الإلكتروني</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-10 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1a2b42]/10 focus:border-[#1a2b42]/30 transition-all text-left"
                  dir="ltr" required />
              </div>
            </div>

            <div className="space-y-1.5 text-right">
              <div className="flex items-center justify-between px-1">
                <Link to="/forgot-password" className="text-xs text-[#1a2b42] hover:text-blue-600 font-bold">نسيت كلمة المرور؟</Link>
                <label className="text-sm font-bold text-[#1a2b42]">كلمة المرور</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-10 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1a2b42]/10 focus:border-[#1a2b42]/30 transition-all text-left"
                  dir="ltr" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 hover:text-[#1a2b42]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#1a2b42] hover:bg-[#121f30] text-white rounded-xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /><span>جاري التحقق...</span></> : <><span>تسجيل الدخول</span><ArrowLeft className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-4 text-slate-400">أو</span></div>
          </div>

          <button onClick={handleGoogle} type="button" disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 px-4 rounded-xl font-bold transition-all disabled:opacity-70">
            <GoogleIcon className="w-5 h-5" />
            <span className="text-sm">المتابعة باستخدام Google</span>
          </button>

          <div className="mt-8 text-center text-sm text-slate-500">
            ليس لديك حساب؟{" "}
            <Link to="/register" className="font-bold text-[#1a2b42] hover:text-blue-600">قم بإنشاء حساب جديد</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
