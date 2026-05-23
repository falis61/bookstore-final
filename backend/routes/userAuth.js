const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
      return res.status(401).json({ message: "Authentication token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // old token shape
    const oldRole = decoded?.authclaims?.role;

    // new token shape
    const newRole = decoded?.role;
    const userId = decoded?.id;
    const tokenVersion = decoded?.tokenVersion;

    // if token has new logout-all-devices fields, enforce them
    if (userId !== undefined && tokenVersion !== undefined) {
      const existingUser = await User.findById(userId);

      if (!existingUser) {
        return res.status(401).json({ message: "User not found" });
      }

      if (existingUser.tokenVersion !== tokenVersion) {
        return res
          .status(403)
          .json({ message: "Session expired. Please sign in again" });
      }
    }

    req.user = decoded; // supports both old and new token shapes
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Token expired. Please sign in again" });
  }
};

// ✅ ADMIN CHECK
const isAdmin = (req, res, next) => {
  const role = req.user?.authclaims?.role || req.user?.role;

  if (role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only" });
  }
  next();
};

module.exports = { authenticateToken, isAdmin };