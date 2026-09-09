import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";

const STATUS_COLOR = {
  placed: "var(--ink-soft)",
  packed: "var(--accent-soft)",
  shipped: "var(--accent)",
  delivered: "var(--success)",
  cancelled: "#B54040",
};

export default function CustomerOrders() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    api.get("/customers/orders").then((res) => setOrders(res.data)).catch(() => setOrders([]));
  }, []);

  if (orders === null) return <p style={{ color: "var(--ink-soft)" }}>Loading…</p>;

  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-dashed p-16 text-center max-w-md" style={{ borderColor: "var(--border)" }}>
        <p className="font-display text-lg mb-2" style={{ color: "var(--ink)" }}>No orders yet</p>
        <p className="text-sm mb-4" style={{ color: "var(--ink-soft)" }}>Once you buy something, it'll show up here.</p>
        <Link to="/marketplace" style={{ color: "var(--accent)" }}>Browse the marketplace</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o._id} className="rounded-xl border p-5" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>{o.seller?.businessName}</p>
              <p className="text-xs" style={{ color: "var(--ink-soft)" }}>{new Date(o.createdAt).toLocaleDateString()}</p>
            </div>
            <span
              className="text-xs uppercase tracking-wide font-medium px-3 py-1 rounded-full"
              style={{ background: "color-mix(in srgb, " + (STATUS_COLOR[o.orderStatus] || "var(--ink-soft)") + " 15%, transparent)", color: STATUS_COLOR[o.orderStatus] || "var(--ink-soft)" }}
            >
              {o.orderStatus}
            </span>
          </div>
          <ul className="text-sm space-y-1 mb-3" style={{ color: "var(--ink-soft)" }}>
            {o.items.map((it, i) => (
              <li key={i}>{it.quantity} × {it.name} — ₹{it.price * it.quantity}</li>
            ))}
          </ul>
          <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--border)" }}>
            <span className="text-sm font-semibold" style={{ color: "var(--ink)" }}>₹{o.totalAmount}</span>
            <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
              {o.paymentStatus === "seller_confirmed_paid" ? "Payment confirmed" : "Payment pending"}
            </span>
          </div>
          {o.trackingNote && <p className="text-xs mt-2" style={{ color: "var(--ink-soft)" }}>Note: {o.trackingNote}</p>}
        </div>
      ))}
    </div>
  );
}