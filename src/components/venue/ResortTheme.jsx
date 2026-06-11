import React, { useEffect, useState } from 'react';
import { MapPin, Star, CheckCircle2, Waves, Bed, Leaf, UtensilsCrossed, Car, ArrowLeft, Quote, Gem, Heart, Wifi, ShieldCheck, Play, Camera, Calendar, ChevronDown } from 'lucide-react';
import VenueCalendar from './VenueCalendar';

/*
  ثيم "الريم" الفاخر — تصميم بانورامي ذهبي/زيتوني، خط Tajawal.
  مربوط بالكامل ببيانات الشاليه الحقيقية. التقييم يبرز فقط إذا 4.5+.
*/

const INK='#16130f', MUTED='#71685f', CREAM='#f5efe4', SAND='#d8b978', SAND_DARK='#a8823e', OLIVE='#526343', FOREST='#172419', LINE='rgba(72,57,38,.14)';

const FEATURE_ICONS = {
  'مسبح': Waves, 'غرف نوم': Bed, 'حديقة': Leaf, 'مطبخ': UtensilsCrossed,
  'موقف سيارات': Car, 'واي فاي': Wifi, 'خصوصية': ShieldCheck,
};

export default function ResortTheme({
  venue, imgs = [], logo = '', reviews = [], youtubeVideos = [], getYoutubeId,
  bookingsEnabled, onBook,
  bookingForm = {}, setBookingForm = () => {}, bookedDates = [], accent = '#b58b3b',
}) {
  const [calOpen, setCalOpen] = useState(false);
  const heroImg = imgs[0] || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=88';
  const features = venue.features || [];
  const customFeatures = venue.custom_features || [];
  const allReviews = reviews.length ? reviews : (venue.google_reviews || []);
  const price = venue.price_weekday || venue.price_weekend;

  // منطق التقييم: يبرز فقط إذا 4.5 فأعلى
  const ratingNum = parseFloat(venue.google_rating) || 0;
  const showRating = ratingNum >= 4.5;
  const reviewCount = venue.google_reviews_count || 0;
  const ytId = youtubeVideos.length ? getYoutubeId(youtubeVideos[0]) : null;

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'none'; obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-rv]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const rv = { opacity: 0, transform: 'translateY(30px)', transition: 'all .9s cubic-bezier(0.16,1,0.3,1)' };

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif", color: INK, lineHeight: 1.8, background: 'linear-gradient(180deg,#fbf6ec,#fffdf8 45%,#f8f0e2)', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        .rm-container{width:min(1200px,calc(100% - 36px));margin-inline:auto}
        .rm-card-hover{transition:transform .3s ease}
        .rm-card-hover:hover{transform:translateY(-5px)}
        @media(max-width:1050px){
          .rm-pano-content,.rm-exp,.rm-book,.rm-rev{grid-template-columns:1fr!important}
          .rm-amenities{grid-template-columns:repeat(2,1fr)!important}
          .rm-reservation{position:relative!important;top:auto!important}
        }
        @media(max-width:680px){
          .rm-amenities,.rm-mosaic,.rm-rule,.rm-revlist{grid-template-columns:1fr!important}
          .rm-pano-img{height:340px!important;border-radius:28px!important;min-height:auto!important}
          .rm-section{padding:48px 0!important}
        }
      `}</style>

      {/* واتساب عائم */}
      {venue.whatsapp && (
        <a href={`https://wa.me/${venue.whatsapp}`} target="_blank" rel="noreferrer"
          style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 40, background: FOREST, color: '#fff', width: 58, height: 58, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 18px 45px rgba(23,36,25,.3)' }}>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.6.2-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5-.1-.2-.6-1.5-.9-2-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2z" /></svg>
        </a>
      )}

      {/* الهيدر */}
      <div style={{ position: 'fixed', top: 18, left: 0, right: 0, zIndex: 50 }}>
        <nav className="rm-container" style={{ background: 'rgba(255,253,248,.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,.6)', borderRadius: 100, boxShadow: '0 10px 40px rgba(0,0,0,.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px 10px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 20, color: FOREST }}>
            {logo ? (
              <img src={logo} alt={venue.name} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${SAND}` }} />
            ) : (
              <span style={{ width: 42, height: 42, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: SAND, color: '#fff' }}><Leaf size={18} /></span>
            )}
            <span>{venue.name}</span>
          </div>
          {bookingsEnabled && (
            <button onClick={onBook} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 46, padding: '0 24px', borderRadius: 100, background: FOREST, color: '#fff', fontWeight: 700, fontSize: 15, border: 0, cursor: 'pointer', fontFamily: 'inherit' }}>
              احجز الإقامة
            </button>
          )}
        </nav>
      </div>

      {/* الهيرو البانورامي */}
      <header style={{ position: 'relative', padding: '120px 0 60px' }}>
        <div className="rm-container">
          <div className="rm-pano-img" style={{ position: 'relative', width: '100%', height: '65vh', minHeight: 500, borderRadius: 46, overflow: 'hidden', boxShadow: '0 30px 90px rgba(22,19,15,.18)', border: '1px solid rgba(255,255,255,.6)' }}>
            <img src={heroImg} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.5) 100%)' }} />

            {showRating && (
              <div style={{ position: 'absolute', top: 30, right: 30, background: 'rgba(255,253,248,.85)', border: '1px solid rgba(255,255,255,.8)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 48px rgba(22,19,15,.14)', borderRadius: 24, padding: '20px 24px', minWidth: 180, textAlign: 'center' }}>
                <div style={{ color: '#c49135', fontSize: 16, marginBottom: 4 }}>★★★★★</div>
                <strong style={{ display: 'block', fontSize: 32, fontWeight: 900, color: FOREST, lineHeight: 1.2 }}>{venue.google_rating}</strong>
                <span style={{ fontSize: 13, color: '#5e554b', fontWeight: 700 }}>تقييم ممتاز من العملاء</span>
              </div>
            )}

            {price && (
              <div style={{ position: 'absolute', left: 30, bottom: 30, background: 'rgba(255,253,248,.85)', border: '1px solid rgba(255,255,255,.8)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 48px rgba(22,19,15,.14)', borderRadius: 24, padding: '20px 24px', minWidth: 200 }}>
                <small style={{ display: 'block', color: '#6d6256', fontWeight: 700, fontSize: 13 }}>ابتداءً من</small>
                <strong style={{ fontSize: 36, fontWeight: 900, color: FOREST, display: 'block', margin: '2px 0' }}>{Number(price).toLocaleString('en-US')} ر.س</strong>
                <small style={{ display: 'block', color: '#6d6256', fontWeight: 700, fontSize: 13 }}>لليلة الواحدة</small>
              </div>
            )}
          </div>

          <div className="rm-pano-content" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 40, marginTop: 40, alignItems: 'start' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 'clamp(40px,6vw,72px)', lineHeight: 1.1, fontWeight: 900, color: FOREST }}>
                {venue.name}
                {venue.city && <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, color: '#6d604f', fontSize: 28, marginTop: 14 }}><MapPin size={24} color={SAND_DARK} /> {venue.city}</span>}
              </h1>
            </div>
            <div>
              {venue.description && <p style={{ fontSize: 18, color: '#5e554b', maxWidth: 610, margin: '0 0 32px', fontWeight: 500 }}>{venue.description}</p>}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                {bookingsEnabled && (
                  <button onClick={onBook} style={{ height: 56, border: 0, cursor: 'pointer', borderRadius: 18, padding: '0 28px', display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 16, background: INK, color: '#fff', fontFamily: 'inherit' }}>
                    احجز الآن <ArrowLeft size={18} />
                  </button>
                )}
                {ytId && (
                  <a href="#rm-video" style={{ height: 56, borderRadius: 18, padding: '0 28px', display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 16, background: 'rgba(255,255,255,.8)', color: '#201912', border: '1px solid rgba(72,57,38,.11)' }}>
                    شاهد الجولة <Play size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* الفيديو */}
        {ytId && (
          <section id="rm-video" className="rm-section" style={{ padding: '80px 0' }}>
            <div className="rm-container">
              <SectionTitle title="الجولة المرئية" desc="اكتشف تفاصيل المكان وأجواءه عبر هذه الجولة القصيرة." tag={<><Play size={13} /> فيديو تعريفي</>} rv={rv} />
              <div data-rv style={{ ...rv, position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 40, boxShadow: '0 30px 90px rgba(22,19,15,.18)', border: '1px solid rgba(255,255,255,.6)', background: INK }}>
                <iframe style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`} title="جولة" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            </div>
          </section>
        )}

        {/* المعرض */}
        {imgs.length > 1 && (
          <section className="rm-section" style={{ padding: '80px 0' }}>
            <div className="rm-container">
              <SectionTitle title="معرض الصور" desc="لقطات من زوايا المكان تبرز اهتمامنا بالتفاصيل." tag={<><Camera size={13} /> صور مختارة</>} rv={rv} />
              <div className="rm-exp" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <article data-rv style={{ ...rv, minHeight: 520, borderRadius: 40, overflow: 'hidden', position: 'relative', boxShadow: '0 18px 45px rgba(22,19,15,.10)', background: `url("${imgs[0]}") center/cover` }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.80))' }} />
                  <div style={{ position: 'absolute', zIndex: 2, inset: 'auto 30px 30px 30px', color: '#fff' }}>
                    <h3 style={{ fontSize: 32, lineHeight: 1.2, margin: '0 0 12px', fontWeight: 800 }}>أجواء لا تُنسى</h3>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,.8)', maxWidth: 520, fontSize: 16, fontWeight: 500 }}>تفاصيل مدروسة بعناية لتمنحك أرقى تجربة إقامة.</p>
                  </div>
                </article>
                <div className="rm-mosaic" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  {imgs.slice(1, 5).map((src, i) => (
                    <article key={i} className="rm-card-hover" data-rv style={{ ...rv, background: 'rgba(255,255,255,.7)', border: '1px solid rgba(72,57,38,.10)', borderRadius: 32, overflow: 'hidden', boxShadow: '0 16px 42px rgba(22,19,15,.05)' }}>
                      <img src={src} alt="" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* الخدمات */}
        {(features.length > 0 || customFeatures.length > 0) && (
          <section className="rm-section" style={{ padding: '80px 0' }}>
            <div className="rm-container">
              <SectionTitle title="خدمات صُممت لأجلك" desc="اهتممنا بأدق التفاصيل لنوفر لك إقامة متكاملة بكل رقي." rv={rv} />
              <div className="rm-amenities" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
                {features.map((f, i) => {
                  const Icon = FEATURE_ICONS[f] || CheckCircle2;
                  return (
                    <article key={i} className="rm-card-hover" data-rv style={{ ...rv, position: 'relative', minHeight: 200, padding: 24, borderRadius: 32, background: 'linear-gradient(180deg,rgba(255,255,255,.8),rgba(255,255,255,.5))', border: '1px solid rgba(72,57,38,.11)', boxShadow: '0 18px 46px rgba(22,19,15,.05)', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', left: -45, bottom: -45, width: 130, height: 130, borderRadius: '50%', background: 'rgba(216,185,120,.15)' }} />
                      <div style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, background: FOREST, color: SAND, marginBottom: 24, position: 'relative' }}><Icon size={24} /></div>
                      <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: FOREST, position: 'relative' }}>{f}</h3>
                    </article>
                  );
                })}
                {customFeatures.map((cf, i) => (
                  <article key={`c${i}`} className="rm-card-hover" data-rv style={{ ...rv, position: 'relative', minHeight: 200, padding: 24, borderRadius: 32, background: 'linear-gradient(180deg,rgba(255,255,255,.8),rgba(255,255,255,.5))', border: '1px solid rgba(72,57,38,.11)', boxShadow: '0 18px 46px rgba(22,19,15,.05)', overflow: 'hidden' }}>
                    <div style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, background: FOREST, color: SAND, marginBottom: 24 }}><CheckCircle2 size={24} /></div>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: FOREST }}>{cf.label}</h3>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* الحجز والتفاصيل */}
        <section className="rm-section" style={{ padding: '80px 0' }}>
          <div className="rm-container">
            <SectionTitle title="تفاصيل الإقامة والحجز" desc="احجز مساحتك الخاصة بخطوات بسيطة وواضحة." rv={rv} />
            <div className="rm-book" style={{ display: 'grid', gridTemplateColumns: '.95fr 1.05fr', gap: 30, alignItems: 'start' }}>
              <aside className="rm-reservation" data-rv style={{ ...rv, background: FOREST, color: '#fff', borderRadius: 40, padding: 36, boxShadow: '0 30px 90px rgba(23,36,25,.24)', position: 'sticky', top: 112, overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 30, borderBottom: '1px solid rgba(255,255,255,.1)', paddingBottom: 24 }}>
                    <div>
                      <h3 style={{ fontSize: 26, margin: '0 0 8px', fontWeight: 800 }}>احجز {venue.name}</h3>
                      <p style={{ margin: 0, color: 'rgba(255,255,255,.7)', fontSize: 15 }}>تواريخ مرنة وتجربة وصول سهلة.</p>
                    </div>
                    {price && (
                      <div style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                        <strong style={{ display: 'block', fontSize: 36, lineHeight: 1, fontWeight: 900, color: SAND }}>{Number(price).toLocaleString('en-US')}</strong>
                        <span style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, fontWeight: 700, marginTop: 4, display: 'inline-block' }}>ر.س / ليلة</span>
                      </div>
                    )}
                  </div>
                  {venue.price_weekday && venue.price_weekend && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                      <div style={{ border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.05)', borderRadius: 16, padding: '12px 14px' }}>
                        <div style={{ fontSize: 12, color: SAND, fontWeight: 800, marginBottom: 2 }}>أيام الأسبوع</div>
                        <div style={{ fontWeight: 800 }}>{Number(venue.price_weekday).toLocaleString('en-US')} ر.س</div>
                      </div>
                      <div style={{ border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.05)', borderRadius: 16, padding: '12px 14px' }}>
                        <div style={{ fontSize: 12, color: SAND, fontWeight: 800, marginBottom: 2 }}>نهاية الأسبوع</div>
                        <div style={{ fontWeight: 800 }}>{Number(venue.price_weekend).toLocaleString('en-US')} ر.س</div>
                      </div>
                    </div>
                  )}
                  {bookingsEnabled && (
                    <div style={{ marginBottom: 16 }}>
                      {/* زر منسدل لاختيار التواريخ */}
                      <button onClick={() => setCalOpen(o => !o)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.05)', borderRadius: 16, padding: '14px 16px', cursor: 'pointer', fontFamily: 'inherit', color: '#fff' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Calendar size={18} color={SAND} />
                          <span style={{ textAlign: 'right' }}>
                            <span style={{ display: 'block', fontSize: 11, color: SAND, fontWeight: 800 }}>فترة الإقامة</span>
                            <span style={{ display: 'block', fontSize: 14, fontWeight: 800 }}>
                              {bookingForm.check_in && bookingForm.check_out
                                ? `${bookingForm.check_in} ← ${bookingForm.check_out}`
                                : 'اختر تواريخ الدخول والخروج'}
                            </span>
                          </span>
                        </span>
                        <ChevronDown size={18} color="rgba(255,255,255,.6)" style={{ transform: calOpen ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }} />
                      </button>

                      {/* التقويم المنسدل */}
                      {calOpen && (
                        <div style={{ marginTop: 8, background: '#fff', borderRadius: 16, padding: 10 }}>
                          <VenueCalendar
                            bookedDates={bookedDates}
                            onRangeSelect={(start, end) => {
                              setBookingForm(p => ({ ...p, check_in: start, check_out: end }));
                              if (start && end) setCalOpen(false);
                            }}
                            readOnly={false}
                            accent={accent}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {bookingsEnabled && (
                    <button onClick={onBook} style={{ width: '100%', height: 60, border: 0, borderRadius: 20, cursor: 'pointer', background: 'linear-gradient(135deg,#f6d891,#b58b3b)', color: '#20170c', fontSize: 18, fontWeight: 900, fontFamily: 'inherit', boxShadow: '0 18px 35px rgba(181,139,59,.25)' }}>
                      تأكيد طلب الحجز
                    </button>
                  )}
                  {(venue.check_in_time || venue.check_out_time) && (
                    <div style={{ marginTop: 24, borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 20, display: 'grid', gap: 12, color: 'rgba(255,255,255,.7)', fontSize: 15 }}>
                      {venue.check_in_time && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>تسجيل الدخول</span><strong style={{ color: '#fff' }}>{venue.check_in_time}</strong></div>}
                      {venue.check_out_time && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>تسجيل الخروج</span><strong style={{ color: '#fff' }}>{venue.check_out_time}</strong></div>}
                    </div>
                  )}
                </div>
              </aside>

              <div style={{ display: 'grid', gap: 20 }}>
                {venue.description && (
                  <article data-rv style={{ ...rv, padding: 30, borderRadius: 36, background: 'rgba(255,255,255,.7)', border: '1px solid rgba(72,57,38,.10)', boxShadow: '0 16px 42px rgba(22,19,15,.05)' }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: 24, fontWeight: 800, color: FOREST }}>وصف المكان</h3>
                    <p style={{ margin: 0, color: '#62584e', fontSize: 16, fontWeight: 500, lineHeight: 1.8 }}>{venue.description}</p>
                  </article>
                )}
                {features.length > 0 && (
                  <article data-rv style={{ ...rv, padding: 30, borderRadius: 36, background: 'rgba(255,255,255,.7)', border: '1px solid rgba(72,57,38,.10)', boxShadow: '0 16px 42px rgba(22,19,15,.05)' }}>
                    <h3 style={{ margin: '0 0 20px', fontSize: 24, fontWeight: 800, color: FOREST }}>مرافق الشاليه</h3>
                    <div className="rm-rule" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                      {features.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#fff', border: `1px solid ${LINE}`, borderRadius: 20, fontWeight: 700, color: '#433a31', fontSize: 15 }}>
                          <CheckCircle2 size={18} color={OLIVE} /> {f}
                        </div>
                      ))}
                    </div>
                  </article>
                )}
                {venue.booking_terms && (
                  <article data-rv style={{ ...rv, padding: 30, borderRadius: 36, background: 'rgba(255,255,255,.7)', border: '1px solid rgba(72,57,38,.10)', boxShadow: '0 16px 42px rgba(22,19,15,.05)' }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: 24, fontWeight: 800, color: FOREST }}>شروط الحجز</h3>
                    <p style={{ margin: 0, color: '#62584e', fontSize: 16, fontWeight: 500, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{venue.booking_terms}</p>
                  </article>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* التقييمات */}
        {allReviews.length > 0 && (
          <section className="rm-section" style={{ padding: '80px 0' }}>
            <div className="rm-container">
              <SectionTitle title="التقييمات" desc="نسعد دائماً بمشاركة ضيوفنا لتجاربهم، رضاكم غايتنا الأولى." rv={rv} />
              <div className="rm-rev" style={{ display: 'grid', gridTemplateColumns: showRating ? '.75fr 1.25fr' : '1fr', gap: 24, alignItems: 'stretch' }}>
                {showRating && (
                  <aside data-rv style={{ ...rv, borderRadius: 40, padding: 40, background: `linear-gradient(180deg,rgba(23,36,25,.9),rgba(23,36,25,.8)),url("${heroImg}") center/cover`, color: '#fff', boxShadow: '0 18px 45px rgba(22,19,15,.10)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 410 }}>
                    <div>
                      <div style={{ color: '#f6d891', fontSize: 20 }}>★★★★★</div>
                      <strong style={{ fontSize: 80, lineHeight: 1, fontWeight: 900, color: SAND, display: 'block' }}>{venue.google_rating}</strong>
                      <h3 style={{ fontSize: 28, margin: '16px 0 10px', fontWeight: 800 }}>تجربة استثنائية</h3>
                      <p style={{ color: 'rgba(255,255,255,.8)', margin: 0, fontSize: 16, fontWeight: 500, lineHeight: 1.6 }}>نظافة، خصوصية، جمال المكان، وسهولة في إجراءات الحجز والوصول.</p>
                    </div>
                    {reviewCount > 0 && <span style={{ color: 'rgba(255,255,255,.6)' }}>بناءً على {reviewCount} تقييم موثّق</span>}
                  </aside>
                )}
                <div className="rm-revlist" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  {allReviews.slice(0, 4).map((r, i) => (
                    <article key={i} data-rv style={{ ...rv, background: 'rgba(255,255,255,.7)', border: '1px solid rgba(72,57,38,.10)', borderRadius: 32, padding: 28, boxShadow: '0 16px 42px rgba(22,19,15,.05)', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ color: SAND_DARK, fontSize: 14 }}>{'★'.repeat(Math.min(r.rating || 5, 5))}</div>
                      <p style={{ color: '#554c43', margin: '16px 0 24px', fontSize: 15, fontWeight: 500, flexGrow: 1 }}>{r.text}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderTop: '1px solid rgba(0,0,0,.05)', paddingTop: 16 }}>
                        <div style={{ width: 46, height: 46, borderRadius: '50%', background: SAND, color: FOREST, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18 }}>{(r.author || 'ض').charAt(0)}</div>
                        <div><strong style={{ display: 'block', fontWeight: 800, fontSize: 15 }}>{r.author || 'ضيف'}</strong><span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>تقييم موثّق</span></div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* الموقع */}
        {venue.maps_url && (
          <section className="rm-section" style={{ padding: '80px 0' }}>
            <div className="rm-container">
              <div style={{ borderRadius: 46, minHeight: 420, overflow: 'hidden', position: 'relative', background: `linear-gradient(90deg,rgba(22,19,15,.85),rgba(22,19,15,.2)),url("${heroImg}") center/cover`, boxShadow: '0 30px 90px rgba(22,19,15,.18)', display: 'flex', alignItems: 'flex-end', padding: 40, color: '#fff' }}>
                <div>
                  <h2 style={{ fontSize: 42, lineHeight: 1.2, margin: '0 0 16px', fontWeight: 900 }}>{venue.city || 'الموقع'}</h2>
                  <p style={{ maxWidth: 560, color: 'rgba(255,255,255,.8)', margin: '0 0 28px', fontSize: 18, fontWeight: 500 }}>موقع هادئ وسهل الوصول، يمنحك الخصوصية التامة.</p>
                  <a href={venue.maps_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 24px', borderRadius: 999, background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.2)', backdropFilter: 'blur(16px)', fontWeight: 800, fontSize: 14, color: '#fff' }}>
                    <MapPin size={18} /> فتح في خرائط جوجل
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* السوشيال */}
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
          <section style={{ padding: '56px 0 64px', background: 'transparent' }}>
            <div className="rm-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                {items.map(it => (
                  <a key={it.key} href={it.url(social[it.key])} target="_blank" rel="noreferrer"
                    style={{ width: 48, height: 48, borderRadius: '50%', border: `1px solid ${SAND}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: SAND_DARK, boxShadow: '0 8px 20px rgba(181,139,59,.12)' }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d={it.path} /></svg>
                  </a>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* الفوتر */}
      <footer style={{ padding: '40px 0 60px', color: '#665d52' }}>
        <div className="rm-container" style={{ borderTop: '1px solid rgba(72,57,38,.12)', paddingTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 500, textAlign: 'center' }}>
          <div>© {new Date().getFullYear()} {venue.name} — جميع الحقوق محفوظة.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}>
            صُنع بكل <Heart size={13} fill={SAND} color={SAND} /> على منصة <a href="https://www.aqacloud.com" target="_blank" rel="noopener noreferrer" style={{ color: SAND_DARK, fontWeight: 700 }}>عقار كلاود</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionTitle({ title, desc, tag, rv }) {
  return (
    <div data-rv style={{ ...rv, display: 'grid', gridTemplateColumns: tag ? '1fr auto' : '1fr', gap: 18, alignItems: 'end', marginBottom: 40 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 'clamp(32px,4vw,48px)', lineHeight: 1.2, fontWeight: 900, color: '#172419' }}>{title}</h2>
        {desc && <p style={{ margin: '12px 0 0', color: '#6c6258', maxWidth: 620, fontSize: 18, fontWeight: 500 }}>{desc}</p>}
      </div>
      {tag && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 999, background: '#fff', color: '#5a4a32', border: '1px solid rgba(72,57,38,.14)', boxShadow: '0 12px 28px rgba(22,19,15,.06)', fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap' }}>{tag}</span>}
    </div>
  );
}
