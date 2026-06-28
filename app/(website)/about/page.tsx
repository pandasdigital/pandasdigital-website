"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import FadeSection from "@/components/website/FadeSection";
import SectionBg from "@/components/website/SectionBg";

const values = [
  {
    icon: "🎯",
    title: "Quality First",
    desc: "We never ship something we are not proud of. Every pixel and line of code matters.",
  },
  {
    icon: "🤝",
    title: "Client Partnership",
    desc: "We work with you, not just for you. Your success is our success.",
  },
  {
    icon: "🚀",
    title: "Built to Scale",
    desc: "Everything we build is designed to grow with your business.",
  },
  {
    icon: "💡",
    title: "Always Innovating",
    desc: "We stay ahead of the curve so you do not have to worry about falling behind.",
  },
];

const team = [
  {
    initials: "RC",
    name: "Randiv Costa",
    role: "Software Engineer & Co-founder",
    bio: "Experienced software engineer passionate about building scalable digital products. Leads all technical development at Pandas Digital.",
    color: "#2563eb",
  },
  {
    initials: "SS",
    name: "Sarasa Silva",
    role: "Sales Lead & Co-founder",
    bio: "Experienced sales professional who connects businesses with the right digital solutions. Drives client relationships and growth.",
    color: "#0891b2",
  },
];

