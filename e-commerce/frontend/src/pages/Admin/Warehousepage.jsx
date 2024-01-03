import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  Button,
  WrapItem,
  Input,
  InputGroup,
  InputRightElement,
  HStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import { getAllWarehouses, deleteWarehouse } from "../../modules/fetch";

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);
  const [selectedWarehouseName, setSelectedWarehouseName] = useState(null);
  const cancelRef = React.useRef(); // Tambahkan useRef

  const toast = useToast();

  const fetchWarehouses = async () => {
    const response = await getAllWarehouses();
    setWarehouses(response.warehouses);
  };

  useEffect(() => {
    fetchWarehouses();
  }, [searchTerm]);

  const handleSearch = () => {
    // console.log(warehouses.warehouses);
    const filteredWarehouses = warehouses.filter((warehouse) =>
      warehouse.warehouse_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setWarehouses(filteredWarehouses);
    console.log(filteredWarehouses);
  };

  const handleDelete = async () => {
    try {
      await deleteWarehouse(selectedWarehouseId);
      const updatedWarehouses = warehouses.filter(
        (warehouse) => warehouse.warehouse_id !== selectedWarehouseId
      );
      setWarehouses(updatedWarehouses);
      fetchWarehouses();

      // Tampilkan toast ketika data berhasil dihapus
      toast({
        title: "Sukses",
        description: "Gudang berhasil dihapus!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error menghapus gudang:", error.message);
      // Tampilkan toast error jika ada masalah
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus gudang.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  const handleOpenDeleteDialog = (warehouseId) => {
    setSelectedWarehouseId(warehouseId);
    onOpen();
  };

  const handleKeyDown = (e) => {
    // Jika tombol yang ditekan adalah "Enter", panggil fungsi handleSearch
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <Box bg="teal.300" w="full" align="center" height="60px">
        <Text fontWeight="bold" fontSize={"xx-large"}>
          Warehouse
        </Text>
      </Box>

      <Box align="center">
        <VStack spacing={4} align="stretch" p={12}>
          {/* search bar */}
          <Box>
            <HStack w="full">
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  placeholder="Warehouse Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleSearch}>
                    Search
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Button as={Link} to="create" colorScheme="blue">
                Add Warehouse
              </Button>
            </HStack>
          </Box>
          {/* end of search bar */}

          <Box w={"full"}>
            <Box border="1px solid" roundedTop={"lg"}>
              <Table>
                <Thead>
                  <Tr>
                    <Th w={"25%"}>Name</Th>
                    <Th w={"25%"}>Province</Th>
                    <Th w={"25%"}>City</Th>
                    <Th w={"25%"} textAlign="center">
                      Action
                    </Th>
                  </Tr>
                </Thead>
              </Table>
            </Box>
            <Box
              border="1px solid"
              roundedBottom={"lg"}
              overflowY="auto"
              maxH="500px"
            >
              <Table>
                <Tbody>
                  {warehouses && warehouses.length > 0 ? (
                    warehouses.map((warehouse) => (
                      <Tr key={warehouse.warehouse_id}>
                        <Td w={"25%"}>{`${warehouse.warehouse_name}`}</Td>
                        <Td w={"25%"}>{`${warehouse.province_name}`}</Td>
                        <Td w={"25%"}>{`${warehouse.city_name}`}</Td>
                        <Td w={"25%"}>
                          <HStack justify={"center"}>
                            <Button
                              colorScheme="yellow"
                              as={Link}
                              to={`/admin/warehouse/${warehouse.warehouse_id}`}
                            >
                              Edit
                            </Button>
                            <Button
                              colorScheme="red"
                              onClick={() =>
                                handleOpenDeleteDialog(
                                  warehouse.warehouse_id,
                                  warehouse.warehouse_name
                                )
                              }
                            >
                              Delete
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td
                        colSpan={4}
                        textAlign="center"
                        fontSize={"x-large"}
                        textColor={"red"}
                        fontWeight={"bold"}
                      >
                        Not found !!!
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </VStack>
      </Box>

      {/* alert delete */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Warehouse : {selectedWarehouseName}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
