import express from "express";
import multer from "multer";
import { registerSeller, loginSeller, getSellerProfile } from "../controllers/sellerAuthController.js";
import { createSubscriptionOrder, verifySubscriptionPayment } from "../controllers/subscriptionController.js";
import { requireSeller, attachSellerPlan } from "../middleware/auth.js";
import { sellerBrandingStorage, sellerVideoStorage } from "../config/cloudinary.js";
import Seller from "../models/Seller.js";
import { getPlan } from "../config/plans.js";
import { getSellerAnalytics } from "../controllers/analyticsController.js";
import { sendBroadcast } from "../controllers/broadcastController.js";

const router = express.Router();
const uploadBranding = multer({ storage: sellerBrandingStorage });
const uploadVideo = multer({ storage: sellerVideoStorage });

router.post("/register", registerSeller);
router.post("/login", loginSeller);
router.get("/me", requireSeller, getSellerProfile);
router.get("/analytics", requireSeller, attachSellerPlan, getSellerAnalytics);
router.post("/broadcast", requireSeller, sendBroadcast);

// Subscription
router.post("/subscription/create-order", requireSeller, createSubscriptionOrder);
router.post("/subscription/verify", requireSeller, verifySubscriptionPayment);

// Branding uploads
router.post("/branding/logo", requireSeller, uploadBranding.single("logo"), async (req, res) => {
  const seller = await Seller.findByIdAndUpdate(req.user.id, { logoUrl: req.file.path }, { new: true });
  res.json({ logoUrl: seller.logoUrl });
});

router.post("/branding/banner", requireSeller, uploadBranding.single("banner"), async (req, res) => {
  const seller = await Seller.findById(req.user.id);
  const plan = getPlan(seller.currentPlan || "basic");
  const now = new Date();

  if (!seller.bannerCreditsResetAt || seller.bannerCreditsResetAt < now) {
    seller.bannerCreditsUsedThisYear = 0;
    const reset = new Date(now); reset.setFullYear(now.getFullYear() + 1);
    seller.bannerCreditsResetAt = reset;
  }

  if (seller.bannerCreditsUsedThisYear >= plan.bannerCreditsPerYear) {
    return res.status(403).json({ message: `Your ${plan.label} plan includes ${plan.bannerCreditsPerYear} banner update(s) per year. You've used your credit for this year.` });
  }

  seller.bannerUrl = req.file.path;
  seller.bannerCreditsUsedThisYear += 1;
  await seller.save();
  res.json({ bannerUrl: seller.bannerUrl, bannerCreditsRemaining: plan.bannerCreditsPerYear - seller.bannerCreditsUsedThisYear });
});

// Cinematic brand video — gated to Gold & Platinum
router.post("/branding/video", requireSeller, uploadVideo.single("video"), async (req, res) => {
  const seller = await Seller.findById(req.user.id);
  if (!seller.currentPlan || !getPlan(seller.currentPlan).hasVideo) {
    return res.status(403).json({ message: "Brand video is available on Gold and Platinum plans only" });
  }
  seller.brandVideoUrl = req.file.path;
  await seller.save();
  res.json({ brandVideoUrl: seller.brandVideoUrl });
});

// Profile / storefront settings update
router.patch("/me", requireSeller, async (req, res) => {
  const allowed = ["businessName", "description", "address", "city", "state", "pincode", "upiId", "whatsappNumber", "brandColor", "customDomain"];
  const updates = {};
  for (const field of allowed) if (req.body[field] !== undefined) updates[field] = req.body[field];

  if (updates.customDomain) {
    const seller = await Seller.findById(req.user.id);
    if (!seller.currentPlan || !getPlan(seller.currentPlan).customDomain) {
      return res.status(403).json({ message: "Custom domain is available on Platinum plan only" });
    }
  }

  const seller = await Seller.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
  res.json(seller);
});

// Public storefront lookup by slug
router.get("/store/:slug", async (req, res) => {
  const seller = await Seller.findOne({ slug: req.params.slug, isActive: true }).select("-password");
  if (!seller) return res.status(404).json({ message: "Store not found" });
  res.json(seller);
});

export default router;
