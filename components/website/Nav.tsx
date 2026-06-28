"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close mobile menu on route change
  // useEffect(() => {
  //   setMobileOpen(false);
  // }, [path]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/products", label: "Products" },
    { href: "/work", label: "Our Work" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <style>{`
        .nav-desktop-links { display: flex; gap: 2px; align-items: center; }
        .nav-hamburger { display: none; background: none; border: none; cursor: pointer; color: #fff; padding: 8px; font-size: 22px; line-height: 1; }
        .nav-mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 180; }
        .nav-mobile-drawer { position: fixed; top: 0; right: 0; bottom: 0; width: 260px; background: #0d1b2e; z-index: 190; padding: 1.5rem; display: flex; flex-direction: column; gap: 4px; transform: translateX(100%); transition: transform 0.3s ease; }
        .nav-mobile-drawer.open { transform: translateX(0); }
        .nav-link-hover:hover { color: #fff !important; }

        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .nav-hamburger { display: flex !important; align-items: center; }
          .nav-mobile-overlay.open { display: block; }
        }
      `}</style>

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          padding: "0 1.5rem",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.3s ease",
          background: scrolled ? "rgba(3,13,26,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              background: "linear-gradient(135deg,#2563eb,#7c3aed)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            🐼
          </div>
          <div>
            <div
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                lineHeight: 1,
              }}
            >
              PANDAS
            </div>
            <div
              style={{
                color: "#60a5fa",
                fontWeight: 600,
                fontSize: 10,
                letterSpacing: "0.15em",
              }}
            >
              DIGITAL
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="nav-desktop-links">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="nav-link-hover"
              style={{
                color: path === l.href ? "#fff" : "rgba(255,255,255,0.55)",
                textDecoration: "none",
                fontSize: 13,
                padding: "6px 10px",
                borderRadius: 6,
                fontWeight: path === l.href ? 600 : 400,
                borderBottom:
                  path === l.href
                    ? "2px solid #2563eb"
                    : "2px solid transparent",
                transition: "color 0.2s",
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            style={{
              marginLeft: 8,
              background: "#2563eb",
              color: "#fff",
              padding: "8px 18px",
              borderRadius: 8,
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Get Quote
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`nav-mobile-overlay${mobileOpen ? " open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile drawer */}
      <div className={`nav-mobile-drawer${mobileOpen ? " open" : ""}`}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              🐼
            </div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>
              PANDAS DIGITAL
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              fontSize: 22,
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setMobileOpen(false)}
            style={{
              color: path === l.href ? "#60a5fa" : "rgba(255,255,255,0.65)",
              textDecoration: "none",
              fontSize: 15,
              padding: "12px 16px",
              borderRadius: 10,
              fontWeight: path === l.href ? 600 : 400,
              background:
                path === l.href ? "rgba(37,99,235,0.12)" : "transparent",
              display: "block",
            }}
          >
            {l.label}
          </Link>
        ))}

        <Link
          href="/contact"
          onClick={() => setMobileOpen(false)}
          style={{
            marginTop: 12,
            background: "#2563eb",
            color: "#fff",
            padding: "13px 16px",
            borderRadius: 10,
            textDecoration: "none",
            fontSize: 15,
            fontWeight: 600,
            textAlign: "center",
            display: "block",
          }}
        >
          Get Quote
        </Link>
      </div>
    </>
  );
}

// mobileOpen
