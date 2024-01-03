import React, { useState, useEffect } from "react";
import { Box, Text, Button, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchUserData, fetchCategoryById, createOrder } from "../../api/api";

const RightSection = ({ shippingFee, selectedPromo, onPromoSelect, items }) => {
  const [userId, setUserId] = useState(null);
  const [userAffiliate, setUserAffiliate] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [discountAmount, setDiscountAmount] = useState("0.00");
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const response = await fetchUserData(token);
          setUserId(response.user_id);
          setUserAffiliate(response.affiliate_usage ? response : null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      try {
        const calculatedDiscount = await calculateDiscountAmount();
        setDiscountAmount(calculatedDiscount);
      } catch (error) {
        console.error("Error calculating discount:", error);
        setDiscountAmount("0.00"); // Handle the error by setting a default value
      }
    };

    fetchData();
  }, [token, items, selectedPromo, userAffiliate]);

  const calculateTotalItemPrice = () => {
    return items.reduce((total, item) => {
      const itemPrice = item?.product?.price || 0;
      return total + item.quantity * itemPrice;
    }, 0);
  };

  const calculateDiscountAmount = async () => {
    try {
      let calculatedDiscountAmount = 0;
      // Calculate promo discount

      if (selectedPromo) {
        const totalItemPrice = calculateTotalItemPrice();

        const promoAmount = selectedPromo.amount;

        if (selectedPromo.type === "percentage") {
          calculatedDiscountAmount += (promoAmount / 100) * totalItemPrice;
        } else if (selectedPromo.type === "fixed") {
          calculatedDiscountAmount += promoAmount;
        } else {
          const matchingCategoryItems = await Promise.all(
            items.map(async (item) => {
              const categoryId = item.product?.category_id;

              if (!categoryId) {
                return false;
              }

              try {
                const category = await fetchCategoryById(categoryId);

                if (!category) {
                  return false;
                }

                const categoryLowerCase = category.category_name.toLowerCase();

                const promoTypeLowerCase = selectedPromo.type.toLowerCase();

                return categoryLowerCase === promoTypeLowerCase;
              } catch (error) {
                console.error("Error fetching category data:", error);

                return false;
              }
            })
          );

          // Filter out items that are not in the matching category

          const matchingCategoryItemsWithPrices = items.filter(
            (item, index) => matchingCategoryItems[index]
          );

          const matchingCategoryItemTotalPrice =
            matchingCategoryItemsWithPrices.reduce(
              (total, item) => {
                if (item.product && item.product.price) {
                  console.log("Item Price:", item.product.price);

                  console.log("Item Quantity:", item.quantity);

                  console.log("Subtotal:", item.quantity * item.product.price);

                  return total + item.quantity * item.product.price;
                }

                return total;
              },

              0
            );

          calculatedDiscountAmount +=
            (promoAmount / 100) * matchingCategoryItemTotalPrice;
        }
      }

      // Calculate affiliate discount

      if (userAffiliate && userAffiliate.affiliate_usage) {
        calculatedDiscountAmount += 0.5 * calculateTotalItemPrice();
      }

      return Number(calculatedDiscountAmount).toFixed(2);
    } catch (error) {
      console.error("Error calculating discount:", error);

      return "0.00"; // Handle the error by returning a default value
    }
  };

  const handlePlaceOrder = async () => {
    try {
      if (!userId) {
        console.error("User ID is not available.");
        return;
      }

      const promoCode = selectedPromo?.promo_code || null;
      console.log("Selected Promo Code:", promoCode);

      const orderResponse = await createOrder(userId, promoCode, "pos", token);
      if (orderResponse && orderResponse.orderId) {
        console.log(
          "Order placed successfully! Order ID:",
          orderResponse.orderId
        );
      } else {
        console.error("Unexpected response format:", orderResponse);
      }
    } catch (error) {
      navigate("/Orders");
      console.error("Error placing order:", error);
    }
  };

  const totalItemPrice = calculateTotalItemPrice();

  return (
    <Box w={"20vw"}>
      <VStack align={"end"}>
        <Box mt={4}>
          <Button onClick={onPromoSelect}>Select Promo</Button>
        </Box>
        <Box mb={2}>
          <Text>Shipping Fee: Rp{shippingFee.toFixed(2)}</Text>
        </Box>
        <Box mb={2}>
          <Text>
            Promo: {selectedPromo ? selectedPromo.promo_code : "None selected"}
          </Text>
        </Box>
        <Box mb={2}>
          <Text>Total Item Price: Rp{totalItemPrice.toFixed(2)}</Text>
        </Box>
        <Box mb={2}>
          <Text>Discount: Rp{discountAmount}</Text>
        </Box>
        <Box mb={2}>
          {userAffiliate && userAffiliate.affiliate_usage && (
            <Text>
              Affiliate Discount: Rp{(0.5 * totalItemPrice).toFixed(2)}
            </Text>
          )}
        </Box>
        <Box mb={2}>
          <Text>
            Total Price: Rp
            {(
              totalItemPrice -
              parseFloat(discountAmount) +
              shippingFee
            ).toFixed(2)}
          </Text>
        </Box>
        <Box mt={2}>
          <Button onClick={handlePlaceOrder}>Place Order</Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default RightSection;
