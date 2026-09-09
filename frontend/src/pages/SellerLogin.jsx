import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";
import Input from "../components/Input";
import { useSellerAuth } from "../context/SellerAuthContext";

export default function SellerLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginSeller } = useSellerAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/sellers/login", form);
      loginSeller(res.data.token, res.data.seller);
      navigate(res.data.seller.isActive ? "/seller/dashboard" : "/sell/plans");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 sm:px-8 py-20">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-3xl mb-8" style={{ color: "var(--ink)" }}>Seller login</h1>
        <form onSubmit={handleSubmit}>
          <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p className="text-sm mb-4" style={{ color: "#B54040" }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-medium transition-transform hover:scale-[1.02] disabled:opacity-60"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p className="text-sm mt-6" style={{ color: "var(--ink-soft)" }}>
          New here? <Link to="/sell" style={{ color: "var(--accent)" }}>Set up your stall</Link>
        </p>
      </motion.div>
    </div>
  );
}
