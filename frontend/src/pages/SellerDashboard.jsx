import { useState } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { useSellerAuth } from "../context/SellerAuthContext";
import SellerProducts from "./seller/SellerProducts";
import SellerOrders from "./seller/SellerOrders";
import SellerSettings from "./seller/SellerSettings";

const TABS = [
  { key: "products", label: "Products" },
  { key: "orders", label: "Orders" },
  { key: "settings", label: "Store settings" },
];

export default function SellerDashboard() {
  const { seller, loading, logoutSeller } = useSellerAuth();
  const [tab, setTab] = useState("products");

  if (loading) return null;
  if (!seller) return <Navigate to="/seller/login" replace />;
  if (!seller.isActive) return <Navigate to="/sell/plans" replace />;

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl" style={{ color: "var(--ink)" }}>{seller.businessName}</h1>
          <p className="text-sm capitalize" style={{ color: "var(--accent)" }}>{seller.currentPlan} plan</p>
        </div>
        <button onClick={logoutSeller} className="text-sm" style={{ color: "var(--ink-soft)" }}>Log out</button>
      </div>

      <div className="flex gap-2 mb-8 border-b" style={{ borderColor: "var(--border)" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="relative px-4 py-3 text-sm font-medium"
            style={{ color: tab === t.key ? "var(--ink)" : "var(--ink-soft)" }}
          >
            {t.label}
            {tab === t.key && (
              <motion.div layoutId="tab-underline" className="absolute left-0 right-0 -bottom-px h-0.5" style={{ background: "var(--accent)" }} />
            )}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {tab === "products" && <SellerProducts />}
        {tab === "orders" && <SellerOrders />}
        {tab === "settings" && <SellerSettings />}
      </motion.div>
    </div>
  );
}
