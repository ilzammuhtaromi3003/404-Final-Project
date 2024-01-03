import React from "react";
import { ChakraProvider, Box, Text, HStack } from "@chakra-ui/react";
import OrderList from "../Components/OrderComponent/OrderList";
import { FaBox } from "react-icons/fa";

const OrderPage = () => {
  return (
    <ChakraProvider>
      <Box
        p={4}
        borderBottom="1px"
        borderColor="gray.200"
        mb={4}
        align="center"
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
          <HStack justify="center">
            <FaBox size={"30px"} />
            <Text fontSize="4xl" fontWeight="bold" ml={2}>
              Order
            </Text>
          </HStack>
        </Box>
      </Box>

      <OrderList />
    </ChakraProvider>
  );
};

export default OrderPage;
