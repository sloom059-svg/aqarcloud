import React, { useEffect, useState } from 'react';
import { MapPin, Star, ArrowRight, Heart, Share2, LogIn, LogOut, Wifi, Waves, Bed, UtensilsCrossed, Car, ShieldCheck, Calendar } from 'lucide-react';
import VenueCalendar from './VenueCalendar';
import { getFeatureMeta } from '@/lib/featureCatalog';

/*
  ثيم "الكريستال" (Glass) — تصميم زجاجي فاخر بطابع دافئ.
  اللون الأساسي قابل للتخصيص عبر accent (theme_color).
  طريقة الحجز نفس ثيم المنتجع (onBook يفتح BookingSheet).
  زر واتساب عائم يظهر حسب إعداد show_whatsapp_fab.
*/

const FEATURE_ICONS = {
  'مسبح': Waves, 'غرف نوم': Bed, 'مطبخ': UtensilsCrossed,
  'موقف سيارات': Car, 'واي فاي': Wifi, 'خصوصية': ShieldCheck,
};

export default function GlassTheme({
  venue, imgs = [], logo = '', reviews = [], youtubeVideos = [], getYoutubeId,
  bookingsEnabled, onBook,
  bookingForm = {}, setBookingForm = () => {}, bookedDates = [], accent = '#CBA396',
}) {
  const [calOpen, setCalOpen] = useState(false);

  const heroImg = imgs[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85';
  const galleryImgs = imgs.length > 1 ? imgs.slice(1) : imgs;
  const features = venue.features || [];
  const customFeatures = venue.custom_features || [];
  const allReviews = reviews.length ? reviews : (venue.google_reviews || []);

  // التقييم يبرز فقط إذا 4.5 فأعلى
  const ratingNum = parseFloat(venue.google_rating || venue.rating || 0);
  const showRating = ratingNum >= 4.5;

  // رقم الواتساب
  const waNumber = (venue.whatsapp || '').replace(/\D/g, '');
  const waLink = waNumber
    ? `https://wa.me/${waNumber.startsWith('966') ? waNumber : (waNumber.startsWith('05') ? '966' + waNumber.slice(1) : waNumber)}?text=${encodeURIComponent(`مرحباً، أود الاستفسار عن الحجز في ${venue.name || ''}`)}`
    : '';
  // إظهار زر الواتساب العائم (افتراضياً نعم، يُخفى لو الإعداد false صراحة)
  const showWaFab = venue.show_whatsapp_fab !== false && !!waLink;

  // Parallax للهيرو
  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('glass-hero-img');
      const s = window.scrollY;
      if (el && s < 600) el.style.transform = `translateY(${s * 0.3}px)`;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // أنيميشن الظهور
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.style.opacity = 1; e.target.style.transform = 'none'; obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.glass-fade').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const fadeStyle = { opacity: 0, transform: 'translateY(30px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1)' };
  const glassCard = { background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.5)' };

  const allFeatures = [
    ...features.map((f) => ({ name: f, meta: getFeatureMeta ? getFeatureMeta(f) : null })),
    ...customFeatures.map((f) => ({ name: typeof f === 'string' ? f : f.name, meta: null, custom: true })),
  ];

  return (
    <div dir="rtl" style={{ fontFamily: 'Tajawal, sans-serif', background: '#fdfcfb', color: '#1e293b', paddingBottom: 40, minHeight: '100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');`}</style>

      {/* أزرار عائمة علوية */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50, pointerEvents: 'none' }}>
        <div onClick={() => window.history.back()} style={{ ...glassCard, pointerEvents: 'auto', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
          <ArrowRight size={20} />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div onClick={() => { if (navigator.share) navigator.share({ title: venue.name, url: window.location.href }); }} style={{ ...glassCard, pointerEvents: 'auto', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
            <Share2 size={18} />
          </div>
        </div>
      </div>

      {/* زر واتساب عائم */}
      {showWaFab && (
        <a href={waLink} target="_blank" rel="noopener noreferrer"
          style={{ position: 'fixed', bottom: 24, left: 16, zIndex: 40, width: 56, height: 56, background: accent, color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 20px ${accent}66`, textDecoration: 'none', transition: 'transform 0.3s' }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.0c-.24.68-1.42 1.31-1.96 1.36-.5.05-1.14.07-1.84-.12-.42-.13-.97-.31-1.66-.61-2.93-1.27-4.84-4.22-4.99-4.42-.15-.2-1.19-1.58-1.19-3.01s.75-2.14 1.02-2.43c.27-.29.59-.37.78-.37.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.59.82 2.03.89 2.18.07.15.12.32.02.51-.09.2-.14.32-.28.49-.14.17-.29.38-.42.51-.14.14-.28.29-.12.57.16.27.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.21 1.37.27.14.43.12.59-.07.16-.2.68-.79.86-1.06.18-.27.36-.22.61-.13.25.09 1.58.75 1.85.88.27.14.45.2.52.32.07.12.07.68-.17 1.36z"/></svg>
        </a>
      )}

      {/* الهيرو */}
      <div style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden', borderBottomLeftRadius: 48, borderBottomRightRadius: 48, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)' }}>
        <img id="glass-hero-img" src={heroImg} alt={venue.name} style={{ position: 'absolute', width: '100%', height: '120%', objectFit: 'cover', top: '-10%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0f172a, rgba(15,23,42,0.3) 50%, transparent)', opacity: 0.9 }} />
        {logo && (
          <div style={{ position: 'absolute', top: 80, right: 24, zIndex: 10 }}>
            <img src={logo} alt="logo" style={{ height: 56, maxWidth: 140, objectFit: 'contain' }} />
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 48, left: 0, width: '100%', padding: 32, color: '#fff', zIndex: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ background: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(12px)', padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} /> {venue.hero_badge || 'متاح للحجز'}
            </span>
            {showRating && (
              <span style={{ background: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(12px)', padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
                <Star size={13} fill="#facc15" stroke="#facc15" /> {ratingNum} تقييم النخبة
              </span>
            )}
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, marginBottom: 12, lineHeight: 1.15, textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>{venue.hero_title || venue.name}</h1>
          {venue.city && (
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={18} style={{ color: accent }} /> {venue.city}
            </p>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 20, marginTop: -32 }}>

        {/* نبذة + أوقات الدخول/الخروج */}
        <div className="glass-fade" style={{ ...glassCard, ...fadeStyle, borderRadius: 40, padding: 28, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', marginBottom: 32 }}>
          <h3 style={{ fontWeight: 900, fontSize: 24, marginBottom: 12, color: '#1e293b' }}>تجربة لا تُنسى</h3>
          <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.9, fontWeight: 600, marginBottom: 24 }}>
            {venue.description || 'مكانك المثالي لقضاء أجمل الأوقات وتجديد طاقتك. بيئة مريحة وهادئة تجمع بين الخصوصية وتكامل المرافق، لتصنع ذكريات لا تُنسى مع عائلتك ومن تحب.'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ background: 'rgba(255,255,255,0.4)', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${accent}1a`, color: accent, border: `1px solid ${accent}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><LogIn size={20} /></div>
              <div>
                <span style={{ display: 'block', fontSize: 11, color: '#94a3b8', fontWeight: 700, marginBottom: 2 }}>تسجيل الدخول</span>
                <span style={{ display: 'block', fontSize: 15, fontWeight: 900, color: '#1e293b' }}>{venue.check_in_time || '03:00 مساءً'}</span>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.4)', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${accent}1a`, color: accent, border: `1px solid ${accent}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><LogOut size={20} /></div>
              <div>
                <span style={{ display: 'block', fontSize: 11, color: '#94a3b8', fontWeight: 700, marginBottom: 2 }}>تسجيل المغادرة</span>
                <span style={{ display: 'block', fontSize: 15, fontWeight: 900, color: '#1e293b' }}>{venue.check_out_time || '11:00 صباحاً'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* المميزات */}
        {allFeatures.length > 0 && (
          <div className="glass-fade" style={{ ...fadeStyle, background: '#fff', borderRadius: 40, padding: 28, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9', marginBottom: 32 }}>
            <h3 style={{ fontWeight: 900, fontSize: 24, color: '#1e293b', marginBottom: 24 }}>مميزات المكان</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
              {allFeatures.map((f, i) => {
                const Icon = FEATURE_ICONS[f.name] || ShieldCheck;
                return (
                  <div key={i} style={{ background: '#f8fafc', borderRadius: 32, padding: 16, display: 'flex', alignItems: 'flex-start', gap: 16, border: '1px solid #f1f5f9' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 16, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: accent, border: '1px solid #e2e8f0' }}>
                      <Icon size={24} />
                    </div>
                    <div style={{ paddingTop: 4 }}>
                      <h4 style={{ fontWeight: 900, color: '#1e293b', marginBottom: 4 }}>{f.name}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* المعرض */}
        {galleryImgs.length > 0 && (
          <div className="glass-fade" style={{ ...fadeStyle, marginBottom: 32 }}>
            <h3 style={{ fontWeight: 900, fontSize: 24, color: '#1e293b', marginBottom: 16, paddingRight: 8 }}>جولة بصرية</h3>
            <div style={{ display: 'flex', overflowX: 'auto', gap: 16, paddingBottom: 24, scrollSnapType: 'x mandatory' }} className="glass-scroll">
              {galleryImgs.map((img, i) => (
                <div key={i} style={{ width: 300, height: 350, flexShrink: 0, scrollSnapAlign: 'center', borderRadius: 40, overflow: 'hidden', position: 'relative', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* التقييمات */}
        {showRating && allReviews.length > 0 && (
          <div className="glass-fade" style={{ ...fadeStyle, background: '#0f172a', borderRadius: 48, padding: 32, color: '#fff', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)', overflow: 'hidden', position: 'relative', marginBottom: 32 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 256, height: 256, background: `${accent}33`, borderRadius: '50%', filter: 'blur(80px)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, position: 'relative', zIndex: 10 }}>
              <div>
                <span style={{ color: accent, fontWeight: 700, fontSize: 14, letterSpacing: 2, marginBottom: 4, display: 'block' }}>تجارب حقيقية</span>
                <h3 style={{ fontWeight: 900, fontSize: 30 }}>آراء ضيوفنا</h3>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', padding: '8px 16px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
                <Star size={16} fill="#facc15" stroke="#facc15" /> <span style={{ fontWeight: 900, fontSize: 20 }}>{ratingNum}</span>
              </div>
            </div>
            <div style={{ display: 'flex', overflowX: 'auto', gap: 16, paddingBottom: 16, scrollSnapType: 'x mandatory', position: 'relative', zIndex: 10 }} className="glass-scroll">
              {allReviews.slice(0, 8).map((r, i) => {
                const uname = r.user?.name || r.username || r.author_name || 'ضيف';
                const txt = r.snippet || r.description || r.text || 'إقامة رائعة ومكان نظيف.';
                return (
                  <div key={i} style={{ width: 300, flexShrink: 0, scrollSnapAlign: 'center', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 32, padding: 24 }}>
                    <div style={{ display: 'flex', gap: 4, color: '#facc15', fontSize: 12, marginBottom: 16 }}>★★★★★</div>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.7, marginBottom: 24, fontWeight: 600, minHeight: 70 }}>"{txt}"</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${accent}4d`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, border: `1px solid ${accent}80` }}>{uname.charAt(0)}</div>
                      <div>
                        <h4 style={{ fontWeight: 700, fontSize: 14 }}>{uname}</h4>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* التوفر والحجز */}
        {bookingsEnabled && (
          <div className="glass-fade" style={{ ...fadeStyle, background: '#fff', borderRadius: 48, padding: 28, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', marginBottom: 32 }}>
            <h3 style={{ fontWeight: 900, fontSize: 24, marginBottom: 24, color: '#1e293b' }}>التوفر والحجز</h3>

            <button onClick={() => setCalOpen(!calOpen)} style={{ width: '100%', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 24, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: 16, fontFamily: 'inherit' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, color: '#1e293b' }}>
                <Calendar size={18} style={{ color: accent }} />
                {bookingForm.check_in && bookingForm.check_out ? `${bookingForm.check_in} ← ${bookingForm.check_out}` : 'اختر تواريخ الإقامة'}
              </span>
            </button>
            {calOpen && (
              <div style={{ marginBottom: 16 }}>
                <VenueCalendar bookedDates={bookedDates} bookingForm={bookingForm} setBookingForm={setBookingForm} accent={accent} />
              </div>
            )}

            <button onClick={onBook} style={{ width: '100%', height: 56, border: 0, borderRadius: 24, cursor: 'pointer', background: accent, color: '#fff', fontSize: 16, fontWeight: 900, fontFamily: 'inherit', boxShadow: `0 18px 35px ${accent}40` }}>
              إرسال طلب الحجز
            </button>
          </div>
        )}

        {/* شروط الحجز — تظهر فقط لو فعّلها صاحب الشاليه */}
        {venue.show_terms && venue.booking_terms && (
          <div className="glass-fade" style={{ ...fadeStyle, background: '#fff', borderRadius: 40, padding: 28, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', marginBottom: 32 }}>
            <h3 style={{ fontWeight: 900, fontSize: 22, marginBottom: 12, color: '#1e293b' }}>شروط الحجز</h3>
            <p style={{ color: '#64748b', fontSize: 15, fontWeight: 500, lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: 0 }}>{venue.booking_terms}</p>
          </div>
        )}
      </div>

      {/* الفوتر */}
      <footer style={{ background: '#0f172a', color: '#fff', borderTopLeftRadius: 48, borderTopRightRadius: 48, marginTop: 48, paddingTop: 64, paddingBottom: 40, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -128, right: -128, width: 320, height: 320, background: `${accent}33`, borderRadius: '50%', filter: 'blur(100px)' }} />
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 20 }}>
          <h2 style={{ fontSize: 30, fontWeight: 900, marginBottom: 24 }}>{venue.name}</h2>
          {venue.footer_text && (
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: 500, lineHeight: 1.9, maxWidth: 560, margin: '0 auto 24px' }}>{venue.footer_text}</p>
          )}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 32 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700, marginTop: 8 }}>© 2026 جميع الحقوق محفوظة - عقار كلاود</p>
          </div>
        </div>
      </footer>

      <style>{`.glass-scroll::-webkit-scrollbar{display:none;} .glass-scroll{-ms-overflow-style:none;scrollbar-width:none;}`}</style>
    </div>
  );
}
