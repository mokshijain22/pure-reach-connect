import express from "express";
import { PLANS } from "../config/plans.js";

const router = express.Router();

router.get("/", (req, res) => {
  // Infinity becomes `null` over JSON, so swap it for a string the frontend can check for.
  const serializable = Object.values(PLANS).map((plan) => ({
    ...plan,
    productLimit: plan.productLimit === Infinity ? "unlimited" : plan.productLimit,
  }));
  res.json(serializable);
});

export default router;