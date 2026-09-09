import Customer from "../models/Customer.js";
import Otp from "../models/Otp.js";
import { signToken } from "../utils/jwt.js";
import twilio from "twilio";

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const twilioClient = process.env.TWILIO_ACCOUNT_SID
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export async function sendOtp(req, res) {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await Otp.create({ phone, code, expiresAt });

    if (twilioClient) {
      await twilioClient.messages.create({
        body: `Your Pure Reach Connect OTP is ${code}. Valid for 5 minutes.`,
        from: process.env.TWILIO_FROM_NUMBER,
        to: phone,
      });
    } else {
      console.log(`[DEV] OTP for ${phone}: ${code}`);
    }

    return res.json({ message: "OTP sent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not send OTP", error: err.message });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ message: "Phone and code are required" });

    const otpDoc = await Otp.findOne({ phone, verified: false }).sort({ createdAt: -1 });
    if (!otpDoc) return res.status(400).json({ message: "No pending OTP for this number" });

    if (otpDoc.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired, please request a new one" });
    }

    if (otpDoc.attempts >= 5) {
      return res.status(429).json({ message: "Too many attempts, request a new OTP" });
    }

    if (otpDoc.code !== code) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    otpDoc.verified = true;
    await otpDoc.save();

    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = await Customer.create({ phone });
    }

    const token = signToken({ id: customer._id, role: "customer" });

    return res.json({
      token,
      customer: { id: customer._id, phone: customer.phone, name: customer.name },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
}
