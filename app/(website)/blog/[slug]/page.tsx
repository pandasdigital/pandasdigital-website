"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import FadeSection from "@/components/website/FadeSection";
import { format } from "date-fns";

type Post = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  coverEmoji: string;
  createdAt: string;
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog?published=true")
      .then((r) => r.json())
      .then((posts: Post[]) => {
        const found = posts.find((p) => p.slug === slug);
        setPost(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading)
    return (
      <div
        style={{
          background: "#030d1a",
          minHeight: "100vh",
          paddingTop: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        Loading...
      </div>
    );

  if (!post)
    return (
      <div
        style={{
          background: "#030d1a",
          minHeight: "100vh",
          paddingTop: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
          color: "rgba(255,255,255,0.4)",
        }}
      >
        <div style={{ fontSize: 48 }}>🔍</div>
        <div>Post not found</div>
        <Link href="/blog" style={{ color: "#60a5fa", textDecoration: "none" }}>
          ← Back to Blog
        </Link>
      </div>
    );

  return (
    <div style={{ background: "#030d1a", minHeight: "100vh", paddingTop: 64 }}>
      <article
        style={{ maxWidth: 720, margin: "0 auto", padding: "5rem 2rem 6rem" }}
      >
        <FadeSection>
          <Link
            href="/blog"
            style={{
              color: "#60a5fa",
              fontSize: 13,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 32,
            }}
          >
            ← Back to Blog
          </Link>
        </FadeSection>
        <FadeSection delay={0.05}>
          <div style={{ fontSize: 56, marginBottom: 24 }}>
            {post.coverEmoji}
          </div>
        </FadeSection>
        <FadeSection delay={0.1}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: 11,
                padding: "3px 10px",
                borderRadius: 20,
                background: "rgba(37,99,235,0.15)",
                color: "#93c5fd",
              }}
            >
              {post.category}
            </span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
              {format(new Date(post.createdAt), "dd MMM yyyy")}
            </span>
          </div>
        </FadeSection>
        <FadeSection delay={0.15}>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            {post.title}
          </h1>
        </FadeSection>
        <FadeSection delay={0.2}>
          <p
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.8,
              marginBottom: 32,
              fontStyle: "italic",
              borderLeft: "3px solid #2563eb",
              paddingLeft: 16,
            }}
          >
            {post.excerpt}
          </p>
        </FadeSection>
        <FadeSection delay={0.25}>
          <div
            style={{
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.9,
              fontSize: 16,
              whiteSpace: "pre-wrap",
            }}
          >
            {post.content}
          </div>
        </FadeSection>
        <FadeSection
          delay={0.3}
          style={{
            marginTop: 48,
            paddingTop: 32,
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <Link
            href="/blog"
            style={{
              color: "#60a5fa",
              fontSize: 14,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            ← More posts
          </Link>
        </FadeSection>
      </article>
    </div>
  );
}
