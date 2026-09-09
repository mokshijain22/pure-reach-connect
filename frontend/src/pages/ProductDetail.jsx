import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/client";
import { useCart } from "../context/CartContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem } = useCart();
  const { customer, loading: customerLoading } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  useEffect(() => {
    if (!customer) return;
    api.get("/customers/wishlist").then((res) => setWishlisted(res.data.some((p) => p._id === id)));
  }, [customer, id]);

  if (!product) return null;

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  async function toggleWishlist() {
    if (customerLoading) return;
    if (!customer) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (wishlisted) {
      await api.delete(`/customers/wishlist/${id}`);
    } else {
      await api.post(`/customers/wishlist/${id}`);
    }
    setWishlisted((v) => !v);
  }

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 grid md:grid-cols-2 gap-10">
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
        className="aspect-square rounded-2xl overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
        {product.images?.[0] && <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />}
      </motion.div>

      <div>
        <Link to={`/store/${product.seller?.slug}`} className="text-sm mb-2 inline-block" style={{ color: "var(--accent)" }}>
          {product.seller?.businessName}
        </Link>
        <h1 className="font-display text-3xl mb-4" style={{ color: "var(--ink)" }}>{product.name}</h1>
        <p className="text-2xl font-semibold mb-6" style={{ color: "var(--accent)" }}>₹{product.discountPrice || product.price}</p>
        {product.description && <p className="mb-8" style={{ color: "var(--ink-soft)" }}>{product.description}</p>}

        <div className="flex items-center gap-3">
          <button
            onClick={handleAdd}
            className="px-8 py-3 rounded-full font-medium transition-transform hover:scale-[1.02]"
            style={{ background: added ? "var(--success)" : "var(--accent)", color: "#fff" }}
          >
            {added ? "Added ✓" : "Add to cart"}
          </button>
          <button
            onClick={toggleWishlist}
            className="w-12 h-12 rounded-full flex items-center justify-center border transition-transform hover:scale-[1.05]"
            style={{ borderColor: "var(--border)" }}
            aria-label="Toggle wishlist"
          >
            <span style={{ color: wishlisted ? "var(--accent)" : "var(--ink-soft)" }}>{wishlisted ? "♥" : "♡"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
