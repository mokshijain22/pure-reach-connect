import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Link } from "react-router-dom";
import api from "../api/client";

const FALLBACK_PLANS = [
  { key: "basic", label: "Basic", annualFee: 1999, productLimit: 50 },
  { key: "silver", label: "Silver", annualFee: 4999, productLimit: 200 },
  { key: "gold", label: "Gold", annualFee: 9999, productLimit: 500 },
  { key: "platinum", label: "Platinum", annualFee: 19999, productLimit: "Unlimited" },
];

export default function Home() {
  const heroRef = useRef(null);
  const [plans, setPlans] = useState(FALLBACK_PLANS);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".hero-eyebrow", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 })
      .fromTo(".hero-title", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.25")
      .fromTo(".hero-copy", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
      .fromTo(".hero-cta", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }, "-=0.25")
      .fromTo(".hero-stall", { opacity: 0, scale: 0.92, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.8 }, "-=0.5");
  }, []);

  useEffect(() => {
    api
      .get("/plans")
      .then((res) => setPlans(res.data))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section ref={heroRef} className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="hero-eyebrow text-sm mb-4" style={{ color: "var(--accent)" }}>
            For self-help groups &amp; small businesses
          </p>
          <h1 className="hero-title font-display text-4xl sm:text-5xl leading-[1.1] mb-6" style={{ color: "var(--ink)" }}>
            Your stall, online. Your customers, direct.
          </h1>
          <p className="hero-copy text-lg mb-8 max-w-md" style={{ color: "var(--ink-soft)" }}>
            A dedicated page for your business, payments straight to your own UPI, and no cut taken from a single sale you make.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/sell"
              className="hero-cta px-6 py-3 rounded-full font-medium transition-transform hover:scale-[1.03]"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Start your store
            </Link>
            <Link
              to="/marketplace"
              className="hero-cta px-6 py-3 rounded-full font-medium border transition-transform hover:scale-[1.03]"
              style={{ borderColor: "var(--border)", color: "var(--ink)" }}
            >
              Browse the marketplace
            </Link>
          </div>
        </div>

        <div className="hero-stall">
          <StallPreview />
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-24">
        <h2 className="font-display text-2xl sm:text-3xl mb-2" style={{ color: "var(--ink)" }}>
          Pick a plan that fits your stall
        </h2>
        <p className="mb-10" style={{ color: "var(--ink-soft)" }}>One annual fee. No commission on your sales, ever.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan, i) => (
            <PlanCard key={plan.key} plan={plan} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

function PlanCard({ plan, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl p-6 border flex flex-col"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <span className="font-display text-xl mb-1" style={{ color: "var(--ink)" }}>{plan.label}</span>
      <span className="text-2xl font-semibold mb-4" style={{ color: "var(--accent)" }}>
        ₹{plan.annualFee.toLocaleString("en-IN")}<span className="text-sm font-normal" style={{ color: "var(--ink-soft)" }}> /year</span>
      </span>
      <span className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>
        Up to {plan.productLimit === "unlimited" || plan.productLimit === Infinity ? "unlimited" : plan.productLimit} products
      </span>
      <Link
        to="/sell"
        className="mt-auto text-sm font-medium py-2.5 rounded-full text-center border transition-colors"
        style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
      >
        Choose {plan.label}
      </Link>
    </motion.div>
  );
}

function StallPreview() {
  return (
    <div
      className="rounded-3xl p-6 border relative overflow-hidden"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full" style={{ background: "var(--accent)" }} />
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>Radha Handlooms</p>
          <p className="text-xs" style={{ color: "var(--ink-soft)" }}>Jaipur, Rajasthan</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="aspect-square rounded-xl" style={{ background: "var(--bg-elevated)" }} />
        ))}
      </div>
    </div>
  );
}
