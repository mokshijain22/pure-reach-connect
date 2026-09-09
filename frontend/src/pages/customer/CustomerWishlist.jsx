import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";

export default function CustomerWishlist() {
  const [items, setItems] = useState(null);

  function load() {
    api.get("/customers/wishlist").then((res) => setItems(res.data)).catch(() => setItems([]));
  }

  useEffect(load, []);

  async function remove(productId) {
    await api.delete(`/customers/wishlist/${productId}`);
    setItems((prev) => prev.filter((p) => p._id !== productId));
  }

  if (items === null) return <p style={{ color: "var(--ink-soft)" }}>Loading…</p>;

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed p-16 text-center max-w-md" style={{ borderColor: "var(--border)" }}>
        <p className="font-display text-lg mb-2" style={{ color: "var(--ink)" }}>Wishlist is empty</p>
        <p className="text-sm mb-4" style={{ color: "var(--ink-soft)" }}>Tap the heart on any product to save it here.</p>
        <Link to="/marketplace" style={{ color: "var(--accent)" }}>Browse the marketplace</Link>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {items.map((p) => (
        <div key={p._id} className="rounded-xl overflow-hidden border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <Link to={`/product/${p._id}`} className="block aspect-square overflow-hidden" style={{ background: "var(--bg)" }}>
            {p.images?.[0] ? (
              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl" style={{ color: "var(--border)" }}>◇</div>
            )}
          </Link>
          <div className="p-4">
            <p className="text-sm font-medium mb-1 truncate" style={{ color: "var(--ink)" }}>{p.name}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>₹{p.discountPrice || p.price}</p>
              <button onClick={() => remove(p._id)} className="text-xs" style={{ color: "var(--ink-soft)" }}>Remove</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}