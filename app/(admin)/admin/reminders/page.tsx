"use client";
import { useState, useEffect } from "react";
import { differenceInDays, format } from "date-fns";

type Customer = { id: number; name: string };
type Reminder = {
  id: number;
  title: string;
  dueDate: string;
  priority: string;
  notes: string | null;
  done: boolean;
  customerId: number | null;
  customer: Customer | null;
};

const emptyForm = {
  title: "",
  dueDate: "",
  priority: "Medium",
  notes: "",
  customerId: "",
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "done">("pending");

  async function fetchData() {
    const [r, c] = await Promise.all([
      fetch("/api/reminders").then((res) => res.json()),
      fetch("/api/customers").then((res) => res.json()),
    ]);
    setReminders(r);
    setCustomers(c);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleSubmit() {
    if (!form.title.trim() || !form.dueDate)
      return alert("Title and due date are required");
    setSaving(true);
    await fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setShowModal(false);
    setForm(emptyForm);
    fetchData();
  }

  async function toggleDone(id: number, done: boolean) {
    await fetch("/api/reminders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, done: !done }),
    });
    fetchData();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this reminder?")) return;
    await fetch("/api/reminders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  }

  function getDaysLabel(dateStr: string) {
    const days = differenceInDays(new Date(dateStr), new Date());
    if (days < 0) return { label: "Overdue", color: "text-red-500" };
    if (days === 0) return { label: "Today", color: "text-red-500" };
    if (days === 1) return { label: "Tomorrow", color: "text-amber-600" };
    if (days <= 7) return { label: `In ${days} days`, color: "text-amber-600" };
    return { label: `In ${days} days`, color: "text-gray-400" };
  }

  const filtered = reminders.filter((r) =>
    filter === "all" ? true : filter === "pending" ? !r.done : r.done,
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reminders</h1>
          <p className="text-gray-500 text-sm mt-1">
            {reminders.filter((r) => !r.done).length} pending reminders
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Reminder
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(["pending", "all", "done"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? "bg-navy text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            style={filter === f ? { backgroundColor: "#0d1b2e" } : {}}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Reminders list */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No reminders here</div>
        ) : (
          filtered.map((r) => {
            const { label, color } = getDaysLabel(r.dueDate);
            return (
              <div
                key={r.id}
                className={`bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 ${r.done ? "opacity-60" : ""}`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    r.priority === "High"
                      ? "bg-red-500"
                      : r.priority === "Medium"
                        ? "bg-amber-500"
                        : "bg-green-500"
                  }`}
                />
                <div className="flex-1">
                  <div
                    className={`font-medium text-gray-900 ${r.done ? "line-through" : ""}`}
                  >
                    {r.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {r.customer?.name && (
                      <span className="mr-2">👤 {r.customer.name}</span>
                    )}
                    📅 {format(new Date(r.dueDate), "dd MMM yyyy")}
                    {r.notes && <span className="ml-2">· {r.notes}</span>}
                  </div>
                </div>
                <span className={`text-xs font-medium ${color}`}>{label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    r.priority === "High"
                      ? "bg-red-100 text-red-700"
                      : r.priority === "Medium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {r.priority}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleDone(r.id, r.done)}
                    className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors ${
                      r.done
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {r.done ? "Undo" : "Done ✓"}
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-red-400 hover:text-red-600 text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Add Reminder</h2>
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
                <label className="form-label">Title *</label>
                <input
                  className="form-input"
                  placeholder="e.g. Follow up with client"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Due Date *</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="form-label">Priority</label>
                <select
                  className="form-input"
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="form-label">Related Customer</label>
                <select
                  className="form-input"
                  value={form.customerId}
                  onChange={(e) =>
                    setForm({ ...form, customerId: e.target.value })
                  }
                >
                  <option value="">None</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Details..."
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
                {saving ? "Saving..." : "Add Reminder"}
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
