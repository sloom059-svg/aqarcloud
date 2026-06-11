import React, { useEffect, useState } from 'react';
import { MapPin, CheckCircle2, Waves, Bed, Leaf, UtensilsCrossed, Car, Play, Star, Calendar, ChevronDown, Heart, Flower2, Wifi, ShieldCheck, Coffee } from 'lucide-react';
import VenueCalendar from './VenueCalendar';

/*
  ثيم "أوركيد" — رمادي ناعم + روز جولد (كاشمير)، خط Tajawal.
  نصوص قابلة للتخصيص: hero_badge, hero_title, footer_text (مع نصوص افتراضية).
  يبرز التقييم فقط إذا 4.5+.
*/

const CHARCOAL='#2C302E', IVORY='#FCFBF8', CASHMERE='#CBA396', BLUSH='#F4EAE6', STONE='#8A817C';

const FEATURE_ICONS = {
  'مسبح': Waves, 'غرف نوم': Bed, 'حديقة': Leaf, 'مطبخ': UtensilsCrossed,
  'موقف سيارات': Car, 'واي فاي': Wifi, 'خصوصية': ShieldCheck,
};

// النصوص الافتراضية — تظهر لو ما عبّى الحقول
const DEFAULTS = {
  badge: 'اللطافة في كل تفصيلة',
  title: 'الهدوء الذي تستحقه',
  footer: 'صممنا هذا المكان بحب، ليكون وجهتك الأولى للراحة والسكينة ولصناعة ذكريات دافئة لا تُنسى.',
};

