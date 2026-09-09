export default function Input({ label, ...props }) {
  return (
    <label className="block mb-4">
      <span className="text-sm mb-1.5 block" style={{ color: "var(--ink-soft)" }}>{label}</span>
      <input
        {...props}
        className="w-full px-4 py-2.5 rounded-lg border outline-none transition-colors focus:ring-2"
        style={{
          background: "var(--bg-elevated)",
          borderColor: "var(--border)",
          color: "var(--ink)",
        }}
      />
    </label>
  );
}
