import {
  Button,
  FormControl,
  FormLabel,
  VStack,
  useToast,
  Box,
  HStack,
  Input,
  Text,
  Link,
} from "@chakra-ui/react";
import { createPromo, getPromoById, editPromo } from "../../modules/fetch";
import { ArrowBackIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function PromoForm() {
  const toast = useToast();
  const [types, setTypes] = useState("");
  const [amounts, setAmounts] = useState("");
  const [usages, setUsages] = useState("");
  const [codes, setCodes] = useState("");
  const [error, setError] = useState(null);
  const { id } = useParams();

  const fetchPromoDetails = async (id) => {
    try {
      const response = await getPromoById(id);
      const promoDetails = response;

      setTypes(promoDetails.type);
      setAmounts(promoDetails.amount);
      setUsages(promoDetails.maximum_usage);
      setCodes(promoDetails.promo_code);
    } catch (error) {
      console.error("Error fetching promo details:", error);
      setError("Error fetching promo details");
    }
  };

  useEffect(() => {
    if (id) {
      fetchPromoDetails(id);
    }
  }, [id]);

  //Function for submit new promo
  const handleSubmit = async () => {
    try {
      const data = {
        type: types,
        amount: amounts,
        maximum_usage: parseInt(usages),
        promo_code: codes,
      };

      await createPromo(data);
      toast({
        title: "Success",
        description: "Promo created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      setError(`Error creating promotion: ${error.message}`);
      console.error("Error creating promotion:", error);
      toast({
        title: "Error",
        description: error.response?.data.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  //Function for edit promo available
  const handleEdit = async (promo_id) => {
    try {
      const id = promo_id;
      const data = {
        type: types,
        amount: amounts,
        maximum_usage: parseInt(usages),
        promo_code: codes,
      };

      await editPromo(id, data);
      // console.log("Data edited successfully: ", data);
    } catch (error) {
      setError(`Error creating promotion: ${error.message}`);
      console.error("Error creating promotion:", error);
      toast({
        title: "Error",
        description: error.response?.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box bg="teal.300" w="full" align="center" height="60px">
        <Text fontWeight="bold" fontSize={"xx-large"}>
          Promotion Form
        </Text>
      </Box>

      <form>
        <Box p="30px">
          <Button
            as={Link}
            href="/admin/promo"
            width="50px"
            h="50px"
            ml="10px"
            rounded="20px"
            bg="white"
            align="center"
            _hover={{
              transform: "scale(1.2)",
              transitionDuration: "0.3",
              rounded: "full",
              transitionTimingFunction: "ease-in-out",
              bg: "gray.200",
            }}
          >
            <ArrowBackIcon />
          </Button>
          <VStack spacing="4" w="full">
            <Box w="500px" align="center" bg="gray.200" p="20px" rounded="20px">
              <FormControl>
                <Box p="10px">
                  <HStack>
                    <FormLabel w="100px"> Type : </FormLabel>
                    <Input
                      bg="white"
                      type="text"
                      required
                      value={types}
                      onChange={(e) => setTypes(e.target.value)}
                    />
                  </HStack>
                </Box>
              </FormControl>
              <FormControl>
                <Box p="10px">
                  <HStack>
                    <FormLabel w="100px"> Amount : </FormLabel>
                    <Input
                      bg="white"
                      type="number"
                      required
                      value={amounts}
                      onChange={(e) => setAmounts(e.target.value)}
                    />
                  </HStack>
                </Box>
              </FormControl>
              <FormControl>
                <Box p="10px">
                  <HStack>
                    <FormLabel w="100px"> Usage : </FormLabel>
                    <Input
                      bg="white"
                      type="number"
                      required
                      value={usages}
                      onChange={(e) => setUsages(e.target.value)}
                    />
                  </HStack>
                </Box>
              </FormControl>
              <FormControl>
                <Box p="10px">
                  <HStack>
                    <FormLabel w="100px"> Code : </FormLabel>
                    <Input
                      bg="white"
                      type="text"
                      required
                      value={codes}
                      onChange={(e) => setCodes(e.target.value)}
                    />
                  </HStack>
                </Box>
              </FormControl>

              {!id && (
                <Button
                  mt="5px"
                  onClick={handleSubmit}
                  bg="blue"
                  colorScheme="white"
                  _hover={{
                    textColor: "blue",
                    bg: "white",
                  }}
                >
                  Create Promo
                </Button>
              )}

              {id && (
                <Button
                  mt="5px"
                  as={Link}
                  href="/admin/promo"
                  _activeLink="none"
                  onClick={() => handleEdit(id)}
                  bg="blue"
                  colorScheme="white"
                  _hover={{
                    textColor: "blue",
                    bg: "white",
                  }}
                >
                  Edit Promo
                </Button>
              )}
            </Box>
          </VStack>
        </Box>
      </form>
    </>
  );
}
