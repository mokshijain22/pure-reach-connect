import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { getPlan } from "../config/plans.js";

export async function getSellerAnalytics(req, res) {
  const plan = req.sellerPlan;
  if (!plan || !getPlan(plan).hasAnalyticsDashboard) {
    return res.status(403).json({ message: "Analytics is available on Silver plans and above." });
  }

  const sellerId = new mongoose.Types.ObjectId(req.user.id);

  const [productAgg, orderAgg, topProducts] = await Promise.all([
    Product.aggregate([
      { $match: { seller: sellerId } },
      { $group: { _id: null, totalViews: { $sum: "$views" }, totalUnitsSold: { $sum: "$unitsSold" }, productCount: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { seller: sellerId } },
      { $group: { _id: null, totalOrders: { $sum: 1 }, totalRevenue: { $sum: "$totalAmount" } } },
    ]),
    Product.find({ seller: req.user.id }).sort({ views: -1 }).limit(5).select("name views unitsSold"),
  ]);

  return res.json({
    totalViews: productAgg[0]?.totalViews || 0,
    totalUnitsSold: productAgg[0]?.totalUnitsSold || 0,
    productCount: productAgg[0]?.productCount || 0,
    totalOrders: orderAgg[0]?.totalOrders || 0,
    totalRevenue: orderAgg[0]?.totalRevenue || 0,
    topProducts,
  });
}