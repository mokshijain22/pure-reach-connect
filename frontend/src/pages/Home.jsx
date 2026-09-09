import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import api from "../api/client";

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_PLANS = [
  { key: "basic", label: "Basic", annualFee: 1999, productLimit: 50 },
  { key: "silver", label: "Silver", annualFee: 4999, productLimit: 200 },
  { key: "gold", label: "Gold", annualFee: 9999, productLimit: 500 },
  { key: "platinum", label: "Platinum", annualFee: 19999, productLimit: "Unlimited" },
];

const FEATURES = [
  {
    tag: "01",
    title: "Your own page, live in minutes",
    copy: "Not a listing buried in a feed — a dedicated page with your name, your story, your products.",
    img: "https://picsum.photos/seed/prc-storefront/800/1000",
  },
  {
    tag: "02",
    title: "Every rupee, straight to you",
    copy: "Customers pay your UPI directly. No commission, no platform cut, no waiting on a payout cycle.",
    img: "https://picsum.photos/seed/prc-payment/800/1000",
  },
  {
    tag: "03",
    title: "Grow into a bigger plan",
    copy: "Start small. Add products, unlock analytics, get a cinematic video for your brand — whenever you're ready.",
    img: "https://picsum.photos/seed/prc-growth/800/1000",
  },
];

const PLAN_FEATURES = {
  basic: ["Dedicated landing page", "UPI/QR direct payment", "WhatsApp & call buttons", "Standard search ranking"],
  silver: ["Everything in Basic", "Premium page design", "Priority local search", "Business analytics dashboard", "1 banner update/year"],
  gold: ["Everything in Silver", "1–3 min cinematic brand video", "City-level top ranking", "WhatsApp broadcast", "Dedicated support"],
  platinum: ["Everything in Gold", "Unlimited products", "Custom domain", "State-level top ranking", "Personal business manager"],
};

const PLAN_ICONS = { basic: "●", silver: "◆", gold: "★", platinum: "♛" };

