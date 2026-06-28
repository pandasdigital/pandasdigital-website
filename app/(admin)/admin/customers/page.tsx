"use client";
import { useState, useEffect } from "react";

type Customer = {
  id: number;
  name: string;
  businessName: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  industry: string | null;
  notes: string | null;
  birthday: string | null;
  createdAt: string;
};

const emptyForm = {
  name: "",
  businessName: "",
  email: "",
  phone: "",
  status: "Active",
  industry: "",
  notes: "",
  birthday: "",
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  async function fetchCustomers() {
    const res = await fetch("/api/customers");
    const data = await res.json();
    setCustomers(data);
    setLoading(false);
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      const res = await fetch("/api/customers");
      const data = await res.json();
      if (mounted) {
        setCustomers(data);
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit() {
    if (!form.name.trim()) return alert("Name is required");
    setSaving(true);
    await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        birthday: form.birthday ? new Date(form.birthday).toISOString() : null,
      }),
    });
    setSaving(false);
    setShowModal(false);
    setForm(emptyForm);
    fetchCustomers();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this customer?")) return;
    await fetch("/api/customers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchCustomers();
  }

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.businessName || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(search.toLowerCase()),
  );

  function formatBirthday(dateStr: string | null) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
          <p className="text-gray-500 text-sm mt-1">
            {customers.length} total customers
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, business or email..."
          className="form-input max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            {search
              ? "No customers match your search"
              : "No customers yet — add your first one!"}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Business
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Contact
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Industry
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Birthday 🎂
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-50 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {c.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {c.businessName || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <div>{c.email || "—"}</div>
                    <div className="text-xs text-gray-400">{c.phone || ""}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {c.industry || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatBirthday(c.birthday)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        c.status === "Active"
                          ? "badge-green"
                          : c.status === "Lead"
                            ? "badge-blue"
                            : "badge-gray"
                      }
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(c.id)}
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
              <h2 className="text-lg font-semibold">Add Customer</h2>
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
                <label className="form-label">Full Name *</label>
                <input
                  className="form-input"
                  placeholder="e.g. Kamal Perera"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="form-label">Business Name</label>
                <input
                  className="form-input"
                  placeholder="e.g. KT Enterprises"
                  value={form.businessName}
                  onChange={(e) =>
                    setForm({ ...form, businessName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input
                  className="form-input"
                  placeholder="+94 77 ..."
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Industry</label>
                <input
                  className="form-input"
                  placeholder="e.g. Retail"
                  value={form.industry}
                  onChange={(e) =>
                    setForm({ ...form, industry: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option>Active</option>
                  <option>Lead</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="form-label">Birthday 🎂</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.birthday}
                  onChange={(e) =>
                    setForm({ ...form, birthday: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Any notes..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Saving..." : "Add Customer"}
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
