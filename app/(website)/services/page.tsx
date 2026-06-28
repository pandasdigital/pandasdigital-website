"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import FadeSection from "@/components/website/FadeSection";

const defaultServices = [
  {
    icon: "🌐",
    title: "Website Development",
    color: "#2563eb",
    desc: "We build fast, modern, conversion-focused websites for businesses of all sizes.",
    features: [
      "Business & corporate websites",
      "Landing pages that convert",
      "E-commerce stores",
      "Portfolio & photography sites",
      "Custom CMS integration",
      "SEO-ready from day one",
    ],
    tech: ["Next.js", "React", "WordPress", "Tailwind CSS"],
  },
  {
    icon: "📱",
    title: "Mobile App Development",
    color: "#7c3aed",
    desc: "Native and cross-platform mobile apps for Android and iOS — built to perform.",
    features: [
      "Android & iOS apps",
      "Cross-platform (React Native)",
      "App Store & Play Store submission",
      "Push notifications",
      "Offline capabilities",
      "Backend API integration",
    ],
    tech: ["React Native", "Expo", "Flutter"],
  },
  {
    icon: "💻",
    title: "Software Development",
    color: "#059669",
    desc: "Custom business software that automates processes and replaces manual work.",
    features: [
      "ERP systems",
      "CRM platforms",
      "POS systems",
      "Inventory management",
      "HR & payroll systems",
      "Custom dashboards",
    ],
    tech: ["Node.js", "PostgreSQL", "Next.js", "Prisma"],
  },
  {
    icon: "☁️",
    title: "SaaS & AI Products",
    color: "#d97706",
    desc: "Scalable subscription software and AI-powered automation tools.",
    features: [
      "Multi-tenant SaaS platforms",
      "Subscription & billing",
      "AI chatbots & automation",
      "Cloud-hosted solutions",
      "API development",
      "Analytics dashboards",
    ],
    tech: ["Next.js", "OpenAI", "Vercel", "Stripe"],
  },
];

type Service = {
  icon: string;
  title: string;
  color: string;
  desc: string;
  features: string[];
  tech: string[];
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [heading, setHeading] = useState("What We Build");
  const [subheading, setSubheading] = useState(
    "Full-stack digital solutions from design to deployment.",
  );

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) {
          if (d.servicesHeading) setHeading(d.servicesHeading);
          if (d.servicesSubheading) setSubheading(d.servicesSubheading);
        }
      })
      .catch(() => {});

    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const active = data.filter((s: { active: boolean }) => s.active);
          if (active.length > 0) {
            setServices(
              active.map(
                (s: {
                  icon: string;
                  title: string;
                  color?: string;
                  description: string;
                  features: string;
                  techStack?: string;
                }) => ({
                  icon: s.icon,
                  title: s.title,
                  color: s.color || "#2563eb",
                  desc: s.description,
                  features: s.features.split("\n").filter(Boolean),
                  tech: s.techStack
                    ? s.techStack.split(",").map((t: string) => t.trim())
                    : [],
                }),
              ),
            );
          }
        }
      })
      .catch(() => {});
  }, []);

  function getTechColor(color: string) {
    if (color === "#2563eb") return "#93c5fd";
    if (color === "#7c3aed") return "#c4b5fd";
    if (color === "#059669") return "#6ee7b7";
    return "#fcd34d";
  }

  return (
    <div style={{ background: "#030d1a", minHeight: "100vh", paddingTop: 64 }}>
      <section style={{ padding: "6rem 2rem 4rem", textAlign: "center" }}>
        <FadeSection>
          <div className="section-eyebrow">Services</div>
        </FadeSection>
        <FadeSection delay={0.1}>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.03em",
              marginBottom: 20,
            }}
          >
            {heading}
          </h1>
        </FadeSection>
        <FadeSection delay={0.2}>
          <p
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.45)",
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.8,
            }}
          >
            {subheading}
          </p>
        </FadeSection>
      </section>

      <section
        style={{ padding: "2rem 2rem 6rem", maxWidth: 1100, margin: "0 auto" }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {services.map((s, i) => (
            <FadeSection key={s.title} delay={i * 0.1}>
              <div
                className="card-hover"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 20,
                  padding: "2.5rem",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "3rem",
                  alignItems: "start",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        background: `${s.color}18`,
                        borderRadius: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 26,
                      }}
                    >
                      {s.icon}
                    </div>
                    <h2
                      style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}
                    >
                      {s.title}
                    </h2>
                  </div>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      lineHeight: 1.8,
                      fontSize: 15,
                      marginBottom: 24,
                    }}
                  >
                    {s.desc}
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {s.tech.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: 12,
                          padding: "4px 10px",
                          borderRadius: 6,
                          background: `${s.color}15`,
                          color: getTechColor(s.color),
                          border: `1px solid ${s.color}25`,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 14,
                    }}
                  >
                    What is included
                  </div>
                  {s.features.map((f) => (
                    <div
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "7px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <span style={{ color: s.color, fontSize: 14 }}>✓</span>
                      <span
                        style={{
                          fontSize: 14,
                          color: "rgba(255,255,255,0.55)",
                        }}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      <section style={{ padding: "4rem 2rem 6rem", textAlign: "center" }}>
        <FadeSection>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              fontWeight: 700,
              color: "#fff",
              marginBottom: 16,
            }}
          >
            Not sure what you need?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.45)",
              marginBottom: 32,
              lineHeight: 1.8,
            }}
          >
            Tell us about your business and we will recommend the right
            solution.
          </p>
          <Link href="/contact" className="btn-primary-web">
            Talk to Us →
          </Link>
        </FadeSection>
      </section>
    </div>
  );
}
