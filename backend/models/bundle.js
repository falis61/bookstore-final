const mongoose = require("mongoose");

const bundle = new mongoose.Schema(
{
title: {
type: String,
required: true,
trim: true,
},

image: {
type: String,
default: "",
trim: true,
},

description: {
type: String,
required: true,
trim: true,
},

books: [
{
type: mongoose.Types.ObjectId,
ref: "books",
required: true,
},
],

discountPercent: {
type: Number,
default: 0,
min: 0,
max: 100,
},

active: {
type: Boolean,
default: true,
},
},
{ timestamps: true }
);

module.exports = mongoose.model("bundles", bundle);