import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MessageCircle, ShieldCheck, FileText, Info, Headphones, Phone, Clock, CheckCircle2 } from 'lucide-react';
import SiteFooter, { SUPPORT_EMAIL, SUPPORT_WHATSAPP, WhatsAppIcon } from '@/components/layout/SiteFooter';
import logo from '@/aqar-cloud-logo.png';

const AIRBNB = '#FF385C';

const pages = {
  terms: {
    eyebrow: 'الشروط والأحكام',
    title: 'استخدام واضح، وتجربة مرتبة للجميع',
    subtitle: 'هذه الصفحة توضّح القواعد العامة لاستخدام منصة عقار كلاود، سواء لعرض العقارات أو إدارة الأماكن والحجوزات.',
    icon: FileText,
    sections: [
      { title: 'استخدام المنصة', body: 'تستخدم عقار كلاود لعرض وإدارة العقارات والأماكن بطريقة منظمة. يتحمل المستخدم مسؤولية صحة البيانات والصور والأسعار وأي معلومات يشاركها مع العملاء.' },
      { title: 'المحتوى المنشور', body: 'يجب أن تكون العناوين، الصور، الأسعار، وصف العقار، وبيانات التواصل صحيحة وغير مضللة. يحق للمنصة تعطيل أي محتوى مخالف أو مكرر أو غير مناسب.' },
      { title: 'التواصل والحجوزات', body: 'أي تواصل أو اتفاق يتم بين مالك الصفحة والعميل يكون على مسؤولية الطرفين. دور المنصة هو توفير صفحة عرض وأدوات تنظيمية تساعد على إدارة الطلبات.' },
      { title: 'تحديث الشروط', body: 'قد يتم تحديث هذه الشروط عند الحاجة لتحسين الخدمة أو مواكبة المتطلبات التشغيلية، وسيظهر التحديث دائماً داخل هذه الصفحة.' },
    ],
  },
  privacy: {
    eyebrow: 'سياسة الخصوصية',
    title: 'خصوصيتك مهمة، وبياناتك تستخدم لخدمتك فقط',
    subtitle: 'نحافظ على البيانات الضرورية لتشغيل الحساب والصفحات، مثل معلومات التواصل وبيانات العقارات والحجوزات.',
    icon: ShieldCheck,
    sections: [
      { title: 'البيانات التي نستخدمها', body: 'قد نستخدم بيانات مثل الاسم، رقم التواصل، المدينة، معلومات المكتب، صور العقارات، وبيانات الحجز التي تضيفها داخل حسابك.' },
      { title: 'سبب استخدام البيانات', body: 'تستخدم البيانات لتشغيل الصفحة العامة، إدارة العقارات أو الأماكن، تسهيل التواصل مع العملاء، وتحسين تجربة الاستخدام داخل المنصة.' },
      { title: 'مشاركة البيانات', body: 'لا نعرض للزوار إلا المعلومات التي تختار نشرها في صفحاتك العامة، مثل بيانات المكتب أو رقم التواصل أو تفاصيل العقار.' },
      { title: 'حماية الحساب', body: 'ننصح بالمحافظة على بيانات الدخول وعدم مشاركة الحساب مع أطراف غير موثوقة، وتحديث بيانات التواصل عند تغيرها.' },
    ],
  },
  about: {
    eyebrow: 'من نحن',
    title: 'عقار كلاود يساعدك تعرض وتدير بدون تعقيد',
    subtitle: 'منصة بسيطة لأصحاب العقارات، الوسطاء، وملاك الشاليهات والأماكن، تركز على صفحة عرض جميلة وأدوات إدارة عملية.',
    icon: Info,
    sections: [
      { title: 'فكرتنا', body: 'نؤمن أن صفحة العقار أو المكان لازم تكون واضحة، سريعة، ومرتبة على الجوال قبل أي شيء آخر، لأن أغلب العملاء يشاهدونها من الهاتف.' },
      { title: 'لمن المنصة؟', body: 'للوسطاء العقاريين، مكاتب العقار، ملاك الشاليهات، والاستراحات، وكل من يحتاج صفحة عرض احترافية مع أدوات إدارة بسيطة.' },
      { title: 'أسلوبنا', body: 'نبتعد عن الزحمة والتعقيد. تصميم خفيف، أزرار واضحة، ومعلومات مرتبة تساعد العميل يأخذ قراره بسرعة.' },
    ],
  },
  contact: {
    eyebrow: 'اتصل بنا',
    title: 'تواصل معنا بالطريقة الأنسب لك',
    subtitle: 'للأسئلة العامة، الملاحظات، أو طلب المساعدة في إعداد حسابك وصفحاتك.',
    icon: Mail,
    contact: true,
    sections: [
      { title: 'الدعم عبر البريد', body: `راسلنا على ${SUPPORT_EMAIL} وسنراجع طلبك بأقرب وقت ممكن.` },
      { title: 'واتساب الدعم', body: SUPPORT_WHATSAPP ? 'يمكنك فتح واتساب مباشرة من الزر الموجود في الصفحة أو الفوتر.' : 'أضف رقم واتساب الدعم في متغير البيئة VITE_SUPPORT_WHATSAPP لتفعيل زر واتساب مباشر.' },
      { title: 'ملاحظاتك تفرق', body: 'أي ملاحظة على تجربة العرض أو ترتيب الصفحات تساعدنا نخلي المنصة أبسط وأجمل.' },
    ],
  },
  support: {
    eyebrow: 'الدعم الفني',
    title: 'نساعدك بدون لف ودوران',
    subtitle: 'اختر طريقة التواصل، أو راجع أكثر الأمور التي نقدر نساعدك فيها داخل عقار كلاود.',
    icon: Headphones,
    support: true,
    sections: [
      { title: 'مشاكل الحساب والدخول', body: 'نساعدك في الدخول، إكمال الملف الشخصي، أو تحديث بيانات المكتب ورقم التواصل.' },
      { title: 'صفحات العقار والمكان', body: 'نراجع معك ظهور الصور، ترتيب البيانات، روابط المشاركة، وطريقة عرض الصفحة على الجوال.' },
      { title: 'الحجوزات والسندات', body: 'نساعدك في تنظيم الحجوزات اليدوية، إرسال السندات، ومراجعة إعدادات صفحة المكان.' },
    ],
  },
};

