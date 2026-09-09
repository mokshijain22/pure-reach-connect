import { useEffect, useState } from "react";
import api from "../../api/client";

export default function SellerAnalytics() {
  const [data, setData] = useState(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    api.get("/sellers/analytics").then((res) => setData(res.data)).catch((err) => {
      if (err.response?.status === 403) setLocked(true);
    });
  }, []);

  if (locked) return <p style={{ color: "var(--ink-soft)" }}>Analytics is available on Silver plans and above. Upgrade to unlock.</p>;
  if (!data) return <p style={{ color: "var(--ink-soft)" }}>Loading…</p>;

  const cards = [
    ["Total views", data.totalViews],
    ["Units sold", data.totalUnitsSold],
    ["Orders", data.totalOrders],
    ["Revenue", `₹${data.totalRevenue.toLocaleString("en-IN")}`],
  ];

  return (
    <div>
      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-xl p-5 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--ink-soft)" }}>{label}</p>
            <p className="text-2xl font-semibold" style={{ color: "var(--ink)" }}>{value}</p>
          </div>
        ))}
      </div>
      <h3 className="font-display text-lg mb-3" style={{ color: "var(--ink)" }}>Top products</h3>
      <div className="space-y-2">
        {data.topProducts.map((p) => (
          <div key={p._id} className="flex justify-between px-4 py-3 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <span style={{ color: "var(--ink)" }}>{p.name}</span>
            <span style={{ color: "var(--ink-soft)" }}>{p.views} views · {p.unitsSold} sold</span>
          </div>
        ))}
      </div>
    </div>
  );
}