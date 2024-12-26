const router = require("express").Router();
const authUserToken = require("../controller/authUserToken");
const authSellerToken = require("../controller/authSellerToken");
const orderController = require("../controller/order");

/* The routes should maintain the order */

router.post("/place", authUserToken, orderController.placeOrder);
router.get("/seller", authSellerToken, orderController.getSellerOrders);
router.get("/seller/:orderId", authSellerToken, orderController.getSellerOrder);
router.get("/", authUserToken, orderController.getOrders);
router.get("/:orderId", authUserToken, orderController.getOrder);

module.exports = router;
