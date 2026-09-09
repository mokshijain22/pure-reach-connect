import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(navRef.current, { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" });
  }, []);

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg) 85%, transparent)" }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl tracking-tight" style={{ color: "var(--ink)" }}>
          Pure Reach Connect
        </Link>

        <div className="hidden md:flex items-center gap-7 text-sm" style={{ color: "var(--ink-soft)" }}>
          <Link to="/marketplace" className="hover:opacity-70 transition-opacity">Marketplace</Link>
          <Link to="/sell" className="hover:opacity-70 transition-opacity">Sell with us</Link>
          <Link to="/seller/login" className="hover:opacity-70 transition-opacity">Seller login</Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors"
            style={{ borderColor: "var(--border)" }}
          >
            <motion.span
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {theme === "light" ? "🌤" : "🌙"}
            </motion.span>
          </button>

          <button
            className="md:hidden w-9 h-9 flex items-center justify-center"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <span style={{ color: "var(--ink)" }}>{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden flex flex-col gap-4 px-5 pb-5 text-sm"
          style={{ color: "var(--ink-soft)" }}
        >
          <Link to="/marketplace" onClick={() => setMenuOpen(false)}>Marketplace</Link>
          <Link to="/sell" onClick={() => setMenuOpen(false)}>Sell with us</Link>
          <Link to="/seller/login" onClick={() => setMenuOpen(false)}>Seller login</Link>
        </motion.div>
      )}
    </nav>
  );
}
