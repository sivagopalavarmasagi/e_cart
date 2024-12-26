const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  type: { type: String, enum: ["seller", "consumer"], required: true },
  address: { type: String, required: true }, // Added address field
});

const User = mongoose.model("User", userSchema);

module.exports = User;
