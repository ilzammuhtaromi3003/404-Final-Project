const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/user/orderController');
const { authenticateToken } = require('../../middleware/authMiddleWare');


router.post('/:userId', authenticateToken, async (req, res) => {
  const userId = req.params.userId;
  const promoCode = req.body.promoCode;
  const courier = "pos";

  try {
    const order = await orderController.createOrder(userId, promoCode, courier);
    return res.status(200).json({ message: 'Order processed successfully', orderId: order.order_id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:userId', authenticateToken, async (req, res) => {
  const userId = req.params.userId;

  try {
    const orders = await orderController.getOrdersForUser(userId);
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/calculateTotalPrice', async (req, res) => {
  try {
    const orderItems = req.body.orderItems;
    const totalPrice = orderItems.reduce((total, item) => {
      const itemPrice = item.product.price || 0;
      return total + item.quantity * itemPrice;
    }, 0);
    res.json({ totalPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to calculate total price' });
  }
});

router.get('/getById/:orderId', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderController.getOrderById(orderId);
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

router.post('/completeOrder/:orderId', authenticateToken, async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const completedOrder = await orderController.completeOrder(orderId);
    return res.status(200).json({ message: 'Order completed successfully', order: completedOrder });
  } catch (error) {
    console.error('Error completing order:', error);
    return res.status(500).json({ error: 'Failed to complete order' });
  }
});

module.exports = router;

