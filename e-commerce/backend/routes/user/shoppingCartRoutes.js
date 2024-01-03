const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/user/shoppingCartController");
const { authenticateToken } = require("../../middleware/authMiddleWare");

// Add a product to the shopping cart
router.post("/add-to-cart", authenticateToken, async (req, res) => {
  console.log("Received POST request to /add-to-cart");
  const { userId, productId, quantity } = req.body;

  try {
    if (!userId || !productId || quantity === undefined) {
      return res
        .status(400)
        .json({
          error:
            "Invalid request. Please provide userId, productId, and quantity.",
        });
    }

    const cartItem = await cartController.addToCart(
      userId,
      productId,
      quantity
    );
    res.json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Get the user shopping cart
router.get("/:userId", authenticateToken, async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  try {
    const shoppingCart = await cartController.getShoppingCart(userId);
    res.json(shoppingCart);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Remove a product from the shopping cart
router.delete(
  "/removeFromCart/:cartItemId/:userId/:productId",
  authenticateToken,
  async (req, res) => {
    const { cartItemId, userId, productId } = req.params;

    try {
      const removedCartItem = await cartController.removeFromCart(
        cartItemId,
        userId,
        productId
      );
      res.json({
        message: "Product removed from the shopping cart",
        removedCartItem,
      });
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  }
);

// Route to update the quantity of a product in the shopping cart
router.put(
  "/updateCartItemQuantity/:cartItemId/:newQuantity/:userId",
  authenticateToken,
  async (req, res) => {
    const { cartItemId, newQuantity, userId } = req.params;
    try {
      const result = await cartController.updateCartItemQuantity(
        cartItemId,
        parseInt(newQuantity, 10),
        userId
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
