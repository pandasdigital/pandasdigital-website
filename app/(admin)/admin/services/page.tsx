"use client";
import { useState, useEffect } from "react";

type Service = {
  id: number;
  icon: string;
  title: string;
  description: string;
  features: string;
  techStack: string | null;
  order: number;
  active: boolean;
};

const empty = {
  icon: "🌐",
  title: "",
  description: "",
  features: "",
  techStack: "",
  order: 0,
  active: true,
};

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  async function fetchData() {
    const data = await fetch("/api/services").then((r) => r.json());
    setServices(data);
    setLoading(false);
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await fetch("/api/services").then((r) => r.json());
        if (mounted) {
          setServices(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setServices([]);
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit() {
    if (!form.title.trim()) return alert("Title required");
    setSaving(true);
    if (editing) {
      await fetch("/api/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, ...form }),
      });
    } else {
      await fetch("/api/services", {
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

  function openEdit(s: Service) {
    setForm({
      icon: s.icon,
      title: s.title,
      description: s.description,
      features: s.features,
      techStack: s.techStack || "",
      order: s.order,
      active: s.active,
    });
    setEditing(s.id);
    setShowModal(true);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this service?")) return;
    await fetch("/api/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  }

  async function toggleActive(s: Service) {
    await fetch("/api/services", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: s.id, active: !s.active }),
    });
    fetchData();
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Our Services</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage services shown on your website
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
          + Add Service
        </button>
      </div>

      <div className="space-y-3">
        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {services.map((s) => (
          <div
            key={s.id}
            className={`bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 ${!s.active ? "opacity-50" : ""}`}
          >
            <div className="text-2xl w-10 text-center">{s.icon}</div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{s.title}</div>
              <div className="text-sm text-gray-500 mt-0.5">
                {s.description.substring(0, 80)}...
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleActive(s)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${s.active ? "bg-blue-600" : "bg-gray-200"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${s.active ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
              <button
                onClick={() => openEdit(s)}
                className="text-blue-600 text-xs font-medium hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="text-red-500 text-xs font-medium hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!loading && services.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No services yet — add your first one
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">
                {editing ? "Edit Service" : "Add Service"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="form-label">Icon</label>
                  <input
                    className="form-input text-center text-xl"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  />
                </div>
                <div className="col-span-3">
                  <label className="form-label">Title *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Website Development"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="form-label">Features (one per line)</label>
                <textarea
                  className="form-input"
                  rows={5}
                  placeholder="Business websites&#10;Landing pages&#10;E-commerce"
                  value={form.features}
                  onChange={(e) =>
                    setForm({ ...form, features: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="form-label">
                  Tech Stack (comma separated)
                </label>
                <input
                  className="form-input"
                  placeholder="Next.js, React, Tailwind"
                  value={form.techStack || ""}
                  onChange={(e) =>
                    setForm({ ...form, techStack: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="form-label">Order</label>
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
                {saving ? "Saving..." : editing ? "Update" : "Add Service"}
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
