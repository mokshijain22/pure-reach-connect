import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    category: { type: String, trim: true, index: true },
    images: [{ type: String }], // Cloudinary URLs
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

    // Denormalized for fast search/ranking without populate on every query
    sellerCity: { type: String, index: true },
    sellerState: { type: String, index: true },
    sellerPincode: { type: String, index: true },
    sellerSearchPriority: { type: Number, default: 1 }, // copied from plan at write time

    views: { type: Number, default: 0 },
    unitsSold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", category: "text" });

export default mongoose.model("Product", productSchema);
