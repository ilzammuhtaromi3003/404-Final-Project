import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Button,
  Input,
  useToast,
  Select,
  Text, // Tambahkan Text dari Chakra UI
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


const FormAddProduct = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    is_available: '',
    category_name: '',
    warehouse_name: '',
    weight: '',
    image: null,
  });

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/product/categories/names`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/product/warehouses/names`);
      return response.data;
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      throw error;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchCategories();
        const warehousesData = await fetchWarehouses();
        setCategories(categoriesData);
        setWarehouses(warehousesData);
      } catch (error) {
        console.error('Error fetching categories and warehouses:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleTambahProduk = async () => {
    try {
      const {
        name,
        description,
        price,
        stock,
        is_available,
        category_name,
        warehouse_name,
        weight,
        image,
      } = formData;

      const formDataToSend = new FormData();
      formDataToSend.append('name', name);
      formDataToSend.append('description', description);
      formDataToSend.append('price', price);
      formDataToSend.append('stock', stock);
      formDataToSend.append('is_available', is_available);
      formDataToSend.append('category_name', category_name);
      formDataToSend.append('warehouse_name', warehouse_name);
      formDataToSend.append('weight', weight);
      formDataToSend.append('image', image);

      const response = await axios.post('http://localhost:3000/product', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Setelah berhasil menambahkan, tampilkan Toast sukses dan arahkan ke halaman produk
      toast({
        title: 'Produk berhasil ditambahkan',
        status: 'success',
        isClosable: true,
      });

      navigate('/admin/product');
    } catch (error) {
      console.error('Error tambah produk:', error);

      // Jika terjadi kesalahan, tampilkan Toast error
      toast({
        title: 'Gagal menambahkan produk',
        status: 'error',
        isClosable: true,
      });
    }
  };


  return (
    <Box p={4}>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Heading mb={4}>Tambah Produk</Heading>
        <Link to="/admin/product">
          <Button colorScheme="blue">Kembali ke Produk</Button>
        </Link>
      </Box>

      <form encType="multipart/form-data">
        <Text mb={2}>
          Mohon isi formulir di bawah untuk menambahkan produk baru. Pastikan data yang Anda
          masukkan akurat dan lengkap.
        </Text>
        <Box mb={3}>
          <Input
            type="text"
            name="name"
            placeholder="Nama Produk"
            value={formData.name}
            onChange={handleInputChange}
          />
        </Box>
        <Box mb={3}>
          <Input
            type="text"
            name="description"
            placeholder="Deskripsi"
            value={formData.description}
            onChange={handleInputChange}
          />
        </Box>
        <Box mb={3}>
          <Input
            type="text"
            name="price"
            placeholder="Harga"
            value={formData.price}
            onChange={handleInputChange}
          />
        </Box>
        <Box mb={3}>
          <Input
            type="number"
            name="stock"
            placeholder="Stok"
            value={formData.stock}
            onChange={handleInputChange}
          />
        </Box>
        <Box mb={3}>
          <label>Pilih Kategori</label>
          <Select
            name="category_name"
            value={formData.category_name}
            onChange={handleInputChange}
          >
            <option value="" disabled>Pilih Kategori</option>
            {categories
              .slice() // Membuat salinan array untuk menghindari perubahan langsung
              .sort() // Mengurutkan array sesuai abjad
              .map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </Select>
        </Box>
        <Box mb={3}>
          <label>Pilih Gudang</label>
          <Select
            name="warehouse_name"
            value={formData.warehouse_name}
            onChange={handleInputChange}
          >
            <option value="" disabled>Pilih Gudang</option>
            {warehouses
              .slice() // Membuat salinan array untuk menghindari perubahan langsung
              .sort() // Mengurutkan array sesuai abjad
              .map((warehouse) => (
                <option key={warehouse} value={warehouse}>
                  {warehouse}
                </option>
              ))}
          </Select>
        </Box>
        <Box mb={3}>
          <Input
            type="number"
            name="weight"
            placeholder="Berat"
            value={formData.weight}
            onChange={handleInputChange}
          />
        </Box>
        <Box mb={3}>
          <Text>Pilih gambar produk yang akan diunggah</Text>
          <Input type="file" name="image" onChange={handleImageChange} />
        </Box>
        <Button colorScheme="green" mt={4} onClick={handleTambahProduk}>
          Simpan Produk
        </Button>
      </form>
    </Box>
  );
};

export default FormAddProduct;
