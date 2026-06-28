"use client";
import { useState, useEffect } from "react";
import FadeSection from "@/components/website/FadeSection";
import SectionBg from "@/components/website/SectionBg";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [settings, setSettings] = useState({
    contactHeading: "Let's Build Together",
    contactSubheading:
      "Have a project in mind? We will get back to you within 24 hours.",
    email: "hello@pandasdigital.lk",
    phone: "+94 77 000 0000",
    whatsapp: "+94770000000",
    address: "Kurunegala, Sri Lanka",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) setSettings((s) => ({ ...s, ...d }));
      })
      .catch(() => {});
  }, []);

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message)
      return alert("Please fill in name, email and message.");
    setSending(true);
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSent(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      style={{
        background: "#030d1a",
        minHeight: "100vh",
        paddingTop: 64,
        overflowX: "hidden",
      }}
    >
      <section
        className="section-pad-lg"
        style={{ textAlign: "center", position: "relative" }}
      >
        <SectionBg style="orbs" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <FadeSection>
            <div className="section-eyebrow">Contact</div>
          </FadeSection>
          <FadeSection delay={0.1}>
            <h1
              className="text-h1"
              style={{
                fontSize: "clamp(2rem, 7vw, 4rem)",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.03em",
                marginBottom: 16,
              }}
            >
              {settings.contactHeading}
            </h1>
          </FadeSection>
          <FadeSection delay={0.2}>
            <p
              style={{
                fontSize: "clamp(14px, 3vw, 17px)",
                color: "rgba(255,255,255,0.45)",
                maxWidth: 480,
                margin: "0 auto",
                lineHeight: 1.8,
              }}
            >
              {settings.contactSubheading}
            </p>
          </FadeSection>
        </div>
      </section>

      <section className="section-pad" style={{ position: "relative" }}>
        <SectionBg style="dots" />
        <div
          className="section-inner-md"
          style={{ position: "relative", zIndex: 1 }}
        >
          <div className="grid-contact">
            {/* Info */}
            <FadeSection delay={0}>
              <div style={{ marginBottom: 24 }}>
                {[
                  { icon: "📍", label: "Location", val: settings.address },
                  { icon: "📧", label: "Email", val: settings.email },
                  { icon: "💬", label: "WhatsApp", val: settings.phone },
                  {
                    icon: "🕐",
                    label: "Response Time",
                    val: "Within 24 hours",
                  },
                ].map((c) => (
                  <div
                    key={c.label}
                    style={{ display: "flex", gap: 12, marginBottom: 18 }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        background: "rgba(37,99,235,0.1)",
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 17,
                        flexShrink: 0,
                      }}
                    >
                      {c.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.3)",
                          marginBottom: 2,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {c.label}
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          color: "rgba(255,255,255,0.7)",
                          fontWeight: 500,
                          wordBreak: "break-word",
                        }}
                      >
                        {c.val}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  background: "rgba(37,99,235,0.08)",
                  border: "1px solid rgba(37,99,235,0.2)",
                  borderRadius: 14,
                  padding: "1.25rem",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    color: "#fff",
                    fontSize: 14,
                    marginBottom: 6,
                  }}
                >
                  💡 Free Consultation
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.7,
                  }}
                >
                  Free 30-minute consultation for new projects. No commitment
                  required.
                </div>
              </div>
            </FadeSection>

            {/* Form */}
            <FadeSection delay={0.15}>
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20,
                  padding: "clamp(1.25rem, 4vw, 2rem)",
                }}
              >
                {sent ? (
                  <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                    <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
                    <div
                      style={{
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 22,
                        marginBottom: 8,
                      }}
                    >
                      Message Sent!
                    </div>
                    <div
                      style={{ color: "rgba(255,255,255,0.45)", fontSize: 15 }}
                    >
                      We will get back to you within 24 hours.
                    </div>
                  </div>
                ) : (
                  <>
                    <h3
                      style={{
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 18,
                        marginBottom: 20,
                      }}
                    >
                      Send an Inquiry
                    </h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: 14,
                      }}
                    >
                      <div>
                        <label
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.4)",
                            display: "block",
                            marginBottom: 6,
                          }}
                        >
                          Your Name *
                        </label>
                        <input
                          className="form-inp"
                          placeholder="Kamal Perera"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.4)",
                            display: "block",
                            marginBottom: 6,
                          }}
                        >
                          Email *
                        </label>
                        <input
                          className="form-inp"
                          type="email"
                          placeholder="kamal@example.com"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.4)",
                            display: "block",
                            marginBottom: 6,
                          }}
                        >
                          Phone
                        </label>
                        <input
                          className="form-inp"
                          placeholder="+94 77 ..."
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.4)",
                            display: "block",
                            marginBottom: 6,
                          }}
                        >
                          Service
                        </label>
                        <select
                          className="form-inp"
                          value={form.service}
                          onChange={(e) =>
                            setForm({ ...form, service: e.target.value })
                          }
                        >
                          <option value="">Select...</option>
                          <option>Website Development</option>
                          <option>Mobile App</option>
                          <option>Software / ERP / CRM</option>
                          <option>SaaS / AI Product</option>
                          <option>POS System</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.4)",
                            display: "block",
                            marginBottom: 6,
                          }}
                        >
                          Budget
                        </label>
                        <select
                          className="form-inp"
                          value={form.budget}
                          onChange={(e) =>
                            setForm({ ...form, budget: e.target.value })
                          }
                        >
                          <option value="">Select budget...</option>
                          <option>Under LKR 50,000</option>
                          <option>LKR 50,000 – 150,000</option>
                          <option>LKR 150,000 – 500,000</option>
                          <option>LKR 500,000+</option>
                          <option>Let us discuss</option>
                        </select>
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.4)",
                            display: "block",
                            marginBottom: 6,
                          }}
                        >
                          Message *
                        </label>
                        <textarea
                          className="form-inp"
                          rows={4}
                          placeholder="Describe your project..."
                          value={form.message}
                          onChange={(e) =>
                            setForm({ ...form, message: e.target.value })
                          }
                          style={{ resize: "none" }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={sending}
                      className="btn-primary-web"
                      style={{
                        marginTop: 14,
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      {sending ? "Sending..." : "Send Inquiry →"}
                    </button>
                  </>
                )}
              </div>
            </FadeSection>
          </div>
        </div>
      </section>
    </div>
  );
}
