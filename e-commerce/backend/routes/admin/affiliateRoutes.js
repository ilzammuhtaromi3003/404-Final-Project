const express = require('express');
const router = express.Router();
const affiliateController = require('../../controllers/admin/affiliateController');

router.get('/', affiliateController.getAllAffiliate);
router.get('/:id', affiliateController.getAffiliateById);
router.post('/create', affiliateController.createAffiliate);
router.put('/:id', affiliateController.updateAffiliate);
router.delete('/:id', affiliateController.deleteAffiliate);

module.exports = router;