import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // hashed
    phone: { type: String, required: true, trim: true },

    slug: { type: String, required: true, unique: true }, // for /store/:slug landing page

    // Location — drives pincode/city/state ranking scope per plan
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },

    // Branding
    logoUrl: { type: String },
    bannerUrl: { type: String },
    bannerCreditsUsedThisYear: { type: Number, default: 0 },
    bannerCreditsResetAt: { type: Date },
    brandColor: { type: String, default: "#B5651D" }, // per-seller accent, keeps stalls distinct
    description: { type: String, trim: true },

    // Cinematic video — Gold & Platinum only
    brandVideoUrl: { type: String },

    // Direct payment — plain UPI, NOT routed through Razorpay
    upiId: { type: String, trim: true },

    // Contact
    whatsappNumber: { type: String, trim: true },

    // Subscription
    currentPlan: {
      type: String,
      enum: ["basic", "silver", "gold", "platinum"],
      default: null, // null until first payment succeeds
    },
    planExpiresAt: { type: Date },
    isActive: { type: Boolean, default: false }, // becomes true after successful subscription payment

    // Custom domain — Platinum only
    customDomain: { type: String, trim: true },

    isVerified: { type: Boolean, default: false }, // admin verification
    isSuspended: { type: Boolean, default: false },
    broadcastOptInCustomers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }], // Gold+ only
  },
  { timestamps: true }
);

sellerSchema.index({ city: 1 });
sellerSchema.index({ pincode: 1 });
sellerSchema.index({ state: 1 });

export default mongoose.model("Seller", sellerSchema);