export default function OrchidTheme({
  venue, imgs = [], logo = '', reviews = [], youtubeVideos = [], getYoutubeId,
  bookingsEnabled, onBook,
  bookingForm = {}, setBookingForm = () => {}, bookedDates = [], accent = CASHMERE,
}) {
  const [calOpen, setCalOpen] = useState(false);
  const heroImg = imgs[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80';
  const features = venue.features || [];
  const customFeatures = venue.custom_features || [];
  const allReviews = reviews.length ? reviews : (venue.google_reviews || []);
  const price = venue.price_weekday || venue.price_weekend;
  const ytId = youtubeVideos.length ? getYoutubeId(youtubeVideos[0]) : null;
  const galleryImgs = imgs.slice(0, 5);

  // التقييم يبرز فقط إذا 4.5+
  const ratingNum = parseFloat(venue.google_rating) || 0;
  const showRating = ratingNum >= 4.5;
  const reviewCount = venue.google_reviews_count || 0;

  // النصوص القابلة للتخصيص (أو الافتراضية)
  const heroBadge = venue.hero_badge || DEFAULTS.badge;
  const heroTitle = venue.hero_title || DEFAULTS.title;
  const footerText = venue.footer_text || DEFAULTS.footer;

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'none'; obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-fade]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const fade = { opacity: 0, transform: 'translateY(30px)', transition: 'all 1s ease-out' };

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif", color: CHARCOAL, background: IVORY, overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap');
        .or-container{max-width:1200px;margin-inline:auto;padding-inline:24px}
        @media(min-width:1024px){.or-container{padding-inline:48px}}
        .or-zoom{overflow:hidden;border-radius:2rem}
        .or-zoom img{transition:transform 1.2s ease}
        .or-zoom:hover img{transform:scale(1.05)}
        .or-card-hover{transition:transform .5s ease}
        .or-card-hover:hover{transform:translateY(-8px)}
        @media(max-width:1050px){
          .or-hero,.or-book,.or-loc{flex-direction:column!important}
          .or-hero>div,.or-loc>div{width:100%!important}
          .or-book-zone{grid-template-columns:1fr!important}
          .or-reservation{position:relative!important;top:auto!important}
          .or-feats{grid-template-columns:repeat(2,1fr)!important}
          .or-reviews{grid-template-columns:1fr!important}
          .or-gallery{grid-template-columns:1fr!important;grid-auto-rows:240px!important}
          .or-gallery>div{grid-column:auto!important;grid-row:auto!important}
        }
        @media(max-width:680px){.or-feats{grid-template-columns:1fr!important}.or-rule{grid-template-columns:1fr!important}}
      `}</style>

      {/* واتساب عائم */}
      {venue.whatsapp && (
        <a href={`https://wa.me/${venue.whatsapp}`} target="_blank" rel="noreferrer"
          style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 50, background: CASHMERE, color: '#fff', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 25px 50px -12px rgba(203,163,150,.4)' }}>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.6.2-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5-.1-.2-.6-1.5-.9-2-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2z" /></svg>
        </a>
      )}

      {/* الهيدر */}
      <header style={{ position: 'fixed', width: '100%', top: 0, zIndex: 40, padding: '16px 0', background: 'rgba(252,251,248,.85)', backdropFilter: 'blur(15px)', borderBottom: '1px solid rgba(203,163,150,.1)' }}>
        <div className="or-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {logo ? (
              <img src={logo} alt={venue.name} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${CASHMERE}` }} />
            ) : (
              <Flower2 size={26} color={CASHMERE} />
            )}
            <span style={{ fontWeight: 700, fontSize: 22, color: CHARCOAL }}>{venue.name}</span>
          </div>
          {bookingsEnabled && (
            <button onClick={onBook} style={{ background: CHARCOAL, color: '#fff', padding: '10px 28px', borderRadius: 999, fontWeight: 500, fontSize: 14, border: 0, cursor: 'pointer', fontFamily: 'inherit' }}>
              احجز موعدك
            </button>
          )}
        </div>
      </header>

      {/* الهيرو */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '96px 0 48px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 600, height: 600, background: 'rgba(203,163,150,.1)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: 500, height: 500, background: 'rgba(244,234,230,.5)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div className="or-container" style={{ width: '100%', position: 'relative', zIndex: 10 }}>
          <div className="or-hero" style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
            <div data-fade style={{ ...fade, width: '42%' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: '#fff', border: `1px solid ${BLUSH}`, color: CASHMERE, fontWeight: 700, fontSize: 12, marginBottom: 24, letterSpacing: 1, boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                <Leaf size={13} /> {heroBadge}
              </span>
              <h1 style={{ fontSize: 'clamp(44px,7vw,72px)', fontWeight: 900, color: CHARCOAL, margin: '0 0 24px', lineHeight: 1.15 }}>{heroTitle}</h1>
              {venue.description && <p style={{ fontSize: 18, color: STONE, margin: '0 0 40px', lineHeight: 1.8, fontWeight: 300, maxWidth: 440 }}>{venue.description}</p>}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {bookingsEnabled && (
                  <button onClick={onBook} style={{ background: CASHMERE, color: '#fff', padding: '14px 32px', borderRadius: 999, fontWeight: 700, fontSize: 16, border: 0, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 25px 50px -12px rgba(203,163,150,.4)' }}>
                    احجز الآن
                  </button>
                )}
                {ytId && (
                  <a href="#or-video" style={{ background: '#fff', color: CHARCOAL, border: `1px solid ${BLUSH}`, padding: '14px 32px', borderRadius: 999, fontWeight: 700, fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    شاهد الفيديو <Play size={12} color={CASHMERE} />
                  </a>
                )}
              </div>
            </div>
            <div data-fade style={{ ...fade, width: '58%', position: 'relative', transitionDelay: '200ms' }}>
              <div className="or-zoom" style={{ boxShadow: '0 25px 50px -12px rgba(203,163,150,.15)', border: '8px solid #fff', background: '#fff' }}>
                <img src={heroImg} alt={venue.name} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
              </div>
              {imgs[1] && (
                <div className="or-zoom" style={{ position: 'absolute', bottom: -40, right: 40, width: 256, boxShadow: '0 25px 50px -12px rgba(203,163,150,.15)', border: '8px solid #fff', background: '#fff' }}>
                  <img src={imgs[1]} alt="" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* المميزات */}
      {(features.length > 0 || customFeatures.length > 0) && (
        <section style={{ padding: '96px 0', background: 'rgba(244,234,230,.3)' }}>
          <div className="or-container">
            <div data-fade style={{ ...fade, textAlign: 'center', marginBottom: 64 }}>
              <h2 style={{ color: CASHMERE, fontWeight: 700, fontSize: 12, marginBottom: 8, letterSpacing: 2 }}>مرافق المكان</h2>
              <h3 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: CHARCOAL, margin: 0 }}>صُممت لراحتك المطلقة</h3>
              <div style={{ width: 48, height: 2, background: CASHMERE, margin: '24px auto 0', borderRadius: 999, opacity: .5 }} />
            </div>
            <div className="or-feats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
              {features.map((f, i) => {
                const Icon = FEATURE_ICONS[f] || CheckCircle2;
                return (
                  <div key={i} className="or-card-hover" data-fade style={{ ...fade, background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 10px 30px -15px rgba(0,0,0,.05)' }}>
                    <div style={{ width: 56, height: 56, background: BLUSH, color: CASHMERE, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}><Icon size={22} /></div>
                    <h4 style={{ fontSize: 18, fontWeight: 700, color: CHARCOAL, margin: 0 }}>{f}</h4>
                  </div>
                );
              })}
              {customFeatures.map((cf, i) => (
                <div key={`c${i}`} className="or-card-hover" data-fade style={{ ...fade, background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 10px 30px -15px rgba(0,0,0,.05)' }}>
                  <div style={{ width: 56, height: 56, background: BLUSH, color: CASHMERE, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}><CheckCircle2 size={22} /></div>
                  <h4 style={{ fontSize: 18, fontWeight: 700, color: CHARCOAL, margin: 0 }}>{cf.label}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* الفيديو */}
      {ytId && (
        <section id="or-video" style={{ padding: '96px 0', background: IVORY }}>
          <div className="or-container" style={{ maxWidth: 1000 }}>
            <div data-fade style={{ ...fade, marginBottom: 48 }}>
              <h2 style={{ color: CASHMERE, fontWeight: 700, fontSize: 12, marginBottom: 8, letterSpacing: 2 }}>تجربة حية</h2>
              <h3 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: CHARCOAL, margin: 0 }}>شاهد الجمال بنفسك</h3>
            </div>
            <div data-fade style={{ ...fade, width: '100%', aspectRatio: '16/9', borderRadius: 40, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(203,163,150,.15)', border: '12px solid #fff', background: BLUSH }}>
              <iframe src={`https://www.youtube.com/embed/${ytId}?controls=1&rel=0&modestbranding=1`} title="جولة" style={{ width: '100%', height: '100%', border: 0 }} allowFullScreen />
            </div>
          </div>
        </section>
      )}

      {/* المعرض */}
      {galleryImgs.length > 1 && (
        <section style={{ padding: '96px 0', background: 'rgba(244,234,230,.2)', borderBlock: `1px solid ${BLUSH}` }}>
          <div className="or-container">
            <div data-fade style={{ ...fade, textAlign: 'center', marginBottom: 64 }}>
              <h2 style={{ color: CASHMERE, fontWeight: 700, fontSize: 12, marginBottom: 8, letterSpacing: 2 }}>عدسة المكان</h2>
              <h3 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: CHARCOAL, margin: 0 }}>لوحات فنية على أرض الواقع</h3>
            </div>
            <div className="or-gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, gridAutoRows: 300 }}>
              {galleryImgs[0] && <div className="or-zoom or-card-hover" data-fade style={{ ...fade, gridColumn: 'span 2', gridRow: 'span 2', border: '4px solid #fff', position: 'relative' }}><img src={galleryImgs[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
              {galleryImgs[1] && <div className="or-zoom or-card-hover" data-fade style={{ ...fade, border: '4px solid #fff' }}><img src={galleryImgs[1]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
              {galleryImgs[2] && <div className="or-zoom or-card-hover" data-fade style={{ ...fade, border: '4px solid #fff' }}><img src={galleryImgs[2]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
              {galleryImgs[3] && <div className="or-zoom or-card-hover" data-fade style={{ ...fade, gridColumn: 'span 3', border: '4px solid #fff', height: 300 }}><img src={galleryImgs[3]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
            </div>
          </div>
        </section>
      )}

      {/* الحجز */}
      <section style={{ padding: '96px 0', background: IVORY, borderBottom: `1px solid rgba(244,234,230,.5)` }}>
        <div className="or-container">
          <div data-fade style={{ ...fade, textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ color: CASHMERE, fontWeight: 700, fontSize: 12, marginBottom: 8, letterSpacing: 2 }}>تفاصيل الإقامة</h2>
            <h3 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: CHARCOAL, margin: 0 }}>احجز مساحتك الخاصة</h3>
            <div style={{ width: 48, height: 2, background: CASHMERE, margin: '24px auto 0', borderRadius: 999, opacity: .5 }} />
          </div>
          <div className="or-book-zone" data-fade style={{ ...fade, display: 'grid', gridTemplateColumns: '.95fr 1.05fr', gap: 30, alignItems: 'start' }}>
            <aside className="or-reservation" style={{ background: '#fff', border: `1px solid ${BLUSH}`, borderRadius: 40, padding: 36, boxShadow: '0 25px 50px -12px rgba(203,163,150,.15)', position: 'sticky', top: 112 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 30, borderBottom: '1px solid rgba(0,0,0,.05)', paddingBottom: 24 }}>
                <div>
                  <h3 style={{ fontSize: 26, margin: '0 0 8px', fontWeight: 800, color: CHARCOAL }}>احجز {venue.name}</h3>
                  <p style={{ margin: 0, color: STONE, fontSize: 15 }}>تواريخ مرنة وتجربة وصول سهلة.</p>
                </div>
                {price && (
                  <div style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                    <strong style={{ display: 'block', fontSize: 36, lineHeight: 1, fontWeight: 900, color: CASHMERE }}>{Number(price).toLocaleString('en-US')}</strong>
                    <span style={{ color: STONE, fontSize: 14, fontWeight: 700, marginTop: 4, display: 'inline-block' }}>ر.س / ليلة</span>
                  </div>
                )}
              </div>
              {venue.price_weekday && venue.price_weekend && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                  <div style={{ border: `1px solid ${BLUSH}`, background: IVORY, borderRadius: 18, padding: '12px 16px' }}>
                    <div style={{ fontSize: 12, color: STONE, fontWeight: 800, marginBottom: 2 }}>أيام الأسبوع</div>
                    <div style={{ fontWeight: 800, color: CHARCOAL }}>{Number(venue.price_weekday).toLocaleString('en-US')} ر.س</div>
                  </div>
                  <div style={{ border: `1px solid ${BLUSH}`, background: IVORY, borderRadius: 18, padding: '12px 16px' }}>
                    <div style={{ fontSize: 12, color: STONE, fontWeight: 800, marginBottom: 2 }}>نهاية الأسبوع</div>
                    <div style={{ fontWeight: 800, color: CHARCOAL }}>{Number(venue.price_weekend).toLocaleString('en-US')} ر.س</div>
                  </div>
                </div>
              )}
              {bookingsEnabled && (
                <div style={{ marginBottom: 16 }}>
                  <button onClick={() => setCalOpen(o => !o)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${BLUSH}`, background: IVORY, borderRadius: 18, padding: '14px 16px', cursor: 'pointer', fontFamily: 'inherit', color: CHARCOAL }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Calendar size={18} color={CASHMERE} />
                      <span style={{ textAlign: 'right' }}>
                        <span style={{ display: 'block', fontSize: 11, color: STONE, fontWeight: 800 }}>فترة الإقامة</span>
                        <span style={{ display: 'block', fontSize: 14, fontWeight: 800 }}>
                          {bookingForm.check_in && bookingForm.check_out ? `${bookingForm.check_in} ← ${bookingForm.check_out}` : 'اختر تواريخ الدخول والخروج'}
                        </span>
                      </span>
                    </span>
                    <ChevronDown size={18} color={STONE} style={{ transform: calOpen ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }} />
                  </button>
                  {calOpen && (
                    <div style={{ marginTop: 8, background: '#fff', border: `1px solid ${BLUSH}`, borderRadius: 18, padding: 10 }}>
                      <VenueCalendar bookedDates={bookedDates} onRangeSelect={(s, e) => { setBookingForm(p => ({ ...p, check_in: s, check_out: e })); if (s && e) setCalOpen(false); }} readOnly={false} accent={accent} />
                    </div>
                  )}
                </div>
              )}
              {bookingsEnabled && (
                <button onClick={onBook} style={{ width: '100%', height: 60, border: 0, borderRadius: 32, cursor: 'pointer', background: CASHMERE, color: '#fff', fontSize: 18, fontWeight: 800, fontFamily: 'inherit', boxShadow: '0 10px 25px rgba(203,163,150,.4)' }}>
                  تأكيد طلب الحجز
                </button>
              )}
            </aside>

            <div style={{ display: 'grid', gap: 20 }}>
              {venue.description && (
                <article style={{ padding: 30, borderRadius: 40, background: '#fff', border: `1px solid ${BLUSH}`, boxShadow: '0 25px 50px -12px rgba(203,163,150,.15)' }}>
                  <h3 style={{ margin: '0 0 12px', fontSize: 24, fontWeight: 800, color: CHARCOAL }}>وصف المكان</h3>
                  <p style={{ margin: 0, color: STONE, fontSize: 16, fontWeight: 500, lineHeight: 1.8 }}>{venue.description}</p>
                </article>
              )}
              {features.length > 0 && (
                <article style={{ padding: 30, borderRadius: 40, background: '#fff', border: `1px solid ${BLUSH}`, boxShadow: '0 25px 50px -12px rgba(203,163,150,.15)' }}>
                  <h3 style={{ margin: '0 0 20px', fontSize: 24, fontWeight: 800, color: CHARCOAL }}>مرافق الشاليه</h3>
                  <div className="or-rule" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                    {features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: IVORY, border: `1px solid ${BLUSH}`, borderRadius: 24, fontWeight: 700, color: CHARCOAL, fontSize: 15 }}>
                        <CheckCircle2 size={18} color={CASHMERE} /> {f}
                      </div>
                    ))}
                  </div>
                </article>
              )}
              {venue.booking_terms && (
                <article style={{ padding: 30, borderRadius: 40, background: '#fff', border: `1px solid ${BLUSH}`, boxShadow: '0 25px 50px -12px rgba(203,163,150,.15)' }}>
                  <h3 style={{ margin: '0 0 12px', fontSize: 24, fontWeight: 800, color: CHARCOAL }}>شروط الحجز</h3>
                  <p style={{ margin: 0, color: STONE, fontSize: 16, fontWeight: 500, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{venue.booking_terms}</p>
                </article>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* التقييمات */}
      {allReviews.length > 0 && (
        <section style={{ padding: '96px 0', background: IVORY }}>
          <div className="or-container">
            <div data-fade style={{ ...fade, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 64, flexWrap: 'wrap', gap: 24 }}>
              <div>
                <h2 style={{ color: CASHMERE, fontWeight: 700, fontSize: 12, marginBottom: 8, letterSpacing: 2 }}>آراء ضيوفنا</h2>
                <h3 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: CHARCOAL, margin: 0 }}>ماذا قالوا عنا؟</h3>
              </div>
              {showRating && (
                <div style={{ background: '#fff', padding: '12px 24px', borderRadius: 999, border: `1px solid ${BLUSH}`, display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: CHARCOAL }}>{venue.google_rating}<span style={{ fontSize: 14, color: STONE, fontWeight: 400 }}>/5</span></div>
                  <div style={{ width: 1, height: 24, background: BLUSH }} />
                  <div style={{ color: CASHMERE, fontSize: 14 }}>★★★★★</div>
                </div>
              )}
            </div>
            <div className="or-reviews" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
              {allReviews.slice(0, showRating ? 3 : 6).map((r, i) => (
                <div key={i} data-fade style={{ ...fade, background: '#fff', borderRadius: 24, padding: 32, border: `1px solid rgba(244,234,230,.5)`, boxShadow: '0 5px 20px -10px rgba(0,0,0,.05)' }}>
                  <div style={{ display: 'flex', gap: 4, color: CASHMERE, fontSize: 12, marginBottom: 16 }}>{'★'.repeat(Math.min(r.rating || 5, 5))}</div>
                  <p style={{ color: STONE, fontSize: 14, lineHeight: 1.8, marginBottom: 32, fontWeight: 300, minHeight: 80 }}>"{r.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, background: BLUSH, color: CASHMERE, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>{(r.author || 'ض').charAt(0)}</div>
                    <div>
                      <h4 style={{ fontWeight: 700, color: CHARCOAL, fontSize: 14, margin: 0 }}>{r.author || 'ضيف'}</h4>
                      <span style={{ color: STONE, fontSize: 12 }}>تقييم موثّق</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* الموقع */}
      {venue.maps_url && (
        <section style={{ padding: '96px 0', background: '#fff', borderTop: `1px solid rgba(244,234,230,.5)` }}>
          <div className="or-container">
            <div className="or-loc" style={{ display: 'flex', gap: 40, alignItems: 'center', background: IVORY, borderRadius: 48, padding: 48, border: `1px solid ${BLUSH}`, boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
              <div data-fade style={{ ...fade, width: '33%' }}>
                <div style={{ width: 56, height: 56, background: '#fff', color: CASHMERE, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,.04)', border: `1px solid ${BLUSH}` }}><MapPin size={22} /></div>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: CHARCOAL, marginBottom: 16 }}>{venue.city || 'سهولة الوصول'}</h3>
                <p style={{ color: STONE, fontSize: 14, lineHeight: 1.8, marginBottom: 32 }}>موقعنا يتميز بالهدوء التام مع قربه من الخدمات الرئيسية، ليوفر لك العزلة التي تبحث عنها.</p>
                <a href={venue.maps_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: CHARCOAL, color: '#fff', padding: '12px 24px', borderRadius: 999, fontWeight: 700, fontSize: 14, gap: 8 }}>
                  الاتجاه عبر الخرائط <MapPin size={14} />
                </a>
              </div>
              <div data-fade style={{ ...fade, width: '67%', height: 350, borderRadius: 32, overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                <iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(venue.name + ' ' + (venue.city || ''))}&t=&z=13&ie=UTF8&iwloc=&output=embed`} width="100%" height="100%" style={{ border: 0, filter: 'contrast(0.9) sepia(0.2) hue-rotate(-15deg)' }} allowFullScreen loading="lazy" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* الفوتر */}
      <footer style={{ background: CHARCOAL, color: '#fff', padding: '80px 0 40px', borderRadius: '48px 48px 0 0', marginTop: -32, position: 'relative', zIndex: 20, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 200, background: 'rgba(203,163,150,.1)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div className="or-container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 40, marginBottom: 48, borderBottom: '1px solid rgba(255,255,255,.1)', paddingBottom: 48, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                {logo ? <img src={logo} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${CASHMERE}` }} /> : <Flower2 size={24} color={CASHMERE} />}
                <span style={{ fontWeight: 700, fontSize: 24, color: '#fff' }}>{venue.name}</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, maxWidth: 360, margin: 0 }}>{footerText}</p>
            </div>
            {venue.whatsapp && (
              <a href={`https://wa.me/${venue.whatsapp}`} dir="ltr" style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>+{venue.whatsapp}</a>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,.4)', fontSize: 12, flexWrap: 'wrap', gap: 8 }}>
            <p style={{ margin: 0 }}>© {new Date().getFullYear()} {venue.name}. جميع الحقوق محفوظة.</p>
            <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>صُنع بكل <Heart size={11} fill={CASHMERE} color={CASHMERE} /> على منصة عقار كلاود</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
