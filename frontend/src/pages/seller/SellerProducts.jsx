import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/client";

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", stock: "" });
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function loadProducts() {
    api.get("/products/seller/mine").then((res) => setProducts(res.data)).finally(() => setLoading(false));
  }

  useEffect(loadProducts, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    try {
      let images = [];
      if (imageFiles.length) {
        setUploading(true);
        const fd = new FormData();
        imageFiles.forEach((f) => fd.append("images", f));
        const res = await api.post("/products/upload-images", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        images = res.data.urls;
        setUploading(false);
      }
      await api.post("/products", { ...form, price: Number(form.price), stock: Number(form.stock) || 0, images });
      setForm({ name: "", description: "", price: "", category: "", stock: "" });
      setImageFiles([]);
      setShowForm(false);
      loadProducts();
    } catch (err) {
      setUploading(false);
      setError(err.response?.data?.message || "Could not add product");
    }
  }

  async function handleDelete(id) {
    await api.delete(`/products/${id}`);
    loadProducts();
  }

  async function toggleActive(product) {
    await api.patch(`/products/${product._id}`, { isActive: !product.isActive });
    loadProducts();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl" style={{ color: "var(--ink)" }}>Products</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-sm font-medium px-5 py-2 rounded-full"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {showForm ? "Cancel" : "+ Add product"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleAdd}
            className="overflow-hidden mb-8 rounded-2xl p-6 border grid sm:grid-cols-2 gap-4"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <input required placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-4 py-2.5 rounded-lg border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />
            <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-4 py-2.5 rounded-lg border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />
            <input required type="number" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="px-4 py-2.5 rounded-lg border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />
            <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="px-4 py-2.5 rounded-lg border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="px-4 py-2.5 rounded-lg border sm:col-span-2" rows={3} style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />
            <input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files).slice(0, 8))}
              className="sm:col-span-2 text-sm" style={{ color: "var(--ink-soft)" }} />
            {error && <p className="text-sm sm:col-span-2" style={{ color: "#B54040" }}>{error}</p>}
            <button type="submit" disabled={uploading} className="sm:col-span-2 py-2.5 rounded-full font-medium" style={{ background: "var(--success)", color: "#fff" }}>
              {uploading ? "Uploading images…" : "Save product"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {loading ? (
        <p style={{ color: "var(--ink-soft)" }}>Loading…</p>
      ) : products.length === 0 ? (
        <p style={{ color: "var(--ink-soft)" }}>No products yet — add your first one above.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <motion.div
              key={p._id}
              layout
              className="rounded-xl p-4 border"
              style={{ background: "var(--card)", borderColor: "var(--border)", opacity: p.isActive ? 1 : 0.5 }}
            >
              {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full aspect-video object-cover rounded-lg mb-3" />}
              <p className="font-medium mb-1" style={{ color: "var(--ink)" }}>{p.name}</p>
              <p className="text-sm mb-3" style={{ color: "var(--ink-soft)" }}>₹{p.price} · Stock: {p.stock}</p>
              <div className="flex gap-3 text-sm">
                <button onClick={() => toggleActive(p)} style={{ color: "var(--accent)" }}>
                  {p.isActive ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => handleDelete(p._id)} style={{ color: "#B54040" }}>Delete</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
