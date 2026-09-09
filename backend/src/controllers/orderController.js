import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Seller from "../models/Seller.js";
import { generateUpiQr } from "../utils/upiQr.js";

export async function placeOrder(req, res) {
  try {
    const { sellerId, items, shippingAddress } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: "Order must contain at least one item" });

    const seller = await Seller.findById(sellerId);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    let totalAmount = 0;
    const resolvedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) continue;
      const lineTotal = (product.discountPrice || product.price) * item.quantity;
      totalAmount += lineTotal;
      resolvedItems.push({
        product: product._id,
        name: product.name,
        price: product.discountPrice || product.price,
        quantity: item.quantity,
      });
    }

    if (!resolvedItems.length) return res.status(400).json({ message: "No valid items in order" });

    const order = await Order.create({
      customer: req.user.id,
      seller: sellerId,
      items: resolvedItems,
      totalAmount,
      shippingAddress,
    });

    const { upiUrl, qrDataUrl } = await generateUpiQr({
      upiId: seller.upiId,
      payeeName: seller.businessName,
      amount: totalAmount,
      note: `Order ${order._id}`,
    });

    return res.status(201).json({ order, payment: { upiUrl, qrDataUrl } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not place order", error: err.message });
  }
}

export async function getCustomerOrders(req, res) {
  const orders = await Order.find({ customer: req.user.id }).sort({ createdAt: -1 }).populate("seller", "businessName slug");
  return res.json(orders);
}

export async function getSellerOrders(req, res) {
  const orders = await Order.find({ seller: req.user.id }).sort({ createdAt: -1 }).populate("customer", "phone name");
  return res.json(orders);
}

// Seller manually confirms they received the direct UPI payment
export async function markOrderPaid(req, res) {
  const order = await Order.findOne({ _id: req.params.id, seller: req.user.id });
  if (!order) return res.status(404).json({ message: "Order not found" });
  order.paymentStatus = "seller_confirmed_paid";
  await order.save();
  return res.json(order);
}

export async function updateOrderStatus(req, res) {
  const { orderStatus, trackingNote } = req.body;
  const order = await Order.findOne({ _id: req.params.id, seller: req.user.id });
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (orderStatus) order.orderStatus = orderStatus;
  if (trackingNote !== undefined) order.trackingNote = trackingNote;
  await order.save();
  return res.json(order);
}
