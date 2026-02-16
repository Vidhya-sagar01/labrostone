const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // Note: Manual signup ke liye password zaroori hai,
    // lekin Google login users ke paas ye field empty ho sakti hai.
  },
  googleId: {
    type: String,
  },
  picture: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    houseNo: { type: String, default: "" },
    nearby: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
  },
  cart: {
    type: Array,
    default: [],
  },
  orderHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
