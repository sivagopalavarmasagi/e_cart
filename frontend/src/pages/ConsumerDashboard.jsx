import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import API_BASE_URL from "../const";

const ConsumerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([
    "men",
    "women",
    "kids",
    "jewellery",
    "footware",
    "others",
  ]); // Predefined categories
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const { token } = useContext(AuthContext);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: {
          category: selectedCategory,
          minPrice,
          maxPrice,
          page,
        },
      });
      setProducts(response.data.products);
    } catch (error) {
      alert("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products whenever the filters change
  }, [selectedCategory, minPrice, maxPrice, page]); // Re-run when any filter changes

  // Function to handle adding a product to the cart
  const handleAddToCart = async (productId) => {
    try {
      if (!token) {
        alert("You must be logged in to add items to your cart.");
        return;
      }

      await axios.post(
        `${API_BASE_URL}/cart/add`,
        { productId, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Product added to cart successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add product to cart.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
        Products
      </h2>

      {/* Filters Section */}
      <div className="mb-6">
        <div className="flex space-x-4">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          {/* Price Range Filter */}
          <div className="flex space-x-2">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min Price"
              className="p-2 border rounded-md"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max Price"
              className="p-2 border rounded-md"
            />
          </div>
        </div>
        {/* Pagination controls */}
        <div className="mt-4">
          <button
            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Previous
          </button>
          <span className="mx-4">{`Page ${page}`}</span>
          <button
            onClick={() => setPage((prevPage) => prevPage + 1)}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Next
          </button>
        </div>
      </div>

      {/* Products Section */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          <p className="text-center text-gray-600">Loading products...</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="p-4 bg-white border border-gray-300 rounded-lg shadow"
            >
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-48 rounded-md"
              />
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600">{product.category}</p>
                <p className="mt-2 text-sm text-gray-800">
                  Price: ${product.price}
                </p>
                <p
                  className={`mt-1 text-sm font-medium ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `In Stock: ${product.stock}`
                    : "Out of Stock"}
                </p>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500"
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </button>
                <Link to={`/product/${product._id}`}>
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-gray-100 rounded-md hover:bg-gray-200">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No products available.</p>
        )}
      </div>
    </div>
  );
};

export default ConsumerDashboard;
