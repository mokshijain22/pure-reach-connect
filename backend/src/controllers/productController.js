import Product from "../models/Product.js";
import Seller from "../models/Seller.js";
import { getPlan } from "../config/plans.js";

export async function getProductsBySellerSlug(req, res) {
  const seller = await Seller.findOne({ slug: req.params.slug, isActive: true });
  if (!seller) return res.status(404).json({ message: "Store not found" });
  const products = await Product.find({ seller: seller._id, isActive: true }).sort({ createdAt: -1 });
  return res.json(products);
}

export async function createProduct(req, res) {
  try {
    const seller = await Seller.findById(req.user.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    if (!seller.isActive || !seller.currentPlan) {
      return res.status(403).json({ message: "Activate a subscription plan before adding products" });
    }

    const plan = getPlan(seller.currentPlan);
    const existingCount = await Product.countDocuments({ seller: seller._id });

    if (existingCount >= plan.productLimit) {
      return res.status(403).json({
        message: `Your ${plan.label} plan allows up to ${plan.productLimit} products. Upgrade to add more.`,
      });
    }

    const { name, description, price, discountPrice, category, stock, images } = req.body;

    const product = await Product.create({
      seller: seller._id,
      name,
      description,
      price,
      discountPrice,
      category,
      stock,
      images: images || [],
      sellerCity: seller.city,
      sellerState: seller.state,
      sellerPincode: seller.pincode,
      sellerSearchPriority: plan.searchPriority,
    });

    return res.status(201).json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not create product", error: err.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const product = await Product.findOne({ _id: req.params.id, seller: req.user.id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const allowedFields = ["name", "description", "price", "discountPrice", "category", "stock", "images", "isActive"];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    }
    await product.save();
    return res.json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not update product", error: err.message });
  }
}

export async function deleteProduct(req, res) {
  const result = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user.id });
  if (!result) return res.status(404).json({ message: "Product not found" });
  return res.json({ message: "Product deleted" });
}

export async function getSellerProducts(req, res) {
  const products = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 });
  return res.json(products);
}

// Public search — ranking uses sellerSearchPriority (from plan) as primary sort key,
// so higher-tier sellers surface first within a matching query, then recency.
export async function searchProducts(req, res) {
  const { q, category, city, pincode, state } = req.query;

  const filter = { isActive: true };
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;

  // Locality match is scored as a boost added on top of plan priority, rather than
  // a hard filter — so a search still returns results outside the buyer's area,
  // just ranked lower than a locally-matching, plan-appropriate seller.
  const products = await Product.aggregate([
    { $match: filter },
    {
      $addFields: {
        localityBoost: {
          $sum: [
            { $cond: [{ $eq: ["$sellerPincode", pincode || null] }, 30, 0] },
            { $cond: [{ $eq: ["$sellerCity", city || null] }, 20, 0] },
            { $cond: [{ $eq: ["$sellerState", state || null] }, 10, 0] },
          ],
        },
      },
    },
    { $addFields: { rankScore: { $add: ["$sellerSearchPriority", "$localityBoost"] } } },
    { $sort: { rankScore: -1, createdAt: -1 } },
    { $limit: 60 },
    {
      $lookup: { from: "sellers", localField: "seller", foreignField: "_id", as: "seller" },
    },
    { $unwind: "$seller" },
    {
      $project: {
        name: 1, price: 1, discountPrice: 1, images: 1, category: 1, createdAt: 1,
        "seller.businessName": 1, "seller.slug": 1, "seller.city": 1, "seller.logoUrl": 1, "seller.brandColor": 1,
      },
    },
  ]);

  return res.json(products);
}

export async function getProductById(req, res) {
  const product = await Product.findById(req.params.id).populate(
    "seller",
    "businessName slug city logoUrl brandColor upiId whatsappNumber"
  );
  if (!product) return res.status(404).json({ message: "Product not found" });
  product.views += 1;
  await product.save();
  return res.json(product);
}
