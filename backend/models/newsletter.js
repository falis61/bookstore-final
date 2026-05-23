const mongoose = require("mongoose");

const newsletter = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isSubscribed: {
      type: Boolean,
      default: true,
    },
    unsubscribeToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("newsletter", newsletter);