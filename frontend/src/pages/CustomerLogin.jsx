import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api/client";
import Input from "../components/Input";
import { useCustomerAuth } from "../context/CustomerAuthContext";

export default function CustomerLogin() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginCustomer } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/account";

  async function handleSendOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/customers/send-otp", { phone });
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Could not send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/customers/verify-otp", { phone, code });
      loginCustomer(res.data.token, res.data.customer);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Incorrect OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 sm:px-8 py-20">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-3xl mb-8" style={{ color: "var(--ink)" }}>Log in</h1>

        {step === "phone" ? (
          <form onSubmit={handleSendOtp}>
            <Input
              label="Phone number"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
            />
            {error && <p className="text-sm mb-4" style={{ color: "#B54040" }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full font-medium transition-transform hover:scale-[1.02] disabled:opacity-60"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {loading ? "Sending…" : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <p className="text-sm mb-4" style={{ color: "var(--ink-soft)" }}>
              Code sent to {phone}. <button type="button" onClick={() => setStep("phone")} style={{ color: "var(--accent)" }}>Change</button>
            </p>
            <Input
              label="Enter OTP"
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6-digit code"
            />
            {error && <p className="text-sm mb-4" style={{ color: "#B54040" }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full font-medium transition-transform hover:scale-[1.02] disabled:opacity-60"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {loading ? "Verifying…" : "Verify & log in"}
            </button>
          </form>
        )}

        <p className="text-sm mt-6" style={{ color: "var(--ink-soft)" }}>
          <Link to="/marketplace" style={{ color: "var(--accent)" }}>Continue browsing without logging in</Link>
        </p>
      </motion.div>
    </div>
  );
}