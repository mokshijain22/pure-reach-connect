import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Subscription from "../models/Subscription.js";
import Seller from "../models/Seller.js";
import { getPlan, PLAN_KEYS } from "../config/plans.js";

// Step 1: seller picks a plan → we create a Razorpay order for that plan's fee
export async function createSubscriptionOrder(req, res) {
  try {
    const { planKey } = req.body;
    if (!PLAN_KEYS.includes(planKey)) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    const plan = getPlan(planKey);

    const razorpayOrder = await razorpay.orders.create({
      amount: plan.annualFee * 100, // paise
      currency: "INR",
      receipt: `sub_${req.user.id}_${Date.now()}`,
      notes: { sellerId: req.user.id, plan: planKey },
    });

    const subscription = await Subscription.create({
      seller: req.user.id,
      plan: planKey,
      amount: plan.annualFee,
      razorpayOrderId: razorpayOrder.id,
      status: "created",
    });

    return res.status(201).json({
      subscriptionId: subscription._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // safe to expose, needed by frontend checkout
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not create subscription order", error: err.message });
  }
}

// Step 2: frontend calls this after Razorpay checkout succeeds, with the
// payment_id + signature Razorpay returns, so we can verify it wasn't forged.
export async function verifySubscriptionPayment(req, res) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const subscription = await Subscription.findOne({ razorpayOrderId });
    if (!subscription) return res.status(404).json({ message: "Subscription record not found" });

    const now = new Date();
    const oneYearLater = new Date(now);
    oneYearLater.setFullYear(now.getFullYear() + 1);

    subscription.status = "paid";
    subscription.razorpayPaymentId = razorpayPaymentId;
    subscription.razorpaySignature = razorpaySignature;
    subscription.validFrom = now;
    subscription.validUntil = oneYearLater;
    await subscription.save();

    await Seller.findByIdAndUpdate(subscription.seller, {
      currentPlan: subscription.plan,
      planExpiresAt: oneYearLater,
      isActive: true,
    });

    return res.json({ message: "Payment verified, plan activated", plan: subscription.plan, validUntil: oneYearLater });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Verification failed", error: err.message });
  }
}
