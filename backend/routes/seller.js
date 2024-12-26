const router = require("express").Router();
const sellerController = require("../controller/seller");

router.get("/", sellerController.getAll);
router.get("/:id", sellerController.getSeller);
router.get("/:id/products", sellerController.getSellerProducts);

module.exports = router;
