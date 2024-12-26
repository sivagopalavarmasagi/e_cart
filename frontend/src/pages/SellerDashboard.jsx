import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios";
import AuthContext from "../context/AuthContext";
import API_BASE_URL from "../const"; // Import the base URL

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [stockToAdd, setStockToAdd] = useState({}); // State to hold stock to add for each product
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) {
        alert("Please login to see products.");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data.products);
      } catch (error) {
        alert("Failed to fetch products. Please try again.");
      }
    };

    fetchProducts();
  }, [token]);

  // Handle stock change input
  const handleStockChange = (e, productId) => {
    const value = e.target.value;
    setStockToAdd((prevStock) => ({
      ...prevStock,
      [productId]: value, // Store stock value for each product
    }));
  };

  // Handle Add Stock submission
  const handleAddStock = async (productId) => {
    const stock = stockToAdd[productId];
    if (!stock || isNaN(stock)) {
      alert("Please enter a valid stock amount.");
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/products/add-stock/${productId}`,
        { stock: parseInt(stock) }, // Sending the stock (positive or negative) to backend
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the product's stock after successful update
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, stock: response.data.product.stock } // Update stock from the backend response
            : product
        )
      );

      alert(response.data.message); // Display success message after adding stock
    } catch (error) {
      alert("Failed to add stock. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
        Products List
      </h2>
      <div>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="p-4 space-y-4 bg-white border border-gray-300 rounded-md shadow-md"
              >
                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-40 rounded-md"
                />
                {/* Product Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {product.category}
                  </p>
                  <p className="mt-2 text-sm text-gray-800">
                    Price: ${product.price}
                  </p>
                  <p className="mt-2 text-sm text-gray-800">
                    Current Stock: {product.stock}
                  </p>
                </div>

                {/* Add Stock Section */}
                <div className="mt-4 space-y-2">
                  <input
                    type="number"
                    value={stockToAdd[product._id] || ""}
                    onChange={(e) => handleStockChange(e, product._id)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter stock to add"
                  />
                  <button
                    onClick={() => handleAddStock(product._id)}
                    className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-500"
                  >
                    Add Stock
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No products added yet.</p>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
