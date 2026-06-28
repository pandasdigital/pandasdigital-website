import { prisma } from "@/lib/prisma";
import { differenceInDays } from "date-fns";
import Link from "next/link";

export default async function DashboardPage() {
  const today = new Date();

  const [customers, projects, subscriptions, reminders, inquiries] =
    await Promise.all([
      prisma.customer.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.project.findMany({ where: { status: "In Progress" } }),
      prisma.subscription.findMany({ orderBy: { renewalDate: "asc" } }),
      prisma.reminder.findMany({
        where: { done: false },
        orderBy: { dueDate: "asc" },
        take: 5,
      }),
      prisma.inquiry.findMany({
        where: { read: false },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  type Sub = (typeof subscriptions)[number];
  type Customer = (typeof customers)[number];
  type Reminder = (typeof reminders)[number];

  const dueSoon = subscriptions.filter((s: Sub) => {
    const d = differenceInDays(new Date(s.renewalDate), today);
    return d >= 0 && d <= 30;
  });

  // Birthday check — upcoming in next 30 days
  const allCustomers = await prisma.customer.findMany({
    where: { birthday: { not: null } },
  });
  const upcomingBirthdays = allCustomers
    .filter((c) => {
      if (!c.birthday) return false;
      const bday = new Date(c.birthday);
      const thisYear = new Date(
        today.getFullYear(),
        bday.getMonth(),
        bday.getDate(),
      );
      const d = differenceInDays(thisYear, today);
      return d >= 0 && d <= 30;
    })
    .map((c) => {
      const bday = new Date(c.birthday!);
      const thisYear = new Date(
        today.getFullYear(),
        bday.getMonth(),
        bday.getDate(),
      );
      return { ...c, daysUntil: differenceInDays(thisYear, today) };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {today.toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {[
          {
            label: "Customers",
            value: await prisma.customer.count(),
            color: "text-blue-600",
          },
          {
            label: "Active Projects",
            value: projects.length,
            color: "text-blue-600",
          },
          {
            label: "Subscriptions",
            value: subscriptions.length,
            color: "text-blue-600",
          },
          { label: "Due in 30d", value: dueSoon.length, color: "text-red-500" },
          {
            label: "New Inquiries",
            value: inquiries.length,
            color: "text-purple-600",
          },
        ].map((m) => (
          <div key={m.label} className="card">
            <div className={`text-3xl font-semibold ${m.color}`}>{m.value}</div>
            <div className="text-gray-500 text-sm mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* New Inquiries */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-gray-900">💬 New Inquiries</h2>
            <Link
              href="/admin/inquiries"
              className="text-blue-600 text-sm hover:underline"
            >
              View all
            </Link>
          </div>
          {inquiries.length === 0 ? (
            <p className="text-sm text-gray-400">No new inquiries 🎉</p>
          ) : (
            <div className="space-y-3">
              {inquiries.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between p-2 bg-purple-50 rounded-lg"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {q.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {q.service || "General"} · {q.email}
                    </div>
                  </div>
                  <span className="badge-blue">New</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Birthdays */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-gray-900">🎂 Upcoming Birthdays</h2>
            <Link
              href="/admin/customers"
              className="text-blue-600 text-sm hover:underline"
            >
              Customers
            </Link>
          </div>
          {upcomingBirthdays.length === 0 ? (
            <p className="text-sm text-gray-400">
              No birthdays in the next 30 days
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingBirthdays.map((c) => (
                <div key={c.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {c.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {c.businessName || c.phone || ""}
                    </div>
                  </div>
                  <span
                    className={
                      c.daysUntil === 0
                        ? "badge-green"
                        : c.daysUntil <= 7
                          ? "badge-amber"
                          : "badge-blue"
                    }
                  >
                    {c.daysUntil === 0 ? "🎉 Today!" : `in ${c.daysUntil}d`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent customers */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-gray-900">Recent Customers</h2>
            <Link
              href="/admin/customers"
              className="text-blue-600 text-sm hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {customers.length === 0 && (
              <p className="text-sm text-gray-400">No customers yet</p>
            )}
            {customers.map((c: Customer) => (
              <div key={c.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {c.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {c.businessName || c.industry || "—"}
                  </div>
                </div>
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
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming renewals */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-gray-900">Upcoming Renewals</h2>
            <Link
              href="/admin/subscriptions"
              className="text-blue-600 text-sm hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {dueSoon.length === 0 && (
              <p className="text-sm text-gray-400">
                No renewals in next 30 days 🎉
              </p>
            )}
            {dueSoon.map((s: Sub) => {
              const days = differenceInDays(new Date(s.renewalDate), today);
              return (
                <div key={s.id} className="flex items-center justify-between">
                  <div className="text-sm text-gray-800">{s.name}</div>
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
                </div>
              );
            })}
          </div>
        </div>

        {/* Reminders */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-gray-900">Pending Reminders</h2>
            <Link
              href="/admin/reminders"
              className="text-blue-600 text-sm hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {reminders.length === 0 && (
              <p className="text-sm text-gray-400">No pending reminders 🎉</p>
            )}
            {reminders.map((r: Reminder) => {
              const days = differenceInDays(new Date(r.dueDate), today);
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                >
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${r.priority === "High" ? "bg-red-500" : r.priority === "Medium" ? "bg-amber-500" : "bg-green-500"}`}
                  />
                  <div className="flex-1 text-sm text-gray-800">{r.title}</div>
                  <span
                    className={`text-xs font-medium ${days < 0 ? "text-red-500" : days <= 3 ? "text-amber-600" : "text-gray-400"}`}
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
      </div>
    </div>
  );
}
