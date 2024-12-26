const Product = require("../models/product");

const addProduct = async (req, res) => {
  try {
    const { name, description, stock, price, image, category } = req.body;

    // Validation for required fields
    if (!name || !price) {
      return res
        .status(400)
        .json({ message: "Product name and price are required." });
    }

    // Category validation: Check if the category is valid
    const validCategories = [
      "men",
      "women",
      "kids",
      "jewellery",
      "footware",
      "others",
    ];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({
        message:
          "Invalid category. Must be one of: 'electronics', 'clothing', 'accessories', 'books', or 'others'.",
      });
    }

    // Set default values for optional fields if not provided
    const newProduct = new Product({
      name,
      description: description || "", // Default to an empty string if not provided
      stock: stock || 1, // Default to 1 if not provided
      price,
      image:
        image ||
        "https://w7.pngwing.com/pngs/430/578/png-transparent-cardboard-box-corrugated-box-design-corrugated-fiberboard-box-miscellaneous-rectangle-cardboard-thumbnail.png", // Default to the provided image URL if not provided
      category: category || "others", // Default to "others" if not provided
      seller: req.user._id, // Use the authenticated seller's _id
    });

    // Save the product to the database
    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product added successfully.", product: newProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    // Extract query parameters from the request
    const { category, minPrice, maxPrice, page = 1, limit } = req.query;

    // Build filter object based on query parameters
    const filter = {};

    // Handle the category filter (if provided)
    if (category) {
      if (category !== "") {
        filter.category = category; // Only apply category filter if it's not an empty string
      }
    }

    // Handle the price range filter (minPrice and maxPrice)
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        const min = Number(minPrice);
        if (!isNaN(min)) filter.price.$gte = min; // Greater than or equal to minPrice
      }
      if (maxPrice) {
        const max = Number(maxPrice);
        if (!isNaN(max)) filter.price.$lte = max; // Less than or equal to maxPrice
      }
    }

    // Pagination: Ensure page is a number and provide default value if not supplied
    const pageNumber = Math.max(1, Number(page) || 1); // Ensure page is at least 1

    // Pagination limit (only if provided)
    const pageLimit = limit ? Math.max(1, Number(limit)) : null; // Use the provided limit or null if not given

    // Fetch products with filters and pagination (if limit is provided)
    const productsQuery = Product.find(filter).skip(
      (pageNumber - 1) * (pageLimit || 0)
    ); // Apply skip for pagination

    if (pageLimit) {
      productsQuery.limit(pageLimit); // Apply limit if provided
    }

    // Fetch products and the total number of matching products
    const products = await productsQuery;
    const totalProducts = await Product.countDocuments(filter);

    // Send paginated response
    res.status(200).json({
      products,
      totalProducts,
      totalPages: pageLimit ? Math.ceil(totalProducts / pageLimit) : 1, // Total pages if limit is provided
      currentPage: pageNumber,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the request parameters

    // Validate the format of the ID (MongoDB ObjectId format)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID format." });
    }

    // Find the product by its ID
    const product = await Product.findById(id);

    // If the product is not found, return a 404 error
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // If the product is found, return the product details
    res.status(200).json({ product });
  } catch (error) {
    // Handle any server errors
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params; // Product ID from URL
  const userId = req.user._id; // Seller ID from authenticated user

  try {
    // Find the product by ID and ensure it belongs to the logged-in seller
    const product = await Product.findOne({ _id: id, seller: userId });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized access." });
    }

    // Remove the product
    await product.remove();

    // Respond with success
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

const addStock = async (req, res) => {
  const { id } = req.params; // Product ID from URL
  const { stock } = req.body; // New stock value from request body
  const userId = req.user._id; // Seller ID from authenticated user

  try {
    // Find the product by ID and ensure it belongs to the logged-in seller
    const product = await Product.findOne({ _id: id, seller: userId });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized access." });
    }

    // Update the stock value
    let newStock = product.stock + stock;

    // If the stock is less than 0, set it to 0
    if (newStock < 0) {
      newStock = 0;
    }

    // Update the product's stock in the database
    product.stock = newStock;

    // Save the updated product
    await product.save();

    // Respond with success
    res.status(200).json({ message: "Stock updated successfully.", product });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductDetails,
  deleteProduct,
  addStock,
};
