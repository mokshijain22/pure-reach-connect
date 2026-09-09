import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function Marketplace() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  function search(q) {
    setLoading(true);
    api
      .get("/products/search", { params: q ? { q } : {} })
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => search(""), []);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
      <h1 className="font-display text-3xl mb-6" style={{ color: "var(--ink)" }}>Marketplace</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          search(query);
        }}
        className="mb-10 flex gap-3 max-w-md"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="flex-1 px-4 py-2.5 rounded-full border"
          style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--ink)" }}
        />
        <button type="submit" className="px-5 py-2.5 rounded-full font-medium" style={{ background: "var(--accent)", color: "#fff" }}>
          Search
        </button>
      </form>

      {loading ? (
        <p style={{ color: "var(--ink-soft)" }}>Loading…</p>
      ) : products.length === 0 ? (
        <p style={{ color: "var(--ink-soft)" }}>No products found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p, i) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.03 }}>
              <Link to={`/product/${p._id}`} className="block rounded-xl overflow-hidden border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="aspect-square" style={{ background: "var(--bg-elevated)" }}>
                  {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium mb-1" style={{ color: "var(--ink)" }}>{p.name}</p>
                  <p className="text-xs mb-2" style={{ color: "var(--ink-soft)" }}>{p.seller?.businessName}</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>₹{p.discountPrice || p.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
