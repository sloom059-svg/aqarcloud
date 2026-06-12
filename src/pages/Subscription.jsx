import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { ArrowRight, Check, Crown, Sparkles, Calendar, ShieldCheck } from 'lucide-react';
import {
  getSubscriptionState, formatDate, SUBSCRIPTION_LINKS, PLANS, GRACE_DAYS,
} from '@/lib/subscription';

const AIRBNB = '#FF385C';

export default function Subscription() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const state = getSubscriptionState(user);

  const planLabel = PLANS[state.plan]?.label || 'غير محدد';

  // لون ونص الحالة
  let statusColor = '#16a34a', statusBg = '#f0fdf4', statusText = 'اشتراكك فعّال';
  if (state.status === 'grace') {
    statusColor = '#d97706'; statusBg = '#fffbeb';
    statusText = `انتهى اشتراكك — لديك مهلة ${state.graceDaysLeft} يوم`;
  } else if (state.status === 'expired') {
    statusColor = '#dc2626'; statusBg = '#fef2f2';
    statusText = 'انتهى اشتراكك';
  } else if (state.expiresInWarn) {
    statusColor = '#d97706'; statusBg = '#fffbeb';
    statusText = `اشتراكك ينتهي خلال ${state.daysLeft} يوم`;
  }

  const plans = [
    {
      key: 'semi',
      name: 'نصف سنوي',
      period: 'لمدة 6 أشهر',
      price: 290,
      monthlyPrice: (290/6).toFixed(1),
      saving: 'الأقل سعراً للبداية',
      featured: true,
      badge: 'الأنسب للبداية',
      features: ['نشر شاليهك للعملاء', 'حجوزات غير محدودة', 'علامة التوثيق ✓', 'دعم فني'],
    },
    {
      key: 'yearly',
      name: 'الاشتراك السنوي',
      period: 'لمدة 12 شهر',
      price: 480,
      monthlyPrice: 40,
      featured: false,
      features: ['نشر شاليهك للعملاء', 'حجوزات غير محدودة', 'علامة التوثيق ✓', 'دعم فني مميز', 'كل الثيمات'],
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#fcfcfc]" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');`}</style>

      {/* الهيدر */}
      <div className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/venue')}
            className="h-10 w-10 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center transition">
            <ArrowRight className="w-5 h-5 text-zinc-700" />
          </button>
          <h1 className="text-lg font-bold text-zinc-900">اشتراكاتي</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* بطاقة الحالة الحالية */}
        <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${AIRBNB}15` }}>
                  <Crown className="w-5 h-5" style={{ color: AIRBNB }} />
                </div>
                <div>
                  <p className="text-xs text-zinc-400 font-bold">الباقة الحالية</p>
                  <p className="text-base font-bold text-zinc-900">{planLabel}</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ color: statusColor, background: statusBg }}>
                {statusText}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-50 rounded-2xl p-3.5">
                <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">ينتهي في</span>
                </div>
                <p className="text-sm font-bold text-zinc-800">{formatDate(state.endDate)}</p>
              </div>
              <div className="bg-zinc-50 rounded-2xl p-3.5">
                <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">المتبقي</span>
                </div>
                <p className="text-sm font-bold text-zinc-800">
                  {state.status === 'active' ? `${state.daysLeft} يوم` : state.status === 'grace' ? `مهلة ${state.graceDaysLeft} يوم` : 'منتهي'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* الباقات */}
        <div>
          <h2 className="text-base font-bold text-zinc-900 mb-3 px-1">اختر باقتك</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {plans.map(p => (
              <div key={p.key}
                className={`relative bg-white rounded-3xl border-2 overflow-hidden transition-all ${p.featured ? 'border-[#FF385C] shadow-lg' : 'border-zinc-100 shadow-sm'}`}>
                {p.badge && (
                  <div className="absolute top-0 left-0 text-white text-[11px] font-bold px-3 py-1 rounded-br-2xl" style={{ background: AIRBNB }}>
                    {p.badge}
                  </div>
                )}
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg font-bold text-zinc-900 mb-1">{p.name}</h3>
                  <p className="text-sm text-zinc-400 font-medium mb-3">{p.period}</p>

                  {/* السعر */}
                  <div className="mb-2">
                    <span className="text-3xl font-black text-zinc-900" dir="ltr">{p.price}</span>
                    <span className="text-sm text-zinc-400 font-medium"> ر.س</span>
                  </div>
                  {/* التوفير الشهري */}
                  <div className="mb-4 flex items-center gap-1.5">
                    <span className="text-xs text-zinc-500 font-medium" dir="ltr">
                      ≈ {p.monthlyPrice} ر.س / شهر
                    </span>
                    {p.featured && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-emerald-700 bg-emerald-50">
                        {p.saving}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-zinc-600 font-medium">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${AIRBNB}15` }}>
                          <Check className="w-3 h-3" style={{ color: AIRBNB }} strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a href={SUBSCRIPTION_LINKS[p.key]} target="_blank" rel="noopener noreferrer"
                    className={`w-full h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${p.featured ? 'text-white shadow-md hover:-translate-y-0.5' : 'text-zinc-800 bg-zinc-100 hover:bg-zinc-200'}`}
                    style={p.featured ? { background: AIRBNB } : {}}>
                    اشترك الآن
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ملاحظة */}
        <div className="flex items-start gap-2.5 bg-blue-50/50 border border-blue-100 rounded-2xl p-4">
          <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-600 font-medium leading-relaxed">
            بعد الدفع عبر السلة، سيتم تفعيل اشتراكك خلال وقت قصير. ستصلك إشعار بالتجديد فور التفعيل.
          </p>
        </div>
      </div>
    </div>
  );
}
