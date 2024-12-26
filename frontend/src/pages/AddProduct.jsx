import React, { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import API_BASE_URL from "../const";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(1);
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("others");
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Unauthorized. Please login to add a product.");
      return;
    }

    const productData = { name, description, stock, price, image, category };

    try {
      await axios.post(`${API_BASE_URL}/products/add`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Product added successfully!");
      setName("");
      setDescription("");
      setStock(1);
      setPrice("");
      setImage("");
      setCategory("others");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add product.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="w-full p-8 mx-auto bg-white rounded-lg shadow-md lg:w-1/2">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Add Product
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter product name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter product description"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter stock quantity"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter product price"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter image URL"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
              <option value="jewellery">Jewellery</option>
              <option value="footware">Footware</option>
              <option value="others">Others</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
