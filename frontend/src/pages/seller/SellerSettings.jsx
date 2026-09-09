import { useState } from "react";
import api from "../../api/client";
import { useSellerAuth } from "../../context/SellerAuthContext";

export default function SellerSettings() {
  const { seller, setSeller } = useSellerAuth();
  const [form, setForm] = useState({
    businessName: seller?.businessName || "",
    description: seller?.description || "",
    address: seller?.address || "",
    city: seller?.city || "",
    state: seller?.state || "",
    pincode: seller?.pincode || "",
    upiId: seller?.upiId || "",
    whatsappNumber: seller?.whatsappNumber || "",
    brandColor: seller?.brandColor || "#B5651D",
  });
  const [saved, setSaved] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    const res = await api.patch("/sellers/me", form);
    setSeller(res.data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const storeUrl = seller ? `${window.location.origin}/store/${seller.slug}` : "";

  return (
    <form onSubmit={handleSave} className="max-w-2xl">
      <h2 className="font-display text-2xl mb-2" style={{ color: "var(--ink)" }}>Store settings</h2>
      {seller && (
        <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>
          Your storefront: <a href={storeUrl} style={{ color: "var(--accent)" }}>{storeUrl}</a>
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <input placeholder="Business name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })}
          className="px-4 py-2.5 rounded-lg border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />
        <input placeholder="UPI ID (e.g. name@upi)" value={form.upiId} onChange={(e) => setForm({ ...form, upiId: e.target.value })}
          className="px-4 py-2.5 rounded-lg border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />
        <input placeholder="WhatsApp number" value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
          className="px-4 py-2.5 rounded-lg border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />
        <input type="color" value={form.brandColor} onChange={(e) => setForm({ ...form, brandColor: e.target.value })}
          className="h-11 rounded-lg border px-2" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }} />
        <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="px-4 py-2.5 rounded-lg border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />
        <input placeholder="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })}
          className="px-4 py-2.5 rounded-lg border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />
      </div>
      <textarea placeholder="About your business" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={4} className="w-full px-4 py-2.5 rounded-lg border mb-4" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />

      <button type="submit" className="px-6 py-2.5 rounded-full font-medium" style={{ background: "var(--accent)", color: "#fff" }}>
        {saved ? "Saved ✓" : "Save changes"}
      </button>
    </form>
  );
}
