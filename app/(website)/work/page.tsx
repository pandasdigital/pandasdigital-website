"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Project = {
  id: number;
  name: string;
  type: string;
  status: string;
  description: string | null;
  productUsed: string | null;
  showOnWebsite: boolean;
  customer: { name: string; businessName: string | null } | null;
};

const tagColors: Record<string, { bg: string; color: string }> = {
  Website: { bg: "rgba(37,99,235,0.15)", color: "#93c5fd" },
  "Mobile App": { bg: "rgba(124,58,237,0.15)", color: "#c4b5fd" },
  "SaaS Platform": { bg: "rgba(217,119,6,0.15)", color: "#fcd34d" },
  Software: { bg: "rgba(5,150,105,0.15)", color: "#6ee7b7" },
  "ERP/CRM": { bg: "rgba(220,38,38,0.15)", color: "#fca5a5" },
  "POS System": { bg: "rgba(37,99,235,0.15)", color: "#93c5fd" },
  Other: { bg: "rgba(100,116,139,0.15)", color: "#94a3b8" },
};

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/projects?public=true")
      .then((r) => r.json())
      .then((data) => {
        if (mounted) {
          setProjects(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={{ background: "#030d1a", minHeight: "100vh", paddingTop: 64 }}>
      <section style={{ padding: "6rem 2rem 4rem", textAlign: "center" }}>
        <div className="section-eyebrow">Portfolio</div>
        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.03em",
            marginBottom: 20,
          }}
        >
          Projects We&apos;ve Shipped
        </h1>
        <p
          style={{
            fontSize: 17,
            color: "rgba(255,255,255,0.45)",
            maxWidth: 520,
            margin: "0 auto",
            lineHeight: 1.8,
          }}
        >
          Real products, real clients, real results. A selection of work we are
          proud to share.
        </p>
      </section>

      <section
        style={{ padding: "2rem 2rem 6rem", maxWidth: 1100, margin: "0 auto" }}
      >
        {loading ? (
          <div
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.3)",
              padding: "5rem 0",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            <div>Loading projects...</div>
          </div>
        ) : projects.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.3)",
              padding: "5rem 0",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
            <div
              style={{
                fontSize: 18,
                marginBottom: 8,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Portfolio coming soon
            </div>
            <div style={{ fontSize: 14 }}>
              We are adding our projects — check back soon.
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {projects.map((p) => {
              const tc = tagColors[p.type] || tagColors.Other;
              return (
                <div
                  key={p.id}
                  className="card-hover"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 20,
                    padding: "2rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        background: "rgba(37,99,235,0.1)",
                        borderRadius: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 24,
                      }}
                    >
                      💼
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: tc.bg,
                        color: tc.color,
                        fontWeight: 500,
                      }}
                    >
                      {p.type}
                    </span>
                  </div>

                  <div
                    style={{
                      fontWeight: 700,
                      color: "#fff",
                      fontSize: 18,
                      marginBottom: 8,
                    }}
                  >
                    {p.name}
                  </div>

                  {p.productUsed && (
                    <div style={{ marginBottom: 8 }}>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "2px 8px",
                          borderRadius: 20,
                          background: "rgba(37,99,235,0.15)",
                          color: "#93c5fd",
                          border: "1px solid rgba(37,99,235,0.25)",
                        }}
                      >
                        🔧 {p.productUsed}
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.4)",
                      marginBottom: 16,
                      lineHeight: 1.7,
                    }}
                  >
                    {p.description ||
                      "A custom digital solution built for this client."}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      paddingTop: 14,
                    }}
                  >
                    <div
                      style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}
                    >
                      {p.customer?.name || p.customer?.businessName || "Client"}
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background:
                          p.status === "Completed"
                            ? "rgba(34,197,94,0.1)"
                            : "rgba(245,158,11,0.1)",
                        color: p.status === "Completed" ? "#4ade80" : "#fbbf24",
                        fontWeight: 500,
                      }}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section style={{ padding: "2rem 2rem 6rem", textAlign: "center" }}>
        <h2
          style={{
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            fontWeight: 700,
            color: "#fff",
            marginBottom: 16,
          }}
        >
          Want your project here?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 32 }}>
          Let&apos;s build something great together.
        </p>
        <Link href="/contact" className="btn-primary-web">
          Start a Project →
        </Link>
      </section>
    </div>
  );
}
