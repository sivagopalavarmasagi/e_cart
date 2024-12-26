const router = require("express").Router();
const authConsumerToken = require("../controller/authUserToken");
const cartController = require("../controller/cart");
router.get("/", authConsumerToken, cartController.getCart);
router.post("/add", authConsumerToken, cartController.addProductToCart);

router.delete(
  "/remove",
  authConsumerToken,
  cartController.removeProductFromCart
);

router.put("/edit", authConsumerToken, cartController.editCartQuantity);
router.delete("/clear", authConsumerToken, cartController.clearCart);

module.exports = router;
