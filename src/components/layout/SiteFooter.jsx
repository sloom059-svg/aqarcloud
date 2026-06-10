import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Headphones, ExternalLink } from 'lucide-react';

const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || 'support@aqarcloud.com';
const SUPPORT_WHATSAPP = (import.meta.env.VITE_SUPPORT_WHATSAPP || '').replace(/\D/g, '');
const SUPPORT_X = import.meta.env.VITE_SUPPORT_X || '';

const OFFICIAL_FONT = { fontFamily: "'Tajawal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" };

const footerLinks = [
  { to: '/terms', label: 'الشروط والأحكام' },
  { to: '/refund', label: 'سياسة الاسترجاع' },
  { to: '/privacy', label: 'سياسة الخصوصية' },
];

function WhatsAppIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function XIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function getWhatsappHref(message = 'مرحباً، أحتاج مساعدة بخصوص عقار كلاود') {
  return SUPPORT_WHATSAPP ? `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(message)}` : '/support';
}

export { SUPPORT_EMAIL, SUPPORT_WHATSAPP, SUPPORT_X, WhatsAppIcon, XIcon, getWhatsappHref };

export default function SiteFooter({ className = '' }) {
  const whatsappHref = getWhatsappHref();
  const xHref = SUPPORT_X || '/support';

  return (
    <footer className={`mt-10 border-t border-zinc-200 bg-[#F7F7F7] ${className}`} dir="rtl" style={OFFICIAL_FONT}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        <div className="mx-auto w-full max-w-md sm:max-w-none rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 shadow-sm">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <Link
              to="/support"
              className="h-9 px-3 rounded-xl bg-[#FF385C] text-white inline-flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold hover:bg-[#E31C5F] transition-colors"
            >
              <Headphones className="w-3.5 h-3.5" />
              الدعم الفني
            </Link>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="h-9 w-9 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700 inline-flex items-center justify-center hover:bg-white hover:text-[#FF385C] transition-colors"
              aria-label="البريد الإلكتروني"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href={whatsappHref}
              target={SUPPORT_WHATSAPP ? '_blank' : undefined}
              rel={SUPPORT_WHATSAPP ? 'noreferrer' : undefined}
              className="h-9 w-9 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700 inline-flex items-center justify-center hover:bg-white hover:text-[#25D366] transition-colors"
              aria-label="واتساب"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>
            <a
              href={xHref}
              target={SUPPORT_X ? '_blank' : undefined}
              rel={SUPPORT_X ? 'noreferrer' : undefined}
              className="h-9 w-9 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700 inline-flex items-center justify-center hover:bg-white hover:text-zinc-950 transition-colors"
              aria-label="منصة إكس"
            >
              <XIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <nav className="mt-4 flex flex-nowrap items-center justify-center gap-2 sm:gap-4 overflow-x-auto whitespace-nowrap text-[11px] sm:text-xs font-medium text-zinc-500 [-ms-overflow-style:none] [scrollbar-width:none]">
          {footerLinks.map((link, index) => (
            <React.Fragment key={link.to}>
              {index > 0 && <span className="text-zinc-300">-</span>}
              <Link to={link.to} className="hover:text-[#FF385C] transition-colors">
                {link.label}
              </Link>
            </React.Fragment>
          ))}
        </nav>

        <p className="mt-3 text-center text-[11px] sm:text-xs font-medium text-zinc-400">
          © {new Date().getFullYear()} عقار كلاود. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
