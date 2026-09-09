import express from "express";
import { sendOtp, verifyOtp } from "../controllers/customerAuthController.js";
import { placeOrder, getCustomerOrders } from "../controllers/orderController.js";
import { requireCustomer } from "../middleware/auth.js";
import Customer from "../models/Customer.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

router.get("/me", requireCustomer, async (req, res) => {
  const customer = await Customer.findById(req.user.id);
  res.json(customer);
});

router.patch("/me", requireCustomer, async (req, res) => {
  const { name, email } = req.body;
  const customer = await Customer.findByIdAndUpdate(req.user.id, { name, email }, { new: true });
  res.json(customer);
});

router.post("/addresses", requireCustomer, async (req, res) => {
  const customer = await Customer.findById(req.user.id);
  customer.addresses.push(req.body);
  await customer.save();
  res.json(customer.addresses);
});

router.post("/orders", requireCustomer, placeOrder);
router.get("/orders", requireCustomer, getCustomerOrders);

export default router;
