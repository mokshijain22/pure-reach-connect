import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/client";
import ShopLayout from "../components/ShopLayout";
import { useCustomerAuth } from "../context/CustomerAuthContext";

export default function Marketplace() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const { customer, loading: customerLoading } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!customer) return;
    api.get("/customers/wishlist").then((res) => setWishlistIds(new Set(res.data.map((p) => p._id))));
  }, [customer]);

  async function toggleWishlist(e, productId) {
    e.preventDefault();
    e.stopPropagation();
    if (customerLoading) return; // auth state still resolving — ignore the click rather than false-redirecting
    if (!customer) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (wishlistIds.has(productId)) {
      await api.delete(`/customers/wishlist/${productId}`);
      setWishlistIds((prev) => { const next = new Set(prev); next.delete(productId); return next; });
    } else {
      await api.post(`/customers/wishlist/${productId}`);
      setWishlistIds((prev) => new Set(prev).add(productId));
    }
  }

  function search(q, cat) {
    setLoading(true);
    const params = {};
    if (q) params.q = q;
    if (cat) params.category = cat;
    api.get("/products/search", { params }).then((res) => setProducts(res.data)).finally(() => setLoading(false));
  }

  useEffect(() => search(query, category), [category]);

  return (
    <ShopLayout
      query={query}
      onQueryChange={setQuery}
      onSearch={(q) => search(q, category)}
      category={category}
      onCategoryChange={setCategory}
    >
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="font-display text-2xl" style={{ color: "var(--ink)" }}>
          {category || "All products"}
        </h1>
        {!loading && <span className="text-sm" style={{ color: "var(--ink-soft)" }}>{products.length} results</span>}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
              <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.05 }}
                className="aspect-square"
                style={{ background: "var(--card)" }}
              />
              <div className="p-4 space-y-2">
                <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }} className="h-3 rounded" style={{ background: "var(--card)", width: "70%" }} />
                <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }} className="h-3 rounded" style={{ background: "var(--card)", width: "40%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-dashed p-16 text-center max-w-md mx-auto"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="font-display text-lg mb-2" style={{ color: "var(--ink)" }}>Nothing here yet</p>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Sellers are just getting started — check back soon, or be the first to list your store.</p>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.4) }}
              whileHover={{ y: -4 }}
            >
              <Link to={`/product/${p._id}`} className="relative block rounded-xl overflow-hidden border group" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <button
                  onClick={(e) => toggleWishlist(e, p._id)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur"
                  style={{ background: "color-mix(in srgb, var(--bg) 70%, transparent)" }}
                  aria-label="Toggle wishlist"
                >
                  <span style={{ color: wishlistIds.has(p._id) ? "var(--accent)" : "var(--ink-soft)" }}>
                    {wishlistIds.has(p._id) ? "♥" : "♡"}
                  </span>
                </button>
                <div className="aspect-square overflow-hidden" style={{ background: "var(--bg)" }}>
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl" style={{ color: "var(--border)" }}>◇</div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium mb-1 truncate" style={{ color: "var(--ink)" }}>{p.name}</p>
                  <p className="text-xs mb-2 truncate" style={{ color: "var(--ink-soft)" }}>{p.seller?.businessName}</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>₹{p.discountPrice || p.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </ShopLayout>
  );
}