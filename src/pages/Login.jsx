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
    // تغيير الخلفية إلى أبيض نقي لإزالة اللمسة الزرقاء المزعجة
    <div dir="rtl" className="min-h-screen bg-white font-sans flex overflow-hidden">

      {/* القسم الأيمن: نموذج تسجيل الدخول */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-[420px] animate-slide-up">

          {/* الشعار */}
          <div className="mb-12 text-center flex justify-center">
            {!imageError ? (
              <img 
                src={logo} 
                alt="Aqar Cloud Logo" 
                className="w-32 md:w-40 h-auto object-contain transition-all duration-300" 
                onError={() => setImageError(true)} 
              />
            ) : (
              <Building2 className="w-16 h-16 text-[#fa4b6a]" />
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-[#fff0f3] border border-[#ffd6de] text-[#d82a48] text-sm text-center font-bold animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {/* النموذج */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2.5">البريد الإلكتروني</label>
              <div className="relative group">
                <input
                  type="email" dir="ltr" placeholder="name@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                  /* حقول إدخال عصرية مسطحة بدون ظلال مزعجة */
                  className="w-full pr-12 pl-4 py-4 bg-[#f9f9f9] border border-transparent rounded-2xl focus:bg-white focus:border-[#fa4b6a] focus:ring-4 focus:ring-[#fa4b6a]/10 outline-none transition-all duration-300 text-sm font-medium text-left placeholder:text-gray-400"
                />
                <Mail className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#fa4b6a] transition-colors" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="block text-sm font-bold text-gray-800">كلمة المرور</label>
                <Link to="/forgot-password" className="text-xs font-bold text-[#fa4b6a] hover:text-[#d82a48] transition-colors">نسيت كلمة المرور؟</Link>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"} dir="ltr" placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                  /* حقول إدخال عصرية مسطحة بدون ظلال مزعجة */
                  className="w-full pr-12 pl-12 py-4 bg-[#f9f9f9] border border-transparent rounded-2xl focus:bg-white focus:border-[#fa4b6a] focus:ring-4 focus:ring-[#fa4b6a]/10 outline-none transition-all duration-300 text-sm font-medium text-left placeholder:text-gray-400"
                />
                <Lock className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#fa4b6a] transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* زر الدخول بلون حيوي وظل مخصص ناعم */}
            <button type="submit" disabled={loading}
              className="w-full mt-2 py-4 bg-gradient-to-r from-[#fa4b6a] to-[#f53859] text-white rounded-2xl font-bold text-base shadow-[0_8px_20px_rgba(250,75,106,0.25)] hover:shadow-[0_12px_25px_rgba(250,75,106,0.35)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" />جاري التحقق...</> : 'تسجيل الدخول'}
            </button>
          </form>

          {/* الفاصل */}
          <div className="flex items-center gap-4 mt-8 mb-8 opacity-60">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-bold text-gray-500">أو الدخول بواسطة</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* زر Google بتصميم أنيق ومحايد */}
          <button onClick={handleGoogle} type="button" disabled={loading}
            className="w-full py-4 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70">
            <GoogleIcon className="w-5 h-5" />
            <span dir="ltr">تسجيل الدخول بواسطة Google</span>
          </button>

          {/* رابط التسجيل */}
          <p className="text-center mt-10 text-sm text-gray-500 font-medium">
            ليس لديك حساب بعد؟{' '}
            <Link to="/register" className="font-bold text-[#fa4b6a] hover:text-[#d82a48] transition-colors">سجل كمالك أو وسيط</Link>
          </p>
        </div>
      </div>

      {/* القسم الأيسر: الهوية البصرية */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#fa4b6a] items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1600"
          alt="Chalet" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#fa4b6a]/95 to-[#d82a48]/95" />
        <div className="relative z-10 text-white p-12 max-w-lg text-right animate-fade-in">
          <div className="w-16 h-1.5 bg-white/30 rounded-full mb-8" />
          <h2 className="text-4xl font-black mb-4 leading-tight">منصتك الأولى<br/>لإدارة عقاراتك وشاليهاتك</h2>
          <p className="text-white/80 text-lg leading-relaxed font-medium">
            حلٌّ متكامل للوسطاء العقاريين وملاك الشاليهات — أدِر عقاراتك وحجوزاتك، وشارك صفحتك مع عملائك بكل سهولة واحترافية.
          </p>

          <div className="space-y-5 mt-12 pt-10 border-t border-white/10">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-base">إدارة العقارات والشاليهات</div>
                <div className="text-white/70 text-sm">كل وحداتك في مكان واحد منظّم</div>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                <CalendarCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-base">حجوزات بلا تعقيد</div>
                <div className="text-white/70 text-sm">تابع حجوزاتك وتقويم الإتاحة لحظياً</div>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-base">صفحة عرض احترافية</div>
                <div className="text-white/70 text-sm">شارك عقاراتك مع عملائك برابط واحد</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; margin: 0; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-up { animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        input[type="password"]::-ms-reveal, input[type="password"]::-ms-clear { display: none; }
      `}} />
    </div>
  );
}
