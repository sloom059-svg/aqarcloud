import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, ShieldCheck, FileText, Info, Headphones, Clock, CheckCircle2, MessageCircle, Building2, LockKeyhole, PhoneCall } from 'lucide-react';
import SiteFooter, { SUPPORT_EMAIL, SUPPORT_WHATSAPP, WhatsAppIcon, getWhatsappHref } from '@/components/layout/SiteFooter';
import logo from '@/aqar-cloud-logo.png';

const pages = {
  terms: {
    eyebrow: 'الشروط والأحكام',
    title: 'شروط استخدام منصة عقار كلاود',
    subtitle: 'تنظم هذه الشروط استخدام المنصة والخدمات المرتبطة بها، وتوضح مسؤوليات المستخدم عند إنشاء الصفحات أو عرض العقارات أو إدارة الحجوزات.',
    icon: FileText,
    accentIcon: Building2,
    sections: [
      { title: 'استخدام المنصة', body: 'تُستخدم عقار كلاود لإنشاء صفحات عرض وإدارة العقارات والأماكن والحجوزات. يلتزم المستخدم بإدخال معلومات صحيحة ومحدثة عن المكتب أو العقار أو المكان المعروض.' },
      { title: 'المحتوى المنشور', body: 'يتحمل المستخدم مسؤولية العناوين، الصور، الأسعار، وصف العقار، بيانات التواصل، وأي معلومات تظهر للزوار أو العملاء من خلال صفحته العامة.' },
      { title: 'التواصل والاتفاقات', body: 'توفر المنصة أدوات عرض وتنظيم، ولا تُعد طرفاً في أي اتفاق أو تواصل يتم بين المالك أو الوسيط والعميل ما لم يُنص على خلاف ذلك صراحة.' },
      { title: 'التحديثات', body: 'قد تُحدّث هذه الشروط عند الحاجة لتحسين الخدمة أو تنظيم الاستخدام، وتصبح النسخة المنشورة في هذه الصفحة هي النسخة المعتمدة.' },
    ],
  },
  privacy: {
    eyebrow: 'سياسة الخصوصية',
    title: 'حماية البيانات واستخدامها',
    subtitle: 'نلتزم باستخدام البيانات بالقدر اللازم لتشغيل الحسابات والصفحات وتحسين تجربة عرض العقارات وإدارة الطلبات.',
    icon: ShieldCheck,
    accentIcon: LockKeyhole,
    sections: [
      { title: 'البيانات التي قد نحتاجها', body: 'قد تشمل البيانات اسم المستخدم أو المكتب، رقم التواصل، المدينة، معلومات العقارات أو الأماكن، الصور، وبيانات الحجوزات التي يتم إدخالها داخل الحساب.' },
      { title: 'أغراض الاستخدام', body: 'تُستخدم البيانات لتشغيل الصفحات العامة، تسهيل التواصل مع العملاء، إدارة العقارات والحجوزات، وتحسين أداء المنصة وتجربة المستخدم.' },
      { title: 'البيانات الظاهرة للزوار', body: 'لا تظهر للزوار إلا البيانات التي يختار المستخدم نشرها في صفحاته العامة، مثل بيانات المكتب، رقم التواصل، موقع العقار، أو تفاصيل العرض.' },
      { title: 'حماية الحساب', body: 'ينبغي على المستخدم المحافظة على بيانات الدخول وعدم مشاركتها، وتحديث بيانات التواصل عند تغيرها لضمان استمرار الخدمة بشكل صحيح.' },
    ],
  },
  about: {
    eyebrow: 'من نحن',
    title: 'منصة عقارية تركّز على العرض الواضح والإدارة السهلة',
    subtitle: 'عقار كلاود صُممت لمساعدة الوسطاء ومكاتب العقار وملاك الأماكن على إنشاء صفحات عرض منظمة وتجربة مشاهدة مناسبة للجوال.',
    icon: Info,
    accentIcon: Building2,
    sections: [
      { title: 'رؤيتنا', body: 'تقديم تجربة عقارية رقمية بسيطة، تساعد العميل على فهم تفاصيل العقار بسرعة، وتساعد صاحب الصفحة على إدارة محتواه دون تعقيد.' },
      { title: 'لمن صُممت المنصة؟', body: 'للوسطاء العقاريين، مكاتب العقار، ملاك الشاليهات والاستراحات، وكل من يحتاج صفحة عرض احترافية وأدوات إدارة عملية.' },
      { title: 'أسلوب العمل', body: 'نعتمد على تصميم واضح، ألوان هادئة، معلومات مرتبة، وأزرار تواصل مباشرة تساعد الزائر على اتخاذ الخطوة المناسبة بسهولة.' },
    ],
  },
  contact: {
    eyebrow: 'اتصل بنا',
    title: 'قنوات التواصل الرسمية',
    subtitle: 'يمكنك التواصل معنا للاستفسارات العامة، الملاحظات، أو طلب المساعدة المتعلقة بالحسابات وصفحات العرض.',
    icon: Mail,
    accentIcon: PhoneCall,
    contact: true,
    sections: [
      { title: 'البريد الإلكتروني', body: `يمكنك مراسلتنا عبر البريد الإلكتروني: ${SUPPORT_EMAIL} وسنراجع طلبك وفق أولوية البلاغات الواردة.` },
      { title: 'واتساب الدعم', body: SUPPORT_WHATSAPP ? 'زر واتساب يفتح محادثة مباشرة مع الدعم الفني لإرسال الاستفسار أو تفاصيل المشكلة.' : 'قناة واتساب مخصصة للدعم الفني، ويمكن تفعيل الرابط المباشر عند إضافة رقم الدعم.' },
      { title: 'معلومات تساعدنا', body: 'عند التواصل، يرجى إرسال رابط الصفحة أو لقطة شاشة ووصف مختصر للمشكلة حتى يتم التعامل مع الطلب بشكل أسرع.' },
    ],
  },
  support: {
    eyebrow: 'الدعم الفني',
    title: 'مركز الدعم الفني',
    subtitle: 'هذه الصفحة مخصصة لمساعدتك في المشكلات المتعلقة بالحساب، صفحات العقارات، روابط المشاركة، وظهور البيانات للعملاء.',
    icon: Headphones,
    accentIcon: MessageCircle,
    support: true,
    sections: [
      { title: 'الحساب وبيانات المكتب', body: 'نساعدك في مشكلات تسجيل الدخول، إكمال الملف الشخصي، تعديل بيانات المكتب، أو مراجعة ظهور معلومات التواصل.' },
      { title: 'صفحات العقارات', body: 'نراجع معك ظهور الصور، ترتيب تفاصيل العقار، روابط المشاركة، وطريقة عرض الصفحة على الجوال أو الأجهزة اللوحية.' },
      { title: 'الحجوزات وصفحات الأماكن', body: 'نساعدك في مراجعة صفحات الأماكن، إدارة الحجوزات اليدوية، السندات، وطريقة ظهور الصفحة العامة للعملاء.' },
    ],
  },
};

