import { useState } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import CustomerOrders from "./customer/CustomerOrders";
import CustomerWishlist from "./customer/CustomerWishlist";
import CustomerAddresses from "./customer/CustomerAddresses";
import CustomerProfile from "./customer/CustomerProfile";

const TABS = [
  { key: "orders", label: "My Orders" },
  { key: "wishlist", label: "Wishlist" },
  { key: "addresses", label: "Addresses" },
  { key: "profile", label: "Profile" },
];

export default function CustomerAccount() {
  const { customer, loading, logoutCustomer } = useCustomerAuth();
  const [tab, setTab] = useState("orders");

  if (loading) return null;
  if (!customer) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl" style={{ color: "var(--ink)" }}>
            {customer.name || customer.phone}
          </h1>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>{customer.phone}</p>
        </div>
        <button onClick={logoutCustomer} className="text-sm" style={{ color: "var(--ink-soft)" }}>Log out</button>
      </div>

      <div className="flex gap-2 mb-8 border-b overflow-x-auto" style={{ borderColor: "var(--border)" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="relative px-4 py-3 text-sm font-medium whitespace-nowrap"
            style={{ color: tab === t.key ? "var(--ink)" : "var(--ink-soft)" }}
          >
            {t.label}
            {tab === t.key && (
              <motion.div layoutId="customer-tab-underline" className="absolute left-0 right-0 -bottom-px h-0.5" style={{ background: "var(--accent)" }} />
            )}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {tab === "orders" && <CustomerOrders />}
        {tab === "wishlist" && <CustomerWishlist />}
        {tab === "addresses" && <CustomerAddresses />}
        {tab === "profile" && <CustomerProfile />}
      </motion.div>
    </div>
  );
}