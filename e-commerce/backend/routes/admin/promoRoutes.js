const express = require("express");
const router = express.Router();

const promoController = require("../../controllers/admin/promoController");
const { authMiddleware } = require("../../middleware/authMiddleWare");

router.use(authMiddleware);

router.get("/", promoController.getAllPromo);
router.get("/:id", promoController.getPromoById);
router.post("/create", promoController.createPromo);
router.put("/:id", promoController.updatePromo);
router.delete("/:id", promoController.deletePromo);

module.exports = router;
