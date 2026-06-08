import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Loader2, Eye, EyeOff, Lock, Mail, CalendarCheck, Building2, Share2 } from 'lucide-react';

// استدعاء الشعار من المجلد الرئيسي src
import logo from '../aqar-cloud-logo.png';

const GoogleIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [imageError, setImageError] = useState(false);
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
    if (!email || !password) { setError("يرجى إدخال جميع البيانات المطلوبة"); return; }
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", "/check-profile");
  };

  if (!mounted) return null;

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] font-sans flex overflow-hidden">

      {/* القسم الأيمن: نموذج تسجيل الدخول */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-[420px] animate-slide-up">

          {/* الشعار والهوية (تم تكبير الدائرة وإزالة النص أسفلها) */}
          <div className="mb-10 text-center flex flex-col items-center">
            <div className="w-40 h-40 bg-white rounded-full shadow-xl shadow-[#15317E]/10 flex items-center justify-center mb-6 border border-slate-100 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[#15317E]/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              {!imageError ? (
                <img src={logo} alt="Aqar Cloud Logo" className="w-32 h-32 object-contain relative z-10" onError={() => setImageError(true)} />
              ) : (
                <Building2 className="w-20 h-20 text-[#15317E] relative z-10" />
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {/* النموذج */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email" dir="ltr" placeholder="name@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full pr-12 pl-4 py-4 bg-white border border-slate-200 rounded-2xl focus:border-[#15317E] focus:ring-2 focus:ring-[#15317E]/20 outline-none transition-all text-sm font-medium text-left shadow-sm placeholder:text-slate-400"
                />
                <Mail className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700">كلمة المرور</label>
                <Link to="/forgot-password" className="text-xs font-bold text-[#15317E] hover:underline">نسيت كلمة المرور؟</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} dir="ltr" placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full pr-12 pl-12 py-4 bg-white border border-slate-200 rounded-2xl focus:border-[#15317E] focus:ring-2 focus:ring-[#15317E]/20 outline-none transition-all text-sm font-medium text-left shadow-sm placeholder:text-slate-400"
                />
                <Lock className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#15317E] transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full mt-2 py-4 bg-[#15317E] text-white rounded-2xl font-bold text-base shadow-lg shadow-[#15317E]/20 hover:bg-[#0d1e4c] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" />جاري التحقق...</> : 'تسجيل الدخول'}
            </button>
          </form>

          {/* الفاصل */}
          <div className="flex items-center gap-4 mt-6 mb-6 opacity-60">
            <div className="flex-1 h-px bg-slate-300" />
            <span className="text-xs font-bold text-slate-500">أو الدخول بواسطة</span>
            <div className="flex-1 h-px bg-slate-300" />
          </div>

          {/* زر Google */}
          <button onClick={handleGoogle} type="button" disabled={loading}
            className="w-full py-4 bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-bold text-sm shadow-sm transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70">
            <GoogleIcon className="w-5 h-5" />
            <span dir="ltr">تسجيل الدخول بواسطة Google</span>
          </button>

          {/* رابط التسجيل */}
          <p className="text-center mt-8 text-sm text-slate-500 font-medium">
            ليس لديك حساب بعد؟{' '}
            <Link to="/register" className="font-bold text-[#15317E] hover:underline">سجل كمالك أو وسيط</Link>
          </p>
        </div>
      </div>

      {/* القسم الأيسر: الهوية البصرية */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#15317E] items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1600"
          alt="Chalet" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#15317E]/90 to-[#0a1840]/90" />
        <div className="relative z-10 text-white p-12 max-w-lg text-right animate-fade-in">
          <div className="w-16 h-1 bg-white/30 rounded-full mb-8" />
          <h2 className="text-4xl font-black mb-4 leading-tight">منصتك الأولى<br/>لإدارة عقاراتك وشاليهاتك</h2>
          <p className="text-white/70 text-lg leading-relaxed">
            حلٌّ متكامل للوسطاء العقاريين وملاك الشاليهات — أدِر عقاراتك وحجوزاتك، وشارك صفحتك مع عملائك بكل سهولة واحترافية.
          </p>

          <div className="space-y-4 mt-12 pt-10 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-base">إدارة العقارات والشاليهات</div>
                <div className="text-white/60 text-sm">كل وحداتك في مكان واحد منظّم</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                <CalendarCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-base">حجوزات بلا تعقيد</div>
                <div className="text-white/60 text-sm">تابع حجوزاتك وتقويم الإتاحة لحظياً</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-base">صفحة عرض احترافية</div>
                <div className="text-white/60 text-sm">شارك عقاراتك مع عملائك برابط واحد</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; margin: 0; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        input[type="password"]::-ms-reveal, input[type="password"]::-ms-clear { display: none; }
      `}} />
    </div>
  );
}
