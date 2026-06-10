import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  Loader2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Building2,
  Share2,
  CalendarCheck,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

import logo from '../aqar-cloud-logo.png';

const AIRBNB = '#FF385C';

const GoogleIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const BrandMark = ({ imageError, setImageError, className = '', imgClassName = '' }) => (
  <div className={className}>
    {!imageError ? (
      <img
        src={logo}
        alt="Aqar Cloud Logo"
        className={`object-contain ${imgClassName}`}
        onError={() => setImageError(true)}
      />
    ) : (
      <Building2 className="w-12 h-12 text-zinc-950" />
    )}
  </div>
);

const FeatureRow = ({ icon: Icon, title, text }) => (
  <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.06] p-3.5 backdrop-blur-md">
    <div className="w-10 h-10 rounded-2xl bg-white text-zinc-950 flex items-center justify-center shrink-0">
      <Icon className="w-4.5 h-4.5" />
    </div>
    <div>
      <p className="text-sm font-black text-white">{title}</p>
      <p className="text-xs font-medium text-white/60 mt-0.5">{text}</p>
    </div>
  </div>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState('');
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
      setError('يرجى إدخال جميع البيانات المطلوبة');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = '/';
    } catch (err) {
      setError(err.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider('google', '/check-profile');
  };

  if (!mounted) return null;

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7] font-sans overflow-hidden text-zinc-950">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-36 -right-32 w-80 h-80 rounded-full blur-3xl opacity-15" style={{ backgroundColor: AIRBNB }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-zinc-900/5 blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen grid lg:grid-cols-[0.92fr_1.08fr]">
        {/* الفورم */}
        <section className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-[430px] animate-login-up">
            {/* هوية مختصرة للجوال فقط حتى لا تختفي العلامة التجارية */}
            <div className="lg:hidden mb-6 text-center">
              <BrandMark
                imageError={imageError}
                setImageError={setImageError}
                className="mx-auto mb-3 flex h-20 items-center justify-center"
                imgClassName="max-h-20 max-w-[190px]"
              />
              <p className="text-sm font-black text-zinc-950">إدارة الشاليهات والحجوزات بسهولة</p>
              <p className="mt-1 text-xs font-bold text-zinc-500">صفحتك، أسعارك، وحجوزاتك في مكان واحد.</p>
            </div>

            <div className="rounded-[2.1rem] bg-white border border-zinc-200 shadow-[0_30px_80px_rgba(0,0,0,0.08)] p-5 sm:p-7">
              <div className="mb-5 text-right">
                <span className="inline-flex items-center rounded-full bg-[#FF385C]/10 px-3 py-1 text-[11px] font-black text-[#FF385C]">
                  دخول آمن وسريع
                </span>
                <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">
                  سجّل دخولك لحسابك
                </h1>
                <p className="mt-2 text-sm leading-6 text-zinc-500 font-medium">
                  تابع عقاراتك، صفحاتك، وحجوزاتك من لوحة تحكم واحدة.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 text-center font-bold animate-in fade-in slide-in-from-top-2">
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-black text-zinc-800 mb-2">البريد الإلكتروني</label>
                  <div className="relative group">
                    <input
                      type="email"
                      dir="ltr"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pr-11 pl-4 h-12 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:border-[#FF385C] focus:ring-4 focus:ring-[#FF385C]/10 outline-none transition-all duration-300 text-sm font-bold text-left placeholder:text-zinc-400"
                    />
                    <Mail className="w-4.5 h-4.5 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#FF385C] transition-colors" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-black text-zinc-800">كلمة المرور</label>
                    <Link to="/forgot-password" className="text-[11px] font-black text-zinc-500 hover:text-[#FF385C] transition-colors">
                      نسيت كلمة المرور؟
                    </Link>
                  </div>
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      dir="ltr"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pr-11 pl-11 h-12 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:border-[#FF385C] focus:ring-4 focus:ring-[#FF385C]/10 outline-none transition-all duration-300 text-sm font-bold text-left placeholder:text-zinc-400"
                    />
                    <Lock className="w-4.5 h-4.5 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#FF385C] transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 focus:outline-none transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-2xl bg-zinc-950 hover:bg-black text-white font-black text-sm shadow-[0_18px_38px_rgba(0,0,0,0.22)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                      جاري التحقق...
                    </>
                  ) : (
                    <>
                      تسجيل الدخول
                      <ArrowLeft className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center gap-3 my-3 opacity-70">
                <div className="flex-1 h-px bg-zinc-200" />
                <span className="text-[11px] font-black text-zinc-400">أو</span>
                <div className="flex-1 h-px bg-zinc-200" />
              </div>

              <button
                onClick={handleGoogle}
                type="button"
                disabled={loading}
                className="w-full h-12 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-900 font-black text-sm transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 shadow-sm active:scale-[0.99]"
              >
                <GoogleIcon className="w-5 h-5" />
                <span>الدخول بواسطة Google</span>
              </button>
            </div>

            <p className="text-center mt-6 text-sm text-zinc-500 font-bold">
              ليس لديك حساب؟{' '}
              <Link to="/register" className="font-black text-zinc-950 hover:text-[#FF385C] transition-colors">
                ابدأ كمالك أو وسيط
              </Link>
            </p>
          </div>
        </section>

        {/* اللوحة التسويقية */}
        <section className="hidden lg:flex relative min-h-screen items-center justify-center overflow-hidden bg-zinc-950 p-10">
          <img
            src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1600"
            alt="Chalet"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950/90 to-black/80" />
          <div className="absolute top-12 right-12 w-28 h-28 rounded-full blur-3xl opacity-40" style={{ backgroundColor: AIRBNB }} />
          <div className="absolute bottom-16 left-16 w-44 h-44 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 w-full max-w-xl text-right text-white animate-login-fade">
            <div className="mb-9 inline-flex min-h-24 min-w-[230px] items-center justify-center rounded-[2rem] border border-white/10 bg-white/95 px-8 py-5 shadow-2xl shadow-black/25">
              <BrandMark
                imageError={imageError}
                setImageError={setImageError}
                className="flex items-center justify-center"
                imgClassName="max-h-24 max-w-[240px]"
              />
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black text-white/85 backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4" style={{ color: AIRBNB }} />
              تجربة سهلة لأصحاب الشاليهات والوسطاء
            </div>

            <h2 className="mt-8 text-5xl font-black leading-[1.12] tracking-tight">
              صفحتك العقارية
              <br />
              جاهزة للمشاركة خلال دقائق.
            </h2>
            <p className="mt-5 text-base leading-8 text-white/68 font-medium max-w-lg">
              صمّم صفحة احترافية، اعرض الصور والأسعار، واستقبل العملاء عبر رابط واحد بسيط.
            </p>

            <div className="grid grid-cols-1 gap-3 mt-10 max-w-md">
              <FeatureRow icon={Building2} title="إدارة مرتبة" text="كل عقاراتك وشاليهاتك في لوحة واحدة." />
              <FeatureRow icon={CalendarCheck} title="حجوزات أوضح" text="اعرف الإتاحة وتابع الطلبات بسهولة." />
              <FeatureRow icon={Share2} title="رابط جاهز" text="شارك صفحتك مع العملاء فورًا." />
            </div>

            <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.08] p-4 backdrop-blur-md flex items-center justify-between max-w-md">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" style={{ color: AIRBNB }} />
                </div>
                <div>
                  <p className="text-sm font-black">ابدأ بدون تعقيد</p>
                  <p className="text-xs text-white/55 font-medium">تسجيل سريع وربط مباشر بملفك.</p>
                </div>
              </div>
              <span className="text-[11px] font-black rounded-full px-3 py-1.5" style={{ backgroundColor: AIRBNB }}>
                جديد
              </span>
            </div>
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; margin: 0; }
        @keyframes loginUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes loginFade { from { opacity: 0; transform: scale(.98); } to { opacity: 1; transform: scale(1); } }
        .animate-login-up { animation: loginUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-login-fade { animation: loginFade 0.9s ease-out forwards; }
        input[type='password']::-ms-reveal,
        input[type='password']::-ms-clear { display: none; }
      ` }} />
    </div>
  );
}
