import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import Admin from "./models/Admin.js";
import mongoose from "mongoose";

const EMAIL = "admin.com";
const PASSWORD = "admin@123";

async function seed() {
  await connectDB();
  const existing = await Admin.findOne({ email: EMAIL });
  if (existing) {
    console.log("Admin already exists:", EMAIL);
  } else {
    const hashed = await bcrypt.hash(PASSWORD, 10);
    await Admin.create({ name: "Super Admin", email: EMAIL, password: hashed, role: "superadmin" });
    console.log("Admin created:");
    console.log("  email:", EMAIL);
    console.log("  password:", PASSWORD);
  }
  await mongoose.disconnect();
}

seed();