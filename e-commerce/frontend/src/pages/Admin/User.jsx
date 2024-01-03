import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Button,
  Select,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const User = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearch = () => {
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.full_name.toLowerCase().includes(searchTermLower) ||
        user.email.toLowerCase().includes(searchTermLower) ||
        user.affiliate_code.toLowerCase().includes(searchTermLower)
    );
    setFilteredUsers(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box mx="auto">
      <Box bg="teal.300" w="full" align="center" height="60px">
        <Text fontWeight="bold" fontSize={"xx-large"}>
          User Management
        </Text>
      </Box>

      <Box align="center" p="20px">
        <VStack spacing={4} align="stretch" px={12}>
          <Box mb="3" ml="auto" maxW="500px" display="flex">
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" />}
              />
              <Input
                placeholder="Search User"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                fontSize="sm"
                roundedLeft="none" // Styling for the left side of the input
              />
            </InputGroup>
            <IconButton
              ml="3" // Adjust the margin to align the button with the input
              colorScheme="blue"
              h="2.5rem"
              size="lg"
              onClick={handleSearch}
              aria-label="Search"
              icon={<SearchIcon />}
              roundedRight="md" // Styling for the right side of the button
            />
          </Box>
          <Box
            border="1px solid"
            rounded="lg"
            overflowX="auto"
            overflowY="auto"
            maxH="500px"
          >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th textAlign="center" borderBottom="1px solid" p={2}>
                    No.
                  </Th>
                  <Th textAlign="center" borderBottom="1px solid" p={2}>
                    User ID
                  </Th>
                  <Th textAlign="justify" borderBottom="1px solid" p={2}>
                    Name
                  </Th>
                  <Th textAlign="justify" borderBottom="1px solid" p={2}>
                    Email
                  </Th>
                  <Th textAlign="justify" borderBottom="1px solid" p={2}>
                    Affiliate Code
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.length === 0 ? (
                  <Tr>
                    <Td colSpan="5" textAlign="center">
                      <Text>No users found</Text>
                    </Td>
                  </Tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <Tr key={user.user_id}>
                      <Td textAlign="center" p={2}>
                        {index + 1}
                      </Td>
                      <Td textAlign="center" p={2}>
                        {user.user_id}
                      </Td>
                      <Td textAlign="justify" p={2}>
                        {user.full_name}
                      </Td>
                      <Td textAlign="justify" p={2}>
                        {user.email}
                      </Td>
                      <Td textAlign="justify" p={2} color="red">
                        {user.affiliate_code}
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default User;
