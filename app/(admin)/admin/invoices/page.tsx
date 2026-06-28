"use client";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";

type Customer = {
  id: number;
  name: string;
  businessName: string | null;
  email: string | null;
  phone: string | null;
};
type LineItem = { description: string; qty: number; rate: number };
type Invoice = {
  id: number;
  invoiceNo: string;
  type: string;
  status: string;
  items: string;
  notes: string | null;
  subtotal: number;
  discount: number;
  total: number;
  dueDate: string | null;
  createdAt: string;
  customer: Customer;
};

const emptyForm = {
  customerId: "",
  type: "Invoice",
  status: "Draft",
  notes: "",
  discount: "0",
  dueDate: "",
};

const emptyItem: LineItem = { description: "", qty: 1, rate: 0 };

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewing, setViewing] = useState<Invoice | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [items, setItems] = useState<LineItem[]>([{ ...emptyItem }]);
  const [saving, setSaving] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [inv, cust] = await Promise.all([
          fetch("/api/invoices").then((r) => r.json()),
          fetch("/api/customers").then((r) => r.json()),
        ]);
        if (mounted) {
          setInvoices(Array.isArray(inv) ? inv : []);
          setCustomers(Array.isArray(cust) ? cust : []);
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
    const [inv, cust] = await Promise.all([
      fetch("/api/invoices").then((r) => r.json()),
      fetch("/api/customers").then((r) => r.json()),
    ]);
    setInvoices(Array.isArray(inv) ? inv : []);
    setCustomers(Array.isArray(cust) ? cust : []);
  }

  function calcTotals() {
    const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0);
    const discount = Number(form.discount) || 0;
    const total = subtotal - discount;
    return { subtotal, total };
  }

  async function handleSubmit() {
    if (!form.customerId) return alert("Select a customer");
    if (items.some((i) => !i.description))
      return alert("Fill in all item descriptions");
    const { subtotal, total } = calcTotals();
    setSaving(true);
    await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        items: JSON.stringify(items),
        subtotal,
        total,
      }),
    });
    setSaving(false);
    setShowModal(false);
    setForm(emptyForm);
    setItems([{ ...emptyItem }]);
    fetchData();
  }

  async function updateStatus(id: number, status: string) {
    await fetch("/api/invoices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchData();
    if (viewing?.id === id) setViewing((v) => (v ? { ...v, status } : v));
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this invoice?")) return;
    await fetch("/api/invoices", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (viewing?.id === id) setViewing(null);
    fetchData();
  }

  function handlePrint() {
    window.print();
  }

  function addItem() {
    setItems([...items, { ...emptyItem }]);
  }
  function removeItem(i: number) {
    setItems(items.filter((_, idx) => idx !== i));
  }
  function updateItem(i: number, field: keyof LineItem, val: string | number) {
    setItems(
      items.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)),
    );
  }

  const statusColors: Record<string, string> = {
    Draft: "badge-gray",
    Sent: "badge-blue",
    Paid: "badge-green",
    Cancelled: "badge-red",
  };

  const { subtotal, total } = calcTotals();

  return (
    <div className="p-6">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-print, #invoice-print * { visibility: visible; }
          #invoice-print { position: fixed; inset: 0; }
        }
      `}</style>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Invoices & Quotations
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {invoices.length} total · LKR{" "}
            {invoices
              .filter((i) => i.status === "Paid")
              .reduce((s, i) => s + i.total, 0)
              .toLocaleString()}{" "}
            collected
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setForm(emptyForm);
            setItems([{ ...emptyItem }]);
            setShowModal(true);
          }}
        >
          + Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Total Invoiced",
            value: `LKR ${invoices.reduce((s, i) => s + i.total, 0).toLocaleString()}`,
            color: "text-blue-600",
          },
          {
            label: "Collected",
            value: `LKR ${invoices
              .filter((i) => i.status === "Paid")
              .reduce((s, i) => s + i.total, 0)
              .toLocaleString()}`,
            color: "text-green-600",
          },
          {
            label: "Outstanding",
            value: `LKR ${invoices
              .filter((i) => i.status === "Sent")
              .reduce((s, i) => s + i.total, 0)
              .toLocaleString()}`,
            color: "text-amber-600",
          },
        ].map((m) => (
          <div key={m.label} className="card">
            <div className={`text-2xl font-semibold ${m.color}`}>{m.value}</div>
            <div className="text-gray-500 text-sm mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* List */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : invoices.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <div className="text-3xl mb-2">🧾</div>
              <div>No invoices yet — create your first one!</div>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">
                    Invoice
                  </th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">
                    Total
                  </th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => setViewing(inv)}
                    className={`border-b border-gray-50 cursor-pointer transition-colors ${viewing?.id === inv.id ? "bg-blue-50" : "hover:bg-gray-50"}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 text-xs">
                        {inv.invoiceNo}
                      </div>
                      <div className="text-xs text-gray-400">
                        {format(new Date(inv.createdAt), "dd MMM yyyy")}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {inv.customer?.name}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 text-sm">
                      LKR {Number(inv.total).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={statusColors[inv.status] || "badge-gray"}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Invoice detail / print view */}
        {viewing ? (
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-medium text-gray-900">
                {viewing.invoiceNo}
              </span>
              <div className="flex gap-2">
                {["Draft", "Sent", "Paid", "Cancelled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(viewing.id, s)}
                    className={`text-xs px-2 py-1 rounded transition-colors ${viewing.status === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {s}
                  </button>
                ))}
                <button
                  onClick={handlePrint}
                  className="text-xs px-2 py-1 rounded bg-gray-900 text-white hover:bg-gray-700"
                >
                  🖨 Print
                </button>
                <button
                  onClick={() => handleDelete(viewing.id)}
                  className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Printable invoice */}
            <div
              id="invoice-print"
              ref={printRef}
              style={{ padding: "2rem", fontFamily: "Inter, sans-serif" }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 32,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: "#0d1b2e",
                      marginBottom: 4,
                    }}
                  >
                    🐼 PANDAS DIGITAL
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    Kurunegala, Sri Lanka
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    hello@pandasdigital.lk
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#2563eb",
                      marginBottom: 4,
                    }}
                  >
                    {viewing.type.toUpperCase()}
                  </div>
                  <div
                    style={{ fontSize: 12, color: "#64748b", marginBottom: 2 }}
                  >
                    #{viewing.invoiceNo}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    Date: {format(new Date(viewing.createdAt), "dd MMM yyyy")}
                  </div>
                  {viewing.dueDate && (
                    <div style={{ fontSize: 12, color: "#ef4444" }}>
                      Due: {format(new Date(viewing.dueDate), "dd MMM yyyy")}
                    </div>
                  )}
                </div>
              </div>

              {/* Bill to */}
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 10,
                  padding: "1rem",
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#94a3b8",
                    marginBottom: 6,
                  }}
                >
                  Bill To
                </div>
                <div style={{ fontWeight: 600, color: "#0d1b2e" }}>
                  {viewing.customer?.name}
                </div>
                {viewing.customer?.businessName && (
                  <div style={{ fontSize: 13, color: "#475569" }}>
                    {viewing.customer.businessName}
                  </div>
                )}
                {viewing.customer?.email && (
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    {viewing.customer.email}
                  </div>
                )}
                {viewing.customer?.phone && (
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    {viewing.customer.phone}
                  </div>
                )}
              </div>

              {/* Items */}
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: 20,
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr style={{ background: "#0d1b2e", color: "#fff" }}>
                    <th
                      style={{
                        padding: "10px 12px",
                        textAlign: "left",
                        borderRadius: "8px 0 0 0",
                      }}
                    >
                      Description
                    </th>
                    <th style={{ padding: "10px 12px", textAlign: "center" }}>
                      Qty
                    </th>
                    <th style={{ padding: "10px 12px", textAlign: "right" }}>
                      Rate (LKR)
                    </th>
                    <th
                      style={{
                        padding: "10px 12px",
                        textAlign: "right",
                        borderRadius: "0 8px 0 0",
                      }}
                    >
                      Amount (LKR)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(JSON.parse(viewing.items) as LineItem[]).map((item, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "10px 12px", color: "#374151" }}>
                        {item.description}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "center",
                          color: "#374151",
                        }}
                      >
                        {item.qty}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          color: "#374151",
                        }}
                      >
                        {Number(item.rate).toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          fontWeight: 500,
                          color: "#0d1b2e",
                        }}
                      >
                        {(item.qty * item.rate).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ width: 240 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "6px 0",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: "#64748b" }}>Subtotal</span>
                    <span>LKR {Number(viewing.subtotal).toLocaleString()}</span>
                  </div>
                  {Number(viewing.discount) > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "6px 0",
                        fontSize: 13,
                        color: "#22c55e",
                      }}
                    >
                      <span>Discount</span>
                      <span>
                        - LKR {Number(viewing.discount).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      fontSize: 16,
                      fontWeight: 700,
                      borderTop: "2px solid #0d1b2e",
                      marginTop: 4,
                      color: "#0d1b2e",
                    }}
                  >
                    <span>Total</span>
                    <span>LKR {Number(viewing.total).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {viewing.notes && (
                <div
                  style={{
                    marginTop: 24,
                    padding: "1rem",
                    background: "#f8fafc",
                    borderRadius: 10,
                    fontSize: 13,
                    color: "#475569",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      marginBottom: 4,
                      color: "#0d1b2e",
                    }}
                  >
                    Notes
                  </div>
                  {viewing.notes}
                </div>
              )}

              <div
                style={{
                  marginTop: 32,
                  textAlign: "center",
                  fontSize: 11,
                  color: "#94a3b8",
                }}
              >
                Thank you for your business! · Pandas Digital ·
                hello@pandasdigital.lk
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-gray-400">
            <div className="text-3xl mb-2">🧾</div>
            <div className="text-sm">Click an invoice to view and print it</div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Create Invoice / Quote</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
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
              <div>
                <label className="form-label">Type</label>
                <select
                  className="form-input"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option>Invoice</option>
                  <option>Quotation</option>
                  <option>Receipt</option>
                </select>
              </div>
              <div>
                <label className="form-label">Due Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Line items */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="form-label mb-0">Line Items</label>
                <button
                  onClick={addItem}
                  className="text-xs text-blue-600 font-medium hover:underline"
                >
                  + Add Item
                </button>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-xs text-gray-400 px-1">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2">Qty</div>
                  <div className="col-span-3">Rate (LKR)</div>
                  <div className="col-span-1"></div>
                </div>
                {items.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-6">
                      <input
                        className="form-input text-sm py-2"
                        placeholder="Service description"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(i, "description", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        className="form-input text-sm py-2"
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) =>
                          updateItem(i, "qty", Number(e.target.value))
                        }
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        className="form-input text-sm py-2"
                        type="number"
                        min="0"
                        value={item.rate}
                        onChange={(e) =>
                          updateItem(i, "rate", Number(e.target.value))
                        }
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(i)}
                          className="text-red-400 hover:text-red-600 text-lg leading-none"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-4">
              <div className="w-52 space-y-1">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>LKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Discount</span>
                  <input
                    className="form-input text-sm py-1 w-28 ml-auto"
                    type="number"
                    min="0"
                    value={form.discount}
                    onChange={(e) =>
                      setForm({ ...form, discount: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-between text-sm font-semibold text-gray-900 pt-1 border-t border-gray-100">
                  <span>Total</span>
                  <span>LKR {total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="Payment terms, bank details, thank you message..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <div className="flex gap-3">
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Creating..." : "Create Invoice"}
              </button>
              <button
                className="btn-outline"
                onClick={() => setShowModal(false)}
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
