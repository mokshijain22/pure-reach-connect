import { motion } from "framer-motion";

const CATEGORIES = ["All", "Handloom & Textiles", "Home & Decor", "Food & Snacks", "Jewelry", "Beauty & Wellness", "Art & Craft"];

export default function ShopLayout({ children, query, onQueryChange, onSearch, category, onCategoryChange, showFilters = true }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-elevated)" }}>
      {/* Sticky shop search bar */}
      <div className="sticky top-16 z-40 border-b backdrop-blur" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg-elevated) 90%, transparent)" }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center gap-4">
          <form
            onSubmit={(e) => { e.preventDefault(); onSearch?.(query); }}
            className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-full border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <span style={{ color: "var(--ink-soft)" }}>⌕</span>
            <input
              value={query}
              onChange={(e) => onQueryChange?.(e.target.value)}
              placeholder="Search products, sellers, categories…"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "var(--ink)" }}
            />
          </form>
        </div>

        {showFilters && (
          <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-4 flex gap-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((c) => {
              const active = category === c || (c === "All" && !category);
              return (
                <motion.button
                  key={c}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onCategoryChange?.(c === "All" ? "" : c)}
                  className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition-colors"
                  style={{
                    background: active ? "var(--accent)" : "transparent",
                    color: active ? "#fff" : "var(--ink-soft)",
                    borderColor: active ? "var(--accent)" : "var(--border)",
                  }}
                >
                  {c}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">{children}</div>
    </div>
  );
}