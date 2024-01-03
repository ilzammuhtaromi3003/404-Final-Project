import React from "react";
import { Box, Text, Button } from "@chakra-ui/react";

const PromoCard = ({ promo, onSelect }) => {
  const handleSelect = () => {
    onSelect(promo);
  };

  return (
    <Box
      border="1px solid #ccc"
      p={4}
      borderRadius="md"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Promo Code: {promo.promo_code || "N/A"}
        </Text>
        <Text>Type: {promo.type}</Text>
      </Box>

      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Amount: {promo.amount}
        </Text>
        <Button colorScheme="teal" size="sm" onClick={handleSelect}>
          Select
        </Button>
      </Box>
    </Box>
  );
};

export default PromoCard;
