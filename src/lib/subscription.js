/*
  منطق الاشتراك الموحّد — يُحسب من حقل subscription_end في profiles.
  الحالات:
    active  → الاشتراك/التجربة شغّالة
    grace   → انتهى لكن في مهلة 5 أيام (الصفحة شغّالة + تنبيه)
    expired → انتهى وعدّت المهلة (الصفحة العامة تتوقف، الميزات تتقفل)
*/

export const GRACE_DAYS = 5;
export const TRIAL_DAYS = 30;
export const WARN_DAYS = 3; // تنبيه قبل الانتهاء بـ 3 أيام

// روابط سلة لكل باقة — غيّرها بروابطك
export const SUBSCRIPTION_LINKS = {
  yearly: 'https://salla.sa/PLACEHOLDER-yearly',
  semi: 'https://salla.sa/PLACEHOLDER-semi',
};

export const PLANS = {
  trial: { label: 'تجربة مجانية', months: 1 },
  semi: { label: 'نصف سنوي', months: 6 },
  yearly: { label: 'سنوي', months: 12 },
};

// يحسب حالة الاشتراك من بيانات المستخدم
export function getSubscriptionState(user) {
  if (!user) return { status: 'expired', daysLeft: 0, plan: null, endDate: null, inGrace: false, expiresInWarn: false };

  const end = user.subscription_end ? new Date(user.subscription_end) : null;
  const plan = user.subscription_plan || 'trial';

  // لا يوجد تاريخ انتهاء → نعتبره منتهي (احتياط)
  if (!end || isNaN(end.getTime())) {
    return { status: 'expired', daysLeft: 0, plan, endDate: null, inGrace: false, expiresInWarn: false };
  }

  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.ceil((end.getTime() - now.getTime()) / msPerDay);

  // لسه شغّال
  if (daysLeft > 0) {
    return {
      status: 'active',
      daysLeft,
      plan,
      endDate: end,
      inGrace: false,
      expiresInWarn: daysLeft <= WARN_DAYS, // قرب ينتهي
    };
  }

  // انتهى — نشوف المهلة
  const daysSinceEnd = Math.abs(daysLeft);
  if (daysSinceEnd <= GRACE_DAYS) {
    return {
      status: 'grace',
      daysLeft: 0,
      graceDaysLeft: GRACE_DAYS - daysSinceEnd,
      plan,
      endDate: end,
      inGrace: true,
      expiresInWarn: true,
    };
  }

  // انتهى نهائياً
  return { status: 'expired', daysLeft: 0, plan, endDate: end, inGrace: false, expiresInWarn: false };
}

// هل علامة التوثيق تظهر؟ (active أو grace فقط)
export function isVerified(user) {
  const s = getSubscriptionState(user);
  return s.status === 'active' || s.status === 'grace';
}

// هل الميزات المدفوعة متاحة؟ (حجز يدوي، إضافة شاليه)
export function canUsePaidFeatures(user) {
  const s = getSubscriptionState(user);
  return s.status === 'active' || s.status === 'grace';
}

// هل الصفحة العامة تشتغل؟ (تتوقف فقط لو expired نهائياً)
export function isPublicPageActive(user) {
  const s = getSubscriptionState(user);
  return s.status !== 'expired';
}

// يحسب تاريخ انتهاء جديد عند التفعيل (ذكي: يضيف على المتبقي لو لسه شغّال)
export function computeNewEndDate(currentEnd, plan) {
  const months = PLANS[plan]?.months || 12;
  const now = new Date();
  // لو لسه عنده وقت، نبني على تاريخ انتهائه. وإلا من اليوم.
  let base = now;
  if (currentEnd) {
    const cur = new Date(currentEnd);
    if (!isNaN(cur.getTime()) && cur.getTime() > now.getTime()) base = cur;
  }
  const result = new Date(base);
  result.setMonth(result.getMonth() + months);
  return result;
}

// تنسيق التاريخ بالعربي
export function formatDate(date) {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
}
