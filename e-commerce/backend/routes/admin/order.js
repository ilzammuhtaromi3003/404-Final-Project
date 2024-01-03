const express = require("express");
const router = express.Router();

const OrderController = require("../../controllers/admin/orderController");
const { authMiddleware } = require("../../middleware/authMiddleWare");

router.get("/", authMiddleware, OrderController.getAllOrders);
router.get("/detail", authMiddleware, OrderController.getOrderDetails);
router.get("/:id", authMiddleware, OrderController.getOrderById);
router.put("/:id", authMiddleware, OrderController.updateOrder);
router.delete("/:id", authMiddleware, OrderController.deleteOrder);

module.exports = router;
