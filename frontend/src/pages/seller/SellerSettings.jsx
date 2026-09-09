import { useState } from "react";
import api from "../../api/client";
import { useSellerAuth } from "../../context/SellerAuthContext";

const PLAN_ORDER = ["basic", "silver", "gold", "platinum"];

export default function SellerSettings() {
  const { seller, setSeller } = useSellerAuth();
  const planIndex = PLAN_ORDER.indexOf(seller?.currentPlan);
  const hasVideo = planIndex >= PLAN_ORDER.indexOf("gold");
  const hasCustomDomain = planIndex >= PLAN_ORDER.indexOf("platinum");
  const [uploadError, setUploadError] = useState("");

  async function handleFileUpload(field, file) {
    if (!file) return;
    setUploadError("");
    const fd = new FormData();
    fd.append(field, file);
    try {
      const endpoint = field === "logo" ? "/sellers/branding/logo" : field === "banner" ? "/sellers/branding/banner" : "/sellers/branding/video";
      const res = await api.post(endpoint, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSeller({ ...seller, ...res.data });
    } catch (err) {
      setUploadError(err.response?.data?.message || "Upload failed");
    }
  }
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
    customDomain: seller?.customDomain || "",
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
        {hasCustomDomain && (
          <input placeholder="Custom domain (e.g. shop.yourbrand.com)" value={form.customDomain || ""} onChange={(e) => setForm({ ...form, customDomain: e.target.value })}
            className="px-4 py-2.5 rounded-lg border sm:col-span-2" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />
        )}
      </div>
      <textarea placeholder="About your business" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={4} className="w-full px-4 py-2.5 rounded-lg border mb-4" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }} />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <label className="text-sm">
          <span style={{ color: "var(--ink-soft)" }}>Logo</span>
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload("logo", e.target.files[0])} className="block mt-1 text-xs" />
        </label>
        <label className="text-sm">
          <span style={{ color: "var(--ink-soft)" }}>Banner</span>
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload("banner", e.target.files[0])} className="block mt-1 text-xs" />
        </label>
        {hasVideo && (
          <label className="text-sm">
            <span style={{ color: "var(--ink-soft)" }}>Cinematic brand video</span>
            <input type="file" accept="video/*" onChange={(e) => handleFileUpload("video", e.target.files[0])} className="block mt-1 text-xs" />
          </label>
        )}
      </div>
      {uploadError && <p className="text-sm mb-4" style={{ color: "#B54040" }}>{uploadError}</p>}

      <button type="submit" className="px-6 py-2.5 rounded-full font-medium" style={{ background: "var(--accent)", color: "#fff" }}>
        {saved ? "Saved ✓" : "Save changes"}
      </button>
    </form>
  );
}
