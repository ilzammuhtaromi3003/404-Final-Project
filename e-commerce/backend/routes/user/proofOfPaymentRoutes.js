const express = require('express');
const router = express.Router();
const { uploadProofOfPayment } = require('../../controllers/user/uploadProofOfPaymentController');  
const { authenticateToken } = require('../../middleware/authMiddleWare'); 

// Endpoint for uploading proof of payment
router.post('/upload-proof-of-payment/:orderId', authenticateToken, uploadProofOfPayment);

module.exports = router;
