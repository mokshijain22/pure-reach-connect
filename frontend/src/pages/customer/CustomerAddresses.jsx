import { useEffect, useState } from "react";
import api from "../../api/client";
import Input from "../../components/Input";

export default function CustomerAddresses() {
  const [addresses, setAddresses] = useState(null);
  const [form, setForm] = useState({ label: "Home", line1: "", line2: "", city: "", state: "", pincode: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/customers/me").then((res) => setAddresses(res.data.addresses || []));
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post("/customers/addresses", form);
      setAddresses(res.data);
      setForm({ label: "Home", line1: "", line2: "", city: "", state: "", pincode: "" });
    } finally {
      setSaving(false);
    }
  }

  if (addresses === null) return <p style={{ color: "var(--ink-soft)" }}>Loading…</p>;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-3">
        {addresses.length === 0 && <p className="text-sm" style={{ color: "var(--ink-soft)" }}>No saved addresses yet.</p>}
        {addresses.map((a) => (
          <div key={a._id} className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--ink)" }}>{a.label}</p>
            <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
              {a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} — {a.pincode}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd}>
        <h2 className="font-display text-lg mb-4" style={{ color: "var(--ink)" }}>Add new address</h2>
        <Input label="Label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        <Input label="Address line 1" required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
        <Input label="Address line 2" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
        <Input label="City" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <Input label="State" required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
        <Input label="Pincode" required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-full font-medium transition-transform hover:scale-[1.02] disabled:opacity-60"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {saving ? "Saving…" : "Save address"}
        </button>
      </form>
    </div>
  );
}