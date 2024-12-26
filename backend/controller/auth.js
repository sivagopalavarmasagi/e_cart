const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const register = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password, confirmPassword, type, address } = req.body;

    // Validation: Check if all fields are provided
    if (!name || !email || !password || !confirmPassword || !type || !address) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validation: Check if the type is valid
    if (!["seller", "consumer"].includes(type)) {
      return res
        .status(400)
        .json({ message: "Type must be 'seller' or 'consumer'." });
    }

    // Validation: Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Check if the user already exists with the same email and type
    const existingUser = await User.findOne({ email, type });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: `Email already registered as a ${type}.` });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      type,
      address,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

// Login Route
const login = async (req, res) => {
  try {
    const { email, password, type } = req.body;

    // Validation
    if (!email || !password || !type) {
      return res
        .status(400)
        .json({ message: "Email, password, and type are required." });
    }

    if (!["seller", "consumer"].includes(type)) {
      return res
        .status(400)
        .json({ message: "Type must be 'seller' or 'consumer'." });
    }

    // Find user by email and type
    const user = await User.findOne({ email, type });
    if (!user) {
      return res
        .status(400)
        .json({ message: `No ${type} account found with this email.` });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Create a JWT token
    const token = jwt.sign(
      { _id: user._id, type: user.type },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      userType: user.type,
      id: user._id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

module.exports = { register, login };
