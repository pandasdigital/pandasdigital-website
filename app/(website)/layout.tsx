"use client";
import { useState, useEffect } from "react";
import Nav from "@/components/website/Nav";
import Footer from "@/components/website/Footer";
import WhatsAppButton from "@/components/website/WhatsAppButton";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const t = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 1800);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "#030d1a",
        color: "#e2e8f0",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        img, video, canvas { max-width: 100%; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #030d1a; }
        ::-webkit-scrollbar-thumb { background: #2563eb; border-radius: 4px; }

        /* ── GLOBAL BG ── */
        .global-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse at 15% 20%, rgba(37,99,235,0.07) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 80%, rgba(124,58,237,0.06) 0%, transparent 55%);
        }
        .grid-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .content-wrap { position: relative; z-index: 1; }

        /* ── LOADER ── */
        @keyframes loader-spin { to { transform: rotate(360deg); } }
        @keyframes loader-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
        @keyframes loader-bar { 0%{width:0%} 60%{width:75%} 100%{width:100%} }
        @keyframes loader-fade-out { to { opacity:0; pointer-events:none; visibility:hidden; } }
        .loader-wrap {
          position: fixed; inset: 0; z-index: 9999; background: #030d1a;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 28px;
        }
        .loader-wrap.done { animation: loader-fade-out 0.5s ease 0.1s forwards; }
        .loader-ring {
          width: 64px; height: 64px; border-radius: 50%;
          border: 2px solid rgba(37,99,235,0.15);
          border-top-color: #2563eb; border-right-color: #7c3aed;
          animation: loader-spin 0.9s linear infinite; position: relative;
        }
        .loader-ring::before {
          content: ''; position: absolute; inset: 6px; border-radius: 50%;
          border: 1px solid rgba(37,99,235,0.1); border-bottom-color: #60a5fa;
          animation: loader-spin 1.4s linear infinite reverse;
        }
        .loader-panda {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%); font-size: 22px;
          animation: loader-pulse 1.2s ease-in-out infinite;
        }
        .loader-bar-wrap { width: 180px; height: 2px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
        .loader-bar { height: 100%; background: linear-gradient(90deg,#2563eb,#7c3aed); border-radius: 2px; animation: loader-bar 1.6s ease forwards; }
        .loader-text { font-size: 12px; color: rgba(255,255,255,0.3); letter-spacing: 0.15em; text-transform: uppercase; }

        /* ── ANIMATIONS ── */
        @keyframes gradient-shift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(1.6);opacity:0} }
        @keyframes panda-walk {
          0% { transform: translateX(-150px) scaleX(1); }
          49% { transform: translateX(calc(100vw + 150px)) scaleX(1); }
          50% { transform: translateX(calc(100vw + 150px)) scaleX(-1); }
          99% { transform: translateX(-150px) scaleX(-1); }
          100% { transform: translateX(-150px) scaleX(1); }
        }

        /* ── UTILITIES ── */
        .gradient-text {
          background: linear-gradient(135deg,#60a5fa,#a78bfa,#60a5fa);
          background-size: 200%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: gradient-shift 4s ease infinite;
        }
        .card-hover { transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; cursor: default; }
        .card-hover:hover { transform: translateY(-4px); border-color: rgba(37,99,235,0.5) !important; box-shadow: 0 12px 40px rgba(37,99,235,0.12); }
        .section-eyebrow { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.12em; color:#60a5fa; margin-bottom:12px; display:block; }
        .glow-dot { width:8px; height:8px; border-radius:50%; background:#22c55e; position:relative; display:inline-block; flex-shrink:0; }
        .glow-dot::after { content:''; position:absolute; inset:0; border-radius:50%; background:#22c55e; animation:pulse-ring 1.5s ease-out infinite; }

        .btn-primary-web {
          background: linear-gradient(135deg,#2563eb,#1d4ed8); color:#fff;
          padding: 12px 24px; border-radius:10px; text-decoration:none;
          font-weight:600; font-size:15px; display:inline-block;
          transition:all 0.2s; border:none; cursor:pointer; font-family:inherit;
          white-space: nowrap;
        }
        .btn-primary-web:hover { box-shadow:0 0 24px rgba(37,99,235,0.45); transform:translateY(-1px); }
        .btn-outline-web {
          background: rgba(255,255,255,0.06); color:#fff;
          padding: 12px 24px; border-radius:10px; text-decoration:none;
          font-weight:500; font-size:15px; display:inline-block;
          border:1px solid rgba(255,255,255,0.12); transition:all 0.2s;
          white-space: nowrap;
        }
        .btn-outline-web:hover { background:rgba(255,255,255,0.1); }

        .form-inp {
          width:100%; background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1); border-radius:10px;
          padding:12px 14px; font-size:14px; color:#e2e8f0;
          outline:none; transition:border-color 0.2s; font-family:inherit;
        }
        .form-inp:focus { border-color:#2563eb; }
        .form-inp::placeholder { color:rgba(255,255,255,0.3); }
        select.form-inp option { background:#0d1b2e; color:#e2e8f0; }

        /* ── RESPONSIVE GRID HELPERS ── */
        .grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .grid-4col { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; }
        .grid-auto { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px,1fr)); gap: 1rem; }
        .grid-auto-lg { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px,1fr)); gap: 1.25rem; }
        .grid-services { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .grid-contact { display: grid; grid-template-columns: 1fr 1.4fr; gap: 3rem; }
        .grid-story { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .section-pad { padding: 5rem 2rem; }
        .section-pad-lg { padding: 7rem 2rem; }
        .section-inner { max-width: 1100px; margin: 0 auto; }
        .section-inner-md { max-width: 900px; margin: 0 auto; }
        .section-inner-sm { max-width: 700px; margin: 0 auto; }

        /* ── MOBILE RESPONSIVE ── */
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .nav-hamburger { display: flex !important; }

          .grid-2col { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .grid-4col { grid-template-columns: 1fr 1fr !important; gap: 0.75rem !important; }
          .grid-auto { grid-template-columns: 1fr !important; }
          .grid-auto-lg { grid-template-columns: 1fr !important; }
          .grid-services { grid-template-columns: 1fr !important; }
          .grid-contact { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .grid-story { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .section-pad { padding: 3.5rem 1.25rem !important; }
          .section-pad-lg { padding: 4rem 1.25rem !important; }

          .hero-stats-row { grid-template-columns: 1fr 1fr !important; }
          .hero-btns-row { flex-direction: column !important; align-items: stretch !important; }
          .hero-btns-row a, .hero-btns-row button { text-align: center !important; width: 100% !important; }

          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
          .footer-brand { grid-column: 1 / -1 !important; }

          .service-card-inner { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .products-grid { grid-template-columns: 1fr !important; }
          .mission-grid { grid-template-columns: 1fr !important; }
          .team-grid { grid-template-columns: 1fr !important; }
          .invoice-grid { grid-template-columns: 1fr !important; }

          .hide-mobile { display: none !important; }
          .show-mobile { display: block !important; }

          .text-hero { font-size: clamp(2rem, 10vw, 3rem) !important; }
          .text-h1 { font-size: clamp(1.8rem, 8vw, 2.5rem) !important; }
          .text-h2 { font-size: clamp(1.5rem, 6vw, 2rem) !important; }
        }

        @media (max-width: 480px) {
          .grid-4col { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .section-pad { padding: 3rem 1rem !important; }
          .section-pad-lg { padding: 3.5rem 1rem !important; }
        }
      `}</style>

      {/* Loader */}
      <div className={`loader-wrap${!loading ? " done" : ""}`}>
        <div style={{ position: "relative", width: 64, height: 64 }}>
          <div className="loader-ring" />
          <div className="loader-panda">🐼</div>
        </div>
        <div className="loader-bar-wrap">
          <div className="loader-bar" />
        </div>
        <div className="loader-text">Pandas Digital</div>
      </div>

      <div className="global-bg" />
      <div className="grid-bg" />

      {/* Moving panda */}
      <div
        style={{
          position: "fixed",
          bottom: 100,
          left: 0,
          right: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
          height: 80,
        }}
      >
        <div
          style={{
            position: "absolute",
            fontSize: 64,
            opacity: 0.035,
            animation: "panda-walk 40s linear infinite",
            userSelect: "none",
          }}
        >
          🐼
        </div>
      </div>

      <div className="content-wrap">
        <Nav />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </div>
    </div>
  );
}
