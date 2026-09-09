import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Product images
export const productImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pure-reach-connect/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 1200, crop: "limit" }],
  },
});

// Seller brand video (Gold & Platinum only — enforced in controller, not here)
export const sellerVideoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pure-reach-connect/seller-videos",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "webm"],
  },
});

// Seller logo / banner
export const sellerBrandingStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pure-reach-connect/seller-branding",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

export default cloudinary;
