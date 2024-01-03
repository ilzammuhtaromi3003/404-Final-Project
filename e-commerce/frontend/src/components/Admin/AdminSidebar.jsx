import { Box, VStack, Text } from "@chakra-ui/react";
import { TbCategoryFilled } from "react-icons/tb";
import { FaBox, FaWarehouse, FaUsers } from "react-icons/fa6";
import { FaClipboardList } from "react-icons/fa";
import { BiSolidDiscount } from "react-icons/bi";
import { IoLogOut } from "react-icons/io5";

import { Link, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("Token");
    navigate("/admin/login");
  };

  return (
    <Box w="250px" h="100%" bg="teal.300" color="black" p="4">
      <VStack align="center" spacing="6">
        <Text fontSize="xl" as={"b"}>
          Admin
        </Text>

        <Link to={`/admin/product`}>
          <Box
            size="md"
            height="60px"
            width="200px"
            rounded="lg"
            bg="teal.100"
            align="center"
            boxShadow="lg"
            _hover={{
              transform: "scale(1.1)",
              transitionDuration: "0.4s",
              transitionTimingFunction: "ease-in-out",
            }}
          >
            <FaBox size={35} />
            <Text as="b">Product</Text>
          </Box>
        </Link>
        <Link to={"/admin/category"}>
          {" "}
          <Box
            size="md"
            height="60px"
            width="200px"
            rounded="lg"
            bg="teal.100"
            align="center"
            boxShadow="lg"
            _hover={{
              transform: "scale(1.1)",
              transitionDuration: "0.4s",
              transitionTimingFunction: "ease-in-out",
            }}
          >
            <TbCategoryFilled size={35} />
            <Text as="b">Category</Text>
          </Box>
        </Link>
        <Link to={"/admin/warehouse"}>
          {" "}
          <Box
            size="md"
            height="60px"
            width="200px"
            rounded="lg"
            bg="teal.100"
            align="center"
            boxShadow="lg"
            _hover={{
              transform: "scale(1.1)",
              transitionDuration: "0.4s",
              transitionTimingFunction: "ease-in-out",
            }}
          >
            <FaWarehouse size={35} />
            <Text as="b">Warehouse</Text>
          </Box>
        </Link>
        <Link to={"/admin/order"}>
          {" "}
          <Box
            size="md"
            height="60px"
            width="200px"
            rounded="lg"
            bg="teal.100"
            align="center"
            boxShadow="lg"
            _hover={{
              transform: "scale(1.1)",
              transitionDuration: "0.4s",
              transitionTimingFunction: "ease-in-out",
            }}
          >
            <FaClipboardList size={35} />
            <Text as="b">Order</Text>
          </Box>
        </Link>
        <Link to={"/admin/promo"}>
          {" "}
          <Box
            size="md"
            height="60px"
            width="200px"
            rounded="lg"
            bg="teal.100"
            align="center"
            boxShadow="lg"
            _hover={{
              transform: "scale(1.1)",
              transitionDuration: "0.4s",
              transitionTimingFunction: "ease-in-out",
            }}
          >
            <BiSolidDiscount size={35} />
            <Text as="b">Promo</Text>
          </Box>
        </Link>

        <Link to={"/admin/user"}>
          {" "}
          <Box
            size="md"
            height="60px"
            width="200px"
            rounded="lg"
            bg="teal.100"
            align="center"
            boxShadow="lg"
            _hover={{
              transform: "scale(1.1)",
              transitionDuration: "0.4s",
              transitionTimingFunction: "ease-in-out",
            }}
          >
            <FaUsers size={35} />
            <Text as="b">User</Text>
          </Box>
        </Link>
        <Link to={"/admin/login"} onClick={handleLogout}>
          <Box
            size="md"
            height="60px"
            width="200px"
            rounded="lg"
            bg="red.300"
            align="center"
            boxShadow="lg"
            _hover={{
              transform: "scale(1.1)",
              transitionDuration: "0.4s",
              transitionTimingFunction: "ease-in-out",
            }}
          >
            <IoLogOut size={35} />
            <Text as="b">Logout</Text>
          </Box>
        </Link>
      </VStack>
    </Box>
  );
};

export default AdminSidebar;
