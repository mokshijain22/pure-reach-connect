import express from "express";
import { getSellerOrders, markOrderPaid, updateOrderStatus } from "../controllers/orderController.js";
import { requireSeller } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireSeller, getSellerOrders);
router.patch("/:id/mark-paid", requireSeller, markOrderPaid);
router.patch("/:id/status", requireSeller, updateOrderStatus);

export default router;
