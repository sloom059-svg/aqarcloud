import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44, supabase } from '@/api/base44Client';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from 'lucide-react';

import logo from '../aqar-cloud-logo.png';
import SiteFooter from '@/components/layout/SiteFooter';

const AIRBNB = '#FF385C';

const BrandMark = ({ imageError, setImageError, className = '', imgClassName = '' }) => (
  <div className={className}>
    {!imageError ? (
      <img
        src={logo}
        alt="عقار كلاود"
        className={`object-contain ${imgClassName}`}
        onError={() => setImageError(true)}
      />
    ) : (
      <Building2 className="w-12 h-12 text-zinc-950" />
    )}
  </div>
);

const StatChip = ({ children }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3.5 py-2 text-[11px] font-black text-zinc-700 backdrop-blur-sm shadow-sm">
    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: AIRBNB }} />
    {children}
  </div>
);

export default function Register() {
  // step: 'form' = إدخال البيانات | 'otp' = إدخال الرمز
  const [step, setStep] = useState('form');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setMounted(true);
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';

    const redirectSignedInUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!isCancelled && user) {
          window.location.replace('/check-profile');
        }
      } catch (_) {}
    };
    redirectSignedInUser();

    return () => { isCancelled = true; };
  }, []);

  // عدّاد إعادة الإرسال
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const friendlyError = (message, fallback) => {
    if (!message) return fallback;
    const lower = message.toLowerCase();
    if (lower.includes('already registered') || lower.includes('already')) {
      return 'هذا البريد مسجل مسبقاً، جرّب تسجيل الدخول.';
    }
    if (lower.includes('password')) {
      return 'كلمة المرور غير مقبولة. استخدم 6 أحرف على الأقل.';
    }
    return message;
  };

  // ===== المرحلة 1: التحقق من البيانات وإرسال OTP =====
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!email || !password || !confirmPassword) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور وتأكيدها');
      return;
    }
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/sendOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), purpose: 'signup' }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'تعذر إرسال رمز التحقق');
      }

      setStep('otp');
      setResendCooldown(60);
      setNotice('أرسلنا رمز تحقق من 6 أرقام إلى بريدك.');
    } catch (err) {
      setError(friendlyError(err.message, 'تعذر إرسال رمز التحقق، حاول مرة أخرى.'));
    } finally {
      setLoading(false);
    }
  };

  // ===== إعادة إرسال الرمز =====
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setNotice('');
    setLoading(true);
    try {
      const res = await fetch('/api/sendOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), purpose: 'signup' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'تعذر إعادة الإرسال');
      setResendCooldown(60);
      setNotice('تم إرسال رمز جديد إلى بريدك.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== المرحلة 2: التحقق من الرمز + إنشاء الحساب =====
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!otp || otp.length !== 6) {
      setError('أدخل رمز التحقق المكوّن من 6 أرقام');
      return;
    }

    setLoading(true);
    try {
      // 1) تحقق من الرمز عبر الخادم
      const vRes = await fetch('/api/verifyOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: otp.trim(), purpose: 'signup' }),
      });
      const vData = await vRes.json();
      if (!vRes.ok || !vData.success) {
        throw new Error(vData.error || 'رمز غير صحيح');
      }

      // 2) أنشئ الحساب (Confirm email مطفّي → دخول مباشر)
      await base44.auth.register({ email: email.trim(), password });

      // 3) تأكد من الجلسة، وإن لزم سجّل دخول مباشر
      let { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        await base44.auth.loginViaEmailPassword(email.trim(), password);
        ({ data: { session } } = await supabase.auth.getSession());
      }

      if (!session?.user) {
        throw new Error('تم التحقق لكن تعذّر إنشاء الجلسة. جرّب تسجيل الدخول.');
      }

      setNotice('تم إنشاء الحساب بنجاح، جاري تحويلك...');
      window.location.replace('/check-profile');
    } catch (err) {
      setError(friendlyError(err.message, 'تعذر إكمال التسجيل، حاول مرة أخرى.'));
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7] font-sans overflow-hidden text-zinc-950 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ backgroundColor: AIRBNB }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-zinc-900/5 blur-3xl" />
      </div>

      <div className="hidden md:flex absolute top-8 left-8 lg:top-10 lg:left-10 z-20">
        <BrandMark
          imageError={imageError}
          setImageError={setImageError}
          className="flex items-center justify-center"
          imgClassName="max-h-14 lg:max-h-16 max-w-[160px] lg:max-w-[185px]"
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-start justify-center px-5 pt-4 pb-4 sm:px-8 sm:pt-6 sm:pb-6 md:pt-12 md:pb-10 lg:px-12 lg:pt-14">
        <div className="w-full max-w-6xl grid lg:grid-cols-[1.05fr_.95fr] gap-8 items-start">
          <section className="order-2 lg:order-1 flex justify-center lg:justify-end">
            <div className="w-full max-w-[440px] animate-register-up">
              <div className="rounded-[2rem] bg-white border border-zinc-200 shadow-[0_28px_70px_rgba(0,0,0,0.08)] p-5 sm:p-7">
                <div className="mb-5 text-right">
                  <div className="md:hidden mb-5 flex justify-center">
                    <BrandMark
                      imageError={imageError}
                      setImageError={setImageError}
                      className="flex items-center justify-center"
                      imgClassName="max-h-[80px] max-w-[200px]"
                    />
                  </div>

                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-950 text-white shadow-lg shadow-black/15 mb-4">
                    {step === 'form' ? <UserPlus className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                  </div>

                  <h1 className="text-[1.75rem] sm:text-[2rem] font-black tracking-tight text-zinc-950">
                    {step === 'form' ? 'إنشاء حساب جديد' : 'تأكيد البريد'}
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-zinc-500 font-medium">
                    {step === 'form'
                      ? 'سجّل بالإيميل وكلمة المرور، وبنرسل لك رمز تحقق لتأكيد بريدك.'
                      : `أدخل الرمز المرسَل إلى ${email}`}
                  </p>
                </div>

                {error && (
                  <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 text-center font-bold animate-in fade-in slide-in-from-top-2">
                    {error}
                  </div>
                )}
                {notice && (
                  <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 text-center font-bold animate-in fade-in slide-in-from-top-2">
                    {notice}
                  </div>
                )}

                {step === 'form' ? (
                  <form className="space-y-4" onSubmit={handleSendOtp}>
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
                      <label className="block text-xs font-black text-zinc-800 mb-2">كلمة المرور</label>
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
                          aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                        >
                          {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-zinc-800 mb-2">تأكيد كلمة المرور</label>
                      <div className="relative group">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          dir="ltr"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="w-full pr-11 pl-11 h-12 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:border-[#FF385C] focus:ring-4 focus:ring-[#FF385C]/10 outline-none transition-all duration-300 text-sm font-bold text-left placeholder:text-zinc-400"
                        />
                        <Lock className="w-4.5 h-4.5 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#FF385C] transition-colors" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 focus:outline-none transition-colors"
                          aria-label={showConfirmPassword ? 'إخفاء تأكيد كلمة المرور' : 'إظهار تأكيد كلمة المرور'}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 rounded-2xl bg-[#181818] hover:bg-[#111111] text-white font-black text-sm shadow-[0_18px_38px_rgba(0,0,0,0.22)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4.5 h-4.5 animate-spin" />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          متابعة
                          <ArrowLeft className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form className="space-y-4" onSubmit={handleVerifyAndRegister}>
                    <div>
                      <label className="block text-xs font-black text-zinc-800 mb-2">رمز التحقق</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        dir="ltr"
                        maxLength={6}
                        placeholder="------"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        required
                        className="w-full h-14 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:border-[#FF385C] focus:ring-4 focus:ring-[#FF385C]/10 outline-none transition-all duration-300 text-2xl font-black text-center tracking-[0.5em] placeholder:text-zinc-300"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 rounded-2xl bg-[#181818] hover:bg-[#111111] text-white font-black text-sm shadow-[0_18px_38px_rgba(0,0,0,0.22)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4.5 h-4.5 animate-spin" />
                          جاري التأكيد...
                        </>
                      ) : (
                        <>
                          تأكيد وإنشاء الحساب
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-sm font-bold pt-1">
                      <button
                        type="button"
                        onClick={() => { setStep('form'); setOtp(''); setError(''); setNotice(''); }}
                        className="text-zinc-500 hover:text-zinc-800 transition-colors"
                      >
                        تعديل البريد
                      </button>
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendCooldown > 0 || loading}
                        className="text-zinc-950 hover:text-[#FF385C] transition-colors disabled:text-zinc-300"
                      >
                        {resendCooldown > 0 ? `إعادة الإرسال (${resendCooldown})` : 'إعادة إرسال الرمز'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <p className="text-center mt-4 md:mt-5 text-sm text-zinc-500 font-bold">
                لديك حساب بالفعل؟{' '}
                <Link to="/login" className="font-black text-zinc-950 hover:text-[#FF385C] transition-colors">
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </section>

          <section className="order-1 lg:order-2 hidden md:flex items-center lg:justify-start justify-center pt-8 lg:pt-20">
            <div className="w-full max-w-[430px] lg:max-w-[500px] text-right animate-register-fade">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/85 px-4 py-2 text-xs font-black text-zinc-700 backdrop-blur-sm shadow-sm">
                <Sparkles className="w-4 h-4" style={{ color: AIRBNB }} />
                التسجيل صار أبسط
              </div>
              <h2 className="mt-6 text-4xl lg:text-[3.2rem] font-black leading-[1.15] tracking-tight text-zinc-950">
                ابدأ حسابك
                <br />
                بخطوة واحدة
              </h2>
              <p className="mt-4 text-sm lg:text-base leading-8 text-zinc-500 font-medium max-w-lg">
                أنشئ حسابك خلال ثوانٍ، ثم أكمل بيانات نشاطك وابدأ بإطلاق صفحتك الاحترافية.
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <StatChip>تأكيد آمن بالرمز</StatChip>
                <StatChip>إكمال البيانات لاحقاً</StatChip>
                <StatChip>مناسب للشاليهات والوسطاء</StatChip>
              </div>
              <SiteFooter className="!mt-8 !border-t-0 !bg-transparent" />
            </div>
          </section>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; margin: 0; }
        @keyframes registerUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes registerFade { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .animate-register-up { animation: registerUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-register-fade { animation: registerFade 0.8s ease-out forwards; }
        input[type='password']::-ms-reveal,
        input[type='password']::-ms-clear { display: none; }
      ` }} />
    </div>
  );
}
