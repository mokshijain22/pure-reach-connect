import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/client";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function Admin() {
  const { admin, loginAdmin, logoutAdmin } = useAdminAuth();
  if (!admin) return <AdminLogin onLogin={loginAdmin} />;
  return <AdminPanel onLogout={logoutAdmin} />;
}

function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/admin/login", form);
      onLogin(res.data.token, res.data.admin);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-24">
      <h1 className="font-display text-2xl mb-6" style={{ color: "var(--ink)" }}>Admin login</h1>
      <form onSubmit={handleSubmit}>
        <input required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border mb-4" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />
        <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border mb-4" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />
        {error && <p className="text-sm mb-4" style={{ color: "#B54040" }}>{error}</p>}
        <button type="submit" className="w-full py-3 rounded-full font-medium" style={{ background: "var(--accent)", color: "#fff" }}>Log in</button>
      </form>
    </div>
  );
}

function AdminPanel({ onLogout }) {
  const [summary, setSummary] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("prc-admin-token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const [summaryRes, sellersRes] = await Promise.all([
        api.get("/admin/dashboard", config),
        api.get("/admin/sellers", config),
      ]);
      setSummary(summaryRes.data);
      setSellers(sellersRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load the admin dashboard.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function verify(id) {
    await api.patch(`/admin/sellers/${id}/verify`, null, { headers: { Authorization: `Bearer ${localStorage.getItem("prc-admin-token")}` } });
    load();
  }
  async function toggleSuspend(seller) {
    await api.patch(`/admin/sellers/${seller._id}/suspend`, { suspend: !seller.isSuspended }, { headers: { Authorization: `Bearer ${localStorage.getItem("prc-admin-token")}` } });
    load();
  }

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl" style={{ color: "var(--ink)" }}>Admin</h1>
        <button onClick={onLogout} className="text-sm" style={{ color: "var(--ink-soft)" }}>Log out</button>
      </div>

      {loading && <p style={{ color: "var(--ink-soft)" }}>Loading dashboard...</p>}
      {error && <p className="text-sm mb-6" style={{ color: "#B54040" }}>{error}</p>}

      {summary && (
        <div className="grid sm:grid-cols-4 gap-4 mb-12">
          {[
            ["Total sellers", summary.totalSellers],
            ["Active sellers", summary.activeSellers],
            ["Total orders", summary.totalOrders],
            ["Subscription revenue", `₹${summary.subscriptionRevenue.toLocaleString("en-IN")}`],
          ].map(([label, value]) => (
            <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-5 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--ink-soft)" }}>{label}</p>
              <p className="text-2xl font-semibold" style={{ color: "var(--ink)" }}>{value}</p>
            </motion.div>
          ))}
        </div>
      )}

      <h2 className="font-display text-xl mb-4" style={{ color: "var(--ink)" }}>Sellers</h2>
      <div className="space-y-3">
        {sellers.map((s) => (
          <div key={s._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl p-4 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div>
              <p style={{ color: "var(--ink)" }}>{s.businessName} <span className="text-xs" style={{ color: "var(--ink-soft)" }}>({s.currentPlan || "no plan"})</span></p>
              <p className="text-xs" style={{ color: "var(--ink-soft)" }}>{s.email}</p>
            </div>
            <div className="flex gap-3 text-sm">
              {!s.isVerified && <button onClick={() => verify(s._id)} style={{ color: "var(--success)" }}>Verify</button>}
              <button onClick={() => toggleSuspend(s)} style={{ color: s.isSuspended ? "var(--success)" : "#B54040" }}>
                {s.isSuspended ? "Unsuspend" : "Suspend"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
