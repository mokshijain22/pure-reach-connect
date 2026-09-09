import bcrypt from "bcryptjs";
import Seller from "../models/Seller.js";
import { signToken } from "../utils/jwt.js";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function registerSeller(req, res) {
  try {
    const { businessName, ownerName, email, password, phone, city, state, pincode } = req.body;

    if (!businessName || !ownerName || !email || !password || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Seller.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    // Ensure unique slug
    let baseSlug = slugify(businessName);
    let slug = baseSlug;
    let counter = 1;
    while (await Seller.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await Seller.create({
      businessName,
      ownerName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      slug,
      city,
      state,
      pincode,
      // currentPlan stays null and isActive stays false until subscription payment succeeds
    });

    const token = signToken({ id: seller._id, role: "seller" });

    return res.status(201).json({
      token,
      seller: {
        id: seller._id,
        businessName: seller.businessName,
        slug: seller.slug,
        email: seller.email,
        currentPlan: seller.currentPlan,
        isActive: seller.isActive,
      },
      nextStep: "select_plan",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Registration failed", error: err.message });
  }
}

export async function loginSeller(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const seller = await Seller.findOne({ email: email.toLowerCase() });
    if (!seller) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, seller.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    if (seller.isSuspended) {
      return res.status(403).json({ message: "This account has been suspended. Contact support." });
    }

    const token = signToken({ id: seller._id, role: "seller" });

    return res.json({
      token,
      seller: {
        id: seller._id,
        businessName: seller.businessName,
        slug: seller.slug,
        email: seller.email,
        currentPlan: seller.currentPlan,
        isActive: seller.isActive,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Login failed", error: err.message });
  }
}

export async function getSellerProfile(req, res) {
  const seller = await Seller.findById(req.user.id).select("-password");
  if (!seller) return res.status(404).json({ message: "Seller not found" });
  return res.json(seller);
}
