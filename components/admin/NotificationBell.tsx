"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Bell } from "lucide-react";

type Inquiry = {
  id: number;
  name: string;
  email: string;
  service: string | null;
  createdAt: string;
  read: boolean;
};

export default function NotificationBell() {
  const [unread, setUnread] = useState<Inquiry[]>([]);
  const [open, setOpen] = useState(false);
  const [notifPermission, setNotifPermission] = useState<string>("default");
  const prevCount = useRef(0);
  const ref = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Get permission AFTER mount — not synchronously in effect
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      if (typeof window !== "undefined" && "Notification" in window) {
        // Schedule this to next tick to avoid sync setState
        setTimeout(() => {
          setNotifPermission(Notification.permission);
        }, 0);
      }
    }
  }, []);

  const checkInquiries = useCallback(() => {
    fetch("/api/inquiries")
      .then((r) => r.json())
      .then((data) => {
        const list: Inquiry[] = Array.isArray(data)
          ? data.filter((q) => !q.read)
          : [];
        if (list.length > prevCount.current && prevCount.current > 0) {
          if (
            notifPermission === "granted" &&
            typeof Notification !== "undefined"
          ) {
            new Notification("🐼 New Inquiry!", {
              body: `${list[0].name} sent an inquiry`,
            });
          }
        }
        prevCount.current = list.length;
        setUnread(list);
      })
      .catch(() => {});
  }, [notifPermission]);

  useEffect(() => {
    checkInquiries();
    const id = setInterval(checkInquiries, 30000);
    return () => clearInterval(id);
  }, [checkInquiries]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function requestPermission() {
    if (typeof Notification === "undefined") return;
    const p = await Notification.requestPermission();
    setNotifPermission(p);
  }

  async function markRead(id: number) {
    await fetch("/api/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    setUnread((u) => u.filter((q) => q.id !== id));
    prevCount.current = Math.max(0, prevCount.current - 1);
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "relative",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "8px",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          color: "rgba(255,255,255,0.65)",
        }}
      >
        <Bell size={18} />
        {unread.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 16,
              height: 16,
              background: "#ef4444",
              borderRadius: "50%",
              fontSize: 10,
              fontWeight: 700,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #0d1b2e",
            }}
          >
            {unread.length > 9 ? "9+" : unread.length}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            width: 300,
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            zIndex: 400,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 14, color: "#0d1b2e" }}>
              Notifications
            </span>
            {notifPermission === "default" && (
              <button
                onClick={requestPermission}
                style={{
                  fontSize: 11,
                  color: "#2563eb",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Enable alerts
              </button>
            )}
          </div>
          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            {unread.length === 0 ? (
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "#94a3b8",
                  fontSize: 13,
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>🎉</div>
                All caught up!
              </div>
            ) : (
              unread.map((q) => (
                <div
                  key={q.id}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #f8fafc",
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    💬
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#0d1b2e",
                      }}
                    >
                      {q.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      {q.service || "General inquiry"}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}
                    >
                      {q.email}
                    </div>
                  </div>
                  <button
                    onClick={() => markRead(q.id)}
                    style={{
                      fontSize: 11,
                      color: "#2563eb",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      flexShrink: 0,
                      fontWeight: 500,
                    }}
                  >
                    Done
                  </button>
                </div>
              ))
            )}
          </div>
          {unread.length > 0 && (
            <div
              style={{ padding: "10px 16px", borderTop: "1px solid #f1f5f9" }}
            >
              <a
                href="/admin/inquiries"
                style={{
                  fontSize: 12,
                  color: "#2563eb",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                View all inquiries →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
