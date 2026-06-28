import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import SessionProvider from "@/components/admin/SessionProvider";
import NotificationBell from "@/components/admin/NotificationBell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <SessionProvider session={session}>
      <style>{`
        @media (max-width: 768px) {
          .admin-topbar-name { padding-left: 56px; }
        }
      `}</style>
      <div
        style={{
          display: "flex",
          height: "100vh",
          background: "#f8fafc",
          overflow: "hidden",
        }}
      >
        <Sidebar />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minWidth: 0,
          }}
        >
          {/* Top bar */}
          <div
            style={{
              height: 52,
              background: "#fff",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 1.25rem",
              flexShrink: 0,
            }}
          >
            <div
              className="admin-topbar-name"
              style={{ fontSize: 13, color: "#64748b" }}
            >
              Welcome back,{" "}
              <span style={{ fontWeight: 600, color: "#0d1b2e" }}>
                {session.user?.name?.split(" ")[0] ?? "Admin"}
              </span>
            </div>
            <div
              style={{
                background: "#0d1b2e",
                borderRadius: 10,
                padding: "4px 8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <NotificationBell />
            </div>
          </div>
          <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
