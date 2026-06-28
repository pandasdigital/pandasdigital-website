"use client";
import { useState, useEffect } from "react";
import { format, differenceInDays } from "date-fns";

type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};
type Sub = {
  id: number;
  name: string;
  renewalDate: string;
  cost: number;
  customer: { name: string } | null;
};
type Reminder = {
  id: number;
  title: string;
  dueDate: string;
  priority: string;
  done: boolean;
  customer: { name: string } | null;
};
type Birthday = {
  id: number;
  name: string;
  birthday: string;
  phone: string | null;
  businessName: string | null;
};

export default function NotificationsPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [subs, setSubs] = useState<Sub[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [inq, sub, rem, cust] = await Promise.all([
          fetch("/api/inquiries").then((r) => r.json()),
          fetch("/api/subscriptions").then((r) => r.json()),
          fetch("/api/reminders").then((r) => r.json()),
          fetch("/api/customers").then((r) => r.json()),
        ]);
        if (mounted) {
          setInquiries(
            Array.isArray(inq) ? inq.filter((q: Inquiry) => !q.read) : [],
          );
          const dueSubs = Array.isArray(sub)
            ? sub.filter((s: Sub) => {
                const d = differenceInDays(new Date(s.renewalDate), today);
                return d >= 0 && d <= 30;
              })
            : [];
          setSubs(dueSubs);
          setReminders(
            Array.isArray(rem) ? rem.filter((r: Reminder) => !r.done) : [],
          );
          const bdays = Array.isArray(cust)
            ? cust.filter((c: Birthday) => {
                if (!c.birthday) return false;
                const b = new Date(c.birthday);
                const thisYear = new Date(
                  today.getFullYear(),
                  b.getMonth(),
                  b.getDate(),
                );
                const d = differenceInDays(thisYear, today);
                return d >= 0 && d <= 30;
              })
            : [];
          setBirthdays(bdays);
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

  async function markRead(id: number) {
    await fetch("/api/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    setInquiries((i) => i.filter((q) => q.id !== id));
  }

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  const total =
    inquiries.length + subs.length + reminders.length + birthdays.length;

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
        <p className="text-gray-500 text-sm mt-1">
          {total === 0
            ? "All clear! Nothing needs attention."
            : `${total} items need your attention`}
        </p>
      </div>

      {total === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🎉</div>
          <div className="text-lg font-medium text-gray-600 mb-2">
            You are all caught up!
          </div>
          <div className="text-sm">
            No unread inquiries, no renewals due, no pending reminders.
          </div>
        </div>
      )}

      {/* New Inquiries */}
      {inquiries.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <h2 className="font-semibold text-gray-900">
              New Inquiries ({inquiries.length})
            </h2>
          </div>
          <div className="space-y-2">
            {inquiries.map((q) => (
              <div key={q.id} className="card flex items-start gap-4">
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  💬
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 text-sm">
                      {q.name}
                    </span>
                    <span className="badge-blue">{q.service || "General"}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{q.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {q.email} ·{" "}
                    {format(new Date(q.createdAt), "dd MMM yyyy, HH:mm")}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <a
                    href={`mailto:${q.email}`}
                    className="text-xs px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100"
                  >
                    Reply
                  </a>
                  <button
                    onClick={() => markRead(q.id)}
                    className="text-xs px-3 py-1 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200"
                  >
                    Done
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Birthdays */}
      {birthdays.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-pink-500"></div>
            <h2 className="font-semibold text-gray-900">
              Upcoming Birthdays ({birthdays.length})
            </h2>
          </div>
          <div className="space-y-2">
            {birthdays.map((c) => {
              const b = new Date(c.birthday);
              const thisYear = new Date(
                today.getFullYear(),
                b.getMonth(),
                b.getDate(),
              );
              const days = differenceInDays(thisYear, today);
              return (
                <div key={c.id} className="card flex items-center gap-4">
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#ec4899,#f97316)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    🎂
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">
                      {c.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {c.businessName || c.phone || ""} ·{" "}
                      {format(new Date(c.birthday), "dd MMM")}
                    </div>
                  </div>
                  <span
                    className={
                      days === 0
                        ? "badge-green"
                        : days <= 3
                          ? "badge-red"
                          : days <= 7
                            ? "badge-amber"
                            : "badge-blue"
                    }
                  >
                    {days === 0 ? "🎉 Today!" : `in ${days}d`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subscription Renewals */}
      {subs.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <h2 className="font-semibold text-gray-900">
              Renewals Due ({subs.length})
            </h2>
          </div>
          <div className="space-y-2">
            {subs.map((s) => {
              const days = differenceInDays(new Date(s.renewalDate), today);
              return (
                <div key={s.id} className="card flex items-center gap-4">
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#f59e0b,#ef4444)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    📅
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">
                      {s.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {s.customer?.name || "Internal"} · LKR{" "}
                      {Number(s.cost).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={
                        days <= 7
                          ? "badge-red"
                          : days <= 14
                            ? "badge-amber"
                            : "badge-green"
                      }
                    >
                      {days === 0 ? "Today" : `${days}d`}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">
                      {format(new Date(s.renewalDate), "dd MMM yyyy")}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pending Reminders */}
      {reminders.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <h2 className="font-semibold text-gray-900">
              Pending Reminders ({reminders.length})
            </h2>
          </div>
          <div className="space-y-2">
            {reminders.map((r) => {
              const days = differenceInDays(new Date(r.dueDate), today);
              return (
                <div key={r.id} className="card flex items-center gap-4">
                  <div
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${r.priority === "High" ? "bg-red-500" : r.priority === "Medium" ? "bg-amber-500" : "bg-green-500"}`}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">
                      {r.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {r.customer?.name || "No customer"} · Due{" "}
                      {format(new Date(r.dueDate), "dd MMM yyyy")}
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium ${days < 0 ? "text-red-500" : days === 0 ? "text-amber-600" : "text-gray-400"}`}
                  >
                    {days < 0
                      ? "Overdue"
                      : days === 0
                        ? "Today"
                        : `in ${days}d`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
