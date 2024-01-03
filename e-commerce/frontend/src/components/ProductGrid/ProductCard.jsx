import React from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  VStack,
  Square,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProductCard = ({ product }) => {
  const { product_id, name, price, image } = product;
  // console.log(image);
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleDetailsClick = () => {
    console.log("Token:", token);

    if (token) {
      navigate(`/product/${product_id}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <Box
      p={2}
      borderWidth="1px"
      borderRadius="md"
      bg="white"
      onClick={handleDetailsClick}
      cursor="pointer"
      boxShadow="lg"
    >
      <VStack>
        <Box>
          <Image
            src={`http://localhost:3000/images/${image}`}
            alt={name}
            objectFit="cover"
            boxSize="220px"
          />
        </Box>
        <Box w="full">
          <Text fontSize={["sm", "md", "lg", "xl"]} fontWeight="bold">
            {name}
          </Text>

          <Text fontSize="sm" color="black" align="end">
            Rp{price}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default ProductCard;
