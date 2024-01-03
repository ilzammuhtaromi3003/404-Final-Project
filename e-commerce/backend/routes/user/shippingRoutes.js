const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../../middleware/authMiddleWare');
const shippingController = require('../../controllers/user/shippingController');

router.get('/shipping-fees/:userId', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const shippingFee = await shippingController.getShippingFees(userId);
        res.json({ shippingFee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve shipping fees' });
    }
});

module.exports = router;
