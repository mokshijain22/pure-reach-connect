import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true, index: true },
    plan: { type: String, enum: ["basic", "silver", "gold", "platinum"], required: true },
    amount: { type: Number, required: true },

    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },

    validFrom: { type: Date },
    validUntil: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
