import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import Seller from "../models/Seller.js";
import Order from "../models/Order.js";
import Subscription from "../models/Subscription.js";
import { signToken } from "../utils/jwt.js";

export async function loginAdmin(req, res) {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({ id: admin._id, role: "admin" });
  return res.json({ token, admin: { id: admin._id, name: admin.name, role: admin.role } });
}

export async function listSellers(req, res) {
  const sellers = await Seller.find().select("-password").sort({ createdAt: -1 });
  return res.json(sellers);
}

export async function verifySeller(req, res) {
  const seller = await Seller.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
  if (!seller) return res.status(404).json({ message: "Seller not found" });
  return res.json(seller);
}

export async function suspendSeller(req, res) {
  const { suspend } = req.body;
  const seller = await Seller.findByIdAndUpdate(req.params.id, { isSuspended: !!suspend }, { new: true });
  if (!seller) return res.status(404).json({ message: "Seller not found" });
  return res.json(seller);
}

export async function dashboardSummary(req, res) {
  const [totalSellers, activeSellers, totalOrders, revenueAgg] = await Promise.all([
    Seller.countDocuments(),
    Seller.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Subscription.aggregate([{ $match: { status: "paid" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
  ]);

  const planBreakdown = await Seller.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: "$currentPlan", count: { $sum: 1 } } },
  ]);

  return res.json({
    totalSellers,
    activeSellers,
    totalOrders,
    subscriptionRevenue: revenueAgg[0]?.total || 0,
    planBreakdown,
  });
}
