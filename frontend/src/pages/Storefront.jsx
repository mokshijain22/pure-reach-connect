import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";

export default function Storefront() {
  const { slug } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/sellers/store/${slug}`).then((res) => setSeller(res.data)).catch(() => setNotFound(true));
    api.get(`/products/store/${slug}`).then((res) => setProducts(res.data)).catch(() => {});
  }, [slug]);

  if (notFound) return <div className="max-w-3xl mx-auto px-5 py-24 text-center" style={{ color: "var(--ink-soft)" }}>Store not found.</div>;
  if (!seller) return null;

  const accent = seller.brandColor || "var(--accent)";

  return (
    <div>
      {/* Banner */}
      <div className="h-48 sm:h-64" style={{ background: seller.bannerUrl ? undefined : `linear-gradient(135deg, ${accent}, var(--bg-elevated))` }}>
        {seller.bannerUrl && <img src={seller.bannerUrl} alt="" className="w-full h-full object-cover" />}
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 -mt-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-end gap-5 mb-8">
          <div
            className="w-24 h-24 rounded-2xl border-4 flex items-center justify-center text-2xl font-display flex-shrink-0"
            style={{ background: "var(--card)", borderColor: "var(--bg)", color: accent }}
          >
            {seller.logoUrl ? <img src={seller.logoUrl} alt="" className="w-full h-full object-cover rounded-xl" /> : seller.businessName[0]}
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl" style={{ color: "var(--ink)" }}>{seller.businessName}</h1>
            <p className="text-sm" style={{ color: "var(--ink-soft)" }}>{seller.city}{seller.state ? `, ${seller.state}` : ""}</p>
          </div>
                    <div className="ml-auto flex gap-2">
            {seller.phone && (
              <a
                href={`tel:${seller.phone}`}
                className="text-sm px-5 py-2.5 rounded-full font-medium border"
                style={{ borderColor: "var(--border)", color: "var(--ink)" }}
              >
                Call
              </a>
            )}
            {seller.whatsappNumber && (
              <a
                href={`https://wa.me/${seller.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm px-5 py-2.5 rounded-full font-medium"
                style={{ background: "var(--success)", color: "#fff" }}
              >
                WhatsApp
              </a>
            )}
          </div>
        </motion.div>

        {seller.description && <p className="mb-10 max-w-2xl" style={{ color: "var(--ink-soft)" }}>{seller.description}</p>}

        {seller.brandVideoUrl && (
          <video controls className="w-full rounded-2xl mb-10 max-h-[420px]" src={seller.brandVideoUrl} />
        )}

        <h2 className="font-display text-xl mb-5" style={{ color: "var(--ink)" }}>Products</h2>
        {products.length === 0 ? (
          <p style={{ color: "var(--ink-soft)" }}>No products listed yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-16">
            {products.map((p) => (
              <Link key={p._id} to={`/product/${p._id}`} className="block rounded-xl overflow-hidden border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="aspect-square" style={{ background: "var(--bg-elevated)" }}>
                  {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium mb-1" style={{ color: "var(--ink)" }}>{p.name}</p>
                  <p className="text-sm font-semibold" style={{ color: accent }}>₹{p.discountPrice || p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
