import React, { useState, useEffect } from "react";
import { Flex, VStack, Text, Button, Box } from "@chakra-ui/react";
import ItemList from "../Components/CartProduct/CartItemList";
import * as api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userData, setUserData] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const user = await api.fetchUserData(token);
          setUserData(user);

          if (user && user.user_id) {
            const cartData = await api.fetchCart(user.user_id);
            setCartItems(cartData);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [token]);

  const handleIncrement = (item) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((cartItem) =>
        cartItem.cart_item_id === item.cart_item_id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );

    // Call the API to update the cart item quantity
    api.updateCartItemQuantity(
      item.cart_item_id,
      item.quantity + 1,
      userData.user_id
    );
  };

  const handleDecrement = (item) => {
    // Ensure the quantity doesn't go below 1
    const updatedQuantity = Math.max(item.quantity - 1, 1);

    setCartItems((prevCartItems) =>
      prevCartItems.map((cartItem) =>
        cartItem.cart_item_id === item.cart_item_id
          ? { ...cartItem, quantity: updatedQuantity }
          : cartItem
      )
    );

    // Call the API to update the cart item quantity
    api.updateCartItemQuantity(
      item.cart_item_id,
      updatedQuantity,
      userData.user_id
    );
  };

  // Fetch the latest cart data after an increment or decrement action
  useEffect(() => {
    const fetchLatestCartData = async () => {
      if (userData && userData.user_id) {
        const latestCartData = await api.fetchCart(userData.user_id);
        setCartItems(latestCartData);
      }
    };

    fetchLatestCartData();
  }, [userData]);

  const handleRemove = async (item) => {
    try {
      // Call the API to remove the item from the cart
      await api.removeFromCart(
        item.cart_item_id,
        userData.user_id,
        item.product_id
      );

      const latestCartData = await api.fetchCart(userData.user_id);
      setCartItems(latestCartData);
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      const user = await api.fetchUserData(token);
      const userAddress = user.user_addresses[0] || {};
      navigate("/checkout", { state: { items: cartItems, userAddress } });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <Flex
      direction="column"
      // justify="center"
      align="center"
      h="100vh"
      bg={"gray.200"}
    >
      <Box
        bg="teal.300"
        m={4}
        p={2}
        w="50%"
        align="center"
        rounded="full"
        boxShadow="lg"
      >
        <Text fontSize="4xl" fontWeight="bold" mb={4}>
          Shopping Cart
        </Text>
      </Box>
      <Flex
        width="90%"
        // justify="space-between"
        bg={"white"}
        rounded={"lg"}
        boxShadow={"lg"}
      >
        <Box
          width="100%"
          overflowY="auto"
          maxHeight="70vw"
          css={{
            overflow: "auto",
            paddingRight: "10px",
            boxSizing: "content-box",
            "&::-webkit-scrollbar": {
              width: "0.5em",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "transparent",
            },
          }}
        >
          <VStack spacing={4} w={"100vh"} p={2}>
            <ItemList
              cartItems={cartItems}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onRemove={handleRemove}
            />
          </VStack>
        </Box>
        <VStack
          spacing={4}
          align="flex-end"
          justifyContent="center"
          width="30%"
          p={4}
        >
          <Text fontSize="lg" fontWeight="bold">
            Total Price: Rp
            {cartItems
              .reduce(
                (total, item) =>
                  total + parseFloat(item.product.price) * item.quantity,
                0
              )
              .toFixed(2)}
          </Text>
          <Button colorScheme="teal" size="lg" onClick={handleCheckout}>
            Checkout
          </Button>
        </VStack>
      </Flex>
    </Flex>
  );
};

export default ShoppingCartPage;
