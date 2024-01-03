import React from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";

const CheckoutProductCard = ({ product, quantity }) => {
  const total = (parseFloat(product.price) * quantity).toFixed(2);

  return (
    <Box mb={4} bg={"gray.100"} rounded={"lg"} p={2}>
      <HStack spacing={3} justify={"space-between"}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            {product.name}
          </Text>
          <Text fontSize="xs">Price: Rp{product.price} each</Text>
        </Box>
        <VStack>
          <Text fontSize="sm">Quantity: {quantity}</Text>
          <Text fontSize="xs">
            Total: <Text as={"b"}>Rp{total}</Text>
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default CheckoutProductCard;
