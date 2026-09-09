import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return null;

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
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

        <button
          onClick={handleAdd}
          className="px-8 py-3 rounded-full font-medium transition-transform hover:scale-[1.02]"
          style={{ background: added ? "var(--success)" : "var(--accent)", color: "#fff" }}
        >
          {added ? "Added ✓" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
