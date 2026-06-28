"use client";
import { useState, useEffect } from "react";

type Product = {
  id: number;
  icon: string;
  title: string;
  description: string;
  features: string;
  status: string;
  order: number;
  active: boolean;
};

const empty = {
  icon: "📦",
  title: "",
  description: "",
  features: "",
  status: "Available",
  order: 0,
  active: true,
};

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  async function fetchData() {
    const data = await fetch("/api/products").then((r) => r.json());
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await fetch("/api/products").then((r) => r.json());
        if (mounted) {
          setProducts(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setProducts([]);
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
      await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, ...form }),
      });
    } else {
      await fetch("/api/products", {
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

  function openEdit(p: Product) {
    setForm({
      icon: p.icon,
      title: p.title,
      description: p.description,
      features: p.features,
      status: p.status,
      order: p.order,
      active: p.active,
    });
    setEditing(p.id);
    setShowModal(true);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this product?")) return;
    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  }

  const statusColors: Record<string, string> = {
    Available: "badge-green",
    "Coming Soon": "badge-blue",
    Beta: "badge-amber",
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Our Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage products shown on your website
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
          + Add Product
        </button>
      </div>

      <div className="space-y-3">
        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {products.map((p) => (
          <div
            key={p.id}
            className={`bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 ${!p.active ? "opacity-50" : ""}`}
          >
            <div className="text-2xl w-10 text-center">{p.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{p.title}</span>
                <span className={statusColors[p.status] || "badge-gray"}>
                  {p.status}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-0.5">
                {p.description.substring(0, 80)}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openEdit(p)}
                className="text-blue-600 text-xs font-medium hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-red-500 text-xs font-medium hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!loading && products.length === 0 && (
          <div className="text-center text-gray-400 py-8">No products yet</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">
                {editing ? "Edit Product" : "Add Product"}
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
                    placeholder="e.g. Pandas POS"
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
                  placeholder="Sales processing&#10;Inventory tracking&#10;Receipt printing"
                  value={form.features}
                  onChange={(e) =>
                    setForm({ ...form, features: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Status</label>
                  <select
                    className="form-input"
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    <option>Available</option>
                    <option>Coming Soon</option>
                    <option>Beta</option>
                  </select>
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
            </div>
            <div className="flex gap-3 mt-5">
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Saving..." : editing ? "Update" : "Add Product"}
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