function InfoCard({ title, body }) {
  return (
    <div className="rounded-[1.6rem] bg-white border border-[#EBEBEB] p-5 sm:p-6 shadow-[0_18px_45px_rgba(34,34,34,0.04)]">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 h-7 w-7 rounded-full bg-[#FFF1F4] text-[#FF385C] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </span>
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#222222]">{title}</h2>
          <p className="mt-2 text-sm sm:text-[15px] leading-8 text-[#717171] font-bold">{body}</p>
        </div>
      </div>
    </div>
  );
}

function ContactActions() {
  const whatsappHref = getWhatsappHref('مرحباً، أحتاج مساعدة من الدعم الفني في عقار كلاود');

  return (
    <div className="grid sm:grid-cols-2 gap-3 mt-7 max-w-2xl">
      <a
        href={whatsappHref}
        target={SUPPORT_WHATSAPP ? '_blank' : undefined}
        rel={SUPPORT_WHATSAPP ? 'noreferrer' : undefined}
        className="rounded-[1.4rem] bg-[#FF385C] text-white p-5 flex items-center gap-4 hover:bg-[#E31C5F] transition-colors shadow-[0_18px_45px_rgba(255,56,92,0.18)]"
      >
        <span className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
          <WhatsAppIcon className="w-5 h-5" />
        </span>
        <span>
          <span className="block text-sm font-black">واتساب الدعم</span>
          <span className="block text-xs font-bold text-white/80 mt-1">إرسال استفسار أو تفاصيل مشكلة</span>
        </span>
      </a>

      <a
        href={`mailto:${SUPPORT_EMAIL}`}
        className="rounded-[1.4rem] bg-white border border-[#EBEBEB] p-5 flex items-center gap-4 hover:bg-[#F7F7F7] transition-colors"
      >
        <span className="h-12 w-12 rounded-2xl bg-[#F7F7F7] text-[#222222] flex items-center justify-center shrink-0">
          <Mail className="w-5 h-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-black text-[#222222]">البريد الإلكتروني</span>
          <span className="block text-xs font-bold text-[#717171] mt-1 truncate" dir="ltr">{SUPPORT_EMAIL}</span>
        </span>
      </a>
    </div>
  );
}

export default function StaticPage({ type = 'about' }) {
  const page = pages[type] || pages.about;
  const Icon = page.icon;
  const AccentIcon = page.accentIcon || page.icon;

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#222222]" dir="rtl">
      <header className="sticky top-0 z-30 bg-[#F7F7F7]/90 backdrop-blur-xl border-b border-[#EBEBEB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <span className="h-12 w-12 rounded-2xl bg-white border border-[#EBEBEB] shadow-sm flex items-center justify-center overflow-hidden shrink-0">
              <img src={logo} alt="Aqar Cloud" className="w-9 h-9 object-contain" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-black text-[#222222]">Aqar Cloud</span>
              <span className="block text-xs font-bold text-[#717171] truncate">الصفحات الرسمية</span>
            </span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 h-11 px-4 rounded-full bg-white border border-[#EBEBEB] text-sm font-black text-[#222222] hover:bg-[#F7F7F7] transition-colors shadow-sm">
            <ArrowRight className="w-4 h-4" />
            الرئيسية
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <section className="relative overflow-hidden rounded-[2rem] bg-white border border-[#EBEBEB] shadow-[0_25px_70px_rgba(34,34,34,0.06)] p-6 sm:p-9">
          <div className="absolute -top-24 -left-20 w-64 h-64 rounded-full bg-[#FF385C]/10 blur-3xl" />
          <div className="absolute -bottom-28 -right-20 w-64 h-64 rounded-full bg-[#222222]/[0.06] blur-3xl" />
          <div className="relative grid gap-7 lg:grid-cols-[1fr_260px] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F7F7F7] border border-[#EBEBEB] px-3 py-2 text-xs font-black text-[#717171]">
                <Icon className="w-4 h-4 text-[#FF385C]" />
                {page.eyebrow}
              </div>
              <h1 className="mt-5 text-3xl sm:text-5xl font-black tracking-tight text-[#222222] leading-[1.25] max-w-3xl">{page.title}</h1>
              <p className="mt-4 text-sm sm:text-lg leading-8 text-[#717171] font-bold max-w-3xl">{page.subtitle}</p>
              {(page.contact || page.support) && <ContactActions />}
            </div>

            <div className="hidden lg:flex justify-end">
              <div className="h-52 w-52 rounded-[2rem] bg-[#F7F7F7] border border-[#EBEBEB] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF385C]/12 via-white to-[#222222]/5" />
                <span className="relative h-20 w-20 rounded-[1.7rem] bg-white text-[#FF385C] flex items-center justify-center shadow-[0_20px_60px_rgba(34,34,34,0.08)]">
                  <AccentIcon className="w-9 h-9" />
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-4 mt-6 sm:mt-8">
          {page.sections.map((section) => (
            <InfoCard key={section.title} title={section.title} body={section.body} />
          ))}
        </section>

        {page.support && (
          <section className="mt-6 rounded-[1.6rem] bg-[#222222] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-black">لخدمة أسرع</h2>
                <p className="mt-1 text-sm leading-7 text-white/70 font-bold">يرجى إرسال رابط الصفحة أو صورة توضّح المشكلة مع شرح مختصر.</p>
              </div>
            </div>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="h-11 px-5 rounded-full bg-white text-[#222222] text-sm font-black inline-flex items-center justify-center gap-2 hover:bg-[#F7F7F7] transition-colors">
              <Mail className="w-4 h-4" />
              إرسال التفاصيل
            </a>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
