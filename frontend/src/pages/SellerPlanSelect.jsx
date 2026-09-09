import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { loadRazorpayScript } from "../api/razorpay";
import { useSellerAuth } from "../context/SellerAuthContext";

const FALLBACK_PLANS = [
  { key: "basic", label: "Basic", annualFee: 1999, productLimit: 50 },
  { key: "silver", label: "Silver", annualFee: 4999, productLimit: 200 },
  { key: "gold", label: "Gold", annualFee: 9999, productLimit: 500 },
  { key: "platinum", label: "Platinum", annualFee: 19999, productLimit: "Unlimited" },
];

export default function SellerPlanSelect() {
  const [plans, setPlans] = useState(FALLBACK_PLANS);
  const [busyPlan, setBusyPlan] = useState(null);
  const [error, setError] = useState("");
  const { seller, setSeller } = useSellerAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/plans").then((res) => setPlans(res.data)).catch(() => {});
  }, []);

  async function handleChoose(planKey) {
    setError("");
    setBusyPlan(planKey);
    try {
      const ready = await loadRazorpayScript();
      if (!ready) throw new Error("Could not load payment gateway. Check your connection.");

      const { data } = await api.post("/sellers/subscription/create-order", { planKey });

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Pure Reach Connect",
        description: `${planKey} plan — annual subscription`,
        order_id: data.razorpayOrderId,
        theme: { color: "#B5651D" },
        handler: async function (response) {
          try {
            await api.post("/sellers/subscription/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setSeller((s) => ({ ...s, currentPlan: planKey, isActive: true }));
            navigate("/seller/dashboard");
          } catch (err) {
            setError("Payment succeeded but verification failed. Contact support with your payment ID.");
          }
        },
        modal: { ondismiss: () => setBusyPlan(null) },
      });

      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
      setBusyPlan(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
      <h1 className="font-display text-3xl mb-2" style={{ color: "var(--ink)" }}>
        Choose your plan{seller ? `, ${seller.businessName}` : ""}
      </h1>
      <p className="mb-10" style={{ color: "var(--ink-soft)" }}>
        Pay once a year. No commission is ever taken from what you sell.
      </p>

      {error && <p className="text-sm mb-6" style={{ color: "#B54040" }}>{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-2xl p-6 border flex flex-col"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <span className="font-display text-xl mb-1" style={{ color: "var(--ink)" }}>{plan.label}</span>
            <span className="text-2xl font-semibold mb-4" style={{ color: "var(--accent)" }}>
              ₹{plan.annualFee.toLocaleString("en-IN")}
              <span className="text-sm font-normal" style={{ color: "var(--ink-soft)" }}> /year</span>
            </span>
            <ul className="text-sm space-y-1.5 mb-6" style={{ color: "var(--ink-soft)" }}>
              <li>Up to {plan.productLimit === "unlimited" || plan.productLimit === Infinity ? "unlimited" : plan.productLimit} products</li>
              {plan.hasVideo && <li>Cinematic brand video</li>}
              {plan.hasAnalyticsDashboard && <li>Business analytics</li>}
              {plan.customDomain && <li>Custom domain</li>}
            </ul>
            <button
              onClick={() => handleChoose(plan.key)}
              disabled={busyPlan === plan.key}
              className="mt-auto text-sm font-medium py-2.5 rounded-full transition-transform hover:scale-[1.02] disabled:opacity-60"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {busyPlan === plan.key ? "Opening checkout…" : `Choose ${plan.label}`}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
