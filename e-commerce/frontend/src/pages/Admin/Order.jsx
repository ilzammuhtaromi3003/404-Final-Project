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
  Select,
  useToast,
  IconButton,
  InputGroup,
  InputLeftElement,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import axios from "axios";

const Order = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const toast = useToast();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get("http://localhost:3000/order/detail", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        });
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.order_date) - new Date(a.order_date)
        );
        setOrderDetails(sortedOrders);
        setFilteredOrders(sortedOrders);
        setOrderDetails(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error("Kesalahan mengambil detail pesanan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/order/${orderId}`,
        { order_status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );

      setOrderDetails((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId
            ? { ...order, order_status: newStatus }
            : order
        )
      );

      setFilteredOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId
            ? { ...order, order_status: newStatus }
            : order
        )
      );

      // Tambahkan alert/toast ketika status order berhasil diubah
      toast({
        title: "Order Status Updated",
        description: `Order ${orderId} status has been updated to ${newStatus}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      // Tambahkan alert/toast ketika terjadi kesalahan
      toast({
        title: "Error",
        description: "An error occurred while updating order status.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSearch = () => {
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = orderDetails.filter(
      (order) =>
        order.order_items[0]?.product.name
          .toLowerCase()
          .includes(searchTermLower) &&
        (statusFilter === "" || order.order_status.includes(statusFilter))
    );
    setFilteredOrders(filtered);
  };

  const handleKeyDown = (e) => {
    // Jika tombol yang ditekan adalah "Enter", panggil fungsi handleSearch
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box mx="auto">
      <Box bg="teal.300" w="full" align="center" height="60px">
        <Text fontWeight="bold" fontSize={"xx-large"}>
          Order Management
        </Text>
      </Box>

      <Box align="center" p="20px">
        <VStack spacing={4} align="stretch" px={12}>
          {/* search bar */}
          <Box ml="auto" maxW="500px" display="flex">
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" />}
              />
              <Input
                placeholder="Search Product"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                fontSize="sm"
              />
            </InputGroup>
            <IconButton
              ml="3"
              colorScheme="blue"
              h="2.5rem"
              size="lg"
              onClick={handleSearch}
              aria-label="Search"
              icon={<SearchIcon />}
            />
          </Box>
          {/* end of search bar */}

          {/* status filter */}
          <Select
            mb="3"
            ml="auto"
            maxW="500px"
            display="flex"
            size="sm"
            placeholder="Filter Status"
            value={statusFilter}
            onChange={(e) => {
              const newStatusFilter = e.target.value;
              setStatusFilter(newStatusFilter);
              const filtered = orderDetails.filter(
                (order) =>
                  order.order_items[0]?.product.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) &&
                  (newStatusFilter === "" ||
                    order.order_status.includes(newStatusFilter))
              );
              setFilteredOrders(filtered);
            }}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="finish">Finish</option>
          </Select>
          {/* end of status filter */}

          {/* order table */}
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
                    Order ID
                  </Th>
                  <Th textAlign="center" borderBottom="1px solid" p={2}>
                    Order Date
                  </Th>

                  <Th textAlign="center" borderBottom="1px solid" p={2}>
                    Product Name
                  </Th>
                  <Th textAlign="center" borderBottom="1px solid" p={2}>
                    Quantity
                  </Th>
                  <Th textAlign="center" borderBottom="1px solid" p={2}>
                    Price
                  </Th>
                  <Th textAlign="center" borderBottom="1px solid" p={2}>
                    Total Price
                  </Th>
                  <Th textAlign="center" borderBottom="1px solid" p={2}>
                    Proof of Payment
                  </Th>
                  <Th textAlign="center" borderBottom="1px solid" p={2}>
                    Order Status
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredOrders.length === 0 ? (
                  <Tr>
                    <Td colSpan="9" textAlign="center">
                      <Text>No orders found</Text>
                    </Td>
                  </Tr>
                ) : (
                  filteredOrders.map((order, index) => (
                    <Tr key={order.order_id}>
                      <Td textAlign="center" p={2}>
                        {index + 1}
                      </Td>
                      <Td textAlign="center" p={2}>
                        {order.order_id}
                      </Td>
                      <Td textAlign="center" p={2}>
                        {new Date(order.order_date).toLocaleDateString()}
                      </Td>
                      <Td textAlign="center" p={2}>
                        {order.order_items[0]?.product.name}
                      </Td>
                      <Td textAlign="center" p={2}>
                        {order.order_items[0]?.quantity}
                      </Td>
                      <Td textAlign="center" p={2}>
                        {order.order_items[0]?.price}
                      </Td>
                      <Td textAlign="center" p={2}>
                        {order.total_price}
                      </Td>
                      <Td textAlign="center" p={2}>
                        {order.ProofsOfPayment.map((proof, proofIndex) => (
                          <img
                            key={proofIndex}
                            src={`http://localhost:3000/uploads/${proof.image}`}
                            alt={`Proof of Payment ${order.order_id} - ${
                              proofIndex + 1
                            }`}
                            style={{
                              width: "40px",
                              height: "60px",
                              display: "block",
                              margin: "auto",
                              marginBottom: "10px",
                            }}
                          />
                        ))}
                      </Td>
                      <Td textAlign="center" p={2}>
                        <Select
                          size="sm"
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            const orderId = order.order_id;
                            handleStatusChange(orderId, newStatus);
                          }}
                          value={order.order_status}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="finish">Finish</option>
                        </Select>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Box>
        </VStack>
      </Box>
      {/* end of order table */}
    </Box>
  );
};

export default Order;
