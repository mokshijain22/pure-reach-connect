import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useCart } from "../context/CartContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { customer, loginCustomer } = useCustomerAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(customer ? "address" : "phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [address, setAddress] = useState({ line1: "", city: "", state: "", pincode: "" });
  const [error, setError] = useState("");
  const [payment, setPayment] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  async function sendOtp(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/customers/send-otp", { phone });
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Could not send OTP");
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/customers/verify-otp", { phone, code: otp });
      loginCustomer(res.data.token, res.data.customer);
      setStep("address");
    } catch (err) {
      setError(err.response?.data?.message || "Incorrect OTP");
    }
  }

  async function placeOrder(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const sellerId = items[0].sellerId;
      const res = await api.post("/customers/orders", {
        sellerId,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: address,
      });
      setPayment(res.data.payment);
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setLoading(false);
    }
  }

  if (orderPlaced) {
    return (
      <div className="max-w-md mx-auto px-5 sm:px-8 py-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
          <h1 className="font-display text-2xl mb-3" style={{ color: "var(--ink)" }}>Order placed!</h1>
          {payment ? (
            <>
              <p className="mb-6" style={{ color: "var(--ink-soft)" }}>Scan to pay the seller directly via UPI.</p>
              <img src={payment.qrDataUrl} alt="UPI QR code" className="mx-auto rounded-xl border mb-6" style={{ borderColor: "var(--border)" }} />
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Once paid, the seller will confirm and prepare your order.</p>
            </>
          ) : (
            <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
              This seller hasn't set up UPI payment details yet — check your order status in{" "}
              <a href="/account" style={{ color: "var(--accent)" }}>My Account</a> and the seller will follow up on payment.
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  if (!items.length) {
    return <div className="max-w-md mx-auto px-5 py-24 text-center" style={{ color: "var(--ink-soft)" }}>Your cart is empty.</div>;
  }

  return (
    <div className="max-w-md mx-auto px-5 sm:px-8 py-16">
      <h1 className="font-display text-3xl mb-8" style={{ color: "var(--ink)" }}>Checkout</h1>

      {step === "phone" && (
        <form onSubmit={sendOtp}>
          <input required placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border mb-4" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />
          {error && <p className="text-sm mb-4" style={{ color: "#B54040" }}>{error}</p>}
          <button type="submit" className="w-full py-3 rounded-full font-medium" style={{ background: "var(--accent)", color: "#fff" }}>Send OTP</button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={verifyOtp}>
          <input required placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border mb-4" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />
          {error && <p className="text-sm mb-4" style={{ color: "#B54040" }}>{error}</p>}
          <button type="submit" className="w-full py-3 rounded-full font-medium" style={{ background: "var(--accent)", color: "#fff" }}>Verify</button>
        </form>
      )}

      {step === "address" && (
        <form onSubmit={placeOrder}>
          <input required placeholder="Address line" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border mb-4" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />
          <div className="grid grid-cols-3 gap-3 mb-4">
            <input placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="px-4 py-2.5 rounded-lg border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />
            <input placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })}
              className="px-4 py-2.5 rounded-lg border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />
            <input placeholder="Pincode" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
              className="px-4 py-2.5 rounded-lg border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />
          </div>
          <p className="text-sm mb-4" style={{ color: "var(--ink-soft)" }}>Total: <span className="font-semibold" style={{ color: "var(--accent)" }}>₹{total}</span></p>
          {error && <p className="text-sm mb-4" style={{ color: "#B54040" }}>{error}</p>}
          <button disabled={loading} type="submit" className="w-full py-3 rounded-full font-medium disabled:opacity-60" style={{ background: "var(--accent)", color: "#fff" }}>
            {loading ? "Placing order…" : "Place order"}
          </button>
        </form>
      )}
    </div>
  );
}
