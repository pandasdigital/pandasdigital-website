"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";

type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  budget: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("unread");

  async function fetchData() {
    const data = await fetch("/api/inquiries").then((r) => r.json());
    setInquiries(data);
    setLoading(false);
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await fetch("/api/inquiries").then((r) => r.json());
        if (mounted) {
          setInquiries(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setInquiries([]);
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function markRead(id: number, read: boolean) {
    await fetch("/api/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read }),
    });
    fetchData();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this inquiry?")) return;
    await fetch("/api/inquiries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (selected?.id === id) setSelected(null);
    fetchData();
  }

  const filtered = inquiries.filter((q) =>
    filter === "all" ? true : filter === "unread" ? !q.read : q.read,
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inquiries</h1>
          <p className="text-gray-500 text-sm mt-1">
            {inquiries.filter((q) => !q.read).length} unread ·{" "}
            {inquiries.length} total
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {(["unread", "all", "read"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f ? "text-white" : "bg-gray-100 text-gray-600"}`}
            style={filter === f ? { backgroundColor: "#0d1b2e" } : {}}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* List */}
        <div className="space-y-3">
          {loading && <p className="text-gray-400 text-sm p-4">Loading...</p>}
          {!loading && filtered.length === 0 && (
            <p className="text-gray-400 text-sm p-4">No inquiries here</p>
          )}
          {filtered.map((q) => (
            <div
              key={q.id}
              onClick={() => {
                setSelected(q);
                if (!q.read) markRead(q.id, true);
              }}
              className={`bg-white border rounded-xl p-4 cursor-pointer transition-all ${selected?.id === q.id ? "border-blue-400 shadow-md" : "border-gray-100 hover:border-gray-200"} ${!q.read ? "border-l-4 border-l-blue-500" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 text-sm">
                      {q.name}
                    </span>
                    {!q.read && <span className="badge-blue">New</span>}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    {q.email} {q.phone ? `· ${q.phone}` : ""}
                  </div>
                  {q.service && <span className="badge-gray">{q.service}</span>}
                  <p className="text-xs text-gray-500 mt-2 truncate">
                    {q.message}
                  </p>
                </div>
                <div className="text-xs text-gray-400 flex-shrink-0">
                  {format(new Date(q.createdAt), "dd MMM")}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail */}
        <div>
          {selected ? (
            <div className="bg-white border border-gray-100 rounded-xl p-5 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Inquiry Detail</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => markRead(selected.id, !selected.read)}
                    className="text-xs px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    {selected.read ? "Mark Unread" : "Mark Read"}
                  </button>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Name", val: selected.name },
                  { label: "Email", val: selected.email },
                  { label: "Phone", val: selected.phone || "—" },
                  { label: "Service", val: selected.service || "—" },
                  { label: "Budget", val: selected.budget || "—" },
                  {
                    label: "Received",
                    val: format(
                      new Date(selected.createdAt),
                      "dd MMM yyyy, HH:mm",
                    ),
                  },
                ].map((f) => (
                  <div key={f.label} className="flex gap-3 text-sm">
                    <span className="text-gray-400 w-20 flex-shrink-0">
                      {f.label}
                    </span>
                    <span className="text-gray-800 font-medium">{f.val}</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-50">
                  <div className="text-gray-400 text-xs mb-2">Message</div>
                  <p className="text-gray-800 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                    {selected.message}
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <a
                    href={`mailto:${selected.email}`}
                    className="btn-primary text-xs py-2 px-4"
                  >
                    Reply via Email
                  </a>
                  {selected.phone && (
                    <a
                      href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline text-xs py-2 px-4"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-gray-400">
              <div className="text-3xl mb-2">💬</div>
              <div className="text-sm">Click an inquiry to view details</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
