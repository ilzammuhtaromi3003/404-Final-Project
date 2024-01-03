const axios = require('axios');
const { PrismaClient } = require('../../prisma/generated/client');
const prisma = new PrismaClient();
const shoppingCartController = require('./shoppingCartController');

const calculateTotalWeight = (cartItems) => {
    return cartItems.reduce((totalWeight, cartItem) => {
        const itemWeight = cartItem.product.weight || 0;
        return totalWeight + cartItem.quantity * itemWeight;
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

const calculateShippingFee = async (originCityId, destinationCityId, weight, courier) => {
    const apiKey = 'efe5b3d7c7fa07f1238c1ad3025b18f2';

    try {
        const response = await axios.post(
            'https://api.rajaongkir.com/starter/cost',
            {
                origin: originCityId,
                destination: destinationCityId,
                weight: weight,
                courier: courier,
            },
            {
                headers: {
                    key: apiKey,
                },
            }
        );

        // Debugging
        console.log('API response:', response.data);

        if (
            response.data.rajaongkir &&
            response.data.rajaongkir.results &&
            response.data.rajaongkir.results.length > 0 &&
            response.data.rajaongkir.results[0].costs &&
            response.data.rajaongkir.results[0].costs.length > 0
        ) {
            const shippingCost = response.data.rajaongkir.results[0].costs[0].cost[0].value;
            return shippingCost;
        } else if (response.data.rajaongkir.status.code === 200) {
            // Log the response to better understand the structure
            console.log('Response structure:', response.data.rajaongkir);

            // Handle the case where shipping costs are not available
            console.error('No shipping costs available.');
            throw new Error('No shipping costs available.');
        } else {
            console.error('Invalid API response structure:', response.data);
            throw new Error('Invalid API response structure');
        }
    } catch (error) {
        console.error('Error calculating shipping fee:', error.response ? error.response.data : error.message);
        throw new Error('Failed to calculate shipping fee');
    }
};

const getShippingFees = async (userId) => {
    try {
        const userIdInt = parseInt(userId, 10);
        const cartItems = await shoppingCartController.getShoppingCart(userIdInt);

        if (cartItems.length === 0) {
            throw new Error('Shopping cart is empty');
        }

        const warehouseGroups = groupItemsByWarehouse(cartItems);

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

        if (!user || !user.user_addresses || user.user_addresses.length === 0) {
            console.error('User or user address not found');
            throw new Error('User or user address not found');
        }

        const destinationCityId = user.user_addresses[0].city_id;

        let totalShippingFee = 0;

        // Iterate over each warehouse group
        for (const warehouseGroup of warehouseGroups) {
            // Check if the warehouse group is not empty
            if (warehouseGroup.length > 0) {
                const warehouseCityId = warehouseGroup[0].product.city_id;

                // Calculate total weight for the warehouse group
                const totalWeightForGroup = calculateTotalWeight(warehouseGroup);

                // Calculate shipping fee for the warehouse group
                const shippingFeeForGroup = await calculateShippingFee(
                    warehouseGroup[0].product.warehouse_id,
                    destinationCityId,
                    totalWeightForGroup,
                    'pos'
                );

                totalShippingFee += shippingFeeForGroup;
            }
        }

        return totalShippingFee;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to retrieve total shipping fee');
    }
};

module.exports = {
    calculateShippingFee,
    getShippingFees,
};
