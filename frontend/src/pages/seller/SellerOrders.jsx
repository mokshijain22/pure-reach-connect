import { useEffect, useState } from "react";
import api from "../../api/client";

const STATUS_OPTIONS = ["placed", "packed", "shipped", "delivered", "cancelled"];

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    api.get("/seller-orders").then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function markPaid(id) {
    await api.patch(`/seller-orders/${id}/mark-paid`);
    load();
  }

  async function updateStatus(id, orderStatus) {
    await api.patch(`/seller-orders/${id}/status`, { orderStatus });
    load();
  }

  if (loading) return <p style={{ color: "var(--ink-soft)" }}>Loading…</p>;
  if (!orders.length) return <p style={{ color: "var(--ink-soft)" }}>No orders yet.</p>;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="rounded-xl p-5 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <p className="font-medium" style={{ color: "var(--ink)" }}>Order #{order._id.slice(-6)}</p>
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                {order.customer?.name || order.customer?.phone} · ₹{order.totalAmount}
              </p>
            </div>
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{
                background: order.paymentStatus === "seller_confirmed_paid" ? "var(--success)" : "var(--bg-elevated)",
                color: order.paymentStatus === "seller_confirmed_paid" ? "#fff" : "var(--ink-soft)",
              }}
            >
              {order.paymentStatus === "seller_confirmed_paid" ? "Paid" : "Awaiting UPI payment"}
            </span>
          </div>

          <ul className="text-sm mb-4" style={{ color: "var(--ink-soft)" }}>
            {order.items.map((item, i) => (
              <li key={i}>{item.quantity} × {item.name} — ₹{item.price}</li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            {order.paymentStatus !== "seller_confirmed_paid" && (
              <button onClick={() => markPaid(order._id)} className="text-sm px-4 py-1.5 rounded-full" style={{ background: "var(--success)", color: "#fff" }}>
                Mark payment received
              </button>
            )}
            <select
              value={order.orderStatus}
              onChange={(e) => updateStatus(order._id, e.target.value)}
              className="text-sm px-3 py-1.5 rounded-full border"
              style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
