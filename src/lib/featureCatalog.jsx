import React from 'react';

/*
  كتالوج المميزات الموحّد — لكل نوع مكان (شاليه / مخيم / مزرعة / استراحة) قائمته الخاصة.
  كل ميزة: أيقونة SVG + وصف جذاب حسب طابع المكان.
  الاستخدام:
    import { getFeaturesForType, getFeatureMeta } from '@/lib/featureCatalog';
    const features = getFeaturesForType('مخيم');           // قائمة الميزات للنوع
    const meta = getFeatureMeta('مسبح', 'شاليه');           // { Icon, desc } لميزة معينة
*/

const S = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

/* ── الأيقونات ── */
export const FeatureIcons = {
  pool:    (p) => <svg {...S} {...p}><path d="M2 12h20M2 16c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2"/><circle cx="7" cy="8" r="2"/><path d="M7 10v2"/></svg>,
  jacuzzi: (p) => <svg {...S} {...p}><path d="M3 12h18v4a4 4 0 01-4 4H7a4 4 0 01-4-4v-4z"/><path d="M7 8c0-1 1-1 1-2s-1-1-1-2M12 8c0-1 1-1 1-2s-1-1-1-2M17 8c0-1 1-1 1-2s-1-1-1-2"/></svg>,
  seats:   (p) => <svg {...S} {...p}><path d="M4 18v-6a2 2 0 012-2h12a2 2 0 012 2v6"/><path d="M2 18h20M6 10V7a2 2 0 012-2h8a2 2 0 012 2v3"/></svg>,
  bed:     (p) => <svg {...S} {...p}><path d="M2 20v-8a2 2 0 012-2h16a2 2 0 012 2v8"/><path d="M2 12V6a2 2 0 012-2h16a2 2 0 012 2v6"/><path d="M2 18h20M7 12v-2h10v2"/></svg>,
  kitchen: (p) => <svg {...S} {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 10h18M8 6h.01M12 6h.01M9 14v4M15 14v4"/></svg>,
  wifi:    (p) => <svg {...S} {...p}><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></svg>,
  key:     (p) => <svg {...S} {...p}><circle cx="8" cy="15" r="4"/><path d="M10.85 12.15L19 4M18 5l2 2M15 8l2 2"/></svg>,
  men:     (p) => <svg {...S} {...p}><circle cx="10" cy="14" r="5"/><path d="M19 5l-5.4 5.4M14 5h5v5"/></svg>,
  women:   (p) => <svg {...S} {...p}><circle cx="12" cy="9" r="5"/><path d="M12 14v7M9 18h6"/></svg>,
  kids:    (p) => <svg {...S} {...p}><circle cx="12" cy="5" r="2"/><path d="M12 7v5l-3 3M12 12l3 3M8 21l2-5M16 21l-2-5"/></svg>,
  grill:   (p) => <svg {...S} {...p}><path d="M4 12h16M12 12V6M8 12l-2 6M16 12l2 6M6 6h12a1 1 0 000-2H6a1 1 0 000 2z"/></svg>,
  snow:    (p) => <svg {...S} {...p}><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 7l-5-5-5 5M17 17l-5 5-5-5M2 12l5-5 5 5-5 5-5-5zM22 12l-5-5-5 5 5 5 5-5z"/></svg>,
  fire:    (p) => <svg {...S} {...p}><path d="M12 2c0 6-6 8-6 14a6 6 0 0012 0c0-4-2-7-3-9-1 2-1 4-3 5 1-3 0-7 0-10z"/></svg>,
  cinema:  (p) => <svg {...S} {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M10 9l5 3-5 3V9z"/></svg>,
  games:   (p) => <svg {...S} {...p}><rect x="2" y="7" width="20" height="12" rx="4"/><path d="M7 13h4M9 11v4M15 12h.01M17 14h.01"/></svg>,
  field:   (p) => <svg {...S} {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M12 5v14"/></svg>,
  car:     (p) => <svg {...S} {...p}><path d="M5 17h14M6 11l1.5-5h9L18 11M4 11h16a1 1 0 011 1v4h-2M3 16v-4a1 1 0 011-1"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></svg>,
  power:   (p) => <svg {...S} {...p}><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg>,
  wood:    (p) => <svg {...S} {...p}><path d="M4 16l8-8M8 20l8-8M4 16a2 2 0 102 2M8 20a2 2 0 102 2M12 8a2 2 0 10-2-2M16 12a2 2 0 10-2-2"/><path d="M14 18c2 0 4-2 4-4"/></svg>,
  tent:    (p) => <svg {...S} {...p}><path d="M12 2L2 20h20L12 2z"/><path d="M12 2v18M7 20l5-8 5 8"/></svg>,
  campfire:(p) => <svg {...S} {...p}><path d="M12 3c0 4-4 5-4 9a4 4 0 008 0c0-4-4-5-4-9z"/><path d="M4 21l16-4M20 21L4 17"/></svg>,
  wc:      (p) => <svg {...S} {...p}><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 7v4M10 11h4M9 16h6"/></svg>,
  tv:      (p) => <svg {...S} {...p}><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M8 2l4 4 4-4"/></svg>,
  sound:   (p) => <svg {...S} {...p}><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 010 7M19 5a9 9 0 010 14"/></svg>,
  garden:  (p) => <svg {...S} {...p}><path d="M12 22V12M12 12C12 7 7 4 3 6c3 0 6 2 9 6M12 12c0-5 5-8 9-6-3 0-6 2-9 6"/></svg>,
  bait:    (p) => <svg {...S} {...p}><path d="M3 20h18M5 20V10l7-6 7 6v10"/><path d="M9 20v-6h6v6"/></svg>,
  animals: (p) => <svg {...S} {...p}><circle cx="12" cy="13" r="5"/><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><path d="M9 12h.01M15 12h.01M12 15v1"/></svg>,
  majlis:  (p) => <svg {...S} {...p}><path d="M3 18v-6a2 2 0 012-2h14a2 2 0 012 2v6"/><path d="M3 18h18M3 14h18M7 10V7h10v3"/></svg>,
};

/* ── كتالوج المميزات حسب النوع ── */
export const FEATURE_CATALOG = {
  'شاليه': [
    { id: 'مسبح', icon: 'pool', desc: 'مسبح خاص يمنح ضيوفك خصوصية كاملة وتجربة استرخاء لا تُنسى' },
    { id: 'جاكوزي', icon: 'jacuzzi', desc: 'جاكوزي للاسترخاء التام وتجربة سبا فاخرة' },
    { id: 'جلسات خارجية', icon: 'seats', desc: 'جلسات مرتبة للاستراحة والسهرات مع أجواء هادئة' },
    { id: 'غرف نوم', icon: 'bed', desc: 'غرف هادئة بفرش مريح وتجهيز مناسب لإقامة مثالية' },
    { id: 'مطبخ', icon: 'kitchen', desc: 'مطبخ مجهز بكل ما تحتاجه لتحضير وجباتك بسهولة' },
    { id: 'واي فاي', icon: 'wifi', desc: 'اتصال سريع مناسب للبث والعمل ومشاركة اللحظات' },
    { id: 'دخول ذاتي', icon: 'key', desc: 'تعليمات وصول واضحة وسهلة بدون انتظار' },
    { id: 'قسم رجال', icon: 'men', desc: 'قسم مستقل للرجال يضمن الخصوصية والراحة' },
    { id: 'قسم نساء', icon: 'women', desc: 'قسم مستقل للنساء بخصوصية تامة وتجهيز كامل' },
    { id: 'ألعاب أطفال', icon: 'kids', desc: 'منطقة لعب آمنة وممتعة تسعد الصغار طوال الإقامة' },
    { id: 'شواء', icon: 'grill', desc: 'ركن شواء مجهز لأجمل السهرات والتجمعات' },
    { id: 'حطب', icon: 'wood', desc: 'حطب جاهز لركن الشواء وجلسات النار الليلية' },
    { id: 'مكيف', icon: 'snow', desc: 'تكييف في جميع المساحات لأجواء مريحة صيفاً وشتاءً' },
    { id: 'مدفأة', icon: 'fire', desc: 'دفء وأجواء شتوية ساحرة لليالي الباردة' },
    { id: 'غرفة سينما', icon: 'cinema', desc: 'غرفة سينما خاصة لأمسيات عائلية لا تُنسى' },
    { id: 'صالة ألعاب', icon: 'games', desc: 'صالة ألعاب ممتعة تجمع الكل بأجواء حماسية' },
    { id: 'ملعب', icon: 'field', desc: 'ملعب واسع للأنشطة الرياضية والمرح الجماعي' },
    { id: 'موقف سيارات', icon: 'car', desc: 'مواقف مريحة وسهولة وصول بجانب المكان' },
    { id: 'مولد كهرباء', icon: 'power', desc: 'طاقة احتياطية تضمن استمرار راحتك بدون انقطاع' },
  ],

  'مخيم': [
    { id: 'خيام مجهزة', icon: 'tent', desc: 'خيام مؤثثة بفرش نظيف ومريح لتجربة برية فاخرة' },
    { id: 'جلسة نار', icon: 'campfire', desc: 'جلسة حطب وسط البر لأجمل سوالف الليل' },
    { id: 'حطب', icon: 'wood', desc: 'حطب متوفر لجلسة نار دافئة وسط البر' },
    { id: 'شواء', icon: 'grill', desc: 'ركن شواء مجهز لأطيب العشاءات البرية' },
    { id: 'جلسات خارجية', icon: 'seats', desc: 'جلسات بدوية أصيلة تحت السماء المفتوحة' },
    { id: 'دورات مياه', icon: 'wc', desc: 'دورات مياه نظيفة ومجهزة داخل المخيم' },
    { id: 'كهرباء', icon: 'power', desc: 'إنارة وكهرباء متوفرة طوال الليل' },
    { id: 'قسم رجال', icon: 'men', desc: 'قسم مستقل للرجال بخصوصية كاملة' },
    { id: 'قسم نساء', icon: 'women', desc: 'قسم مستقل للنساء بخصوصية تامة' },
    { id: 'ألعاب أطفال', icon: 'kids', desc: 'مساحة لعب آمنة للصغار وسط الطبيعة' },
    { id: 'موقف سيارات', icon: 'car', desc: 'موقف قريب وسهولة وصول حتى باب المخيم' },
    { id: 'تلفزيون', icon: 'tv', desc: 'شاشة لمتابعة المباريات والسهرات' },
    { id: 'صوتيات', icon: 'sound', desc: 'نظام صوتي لأجواء حماسية في سهراتك' },
  ],

  'مزرعة': [
    { id: 'مسبح', icon: 'pool', desc: 'مسبح منعش وسط أجواء المزرعة الخضراء' },
    { id: 'حديقة', icon: 'garden', desc: 'مساحات خضراء واسعة تريح النظر والنفس' },
    { id: 'جلسات خارجية', icon: 'seats', desc: 'جلسات ريفية هادئة وسط الطبيعة' },
    { id: 'بيت شعر', icon: 'bait', desc: 'بيت شعر أصيل لأجواء تراثية ممتعة' },
    { id: 'شواء', icon: 'grill', desc: 'ركن شواء لأحلى الجلسات العائلية' },
    { id: 'حطب', icon: 'wood', desc: 'حطب جاهز لأمسيات الشواء والسمر الريفية' },
    { id: 'مطبخ', icon: 'kitchen', desc: 'مطبخ مجهز لتحضير وجباتك الطازجة' },
    { id: 'غرف نوم', icon: 'bed', desc: 'غرف مريحة لإقامة ريفية هانئة' },
    { id: 'حيوانات أليفة', icon: 'animals', desc: 'تجربة ممتعة للأطفال مع حيوانات المزرعة' },
    { id: 'ملعب', icon: 'field', desc: 'ملعب واسع للأنشطة والمرح الجماعي' },
    { id: 'ألعاب أطفال', icon: 'kids', desc: 'منطقة لعب آمنة وسط الهواء الطلق' },
    { id: 'دورات مياه', icon: 'wc', desc: 'دورات مياه نظيفة ومجهزة' },
    { id: 'موقف سيارات', icon: 'car', desc: 'مواقف واسعة داخل المزرعة' },
    { id: 'مولد كهرباء', icon: 'power', desc: 'كهرباء مستمرة بدون انقطاع' },
  ],

  'استراحة': [
    { id: 'مسبح', icon: 'pool', desc: 'مسبح خاص بخصوصية كاملة للعائلة' },
    { id: 'مجلس', icon: 'majlis', desc: 'مجلس واسع مؤثث لضيافة فاخرة' },
    { id: 'جلسات خارجية', icon: 'seats', desc: 'جلسات مرتبة للسهرات والتجمعات' },
    { id: 'مطبخ', icon: 'kitchen', desc: 'مطبخ مجهز بكامل الأدوات' },
    { id: 'شواء', icon: 'grill', desc: 'ركن شواء لأجمل السهرات' },
    { id: 'حطب', icon: 'wood', desc: 'حطب متوفر لجلسات الشواء والسهرات' },
    { id: 'قسم رجال', icon: 'men', desc: 'قسم مستقل للرجال بخصوصية تامة' },
    { id: 'قسم نساء', icon: 'women', desc: 'قسم مستقل للنساء بتجهيز كامل' },
    { id: 'واي فاي', icon: 'wifi', desc: 'إنترنت سريع لكل احتياجاتك' },
    { id: 'ألعاب أطفال', icon: 'kids', desc: 'منطقة لعب آمنة وممتعة للصغار' },
    { id: 'ملعب', icon: 'field', desc: 'ملعب للأنشطة الرياضية والترفيه' },
    { id: 'مكيف', icon: 'snow', desc: 'تكييف كامل لراحة تامة' },
    { id: 'غرف نوم', icon: 'bed', desc: 'غرف مريحة للإقامة والقيلولة' },
    { id: 'صالة ألعاب', icon: 'games', desc: 'بلياردو وألعاب لأجواء حماسية' },
    { id: 'موقف سيارات', icon: 'car', desc: 'مواقف مريحة وسهولة وصول' },
  ],
};

/* ── دوال الاستدعاء ── */

// قائمة ميزات نوع معيّن (افتراضي: شاليه)
export function getFeaturesForType(venueType) {
  return FEATURE_CATALOG[venueType] || FEATURE_CATALOG['شاليه'];
}

// بيانات ميزة معيّنة (أيقونة + وصف) — يبحث في نوع المكان أولاً ثم في كل الأنواع
export function getFeatureMeta(featureId, venueType) {
  const list = FEATURE_CATALOG[venueType] || [];
  let found = list.find(f => f.id === featureId);
  if (!found) {
    for (const type of Object.keys(FEATURE_CATALOG)) {
      found = FEATURE_CATALOG[type].find(f => f.id === featureId);
      if (found) break;
    }
  }
  if (!found) return { Icon: FeatureIcons.seats, desc: '' };
  return { Icon: FeatureIcons[found.icon] || FeatureIcons.seats, desc: found.desc };
}
