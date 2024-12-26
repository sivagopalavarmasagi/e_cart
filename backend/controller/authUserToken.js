const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Adjust path to your User model

const authSellerToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token required." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user data
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if user is a seller
    if (user.type !== "consumer") {
      return res
        .status(403)
        .json({ message: "Access denied. Not a consumer." });
    }

    req.user = user; // Attach user data to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Invalid token.", error: error.message });
  }
};

module.exports = authSellerToken;
