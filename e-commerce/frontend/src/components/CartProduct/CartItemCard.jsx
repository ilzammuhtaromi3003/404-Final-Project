import React from "react";
import {
  VStack,
  Text,
  Image,
  HStack,
  Button,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";

const ItemCard = React.memo(
  ({
    itemName,
    price,
    image,
    quantity,
    onIncrement,
    onDecrement,
    onRemove,
    isIncrementDisabled,
  }) => {
    const totalItemPrice = (parseFloat(price) * quantity).toFixed(2);

    return (
      <Box
        borderBottom="1px solid #ccc"
        paddingY={4}
        w={{ base: "100%", md: "55vw" }}
      >
        <HStack
          width="100%"
          justify="space-between"
          direction={{ base: "column", md: "row" }}
        >
          <HStack align="start" ml={{ base: 0, md: 20 }}>
            <Image
              src={`http://localhost:3000/images/${image}`}
              alt={itemName}
              boxSize={{ base: "100%", md: "100px" }}
              objectFit="cover"
            />
            <Text fontSize="lg" fontWeight="bold" ml={{ base: 2, md: 30 }}>
              {itemName}
            </Text>
          </HStack>

          <VStack align="flex-end" ml={{ base: 0, md: 4 }}>
            {" "}
            {/* Adjust margin at different breakpoints */}
            <Text fontSize="lg" fontWeight="bold">
              Rp{totalItemPrice}
            </Text>
            <HStack>
              <IconButton
                bg={"red.400"}
                icon={<FaTrash />}
                aria-label="Remove Item"
                onClick={onRemove}
              />
              <HStack>
                <Button onClick={onDecrement} isDisabled={quantity <= 1}>
                  -
                </Button>
                <Text fontSize="lg" fontWeight="bold">
                  {quantity}
                </Text>
                <Button onClick={onIncrement} isDisabled={isIncrementDisabled}>
                  +
                </Button>
              </HStack>
            </HStack>
          </VStack>
        </HStack>
      </Box>
    );
  }
);

export default ItemCard;
