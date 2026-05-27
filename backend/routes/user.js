const router = require("express").Router();
const User = require("../models/user");
const book = require("../models/book");
const Order = require("../models/order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken, isAdmin } = require("./userAuth");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();
const admin = require("../firebaseAdmin");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const Newsletter = require("../models/newsletter");

// Sign up
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    if (!username || username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username length should be greater than 3" });
    }

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!password || password.length <= 5) {
      return res
        .status(400)
        .json({ message: "Password's length should be greater than 5" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashpass = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashpass,
      address: address || "",
      isVerified: true,
      emailVerificationToken: null,
    });

    await newUser.save();

    return res.status(200).json({
      message: "Signup successful. You can now log in.",
    });
  } catch (error) {
    console.log("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Verify email
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const existingUser = await User.findOne({
      emailVerificationToken: token,
    });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid verification link" });
    }

    existingUser.isVerified = true;
    existingUser.emailVerificationToken = null;

    await existingUser.save();

    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// sign in
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("LOGIN BODY:", req.body);
    console.log("LOGIN ATTEMPT:", username);

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    console.log("USER FOUND:", !!existingUser);

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid username/email" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (!process.env.JWT_SECRET) {
      console.log("JWT_SECRET is missing");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
        role: existingUser.role,
        name: existingUser.username,
        tokenVersion: existingUser.tokenVersion,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      id: existingUser._id,
      role: existingUser.role,
      token,
    });
  } catch (error) {
    console.log("SIGN-IN ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Google Sign-In
router.post("/google-sign-in", async (req, res) => {
  try {
    const { token } = req.body;

    console.log("TOKEN RECEIVED:", !!token);

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);

    console.log("DECODED TOKEN:", decodedToken);

    const email = decodedToken.email;
    const username = decodedToken.name || email.split("@")[0];
    const avatar =
      decodedToken.picture ||
      "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";

    if (!email) {
      return res.status(400).json({ message: "Email not found in token" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = new User({
        username,
        email,
        password: hashedPassword,
        avatar,
        address: "Not provided",
        isVerified: true,
        emailVerificationToken: null,
      });

      await user.save();
      console.log("NEW GOOGLE USER CREATED");
    } else {
      console.log("EXISTING USER LOGIN");
    }

    const authclaims = {
      name: user.username,
      role: user.role,
    };

    const jwtToken = jwt.sign(
      {
        authclaims,
        id: user._id,
        role: user.role,
        name: user.username,
        tokenVersion: user.tokenVersion,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    return res.status(200).json({
      id: user._id,
      role: user.role,
      token: jwtToken,
    });
  } catch (error) {
    console.log("GOOGLE AUTH ERROR:", error);
    return res.status(500).json({
      message: error.message || "Google authentication failed",
    });
  }
});

// forgot password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    const genericMessage =
      "If an account with that email exists, a password reset link has been sent.";

    if (!user) {
      return res.status(200).json({
        message: genericMessage,
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await sendEmail(user.email, "BookNest Password Reset", {
      type: "reset",
      username: user.username,
      resetLink,
    });

    res.status(200).json({
      message: genericMessage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

// reset password with token
router.put("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (newPassword.length <= 5) {
      return res
        .status(400)
        .json({ message: "Password's length should be greater than 5" });
    }

    const existingUser = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashpass = await bcrypt.hash(newPassword, 10);

    existingUser.password = hashpass;
    existingUser.resetPasswordToken = null;
    existingUser.resetPasswordExpires = null;

    await existingUser.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// get-user-information
router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ massage: "internal server error" });
  }
});

// update address
router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    await User.findByIdAndUpdate(id, { address: address });
    return res.status(200).json({ message: "address updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});

// update email
router.put("/update-email", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { email } = req.body;

    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail && existingEmail._id.toString() !== id) {
      return res.status(400).json({ message: "Email already exists" });
    }

    await User.findByIdAndUpdate(id, { email });
    return res.status(200).json({ message: "Email updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// update username
router.put("/update-username", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { username } = req.body;

    if (!username || username.trim() === "") {
      return res.status(400).json({ message: "Username is required" });
    }

    if (username.trim().length < 4) {
      return res
        .status(400)
        .json({ message: "Username length should be greater than 3" });
    }

    const existingUsername = await User.findOne({ username: username.trim() });

    if (existingUsername && existingUsername._id.toString() !== id) {
      return res.status(400).json({ message: "Username already exists" });
    }

    await User.findByIdAndUpdate(id, { username: username.trim() });

    return res.status(200).json({ message: "Username updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// update phone + dob
router.put("/update-user-info", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { phone, dob } = req.body;

    await User.findByIdAndUpdate(id, {
      phone: phone || "",
      dob: dob || null,
    });

    return res.status(200).json({
      message: "User info updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});
// logout all devices
router.post("/logout-all-devices", authenticateToken, async (req, res) => {
  try {
    // get user from token (safe & correct way)
    const userId =
      req.user?.id || req.user?.authclaims?.id;

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // increase token version → invalidates all old sessions
    existingUser.tokenVersion += 1;
    await existingUser.save();

    return res.status(200).json({
      message: "Logged out from all devices successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// change password
router.put("/change-password", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (newPassword.length <= 5) {
      return res
        .status(400)
        .json({ message: "Password's length should be greater than 5" });
    }

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      existingUser.password
    );

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const sameAsOld = await bcrypt.compare(newPassword, existingUser.password);

    if (sameAsOld) {
      return res
        .status(400)
        .json({
          message: "New password must be different from current password",
        });
    }

    const hashpass = await bcrypt.hash(newPassword, 10);
    existingUser.password = hashpass;

    await existingUser.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// delete account
router.delete("/delete-account", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await Order.deleteMany({ user: id });
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// update profile image
router.put(
  "/update-profile-image",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.headers;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile_images" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      await User.findByIdAndUpdate(id, {
        profileImage: result.secure_url,
      });

      return res.status(200).json({
        message: "Profile image updated successfully",
        profileImage: result.secure_url,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }
);

// remove-profile-image
router.put("/remove-profile-image", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    await User.findByIdAndUpdate(id, { profileImage: "" });

    return res.status(200).json({
      message: "Profile image removed successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ADMIN DASHBOARD STATS
router.get("/admin-stats", authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalBooks = await book.countDocuments();
    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      status: { $in: ["Order Placed", "Processing", "Shipped"] },
    });

    const deliveredOrders = await Order.countDocuments({
      status: "Delivered",
    });

    const cancelledOrders = await Order.countDocuments({
      status: "Cancelled",
    });

    const orders = await Order.find().populate("book");

    let totalRevenue = 0;
    orders.forEach((o) => {
      if (o.book && o.status !== "Cancelled") {
        totalRevenue += o.book.price;
      }
    });

    return res.json({
      status: "success",
      data: {
        totalUsers,
        totalBooks,
        totalOrders,
        totalRevenue,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error fetching stats" });
  }
});

// get all users
router.get("/get-all-users", authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");

    return res.json({
      status: "success",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error fetching users" });
  }
});

///subscribe-newsletter
router.put("/subscribe-newsletter", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const user = await User.findByIdAndUpdate(
      id,
      { newsletterSubscribed: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await sendEmail(user.email, "BookNest Subscription", {
      type: "subscription",
      username: user.username,
      unsubscribeLink: `https://bookstore-backend-x6dx.onrender.com/api/v1/unsubscribe/${user._id}`,
    });

    return res.status(200).json({
      message: "Subscribed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

///subscribe
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.newsletterSubscribed) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    user.newsletterSubscribed = true;
    await user.save();

    await sendEmail(user.email, "BookNest Subscription", {
      type: "subscription",
      username: user.username,
      unsubscribeLink: `https://bookstore-backend-x6dx.onrender.com/api/v1/unsubscribe/${user._id}`,
    });

    return res.status(200).json({
      message: "Subscribed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// unsubscribe
router.get("/unsubscribe/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).send("Invalid unsubscribe link");
    }

    user.newsletterSubscribed = false;
    await user.save();

    await sendEmail(user.email, "BookNest Unsubscribed", {
      type: "unsubscribed",
      username: user.username,
    });

    return res.send(`
      <div style="font-family: Arial, sans-serif; background:#F8F4EC; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px;">
        <div style="background:#fff; max-width:500px; width:100%; border-radius:12px; padding:32px; text-align:center; box-shadow:0 4px 14px rgba(0,0,0,0.08);">
          <h1 style="color:#5C3B1E; margin-bottom:16px;">BookNest</h1>
          <h2 style="color:#5C3B1E; margin-bottom:12px;">Unsubscribed Successfully</h2>
          <p style="color:#444; font-size:16px;">
            You have been unsubscribed from BookNest updates.
          </p>
        </div>
      </div>
    `);
  } catch (error) {
    console.log(error);
    return res.status(500).send(`
      <div style="font-family: Arial, sans-serif; background:#F8F4EC; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px;">
        <div style="background:#fff; max-width:500px; width:100%; border-radius:12px; padding:32px; text-align:center; box-shadow:0 4px 14px rgba(0,0,0,0.08);">
          <h1 style="color:#5C3B1E; margin-bottom:16px;">BookNest</h1>
          <h2 style="color:#5C3B1E; margin-bottom:12px;">Unsubscribe Failed</h2>
          <p style="color:#444; font-size:16px;">
            Something went wrong. Please try again later.
          </p>
        </div>
      </div>
    `);
  }
});

// ================= MULTIPLE ADDRESSES =================

// add new address
router.post("/add-address", authenticateToken, async (req, res) => {
  try {
    const userId = req.headers.id;

    const {
      address1,
      address2,
      city,
      state,
      zip,
      country,
      fullAddress,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAddress = {
      address1,
      address2,
      city,
      state,
      zip,
      country,
      fullAddress,
      isDefault: user.addresses.length === 0, // first one = default
    };

    user.addresses.push(newAddress);
    await user.save();

    return res.status(200).json({
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// get all addresses
router.get("/get-addresses", authenticateToken, async (req, res) => {
  try {
    const userId = req.headers.id;

    const user = await User.findById(userId);

    return res.status(200).json({
      addresses: user.addresses || [],
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// delete address
router.delete("/delete-address/:addressId", authenticateToken, async (req, res) => {
  try {
    const userId = req.headers.id;
    const { addressId } = req.params;

    const user = await User.findById(userId);

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== addressId
    );

    await user.save();

    return res.status(200).json({
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// set default address
router.put("/set-default-address/:addressId", authenticateToken, async (req, res) => {
  try {
    const userId = req.headers.id;
    const { addressId } = req.params;

    const user = await User.findById(userId);

    user.addresses = user.addresses.map((addr) => ({
      ...addr._doc,
      isDefault: addr._id.toString() === addressId,
    }));

    await user.save();

    return res.status(200).json({
      message: "Default address updated",
      addresses: user.addresses,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// edit address
router.put("/edit-address/:addressId", authenticateToken, async (req, res) => {
  try {
    const userId = req.headers.id;
    const { addressId } = req.params;

    const {
      address1,
      address2,
      city,
      state,
      zip,
      country,
      fullAddress,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found" });
    }

    user.addresses[addressIndex].address1 = address1 || "";
    user.addresses[addressIndex].address2 = address2 || "";
    user.addresses[addressIndex].city = city || "";
    user.addresses[addressIndex].state = state || "";
    user.addresses[addressIndex].zip = zip || "";
    user.addresses[addressIndex].country = country || "";
    user.addresses[addressIndex].fullAddress = fullAddress || "";

    await user.save();

    return res.status(200).json({
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;