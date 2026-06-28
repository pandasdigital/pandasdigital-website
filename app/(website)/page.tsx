"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import FadeSection from "@/components/website/FadeSection";
import SectionBg from "@/components/website/SectionBg";

const services = [
  {
    icon: "🌐",
    title: "Website Development",
    desc: "Business sites, landing pages, and e-commerce built to convert.",
  },
  {
    icon: "📱",
    title: "Mobile Apps",
    desc: "Android, iOS and cross-platform apps that users love.",
  },
  {
    icon: "💻",
    title: "Software Development",
    desc: "ERP, CRM and custom management systems built to scale.",
  },
  {
    icon: "☁️",
    title: "SaaS & AI Products",
    desc: "Subscription platforms and AI automation tools.",
  },
];

const stats = [
  { value: "8+", label: "Projects Shipped" },
  { value: "6+", label: "Happy Clients" },
  { value: "4", label: "Service Areas" },
  { value: "100%", label: "Satisfaction" },
];

type Testimonial = {
  id?: number;
  name: string;
  role: string;
  text: string;
  avatar: string;
};

const defaultTestimonials: Testimonial[] = [
  {
    name: "Kamal Perera",
    role: "Owner, Besilika Stores",
    text: "The POS system Pandas Digital built transformed how we run our store. Sales tracking is seamless and the support is fantastic.",
    avatar: "KP",
  },
  {
    name: "Thisara Fernando",
    role: "Manager, KT Enterprises",
    text: "Our inventory management used to be a nightmare. Now everything is automated and accurate. Highly recommend.",
    avatar: "TF",
  },
  {
    name: "Udith Balasooriya",
    role: "Photographer",
    text: "My photography website looks world-class. Clients book sessions through it every week. Best investment I made.",
    avatar: "UB",
  },
  {
    name: "Nimal Silva",
    role: "CEO, CareerFlow",
    text: "They built our entire SaaS platform from scratch. Quality is outstanding and they delivered ahead of schedule.",
    avatar: "NS",
  },
];

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(defaultTestimonials);
  const [heroSettings, setHeroSettings] = useState({
    heroTitle: "We Build Digital Products That Last",
    heroSubtitle:
      "Websites · Mobile apps · Custom software · SaaS platforms · AI automation. Built in Sri Lanka, for the world.",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) setHeroSettings((s) => ({ ...s, ...d }));
      })
      .catch(() => {});
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setTestimonials(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.5,
    }));
    let raf: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(96,165,250,0.5)";
        ctx.fill();
      });
      pts.forEach((a, i) =>
        pts.slice(i + 1).forEach((b) => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(96,165,250,${0.12 * (1 - d / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }),
      );
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % testimonials.length);
        setAnimating(false);
      }, 400);
    }, 4500);
    return () => clearInterval(id);
  }, [testimonials.length]);

  function goTo(i: number) {
    if (i === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(i);
      setAnimating(false);
    }, 400);
  }

  return (
    <div
      style={{ background: "#030d1a", minHeight: "100vh", overflowX: "hidden" }}
    >
      {/* HERO */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.7,
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: "40vw",
            maxWidth: 450,
            height: "40vw",
            maxHeight: 450,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(37,99,235,0.16) 0%, transparent 70%)",
            filter: "blur(50px)",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            right: "8%",
            width: "35vw",
            maxWidth: 380,
            height: "35vw",
            maxHeight: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)",
            filter: "blur(50px)",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            padding: "clamp(80px, 15vw, 120px) 1.25rem 4rem",
            maxWidth: "100%",
            width: "100%",
          }}
        >
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <FadeSection delay={0}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(37,99,235,0.15)",
                  border: "1px solid rgba(37,99,235,0.3)",
                  borderRadius: 20,
                  padding: "6px 14px",
                  marginBottom: 28,
                  fontSize: 11,
                  color: "#93c5fd",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <span className="glow-dot" />
                <span>Open for new projects · Kurunegala, Sri Lanka</span>
              </div>
            </FadeSection>

            <FadeSection delay={0.1}>
              <h1
                className="text-hero"
                style={{
                  fontSize: "clamp(2.2rem, 8vw, 5.2rem)",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                  marginBottom: 20,
                }}
              >
                We Build{" "}
                <span className="gradient-text">
                  Digital
                  <br />
                  Products
                </span>{" "}
                That Last
              </h1>
            </FadeSection>

            <FadeSection delay={0.2}>
              <p
                style={{
                  fontSize: "clamp(14px, 3vw, 17px)",
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.8,
                  maxWidth: 520,
                  margin: "0 auto 36px",
                  padding: "0 1rem",
                }}
              >
                {heroSettings.heroSubtitle}
              </p>
            </FadeSection>

            <FadeSection delay={0.3}>
              <div
                className="hero-btns-row"
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginBottom: 56,
                  padding: "0 1rem",
                }}
              >
                <Link href="/contact" className="btn-primary-web">
                  Start a Project →
                </Link>
                <Link href="/work" className="btn-outline-web">
                  See Our Work
                </Link>
              </div>
            </FadeSection>

            <FadeSection delay={0.4}>
              <div
                className="hero-stats-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: 0,
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  paddingTop: 28,
                  margin: "0 1rem",
                }}
              >
                {stats.map((s, i) => (
                  <div
                    key={s.label}
                    style={{
                      textAlign: "center",
                      padding: "0 0.5rem",
                      borderRight:
                        i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "clamp(1.4rem, 4vw, 2rem)",
                        fontWeight: 800,
                        color: "#60a5fa",
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(10px, 2vw, 12px)",
                        color: "rgba(255,255,255,0.4)",
                        marginTop: 4,
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </FadeSection>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            color: "rgba(255,255,255,0.25)",
            fontSize: 11,
            zIndex: 2,
          }}
        >
          <span>scroll</span>
          <div
            style={{
              width: 1,
              height: 32,
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)",
            }}
          />
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="section-pad-lg" style={{ position: "relative" }}>
        <SectionBg style="dots" />
        <div
          className="section-inner"
          style={{ position: "relative", zIndex: 1 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "2.5rem",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <FadeSection>
              <div>
                <span className="section-eyebrow">What We Do</span>
                <h2
                  className="text-h2"
                  style={{
                    fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Services Built to Scale
                </h2>
              </div>
            </FadeSection>
            <FadeSection delay={0.1}>
              <Link
                href="/services"
                style={{
                  color: "#60a5fa",
                  fontSize: 14,
                  textDecoration: "none",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                View all →
              </Link>
            </FadeSection>
          </div>
          <div className="grid-auto">
            {services.map((s, i) => (
              <FadeSection key={s.title} delay={i * 0.08}>
                <div
                  className="card-hover"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 16,
                    padding: "1.5rem",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: "rgba(37,99,235,0.12)",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      marginBottom: "0.875rem",
                    }}
                  >
                    {s.icon}
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#fff",
                      marginBottom: 6,
                    }}
                  >
                    {s.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.4)",
                      lineHeight: 1.7,
                    }}
                  >
                    {s.desc}
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        className="section-pad-lg"
        style={{ background: "rgba(255,255,255,0.015)", position: "relative" }}
      >
        <SectionBg style="circuit" />
        <div
          className="section-inner-sm"
          style={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          <FadeSection>
            <span className="section-eyebrow">Testimonials</span>
          </FadeSection>
          <FadeSection delay={0.1}>
            <h2
              className="text-h2"
              style={{
                fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.02em",
                marginBottom: 40,
              }}
            >
              What Our Clients Say
            </h2>
          </FadeSection>
          <FadeSection delay={0.2}>
            <div style={{ minHeight: 220 }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20,
                  padding: "clamp(1.25rem, 4vw, 2.5rem)",
                  transition: "opacity 0.4s ease, transform 0.4s ease",
                  opacity: animating ? 0 : 1,
                  transform: animating ? "translateY(12px)" : "translateY(0)",
                }}
              >
                <div
                  style={{
                    fontSize: 48,
                    color: "#2563eb",
                    lineHeight: 1,
                    marginBottom: 12,
                    opacity: 0.5,
                  }}
                >
                  &quot;
                </div>
                <p
                  style={{
                    fontSize: "clamp(14px, 3vw, 17px)",
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.8,
                    marginBottom: 24,
                    fontStyle: "italic",
                  }}
                >
                  {testimonials[current]?.text}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 13,
                      flexShrink: 0,
                    }}
                  >
                    {testimonials[current]?.avatar}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div
                      style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}
                    >
                      {testimonials[current]?.name}
                    </div>
                    <div
                      style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}
                    >
                      {testimonials[current]?.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginTop: 20,
              }}
            >
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  style={{
                    width: i === current ? 22 : 8,
                    height: 8,
                    borderRadius: 4,
                    background:
                      i === current ? "#2563eb" : "rgba(255,255,255,0.2)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </FadeSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad-lg" style={{ position: "relative" }}>
        <SectionBg style="orbs" />
        <div
          className="section-inner-sm"
          style={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          <FadeSection>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 5vw, 2.8rem)",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.02em",
                marginBottom: 14,
              }}
            >
              Ready to <span className="gradient-text">Build Something?</span>
            </h2>
          </FadeSection>
          <FadeSection delay={0.1}>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "clamp(14px, 3vw, 16px)",
                lineHeight: 1.8,
                marginBottom: 32,
              }}
            >
              Tell us about your project and we will get back to you within 24
              hours.
            </p>
          </FadeSection>
          <FadeSection delay={0.2}>
            <div
              className="hero-btns-row"
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link href="/contact" className="btn-primary-web">
                Send an Inquiry →
              </Link>
              <Link href="/about" className="btn-outline-web">
                Learn About Us
              </Link>
            </div>
          </FadeSection>
        </div>
      </section>
    </div>
  );
}
