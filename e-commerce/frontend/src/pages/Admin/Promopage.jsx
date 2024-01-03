import {
  Box,
  Text,
  VStack,
  HStack,
  InputGroup,
  InputRightElement,
  Button,
  Input,
  WrapItem,
  Grid,
  GridItem,
  useToast,
  Popover,
  PopoverContent,
  Portal,
  PopoverTrigger,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { deletePromo, getAllPromo } from "../../modules/fetch";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";

export default function Promopage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  const [promotions, setPromotions] = useState([]);
  const [searchTerm, SetsearchTerm] = useState("");

  //Handle Get Promo
  const fetchpromotions = async () => {
    const promotions = await getAllPromo();
    setPromotions(promotions);
  };

  useEffect(() => {
    fetchpromotions();
  }, [searchTerm]);

  //Handle Search
  const handleSearch = () => {
    const filteredPromo = promotions.filter(
      (promotion) =>
        promotion.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.promo_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setPromotions(filteredPromo);
  };

  //Handle for search button when pressed enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  //Handle Delete
  const handleDelete = async (promoid) => {
    try {
      //Calling function from api
      await deletePromo(promoid);

      const updatedPromo = promotions.filter(
        (promotion) => promotion.promo_id !== promoid
      );
      setPromotions(updatedPromo);

      console.log("Promo deleted successfully");
      toast({
        title: "Success",
        description: "Promo deleted successfully",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
      onClose();
    } catch {
      console.error("Error deleting warehouse: ", error.message);
    }
  };

  return (
    <>
      <Box bg="teal.300" w="full" align="center" height="60px">
        <Text fontSize={"xx-large"} fontWeight={"bold"}>
          Promo Management
        </Text>
      </Box>

      {/* search bar */}
      <Box align="center" mt={8} mb={4}>
        <HStack w="750px">
          <InputGroup size="md">
            <Input
              pr="100px"
              placeholder="Search Promo"
              value={searchTerm}
              onChange={(e) => SetsearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <InputRightElement>
              <Button
                size="sm"
                onClick={handleSearch}
                bg={"transparent"}
                _hover={{
                  rounded: "full",
                  bg: "white",
                }}
              >
                <SearchIcon />
              </Button>
            </InputRightElement>
          </InputGroup>
          <Button
            onClick={() => navigate("/admin/promo/create")}
            colorScheme="blue"
            _hover={{
              bg: "white",
              textColor: "blue",
            }}
          >
            Add Promo
          </Button>
        </HStack>
      </Box>
      {/* end of search bar */}
      <VStack overflowY="auto" h="80vh" spacing={4} align="stretch" p={12}>
        <Box align="center">
          {promotions.map((promotion) => (
            <WrapItem
              h="150px"
              w="750px"
              bg="teal.200"
              rounded={"20px"}
              mt="10px"
              boxShadow="0 3px 5px rgba(0,0,0,0.2)"
              key={`${promotion.promo_id}`}
            >
              <Grid
                w="full"
                templateColumns="repeat(3,1fr)"
                templateRows="repeat(1,1fr)"
              >
                <GridItem>
                  <Box
                    w="80%"
                    p="20px"
                    bg="white"
                    rounded="lg"
                    mt="40px"
                    align="center"
                  >
                    <Text as="b"> {`${promotion.type}`} </Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box p="3px" mt="12px" bg="gray.100" rounded="10px">
                    <Grid templateColumns="repeat(2,1fr)">
                      <GridItem align="right">
                        <Text ml="8px"> Type : </Text>
                        <Text ml="8px"> Amount : </Text>
                        <Text ml="8px"> Max Usage : </Text>
                        <Text ml="8px"> RemainUsage : </Text>
                        <Text ml="8px"> Code : </Text>
                      </GridItem>
                      <GridItem align="left">
                        <Text ml="8px"> {`${promotion.type}`}</Text>
                        <Text ml="8px"> {`${promotion.amount}`}</Text>
                        <Text ml="8px"> {`${promotion.maximum_usage}`}</Text>
                        <Text ml="8px"> {`${promotion.remaining_usage}`}</Text>
                        <Text ml="8px"> {`${promotion.promo_code}`}</Text>
                      </GridItem>
                    </Grid>
                  </Box>
                </GridItem>
                <GridItem>
                  <VStack mt="25px">
                    <Button
                      w="80%"
                      as={Link}
                      to={`/admin/promo/${promotion.promo_id}`}
                      _hover={{
                        bg: "blue",
                        textColor: "white",
                      }}
                    >
                      Manage
                    </Button>
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          w="80%"
                          border="none"
                          _hover={{
                            bg: "red",
                            textColor: "white",
                            border: "none",
                          }}
                        >
                          Delete
                        </Button>
                      </PopoverTrigger>
                      <Portal>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverHeader>
                            {" "}
                            Proceed to delete this ?{" "}
                          </PopoverHeader>
                          <PopoverBody>
                            <PopoverCloseButton />
                            <Button
                              ml="110px"
                              mr="5px"
                              colorScheme="red"
                              onClick={() => handleDelete(promotion.promo_id)}
                              key={promotion.promo_id}
                              closeOnBlur
                              closeDelay="200"
                            >
                              Delete
                            </Button>
                          </PopoverBody>
                        </PopoverContent>
                      </Portal>
                    </Popover>
                  </VStack>
                </GridItem>
              </Grid>
            </WrapItem>
          ))}
        </Box>
      </VStack>
    </>
  );
}
