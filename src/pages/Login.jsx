import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Loader2 } from 'lucide-react';

const AIRBNB = '#ff385c';

const GoogleLogo = () => (
  <svg className="google-logo" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5Z" />
    <path fill="#FF3D00" d="M6.3 14.7 12.9 19.5C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7Z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.8-3.4-11.4-8.1L6.1 33C9.4 39.5 16.2 44 24 44Z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l6.2 5.2C36.9 39.3 44 34 44 24c0-1.3-.1-2.4-.4-3.5Z" />
  </svg>
);

const BrandIcon = () => (
  <span className="brand-icon">
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 11.2 12 4l8 7.2v7.1a1.7 1.7 0 0 1-1.7 1.7H5.7A1.7 1.7 0 0 1 4 18.3v-7.1Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </span>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" />
    <path d="M4.5 20.2c1.45-3.35 4.05-5.02 7.5-5.02s6.05 1.67 7.5 5.02" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 6.5h16v11H4v-11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="m5 8 7 5 7-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M7 10V8a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M6 10h12a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 18 20H6a1.5 1.5 0 0 1-1.5-1.5v-7A1.5 1.5 0 0 1 6 10Z" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M13 3 5 14h6l-1 7 9-12h-6l1-6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 11.2 12 4l8 7.2v7.1a1.7 1.7 0 0 1-1.7 1.7H5.7A1.7 1.7 0 0 1 4 18.3v-7.1Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3 5 6v5c0 4.55 2.9 8.65 7 10 4.1-1.35 7-5.45 7-10V6l-7-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="m9.5 12 1.8 1.8 3.5-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError('يرجى إدخال جميع البيانات المطلوبة');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = '/';
    } catch (err) {
      setError(err.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider('google', '/check-profile');
  };

  return (
    <main className="aq-login-page" dir="rtl">
      <section className="shell">
        <Link className="brand-mark" to="/" aria-label="شاليهاتي">
          <BrandIcon />
          <span>شاليهاتي</span>
        </Link>

        <section className="login-side">
          <div className="login-card">
            <div className="welcome">
              <div>
                <h2>مرحباً بعودتك</h2>
                <p>سجّل دخولك لإدارة الشاليهات، متابعة الحجوزات، وتحديث عروضك بكل سهولة.</p>
              </div>
              <div className="soft-icon">
                <UserIcon />
              </div>
            </div>

            <button className="google-btn" type="button" onClick={handleGoogle} disabled={loading}>
              <GoogleLogo />
              تسجيل الدخول باستخدام Google
            </button>

            <div className="divider">أو باستخدام البريد الإلكتروني</div>

            {error && <div className="error-box">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="email">البريد الإلكتروني</label>
                <div className="input-wrap">
                  <MailIcon />
                  <input
                    id="email"
                    type="email"
                    dir="ltr"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="password">كلمة المرور</label>
                <div className="input-wrap">
                  <LockIcon />
                  <input
                    id="password"
                    type="password"
                    dir="ltr"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-tools">
                <label className="remember">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                  />
                  تذكرني
                </label>
                <Link className="forgot" to="/forgot-password">نسيت كلمة المرور؟</Link>
              </div>

              <button className="submit" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="spin-icon" />
                    جاري التحقق...
                  </>
                ) : (
                  'تسجيل الدخول'
                )}
              </button>
            </form>

            <p className="signup">
              جديد معنا؟ <Link to="/register">أنشئ حسابك الآن</Link>
            </p>
          </div>
        </section>

        <aside className="text-side">
          <div className="text-content">
            <div className="top-badge">ثيم Airbnb الفاتح</div>

            <h1>مكان واحد يجمعك.</h1>
            <p>سجّل دخولك لإدارة الشاليهات والحجوزات بتجربة أنيقة، سريعة، وواضحة.</p>

            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon"><BoltIcon /></div>
                <div>
                  <strong>تحميل أسرع</strong>
                  <span>بدون صور خارجية</span>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon"><HomeIcon /></div>
                <div>
                  <strong>ثيم شاليهات</strong>
                  <span>رسمة خفيفة وأنيقة</span>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon"><ShieldIcon /></div>
                <div>
                  <strong>دخول آمن</strong>
                  <span>Google والبريد</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');

        :root{
          --brand:#ff385c;
          --brand-dark:#e61e4d;
          --brand-soft:#fff0f3;
          --ink:#181818;
          --muted:#6f6f76;
          --line:#ededed;
          --bg:#fffaf7;
          --card:#ffffff;
          --shadow:0 28px 80px rgba(30, 23, 20, .12);
          --shadow-soft:0 14px 35px rgba(30, 23, 20, .08);
        }

        .aq-login-page,
        .aq-login-page *{box-sizing:border-box}

        .aq-login-page{
          margin:0;
          min-height:100vh;
          padding:28px;
          display:grid;
          place-items:center;
          font-family:"Tajawal", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color:var(--ink);
          background:
            radial-gradient(circle at 12% 13%, rgba(255,56,92,.12), transparent 28%),
            radial-gradient(circle at 90% 80%, rgba(255,154,108,.16), transparent 32%),
            linear-gradient(135deg, #fff 0%, var(--bg) 100%);
          overflow-x:hidden;
        }

        .shell{
          width:min(1120px, 100%);
          min-height:680px;
          display:grid;
          grid-template-columns:1fr 1fr;
          grid-template-areas:"text login";
          direction:ltr;
          background:rgba(255,255,255,.74);
          border:1px solid rgba(255,255,255,.86);
          border-radius:38px;
          box-shadow:var(--shadow);
          overflow:hidden;
          backdrop-filter: blur(22px);
          position:relative;
        }

        .login-side,
        .text-side{direction:rtl}

        .brand-mark{
          position:absolute;
          top:26px;
          right:28px;
          z-index:10;
          display:flex;
          align-items:center;
          gap:10px;
          padding:10px 14px;
          color:#202020;
          text-decoration:none;
          background:rgba(255,255,255,.76);
          border:1px solid rgba(255,255,255,.86);
          border-radius:999px;
          box-shadow:0 12px 28px rgba(20,20,20,.07);
          backdrop-filter: blur(16px);
          font-weight:900;
          letter-spacing:-.3px;
        }

        .brand-icon{
          width:34px;
          height:34px;
          border-radius:50%;
          display:grid;
          place-items:center;
          background:linear-gradient(135deg, var(--brand), #ff7a8f);
          color:#fff;
          box-shadow:0 12px 24px rgba(255,56,92,.28);
        }

        .brand-icon svg{width:19px;height:19px}

        .login-side{
          grid-area:login;
          padding:92px 58px 54px;
          display:flex;
          align-items:center;
          justify-content:center;
          background:
            linear-gradient(135deg, rgba(255,255,255,.96), rgba(255,248,247,.94)),
            radial-gradient(circle at 72% 12%, rgba(255,56,92,.10), transparent 22%);
        }

        .login-card{
          width:min(430px, 100%);
          position:relative;
        }

        .welcome{
          display:flex;
          justify-content:space-between;
          gap:16px;
          align-items:flex-start;
          margin-bottom:30px;
        }

        .welcome h2{
          margin:0;
          font-size:34px;
          line-height:1.15;
          letter-spacing:-.9px;
          font-weight:900;
        }

        .welcome p{
          margin:10px 0 0;
          color:var(--muted);
          font-size:15.5px;
          line-height:1.7;
          font-weight:500;
        }

        .soft-icon{
          width:52px;
          height:52px;
          border-radius:18px;
          display:grid;
          place-items:center;
          background:var(--brand-soft);
          border:1px solid rgba(255,56,92,.10);
          color:var(--brand);
          flex:0 0 auto;
        }

        .soft-icon svg{width:25px;height:25px}

        .google-btn{
          width:100%;
          height:56px;
          border:1px solid #dedee3;
          background:#fff;
          border-radius:17px;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:11px;
          font-family:inherit;
          font-size:15.5px;
          font-weight:900;
          color:#232323;
          cursor:pointer;
          transition:.22s ease;
          box-shadow:0 12px 24px rgba(0,0,0,.045);
        }

        .google-btn:hover{
          transform:translateY(-2px);
          border-color:#cacad0;
          box-shadow:0 18px 30px rgba(0,0,0,.075);
        }

        .google-btn:disabled{
          opacity:.72;
          cursor:not-allowed;
          transform:none;
        }

        .google-logo{
          width:22px;
          height:22px;
          display:block;
        }

        .divider{
          display:flex;
          align-items:center;
          gap:14px;
          margin:24px 0;
          color:#9a9aa1;
          font-size:13px;
          font-weight:800;
        }

        .divider:before,
        .divider:after{
          content:"";
          flex:1;
          height:1px;
          background:var(--line);
        }

        .error-box{
          margin-bottom:15px;
          padding:12px 14px;
          border-radius:17px;
          border:1px solid #fecaca;
          background:#fef2f2;
          color:#dc2626;
          text-align:center;
          font-size:13px;
          font-weight:800;
        }

        form{display:grid;gap:15px}

        .field label{
          display:block;
          margin-bottom:8px;
          color:#38383d;
          font-size:13.5px;
          font-weight:900;
        }

        .input-wrap{position:relative}

        .input-wrap svg{
          position:absolute;
          right:16px;
          top:50%;
          transform:translateY(-50%);
          width:20px;
          height:20px;
          color:#9999a1;
          pointer-events:none;
        }

        .input-wrap input{
          width:100%;
          height:56px;
          border:1px solid #e4e4e8;
          border-radius:17px;
          background:#fff;
          padding:0 48px 0 16px;
          outline:none;
          font-family:inherit;
          font-size:15px;
          font-weight:700;
          color:#222;
          transition:.2s ease;
          box-shadow:0 8px 18px rgba(0,0,0,.025);
          text-align:left;
        }

        .input-wrap input::placeholder{
          color:#b0b0b7;
          font-weight:600;
        }

        .input-wrap input:focus{
          border-color:rgba(255,56,92,.55);
          box-shadow:0 0 0 5px rgba(255,56,92,.10);
        }

        .form-tools{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:14px;
          margin-top:2px;
          font-size:13.5px;
          font-weight:800;
        }

        .remember{
          display:flex;
          align-items:center;
          gap:8px;
          color:#55555d;
          cursor:pointer;
          user-select:none;
        }

        .remember input{
          width:18px;
          height:18px;
          accent-color:var(--brand);
          box-shadow:none;
          padding:0;
        }

        .forgot{
          color:var(--brand);
          text-decoration:none;
          font-weight:900;
        }

        .submit{
          margin-top:8px;
          height:58px;
          border:0;
          border-radius:18px;
          background:linear-gradient(135deg, #373737, #181818);
          color:#fff;
          font-family:inherit;
          font-size:16px;
          font-weight:900;
          cursor:pointer;
          box-shadow:0 18px 32px rgba(24,24,24,.18);
          transition:.22s ease;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:9px;
        }

        .submit:hover{
          transform:translateY(-2px);
          box-shadow:0 24px 40px rgba(24,24,24,.24);
          background:linear-gradient(135deg, #303030, #111);
        }

        .submit:disabled{
          opacity:.72;
          cursor:not-allowed;
          transform:none;
        }

        .spin-icon{
          width:18px;
          height:18px;
          animation:spin 1s linear infinite;
        }

        @keyframes spin{
          from{transform:rotate(0deg)}
          to{transform:rotate(360deg)}
        }

        .signup{
          margin:24px 0 0;
          text-align:center;
          color:#686870;
          font-size:14.5px;
          font-weight:700;
        }

        .signup a{
          color:var(--brand);
          text-decoration:none;
          font-weight:900;
        }

        .text-side{
          grid-area:text;
          position:relative;
          min-height:680px;
          padding:106px 58px 58px;
          display:flex;
          align-items:center;
          background:
            radial-gradient(circle at 24% 24%, rgba(255,56,92,.10), transparent 28%),
            radial-gradient(circle at 80% 78%, rgba(255,190,150,.18), transparent 34%),
            linear-gradient(145deg, #fff8f5 0%, #fff1eb 52%, #fff 100%);
          border-right:1px solid rgba(255,255,255,.74);
          overflow:hidden;
        }

        .text-side:before{
          content:"";
          position:absolute;
          inset:0;
          background-image:
            linear-gradient(rgba(255,56,92,.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,56,92,.055) 1px, transparent 1px);
          background-size:46px 46px;
          mask-image:radial-gradient(circle at 50% 45%, #000 0%, transparent 76%);
          pointer-events:none;
        }

        .text-content{
          position:relative;
          z-index:1;
          max-width:505px;
        }

        .top-badge{
          display:inline-flex;
          align-items:center;
          gap:9px;
          padding:10px 14px;
          border-radius:999px;
          background:rgba(255,255,255,.76);
          border:1px solid rgba(255,255,255,.92);
          box-shadow:0 14px 26px rgba(35, 25, 20, .06);
          color:#3d3030;
          font-size:14px;
          font-weight:900;
          backdrop-filter:blur(14px);
          margin-bottom:22px;
        }

        .top-badge:before{
          content:"";
          width:9px;
          height:9px;
          border-radius:50%;
          background:var(--brand);
          box-shadow:0 0 0 6px rgba(255,56,92,.12);
        }

        .text-content h1{
          margin:0;
          font-size:clamp(38px, 4.5vw, 60px);
          line-height:1.04;
          letter-spacing:-1.9px;
          font-weight:900;
          color:#211b1a;
          text-wrap:balance;
        }

        .text-content > p{
          margin:17px 0 0;
          color:#6a5d58;
          font-size:16.5px;
          line-height:1.85;
          font-weight:600;
          max-width:460px;
        }

        .feature-grid{
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:12px;
          margin-top:32px;
        }

        .feature-card{
          min-height:132px;
          padding:17px 15px;
          border-radius:24px;
          background:rgba(255,255,255,.74);
          border:1px solid rgba(255,255,255,.92);
          box-shadow:0 16px 34px rgba(35,25,20,.055);
          backdrop-filter:blur(14px);
          display:flex;
          flex-direction:column;
          justify-content:space-between;
        }

        .feature-icon{
          width:38px;
          height:38px;
          border-radius:15px;
          display:grid;
          place-items:center;
          background:var(--brand-soft);
          color:var(--brand);
          margin-bottom:18px;
        }

        .feature-icon svg{
          width:21px;
          height:21px;
        }

        .feature-card strong{
          display:block;
          color:#222;
          font-size:15px;
          font-weight:900;
          line-height:1.25;
        }

        .feature-card span{
          display:block;
          margin-top:6px;
          color:#7a7170;
          font-size:12.5px;
          font-weight:800;
          line-height:1.45;
        }

        @media (max-width: 960px){
          .aq-login-page{padding:16px}

          .shell{
            min-height:640px;
            border-radius:30px;
          }

          .login-side{
            padding:82px 30px 36px;
          }

          .text-side{
            min-height:640px;
            padding:100px 30px 36px;
          }

          .brand-mark{
            top:18px;
            right:18px;
          }

          .text-content h1{
            font-size:38px;
          }

          .text-content > p{
            font-size:15.5px;
          }

          .feature-grid{
            grid-template-columns:1fr;
            gap:10px;
            margin-top:24px;
          }

          .feature-card{
            min-height:auto;
            display:grid;
            grid-template-columns:auto 1fr;
            column-gap:12px;
            align-items:center;
            padding:14px;
          }

          .feature-icon{
            margin-bottom:0;
            grid-row:1 / span 2;
          }
        }

        @media (max-width: 680px){
          .aq-login-page{
            padding:16px;
            display:grid;
            place-items:start center;
            min-height:100vh;
            background:
              radial-gradient(circle at 18% 5%, rgba(255,56,92,.12), transparent 26%),
              linear-gradient(135deg, #fff 0%, #fff8f7 100%);
          }

          .shell{
            width:100%;
            min-height:auto;
            display:block;
            border:1px solid rgba(255,255,255,.92);
            border-radius:28px;
            box-shadow:0 22px 58px rgba(30,23,20,.10);
            background:rgba(255,255,255,.82);
            overflow:hidden;
            backdrop-filter:blur(20px);
            margin-top:10px;
          }

          .text-side{
            display:none;
          }

          .brand-mark{
            position:relative;
            top:auto;
            right:auto;
            width:max-content;
            margin:18px auto 0;
            z-index:2;
          }

          .brand-mark span:last-child{
            display:none;
          }

          .login-side{
            min-height:auto;
            padding:26px 20px 24px;
            align-items:flex-start;
            background:
              radial-gradient(circle at 90% 8%, rgba(255,56,92,.09), transparent 28%),
              linear-gradient(135deg, rgba(255,255,255,.98), rgba(255,248,247,.96));
          }

          .login-card{
            width:100%;
          }

          .welcome{
            align-items:center;
            margin-bottom:26px;
          }

          .welcome h2{
            font-size:30px;
          }

          .welcome p{
            font-size:14.5px;
          }

          .soft-icon{
            width:46px;
            height:46px;
            border-radius:16px;
          }

          .form-tools{
            align-items:flex-start;
            flex-direction:column;
          }
        }
      `}</style>
    </main>
  );
}
