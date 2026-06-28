"use client";
import { useState, useEffect } from "react";

type Settings = {
  companyName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  tiktok: string;
  youtube: string;
};

const defaults: Settings = {
  companyName: "Pandas Digital",
  tagline: "Build · Innovate · Grow",
  email: "hello@pandasdigital.lk",
  phone: "+94 77 000 0000",
  whatsapp: "+94770000000",
  address: "Kurunegala, Sri Lanka",
  facebook: "#",
  instagram: "#",
  linkedin: "#",
  tiktok: "#",
  youtube: "#",
};

export default function SettingsPage() {
  const [form, setForm] = useState<Settings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setForm({ ...defaults, ...data });
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Company info and social media links
          </p>
        </div>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saved ? "✅ Saved!" : saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Company Info */}
      <div className="card mb-4">
        <h2 className="font-medium text-gray-900 mb-4">Company Info</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="form-label">Company Name</label>
            <input
              className="form-input"
              value={form.companyName}
              onChange={(e) =>
                setForm({ ...form, companyName: e.target.value })
              }
            />
          </div>
          <div className="col-span-2">
            <label className="form-label">Tagline</label>
            <input
              className="form-input"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Phone</label>
            <input
              className="form-input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">WhatsApp Number</label>
            <input
              className="form-input"
              placeholder="+94770000000"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Address</label>
            <input
              className="form-input"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="card">
        <h2 className="font-medium text-gray-900 mb-4">Social Media Links</h2>
        <div className="space-y-3">
          {[
            {
              label: "Facebook",
              key: "facebook",
              icon: "f",
              placeholder: "https://facebook.com/pandasdigital",
            },
            {
              label: "Instagram",
              key: "instagram",
              icon: "▣",
              placeholder: "https://instagram.com/pandasdigital",
            },
            {
              label: "LinkedIn",
              key: "linkedin",
              icon: "in",
              placeholder: "https://linkedin.com/company/pandasdigital",
            },
            {
              label: "TikTok",
              key: "tiktok",
              icon: "♪",
              placeholder: "https://tiktok.com/@pandasdigital",
            },
            {
              label: "YouTube",
              key: "youtube",
              icon: "▶",
              placeholder: "https://youtube.com/@pandasdigital",
            },
          ].map((s) => (
            <div key={s.key} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0">
                {s.icon}
              </div>
              <div className="flex-1">
                <label className="form-label">{s.label}</label>
                <input
                  className="form-input"
                  placeholder={s.placeholder}
                  value={form[s.key as keyof Settings]}
                  onChange={(e) =>
                    setForm({ ...form, [s.key]: e.target.value })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
