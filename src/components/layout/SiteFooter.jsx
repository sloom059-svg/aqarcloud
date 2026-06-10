import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Headphones, ShieldCheck, FileText, Info, MessageCircle, ArrowUpLeft } from 'lucide-react';
import logo from '@/aqar-cloud-logo.png';

const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || 'support@aqarcloud.com';
const SUPPORT_WHATSAPP = (import.meta.env.VITE_SUPPORT_WHATSAPP || '').replace(/\D/g, '');

const footerLinks = [
  { to: '/terms', label: 'الشروط والأحكام' },
  { to: '/privacy', label: 'سياسة الخصوصية' },
  { to: '/about', label: 'من نحن' },
  { to: '/contact', label: 'اتصل بنا' },
  { to: '/support', label: 'الدعم الفني' },
];

const quickItems = [
  { icon: ShieldCheck, label: 'خصوصية البيانات' },
  { icon: FileText, label: 'شروط واضحة' },
  { icon: Headphones, label: 'دعم فني' },
];

function WhatsAppIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function getWhatsappHref(message = 'مرحباً، أحتاج مساعدة بخصوص عقار كلاود') {
  return SUPPORT_WHATSAPP ? `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(message)}` : '/support';
}

export { SUPPORT_EMAIL, SUPPORT_WHATSAPP, WhatsAppIcon, getWhatsappHref };

export default function SiteFooter({ className = '' }) {
  const whatsappHref = getWhatsappHref();

  return (
    <footer className={`mt-12 border-t border-[#EBEBEB] bg-[#F7F7F7] ${className}`} dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid gap-7 lg:grid-cols-[1.2fr_1fr_1.1fr] lg:items-start">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 min-w-0">
              <span className="h-12 w-12 rounded-2xl bg-white border border-[#EBEBEB] shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                <img src={logo} alt="Aqar Cloud" className="w-9 h-9 object-contain" />
              </span>
              <span className="min-w-0">
                <span className="block text-base font-black text-[#222222]">Aqar Cloud</span>
                <span className="block text-xs font-bold text-[#717171] mt-0.5">إدارة وعرض العقارات بواجهة عملية وواضحة.</span>
              </span>
            </Link>

            <div className="flex flex-wrap gap-2">
              {quickItems.map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-[#EBEBEB] bg-white px-3 py-1.5 text-xs font-bold text-[#717171]">
                  <Icon className="w-3.5 h-3.5 text-[#FF385C]" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-2 text-sm font-bold text-[#222222]">
            {footerLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="rounded-2xl px-3 py-2.5 hover:bg-white hover:text-[#FF385C] transition-colors">
                {label}
              </Link>
            ))}
          </nav>

          <div className="rounded-[1.5rem] border border-[#EBEBEB] bg-white p-4 shadow-[0_18px_45px_rgba(34,34,34,0.05)]">
            <div className="flex items-start gap-3">
              <span className="h-11 w-11 rounded-2xl bg-[#FFF1F4] text-[#FF385C] flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-black text-[#222222]">الدعم الفني</p>
                <p className="mt-1 text-xs leading-6 font-bold text-[#717171]">للاستفسارات والمساعدة في الحسابات أو صفحات العقارات.</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <a
                href={whatsappHref}
                target={SUPPORT_WHATSAPP ? '_blank' : undefined}
                rel={SUPPORT_WHATSAPP ? 'noreferrer' : undefined}
                className="h-11 rounded-full bg-[#FF385C] text-white text-xs font-black flex items-center justify-center gap-2 hover:bg-[#E31C5F] transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
                واتساب
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="h-11 rounded-full border border-[#EBEBEB] bg-[#F7F7F7] text-[#222222] text-xs font-black flex items-center justify-center gap-2 hover:bg-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                البريد
              </a>
            </div>
          </div>
        </div>

        <div className="mt-7 pt-5 border-t border-[#EBEBEB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold text-[#717171]">
          <p>© {new Date().getFullYear()} Aqar Cloud. جميع الحقوق محفوظة.</p>
          <Link to="/support" className="inline-flex items-center gap-1.5 hover:text-[#FF385C] transition-colors">
            مركز الدعم
            <ArrowUpLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
