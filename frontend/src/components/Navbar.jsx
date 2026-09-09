import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useTheme } from "../context/ThemeContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { useCart } from "../context/CartContext";

function getZone(pathname) {
  if (pathname === "/admin") return "admin";
  if (pathname.startsWith("/seller") || pathname.startsWith("/sell")) return "seller";
  return "customer";
}

function customerLinks(customer) {
  const role = localStorage.getItem("prc-role");
  const links = [{ to: "/", label: "Home" }, { to: "/marketplace", label: "Marketplace" }];
  // Only show seller entry points to someone who hasn't chosen a role yet at all
  if (!role) {
    links.push({ to: "/sell", label: "Sell with us" }, { to: "/seller/login", label: "Seller login" });
  }
  links.push(customer ? { to: "/account", label: "My Account" } : { to: "/login", label: "Login" });
  return links;
}

const ZONE_LINKS = {
  seller: [
    { to: "/seller/dashboard", label: "Dashboard" },
    { to: "/marketplace", label: "View marketplace" },
  ],
  admin: [{ to: "/marketplace", label: "Exit admin" }],
};

const ZONE_LABEL = { customer: "Marketplace", seller: "Seller Console", admin: "Admin" };

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const zone = getZone(pathname);
  const { customer } = useCustomerAuth();
  const { clearCart } = useCart();
  const links = zone === "customer" ? customerLinks(customer) : ZONE_LINKS[zone];

  function handleSwitchMode() {
    if (zone === "seller") {
      clearCart();
      localStorage.setItem("prc-role", "customer");
      navigate("/marketplace", { replace: true });
      return;
    }

    localStorage.setItem("prc-role", "seller");
    navigate("/seller/login", { replace: true });
  }

  useEffect(() => {
    gsap.fromTo(navRef.current, { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" });
  }, [zone]);

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg) 85%, transparent)" }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={zone === "seller" ? "/seller/dashboard" : zone === "admin" ? "/admin" : "/"}
            className="font-display text-xl tracking-tight"
            style={{ color: "var(--ink)" }}
          >
            Pure Reach Connect
          </Link>
          {zone !== "customer" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full font-medium"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {ZONE_LABEL[zone]}
            </motion.span>
          )}
        </div>

        <div className="hidden md:flex items-center gap-7 text-sm" style={{ color: "var(--ink-soft)" }}>
          {links.map((l) => (
            <motion.div key={l.to} whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Link to={l.to} className="hover:opacity-70 transition-opacity">{l.label}</Link>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {(zone === "customer" || zone === "seller") && localStorage.getItem("prc-role") && (
            <button
              onClick={handleSwitchMode}
              className="text-xs px-3 py-1.5 rounded-full border"
              style={{ color: "var(--ink-soft)", borderColor: "var(--border)" }}
            >
              Switch mode
            </button>
          )}
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
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}>{l.label}</Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
}
