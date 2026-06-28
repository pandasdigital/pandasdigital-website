"use client";
import { useState, useEffect } from "react";
import { differenceInDays, format } from "date-fns";

type Customer = { id: number; name: string };
type Subscription = {
  id: number;
  name: string;
  type: string;
  renewalDate: string;
  cost: number;
  autoRenew: boolean;
  notes: string | null;
  customerId: number | null;
  customer: Customer | null;
};

const emptyForm = {
  name: "",
  type: "Domain",
  renewalDate: "",
  cost: "",
  autoRenew: false,
  notes: "",
  customerId: "",
};

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function fetchData() {
    const [s, c] = await Promise.all([
      fetch("/api/subscriptions").then((r) => r.json()),
      fetch("/api/customers").then((r) => r.json()),
    ]);
    setSubs(s);
    setCustomers(c);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleSubmit() {
    if (!form.name.trim() || !form.renewalDate)
      return alert("Name and renewal date are required");
    setSaving(true);
    await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setShowModal(false);
    setForm(emptyForm);
    fetchData();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this subscription?")) return;
    await fetch("/api/subscriptions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  }

  function getRenewalBadge(dateStr: string) {
    const days = differenceInDays(new Date(dateStr), new Date());
    if (days < 0) return <span className="badge-red">Expired</span>;
    if (days <= 7) return <span className="badge-red">Due in {days}d</span>;
    if (days <= 30) return <span className="badge-amber">Due in {days}d</span>;
    return <span className="badge-green">Active</span>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Subscriptions
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track domains, hosting & renewals
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Subscription
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : subs.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No subscriptions yet
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Customer
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Type
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Renewal Date
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Cost (LKR)
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
              {subs.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-gray-50 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {s.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {s.customer?.name || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge-blue">{s.type}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {format(new Date(s.renewalDate), "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {Number(s.cost).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {getRenewalBadge(s.renewalDate)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(s.id)}
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Add Subscription</h2>
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
                <label className="form-label">Name *</label>
                <input
                  className="form-input"
                  placeholder="e.g. pandasdigital.lk domain"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="form-label">Customer</label>
                <select
                  className="form-input"
                  value={form.customerId}
                  onChange={(e) =>
                    setForm({ ...form, customerId: e.target.value })
                  }
                >
                  <option value="">Internal / No customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Type</label>
                <select
                  className="form-input"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option>Domain</option>
                  <option>Hosting</option>
                  <option>SSL Certificate</option>
                  <option>SaaS License</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="form-label">Renewal Date *</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.renewalDate}
                  onChange={(e) =>
                    setForm({ ...form, renewalDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="form-label">Cost (LKR)</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="0"
                  value={form.cost}
                  onChange={(e) => setForm({ ...form, cost: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="autoRenew"
                  checked={form.autoRenew}
                  onChange={(e) =>
                    setForm({ ...form, autoRenew: e.target.checked })
                  }
                />
                <label htmlFor="autoRenew" className="text-sm text-gray-700">
                  Auto-renew
                </label>
              </div>
              <div className="col-span-2">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Provider, login info location..."
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
                {saving ? "Saving..." : "Add Subscription"}
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