export default function AboutPage() {
  const [settings, setSettings] = useState({
    aboutStory:
      "Pandas Digital started with a simple belief: businesses in Sri Lanka deserve world-class digital products. We set out to change that.",
    aboutMission:
      "To help businesses grow through innovative technology, automation, and software development.",
    aboutVision:
      "To become a leading technology company creating globally recognized digital products and software solutions.",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) setSettings((s) => ({ ...s, ...d }));
      })
      .catch(() => {});
  }, []);

  return (
    <div
      style={{
        background: "#030d1a",
        minHeight: "100vh",
        paddingTop: 64,
        overflowX: "hidden",
      }}
    >
      {/* Hero */}
      <section
        className="section-pad-lg"
        style={{
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <SectionBg style="orbs" />
        <div
          className="section-inner-sm"
          style={{ position: "relative", zIndex: 1 }}
        >
          <FadeSection>
            <div className="section-eyebrow">About Us</div>
          </FadeSection>
          <FadeSection delay={0.1}>
            <h1
              className="text-h1"
              style={{
                fontSize: "clamp(2rem, 7vw, 4rem)",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.03em",
                marginBottom: 20,
                lineHeight: 1.1,
              }}
            >
              Building Digital Sri Lanka
            </h1>
          </FadeSection>
          <FadeSection delay={0.2}>
            <p
              style={{
                fontSize: "clamp(14px, 3vw, 17px)",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.8,
                maxWidth: 520,
                margin: "0 auto",
              }}
            >
              A technology company from Kurunegala, Sri Lanka — building
              world-class digital products for businesses of every size.
            </p>
          </FadeSection>
        </div>
      </section>

      {/* Story */}
      <section className="section-pad" style={{ position: "relative" }}>
        <SectionBg style="dots" />
        <div
          className="section-inner-md"
          style={{ position: "relative", zIndex: 1 }}
        >
          <div className="grid-story">
            <div>
              <FadeSection>
                <div className="section-eyebrow">Our Story</div>
              </FadeSection>
              <FadeSection delay={0.1}>
                <h2
                  style={{
                    fontSize: "clamp(1.5rem, 4vw, 2.4rem)",
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "-0.02em",
                    marginBottom: 20,
                    lineHeight: 1.2,
                  }}
                >
                  Born from a passion for technology
                </h2>
              </FadeSection>
              <FadeSection delay={0.2}>
                <p
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.9,
                    fontSize: 15,
                    marginBottom: 14,
                  }}
                >
                  {settings.aboutStory}
                </p>
              </FadeSection>
              <FadeSection delay={0.3}>
                <p
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.9,
                    fontSize: 15,
                  }}
                >
                  Founded in Kurunegala by Randiv and Sarasa, we combine deep
                  technical expertise with a genuine understanding of how local
                  businesses operate.
                </p>
              </FadeSection>
            </div>
            <FadeSection delay={0.2}>
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 20,
                  padding: "2rem",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 64, marginBottom: 14 }}>🐼</div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: "#fff",
                    marginBottom: 4,
                  }}
                >
                  PANDAS DIGITAL
                </div>
                <div
                  style={{
                    color: "#60a5fa",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    marginBottom: 20,
                  }}
                >
                  BUILD · INNOVATE · GROW
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  {[
                    ["8+", "Projects"],
                    ["6+", "Clients"],
                    ["2+", "Years"],
                    ["4", "Services"],
                  ].map(([v, l]) => (
                    <div
                      key={l}
                      style={{
                        background: "rgba(37,99,235,0.1)",
                        borderRadius: 12,
                        padding: "0.875rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "1.6rem",
                          fontWeight: 800,
                          color: "#60a5fa",
                        }}
                      >
                        {v}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.4)",
                          marginTop: 2,
                        }}
                      >
                        {l}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section
        className="section-pad"
        style={{ background: "rgba(255,255,255,0.015)", position: "relative" }}
      >
        <SectionBg style="circuit" />
        <div
          className="section-inner"
          style={{ position: "relative", zIndex: 1 }}
        >
          <FadeSection style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="section-eyebrow">Mission & Vision</div>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.4rem)",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              What Drives Us
            </h2>
          </FadeSection>
          <div
            className="mission-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.25rem",
              marginBottom: "2.5rem",
            }}
          >
            {[
              { icon: "🎯", label: "Our Mission", text: settings.aboutMission },
              { icon: "🔭", label: "Our Vision", text: settings.aboutVision },
            ].map((item, i) => (
              <FadeSection key={item.label} delay={i * 0.1}>
                <div
                  className="card-hover"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 16,
                    padding: "1.75rem",
                    height: "100%",
                  }}
                >
                  <div style={{ fontSize: 26, marginBottom: 10 }}>
                    {item.icon}
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#60a5fa",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 8,
                    }}
                  >
                    {item.label}
                  </div>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 14,
                      lineHeight: 1.75,
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              </FadeSection>
            ))}
          </div>
          <FadeSection style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div className="section-eyebrow">Our Values</div>
            <h2
              style={{
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              What We Stand For
            </h2>
          </FadeSection>
          <div className="grid-auto">
            {values.map((v, i) => (
              <FadeSection key={v.title} delay={i * 0.08}>
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
                  <div style={{ fontSize: 26, marginBottom: 10 }}>{v.icon}</div>
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#fff",
                      fontSize: 15,
                      marginBottom: 6,
                    }}
                  >
                    {v.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.4)",
                      lineHeight: 1.7,
                    }}
                  >
                    {v.desc}
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-pad" style={{ position: "relative" }}>
        <SectionBg style="grid" />
        <div
          className="section-inner-md"
          style={{ position: "relative", zIndex: 1 }}
        >
          <FadeSection style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="section-eyebrow">The Team</div>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.4rem)",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              Meet the Builders
            </h2>
          </FadeSection>
          <div
            className="team-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {team.map((t, i) => (
              <FadeSection key={t.name} delay={i * 0.1}>
                <div
                  className="card-hover"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 20,
                    padding: "1.75rem",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 18,
                        boxShadow: `0 0 20px ${t.color}44`,
                        flexShrink: 0,
                      }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div
                        style={{ fontWeight: 600, color: "#fff", fontSize: 16 }}
                      >
                        {t.name}
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#60a5fa", marginTop: 2 }}
                      >
                        {t.role}
                      </div>
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.45)",
                      lineHeight: 1.75,
                    }}
                  >
                    {t.bio}
                  </p>
                </div>
              </FadeSection>
            ))}
          </div>
          <FadeSection delay={0.2} style={{ marginTop: 14 }}>
            <div
              style={{
                textAlign: "center",
                color: "rgba(255,255,255,0.25)",
                fontSize: 14,
                padding: "1.25rem",
                border: "1px dashed rgba(255,255,255,0.1)",
                borderRadius: 12,
              }}
            >
              🚀 Growing team — new members joining soon
            </div>
          </FadeSection>
        </div>
      </section>

      {/* CTA */}
      <section
        className="section-pad-lg"
        style={{ textAlign: "center", position: "relative" }}
      >
        <SectionBg style="orbs" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <FadeSection>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.6rem)",
                fontWeight: 700,
                color: "#fff",
                marginBottom: 14,
              }}
            >
              Work With Us
            </h2>
          </FadeSection>
          <FadeSection delay={0.1}>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 15,
                marginBottom: 28,
                maxWidth: 400,
                margin: "0 auto 28px",
              }}
            >
              Have a project in mind? We would love to hear about it.
            </p>
          </FadeSection>
          <FadeSection delay={0.2}>
            <Link href="/contact" className="btn-primary-web">
              Get in Touch →
            </Link>
          </FadeSection>
        </div>
      </section>
    </div>
  );
}
