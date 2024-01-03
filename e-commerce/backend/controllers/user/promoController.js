const { PrismaClient } = require('../../prisma/generated/client');
const prisma = new PrismaClient();

const getPromotions = async (req, res) => {
  try {
    const promotions = await prisma.promotion.findMany();
    res.json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const validatePromoCodeForUser = async (promoCode) => {
  try {
    const validPromo = await prisma.promotion.findFirst({
      where: {
        promo_code: promoCode,
        remaining_usage: { gt: 0 },
        product_id: null,
      },
    });

    return Boolean(validPromo);
  } catch (error) {
    console.error('Error validating promo code for user:', error);
    throw new Error('Internal Server Error');
  }
};

const calculatePromoAmountForUser = async (promoCode, totalAmount, cartItems, categoryId) => {
  try {
    const promo = await prisma.promotion.findFirst({
      where: {
        promo_code: promoCode,
        remaining_usage: { gt: 0 },
      },
    });

    if (!promo) {
      return 0;
    }

    if (promo.type === 'percentage') {
      return (promo.amount / 100) * totalAmount;
    } else if (promo.type === 'fixed') {
      return promo.amount;
    } else {
      const matchingCategoryItems = cartItems.filter(async (cartItem) => {
        const categoryId = cartItem.product.category_id;

        if (!categoryId) {
          // Handle the case where the product has no category ID
          return false;
        }

        try {
          // Fetch category data using categoryId
          const category = await prisma.category.findUnique({
            where: {
              category_id: categoryId,
            },
          });

          if (!category) {
            return false;
          }

          const categoryLowerCase = category.category_name.toLowerCase();
          const promoTypeLowerCase = promo.type.toLowerCase();

          console.log('Product:', cartItem.product);
          console.log('Product Category:', categoryLowerCase);
          console.log('Promo Type:', promoTypeLowerCase);

          return categoryLowerCase === promoTypeLowerCase;
        } catch (error) {
          console.error('Error fetching category data:', error);
          return false;
        }
      });


      const matchingCategoryItemTotalPrice = matchingCategoryItems.reduce((total, cartItem) => {
        return total + cartItem.product.price * cartItem.quantity;
      }, 0);


      return (promo.amount / 100) * matchingCategoryItemTotalPrice;
    }
  } catch (error) {
    console.error('Error calculating promo amount for user:', error);
    throw new Error('Internal Server Error');
  }
};


const updatePromotionRemainingUsage = async (promoId) => {
  try {
    await prisma.promotion.update({
      where: {
        promo_id: promoId,
      },
      data: {
        remaining_usage: {
          decrement: 1,
        },
      },
    });
  } catch (error) {
    console.error('Error updating promotion remaining usage:', error);
    throw new Error('Internal Server Error');
  }
};

module.exports = {
  getPromotions,
  validatePromoCodeForUser,
  calculatePromoAmountForUser,
  updatePromotionRemainingUsage,
};
