import { verifyToken } from "../utils/jwt.js";

function authFactory(expectedRole) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = header.split(" ")[1];
    try {
      const decoded = verifyToken(token);
      if (decoded.role !== expectedRole) {
        return res.status(403).json({ message: "Not authorized for this resource" });
      }
      req.user = decoded; // { id, role }
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
}

export const requireSeller = authFactory("seller");
export const requireCustomer = authFactory("customer");
export const requireAdmin = authFactory("admin");
