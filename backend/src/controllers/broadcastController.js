import Seller from "../models/Seller.js";
import { getPlan } from "../config/plans.js";

// Stub — wire to Meta WhatsApp Cloud API / Twilio / Gupshup once a provider is chosen.
export async function sendBroadcast(req, res) {
  const seller = await Seller.findById(req.user.id);
  if (!seller.currentPlan || !getPlan(seller.currentPlan).hasWhatsappBroadcast) {
    return res.status(403).json({ message: "WhatsApp broadcast is available on Gold and Platinum plans only." });
  }
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Message is required" });

  // TODO: integrate WhatsApp Business API provider here.
  console.log(`[DEV] Broadcast from ${seller.businessName}: ${message}`);

  return res.json({ message: "Broadcast queued (provider integration pending)", recipientCount: seller.broadcastOptInCustomers.length });
}