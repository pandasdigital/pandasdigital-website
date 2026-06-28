"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const socials = [
  { label: "f", href: "#", title: "Facebook" },
  { label: "▣", href: "#", title: "Instagram" },
  { label: "in", href: "#", title: "LinkedIn" },
  { label: "♪", href: "#", title: "TikTok" },
  { label: "▶", href: "#", title: "YouTube" },
];

export default function Footer() {
  const [settings, setSettings] = useState({
    email: "hello@pandasdigital.lk",
    phone: "+94 77 000 0000",
    address: "Kurunegala, Sri Lanka",
    facebook: "#",
    instagram: "#",
    linkedin: "#",
    tiktok: "#",
    youtube: "#",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) setSettings((s) => ({ ...s, ...d }));
      })
      .catch(() => {});
  }, []);

  const socialLinks = [
    { label: "f", href: settings.facebook, title: "Facebook" },
    { label: "▣", href: settings.instagram, title: "Instagram" },
    { label: "in", href: settings.linkedin, title: "LinkedIn" },
    { label: "♪", href: settings.tiktok, title: "TikTok" },
    { label: "▶", href: settings.youtube, title: "YouTube" },
  ];

  return (
    <>
      <style>{`
        @keyframes wave-move {
          0% { d: path("M0,30 C180,60 360,0 540,30 C720,60 900,0 1080,30 C1260,60 1380,15 1440,30"); }
          25% { d: path("M0,20 C200,50 400,5 540,25 C700,50 920,5 1080,20 C1240,50 1380,10 1440,20"); }
          50% { d: path("M0,35 C150,10 380,55 540,35 C700,10 950,55 1080,35 C1250,10 1370,45 1440,35"); }
          75% { d: path("M0,25 C200,55 380,5 540,30 C720,55 880,5 1080,25 C1260,55 1390,10 1440,25"); }
          100% { d: path("M0,30 C180,60 360,0 540,30 C720,60 900,0 1080,30 C1260,60 1380,15 1440,30"); }
        }
        @keyframes wave-move-2 {
          0% { d: path("M0,40 C200,15 380,55 540,35 C700,15 900,55 1080,35 C1260,15 1400,45 1440,35"); }
          50% { d: path("M0,25 C180,55 400,10 540,30 C720,55 920,10 1080,30 C1250,55 1380,15 1440,30"); }
          100% { d: path("M0,40 C200,15 380,55 540,35 C700,15 900,55 1080,35 C1260,15 1400,45 1440,35"); }
        }
        .wave-path-1 { animation: wave-move 8s ease-in-out infinite; }
        .wave-path-2 { animation: wave-move-2 6s ease-in-out infinite; }
        .footer-social:hover { background: #2563eb !important; border-color: #2563eb !important; color: white !important; transform: translateY(-3px); }
        .footer-link:hover { color: #60a5fa !important; }
      `}</style>

      {/* Animated wave divider */}
      <div
        style={{
          display: "block",
          width: "100%",
          overflow: "hidden",
          lineHeight: 0,
          marginBottom: -2,
          background: "transparent",
        }}
      >
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ width: "100%", height: 80, display: "block" }}
        >
          <defs>
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#2563eb" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Background fill */}
          <path
            d="M0,30 C180,60 360,0 540,30 C720,60 900,0 1080,30 C1260,60 1380,15 1440,30 L1440,80 L0,80 Z"
            fill="#020810"
          />

          {/* Second wave line — slower, different color */}
          <path
            className="wave-path-2"
            d="M0,40 C200,15 380,55 540,35 C700,15 900,55 1080,35 C1260,15 1400,45 1440,35"
            fill="none"
            stroke="url(#waveGrad2)"
            strokeWidth="1"
          />

          {/* Main wave line */}
          <path
            className="wave-path-1"
            d="M0,30 C180,60 360,0 540,30 C720,60 900,0 1080,30 C1260,60 1380,15 1440,30"
            fill="none"
            stroke="url(#waveGrad1)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <footer style={{ background: "#020810", padding: "3rem 2rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
              gap: "2rem",
              marginBottom: "2.5rem",
            }}
          >
            {/* Brand */}
            <div>
              <Link
                href="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  textDecoration: "none",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                >
                  🐼
                </div>
                <div>
                  <div
                    style={{
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 13,
                      lineHeight: 1,
                    }}
                  >
                    PANDAS DIGITAL
                  </div>
                  <div
                    style={{
                      color: "#60a5fa",
                      fontSize: 9,
                      letterSpacing: "0.12em",
                      marginTop: 2,
                    }}
                  >
                    BUILD · INNOVATE · GROW
                  </div>
                </div>
              </Link>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.3)",
                  lineHeight: 1.8,
                  maxWidth: 240,
                  marginBottom: 20,
                }}
              >
                Building digital products for the future. Made in Sri Lanka, for
                the world.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {socialLinks.map((s) => (
                  <a
                    key={s.title}
                    href={s.href}
                    title={s.title}
                    className="footer-social"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      color: "rgba(255,255,255,0.45)",
                      textDecoration: "none",
                      fontSize: 12,
                      fontWeight: 600,
                      transition: "all 0.2s",
                    }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  marginBottom: 14,
                }}
              >
                Services
              </div>
              {[
                "Website Development",
                "Mobile Apps",
                "Software Development",
                "SaaS & AI Products",
              ].map((s) => (
                <Link
                  key={s}
                  href="/services"
                  className="footer-link"
                  style={{
                    display: "block",
                    color: "rgba(255,255,255,0.3)",
                    fontSize: 13,
                    padding: "4px 0",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                >
                  {s}
                </Link>
              ))}
            </div>

            {/* Company */}
            <div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  marginBottom: 14,
                }}
              >
                Company
              </div>
              {[
                { label: "About Us", href: "/about" },
                { label: "Our Work", href: "/work" },
                { label: "Products", href: "/products" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="footer-link"
                  style={{
                    display: "block",
                    color: "rgba(255,255,255,0.3)",
                    fontSize: 13,
                    padding: "4px 0",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Contact */}
            <div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  marginBottom: 14,
                }}
              >
                Contact
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.3)",
                  lineHeight: 1.9,
                }}
              >
                <div>📍 {settings.address}</div>
                <a
                  href={`mailto:${settings.email}`}
                  className="footer-link"
                  style={{
                    display: "block",
                    textDecoration: "none",
                    color: "rgba(255,255,255,0.3)",
                    transition: "color 0.2s",
                  }}
                >
                  📧 {settings.email}
                </a>
                <a
                  href={`tel:${settings.phone}`}
                  className="footer-link"
                  style={{
                    display: "block",
                    textDecoration: "none",
                    color: "rgba(255,255,255,0.3)",
                    transition: "color 0.2s",
                  }}
                >
                  📞 {settings.phone}
                </a>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
              © {new Date().getFullYear()} Pandas Digital. All rights reserved.
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
              Built with ❤️ in Sri Lanka
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
