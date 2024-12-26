const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  totalPrice: {
    type: Number,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
