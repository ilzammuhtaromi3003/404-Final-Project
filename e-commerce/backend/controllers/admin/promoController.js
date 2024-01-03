const { PrismaClient } = require("../../prisma/generated/client");
const prisma = new PrismaClient();

const promoController = {
  //Create promo
  createPromo: async (req, res) => {
    try {
      const adminId = req.admin.admin_id
      const { type, amount, maximum_usage, promo_code } = req.body;
      const remaining_usage = maximum_usage;
      const promotion = await prisma.promotion.create({
        data: {
          type,
          amount,
          maximum_usage,
          promo_code,
          remaining_usage,
          admin_id: adminId,
        },
      });
      console.log("New data :", req.body);
      res.status(201).json(promotion);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },

  //Get all promo
  getAllPromo: async (req, res) => {
    try {
      const promotion = await prisma.promotion.findMany();
      res.json(promotion);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },

  // Get promo by id
  getPromoById: async (req, res) => {
    const { id } = req.params;
    try {
      const promotion = await prisma.promotion.findUnique({
        where: { promo_id: parseInt(id) },
      });

      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found." });
      }

      res.status(200).json(promotion);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },

  //Update promo
  updatePromo: async (req, res) => {
    const adminId = req.admin.admin_id
    const { id } = req.params;
    const { type, maximum_usage, amount, promo_code } = req.body;

    try {
      console.log("Updated:", req.body);
      const promotion = await prisma.promotion.update({
        where: { promo_id: parseInt(id) },
        data: {
          type,
          maximum_usage,
          amount,
          promo_code,
          admin_id: adminId,
        },
      });
      res.status(200).json(promotion);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },

  //Delete promo
  deletePromo: async (req, res) => {
    const { id } = req.params;
    try {
      const promo_id = parseInt(id);
      const promotion = await prisma.promotion.delete({
        where: { promo_id: promo_id },
      });

      if (!promotion) {
        return res.status(404).json({ error: "Promotion not found" });
      }

      res.status(204).json({ message: "Successfully deleted" });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },
};

module.exports = promoController;
