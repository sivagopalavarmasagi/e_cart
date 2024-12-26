import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const SellerNavbar = () => {
  const { loggedIn, setLoggedIn, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="p-4 bg-blue-500">
      <div className="container flex items-center justify-between mx-auto">
        <h1 className="text-xl font-bold text-white">Seller Dashboard</h1>
        <ul className="flex space-x-4">
          <li>
            <Link
              to="/seller/"
              className="text-white transition duration-300 hover:text-gray-300"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/seller/add-product"
              className="text-white transition duration-300 hover:text-gray-300"
            >
              Add Products
            </Link>
          </li>
          <li>
            <Link
              to="/seller/orders"
              className="text-white transition duration-300 hover:text-gray-300"
            >
              Orders
            </Link>
          </li>
          <li>
            {loggedIn === true ? (
              <Link to="/login" className="hover:text-gray-300">
                Logout
              </Link>
            ) : (
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SellerNavbar;