export default function Home() {
  const introRef = useRef(null);
  const featuresRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const ringRef = useRef(null);
  const shutterRef = useRef(null);
  const doorLeftRef = useRef(null);
  const doorRightRef = useRef(null);
  const textGroupRef = useRef(null);
  const [plans, setPlans] = useState(FALLBACK_PLANS);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ambient drift for the background shapes — independent of scroll
      gsap.to(blob1Ref.current, { x: 40, y: -30, duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(blob2Ref.current, { x: -35, y: 25, duration: 11, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(ringRef.current, { rotate: 360, duration: 30, repeat: -1, ease: "none" });

      // Starting state: shutter fully covers the screen from frame one (visible on load,
      // no scroll needed), doors closed beneath it, text hidden.
      gsap.set(shutterRef.current, { yPercent: 0 });
      gsap.set([doorLeftRef.current, doorRightRef.current], { rotateY: 0 });
      gsap.set(textGroupRef.current, { opacity: 0, y: 20 });

      // One master timeline, pinned to the single intro section — fully sequential.
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: introRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
      introTl
        // 1. Hold the shutter fully closed for a moment before it starts rising
        .to(shutterRef.current, { yPercent: 0, duration: 0.4 })
        // 2. Shutter rises and clears the screen — longer duration, as requested
        .to(shutterRef.current, { yPercent: -100, duration: 2.2, ease: "power2.inOut" })
        // 3. Doors swing open, revealing the warm glow
        .to(doorLeftRef.current, { rotateY: -110, duration: 1.2, ease: "power2.inOut" }, "+=0.1")
        .to(doorRightRef.current, { rotateY: 110, duration: 1.2, ease: "power2.inOut" }, "<")
        // 4. Wordmark + tagline fade in together, in the same centered spot
        .to(textGroupRef.current, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "+=0.1")
        // 5. Slight forward push, hands off to the next section
        .to(introRef.current, { scale: 1.05, duration: 0.8, ease: "power1.in" });

      // Each feature row: image slides in from its side, text fades up
      gsap.utils.toArray(".feature-row").forEach((row, i) => {
        const img = row.querySelector(".feature-img");
        const text = row.querySelector(".feature-text");
        const fromX = i % 2 === 0 ? -60 : 60;

        gsap.fromTo(img, { opacity: 0, x: fromX, scale: 0.95 }, {
          opacity: 1, x: 0, scale: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 75%" },
        });
        gsap.fromTo(text, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.15,
          scrollTrigger: { trigger: row, start: "top 75%" },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    api.get("/plans").then((res) => setPlans(res.data)).catch(() => {});
  }, []);

  return (
    <div className="overflow-hidden">
            {/* One continuous pinned scene: shutter covers screen on load → shutter rises →
          doors swing open → wordmark + tagline fade in together, same spot */}
      <section ref={introRef} className="h-[260vh] relative overflow-hidden">
        {/* dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* drifting accent shapes */}
        <div ref={blob1Ref} className="opener-blob pointer-events-none absolute top-[15%] left-[8%] w-72 h-72 rounded-full blur-3xl opacity-25" style={{ background: "var(--accent)" }} />
        <div ref={blob2Ref} className="opener-blob pointer-events-none absolute bottom-[15%] right-[10%] w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: "var(--success)" }} />
        <div ref={ringRef} className="opener-ring pointer-events-none absolute top-[20%] right-[15%] w-40 h-40 rounded-full border-2 opacity-30" style={{ borderColor: "var(--accent)" }} />
        <div className="pointer-events-none absolute bottom-[25%] left-[15%] w-3 h-3 rounded-full opacity-40" style={{ background: "var(--accent)" }} />
        <div className="pointer-events-none absolute top-[35%] left-[25%] w-2 h-2 rounded-full opacity-30" style={{ background: "var(--ink)" }} />

        <div className="sticky top-0 h-screen flex items-center justify-center px-5 text-center">
          {/* text layer — wordmark + tagline together, same centered spot, hidden until doors open */}
          <div className="relative z-30 flex flex-col items-center gap-4 opacity-0" ref={textGroupRef}>
            <h1 className="font-display text-6xl sm:text-8xl" style={{ color: "var(--ink)" }}>
              Pure Reach Connect
            </h1>
            <p className="font-display text-2xl sm:text-4xl leading-tight max-w-2xl" style={{ color: "var(--ink)" }}>
              Every stall deserves <span style={{ color: "var(--accent)" }}>its own front door.</span>
            </p>
          </div>

          {/* shutter — covers the whole screen from the very first frame */}
          <div
            ref={shutterRef}
            className="absolute inset-0 z-20"
            style={{
              background: "repeating-linear-gradient(180deg, var(--bg-elevated) 0px, var(--bg-elevated) 18px, var(--card) 18px, var(--card) 20px)",
            }}
          />

          {/* door frame — sits beneath the shutter, revealed once shutter rises off */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="relative w-[70vw] max-w-2xl aspect-[3/4]" style={{ perspective: "1200px" }}>
              <div
                ref={doorLeftRef}
                className="absolute top-0 left-0 w-1/2 h-full origin-left"
                style={{ background: "var(--card)", borderRight: "1px solid var(--border)" }}
              />
              <div
                ref={doorRightRef}
                className="absolute top-0 right-0 w-1/2 h-full origin-right"
                style={{ background: "var(--card)", borderLeft: "1px solid var(--border)" }}
              />
              <div
                className="absolute inset-0 -z-10 rounded-sm opacity-60"
                style={{ background: "radial-gradient(circle, var(--accent-soft), var(--bg-elevated) 75%)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature story — image + text alternating rows, scroll-revealed */}
      <section ref={featuresRef} className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        {FEATURES.map((f, i) => (
          <div
            key={f.tag}
            className={`feature-row grid md:grid-cols-2 gap-10 sm:gap-16 items-center py-20 sm:py-28 ${
              i % 2 === 1 ? "md:[direction:rtl]" : ""
            }`}
          >
            <div className="feature-img md:[direction:ltr]">
              <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl" style={{ background: "var(--card)" }}>
                <img src={f.img} alt={f.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
            <div className="feature-text md:[direction:ltr]">
              <p className="font-display text-5xl mb-4" style={{ color: "var(--accent-soft)" }}>{f.tag}</p>
              <h2 className="font-display text-3xl sm:text-4xl mb-4 leading-tight" style={{ color: "var(--ink)" }}>
                {f.title}
              </h2>
              <p className="text-lg leading-relaxed max-w-md" style={{ color: "var(--ink-soft)" }}>{f.copy}</p>
            </div>
          </div>
        ))}
      </section>

      {/* CTA before plans */}
      <section className="max-w-4xl mx-auto px-5 sm:px-8 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl sm:text-5xl mb-8" style={{ color: "var(--ink)" }}>
            Ready to open your stall?
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/sell">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-block px-8 py-4 rounded-full font-medium shadow-lg"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Start your store →
              </motion.span>
            </Link>
            <Link to="/marketplace">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-block px-8 py-4 rounded-full font-medium border"
                style={{ borderColor: "var(--border)", color: "var(--ink)" }}
              >
                Browse the marketplace
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-28">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-medium tracking-wide uppercase mb-3"
          style={{ color: "var(--accent)" }}
        >
          Pricing
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="font-display text-3xl sm:text-4xl mb-2"
          style={{ color: "var(--ink)" }}
        >
          Pick a plan that fits your stall
        </motion.h2>
        <p className="mb-14" style={{ color: "var(--ink-soft)" }}>One annual fee. No commission on your sales, ever.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <PlanCard key={plan.key} plan={plan} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

function PlanCard({ plan, index }) {
  const isPopular = plan.key === "gold";
  const monthlyEquiv = Math.round(plan.annualFee / 12);
  const features = PLAN_FEATURES[plan.key] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.25)" }}
      className="relative rounded-2xl p-6 border flex flex-col glow-border"
      style={{
        background: isPopular
          ? "linear-gradient(180deg, var(--card), var(--bg-elevated))"
          : "var(--card)",
        borderColor: isPopular ? "var(--accent)" : "var(--border)",
        borderWidth: isPopular ? "2px" : "1px",
      }}
    >
      {isPopular && (
        <motion.span
          initial={{ opacity: 0, y: -6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wide font-medium px-3 py-1 rounded-full whitespace-nowrap"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Most popular
        </motion.span>
      )}

      <span className="text-2xl mb-2" style={{ color: "var(--accent)" }}>{PLAN_ICONS[plan.key]}</span>
      <span className="font-display text-xl mb-1" style={{ color: "var(--ink)" }}>{plan.label}</span>

      <div className="mb-1 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold" style={{ color: "var(--ink)" }}>
          ₹{plan.annualFee.toLocaleString("en-IN")}
        </span>
        <span className="text-sm" style={{ color: "var(--ink-soft)" }}>/year</span>
      </div>
      <span className="text-xs mb-6" style={{ color: "var(--ink-soft)" }}>
        ≈ ₹{monthlyEquiv.toLocaleString("en-IN")}/month
      </span>

      <div className="h-px w-full mb-5" style={{ background: "var(--border)" }} />

      <ul className="space-y-2.5 mb-8 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "var(--ink-soft)" }}>
            <span className="mt-0.5 flex-shrink-0" style={{ color: "var(--success)" }}>✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        to="/sell"
        className="text-sm font-medium py-3 rounded-full text-center transition-colors"
        style={isPopular ? { background: "var(--accent)", color: "#fff" } : { border: "1px solid var(--accent)", color: "var(--accent)" }}
      >
        Choose {plan.label}
      </Link>
    </motion.div>
  );
}