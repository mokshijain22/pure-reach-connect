import express from "express";
import {
  loginAdmin,
  listSellers,
  verifySeller,
  suspendSeller,
  dashboardSummary,
} from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/dashboard", requireAdmin, dashboardSummary);
router.get("/sellers", requireAdmin, listSellers);
router.patch("/sellers/:id/verify", requireAdmin, verifySeller);
router.patch("/sellers/:id/suspend", requireAdmin, suspendSeller);

export default router;
