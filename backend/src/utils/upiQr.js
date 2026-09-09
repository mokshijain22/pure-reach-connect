import QRCode from "qrcode";

// Generates a scannable UPI payment QR (data URL) from a seller's UPI ID.
// No gateway involved — this is just an encoded UPI deep link, same as any
// static QR sticker a shop would print, but generated per-order with the
// exact amount pre-filled for convenience.
export async function generateUpiQr({ upiId, payeeName, amount, note }) {
  if (!upiId) throw new Error("Seller has not set up a UPI ID yet");

  const params = new URLSearchParams({
    pa: upiId, // payee address
    pn: payeeName || "Seller",
    ...(amount ? { am: amount.toFixed(2) } : {}),
    cu: "INR",
    ...(note ? { tn: note } : {}),
  });

  const upiUrl = `upi://pay?${params.toString()}`;
  const qrDataUrl = await QRCode.toDataURL(upiUrl, { width: 400, margin: 1 });
  return { upiUrl, qrDataUrl };
}
