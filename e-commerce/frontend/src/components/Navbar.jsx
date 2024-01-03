import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Flex,
  Text,
  IconButton,
  CSSReset,
  ChakraProvider,
  Input,
  Avatar,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useMediaQuery,
  Box,
  Image,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBox } from "react-icons/fa";
import { MdOutlineMenu } from "react-icons/md";
import Logowhite from "../assets/logowhite.png";
import Logotext from "../assets/logotext.png";

const CustomInput = styled(Input)`
  &:focus {
    border-color: teal.300;
    box-shadow: none;
    background-color: white;
    color: black;
  }
`;

const Navbar = ({ onSearchTermChange }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSmallerThan800] = useMediaQuery("(max-width: 800px)");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearchTermChange(searchTerm);
  };

  const handleLinkClick = (path) => {
    if (path === "/") {
      setSearchTerm("");
    }

    console.log("Navigating to:", path);
    navigate(token ? path : "/login");
  };


  useEffect(() => {
    console.log("Navbar rendered or updated");
  });

  return (
    <ChakraProvider>
      <CSSReset />
      <Flex
        align="center"
        justify="space-between"
        p={4}
        bg="teal.300"
        color="white"
      >
        {isSmallerThan800 ? null : (
          <Box
            to="/"
            as={Link}
            fontSize="xl"
            fontWeight="bold"
            textDecoration="none"
            ml={12}
          >
            <HStack>
              <Image
                boxSize={"50px"}
                src={Logowhite}
                objectFit={"cover"}
              ></Image>
              <Image h={"20px"} src={Logotext} objectFit={"cover"}></Image>
            </HStack>
          </Box>
        )}

        <Flex
          as="form"
          onSubmit={handleSearchSubmit}
          align={"center"}
          w={isSmallerThan800 ? "100%" : "50%"}
        >
          <CustomInput
            type="text"
            placeholder="Search products"
            variant="filled"
            mr={2}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <IconButton
            type="submit"
            aria-label="Search"
            icon={<SearchIcon />}
            colorScheme="teal"
            size="sm"
          />
        </Flex>

        {isSmallerThan800 ? (
          <Menu m="auto">
            <MenuButton
              m={4}
              as={IconButton}
              aria-label="More"
              icon={<MdOutlineMenu size={30} />}
              bg="teal"
              size="sm"
              p="auto"
            >
              More
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => handleLinkClick("/")}>
                <Text as="b" textColor={"black"} w={"full"} align={"center"}>
                  Home
                </Text>
              </MenuItem>
              <MenuItem onClick={() => handleLinkClick("/cart")}>
                <Text as="b" textColor={"black"} w={"full"} align={"center"}>
                  Cart
                </Text>
              </MenuItem>
              <MenuItem onClick={() => handleLinkClick("/orders")}>
                <Text as="b" textColor={"black"} w={"full"} align={"center"}>
                  {" "}
                  Order
                </Text>
              </MenuItem>
              <MenuItem
                onClick={() => handleLinkClick(user ? "/profile" : "/login")}
              >
                <Text as="b" textColor={"black"} w={"full"} align={"center"}>
                  {user ? user.full_name : "Profile"}
                </Text>
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <HStack align="center" spacing={8}>
            <Flex
              cursor="pointer"
              p={2}
              rounded="lg"
              onClick={() => handleLinkClick("/cart")}
              _hover={{
                bg: "teal.800",
                transition: "all 1s cubic-bezier(.08,.52,.52,1)",
              }}
            >
              <FaShoppingCart size={30} />
              <Text
                as="b"
                ml={2}
                textDecoration="none"
                color="white"
                fontSize="xl"
              >
                Cart
              </Text>
            </Flex>
            <Flex
              cursor="pointer"
              p={2}
              rounded="lg"
              onClick={() => handleLinkClick("/orders")}
              _hover={{
                bg: "teal.800",
                transition: "all 1s cubic-bezier(.08,.52,.52,1)",
              }}
            >
              <FaBox size={30} />
              <Text
                as="b"
                ml={2}
                textDecoration="none"
                color="white"
                fontSize="xl"
              >
                Orders
              </Text>
            </Flex>
            <Link to={user ? "/login" : "/profile"}>
              <Flex
                alignItems="center"
                cursor="pointer"
                p={2}
                rounded="lg"
                onClick={() => handleLinkClick("/cart")}
                _hover={{
                  bg: "teal.800",
                  transition: "all 1s cubic-bezier(.08,.52,.52,1)",
                }}
              >
                <Avatar size="sm" name={user?.name} src={user?.avatar} />
                <Text
                  ml={2}
                  textDecoration="none"
                  color="white"
                  as="b"
                  fontSize="xl"
                >
                  {user ? user.full_name : "Profile"}
                </Text>
              </Flex>
            </Link>
          </HStack>
        )}
      </Flex>
    </ChakraProvider>
  );
};

export default Navbar;
