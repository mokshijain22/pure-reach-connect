import { useState } from "react";
import api from "../../api/client";
import Input from "../../components/Input";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

export default function CustomerProfile() {
  const { customer, setCustomer } = useCustomerAuth();
  const [form, setForm] = useState({ name: customer?.name || "", email: customer?.email || "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch("/customers/me", form);
      setCustomer(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="max-w-md">
      <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input label="Phone" value={customer?.phone || ""} disabled />
      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 rounded-full font-medium transition-transform hover:scale-[1.02] disabled:opacity-60"
        style={{ background: saved ? "var(--success)" : "var(--accent)", color: "#fff" }}
      >
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
      </button>
    </form>
  );
}