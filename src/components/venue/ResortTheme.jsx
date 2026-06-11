import React, { useEffect } from 'react';
import { MapPin, Star, CheckCircle2, Waves, Bed, Leaf, UtensilsCrossed, Car, ArrowLeft, Quote, Gem } from 'lucide-react';

/*
  ثيم "فيروز" — تيل فاخر داكن + ذهبي، خط Readex Pro.
  مستقل تماماً، يستقبل بيانات الشاليه الحقيقية كـ props.
*/

const TEAL = '#0A2629';
const SOFT = '#E8F0F0';
const GOLD = '#D4B982';
const MUTED = '#8DA3A5';

const FEATURE_ICONS = {
  'مسبح': Waves, 'غرف نوم': Bed, 'حديقة': Leaf, 'مطبخ': UtensilsCrossed, 'موقف سيارات': Car,
};

export default function ResortTheme({
  venue, imgs = [], reviews = [], youtubeVideos = [], getYoutubeId,
  bookingsEnabled, onBook,
}) {
  const heroImg = imgs[0] || 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80';
  const features = venue.features || [];
  const customFeatures = venue.custom_features || [];
  const allReviews = reviews.length ? reviews : (venue.google_reviews || []);
  const avgRating = venue.google_rating || '4.9';
  const reviewCount = venue.google_reviews_count || allReviews.length || 0;
  const galleryImgs = imgs.slice(0, 6);
  const ytId = youtubeVideos.length ? getYoutubeId(youtubeVideos[0]) : null;

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translate(0)'; obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const reveal = (dir = 'up', delay = 0) => ({
    opacity: 0,
    transform: dir === 'left' ? 'translateX(50px)' : dir === 'right' ? 'translateX(-50px)' : 'translateY(40px)',
    transition: `all 1s cubic-bezier(0.25,1,0.5,1) ${delay}ms`,
  });

  return (
    <div dir="rtl" style={{ fontFamily: "'Readex Pro', sans-serif", color: TEAL, background: '#fff', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&display=swap');
        .fz-zoom img{transition:transform 1.5s ease}
        .fz-zoom:hover img{transform:scale(1.08)}
        .fz-container{max-width:1280px;margin-inline:auto;padding-inline:24px}
        @media(min-width:1024px){.fz-container{padding-inline:48px}}
        .fz-card-hover:hover{background:rgba(255,255,255,.1)!important}
        @media(max-width:1023px){
          .fz-hero{flex-direction:column!important}
          .fz-hero-text,.fz-hero-img{width:100%!important;height:auto!important}
          .fz-hero-img{height:60vh!important}
          .fz-about{flex-direction:column!important;gap:80px!important}
          .fz-about>div{width:100%!important}
          .fz-loc{flex-direction:column!important}
          .fz-loc>div{width:100%!important}
          .fz-grid{grid-template-columns:1fr!important;grid-auto-rows:280px!important}
          .fz-grid>div{grid-column:auto!important;grid-row:auto!important}
        }
      `}</style>

      {/* زر واتساب عائم */}
      {venue.whatsapp && (
        <a href={`https://wa.me/${venue.whatsapp}`} target="_blank" rel="noreferrer"
          style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 40, background: TEAL, color: '#fff', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: '0 30px 60px -15px rgba(10,38,41,.4)' }}>
          <i className="fab fa-whatsapp" />
          <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.6.2-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5-.1-.2-.6-1.5-.9-2-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2z" /></svg>
        </a>
      )}

      {/* الهيدر */}
      <header style={{ position: 'fixed', width: '100%', top: 0, zIndex: 40, background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${SOFT}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: TEAL, color: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, transform: 'rotate(45deg)' }}>
              <Gem size={18} style={{ transform: 'rotate(-45deg)' }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: 2 }}>{venue.name}</span>
          </div>
          {bookingsEnabled && (
            <button onClick={onBook} style={{ background: TEAL, color: '#fff', border: 0, padding: '12px 24px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
              احجز الآن <ArrowLeft size={16} />
            </button>
          )}
        </div>
      </header>

      {/* الهيرو */}
      <section className="fz-hero" style={{ display: 'flex', minHeight: '100vh', paddingTop: 80 }}>
        <div className="fz-hero-text" data-reveal style={{ ...reveal('right'), width: '42%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 64px', background: '#fff', zIndex: 10 }}>
          <p style={{ color: GOLD, fontWeight: 500, letterSpacing: '.2em', fontSize: 13, marginBottom: 24 }}>ملاذ النخبة</p>
          <h1 style={{ fontSize: 'clamp(40px,6vw,72px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 32 }}>
            {venue.name}<br />
            {venue.city && <span style={{ color: GOLD }}>{venue.city}</span>}
          </h1>
          {venue.description && <p style={{ color: MUTED, fontSize: 18, lineHeight: 1.8, marginBottom: 40, maxWidth: 440 }}>{venue.description}</p>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            {bookingsEnabled && (
              <button onClick={onBook} style={{ background: TEAL, color: '#fff', border: 0, padding: '16px 32px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 12 }}>
                احجز الآن <ArrowLeft size={18} />
              </button>
            )}
            <div style={{ display: 'flex', gap: 4, color: GOLD, fontSize: 18 }}>★★★★★</div>
          </div>
        </div>
        <div className="fz-hero-img fz-zoom" data-reveal style={{ ...reveal('left'), width: '58%', height: '100vh', position: 'relative', overflow: 'hidden' }}>
          <img src={heroImg} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,38,41,.1)' }} />
        </div>
      </section>

      {/* فلسفتنا / المميزات */}
      {(features.length > 0 || customFeatures.length > 0) && (
        <section style={{ padding: '128px 0', background: SOFT, position: 'relative', overflow: 'hidden' }}>
          <div className="fz-container" style={{ position: 'relative', zIndex: 10 }}>
            <div className="fz-about" style={{ display: 'flex', gap: 80, alignItems: 'center' }}>
              <div style={{ width: '50%', position: 'relative' }}>
                {imgs[1] && (
                  <div className="fz-zoom" data-reveal style={{ ...reveal('up'), width: '80%', marginInlineStart: 'auto', boxShadow: '0 30px 60px -15px rgba(10,38,41,.15)', overflow: 'hidden' }}>
                    <img src={imgs[1]} alt="" style={{ width: '100%', display: 'block' }} />
                  </div>
                )}
                {imgs[2] && (
                  <div className="fz-zoom" data-reveal style={{ ...reveal('up', 200), width: '60%', position: 'absolute', bottom: -64, insetInlineStart: 0, boxShadow: '0 30px 60px -15px rgba(10,38,41,.15)', border: `8px solid ${SOFT}`, overflow: 'hidden' }}>
                    <img src={imgs[2]} alt="" style={{ width: '100%', display: 'block' }} />
                  </div>
                )}
              </div>
              <div style={{ width: '50%' }} data-reveal>
                <h2 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 700, marginBottom: 32, lineHeight: 1.2 }}>تفاصيل تُرى،<br />وراحة تُحس.</h2>
                {venue.description && <p style={{ color: MUTED, fontSize: 18, lineHeight: 1.8, marginBottom: 48 }}>{venue.description}</p>}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '48px 32px' }}>
                  {features.map((f, i) => {
                    const Icon = FEATURE_ICONS[f] || CheckCircle2;
                    return (
                      <div key={i}>
                        <div style={{ color: GOLD, fontSize: 28, marginBottom: 16 }}><Icon size={30} /></div>
                        <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{f}</h3>
                      </div>
                    );
                  })}
                  {customFeatures.map((cf, i) => (
                    <div key={`c${i}`}>
                      <div style={{ color: GOLD, fontSize: 28, marginBottom: 16 }}><CheckCircle2 size={30} /></div>
                      <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{cf.label}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* المعرض */}
      {galleryImgs.length > 1 && (
        <section style={{ padding: '128px 0', background: '#fff' }}>
          <div className="fz-container">
            <div data-reveal style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <p style={{ color: GOLD, fontWeight: 500, letterSpacing: '.2em', fontSize: 13, marginBottom: 12 }}>عدسة المكان</p>
                <h2 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 700 }}>جولة بصرية.</h2>
              </div>
              <p style={{ color: MUTED, maxWidth: 320, fontSize: 14, borderInlineEnd: `2px solid ${GOLD}`, paddingInlineEnd: 16 }}>تصفح أرجاء المكان وتعرّف على مستوى الفخامة الذي ينتظرك.</p>
            </div>
            <div className="fz-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 24, gridAutoRows: 350 }}>
              {galleryImgs[0] && <div className="fz-zoom" data-reveal style={{ ...reveal('up'), gridColumn: 'span 8', gridRow: 'span 2', overflow: 'hidden', position: 'relative' }}><img src={galleryImgs[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
              {galleryImgs[1] && <div className="fz-zoom" data-reveal style={{ ...reveal('up', 100), gridColumn: 'span 4', overflow: 'hidden' }}><img src={galleryImgs[1]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
              {galleryImgs[2] && <div className="fz-zoom" data-reveal style={{ ...reveal('up', 200), gridColumn: 'span 4', overflow: 'hidden' }}><img src={galleryImgs[2]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
              {galleryImgs[3] && <div className="fz-zoom" data-reveal style={{ ...reveal('up'), gridColumn: 'span 12', overflow: 'hidden', marginTop: 24 }}><img src={galleryImgs[3]} alt="" style={{ width: '100%', height: 350, objectFit: 'cover' }} /></div>}
            </div>
          </div>
        </section>
      )}

      {/* الفيديو */}
      {ytId && (
        <section style={{ padding: '128px 0', background: SOFT, borderTop: '1px solid rgba(10,38,41,.05)' }}>
          <div className="fz-container">
            <div data-reveal style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <p style={{ color: GOLD, fontWeight: 500, letterSpacing: '.2em', fontSize: 13, marginBottom: 12 }}>تجربة حية</p>
                <h2 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 700 }}>جولة مرئية.</h2>
              </div>
            </div>
            <div data-reveal style={{ width: '100%', aspectRatio: '16/9', borderRadius: 32, overflow: 'hidden', boxShadow: '0 30px 60px -15px rgba(10,38,41,.15)', border: '8px solid #fff', background: TEAL }}>
              <iframe src={`https://www.youtube.com/embed/${ytId}`} title="جولة" style={{ width: '100%', height: '100%', border: 0 }} allowFullScreen />
            </div>
          </div>
        </section>
      )}

      {/* التقييمات */}
      {allReviews.length > 0 && (
        <section style={{ padding: '128px 0', background: TEAL, color: '#fff' }}>
          <div className="fz-container">
            <div data-reveal style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 80, flexWrap: 'wrap', gap: 32 }}>
              <div>
                <h2 style={{ color: GOLD, fontWeight: 500, letterSpacing: '.15em', fontSize: 13, marginBottom: 16 }}>تقييمات موثقة من جوجل</h2>
                <h3 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 700 }}>تجارب ضيوفنا.</h3>
              </div>
              <div style={{ background: 'rgba(255,255,255,.05)', padding: 24, border: '1px solid rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', gap: 24 }}>
                <div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: GOLD, marginBottom: 4 }}>{avgRating}<span style={{ fontSize: 18, color: 'rgba(255,255,255,.5)', fontWeight: 400 }}>/5</span></div>
                  {reviewCount > 0 && <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 12 }}>من {reviewCount} تقييم</p>}
                </div>
                <div style={{ color: GOLD, fontSize: 14 }}>★★★★★</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 32 }}>
              {allReviews.slice(0, 3).map((r, i) => (
                <div key={i} className="fz-card-hover" data-reveal style={{ ...reveal('up', i * 100), background: 'rgba(255,255,255,.05)', padding: 40, border: '1px solid rgba(255,255,255,.1)', position: 'relative', transition: 'background .3s' }}>
                  <Quote size={48} style={{ position: 'absolute', top: 32, insetInlineStart: 32, color: 'rgba(255,255,255,.05)' }} />
                  <p style={{ color: 'rgba(232,240,240,.9)', fontSize: 18, lineHeight: 1.8, marginBottom: 40, fontWeight: 300, position: 'relative', zIndex: 1 }}>"{r.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 48, height: 48, background: GOLD, color: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20 }}>{(r.author || 'ض').charAt(0)}</div>
                    <div>
                      <h4 style={{ fontWeight: 700, color: '#fff' }}>{r.author || 'ضيف'}</h4>
                      <span style={{ color: 'rgba(255,255,255,.4)', fontSize: 12 }}>تقييم موثّق</span>
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
        <section className="fz-loc" style={{ display: 'flex', background: '#fff', borderTop: `1px solid ${SOFT}` }}>
          <div data-reveal style={{ ...reveal('right'), width: '50%', padding: '96px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ color: GOLD, fontWeight: 500, letterSpacing: '.2em', fontSize: 13, marginBottom: 16 }}>الموقع</h2>
            <h3 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, marginBottom: 24 }}>سهولة الوصول.</h3>
            <p style={{ color: MUTED, fontSize: 18, lineHeight: 1.8, marginBottom: 40 }}>يقع في منطقة راقية وهادئة، تمنحك العزلة المطلوبة للراحة مع سهولة الوصول.</p>
            <div style={{ borderTop: `1px solid ${SOFT}`, paddingTop: 32, marginBottom: 48, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {venue.city && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <MapPin size={22} color={GOLD} />
                  <span style={{ fontWeight: 700 }}>{venue.city}</span>
                </div>
              )}
            </div>
            <a href={venue.maps_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: TEAL, color: '#fff', padding: '16px 32px', fontWeight: 500, gap: 12, width: 'max-content' }}>
              فتح خرائط جوجل <ArrowLeft size={18} />
            </a>
          </div>
          <div data-reveal style={{ ...reveal('left'), width: '50%', minHeight: 500 }}>
            <iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(venue.name + ' ' + (venue.city || ''))}&t=&z=13&ie=UTF8&iwloc=&output=embed`} width="100%" height="100%" style={{ border: 0, filter: 'grayscale(80%) contrast(1.2)', minHeight: 500 }} allowFullScreen loading="lazy" />
          </div>
        </section>
      )}

      {/* الفوتر */}
      <footer style={{ background: SOFT, color: TEAL, padding: '96px 0 48px' }}>
        <div className="fz-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 48, marginBottom: 64, borderBottom: '1px solid rgba(10,38,41,.1)', paddingBottom: 64, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, background: TEAL, color: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, transform: 'rotate(45deg)' }}>
                  <Gem size={18} style={{ transform: 'rotate(-45deg)' }} />
                </div>
                <span style={{ fontWeight: 700, fontSize: 28, letterSpacing: 2 }}>{venue.name}</span>
              </div>
              <p style={{ color: MUTED, maxWidth: 360, fontSize: 18 }}>رؤية جديدة لمفهوم الضيافة الخاصة، حيث يلتقي رقي التصميم براحة المكان.</p>
            </div>
            {venue.whatsapp && (
              <a href={`https://wa.me/${venue.whatsapp}`} dir="ltr" style={{ fontSize: 24, fontWeight: 700 }}>+{venue.whatsapp}</a>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: MUTED, fontSize: 14, flexWrap: 'wrap', gap: 8 }}>
            <p>© 2026 {venue.name}. جميع الحقوق محفوظة.</p>
            <p>Powered by Aqar Cloud</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
