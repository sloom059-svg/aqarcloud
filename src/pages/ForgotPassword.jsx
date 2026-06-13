import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react';

import logo from '../aqar-cloud-logo.png';

const AIRBNB = '#FF385C';

// تنبيه صغير: تحقق من مجلد الرسائل غير المرغوبة (Junk/Spam)
const JunkNote = () => (
  <div className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-100 bg-amber-50 px-3.5 py-2.5 text-[12px] leading-5 text-amber-700 font-bold">
    <Info className="w-4 h-4 mt-0.5 shrink-0" />
    <span>لو ما وصلك الرمز خلال دقيقة، تأكد من مجلد <strong>الرسائل غير المرغوبة (Junk / Spam)</strong> أو <strong>Other</strong> في بريدك.</span>
  </div>
);

export default function ForgotPassword() {
  // step: 'email' | 'otp' | 'done'
  const [step, setStep] = useState('email');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [resendCooldown, setResendCooldown] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // المرحلة 1: إرسال رمز إلى البريد
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    if (!email) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/sendOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), purpose: 'reset' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'تعذر إرسال الرمز');
      setStep('otp');
      setResendCooldown(60);
      setNotice('أرسلنا رمز تحقق من 6 أرقام إلى بريدك.');
    } catch (err) {
      setError(err.message || 'تعذر إرسال الرمز، حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setNotice('');
    setLoading(true);
    try {
      const res = await fetch('/api/sendOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), purpose: 'reset' }),
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

  // المرحلة 2: التحقق من الرمز + تعيين كلمة مرور جديدة
  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!otp || otp.length !== 6) {
      setError('أدخل رمز التحقق المكوّن من 6 أرقام');
      return;
    }
    if (newPassword.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/resetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: otp.trim(),
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'تعذر إعادة التعيين');
      setStep('done');
    } catch (err) {
      setError(err.message || 'تعذر إعادة تعيين كلمة المرور.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const titles = {
    email: 'نسيت كلمة المرور؟',
    otp: 'تأكيد الرمز',
    done: 'تم بنجاح',
  };
  const subtitles = {
    email: 'أدخل بريدك وسنرسل لك رمز تحقق لإعادة تعيين كلمة المرور.',
    otp: `أدخل الرمز المرسَل إلى ${email} وكلمة المرور الجديدة.`,
    done: 'تم تحديث كلمة المرور. تقدر تسجّل الدخول الآن.',
  };
  const HeaderIcon = step === 'done' ? CheckCircle2 : step === 'otp' ? ShieldCheck : Mail;

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7] font-sans overflow-hidden text-zinc-950 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ backgroundColor: AIRBNB }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-zinc-900/5 blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-5 py-8 sm:px-8">
        <div className="w-full max-w-[440px] animate-fp-up">
          <div className="mb-6 flex justify-center">
            {!imageError ? (
              <img
                src={logo}
                alt="عقار كلاود"
                onError={() => setImageError(true)}
                className="object-contain max-h-[64px] max-w-[180px]"
              />
            ) : (
              <span className="text-xl font-black text-zinc-950">عقار كلاود</span>
            )}
          </div>

          <div className="rounded-[2rem] bg-white border border-zinc-200 shadow-[0_28px_70px_rgba(0,0,0,0.08)] p-6 sm:p-8">
            <div className="mb-5 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-950 text-white shadow-lg shadow-black/15 mb-4">
                <HeaderIcon className="w-5 h-5" />
              </div>
              <h1 className="text-[1.6rem] font-black tracking-tight text-zinc-950">{titles[step]}</h1>
              <p className="mt-2 text-sm leading-6 text-zinc-500 font-medium">{subtitles[step]}</p>
            </div>

            {error && (
              <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 text-center font-bold">
                {error}
              </div>
            )}
            {notice && step !== 'done' && (
              <div className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 text-center font-bold">
                {notice}
              </div>
            )}

            {step === 'email' && (
              <form className="space-y-4" onSubmit={handleSendCode}>
                <div>
                  <label className="block text-xs font-black text-zinc-800 mb-2">البريد الإلكتروني</label>
                  <div className="relative group">
                    <input
                      type="email"
                      dir="ltr"
                      autoFocus
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pr-11 pl-4 h-12 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:border-[#FF385C] focus:ring-4 focus:ring-[#FF385C]/10 outline-none transition-all duration-300 text-sm font-bold text-left placeholder:text-zinc-400"
                    />
                    <Mail className="w-4.5 h-4.5 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#FF385C] transition-colors" />
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
                      إرسال الرمز
                      <ArrowLeft className="w-4 h-4" />
                    </>
                  )}
                </button>

                <JunkNote />
              </form>
            )}

            {step === 'otp' && (
              <form className="space-y-4" onSubmit={handleReset}>
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

                <div>
                  <label className="block text-xs font-black text-zinc-800 mb-2">كلمة المرور الجديدة</label>
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      dir="ltr"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                      type={showPassword ? 'text' : 'password'}
                      dir="ltr"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pr-11 pl-4 h-12 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:border-[#FF385C] focus:ring-4 focus:ring-[#FF385C]/10 outline-none transition-all duration-300 text-sm font-bold text-left placeholder:text-zinc-400"
                    />
                    <Lock className="w-4.5 h-4.5 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#FF385C] transition-colors" />
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
                      جاري التعيين...
                    </>
                  ) : (
                    <>
                      تعيين كلمة المرور
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-sm font-bold pt-1">
                  <button
                    type="button"
                    onClick={() => { setStep('email'); setOtp(''); setError(''); setNotice(''); }}
                    className="text-zinc-500 hover:text-zinc-800 transition-colors"
                  >
                    تغيير البريد
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

                <JunkNote />
              </form>
            )}

            {step === 'done' && (
              <div className="text-center">
                <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="text-sm text-zinc-600 font-bold mb-6">
                  تم تحديث كلمة المرور بنجاح. تقدر الآن تسجّل الدخول بكلمتك الجديدة.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-[#181818] hover:bg-[#111111] text-white font-black text-sm shadow-[0_18px_38px_rgba(0,0,0,0.22)] transition-all duration-300"
                >
                  تسجيل الدخول
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {step !== 'done' && (
            <p className="text-center mt-5 text-sm text-zinc-500 font-bold">
              تذكّرت كلمة المرور؟{' '}
              <Link to="/login" className="font-black text-zinc-950 hover:text-[#FF385C] transition-colors">
                تسجيل الدخول
              </Link>
            </p>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; margin: 0; }
        @keyframes fpUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fp-up { animation: fpUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        input[type='password']::-ms-reveal,
        input[type='password']::-ms-clear { display: none; }
      ` }} />
    </div>
  );
}
