"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  Bell,
  Globe,
  Settings,
  LogOut,
  MessageSquare,
  ShoppingBag,
  Layers,
  Star,
  BookOpen,
  Receipt,
  Menu,
  X,
  BellRing,
} from "lucide-react";

type LinkItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  divider?: never;
};
type DividerItem = { divider: true; label: string; href?: never; icon?: never };
type NavItem = LinkItem | DividerItem;

const NAV_LINKS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/notifications", label: "Notifications", icon: BellRing },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { divider: true, label: "Clients" },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/invoices", label: "Invoices", icon: Receipt },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: Calendar },
  { href: "/admin/reminders", label: "Reminders", icon: Bell },
  { divider: true, label: "Website" },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/blog", label: "Blog / News", icon: BookOpen },
  { href: "/admin/services", label: "Our Services", icon: Layers },
  { href: "/admin/products", label: "Our Products", icon: ShoppingBag },
  { href: "/admin/editor", label: "Website Editor", icon: Globe },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

// ── Defined OUTSIDE Sidebar component ──
function SidebarInner({
  path,
  onClose,
  showClose,
}: {
  path: string;
  onClose: () => void;
  showClose: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#0d1b2e",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1rem",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg,#2563eb,#7c3aed)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            🐼
          </div>
          <div>
            <div
              style={{
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              Pandas Digital
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 10,
                marginTop: 2,
              }}
            >
              Admin Panel
            </div>
          </div>
        </div>
        {showClose && (
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0" }}>
        {NAV_LINKS.map((item, i) => {
          if ("divider" in item && item.divider) {
            return (
              <div
                key={`div-${i}`}
                style={{
                  padding: "0.875rem 1rem 0.25rem",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.25)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                }}
              >
                {item.label}
              </div>
            );
          }
          const active = path === item.href;
          const Icon = (item as LinkItem).icon;
          return (
            <Link
              key={item.href}
              href={item.href!}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 1rem",
                fontSize: 13,
                textDecoration: "none",
                color: active ? "#fff" : "rgba(255,255,255,0.5)",
                background: active ? "rgba(37,99,235,0.15)" : "transparent",
                borderRight: active
                  ? "2px solid #2563eb"
                  : "2px solid transparent",
                transition: "all 0.15s",
              }}
            >
              <Icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div
        style={{
          padding: "0.75rem",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            color: "rgba(255,255,255,0.45)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            width: "100%",
            borderRadius: 8,
          }}
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const path = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <style>{`
        .admin-sidebar-desktop { display: flex; width: 210px; flex-shrink: 0; height: 100vh; position: sticky; top: 0; }
        .admin-mobile-btn { display: none; }
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-mobile-btn { display: flex !important; position: fixed; top: 14px; left: 14px; z-index: 400; background: #0d1b2e; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 8px; color: #fff; cursor: pointer; align-items: center; justify-content: center; }
        }
        .sidebar-drawer { position: fixed; top: 0; left: 0; bottom: 0; width: 220px; z-index: 350; transform: translateX(-100%); transition: transform 0.3s ease; }
        .sidebar-drawer.open { transform: translateX(0); }
        .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.65); z-index: 340; }
        .sidebar-overlay.open { display: block; }
        nav a:hover { color: #fff !important; background: rgba(255,255,255,0.07) !important; }
      `}</style>

      {/* Desktop */}
      <div className="admin-sidebar-desktop">
        <SidebarInner path={path} onClose={() => {}} showClose={false} />
      </div>

      {/* Mobile hamburger */}
      <button className="admin-mobile-btn" onClick={() => setMobileOpen(true)}>
        <Menu size={20} />
      </button>

      {/* Overlay */}
      <div
        className={`sidebar-overlay${mobileOpen ? " open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Drawer */}
      <div className={`sidebar-drawer${mobileOpen ? " open" : ""}`}>
        <SidebarInner
          path={path}
          onClose={() => setMobileOpen(false)}
          showClose={true}
        />
      </div>
    </>
  );
}
