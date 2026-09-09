import express from "express";
import multer from "multer";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  searchProducts,
  getProductById,
  getProductsBySellerSlug,
} from "../controllers/productController.js";
import { requireSeller } from "../middleware/auth.js";
import { productImageStorage } from "../config/cloudinary.js";

const router = express.Router();
const uploadImages = multer({ storage: productImageStorage });

router.get("/search", searchProducts);
router.get("/store/:slug", getProductsBySellerSlug);
router.get("/:id", getProductById);

router.get("/seller/mine", requireSeller, getSellerProducts);
router.post("/", requireSeller, createProduct);
router.patch("/:id", requireSeller, updateProduct);
router.delete("/:id", requireSeller, deleteProduct);

router.post("/upload-images", requireSeller, uploadImages.array("images", 8), (req, res) => {
  const urls = req.files.map((f) => f.path);
  res.json({ urls });
});

export default router;
