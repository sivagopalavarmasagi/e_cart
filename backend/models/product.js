const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  stock: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://w7.pngwing.com/pngs/430/578/png-transparent-cardboard-box-corrugated-box-design-corrugated-fiberboard-box-miscellaneous-rectangle-cardboard-thumbnail.png",
  },
  category: {
    type: String,
    enum: ["men", "women", "kids", "jewellery", "footware", "others"],
    default: "others",
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
