import Razorpay from "razorpay";

// Used ONLY for seller → platform subscription payments.
// Customer → seller product payments never touch this instance (see utils/upiQr.js).
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;
