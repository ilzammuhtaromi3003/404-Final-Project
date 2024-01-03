const { PrismaClient } = require('../../prisma/generated/client');
const prisma = new PrismaClient();
const shoppingCartController = require('./shoppingCartController');
const shippingController = require('./shippingController');
const promoController = require('./promoController');

const calculateTotalPrice = (orderItems) => {
    return orderItems.reduce((total, item) => {
        const itemPrice = item.product.price || 0;
        return total + item.quantity * itemPrice;
    }, 0);
};

const groupItemsByWarehouse = (cartItems) => {
    const warehouseGroups = {};
    cartItems.forEach((cartItem) => {
        const warehouseId = cartItem.product.warehouse_id;
        if (!warehouseGroups[warehouseId]) {
            warehouseGroups[warehouseId] = [];
        }
        warehouseGroups[warehouseId].push(cartItem);
    });

    return Object.values(warehouseGroups);
};

const calculateTotalWeight = (cartItems) => {
    return cartItems.reduce((totalWeight, cartItem) => {
        const itemWeight = cartItem.product.weight || 0;
        return totalWeight + cartItem.quantity * itemWeight;
    }, 0);
};

const groupItemsByCategory = (cartItems) => {
    const categoryGroups = {};
    cartItems.forEach((cartItem) => {
        const categoryId = cartItem.product.category_id;
        if (!categoryGroups[categoryId]) {
            categoryGroups[categoryId] = [];
        }
        categoryGroups[categoryId].push(cartItem);
    });

    return Object.values(categoryGroups);
};

const updateProductStock = async (productId, quantity) => {
    try {
        const product = await prisma.product.findUnique({
            where: {
                product_id: productId,
            },
        });

        if (!product) {
            throw new Error('Product not found');
        }

        const newStockQuantity = product.stock - quantity;

        if (newStockQuantity < 0) {
            throw new Error('Insufficient stock');
        }

        await prisma.product.update({
            where: {
                product_id: productId,
            },
            data: {
                stock: newStockQuantity,
            },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Failed to update product stock');
    }
};


const createOrder = async (userId, promoCode, courier) => {
    try {
        const userIdInt = parseInt(userId, 10);
        const user = await prisma.user.findUnique({
            where: {
                user_id: userIdInt,
            },
            include: {
                user_addresses: {
                    select: {
                        city_id: true,
                    },
                },
            },
        });

        if (!user) {
            console.error('User not found');
            throw new Error('User not found');
        }

        const userAddresses = user.user_addresses;

        if (!userAddresses || userAddresses.length === 0 || !userAddresses[0].city_id) {
            console.error('User address or city ID not found');
            throw new Error('User address or city ID not found');
        }

        const destinationCityId = userAddresses[0].city_id;

        const cartItems = await shoppingCartController.getShoppingCart(userIdInt);

        if (cartItems.length === 0) {
            throw new Error('Shopping cart is empty');
        }

        const warehouseGroups = groupItemsByWarehouse(cartItems);
        let totalPrice = 0;
        let totalShippingFee = 0;

        for (const warehouseGroup of warehouseGroups) {
            if (warehouseGroup.length > 0) {
                const totalWeight = calculateTotalWeight(warehouseGroup);
                const warehouseShippingFee = await shippingController.calculateShippingFee(
                    warehouseGroup[0].product.warehouse_id,
                    destinationCityId,
                    totalWeight,
                    courier
                );
                totalShippingFee += warehouseShippingFee;
                const warehouseTotalPrice = calculateTotalPrice(warehouseGroup);
                totalPrice += warehouseTotalPrice;

                // Update product stock for each item in the warehouse group
                for (const cartItem of warehouseGroup) {
                    const productId = cartItem.product.product_id;
                    const quantity = cartItem.quantity;

                    // Update the stock for each product in the order
                    await updateProductStock(productId, quantity);
                }
            }
        }



        let promoDiscountAmount = 0;
        let affiliateDiscountAmount = 0;

        if (promoCode) {
            const isValidPromo = await promoController.validatePromoCodeForUser(promoCode);

            console.log('Promo Code:', promoCode);
            console.log('isValidPromo:', isValidPromo);

            if (isValidPromo) {
                const categoryGroups = groupItemsByCategory(cartItems);

                for (const categoryGroup of categoryGroups) {
                    if (categoryGroup.length > 0) {
                        const totalCategoryPrice = calculateTotalPrice(categoryGroup);
                        const promoAmount = await promoController.calculatePromoAmountForUser(
                            promoCode,
                            totalCategoryPrice,
                            cartItems
                        );
                        promoDiscountAmount += promoAmount;
                    }
                }
            } else {
                throw new Error('Invalid promo code');
            }
        }

        // Check for affiliate discount
        if (user && user.affiliate_usage) {
            // Calculate affiliate discount (50% off total item price)
            affiliateDiscountAmount = 0.5 * totalPrice;
            // Update user affiliate_usage to false
            await prisma.user.update({
                where: {
                    user_id: userIdInt,
                },
                data: {
                    affiliate_usage: false,
                },
            });
        }

        const totalPriceWithDiscounts = totalPrice - promoDiscountAmount - affiliateDiscountAmount;
        const totalPriceWithShipping = totalPriceWithDiscounts + totalShippingFee;

        const order = await prisma.orders.create({
            data: {
                user: {
                    connect: {
                        user_id: userIdInt,
                    },
                },
                order_date: new Date(),
                delivery_time: new Date(),
                deliver_fee: totalShippingFee,
                total_price: parseFloat(totalPriceWithShipping.toFixed(2)),
                payment_status: 'Pending',
                order_status: 'Pending',
                admin: {
                    connect: {
                        admin_id: 1,
                    },
                },
                promo_code: promoCode,
                promo_discount_amount: promoDiscountAmount,
                affiliate_discount_amount: affiliateDiscountAmount,
                order_items: {
                    create: warehouseGroups.flatMap((group) =>
                        group.map((cartItem) => ({
                            product: {
                                connect: {
                                    product_id: cartItem.product.product_id,
                                },
                            },
                            quantity: cartItem.quantity,
                            price: cartItem.product.price,
                        }))
                    ),
                },
            },
        });

        await prisma.shoppingCartItem.deleteMany({
            where: { cart_id: cartItems[0].cart_id },
        });

        await prisma.shoppingCart.delete({
            where: { cart_id: cartItems[0].cart_id },
        });

        return order;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to create order');
    }
};



const getOrdersForUser = async (userId) => {
    try {
        const userIdInt = parseInt(userId, 10);

        const orders = await prisma.orders.findMany({
            where: {
                user_id: userIdInt,
            },
            include: {
                order_items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return orders;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to retrieve orders');
    }
};

const getOrderById = async (orderId) => {
    try {
        const orderIdInt = parseInt(orderId, 10);

        const order = await prisma.orders.findUnique({
            where: {
                order_id: orderIdInt,
            },
            include: {
                order_items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            console.error('Order not found');
            throw new Error('Order not found');
        }

        return order;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to retrieve order');
    }
};

const completeOrder = async (orderId) => {
    try {
        const orderIdInt = parseInt(orderId, 10);

        const updatedOrder = await prisma.orders.update({
            where: {
                order_id: orderIdInt,
            },
            data: {
                order_status: 'Finished',
            },
        });

        if (!updatedOrder) {
            console.error('Order not found');
            throw new Error('Order not found');
        }

        return updatedOrder;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to complete order');
    }
};


module.exports = {
    createOrder,
    getOrdersForUser,
    calculateTotalWeight,
    calculateTotalPrice,
    groupItemsByWarehouse,
    getOrderById,
    completeOrder
};