"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import FadeSection from "@/components/website/FadeSection";

type Product = {
  id: number;
  icon: string;
  title: string;
  description: string;
  features: string;
  status: string;
  active: boolean;
};

export default function ProductsPage() {
  const [heading, setHeading] = useState("Software We Build & Sell");
  const [subheading, setSubheading] = useState(
    "Ready-made digital products built by Pandas Digital.",
  );
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [comingProducts, setComingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) {
          if (d.productsHeading) setHeading(d.productsHeading);
          if (d.productsSubheading) setSubheading(d.productsSubheading);
        }
      })
      .catch(() => {});

    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => {
        if (Array.isArray(data)) {
          setAvailableProducts(
            data.filter((p) => p.active && p.status === "Available"),
          );
          setComingProducts(
            data.filter((p) => p.active && p.status !== "Available"),
          );
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statusBg = (s: string) =>
    s === "Available"
      ? "rgba(34,197,94,0.15)"
      : s === "Beta"
        ? "rgba(245,158,11,0.15)"
        : "rgba(124,58,237,0.15)";

  const statusColor = (s: string) =>
    s === "Available" ? "#4ade80" : s === "Beta" ? "#fbbf24" : "#a78bfa";

  return (
    <div style={{ background: "#030d1a", minHeight: "100vh", paddingTop: 64 }}>
      {/* Hero */}
      <section style={{ padding: "6rem 2rem 4rem", textAlign: "center" }}>
        <FadeSection>
          <div className="section-eyebrow">Our Products</div>
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
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.8,
            }}
          >
            {subheading}
          </p>
        </FadeSection>
      </section>

      {/* Available Products */}
      <section
        style={{ padding: "2rem 2rem 5rem", maxWidth: 1100, margin: "0 auto" }}
      >
        {loading ? (
          <div
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.3)",
              padding: "4rem 0",
            }}
          >
            Loading products...
          </div>
        ) : availableProducts.length === 0 ? (
          <FadeSection>
            <div
              style={{
                textAlign: "center",
                color: "rgba(255,255,255,0.3)",
                padding: "4rem 0",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
              <div>Products coming soon — check back shortly.</div>
            </div>
          </FadeSection>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {availableProducts.map((p, i) => (
              <FadeSection key={p.id} delay={i * 0.1}>
                <div
                  className="card-hover"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 20,
                    padding: "2rem",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 14 }}
                    >
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          background: "rgba(37,99,235,0.15)",
                          borderRadius: 14,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 24,
                        }}
                      >
                        {p.icon}
                      </div>
                      <div
                        style={{ fontWeight: 700, color: "#fff", fontSize: 18 }}
                      >
                        {p.title}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        background: statusBg(p.status),
                        color: statusColor(p.status),
                        border: `1px solid ${statusColor(p.status)}44`,
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontWeight: 500,
                      }}
                    >
                      {p.status === "Available" ? "● " : ""}
                      {p.status}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: 14,
                      lineHeight: 1.7,
                      marginBottom: 20,
                    }}
                  >
                    {p.description}
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "6px 16px",
                      marginBottom: 20,
                    }}
                  >
                    {p.features
                      .split("\n")
                      .filter(Boolean)
                      .map((f) => (
                        <div
                          key={f}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 13,
                            color: "rgba(255,255,255,0.5)",
                          }}
                        >
                          <span style={{ color: "#2563eb" }}>✓</span>
                          {f}
                        </div>
                      ))}
                  </div>
                  <div
                    style={{
                      paddingTop: 16,
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      display: "flex",
                      gap: 12,
                    }}
                  >
                    <Link
                      href="/contact"
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#60a5fa",
                        textDecoration: "none",
                      }}
                    >
                      Request Demo →
                    </Link>
                    <Link
                      href="/contact"
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.35)",
                        textDecoration: "none",
                      }}
                    >
                      Get Pricing
                    </Link>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        )}
      </section>

      {/* Coming Soon */}
      {comingProducts.length > 0 && (
        <section
          style={{
            padding: "4rem 2rem 6rem",
            background: "rgba(255,255,255,0.015)",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <FadeSection style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div className="section-eyebrow">In Development</div>
              <h2
                style={{
                  fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                }}
              >
                Coming Soon
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  marginTop: 12,
                  fontSize: 15,
                }}
              >
                The next generation of Pandas Digital products — in active
                development.
              </p>
            </FadeSection>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1rem",
              }}
            >
              {comingProducts.map((p, i) => (
                <FadeSection key={p.id} delay={i * 0.08}>
                  <div
                    className="card-hover"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(37,99,235,0.06), rgba(124,58,237,0.04))",
                      border: "1px solid rgba(37,99,235,0.15)",
                      borderRadius: 16,
                      padding: "1.5rem",
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 26,
                        width: 44,
                        height: 44,
                        background: "rgba(37,99,235,0.1)",
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {p.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 6,
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#fff",
                            fontSize: 15,
                          }}
                        >
                          {p.title}
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            background: statusBg(p.status),
                            color: statusColor(p.status),
                            border: `1px solid ${statusColor(p.status)}44`,
                            padding: "2px 8px",
                            borderRadius: 20,
                          }}
                        >
                          {p.status}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "rgba(255,255,255,0.4)",
                          lineHeight: 1.6,
                        }}
                      >
                        {p.description}
                      </div>
                    </div>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: "4rem 2rem 6rem", textAlign: "center" }}>
        <FadeSection>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 700,
              color: "#fff",
              marginBottom: 16,
            }}
          >
            Need a custom product?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", marginBottom: 32 }}>
            We build custom software from scratch for your specific business
            needs.
          </p>
          <Link href="/contact" className="btn-primary-web">
            Talk to Us →
          </Link>
        </FadeSection>
      </section>
    </div>
  );
}
