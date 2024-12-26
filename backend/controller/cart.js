const Cart = require("../models/cart");
const Product = require("../models/product");

const addProductToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the requested quantity is available in stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Check if the cart exists for the user
    let cart = await Cart.findOne({ user: userId });

    // If no cart exists for the user, create a new one
    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [
          {
            product: productId,
            quantity,
          },
        ],
      });
    } else {
      // If the cart exists, check if the product is already in the cart
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId.toString()
      );

      if (existingProductIndex >= 0) {
        // Update the quantity if the product already exists in the cart
        const currentQuantity = cart.products[existingProductIndex].quantity;
        const newQuantity = currentQuantity + quantity;

        // Check if the updated quantity exceeds the stock
        if (product.stock < newQuantity) {
          return res
            .status(400)
            .json({ message: "Not enough stock available" });
        }

        // Update the quantity in the cart
        cart.products[existingProductIndex].quantity = newQuantity;
      } else {
        // Add new product to the cart
        cart.products.push({ product: productId, quantity });
      }
    }

    // Save the updated cart
    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const removeProductFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove the product from the cart
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Remove the product from the cart array
    cart.products.splice(productIndex, 1);

    // Save the updated cart
    await cart.save();
    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const editCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Find the product details from the Product model
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the requested quantity is greater than the available stock
    if (quantity > product.stock) {
      return res.status(400).json({
        message: `Insufficient stock. Only ${product.stock} items are available.`,
      });
    }

    // Update the quantity of the product in the cart
    cart.products[productIndex].quantity = quantity;

    // Save the updated cart
    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the authenticated user (middleware)

    // Find the cart for the user
    const cart = await Cart.findOne({ user: userId });

    // If the cart doesn't exist, return a message indicating it's empty
    if (!cart) {
      return res.status(200).json({ message: "Cart empty", products: [] });
    }

    // Return the cart's products if the cart is found
    res
      .status(200)
      .json({ message: "Cart retrieved", products: cart.products });
  } catch (error) {
    // Return an error if something goes wrong
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the authenticated user (middleware)

    const cart = await Cart.findOneAndDelete({ user: userId });

    return res.status(200).json({ message: "Cart empty" });
  } catch (error) {
    // Return an error if something goes wrong
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  getCart,
  addProductToCart,
  removeProductFromCart,
  editCartQuantity,
  clearCart,
};
