const { PrismaClient } = require('../../prisma/generated/client');
const prisma = new PrismaClient();

const affiliateController = {
  
  //Create affiliate
  createAffiliate: async (req, res) => {
    try {
      const affiliate = await prisma.affiliateDiscount.create({
        data: req.body,
      });
      console.log('New data:', req.body);
      res.status(201).json(affiliate);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },

  //Get all affiliates
  getAllAffiliate: async (req, res) => {
    try {
      const affiliate = await prisma.affiliateDiscount.findMany();
      res.json(affiliate);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },

  // Get affiliate by id
  getAffiliateById: async (req, res) => {
    const { id } = req.params;
    try {
      const affiliate = await prisma.affiliateDiscount.findUnique({
        where: { affiliate_discount_id: parseInt(id) },
      });

      if (!affiliate) {
        return res.status(404).json({ message: 'Discount not found.' });
      }

      res.status(201).json(affiliate);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },

  //Update affiliate
  updateAffiliate: async (req, res) => {
    const { id } = req.params;
    const { user_id, discount_amount } = req.body;

    try {
      console.log('Updated:', req.body);
      const affiliate = await prisma.affiliateDiscount.update({
        where: { affiliate_discount_id: parseInt(id) },
        data: {
          user_id,
          discount_amount,
        },
      });
      res.status(200).json(affiliate);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },

  //Delete affiliate
  deleteAffiliate: async (req, res) => {
    const { id } = req.params;
    try {
      const affiliate = await prisma.affiliateDiscount.delete({
        where: { affiliate_discount_id: parseInt(id) },
      });
      res.status(204).json({ message: 'Successfully deleted' });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },
};

module.exports = affiliateController;