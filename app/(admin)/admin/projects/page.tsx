"use client";
import { useState, useEffect } from "react";

type Customer = { id: number; name: string; businessName: string | null };
type OurProduct = { id: number; title: string; icon: string };
type Project = {
  id: number;
  name: string;
  type: string;
  status: string;
  value: number;
  startDate: string | null;
  description: string | null;
  customerId: number;
  showOnWebsite: boolean;
  productUsed: string | null;
  customer: Customer;
};

const emptyForm = {
  name: "",
  type: "Website",
  status: "In Progress",
  value: "",
  startDate: "",
  description: "",
  customerId: "",
  showOnWebsite: false,
  productUsed: "",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [ourProducts, setOurProducts] = useState<OurProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [p, c, op] = await Promise.all([
          fetch("/api/projects").then((r) => r.json()),
          fetch("/api/customers").then((r) => r.json()),
          fetch("/api/products").then((r) => r.json()),
        ]);
        if (mounted) {
          setProjects(Array.isArray(p) ? p : []);
          setCustomers(Array.isArray(c) ? c : []);
          setOurProducts(Array.isArray(op) ? op : []);
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function fetchData() {
    const [p, c, op] = await Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/customers").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ]);
    setProjects(Array.isArray(p) ? p : []);
    setCustomers(Array.isArray(c) ? c : []);
    setOurProducts(Array.isArray(op) ? op : []);
  }

  async function handleSubmit() {
    if (!form.name.trim()) return alert("Project name is required");
    if (!form.customerId) return alert("Please select a customer");
    setSaving(true);
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        productUsed: form.productUsed || null,
      }),
    });
    setSaving(false);
    setShowModal(false);
    setForm(emptyForm);
    fetchData();
  }

  async function toggleWebsite(id: number, current: boolean) {
    await fetch("/api/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, showOnWebsite: !current }),
    });
    fetchData();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project?")) return;
    await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  }

  const statusColor = (s: string) =>
    s === "Completed"
      ? "badge-green"
      : s === "In Progress"
        ? "badge-amber"
        : s === "Planned"
          ? "badge-blue"
          : "badge-gray";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">
            {projects.length} total ·{" "}
            {projects.filter((p) => p.showOnWebsite).length} shown on website
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Project
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No projects yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Project
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Customer
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Product Used
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Type
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Value (LKR)
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Show on Web
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-50 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-400">
                      {p.description?.substring(0, 40) || ""}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {p.customer?.name || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {p.productUsed ? (
                      <span className="badge-blue">{p.productUsed}</span>
                    ) : (
                      <span className="text-gray-400 text-xs">Custom</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge-blue">{p.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={statusColor(p.status)}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {Number(p.value).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleWebsite(p.id, p.showOnWebsite)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        p.showOnWebsite ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          p.showOnWebsite ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Add Project</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setForm(emptyForm);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="form-label">Product Used (optional)</label>
                <select
                  className="form-input"
                  value={form.productUsed}
                  onChange={(e) =>
                    setForm({ ...form, productUsed: e.target.value })
                  }
                >
                  <option value="">Custom / No specific product</option>
                  {ourProducts.length > 0 ? (
                    ourProducts.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.icon} {p.title}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Pandas POS">🛒 Pandas POS</option>
                      <option value="Pandas ERP">📊 Pandas ERP</option>
                      <option value="Pandas CRM">👥 Pandas CRM</option>
                      <option value="Pandas Inventory">
                        📦 Pandas Inventory
                      </option>
                    </>
                  )}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Add products first in <strong>Our Products</strong> section to
                  see them here
                </p>
              </div>

              <div className="col-span-2">
                <label className="form-label">Customer *</label>
                <select
                  className="form-input"
                  value={form.customerId}
                  onChange={(e) =>
                    setForm({ ...form, customerId: e.target.value })
                  }
                >
                  <option value="">Select customer...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.businessName ? ` (${c.businessName})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product used */}
              <div className="col-span-2">
                <label className="form-label">Product Used (optional)</label>
                <select
                  className="form-input"
                  value={form.productUsed}
                  onChange={(e) =>
                    setForm({ ...form, productUsed: e.target.value })
                  }
                >
                  <option value="">Custom / No specific product</option>
                  {ourProducts.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.icon} {p.title}
                    </option>
                  ))}
                  {/* Manual fallback options */}
                  <option value="Pandas POS">🛒 Pandas POS</option>
                  <option value="Pandas ERP">📊 Pandas ERP</option>
                  <option value="Pandas CRM">👥 Pandas CRM</option>
                  <option value="Pandas Inventory">📦 Pandas Inventory</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Which Pandas Digital product was used or deployed for this
                  project?
                </p>
              </div>

              <div>
                <label className="form-label">Type</label>
                <select
                  className="form-input"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option>Website</option>
                  <option>Mobile App</option>
                  <option>SaaS Platform</option>
                  <option>Software</option>
                  <option>ERP/CRM</option>
                  <option>POS System</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Planned</option>
                  <option>On Hold</option>
                </select>
              </div>

              <div>
                <label className="form-label">Value (LKR)</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="0"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Start Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                />
              </div>

              <div className="col-span-2">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="What was built and why..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div className="col-span-2 flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <input
                  type="checkbox"
                  id="showOnWebsite"
                  checked={form.showOnWebsite}
                  onChange={(e) =>
                    setForm({ ...form, showOnWebsite: e.target.checked })
                  }
                  className="w-4 h-4 accent-blue-600"
                />
                <label
                  htmlFor="showOnWebsite"
                  className="text-sm font-medium text-gray-700"
                >
                  Show on public website
                  <span className="block text-xs text-gray-500 font-normal">
                    Customer gave permission to display this project
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Saving..." : "Add Project"}
              </button>
              <button
                className="btn-outline"
                onClick={() => {
                  setShowModal(false);
                  setForm(emptyForm);
                }}
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
