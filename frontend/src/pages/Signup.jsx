import react, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../const";
const Signup = () => {
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("consumer");
  const [address, setAddress] = useState(""); // Added state for address

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
        confirmPassword,
        type: role,
        address,
      });
      console.log("Signup successful:", response.data);
      alert("Signup successful!");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-teal-600">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign Up
        </h2>
        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setname(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder="Confirm your password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
            >
              <option value="consumer">Consumer</option>
              <option value="seller">Seller</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder="Enter your address"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/" className="text-green-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};
export default Signup;
