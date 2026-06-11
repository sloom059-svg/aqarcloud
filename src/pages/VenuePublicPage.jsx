import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import VenueCalendar from '@/components/venue/VenueCalendar';
import BookingSheet from '@/components/venue/BookingSheet';
import ResortTheme from '@/components/venue/ResortTheme';
import {
  MapPin, Clock, Loader2, ChevronLeft, ChevronRight,
  Star, ShieldCheck, Waves, Coffee, Wifi, Gamepad2, UtensilsCrossed,
  Car, CheckCircle2, Info, Flame, Snowflake, Trees, Baby, Users, Bed, Zap, KeyRound,
  ChevronDown, ExternalLink, AlertCircle, PlayCircle, CalendarDays,
  Sparkles, Tv, Dumbbell, Bath, Wind, Sun, Music, Camera, Heart, Gift, Crown, Mountain, X
} from 'lucide-react';


const DEFAULT_ACCENT = '#c9a96e';
const ROYAL_GOLD = '#d4af37';

const FEATURE_ICONS = {
  'مسبح': Waves, 'مسبح مفلتر': Waves, 'مسبح خاص': Waves,
  'جلسات خارجية': Coffee, 'واي فاي': Wifi, 'واي فاي مجاني': Wifi,
  'شواء': UtensilsCrossed, 'شواية حديثة': UtensilsCrossed, 'مطبخ': UtensilsCrossed,
  'دخول ذاتي': KeyRound, 'ألعاب أطفال': Gamepad2, 'مواقف': Car,
  'قسم رجال': Users, 'قسم نساء': Users, 'غرف نوم': Bed, 'حديقة': Trees,
  'مولد كهرباء': Zap, 'مكيف': Snowflake, 'مدفأة': Flame, 'ملعب': Star,
  'أطفال': Baby, 'أمن وحماية': ShieldCheck,
};

const CUSTOM_ICONS = {
  star: Star, shield: ShieldCheck, waves: Waves, wifi: Wifi,
  grill: UtensilsCrossed, tv: Tv, gym: Dumbbell, bath: Bath,
  ac: Wind, sun: Sun, music: Music, camera: Camera,
  heart: Heart, gift: Gift, crown: Crown, mountain: Mountain,
  car: Car, bed: Bed, fire: Flame, tree: Trees,
};

const SocialIcons = {
  instagram: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  tiktok: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.41-.02-.34-.02-.68-.02-1.02.13-1.6.82-3.08 1.94-4.21 1.52-1.52 3.8-2.26 5.86-1.92V14.3c-1.11-.27-2.31-.1-3.29.41-.85.45-1.46 1.25-1.63 2.21-.07.39-.07.79-.02 1.18.17 1.25 1.05 2.34 2.19 2.81 1.29.54 2.8.46 4.02-.2 1.19-.65 1.95-1.9 2.05-3.26.2-2.9.06-5.82.09-8.73z"/>
    </svg>
  ),
  x: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
    </svg>
  ),
};

const SOCIAL_LIST = [
  { key: 'instagram', label: 'انستقرام' },
  { key: 'tiktok',   label: 'تيك توك' },
  { key: 'snapchat', label: 'سناب شات' },
  { key: 'x',        label: 'إكس' },
];

// بناء الرابط الصحيح لكل منصة من اسم المستخدم
const buildSocialUrl = (key, value) => {
  if (!value) return '#';
  const username = value.replace(/^@/, '').trim();
  const urls = {
    instagram: `https://www.instagram.com/${username}`,
    tiktok:    `https://www.tiktok.com/@${username}`,
    snapchat:  `https://www.snapchat.com/add/${username}`,
    x:         `https://x.com/${username}`,
  };
  // لو المستخدم أدخل رابط كامل، استخدمه مباشرة
  if (value.startsWith('http')) return value;
  return urls[key] || `https://${value}`;
};

// ── استخراج معرّف فيديو يوتيوب من أي صيغة رابط (نسخة محصّنة) ──
const getYoutubeId = (url) => {
  if (!url) return '';
  const clean = String(url).trim();
  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{11})/,        // watch?v=
    /youtu\.be\/([A-Za-z0-9_-]{11})/,    // youtu.be/
    /\/shorts\/([A-Za-z0-9_-]{11})/,     // /shorts/
    /\/embed\/([A-Za-z0-9_-]{11})/,      // /embed/
    /\/live\/([A-Za-z0-9_-]{11})/,       // /live/
  ];
  for (const p of patterns) {
    const m = clean.match(p);
    if (m) return m[1];
  }
  const fallback = clean.match(/([A-Za-z0-9_-]{11})/);
  return fallback ? fallback[1] : '';
};

// ── تحويل أي رابط يوتيوب إلى رابط embed ──
const toYoutubeEmbed = (url) => {
  const id = getYoutubeId(url);
  if (!id) return '';
  return `https://www.youtube.com/embed/${id}?rel=0`;
};

