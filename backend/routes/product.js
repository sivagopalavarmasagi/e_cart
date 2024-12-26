const router = require("express").Router();
const authSellerToken = require("../controller/authSellerToken");
const productController = require("../controller/product");

router.post("/add", authSellerToken, productController.addProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductDetails);
router.put("/add-stock/:id", authSellerToken, productController.addStock);
router.delete("/remove/:id", productController.deleteProduct);
module.exports = router;
