const mongoose = require("mongoose");

const author = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    born: {
      type: String,
      default: "",
      trim: true,
    },

    died: {
      type: String,
      default: "",
      trim: true,
    },

    nationality: {
      type: String,
      default: "",
      trim: true,
    },

    genre: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("authors", author);