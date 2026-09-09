import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";
import Input from "../components/Input";
import { useSellerAuth } from "../context/SellerAuthContext";

export default function SellerRegister() {
  const [form, setForm] = useState({
    businessName: "", ownerName: "", email: "", password: "", phone: "", city: "", state: "", pincode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginSeller } = useSellerAuth();
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/sellers/register", form);
      loginSeller(res.data.token, res.data.seller);
      navigate("/sell/plans");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 sm:px-8 py-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-sm mb-2" style={{ color: "var(--accent)" }}>Sell with us</p>
        <h1 className="font-display text-3xl mb-8" style={{ color: "var(--ink)" }}>Set up your stall</h1>

        <form onSubmit={handleSubmit}>
          <Input label="Business name" required value={form.businessName} onChange={update("businessName")} />
          <Input label="Your name" required value={form.ownerName} onChange={update("ownerName")} />
          <Input label="Email" type="email" required value={form.email} onChange={update("email")} />
          <Input label="Password" type="password" required minLength={6} value={form.password} onChange={update("password")} />
          <Input label="Phone" required value={form.phone} onChange={update("phone")} />
          <div className="grid grid-cols-3 gap-3">
            <Input label="City" value={form.city} onChange={update("city")} />
            <Input label="State" value={form.state} onChange={update("state")} />
            <Input label="Pincode" value={form.pincode} onChange={update("pincode")} />
          </div>

          {error && <p className="text-sm mb-4" style={{ color: "#B54040" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-medium transition-transform hover:scale-[1.02] disabled:opacity-60"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {loading ? "Creating your stall…" : "Continue to plans"}
          </button>
        </form>

        <p className="text-sm mt-6" style={{ color: "var(--ink-soft)" }}>
          Already selling with us? <Link to="/seller/login" style={{ color: "var(--accent)" }}>Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
