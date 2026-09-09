export default function Placeholder({ title }) {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-24">
      <h1 className="font-display text-3xl mb-3" style={{ color: "var(--ink)" }}>{title}</h1>
      <p style={{ color: "var(--ink-soft)" }}>This page is next in line to build — say the word and I'll build it out.</p>
    </div>
  );
}