const pageMeta = {
  terms: pages.terms,
  privacy: pages.privacy,
  about: pages.about,
  contact: pages.contact,
  support: pages.support,
};

function Card({ title, body }) {
  return (
    <div className="rounded-[1.7rem] bg-white border border-zinc-200 p-5 sm:p-6 shadow-[0_18px_45px_rgba(0,0,0,0.04)]">
      <div className="flex items-start gap-3">
        <span className="mt-1 h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </span>
        <div>
          <h2 className="text-base sm:text-lg font-black text-zinc-950">{title}</h2>
          <p className="mt-2 text-sm sm:text-[15px] leading-8 text-zinc-600 font-bold">{body}</p>
        </div>
      </div>
    </div>
  );
}

function ContactActions() {
  const whatsappHref = SUPPORT_WHATSAPP
    ? `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent('مرحباً، أحتاج مساعدة بخصوص عقار كلاود')}`
    : null;

  return (
    <div className="grid sm:grid-cols-2 gap-3 mt-7">
      <a
        href={whatsappHref || `mailto:${SUPPORT_EMAIL}`}
        target={whatsappHref ? '_blank' : undefined}
        rel={whatsappHref ? 'noreferrer' : undefined}
        className="rounded-[1.5rem] bg-emerald-50 border border-emerald-100 p-5 flex items-center gap-4 hover:bg-emerald-100 transition-all"
      >
        <span className="h-12 w-12 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-sm">
          <WhatsAppIcon className="w-5 h-5" />
        </span>
        <span>
          <span className="block text-sm font-black text-zinc-950">واتساب الدعم</span>
          <span className="block text-xs font-bold text-zinc-500 mt-1">{SUPPORT_WHATSAPP ? 'فتح محادثة مباشرة' : 'أضف رقم الدعم لتفعيله'}</span>
        </span>
      </a>

      <a
        href={`mailto:${SUPPORT_EMAIL}`}
        className="rounded-[1.5rem] bg-white border border-zinc-200 p-5 flex items-center gap-4 hover:bg-zinc-50 transition-all"
      >
        <span className="h-12 w-12 rounded-2xl bg-zinc-50 text-zinc-800 flex items-center justify-center shadow-sm">
          <Mail className="w-5 h-5" />
        </span>
        <span>
          <span className="block text-sm font-black text-zinc-950">البريد الإلكتروني</span>
          <span className="block text-xs font-bold text-zinc-500 mt-1" dir="ltr">{SUPPORT_EMAIL}</span>
        </span>
      </a>
    </div>
  );
}

export default function StaticPage({ type = 'about' }) {
  const page = pageMeta[type] || pageMeta.about;
  const Icon = page.icon;

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-zinc-950" dir="rtl">
      <header className="sticky top-0 z-30 bg-[#F7F7F7]/90 backdrop-blur-xl border-b border-zinc-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <span className="h-12 w-12 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
              <img src={logo} alt="Aqar Cloud" className="w-9 h-9 object-contain" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-black text-zinc-950">Aqar Cloud</span>
              <span className="block text-xs font-bold text-zinc-500 truncate">صفحات المعلومات والدعم</span>
            </span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 h-11 px-4 rounded-full bg-white border border-zinc-200 text-sm font-black text-zinc-800 hover:bg-zinc-50 transition-all shadow-sm">
            <ArrowRight className="w-4 h-4" />
            الرئيسية
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <section className="relative overflow-hidden rounded-[2.2rem] bg-white border border-zinc-200 shadow-[0_25px_70px_rgba(0,0,0,0.06)] p-6 sm:p-9">
          <div className="absolute -top-20 -left-20 w-56 h-56 rounded-full bg-[#FF385C]/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 w-56 h-56 rounded-full bg-emerald-100/60 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-50 border border-zinc-200 px-3 py-2 text-xs font-black text-zinc-600">
              <Icon className="w-4 h-4" style={{ color: AIRBNB }} />
              {page.eyebrow}
            </div>
            <h1 className="mt-5 text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 leading-[1.25] max-w-3xl">{page.title}</h1>
            <p className="mt-4 text-sm sm:text-lg leading-8 text-zinc-600 font-bold max-w-3xl">{page.subtitle}</p>
            {(page.contact || page.support) && <ContactActions />}
          </div>
        </section>

        <section className="grid gap-4 mt-6 sm:mt-8">
          {page.sections.map((section) => (
            <Card key={section.title} title={section.title} body={section.body} />
          ))}
        </section>

        {page.support && (
          <section className="mt-6 rounded-[1.7rem] bg-zinc-950 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-black">قبل ما تراسلنا</h2>
                <p className="mt-1 text-sm leading-7 text-white/70 font-bold">ارسل لنا رابط الصفحة أو لقطة شاشة للمشكلة عشان نساعدك أسرع.</p>
              </div>
            </div>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="h-11 px-5 rounded-full bg-white text-zinc-950 text-sm font-black inline-flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all">
              <Mail className="w-4 h-4" />
              إرسال تفاصيل المشكلة
            </a>
          </section>
        )}

        <SiteFooter />
      </main>
    </div>
  );
}
