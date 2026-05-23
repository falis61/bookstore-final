const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    address1: {
      type: String,
      default: "",
    },
    address2: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    zip: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    fullAddress: {
      type: String,
      default: "",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const user = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    // ✅ FIXED (no longer required → prevents signup crash)
    address: {
      type: String,
      default: "",
    },

    // new multiple addresses
    addresses: {
      type: [addressSchema],
      default: [],
    },

    phone: {
      type: String,
      default: "",
    },
    dob: {
      type: Date,
      default: null,
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
    },
    profileImage: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },

    favourites: [
      {
        type: mongoose.Types.ObjectId,
        ref: "books",
      },
    ],

    favouriteBundles: [
  {
    type: mongoose.Types.ObjectId,
    ref: "bundles",
  },
],

    cart: [
      {
        itemType: {
          type: String,
          enum: ["book", "bundle"],
          default: "book",
        },

        book: {
          type: mongoose.Types.ObjectId,
          ref: "books",
          default: null,
        },

        bundle: {
          type: mongoose.Types.ObjectId,
          ref: "bundles",
          default: null,
        },

        quantity: {
          type: Number,
          default: 1,
        },

        bundleOriginalPrice: {
          type: Number,
          default: 0,
        },

        bundlePrice: {
          type: Number,
          default: 0,
        },

        bundleDiscountPercent: {
          type: Number,
          default: 0,
        },
      },
    ],

    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "order",
      },
    ],

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      default: null,
    },

    newsletterSubscribed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", user);