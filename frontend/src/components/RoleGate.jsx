import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function RoleGate() {
  const navigate = useNavigate();

  function choose(role) {
    localStorage.setItem("prc-role", role);
    navigate(role === "seller" ? "/seller/login" : "/marketplace", { replace: true });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-5 overflow-hidden"
    >
      {/* background photo, desaturated + darkened for contrast and mood */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1800&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "saturate(0.55) brightness(0.75)",
        }}
      />
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(180deg, rgba(10,9,7,0.55) 0%, rgba(10,9,7,0.72) 55%, rgba(10,9,7,0.85) 100%)" }}
      />

      {/* faint corner taglines — quieter, no bright accent color */}
      <span className="hidden md:block absolute top-10 right-14 font-display italic text-base text-white/40 text-right leading-relaxed">
        Local Roots
        <br />
        Global Reach
      </span>
      <span className="hidden md:block absolute bottom-10 right-14 font-display italic text-base text-white/40 text-right leading-relaxed">
        Good Products
        <br />
        Brighter Communities
      </span>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full text-center"
      >
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/50 mb-4">Pure Reach Connect</p>

        <h1 className="font-display italic text-4xl sm:text-5xl text-white mb-4" style={{ letterSpacing: "-0.01em" }}>
          Welcome
        </h1>

        <div className="w-10 h-px bg-white/30 mx-auto mb-5" />

        <p className="text-sm sm:text-base text-white/70 mb-12">
          Tell us why you're here, so we can take you to the right place.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => choose("customer")}
            className="group relative rounded-xl p-7 text-left border transition-colors"
            style={{
              background: "rgba(255,255,255,0.06)",
              borderColor: "rgba(255,255,255,0.14)",
              backdropFilter: "blur(14px)",
            }}
          >
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg mb-6 border"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)" }}
            >
              ◇
            </span>
            <p className="font-display text-xl text-white mb-2">I'm here to shop</p>
            <p className="text-sm text-white/55 mb-6">Browse products from local sellers and stalls.</p>
            <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
              Continue <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </motion.button>

          <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => choose("seller")}
            className="group relative rounded-xl p-7 text-left border transition-colors"
            style={{
              background: "rgba(255,255,255,0.06)",
              borderColor: "rgba(255,255,255,0.14)",
              backdropFilter: "blur(14px)",
            }}
          >
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg mb-6 border"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)" }}
            >
              ◆
            </span>
            <p className="font-display text-xl text-white mb-2">I want to sell</p>
            <p className="text-sm text-white/55 mb-6">Set up your stall and reach customers directly.</p>
            <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
              Continue <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </motion.button>
        </div>

        <div className="flex items-center justify-center gap-8 sm:gap-14 text-[11px] uppercase tracking-widest text-white/45">
          <span>Discover Local</span>
          <span className="w-px h-3 bg-white/20" />
          <span>Empower Communities</span>
          <span className="w-px h-3 bg-white/20" />
          <span>A Fairer Future</span>
        </div>
      </motion.div>
    </motion.div>
  );
}