const mongoose = require("mongoose");

const order = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },

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

    status: {
      type: String,
      default: "Order Placed",
      enum: [
        "Order Placed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
    },

    // ✅ estimated date
    estimatedDeliveryDate: {
      type: Date,
      default: null,
    },

    // ✅ NEW FIELD
    deliveryNote: {
      type: String,
      default: "",
    },

    shippingAddress: {
      type: String,
      required: true,
    },
    billingAddress: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "Card",
    },
    cardLast4: {
      type: String,
      default: "",
    },
    hiddenFromAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", order);