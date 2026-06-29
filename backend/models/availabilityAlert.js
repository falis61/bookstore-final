const mongoose = require("mongoose");

const availabilityAlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },

    book: {
      type: mongoose.Types.ObjectId,
      ref: "books",
      required: true,
    },

    notified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent same user from creating duplicate alert for same book
availabilityAlertSchema.index({ user: 1, book: 1 }, { unique: true });

module.exports = mongoose.model("availabilityAlert", availabilityAlertSchema);