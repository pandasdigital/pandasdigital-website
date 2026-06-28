"use client";
import { useState, useEffect } from "react";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  text: string;
  avatar: string;
  active: boolean;
  order: number;
};

const empty = {
  name: "",
  role: "",
  text: "",
  avatar: "",
  active: true,
  order: 0,
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => {
        if (mounted) {
          setTestimonials(Array.isArray(data) ? data : []);
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

  async function fetchData() {
    const data = await fetch("/api/testimonials").then((r) => r.json());
    setTestimonials(Array.isArray(data) ? data : []);
  }

  async function handleSubmit() {
    if (!form.name || !form.text)
      return alert("Name and testimonial text are required");
    setSaving(true);
    if (editing) {
      await fetch("/api/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, ...form }),
      });
    } else {
      await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setSaving(false);
    setShowModal(false);
    setEditing(null);
    setForm(empty);
    fetchData();
  }

  function openEdit(t: Testimonial) {
    setForm({
      name: t.name,
      role: t.role,
      text: t.text,
      avatar: t.avatar,
      active: t.active,
      order: t.order,
    });
    setEditing(t.id);
    setShowModal(true);
  }

  async function toggleActive(t: Testimonial) {
    await fetch("/api/testimonials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: t.id, active: !t.active }),
    });
    fetchData();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this testimonial?")) return;
    await fetch("/api/testimonials", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage client testimonials shown on the website
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setForm(empty);
            setEditing(null);
            setShowModal(true);
          }}
        >
          + Add Testimonial
        </button>
      </div>

      <div className="space-y-3">
        {loading && <p className="text-gray-400 text-sm p-4">Loading...</p>}
        {!loading && testimonials.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            <div className="text-3xl mb-2">⭐</div>
            <div>No testimonials yet — add your first client review!</div>
          </div>
        )}
        {testimonials.map((t) => (
          <div
            key={t.id}
            className={`bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-4 ${!t.active ? "opacity-50" : ""}`}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              {t.avatar || t.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900 text-sm">
                  {t.name}
                </span>
                <span className="text-gray-400 text-xs">· {t.role}</span>
              </div>
              <p className="text-sm text-gray-600 italic line-clamp-2">
                &quot;{t.text}&quot;
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => toggleActive(t)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${t.active ? "bg-blue-600" : "bg-gray-200"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${t.active ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
              <button
                onClick={() => openEdit(t)}
                className="text-blue-600 text-xs font-medium hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="text-red-500 text-xs font-medium hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">
                {editing ? "Edit Testimonial" : "Add Testimonial"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Client Name *</label>
                  <input
                    className="form-input"
                    placeholder="Kamal Perera"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Avatar Initials</label>
                  <input
                    className="form-input"
                    placeholder="KP"
                    maxLength={2}
                    value={form.avatar}
                    onChange={(e) =>
                      setForm({ ...form, avatar: e.target.value.toUpperCase() })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Role / Company</label>
                <input
                  className="form-input"
                  placeholder="Owner, Besilika Stores"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Testimonial Text *</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="What did the client say about working with Pandas Digital?"
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Order (lower = first)</label>
                <input
                  className="form-input"
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm({ ...form, order: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Saving..." : editing ? "Update" : "Add Testimonial"}
              </button>
              <button
                className="btn-outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
