"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import FadeSection from "@/components/website/FadeSection";
import { format } from "date-fns";

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  published: boolean;
  coverEmoji: string;
  createdAt: string;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog?published=true")
      .then((r) => r.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(posts.map((p) => p.category))),
  ];
  const [active, setActive] = useState("All");
  const filtered =
    active === "All" ? posts : posts.filter((p) => p.category === active);

  return (
    <div style={{ background: "#030d1a", minHeight: "100vh", paddingTop: 64 }}>
      <section style={{ padding: "6rem 2rem 4rem", textAlign: "center" }}>
        <FadeSection>
          <div className="section-eyebrow">Blog & News</div>
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
            Latest from Pandas Digital
          </h1>
        </FadeSection>
        <FadeSection delay={0.2}>
          <p
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.45)",
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.8,
            }}
          >
            Updates, tutorials, case studies and news from our team.
          </p>
        </FadeSection>
      </section>

      <section
        style={{ padding: "2rem 2rem 6rem", maxWidth: 1000, margin: "0 auto" }}
      >
        {/* Category filter */}
        {categories.length > 1 && (
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 32,
              flexWrap: "wrap",
            }}
          >
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background:
                    active === c ? "#2563eb" : "rgba(255,255,255,0.06)",
                  color: active === c ? "#fff" : "rgba(255,255,255,0.5)",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.3)",
              padding: "5rem 0",
            }}
          >
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.3)",
              padding: "5rem 0",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
            <div>No posts yet — check back soon!</div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {filtered.map((p, i) => (
              <FadeSection key={p.id} delay={i * 0.07}>
                <div
                  className="card-hover"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 20,
                    padding: "2rem",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 16 }}>
                    {p.coverEmoji}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 20,
                        background: "rgba(37,99,235,0.15)",
                        color: "#93c5fd",
                        border: "1px solid rgba(37,99,235,0.2)",
                      }}
                    >
                      {p.category}
                    </span>
                    <span
                      style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}
                    >
                      {format(new Date(p.createdAt), "dd MMM yyyy")}
                    </span>
                  </div>
                  <h2
                    style={{
                      fontWeight: 700,
                      color: "#fff",
                      fontSize: 18,
                      marginBottom: 10,
                      lineHeight: 1.3,
                    }}
                  >
                    {p.title}
                  </h2>
                  <p
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.45)",
                      lineHeight: 1.7,
                      flex: 1,
                    }}
                  >
                    {p.excerpt}
                  </p>
                  <Link
                    href={`/blog/${p.slug}`}
                    style={{
                      marginTop: 20,
                      color: "#60a5fa",
                      fontSize: 13,
                      fontWeight: 500,
                      textDecoration: "none",
                    }}
                  >
                    Read more →
                  </Link>
                </div>
              </FadeSection>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
