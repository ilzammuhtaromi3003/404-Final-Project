import React, { useEffect, useState } from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  fetchUserData,
  getProvinceList,
  getCityList,
  updateAddress,
} from "../api/api";

const Profile = () => {
  const { user: contextUser, token, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [isAddAddressModalOpen, setAddAddressModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        const userData = await fetchUserData(token);
        setUser(userData || null);
        console.log("User data in Profile:", userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      }
    };

    fetchUserDetails();
  }, [token, navigate]);

  useEffect(() => {
    const fetchProvinceList = async () => {
      try {
        const provinces = await getProvinceList();
        // console.log("Fetched provinces:", provinces);
        setProvinces(provinces);
      } catch (error) {
        console.error("Error fetching province list:", error);
      }
    };

    fetchProvinceList();
  }, []);

  const fetchCityList = async (provinceId) => {
    try {
      const cities = await getCityList(provinceId);
      // console.log("Fetched cities:", cities);
      setCities(cities);
    } catch (error) {
      console.error("Error fetching city list:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleOpenAddAddressModal = () => {
    setAddAddressModalOpen(true);
  };

  const handleCloseAddAddressModal = () => {
    setAddAddressModalOpen(false);
  };

  const handleAddAddress = async () => {
    try {
      const selectedCityDetails = cities.find(
        (city) => city.city_id === selectedCity
      );
      if (selectedCityDetails) {
        const { province_id, province, city_id, city_name, postal_code } =
          selectedCityDetails;

        const parsedProvinceId = parseInt(province_id, 10);
        const parsedCityId = parseInt(city_id, 10);
        const parsedPostalCode = parseInt(postal_code, 10);

        const response = await updateAddress(
          {
            province_id: parsedProvinceId,
            province_name: province,
            city_id: parsedCityId,
            city_name,
            postal_code: parsedPostalCode,
          },
          token
        );

        console.log("Update Address API Response:", response);
        console.log("Address added successfully!");
      } else {
        console.error("Error: City details not found.");
      }

      handleCloseAddAddressModal();
    } catch (error) {
      console.error("Error handling address:", error);
    }
  };

  console.log("User data in Profile:", user);

  return (
    <>
      <Flex align="center" justify="center" h="calc(100vh)" bg={"gray.300"}>
        <Box
          p="4"
          h="calc(50vh)"
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="md"
          bg={"white"}
          mr={6}
          align="center"
        >
          <Box mr="4">
            <Text fontWeight="bold">Affiliate Code:</Text>
            <Text>{user ? user.affiliate_code : "N/A"}</Text>
          </Box>
        </Box>
        <Box
          p="4"
          h="calc(50vh)"
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="md"
          bg={"white"}
        >
          <Box>
            <Text fontWeight="bold">Name:</Text>
            <Text>{user?.full_name || "N/A"}</Text>

            <Text fontWeight="bold">Email:</Text>
            <Text>{user?.email || "N/A"}</Text>

            <Text fontWeight="bold">Addresses:</Text>
            {user?.user_addresses?.length > 0 ? (
              user.user_addresses.map((address) => (
                <div key={address.user_address_id}>
                  <Text>{`Province: ${address.province_name}, City: ${address.city_name}, Postal Code: ${address.postal_code}`}</Text>
                </div>
              ))
            ) : (
              <Text>N/A</Text>
            )}

            <Button mt="4" onClick={handleOpenAddAddressModal}>
              Add address
            </Button>

            <Button mt="4" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box>
      </Flex>

      <Modal
        isOpen={isAddAddressModalOpen}
        onClose={handleCloseAddAddressModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              placeholder="Select Province"
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                fetchCityList(e.target.value);
              }}
              mb="4"
            >
              {provinces.map((province) => (
                <option key={province.province_id} value={province.province_id}>
                  {province.province}
                </option>
              ))}
            </Select>

            <Select
              placeholder="Select City"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              mb="4"
            >
              {cities.map((city) => (
                <option key={city.city_id} value={city.city_id}>
                  {city.city_name}
                </option>
              ))}
            </Select>

            <Button colorScheme="teal" onClick={handleAddAddress}>
              Add Address
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCloseAddAddressModal}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Profile;
