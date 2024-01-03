const { PrismaClient } = require('../../prisma/generated/client');
const prisma = new PrismaClient();

async function addToCart(userId, productId, quantity) {
  try {
    // Check if there's a shopping cart
    let userCart = await prisma.shoppingCart.findFirst({
      where: {
        user_id: userId,
      },
    });

    // If shopping cart not found, generate one
    if (!userCart) {
      userCart = await prisma.shoppingCart.create({
        data: {
          user_id: userId,
        },
      });
    }

    // Check if the item is already in the cart
    const existingCartItem = await prisma.shoppingCartItem.findFirst({
      where: {
        cart_id: userCart.cart_id,
        product_id: parseInt(productId, 10),
      },
      include: { product: true }, // Include product information in the query
    });

    // Retrieve product information
    const product = await prisma.product.findUnique({
      where: { product_id: parseInt(productId, 10) },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Validate the quantity against the available stock
    const updatedQuantity = existingCartItem
      ? existingCartItem.quantity + quantity
      : quantity;

    if (updatedQuantity > product.stock) {
      throw new Error('Cannot add more items than available stock');
    }

    if (existingCartItem) {
      // If item exists, update the quantity
      const updatedCartItem = await prisma.shoppingCartItem.update({
        where: { cart_item_id: existingCartItem.cart_item_id },
        data: { quantity: updatedQuantity },
        include: { product: true },
      });

      return updatedCartItem;
    } else {
      // If item doesn't exist, add it to the cart
      const newCartItem = await prisma.shoppingCartItem.create({
        data: {
          cart: {
            connect: {
              cart_id: userCart.cart_id,
            },
          },
          product: {
            connect: {
              product_id: parseInt(productId, 10),
            },
          },
          quantity: updatedQuantity,
        },
        include: { product: true },
      });

      return newCartItem;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
}


// Function to retrieve the shopping cart for a user
async function getShoppingCart(userId) {
  try {
    const userCart = await prisma.shoppingCart.findFirst({
      where: {
        user_id: parseInt(userId, 10),
      },
      include: { cart_items: { include: { product: true } } },
    });

    if (userCart) {
      return userCart.cart_items;
    } else {
      return [];
    }
  } catch (error) {
    console.error(`Error in getShoppingCart: ${error.message}`);
    throw new Error('Failed to retrieve shopping cart');
  }
}

// Function to remove a product from the shopping cart
async function removeFromCart(cartItemId, userId, productId) {
  try {
    const userCart = await prisma.shoppingCart.findFirst({
      where: {
        user_id: parseInt(userId, 10),
        cart_items: {
          some: {
            cart_item_id: parseInt(cartItemId, 10),
          },
        },
      },
    });

    if (!userCart) {
      throw new Error('User cart not found');
    }

    const deletedCartItem = await prisma.shoppingCartItem.delete({
      where: { cart_item_id: parseInt(cartItemId, 10) },
      include: { product: true },
    });

    const remainingCartItems = await prisma.shoppingCartItem.count({
      where: { cart_id: userCart.cart_id },
    });

    if (remainingCartItems === 0) {
      await prisma.shoppingCart.delete({
        where: { cart_id: userCart.cart_id },
      });
    }

    return { message: 'Product removed from the shopping cart', deletedCartItem };
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
}

async function updateCartItemQuantity(cartItemId, newQuantity, userId) {
  try {
    const userCart = await prisma.shoppingCart.findFirst({
      where: {
        user_id: parseInt(userId, 10),
        cart_items: {
          some: {
            cart_item_id: parseInt(cartItemId, 10),
          },
        },
      },
    });

    if (!userCart) {
      throw new Error('User cart not found');
    }

    const existingCartItem = await prisma.shoppingCartItem.findUnique({
      where: { cart_item_id: parseInt(cartItemId, 10) },
      include: { product: true },
    });

    if (!existingCartItem) {
      throw new Error('Cart item not found');
    }

    const product = existingCartItem.product;

    // Validate the new quantity against the available stock
    if (newQuantity > product.stock) {
      throw new Error('Cannot update quantity to exceed available stock');
    }

    const updatedCartItem = await prisma.shoppingCartItem.update({
      where: { cart_item_id: parseInt(cartItemId, 10) },
      data: { quantity: newQuantity },
      include: { product: true },
    });

    if (newQuantity === 0) {
      await prisma.shoppingCartItem.delete({
        where: { cart_item_id: parseInt(cartItemId, 10) },
      });

      const remainingCartItems = await prisma.shoppingCartItem.count({
        where: { cart_id: userCart.cart_id },
      });

      if (remainingCartItems === 0) {
        await prisma.shoppingCart.delete({
          where: { cart_id: userCart.cart_id },
        });
      }

      return { message: 'Product removed from the shopping cart', deletedCartItem: updatedCartItem };
    }

    return { message: 'Quantity updated for the product in the shopping cart', updatedCartItem };
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
}


module.exports = {
  addToCart,
  getShoppingCart,
  removeFromCart,
  updateCartItemQuantity,
};
