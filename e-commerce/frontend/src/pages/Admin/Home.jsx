import React from 'react';
import { Box, Heading, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Hapus token dari localStorage saat logout
    localStorage.removeItem('Token');

    // Navigasi ke halaman login setelah logout
    navigate('/admin/login');
  };

  return (
    <Box p={4} maxW="md" mx="auto">
      <Heading mb={4}>Selamat datang di Halaman Home</Heading>
      <Button colorScheme="red" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default Home;
