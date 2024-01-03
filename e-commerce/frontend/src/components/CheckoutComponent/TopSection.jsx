import { Box, HStack, Text } from "@chakra-ui/react";
import { LuMapPin } from "react-icons/lu";

const TopSection = ({ userAddress }) => {
  return (
    <Box ml={{ base: 2, md: 4 }} mt={{ base: 2, md: 4 }}>
      <Text as={"b"} fontSize="xl">
        Checkout
      </Text>
      <HStack>
        <LuMapPin />
        <Text>
          Address {userAddress.province_name},{userAddress.city_name}
        </Text>
      </HStack>
    </Box>
  );
};

export default TopSection;
