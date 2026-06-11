import React from 'react';
import { MapPin, Star, CheckCircle2, Waves, ShieldCheck, Wifi, Car, ArrowLeft, PlayCircle } from 'lucide-react';

/*
  ثيم "المنتجع الفاخر" (resort)
  مستقل تماماً — يستقبل كل البيانات الحقيقية كـ props ويعرضها.
  ألوان ذهبية/زيتونية فخمة. متجاوب للجوال.
*/

const FEATURE_ICONS = {
  'مسبح': Waves, 'واي فاي': Wifi, 'موقف سيارات': Car, 'خصوصية': ShieldCheck,
};

export default function ResortTheme({
  venue,
  accent,
  imgs = [],
  reviews = [],
  youtubeVideos = [],
  getYoutubeId,
  bookingsEnabled,
  onBook,
}) {
  const heroImg = imgs[0] || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1300&q=88';
  const sideImg = imgs[1] || imgs[0];
  const price = venue.price_weekday || venue.price_weekend;
  const features = venue.features || [];
  const customFeatures = venue.custom_features || [];
  const allReviews = reviews.length ? reviews : (venue.google_reviews || []);
  const avgRating = venue.google_rating || '4.9';
  const reviewCount = venue.google_reviews_count || allReviews.length || 0;

  const GOLD = '#b58b3b';
  const GOLD_LIGHT = '#d8b978';

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', ui-rounded, system-ui, sans-serif", color: '#16130f', background: 'linear-gradient(180deg,#fbf6ec,#fffdf8 45%,#f8f0e2)', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        .rt-container{width:min(1200px,calc(100% - 36px));margin-inline:auto}
        .rt-btn{min-height:58px;border:0;cursor:pointer;border-radius:20px;padding:0 28px;display:inline-flex;align-items:center;justify-content:center;gap:10px;font-weight:900;transition:.2s ease;font-family:inherit;font-size:16px}
        .rt-btn:hover{transform:translateY(-2px)}
        .rt-section{padding:64px 0}
        @media (max-width:1050px){.rt-hero-wrap,.rt-exp-grid,.rt-book-zone,.rt-rev-wrap{grid-template-columns:1fr !important}.rt-amenities{grid-template-columns:repeat(2,1fr) !important}}
        @media (max-width:680px){.rt-amenities{grid-template-columns:1fr !important}.rt-side-photo{display:none !important}.rt-main-photo{transform:none !important;height:440px !important}.rt-rev-list{grid-template-columns:1fr !important}.rt-rule-list{grid-template-columns:1fr !important}}
      `}</style>

      {/* ===== HERO ===== */}
      <header style={{ position: 'relative', padding: '80px 0 48px', display: 'flex', alignItems: 'center', minHeight: '90vh' }}>
        <div className="rt-container rt-hero-wrap" style={{ display: 'grid', gridTemplateColumns: '.92fr 1.08fr', gap: 34, alignItems: 'center' }}>
          {/* نص */}
          <div style={{ position: 'relative', zIndex: 3 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#544631', background: 'rgba(255,255,255,.58)', border: '1px solid rgba(72,57,38,.12)', borderRadius: 999, padding: '9px 16px', fontWeight: 900, fontSize: 13, marginBottom: 20 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: accent }} /> ملاذ خاص بطابع المنتجعات
            </div>
            <h1 style={{ margin: 0, fontSize: 'clamp(44px,8vw,96px)', lineHeight: '.98', letterSpacing: '-3px', fontWeight: 900 }}>
              {venue.name}
              {venue.city && <span style={{ display: 'block', fontWeight: 600, color: '#6d604f', fontSize: '.5em', letterSpacing: '-1px', marginTop: 12 }}>{venue.city}</span>}
            </h1>
            {venue.description && (
              <p style={{ fontSize: 18, color: '#5e554b', maxWidth: 600, margin: '24px 0 28px', lineHeight: 1.8 }}>{venue.description}</p>
            )}
            <div style={{ display: 'flex', gap: 13, flexWrap: 'wrap', alignItems: 'center' }}>
              {bookingsEnabled && (
                <button className="rt-btn" onClick={onBook} style={{ background: '#16130f', color: '#fff', boxShadow: '0 18px 34px rgba(22,19,15,.20)' }}>
                  احجز الإقامة <ArrowLeft size={18} />
                </button>
              )}
              {imgs.length > 1 && (
                <a className="rt-btn" href="#rt-gallery" style={{ background: 'rgba(255,255,255,.68)', color: '#201912', border: '1px solid rgba(72,57,38,.11)' }}>
                  شاهد الصور
                </a>
              )}
            </div>
            {reviewCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 34 }}>
                <div style={{ color: GOLD, fontSize: 18, letterSpacing: 2 }}>★★★★★</div>
                <div>
                  <strong style={{ display: 'block', fontSize: 15 }}>{reviewCount} ضيف قيّموا التجربة</strong>
                  <span style={{ display: 'block', color: '#71685f', fontSize: 13 }}>متوسط التقييم {avgRating} من 5</span>
                </div>
              </div>
            )}
          </div>

          {/* صور */}
          <div style={{ position: 'relative', minHeight: 560, display: 'grid', alignItems: 'center' }}>
            <div className="rt-main-photo" style={{ position: 'relative', height: 600, borderRadius: 46, overflow: 'hidden', boxShadow: '0 30px 90px rgba(22,19,15,.18)', border: '1px solid rgba(255,255,255,.52)', transform: 'rotate(-1.5deg)' }}>
              <img src={heroImg} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.55) 100%)' }} />
              <div style={{ position: 'absolute', left: 24, right: 24, bottom: 24, color: '#fff' }}>
                <strong style={{ display: 'block', fontSize: 30, letterSpacing: '-1px' }}>هدوء خاص تحت السماء</strong>
                <span style={{ color: 'rgba(255,255,255,.78)' }}>{venue.city || 'إقامة فاخرة'}</span>
              </div>
            </div>

            {reviewCount > 0 && (
              <div style={{ position: 'absolute', zIndex: 4, top: 50, right: -20, background: 'rgba(255,253,248,.78)', border: '1px solid rgba(255,255,255,.55)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 48px rgba(22,19,15,.14)', borderRadius: 26, padding: '16px 20px', minWidth: 180 }}>
                <div style={{ color: GOLD, letterSpacing: 1, fontSize: 14 }}>★★★★★</div>
                <strong style={{ display: 'block', fontSize: 28 }}>{avgRating}</strong>
                <span style={{ fontSize: 13, color: '#5e554b', fontWeight: 700 }}>تقييم ممتاز</span>
              </div>
            )}

            {price && (
              <div style={{ position: 'absolute', zIndex: 4, left: -20, bottom: 80, background: 'rgba(255,253,248,.78)', border: '1px solid rgba(255,255,255,.55)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 48px rgba(22,19,15,.14)', borderRadius: 26, padding: 18, minWidth: 200 }}>
                <small style={{ display: 'block', color: '#6d6256', fontWeight: 800 }}>ابتداءً من</small>
                <strong style={{ fontSize: 30, letterSpacing: '-1px' }}>{Number(price).toLocaleString('en-US')} ر.س</strong>
                <small style={{ display: 'block', color: '#6d6256', fontWeight: 800 }}>لليلة الواحدة</small>
              </div>
            )}

            {sideImg && imgs.length > 1 && (
              <div className="rt-side-photo" style={{ position: 'absolute', zIndex: 3, width: 200, height: 250, right: -40, bottom: 4, borderRadius: 34, overflow: 'hidden', boxShadow: '0 24px 60px rgba(22,19,15,.20)', border: '8px solid rgba(255,253,248,.86)', transform: 'rotate(4deg)' }}>
                <img src={sideImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===== GALLERY / EXPERIENCE ===== */}
      {imgs.length > 1 && (
        <section id="rt-gallery" className="rt-section">
          <div className="rt-container">
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ margin: 0, fontSize: 'clamp(30px,5vw,52px)', letterSpacing: '-2px' }}>تجربة مصممة كأنها منتجع</h2>
              <p style={{ margin: '10px 0 0', color: '#6c6258', maxWidth: 620 }}>صور المكان كما هي على أرض الواقع.</p>
            </div>
            <div className="rt-exp-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 18 }}>
              <div style={{ minHeight: 480, borderRadius: 40, overflow: 'hidden', position: 'relative', boxShadow: '0 18px 45px rgba(22,19,15,.10)', background: `url("${imgs[1] || heroImg}") center/cover` }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.04),rgba(0,0,0,.70))' }} />
                <div style={{ position: 'absolute', zIndex: 2, inset: 'auto 26px 26px 26px', color: '#fff' }}>
                  <h3 style={{ fontSize: 32, lineHeight: 1.1, margin: '0 0 10px', letterSpacing: '-1px' }}>أجواء لا تُنسى</h3>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,.78)' }}>تفاصيل مدروسة بعناية لراحتك.</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                {imgs.slice(2, 6).map((src, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,.58)', border: '1px solid rgba(72,57,38,.10)', borderRadius: 28, overflow: 'hidden', boxShadow: '0 16px 42px rgba(22,19,15,.07)' }}>
                    <img src={src} alt="" style={{ width: '100%', height: 220, objectFit: 'cover' }} />
                  </div>
                ))}
                {imgs.slice(2, 6).length === 0 && (
                  <div style={{ background: 'rgba(255,255,255,.58)', border: '1px solid rgba(72,57,38,.10)', borderRadius: 28, overflow: 'hidden' }}>
                    <img src={heroImg} alt="" style={{ width: '100%', height: 220, objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== AMENITIES ===== */}
      {(features.length > 0 || customFeatures.length > 0) && (
        <section className="rt-section">
          <div className="rt-container">
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ margin: 0, fontSize: 'clamp(30px,5vw,52px)', letterSpacing: '-2px' }}>الخدمات والمزايا</h2>
            </div>
            <div className="rt-amenities" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 15 }}>
              {features.map((f, i) => {
                const Icon = FEATURE_ICONS[f] || CheckCircle2;
                return (
                  <article key={i} style={{ position: 'relative', minHeight: 180, padding: 22, borderRadius: 30, background: 'linear-gradient(180deg,rgba(255,255,255,.74),rgba(255,255,255,.48))', border: '1px solid rgba(72,57,38,.11)', boxShadow: '0 18px 46px rgba(22,19,15,.07)', overflow: 'hidden' }}>
                    <div style={{ width: 56, height: 56, display: 'grid', placeItems: 'center', borderRadius: 20, background: '#172419', color: GOLD_LIGHT, marginBottom: 18 }}>
                      <Icon size={24} />
                    </div>
                    <h3 style={{ margin: '0 0 6px', fontSize: 19 }}>{f}</h3>
                  </article>
                );
              })}
              {customFeatures.map((cf, i) => (
                <article key={`c${i}`} style={{ position: 'relative', minHeight: 180, padding: 22, borderRadius: 30, background: 'linear-gradient(180deg,rgba(255,255,255,.74),rgba(255,255,255,.48))', border: '1px solid rgba(72,57,38,.11)', boxShadow: '0 18px 46px rgba(22,19,15,.07)' }}>
                  <div style={{ width: 56, height: 56, display: 'grid', placeItems: 'center', borderRadius: 20, background: '#172419', color: GOLD_LIGHT, marginBottom: 18 }}>
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 style={{ margin: '0 0 6px', fontSize: 19 }}>{cf.label}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== VIDEO ===== */}
      {youtubeVideos.length > 0 && (
        <section className="rt-section">
          <div className="rt-container">
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ margin: 0, fontSize: 'clamp(30px,5vw,52px)', letterSpacing: '-2px' }}>جولة مرئية</h2>
            </div>
            <div style={{ borderRadius: 40, overflow: 'hidden', boxShadow: '0 30px 90px rgba(22,19,15,.18)', aspectRatio: '16/9', background: '#000' }}>
              <iframe src={`https://www.youtube.com/embed/${getYoutubeId(youtubeVideos[0])}?rel=0`} style={{ width: '100%', height: '100%', border: 0 }} allowFullScreen title="جولة" />
            </div>
          </div>
        </section>
      )}

      {/* ===== STAY / BOOKING ===== */}
      <section className="rt-section">
        <div className="rt-container">
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ margin: 0, fontSize: 'clamp(30px,5vw,52px)', letterSpacing: '-2px' }}>تفاصيل الإقامة</h2>
          </div>
          <div className="rt-book-zone" style={{ display: 'grid', gridTemplateColumns: '.95fr 1.05fr', gap: 22, alignItems: 'start' }}>
            {/* بطاقة الحجز */}
            <aside style={{ background: '#172419', color: '#fff', borderRadius: 40, padding: 28, boxShadow: '0 30px 90px rgba(23,36,25,.24)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 22 }}>
                  <div>
                    <h3 style={{ fontSize: 26, margin: '0 0 6px', letterSpacing: '-.8px' }}>احجز {venue.name}</h3>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,.66)' }}>تواريخ مرنة وتجربة وصول سهلة.</p>
                  </div>
                  {price && (
                    <div style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                      <strong style={{ display: 'block', fontSize: 32, lineHeight: 1 }}>{Number(price).toLocaleString('en-US')}</strong>
                      <span style={{ color: 'rgba(255,255,255,.62)', fontSize: 13, fontWeight: 800 }}>ر.س / ليلة</span>
                    </div>
                  )}
                </div>
                {venue.price_weekday && venue.price_weekend && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    <div style={{ border: '1px solid rgba(255,255,255,.13)', background: 'rgba(255,255,255,.08)', borderRadius: 18, padding: 13 }}>
                      <div style={{ fontSize: 12, color: GOLD_LIGHT, fontWeight: 900 }}>أيام الأسبوع</div>
                      <div style={{ fontWeight: 900 }}>{Number(venue.price_weekday).toLocaleString('en-US')} ر.س</div>
                    </div>
                    <div style={{ border: '1px solid rgba(255,255,255,.13)', background: 'rgba(255,255,255,.08)', borderRadius: 18, padding: 13 }}>
                      <div style={{ fontSize: 12, color: GOLD_LIGHT, fontWeight: 900 }}>نهاية الأسبوع</div>
                      <div style={{ fontWeight: 900 }}>{Number(venue.price_weekend).toLocaleString('en-US')} ر.س</div>
                    </div>
                  </div>
                )}
                {bookingsEnabled && (
                  <button onClick={onBook} style={{ width: '100%', minHeight: 58, border: 0, borderRadius: 22, cursor: 'pointer', background: `linear-gradient(135deg,${GOLD_LIGHT},${GOLD})`, color: '#20170c', fontWeight: 900, fontSize: 16, fontFamily: 'inherit', boxShadow: '0 18px 35px rgba(181,139,59,.20)' }}>
                    طلب الحجز الآن
                  </button>
                )}
              </div>
            </aside>

            {/* تفاصيل */}
            <div style={{ display: 'grid', gap: 16 }}>
              {venue.description && (
                <article style={{ padding: 24, borderRadius: 32, background: 'rgba(255,255,255,.60)', border: '1px solid rgba(72,57,38,.10)', boxShadow: '0 16px 42px rgba(22,19,15,.06)' }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: 22, letterSpacing: '-.5px' }}>وصف المكان</h3>
                  <p style={{ margin: 0, color: '#62584e' }}>{venue.description}</p>
                </article>
              )}
              {(features.length > 0) && (
                <article style={{ padding: 24, borderRadius: 32, background: 'rgba(255,255,255,.60)', border: '1px solid rgba(72,57,38,.10)', boxShadow: '0 16px 42px rgba(22,19,15,.06)' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: 22, letterSpacing: '-.5px' }}>ماذا يوجد في الشاليه؟</h3>
                  <div className="rt-rule-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                    {features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 12px', background: '#fff', border: '1px solid rgba(72,57,38,.14)', borderRadius: 18, fontWeight: 800, color: '#433a31', fontSize: 14 }}>
                        <CheckCircle2 size={18} color="#526343" /> {f}
                      </div>
                    ))}
                  </div>
                </article>
              )}
              {venue.booking_terms && (
                <article style={{ padding: 24, borderRadius: 32, background: 'rgba(255,255,255,.60)', border: '1px solid rgba(72,57,38,.10)', boxShadow: '0 16px 42px rgba(22,19,15,.06)' }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: 22, letterSpacing: '-.5px' }}>شروط الحجز</h3>
                  <p style={{ margin: 0, color: '#62584e', whiteSpace: 'pre-wrap' }}>{venue.booking_terms}</p>
                </article>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      {allReviews.length > 0 && (
        <section className="rt-section">
          <div className="rt-container">
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ margin: 0, fontSize: 'clamp(30px,5vw,52px)', letterSpacing: '-2px' }}>كلام العملاء</h2>
            </div>
            <div className="rt-rev-wrap" style={{ display: 'grid', gridTemplateColumns: '.75fr 1.25fr', gap: 22, alignItems: 'stretch' }}>
              <aside style={{ borderRadius: 40, padding: 30, background: 'linear-gradient(180deg,rgba(23,36,25,.92),rgba(23,36,25,.82))', color: '#fff', boxShadow: '0 18px 45px rgba(22,19,15,.10)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 360 }}>
                <div>
                  <div style={{ color: GOLD_LIGHT, letterSpacing: 2 }}>★★★★★</div>
                  <strong style={{ fontSize: 70, lineHeight: 1, display: 'block' }}>{avgRating}</strong>
                  <h3 style={{ fontSize: 28, margin: '12px 0 8px', letterSpacing: '-.8px' }}>تجربة استثنائية</h3>
                  <p style={{ color: 'rgba(255,255,255,.70)', margin: 0 }}>نظافة، خصوصية، وجمال المكان.</p>
                </div>
                {reviewCount > 0 && <span style={{ color: 'rgba(255,255,255,.6)' }}>بناءً على {reviewCount} تقييم</span>}
              </aside>
              <div className="rt-rev-list" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                {allReviews.slice(0, 4).map((r, i) => (
                  <article key={i} style={{ background: 'rgba(255,255,255,.65)', border: '1px solid rgba(72,57,38,.10)', borderRadius: 28, padding: 22, boxShadow: '0 16px 42px rgba(22,19,15,.06)' }}>
                    <div style={{ color: GOLD, letterSpacing: 1 }}>{'★'.repeat(r.rating || 5)}</div>
                    <p style={{ color: '#554c43', margin: '13px 0 18px' }}>{r.text}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                        {(r.author || 'ض').charAt(0)}
                      </div>
                      <div><strong style={{ display: 'block' }}>{r.author || 'ضيف'}</strong><span style={{ fontSize: 13, color: '#71685f' }}>تقييم موثّق</span></div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== LOCATION ===== */}
      {venue.maps_url && (
        <section className="rt-section">
          <div className="rt-container">
            <div style={{ borderRadius: 42, minHeight: 340, overflow: 'hidden', position: 'relative', background: `linear-gradient(90deg,rgba(22,19,15,.84),rgba(22,19,15,.16)),url("${heroImg}") center/cover`, boxShadow: '0 30px 90px rgba(22,19,15,.18)', display: 'flex', alignItems: 'flex-end', padding: 34, color: '#fff' }}>
              <div>
                <h2 style={{ fontSize: 40, lineHeight: 1.08, margin: '0 0 10px', letterSpacing: '-1.5px' }}>{venue.city || 'الموقع'}</h2>
                <p style={{ maxWidth: 560, color: 'rgba(255,255,255,.78)', margin: '0 0 20px' }}>موقع هادئ وسهل الوصول.</p>
                <a className="rt-btn" href={venue.maps_url} target="_blank" rel="noreferrer" style={{ background: 'rgba(255,255,255,.16)', border: '1px solid rgba(255,255,255,.22)', color: '#fff', backdropFilter: 'blur(14px)' }}>
                  <MapPin size={18} /> فتح في خرائط جوجل
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== FOOTER ===== */}
      <footer style={{ padding: '34px 0 46px', color: '#665d52' }}>
        <div className="rt-container" style={{ borderTop: '1px solid rgba(72,57,38,.12)', paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontSize: 14 }}>
          <div>© 2026 {venue.name} — إقامة خاصة بطابع عالمي.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#b8ac9c', letterSpacing: 2 }}>Powered by Aqar Cloud</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
