import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String, // snapshot at time of order
    price: Number,
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true, index: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },

    shippingAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
    },

    // No platform payment gateway for this leg — customer pays seller directly
    // via UPI/QR outside the app. Seller marks payment received manually.
    paymentStatus: {
      type: String,
      enum: ["pending_direct_payment", "seller_confirmed_paid"],
      default: "pending_direct_payment",
    },

    orderStatus: {
      type: String,
      enum: ["placed", "packed", "shipped", "delivered", "cancelled"],
      default: "placed",
    },
    trackingNote: { type: String, trim: true }, // seller-managed delivery, free-text
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
