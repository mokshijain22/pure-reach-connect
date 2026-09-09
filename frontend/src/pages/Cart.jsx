import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-24 text-center">
        <p className="mb-4" style={{ color: "var(--ink-soft)" }}>Your cart is empty.</p>
        <Link to="/marketplace" className="text-sm font-medium" style={{ color: "var(--accent)" }}>Browse products →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12">
      <h1 className="font-display text-3xl mb-8" style={{ color: "var(--ink)" }}>Your cart</h1>

      <div className="space-y-3 mb-8">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between rounded-xl p-4 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div>
              <p style={{ color: "var(--ink)" }}>{item.name}</p>
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>{item.quantity} × ₹{item.price}</p>
            </div>
            <button onClick={() => removeItem(item.productId)} className="text-sm" style={{ color: "#B54040" }}>Remove</button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-8">
        <span style={{ color: "var(--ink-soft)" }}>Total</span>
        <span className="text-xl font-semibold" style={{ color: "var(--accent)" }}>₹{total}</span>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="w-full py-3 rounded-full font-medium"
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        Proceed to checkout
      </button>
    </div>
  );
}
