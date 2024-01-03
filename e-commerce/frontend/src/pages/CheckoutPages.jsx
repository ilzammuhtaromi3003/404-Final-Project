import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  Divider,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import TopSection from "../Components/CheckoutComponent/TopSection";
import LeftSection from "../Components/CheckoutComponent/LeftSection";
import RightSection from "../Components/CheckoutComponent/RightSection";
import PromoCard from "../Components/Promo/PromoCard";
import { getAllPromo, getShippingFee, fetchUserData } from "../api/api";
import { useAuth } from "../context/AuthContext";

const CheckoutPage = () => {
  const location = useLocation();
  const items = location.state?.items || [];
  const userAddress = location.state?.userAddress || {};

  const [promoData, setPromoData] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromoData = async () => {
      try {
        const response = await getAllPromo(token);
        setPromoData(response);
      } catch (error) {
        console.error("Error fetching promo data:", error);
      }
    };

    fetchPromoData();
  }, [token]);

  useEffect(() => {
    const fetchUserDataAndShippingFees = async () => {
      try {
        const userData = await fetchUserData(token);
        setUser(userData);

        if (userData && userData.user_id) {
          const fetchedShippingFee = await getShippingFee(userData.user_id);
          setShippingFee(fetchedShippingFee);
        } else {
          console.error("User ID is undefined");
        }
      } catch (error) {
        console.error("Error fetching user data or shipping fees:", error);
      }
    };

    fetchUserDataAndShippingFees();
  }, [token]);

  const handleSelectPromo = (promo) => {
    setSelectedPromo(promo);
    setPromoModalOpen(false);
  };

  return (
    <Flex direction="column" align="center" bg={"gray.200"} height="100vh">
      <Box mb={4} width="70%" p={2} bg={"white"} mt={4} rounded={"lg"}>
        <TopSection userAddress={userAddress} />
      </Box>
      <Divider />

      <Flex
        direction="row"
        justify={"space-between"}
        align="flex-start"
        width="70%"
        bg={"white"}
        rounded={"lg"}
        boxShadow={"lg"}
        p={4}
      >
        <LeftSection items={items} />

        <Flex ml={4} align="center">
          <RightSection
            shippingFee={shippingFee}
            selectedPromo={selectedPromo}
            onPromoSelect={() => setPromoModalOpen(true)}
            items={items}
          />

          <Modal
            isOpen={promoModalOpen}
            onClose={() => setPromoModalOpen(false)}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Select a Promo</ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                {promoData.map((promo) => (
                  <PromoCard
                    key={promo.promo_id}
                    promo={promo}
                    onSelect={handleSelectPromo}
                  />
                ))}
              </ModalBody>

              <ModalFooter>
                <Button onClick={() => setPromoModalOpen(false)}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CheckoutPage;
