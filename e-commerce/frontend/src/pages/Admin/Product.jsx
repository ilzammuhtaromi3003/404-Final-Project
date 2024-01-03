import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Select,
  Button,
  Tooltip,
  VStack,


} from '@chakra-ui/react';
import { SearchIcon, AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';


const Product = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [categories, setCategories] = useState([]); // Menyimpan daftar kategori dari server
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [searchError, setSearchError] = useState('');
  const [lowStockProducts, setLowStockProducts] = useState([]);

  const cancelRef = React.useRef();

  useEffect(() => {
    // Fetch daftar kategori saat komponen dimuat
    fetchCategories();
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      let response;
      if (
        selectedCategory.trim() === "" ||
        selectedCategory === "All Categories"
      ) {
        // Jika selectedCategory kosong atau "All Categories," ambil semua produk
        response = await axios.get("http://localhost:3000/product/detail");
      } else {
        // Jika selectedCategory tidak kosong, lakukan filter berdasarkan kategori
        const encodedCategory = encodeURIComponent(selectedCategory);
        const endpoint = `http://localhost:3000/product/filter/${encodedCategory}`;
        response = await axios.get(endpoint);
      }
  
      const allProducts = response.data;
  
      // Urutkan produk berdasarkan nama sebelum ditampilkan
      const sortedProducts = allProducts.slice().sort((a, b) => a.name.localeCompare(b.name));
  
      // Filter produk dengan stok di bawah 5
      const lowStockProducts = sortedProducts.filter((product) => product.stock < 5);
      setLowStockProducts(lowStockProducts);
  
      // Simpan hasil filter kategori ke dalam filteredProducts
      setFilteredProducts(sortedProducts);
  
      // Tampilkan hasil filter kategori 
      setProducts(sortedProducts);
    } catch (error) {
      console.error("Error fetching or filtering products:", error);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/product/categories/names"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = async () => {
    try {
      let response;
      if (searchTerm.trim() === "") {
        // Jika searchTerm kosong, gunakan filteredProducts (hasil filter kategori)
        setProducts([...filteredProducts]);
        setSearchError("");
      } else {
        // Jika searchTerm tidak kosong, lakukan pencarian pada filteredProducts
        const searchResults = filteredProducts.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (searchResults.length === 0) {
          setSearchError("No products found.");
        } else {
          setSearchError("");
        }

        setProducts(searchResults);
        setSearchTerm(""); // Mengosongkan nilai pada searchTerm setelah selesai pencarian
      }
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleKeyDown = (e) => {
    // Jika tombol yang ditekan adalah "Enter", panggil fungsi handleSearch
    if (e.key === "Enter") {
      setSearchError(""); // Reset pesan kesalahan sebelum melakukan pencarian baru
      handleSearch();
    }
  };

  const handleSelectChange = (e) => {
    const category = e.target.value;
    console.log("Selected Category (before):", selectedCategory);
    setSelectedCategory(category);
    setSearchError(""); // Mengosongkan nilai pada searchError setelah filterisasi
  };

  const handleDelete = (productId) => {
    setSelectedProductId(productId);
    setIsAlertDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/product/${selectedProductId}`);
      const updatedProducts = products.filter(
        (product) => product.product_id !== selectedProductId
      );
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsAlertDialogOpen(false);
      setSelectedProductId(null);
    }
  };

  const cancelDelete = () => {
    setIsAlertDialogOpen(false);
    setSelectedProductId(null);
  };

  return (
    <Flex justifyContent="space-between" flexDirection="column">
      <Box bg="teal.300" w="full" align="center" height="60px">
        <Text fontWeight="bold" fontSize={"xx-large"}>
          Product Management
        </Text>
      </Box>
      <Box align="Justify" p="20px">
        <VStack spacing={4} align="stretch" px={12}>
          <Flex>
            <InputGroup ml="auto" maxW="500px">
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
              <IconButton
                mx="3"
                colorScheme="blue"
                h="2.5rem"
                size="lg"
                onClick={handleSearch}
                aria-label="Search"
                icon={<SearchIcon />}
              />
            </InputGroup>
          </Flex>

          <Flex justifyContent="space-between">
            <Link to="/admin/product/add">
              <Tooltip label="Add Product" fontSize="md">
                <IconButton
                  colorScheme="green"
                  fontSize="sm"
                  icon={<AddIcon />}
                  aria-label="Add Product"
                />
              </Tooltip>
            </Link>

            <Select
              ml="auto"
              maxW="500px"
              placeholder="Berdasarkan Kategori"
              value={selectedCategory}
              onChange={handleSelectChange}
            >
              <option value="">Semua kategori</option>
              {categories
                .slice() // Membuat salinan array untuk menghindari perubahan langsung
                .sort() // Mengurutkan array sesuai abjad
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </Select>
          </Flex>
          {searchError && (
            <Box my="2" color="red.500" textAlign="center" fontSize="sm">
              {searchError}
            </Box>
          )}
          <Box
            rounded="3xl"
            overflowX="auto"
            overflowY="auto"
            backgroundColor="#F2F2F2"
            maxH="500px"
            px="5"
            py="5"
          >
            <Flex flexWrap="wrap" justifyContent="space-between" rounded="3xl">
              {products.map((product) => (
                <Box
                  key={product.product_id}
                  p={4}
                  mb={4}
                  bg="white"
                  boxShadow="md"
                  borderRadius="md"
                  width={["100%", "48%"]}
                >
                  <Flex justifyContent="space-between">
                    <Box flex="1" mr="5">
                      <Image
                        src={`http://localhost:3000/images/${product.image}`}
                        alt={product.name}
                        maxH="150px"
                        mb={2}
                        width="100%"
                        borderRadius="md"
                        style={{
                          width: "400px",
                          height: "600px",
                          margin: "auto",
                        }}
                      />
                    </Box>
                    <Box flex="2" pl="5" justifyContent="space-between">
                      <Text fontSize="xl" fontWeight="semibold">
                        {product.name}
                      </Text>
                      <Text fontSize="md">{product.description}</Text>
                      <Text color="gray.500" fontSize="sm">
                        Harga: Rp. {product.price}
                      </Text>
                      <Text color={product.stock < 5 ? 'red' : 'black'} fontWeight={product.stock < 5 ? 'bold' : 'normal'} fontSize="sm">
                        Stock: {product.stock}
                      </Text>
                      <Text color="gray.500" fontSize="sm">

                        kategori: {product.category?.category_name || 'Unknown Category'}
                      </Text>
                      <Text color="gray.500" fontSize="sm">
                        Gudang: {product.warehouse?.warehouse_name || 'Unknown Warehouse'}

                      </Text>
                    </Box>
                    <Box ml="5">
                      <Link to={`/admin/product/edit/${product.product_id}`}>

                        <Button
                          colorScheme="yellow"
                          mb={2}
                          fontSize="sm"
                        >
                          <Tooltip label="Edit Product" fontSize="md">
                            <EditIcon />
                          </Tooltip>
                        </Button>
                      </Link>

                      <Button
                        colorScheme="red"
                        mb={2}
                        ml={2}
                        fontSize="sm"
                        onClick={() => handleDelete(product.product_id)}
                      >
                        <Tooltip label="Delete Product" fontSize="md">
                          <DeleteIcon />
                        </Tooltip>
                      </Button>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </Flex>
          </Box>
        </VStack>
      </Box>

      <AlertDialog
        isOpen={isAlertDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={cancelDelete}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this product? You can't undo this
              action.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button colorScheme="gray" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default Product;
