const express = require('express');
const router = express.Router();
const userAuthenticationController = require('../../controllers/user/userAuthenticationController');
const validationMiddleware = require('../../middleware/validationMiddleWare');
const { getPromotions, updatePromotionRemainingUsage } = require('../../controllers/user/promoController');
const { authenticateToken } = require('../../middleware/authMiddleWare');

const {
  registerUser,
  loginUser,
  logoutUser,
  updateAddress,
  viewProfile,
} = userAuthenticationController;

const {
  registrationValidationRules,
  loginValidationRules,
  validate,
} = validationMiddleware;

// Endpoint for user registration
router.post('/register', validate, registerUser);

// Endpoint for user login
router.post('/login', validate, loginUser);

// Endpoint for user logout
router.post('/logout', authenticateToken, logoutUser);

// Update address after login
router.put('/update-address', authenticateToken, updateAddress);

// View profile
router.get('/view-profile', authenticateToken, viewProfile);

// Get all promotions
router.get('/promotions', authenticateToken, getPromotions);

// Update remaining usage for a promotion by ID
router.put('/promotions/:promoId/update-remaining-usage', authenticateToken, async (req, res) => {
  const promoId = parseInt(req.params.promoId, 10);

  try {
    await updatePromotionRemainingUsage(promoId);
    res.json({ message: 'Promotion remaining usage updated successfully' });
  } catch (error) {
    console.error('Error updating promotion remaining usage:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
