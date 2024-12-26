const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN.split(","),
    methods: ["GET", "POST", "PUT", "DELETE"],
    withCredentials: true,
  })
);

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);
const productRoutes = require("./routes/product");
app.use("/products", productRoutes);
const sellerRoutes = require("./routes/seller");
app.use("/sellers", sellerRoutes);
const cartRoutes = require("./routes/cart");
app.use("/cart", cartRoutes);
const orderRoutes = require("./routes/order");
app.use("/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the backend server");
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then((_) => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
