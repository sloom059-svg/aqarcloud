import React, { useEffect, useState } from 'react';
import { MapPin, Star, Share2, LogIn, LogOut, ShieldCheck, Calendar } from 'lucide-react';
import VenueCalendar from './VenueCalendar';
import { getFeatureMeta } from '@/lib/featureCatalog';

/*
  ثيم "الكريستال" (Glass) — تصميم زجاجي فاخر بطابع دافئ.
  اللون الأساسي قابل للتخصيص عبر accent (theme_color).
  طريقة الحجز نفس ثيم المنتجع (onBook يفتح BookingSheet).
  زر واتساب عائم يظهر حسب إعداد show_whatsapp_fab.
*/

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
    ...features.map((f) => ({ name: f, meta: getFeatureMeta(f, venue.venue_type) })),
    ...customFeatures.map((f) => ({ name: typeof f === 'string' ? f : f.name, meta: null, custom: true })),
  ];

  return (
    <div dir="rtl" style={{ fontFamily: 'Tajawal, sans-serif', background: '#fdfcfb', color: '#1e293b', paddingBottom: 40, minHeight: '100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');`}</style>

      {/* زر المشاركة العائم */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', padding: 20, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', zIndex: 50, pointerEvents: 'none' }}>
        <div onClick={() => { if (navigator.share) navigator.share({ title: venue.name, url: window.location.href }); }} style={{ ...glassCard, pointerEvents: 'auto', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
          <Share2 size={18} />
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
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, marginBottom: 12, lineHeight: 1.15, textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>{venue.name}</h1>
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
          <h3 style={{ fontWeight: 900, fontSize: 24, marginBottom: 12, color: '#1e293b' }}>{venue.about_title || 'تجربة لا تُنسى'}</h3>
          <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.9, fontWeight: 600, marginBottom: 24 }}>
            {venue.about_text || venue.description || 'مكانك المثالي لقضاء أجمل الأوقات وتجديد طاقتك. بيئة مريحة وهادئة تجمع بين الخصوصية وتكامل المرافق، لتصنع ذكريات لا تُنسى مع عائلتك ومن تحب.'}
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
                const Icon = (f.meta && f.meta.Icon) ? f.meta.Icon : ShieldCheck;
                return (
                  <div key={i} style={{ background: '#f8fafc', borderRadius: 32, padding: 16, display: 'flex', alignItems: 'flex-start', gap: 16, border: '1px solid #f1f5f9' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 16, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: accent, border: '1px solid #e2e8f0' }}>
                      <Icon size={24} />
                    </div>
                    <div style={{ paddingTop: 4 }}>
                      <h4 style={{ fontWeight: 900, color: '#1e293b', marginBottom: 4 }}>{f.name}</h4>
                      {f.meta && f.meta.desc && (
                        <p style={{ color: '#64748b', fontSize: 12, fontWeight: 600, lineHeight: 1.7, margin: 0 }}>{f.meta.desc}</p>
                      )}
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
                const uname = r.author || r.user?.name || r.username || r.author_name || 'ضيف';
                const txt = r.text || r.snippet || r.description || 'إقامة رائعة ومكان نظيف.';
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
                <VenueCalendar
                  bookedDates={bookedDates}
                  accent={accent}
                  venueName={venue.name}
                  onRangeSelect={(start, end) => {
                    setBookingForm(p => ({ ...p, check_in: start, check_out: end }));
                    // عند اكتمال اختيار التاريخين، افتح نافذة الحجز تلقائياً
                    if (start && end) {
                      setCalOpen(false);
                      onBook();
                    }
                  }}
                />
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

          {(() => {
            const social = venue.social || {};
            const items = [
              { key: 'instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z', url: u => `https://instagram.com/${u.replace('@','')}` },
              { key: 'tiktok', path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.41-.02-.34-.02-.68-.02-1.02.13-1.6.82-3.08 1.94-4.21 1.52-1.52 3.8-2.26 5.86-1.92V14.3c-1.11-.27-2.31-.1-3.29.41-.85.45-1.46 1.25-1.63 2.21-.07.39-.07.79-.02 1.18.17 1.25 1.05 2.34 2.19 2.81 1.29.54 2.8.46 4.02-.2 1.19-.65 1.95-1.9 2.05-3.26.2-2.9.06-5.82.09-8.73z', url: u => `https://tiktok.com/@${u.replace('@','')}` },
              { key: 'snapchat', path: 'M12.206 1.5c.394.006 2.124.063 3.379 1.456.844.938 1.146 2.221 1.146 3.625 0 .49-.028.95-.06 1.36.139.073.32.142.524.142.318-.012.69-.118 1.085-.379.131-.087.288-.13.448-.13.18 0 .36.054.51.158.247.169.37.43.327.71-.06.39-.5.69-1.09.93-.07.03-.16.06-.26.09-.35.11-.88.28-1.02.61-.073.17-.045.39.082.654.013.027 1.262 2.886 4.043 3.345.218.036.376.23.363.45-.004.063-.02.126-.048.186-.203.476-1.06.825-2.62 1.068-.05.067-.1.305-.13.448-.027.127-.055.258-.094.396-.046.166-.165.247-.346.247h-.016c-.087 0-.21-.018-.366-.05-.276-.06-.654-.117-1.124-.117-.276 0-.562.024-.85.072-.557.093-1.033.434-1.584.828-.783.561-1.67 1.196-3.018 1.196l-.16-.003-.13.003c-1.347 0-2.234-.635-3.017-1.196-.55-.394-1.026-.735-1.583-.828-.288-.048-.575-.072-.85-.072-.49 0-.877.063-1.124.116-.146.03-.27.05-.367.05-.234 0-.33-.142-.362-.247-.039-.138-.067-.27-.094-.397-.03-.142-.08-.38-.13-.447-1.56-.243-2.417-.592-2.62-1.07-.028-.058-.044-.12-.048-.185-.013-.22.145-.414.363-.45 2.78-.458 4.03-3.317 4.043-3.345.127-.265.155-.484.082-.654-.14-.33-.67-.5-1.02-.61-.1-.03-.19-.06-.26-.09-.79-.312-1.156-.693-1.09-1.135.05-.32.378-.566.748-.566.13 0 .25.03.36.084.42.276.81.378 1.14.39.24 0 .43-.07.57-.144-.033-.41-.06-.87-.06-1.36 0-1.404.302-2.687 1.146-3.625C9.93 1.563 11.66 1.506 12.054 1.5h.152z', url: u => `https://snapchat.com/add/${u.replace('@','')}` },
              { key: 'x', path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z', url: u => `https://x.com/${u.replace('@','')}` },
            ].filter(it => social[it.key] && social[it.key].trim());
            if (!items.length) return null;
            return (
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 28 }}>
                {items.map(it => (
                  <a key={it.key} href={it.url(social[it.key])} target="_blank" rel="noreferrer"
                    style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${accent}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d={it.path} /></svg>
                  </a>
                ))}
              </div>
            );
          })()}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 32 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700, marginTop: 8 }}>© 2026 جميع الحقوق محفوظة - عقار كلاود</p>
          </div>
        </div>
      </footer>

      <style>{`.glass-scroll::-webkit-scrollbar{display:none;} .glass-scroll{-ms-overflow-style:none;scrollbar-width:none;}`}</style>
    </div>
  );
}