const buildMapsEmbed = (url) => {
  try {
    if (!url) return '';
    if (url.includes('embed')) return url;
    const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch) return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed&z=15`;
    return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
  } catch { return ''; }
};

export default function VenuePublicPage() {
  const { slug } = useParams();
  const [imgIdx, setImgIdx] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({ client_name: '', client_phone: '', check_in: '', check_out: '', notes: '' });
  const [bookingDone, setBookingDone] = useState(false);
  const [activeVideo, setActiveVideo] = useState(0);
  const [termsOpen, setTermsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: venue, isLoading } = useQuery({
    queryKey: ['venue-public', slug],
    queryFn: async () => {
      const bySlug = await base44.entities.Venue.filter({ slug });
      if (bySlug.length) return bySlug[0];
      const byId = await base44.entities.Venue.filter({ id: slug });
      return byId[0];
    },
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['venue-bookings-public', venue?.id],
    queryFn: () => base44.entities.Booking.filter({ venue_id: venue.id, status: 'مؤكد' }),
    enabled: !!venue?.id,
  });

  const bookMutation = useMutation({
    mutationFn: (data) => base44.entities.Booking.create(data),
    onSuccess: () => {
      setBookingDone(true);
    }
  });

  const isRoyal = venue?.page_theme === 'royal';

  useEffect(() => {
    if (!isRoyal) return;
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isRoyal]);

  const bookedDates = bookings.flatMap(b => {
    const dates = [];
    let cur = new Date(b.check_in);
    const end = new Date(b.check_out);
    while (cur <= end) {
      dates.push(cur.toISOString().split('T')[0]);
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  });

  const handleBook = async () => {
    if (!bookingForm.client_name || !bookingForm.client_phone || !bookingForm.check_in || !bookingForm.check_out) return;
    await bookMutation.mutateAsync({
      ...bookingForm,
      venue_id: venue.id,
      venue_name: venue.name,
      owner_id: venue.owner_id,
      status: 'جديد',
    });
  };

  const accent = isRoyal ? ROYAL_GOLD : (venue?.page_theme === 'resort' ? '#b58b3b' : (venue?.theme_color || DEFAULT_ACCENT));

  if (isLoading) return (
    <div className={`min-h-screen flex items-center justify-center ${isRoyal ? 'bg-[#020617]' : 'bg-[#fcfcfc]'}`}>
      <Loader2 className="w-10 h-10 animate-spin" style={{ color: accent }} />
    </div>
  );
  if (!venue) return (
    <div className={`min-h-screen flex items-center justify-center font-bold text-xl font-cairo ${isRoyal ? 'bg-[#020617] text-[#d4af37]' : 'bg-[#fcfcfc] text-gray-500'}`}>
      المكان غير موجود
    </div>
  );

  // ── الشاليه معطّل — شاشة إيقاف مؤقت ──
  if (venue.status === 'معطّل' || venue.status === 'معطل') return (
    <div dir="rtl" className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center font-cairo relative overflow-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap'); .font-cairo { font-family: 'Cairo', sans-serif; }`}</style>

      {/* خلفية الصورة مع تعتيم */}
      {venue.images?.[0] && (
        <div className="absolute inset-0">
          <img src={venue.images[0]} alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-[#0f172a]/80" />
        </div>
      )}

      <div className="relative z-10 max-w-sm">
        {/* أيقونة */}
        <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 opacity-60">
            <circle cx="12" cy="12" r="10"/>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
          </svg>
        </div>

        {/* شعار الشاليه لو موجود */}
        {venue.images?.[0] && (
          <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4 border border-white/10">
            <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
          </div>
        )}

        <h1 className="text-2xl font-black text-white mb-2">{venue.name}</h1>
        <p className="text-slate-400 text-sm font-medium mb-6">{venue.city}</p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
          <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h2 className="text-white font-black text-lg mb-1">متوقف مؤقتاً عن العرض</h2>
          <p className="text-slate-400 text-sm leading-relaxed">هذا المكان غير متاح للحجز حالياً. يرجى المحاولة لاحقاً أو التواصل مع المالك مباشرة.</p>
        </div>

        {/* رقم التواصل لو موجود */}
        {venue.whatsapp && (
          <a href={`https://wa.me/${venue.whatsapp}`} target="_blank" rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            تواصل مع المالك
          </a>
        )}
      </div>
    </div>
  );

  const imgs = venue.images?.length ? venue.images : [];
  const heroImg = imgs[imgIdx] || imgs[0];
  const youtubeVideos = (venue.youtube_urls || []).filter(u => u && u.trim() && getYoutubeId(u));
  const activeUrl = youtubeVideos[activeVideo] || youtubeVideos[0];
  const social = venue.social || {};
  const activeSocials = SOCIAL_LIST.filter(s => social[s.key] && social[s.key].trim());
  const bookingsEnabled = venue.booking_enabled !== false;

  const fontStyle = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap');
      .font-cairo { font-family: 'Cairo', sans-serif; }
    `}</style>
  );

  const bookingBtn = bookingsEnabled ? (
    <>
      {/* زر ملكي */}
      <button id="booking-btn-dark"
        onClick={() => setBookingOpen(true)}
        className="text-[#020617] px-8 py-3.5 rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center gap-2"
        style={{ background: `linear-gradient(to right, #b5952f, ${ROYAL_GOLD})`, boxShadow: '0 0 20px rgba(212,175,55,0.3)', display: 'none' }}>
        <CalendarDays className="w-4 h-4" /> احجز إقامتك
      </button>
      {/* زر عادي */}
      <button id="booking-btn-light"
        onClick={() => setBookingOpen(true)}
        className="text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
        style={{ background: accent }}>
        احجز الآن
      </button>
    </>
  ) : null;

  const BookingDialog = ({ dark }) => {
    if (!bookingsEnabled) return null;
    return (
      <button
        onClick={() => setBookingOpen(true)}
        className={dark
          ? "text-[#020617] px-8 py-3.5 rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center gap-2"
          : "text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
        }
        style={dark
          ? { background: `linear-gradient(to right, #b5952f, ${ROYAL_GOLD})`, boxShadow: '0 0 20px rgba(212,175,55,0.3)' }
          : { background: accent }
        }>
        <CalendarDays className="w-4 h-4" />
        {dark ? 'احجز إقامتك' : 'احجز الآن'}
      </button>
    );
  };

  /* ════════════════════════════════════════════════════════
     ثيم المنتجع الفاخر (resort)
  ════════════════════════════════════════════════════════ */
  if (venue?.page_theme === 'resort') {
    return (
      <>
        <ResortTheme
          venue={venue}
          accent={accent}
          imgs={imgs}
          reviews={venue.google_reviews || []}
          youtubeVideos={youtubeVideos}
          getYoutubeId={getYoutubeId}
          bookingsEnabled={bookingsEnabled}
          onBook={() => setBookingOpen(true)}
        />
        <BookingSheet
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
          accent={accent}
          venueName={venue.name}
          bookingForm={bookingForm}
          setBookingForm={setBookingForm}
          bookingDone={bookingDone}
          setBookingDone={setBookingDone}
          bookedDates={bookedDates}
          handleBook={handleBook}
          isPending={bookMutation.isPending}
        />
      </>
    );
  }

  /* ════════════════════════════════════════════════════════
     الثيم الأسود الملكي
  ════════════════════════════════════════════════════════ */
  if (isRoyal) {
    return (
      <>
        {fontStyle}
        <style>{`
          .gold-gradient-r { background: linear-gradient(135deg,#b5952f 0%,#fef9c3 50%,#d4af37 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
          .glass-dark-r { background: rgba(15,23,42,0.6); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
        `}</style>

        <div className="min-h-screen bg-[#020617] text-slate-200 font-cairo pb-32 selection:bg-[#d4af37] selection:text-[#020617]" dir="rtl">

          {/* Header */}
          <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled ? 'py-3 bg-[#020617]/90 backdrop-blur-md border-b border-[#d4af37]/20 shadow-lg' : 'py-5 bg-transparent'}`}>
            <div className="container mx-auto px-5 max-w-4xl flex items-center justify-between">
              <span className="font-black text-xl tracking-wider text-white drop-shadow-md">
                {scrolled ? <span className="gold-gradient-r">{venue.name}</span> : venue.name}
              </span>
              <div className="flex items-center gap-1.5 glass-dark-r px-3 py-1.5 rounded-full border border-[#d4af37]/20">
                <Star className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
                <span className="text-[#d4af37] font-bold text-xs tracking-widest mt-0.5">{venue.venue_type || 'VIP'}</span>
              </div>
            </div>
          </header>

          {/* Hero */}
          <section className="relative h-[90vh] w-full bg-[#020617] overflow-hidden">
            {(imgs.length ? imgs : [null]).map((src, idx) => (
              <div key={idx} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${idx === imgIdx ? 'opacity-100' : 'opacity-0'}`}>
                {src ? <img src={src} alt={venue.name} className="w-full h-full object-cover" />
                     : <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black" />}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/80 via-transparent to-[#020617]/80" />
              </div>
            ))}

            {imgs.length > 1 && (
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-20">
                <button onClick={() => setImgIdx(i => (i - 1 + imgs.length) % imgs.length)}
                  className="bg-white/10 hover:bg-[#d4af37]/30 backdrop-blur-md text-white rounded-full w-10 h-10 flex items-center justify-center transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button onClick={() => setImgIdx(i => (i + 1) % imgs.length)}
                  className="bg-white/10 hover:bg-[#d4af37]/30 backdrop-blur-md text-white rounded-full w-10 h-10 flex items-center justify-center transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 z-10 mt-10">
              <Sparkles className="w-8 h-8 text-[#d4af37] mb-6 animate-pulse opacity-80" />
              <h1 className="text-4xl md:text-6xl font-black text-white mb-5 tracking-tight leading-tight max-w-3xl drop-shadow-2xl">
                {venue.name}
              </h1>
              {venue.city && (
                <div className="flex items-center gap-1.5 text-[#d4af37] font-bold text-sm mb-5">
                  <MapPin className="w-4 h-4" /> {venue.city}
                </div>
              )}
              {venue.description && (
                <p className="text-slate-300 max-w-lg mx-auto font-medium text-sm md:text-base leading-loose mb-10 opacity-90">
                  {venue.description}
                </p>
              )}

              {(venue.check_in_time || venue.check_out_time) && (
                <div className="glass-dark-r border border-[#d4af37]/20 rounded-full p-2 px-6 flex items-center gap-6 shadow-2xl">
                  <div className="flex flex-col items-center">
                    <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">الدخول</span>
                    <span className="text-[#d4af37] font-black text-sm">{venue.check_in_time || '—'}</span>
                  </div>
                  <div className="w-px h-6 bg-[#d4af37]/30" />
                  <div className="flex flex-col items-center">
                    <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">الخروج</span>
                    <span className="text-[#d4af37] font-black text-sm">{venue.check_out_time || '—'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer opacity-70 hover:opacity-100 transition"
              onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })}>
              <span className="text-[10px] text-[#d4af37] tracking-widest uppercase mb-2">استكشف</span>
              <ChevronDown className="w-5 h-5 text-[#d4af37] animate-bounce" />
            </div>
          </section>

          <main className="container mx-auto px-5 md:px-12 max-w-4xl relative z-10 -mt-10">

            {/* الأسعار */}
            {(venue.price_weekday || venue.price_weekend) && (
              <div className="grid grid-cols-2 gap-4 mb-16">
                {venue.price_weekday && (
                  <div className="glass-dark-r border border-[#d4af37]/20 rounded-2xl p-5 text-center">
                    <div className="text-3xl font-black text-[#d4af37]">{Number(venue.price_weekday).toLocaleString('en-US')}</div>
                    <div className="text-xs text-slate-400 font-bold mt-1">ر.س · أيام الأسبوع</div>
                  </div>
                )}
                {venue.price_weekend && (
                  <div className="rounded-2xl p-5 text-center border border-[#d4af37]/40" style={{ background: 'rgba(212,175,55,0.08)' }}>
                    <div className="text-3xl font-black text-[#d4af37]">{Number(venue.price_weekend).toLocaleString('en-US')}</div>
                    <div className="text-xs text-slate-400 font-bold mt-1">ر.س · الويكند</div>
                  </div>
                )}
              </div>
            )}

            {/* المرافق */}
            {((venue.features?.length > 0) || (venue.custom_features?.length > 0)) && (
              <div className="glass-dark-r border border-[#d4af37]/20 rounded-3xl p-8 mb-16 relative overflow-hidden" style={{ boxShadow: '0 0 30px rgba(212,175,55,0.15)' }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 blur-3xl rounded-full" />
                <h2 className="text-[#d4af37] text-sm font-black tracking-widest uppercase mb-8 flex items-center gap-2">
                  <div className="w-8 h-px bg-[#d4af37]/50" /> أماكن صُممت لراحتك
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {(venue.features || []).map((f, i) => {
                    const Icon = FEATURE_ICONS[f] || CheckCircle2;
                    return (
                      <div key={`f-${i}`} className="flex flex-col items-center text-center group">
                        <div className="bg-[#0f172a] border border-[#1e293b] group-hover:border-[#d4af37]/50 w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 shadow-lg group-hover:-translate-y-1">
                          <Icon className="w-6 h-6 text-[#d4af37]" />
                        </div>
                        <span className="font-bold text-xs text-slate-300">{f}</span>
                      </div>
                    );
                  })}
                  {(venue.custom_features || []).map((cf, i) => {
                    const Icon = CUSTOM_ICONS[cf.icon] || CheckCircle2;
                    return (
                      <div key={`cf-${i}`} className="flex flex-col items-center text-center group">
                        <div className="bg-[#0f172a] border border-[#1e293b] group-hover:border-[#d4af37]/50 w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 shadow-lg group-hover:-translate-y-1">
                          <Icon className="w-6 h-6 text-[#d4af37]" />
                        </div>
                        <span className="font-bold text-xs text-slate-300">{cf.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* يوتيوب */}
            {youtubeVideos.length > 0 && (
              <div className="mb-16">
                <h2 className="text-[#d4af37] text-sm font-black tracking-widest uppercase mb-6 flex items-center gap-2">
                  <div className="w-8 h-px bg-[#d4af37]/50" /> الجولة المرئية
                </h2>
                <div className="relative rounded-3xl overflow-hidden border-2 border-[#1e293b] hover:border-[#d4af37]/40 transition-colors duration-500 bg-black shadow-2xl">
                  <div className="aspect-video w-full bg-black relative z-10">
                    <iframe key={activeUrl} src={toYoutubeEmbed(activeUrl)} className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen referrerPolicy="strict-origin-when-cross-origin" title="الجولة المرئية" />
                  </div>
                </div>
                {youtubeVideos.length > 1 && (
                  <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                    {youtubeVideos.map((url, i) => {
                      const vid = getYoutubeId(url);
                      const thumb = vid ? `https://img.youtube.com/vi/${vid}/mqdefault.jpg` : '';
                      const isActive = i === activeVideo;
                      return (
                        <button key={i} onClick={() => setActiveVideo(i)}
                          className="relative shrink-0 w-32 aspect-video rounded-xl overflow-hidden transition-all"
                          style={{ outline: isActive ? `3px solid ${ROYAL_GOLD}` : '3px solid transparent', outlineOffset: 2 }}>
                          {thumb ? <img src={thumb} alt={`فيديو ${i + 1}`} className="w-full h-full object-cover" />
                                 : <div className="w-full h-full bg-gray-800" />}
                          <div className={`absolute inset-0 flex items-center justify-center transition-all ${isActive ? 'bg-black/10' : 'bg-black/50'}`}>
                            <PlayCircle className="w-7 h-7 text-white drop-shadow" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* المعرض */}
            {imgs.length > 1 && (
              <div className="mb-16">
                <h2 className="text-[#d4af37] text-sm font-black tracking-widest uppercase mb-6 flex items-center gap-2">
                  <div className="w-8 h-px bg-[#d4af37]/50" /> عدسة المكان
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {imgs.slice(0, 4).map((url, i) => (
                    <div key={i} className={`rounded-3xl overflow-hidden border border-[#1e293b] shadow-xl relative group ${i === 0 ? 'col-span-2 aspect-[21/9]' : 'aspect-[4/5] md:aspect-square'}`}>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                      <img src={url} alt={`صورة ${i + 1}`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* الموقع */}
            {venue.maps_url && (
              <div className="mb-16">
                <h2 className="text-[#d4af37] text-sm font-black tracking-widest uppercase mb-6 flex items-center gap-2">
                  <div className="w-8 h-px bg-[#d4af37]/50" /> موقعنا
                </h2>
                <div className="glass-dark-r border border-[#d4af37]/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-center gap-5 flex-col md:flex-row text-center md:text-right w-full md:w-auto">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow-inner bg-[#0f172a] border border-[#d4af37]/30">
                      <MapPin className="w-7 h-7 text-[#d4af37]" />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-xl mb-1">طريق الوصول</h3>
                      <p className="text-slate-400 font-medium text-sm">اضغط على الزر لفتح الموقع مباشرة عبر خرائط قوقل.</p>
                    </div>
                  </div>
                  <a href={venue.maps_url} target="_blank" rel="noopener noreferrer"
                    className="text-[#020617] px-8 py-4 rounded-xl font-black text-sm transition-all shadow-xl hover:opacity-90 flex items-center justify-center gap-2 w-full md:w-auto shrink-0"
                    style={{ background: `linear-gradient(to right, #b5952f, ${ROYAL_GOLD})` }}>
                    <MapPin className="w-4 h-4" /> فتح في قوقل ماب
                  </a>
                </div>
              </div>
            )}

            {/* شروط الإقامة */}
            {bookingsEnabled && venue.booking_terms && (
              <div className="mb-12">
                <button onClick={() => setTermsOpen(o => !o)}
                  className="w-full flex items-center justify-between glass-dark-r border border-[#d4af37]/20 rounded-2xl p-4 transition hover:border-[#d4af37]/40">
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-[#d4af37]" />
                    <span className="font-black text-sm text-white">شروط الإقامة</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[#d4af37] transition-transform ${termsOpen ? 'rotate-180' : ''}`} />
                </button>
                {termsOpen && (
                  <div className="bg-[#0f172a] border border-[#1e293b] border-t-0 rounded-b-2xl px-5 py-4 -mt-2">
                    <p className="text-sm text-slate-300 font-medium leading-relaxed whitespace-pre-wrap pt-2">{venue.booking_terms}</p>
                  </div>
                )}
              </div>
            )}

            {/* تقييمات Google — royal */}
            {venue.google_reviews?.length > 0 && (
              <div className="py-12 border-t border-[#d4af37]/10">
                <div className="flex flex-col items-center mb-8">
                  <p className="text-[#d4af37] text-xs font-bold mb-2 tracking-widest uppercase">ماذا قال عملاؤنا</p>
                  <h3 className="text-2xl font-black text-white">تقييمات حقيقية</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 max-w-3xl mx-auto">
                  {venue.google_reviews.slice(0,4).map((r, i) => (
                    <div key={i} className="bg-[#0f172a] border border-[#d4af37]/10 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] font-black text-lg">
                          {r.author?.[0]?.toUpperCase() || '؟'}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{r.author}</p>
                          <div className="flex gap-0.5 mt-0.5">
                            {Array(Math.min(r.rating||5,5)).fill(0).map((_,j)=>(
                              <svg key={j} viewBox="0 0 24 24" fill="#d4af37" className="w-3 h-3"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            ))}
                          </div>
                        </div>
                        <div className="mr-auto">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-600">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="#EA4335"/>
                          </svg>
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{r.text?.slice(0,160)}{r.text?.length>160?'...':''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* السوشيال */}
            {activeSocials.length > 0 && (
              <div className="py-12 border-t border-[#d4af37]/10 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 w-64 h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
                <p className="text-[#d4af37] text-xs font-bold mb-6 tracking-widest uppercase">ابق على تواصل معنا</p>
                <div className="flex gap-5">
                  {activeSocials.map(s => {
                    const Icon = SocialIcons[s.key];
                    return (
                      <a key={s.key} href={buildSocialUrl(s.key, social[s.key])} target="_blank" rel="noreferrer" title={s.label}
                        className="w-12 h-12 rounded-full bg-[#0f172a] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-[#020617] hover:-translate-y-1 transition-all duration-300">
                        <Icon />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </main>

          <div className="text-center py-6 text-xs text-slate-600 font-medium">
            جميع الحقوق محفوظة © {new Date().getFullYear()} · <a href="https://www.aqacloud.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#d4af37] transition-colors">عقار كلاود</a>
          </div>

          {/* شريط الحجز السفلي */}
          <div className="fixed bottom-0 left-0 w-full bg-[#020617]/90 backdrop-blur-xl border-t border-[#1e293b] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] z-50 px-5 py-4">
            <div className="container mx-auto max-w-4xl flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 font-bold mb-0.5 uppercase tracking-widest">يبدأ من</div>
                <div className="text-2xl font-black text-white">
                  {venue.price_weekday ? Number(venue.price_weekday).toLocaleString('en-US') : '—'}
                  <span className="text-sm text-[#d4af37] font-bold mr-1">ر.س</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {venue.whatsapp && (
                  <a href={`https://wa.me/${venue.whatsapp}`} target="_blank" rel="noopener noreferrer"
                    className="border border-[#d4af37]/30 text-[#d4af37] w-12 h-12 rounded-2xl font-bold text-sm transition-all active:scale-95 hover:bg-[#d4af37]/10 flex items-center justify-center">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.5 3.5A11.8 11.8 0 0012 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6A11.9 11.9 0 0012 24c6.6 0 12-5.4 12-12 0-3.2-1.3-6.2-3.5-8.5zM12 21.8c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.7 9.7 0 01-1.5-5.2c0-5.4 4.4-9.8 9.9-9.8 2.6 0 5.1 1 6.9 2.9a9.7 9.7 0 012.9 6.9c0 5.4-4.4 9.8-9.8 9.8z"/>
                    </svg>
                  </a>
                )}
                <BookingDialog dark />
              </div>
            </div>
          </div>
        </div>

        {/* نافذة الحجز المستقلة */}
        <BookingSheet
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
          accent={accent}
          venueName={venue.name}
          bookingForm={bookingForm}
          setBookingForm={setBookingForm}
          bookingDone={bookingDone}
          setBookingDone={setBookingDone}
          bookedDates={bookedDates}
          handleBook={handleBook}
          isPending={bookMutation.isPending}
          dark={true}
        />
      </>
    );
  }

  /* ════════════════════════════════════════════════════════
     الثيم الكلاسيكي الفاتح
  ════════════════════════════════════════════════════════ */
  return (
    <>
      {fontStyle}

      <div className="min-h-screen bg-[#fcfcfc] text-gray-800 font-cairo pb-28" dir="rtl">

        <header className="fixed w-full top-0 z-50">
          <div className="flex justify-between items-center px-4 py-4">
            <div className="bg-white/80 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 shadow-sm border border-white/50">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${accent}22` }}>
                <MapPin className="w-4 h-4" style={{ color: accent }} />
              </div>
              <span className="font-bold text-sm tracking-tight text-gray-900">{venue.name}</span>
            </div>
          </div>
        </header>

        <section className="relative h-[58vh] md:h-[68vh] w-full">
          {heroImg ? (
            <img src={heroImg} alt={venue.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/30 to-gray-900/10" />

          {imgs.length > 1 && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
              <button onClick={() => setImgIdx(i => (i - 1 + imgs.length) % imgs.length)}
                className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full w-10 h-10 flex items-center justify-center transition-all z-20">
                <ChevronRight className="w-5 h-5" />
              </button>
              <button onClick={() => setImgIdx(i => (i + 1) % imgs.length)}
                className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full w-10 h-10 flex items-center justify-center transition-all z-20">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          )}

          {imgs.length > 1 && (
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {imgs.map((_, i) => (
                <div key={i} className="h-1.5 rounded-full transition-all"
                  style={{ width: i === imgIdx ? 24 : 6, background: i === imgIdx ? accent : 'rgba(255,255,255,.5)' }} />
              ))}
            </div>
          )}

          <div className="absolute bottom-0 w-full px-6 py-10 md:px-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white font-semibold text-xs mb-4">
              <Star className="w-3 h-3 fill-current" style={{ color: accent }} />
              <span>{venue.venue_type || 'مكان مميز'}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-3 drop-shadow-lg">{venue.name}</h1>
            <div className="flex items-center gap-4 text-sm font-medium text-gray-200">
              {venue.city && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" style={{ color: accent }} /> {venue.city}
                </span>
              )}
            </div>
          </div>
        </section>

        <main className="container mx-auto px-5 md:px-12 max-w-4xl -mt-6 relative z-10 bg-[#fcfcfc] rounded-t-[2.5rem] pt-9 shadow-[0_-8px_24px_rgba(0,0,0,0.04)]">

          {(venue.price_weekday || venue.price_weekend) && (
            <div className="grid grid-cols-2 gap-4 mb-10">
              {venue.price_weekday && (
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center">
                  <div className="text-3xl font-black" style={{ color: accent }}>{Number(venue.price_weekday).toLocaleString('en-US')}</div>
                  <div className="text-xs text-gray-500 font-bold mt-1">ر.س · أيام الأسبوع</div>
                </div>
              )}
              {venue.price_weekend && (
                <div className="rounded-2xl p-5 text-center border" style={{ background: `${accent}11`, borderColor: `${accent}33` }}>
                  <div className="text-3xl font-black" style={{ color: accent }}>{Number(venue.price_weekend).toLocaleString('en-US')}</div>
                  <div className="text-xs text-gray-500 font-bold mt-1">ر.س · الويكند</div>
                </div>
              )}
            </div>
          )}

          {venue.description && (
            <div className="mb-10">
              <h2 className="text-lg font-black text-gray-900 mb-3">عن المكان</h2>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base font-medium">{venue.description}</p>
            </div>
          )}

          {(venue.check_in_time || venue.check_out_time) && (
            <div className="grid grid-cols-2 gap-4 mb-12">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <div className="p-2.5 rounded-xl" style={{ background: `${accent}1a` }}>
                  <Clock className="w-5 h-5" style={{ color: accent }} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold mb-0.5">تسجيل الدخول</div>
                  <div className="font-black text-sm text-gray-900">{venue.check_in_time || '—'}</div>
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <div className="p-2.5 rounded-xl" style={{ background: `${accent}1a` }}>
                  <Clock className="w-5 h-5" style={{ color: accent }} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold mb-0.5">تسجيل الخروج</div>
                  <div className="font-black text-sm text-gray-900">{venue.check_out_time || '—'}</div>
                </div>
              </div>
            </div>
          )}

          {((venue.features?.length > 0) || (venue.custom_features?.length > 0)) && (
            <div className="mb-12">
              <div className="mb-6">
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: accent }}>المرافق والمزايا</span>
                <h2 className="text-2xl font-black text-gray-900 mt-1">أماكن صُممت لراحتك</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(venue.features || []).map((f, i) => {
                  const Icon = FEATURE_ICONS[f] || CheckCircle2;
                  return (
                    <div key={`f-${i}`} className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3.5 shadow-sm">
                      <div className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center" style={{ background: `${accent}1a` }}>
                        <Icon className="w-4 h-4" style={{ color: accent }} />
                      </div>
                      <span className="font-bold text-sm text-gray-800">{f}</span>
                    </div>
                  );
                })}
                {(venue.custom_features || []).map((cf, i) => {
                  const Icon = CUSTOM_ICONS[cf.icon] || CheckCircle2;
                  return (
                    <div key={`cf-${i}`} className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3.5 shadow-sm">
                      <div className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center" style={{ background: `${accent}1a` }}>
                        <Icon className="w-4 h-4" style={{ color: accent }} />
                      </div>
                      <span className="font-bold text-sm text-gray-800">{cf.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {youtubeVideos.length > 0 && (
            <div className="mb-12">
              <div className="text-center mb-7">
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: accent }}>جولة مرئية</span>
                <h2 className="text-2xl font-black text-gray-900 mt-1">اكتشف التفاصيل الحية</h2>
              </div>
              <div className="relative rounded-3xl overflow-hidden border bg-white p-2 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)]" style={{ borderColor: `${accent}33` }}>
                <div className="rounded-2xl overflow-hidden aspect-video w-full bg-gray-100">
                  <iframe key={activeUrl} src={toYoutubeEmbed(activeUrl)} className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen referrerPolicy="strict-origin-when-cross-origin" title="جولة سينمائية" />
                </div>
              </div>
              {youtubeVideos.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {youtubeVideos.map((url, i) => {
                    const vid = getYoutubeId(url);
                    const thumb = vid ? `https://img.youtube.com/vi/${vid}/mqdefault.jpg` : '';
                    const isActive = i === activeVideo;
                    return (
                      <button key={i} onClick={() => setActiveVideo(i)}
                        className="relative shrink-0 w-32 aspect-video rounded-xl overflow-hidden transition-all"
                        style={{ outline: isActive ? `3px solid ${accent}` : '3px solid transparent', outlineOffset: 2 }}>
                        {thumb ? <img src={thumb} alt={`فيديو ${i + 1}`} className="w-full h-full object-cover" />
                               : <div className="w-full h-full bg-gray-200" />}
                        <div className={`absolute inset-0 flex items-center justify-center transition-all ${isActive ? 'bg-black/10' : 'bg-black/40'}`}>
                          <PlayCircle className="w-7 h-7 text-white drop-shadow" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {imgs.length > 1 && (
            <div className="mb-12">
              <h2 className="text-xl font-black text-gray-900 mb-5 border-r-4 pr-3" style={{ borderColor: accent }}>المعرض</h2>
              <div className="grid grid-cols-2 gap-3">
                {imgs.slice(0, 4).map((url, i) => (
                  <div key={i} className={`rounded-2xl overflow-hidden border border-gray-100 shadow-sm ${i === 0 || i === 3 ? 'col-span-2 aspect-[21/9]' : 'aspect-square'}`}>
                    <img src={url} alt={`صورة ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {venue.maps_url && (
            <div className="mb-10">
              <h2 className="text-xl font-black text-gray-900 mb-5 border-r-4 pr-3" style={{ borderColor: accent }}>موقعنا</h2>
              <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-5 flex-col md:flex-row text-center md:text-right w-full md:w-auto">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow-inner" style={{ background: `${accent}1a`, border: `1px solid ${accent}33` }}>
                    <MapPin className="w-7 h-7" style={{ color: accent }} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-xl mb-1">طريق الوصول</h3>
                    <p className="text-gray-500 font-medium text-sm">اضغط على الزر لفتح الموقع مباشرة عبر خرائط قوقل لتصل إلينا بكل يسر وسهولة.</p>
                  </div>
                </div>
                <a href={venue.maps_url} target="_blank" rel="noopener noreferrer"
                  className="text-white px-8 py-4 rounded-xl font-black text-sm transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 w-full md:w-auto shrink-0 hover:opacity-90"
                  style={{ background: accent }}>
                  <MapPin className="w-4 h-4 text-white" /> فتح في قوقل ماب
                </a>
              </div>
            </div>
          )}

          {bookingsEnabled && venue.booking_terms && (
            <div className="mb-8">
              <button onClick={() => setTermsOpen(o => !o)}
                className="w-full flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gray-50">
                    <Info className="w-5 h-5 text-gray-500" />
                  </div>
                  <span className="font-black text-sm text-gray-900">شروط الإقامة</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${termsOpen ? 'rotate-180' : ''}`} />
              </button>
              {termsOpen && (
                <div className="bg-gray-50 border border-gray-100 border-t-0 rounded-b-2xl px-5 py-4 -mt-2">
                  <p className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-wrap pt-2">{venue.booking_terms}</p>
                </div>
              )}
            </div>
          )}

          {/* تقييمات Google — classic */}
          {venue.google_reviews?.length > 0 && (
            <div className="py-12 border-t border-gray-100">
              <div className="flex flex-col items-center mb-8">
                <p className="text-xs font-bold mb-2 tracking-widest uppercase" style={{color:accent}}>ماذا قال عملاؤنا</p>
                <h3 className="text-2xl font-black text-gray-900">تقييمات حقيقية</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 max-w-3xl mx-auto">
                {venue.google_reviews.slice(0,4).map((r, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg text-white" style={{backgroundColor:accent}}>
                        {r.author?.[0]?.toUpperCase() || '؟'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{r.author}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {Array(Math.min(r.rating||5,5)).fill(0).map((_,j)=>(
                            <svg key={j} viewBox="0 0 24 24" fill="#f59e0b" className="w-3 h-3"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          ))}
                        </div>
                      </div>
                      <div className="mr-auto">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="#EA4335"/></svg>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{r.text?.slice(0,160)}{r.text?.length>160?'...':''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSocials.length > 0 && (
            <div className="py-10 border-t border-gray-100 flex flex-col items-center mb-4">
              <p className="text-xs font-bold mb-5 tracking-widest uppercase" style={{ color: accent }}>ابق على تواصل معنا</p>
              <div className="flex gap-4">
                {activeSocials.map(s => {
                  const Icon = SocialIcons[s.key];
                  return (
                    <a key={s.key} href={buildSocialUrl(s.key, social[s.key])} target="_blank" rel="noreferrer" title={s.label}
                      className="w-12 h-12 rounded-full bg-white border flex items-center justify-center hover:-translate-y-1 transition-all duration-300 shadow-sm"
                      style={{ borderColor: `${accent}33`, color: accent }}>
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </main>

        <div className="text-center py-6 text-xs text-gray-300 font-medium">
          جميع الحقوق محفوظة © {new Date().getFullYear()} · <a href="https://www.aqacloud.com" target="_blank" rel="noopener noreferrer" className="hover:underline">عقار كلاود</a>
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] z-50 px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 font-bold mb-0.5">السعر يبدأ من</div>
            <div className="text-2xl font-black" style={{ color: accent }}>
              {venue.price_weekday ? Number(venue.price_weekday).toLocaleString('en-US') : '—'}
              <span className="text-sm text-gray-900 font-bold mr-1">ر.س</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {venue.whatsapp && (
              <a href={`https://wa.me/${venue.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="border border-gray-200 text-gray-700 px-4 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 hover:bg-gray-50 flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.5 3.5A11.8 11.8 0 0012 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6A11.9 11.9 0 0012 24c6.6 0 12-5.4 12-12 0-3.2-1.3-6.2-3.5-8.5zM12 21.8c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.7 9.7 0 01-1.5-5.2c0-5.4 4.4-9.8 9.9-9.8 2.6 0 5.1 1 6.9 2.9a9.7 9.7 0 012.9 6.9c0 5.4-4.4 9.8-9.8 9.8z"/>
                </svg>
                واتساب
              </a>
            )}
            <BookingDialog dark={false} />
          </div>
        </div>
      </div>

      {/* نافذة الحجز المستقلة */}
      <BookingSheet
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        accent={accent}
        venueName={venue.name}
        bookingForm={bookingForm}
        setBookingForm={setBookingForm}
        bookingDone={bookingDone}
        setBookingDone={setBookingDone}
        bookedDates={bookedDates}
        handleBook={handleBook}
        isPending={bookMutation.isPending}
      />
    </>
  );
}
