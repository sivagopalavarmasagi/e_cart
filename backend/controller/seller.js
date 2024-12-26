const User = require("../models/User");
const Product = require("../models/product");

const getAll = async (req, res) => {
  try {
    const users = await User.find({ type: "seller" }).select("-password -type");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSeller = async (req, res) => {
  const { id } = req.params;

  try {
    const users = await User.findById(id).select("-password -type");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSellerProducts = async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Product.find({ seller: id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAll, getSeller, getSellerProducts };
