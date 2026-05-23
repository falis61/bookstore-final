const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users", // fixed from "user"
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const book = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    // ✅ ADDED (discount feature)
    originalPrice: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    desc: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    popular: {
      type: Boolean,
      default: false,
    },

    trending: {
      type: Boolean,
      default: false,
    },

    classic: {
      type: Boolean,
      default: false,
    },

    booksWeLove: {
      type: Boolean,
      default: false,
    },

    ratings: {
      type: [ratingSchema],
      default: [],
    },

    avgRating: {
      type: Number,
      default: 0,
    },

    numRatings: {
      type: Number,
      default: 0,
    },

    reviews: {
      type: [reviewSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("books", book);