import axios from 'axios';

const baseURL = 'http://localhost:3000';

const api = axios.create({
  baseURL,
});

const handleRequestError = (error) => {
  if (error.response) {
    console.error('Request failed with status code:', error.response.status);
    console.error('Response data:', error.response.data);
    return error.response.data.message || 'Request failed';
  } else if (error.request) {
    console.error('Request made but no response received');
    return 'No response from server';
  } else {
    console.error('Error setting up the request');
    return 'Failed to set up the request';
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/userauth/login', { email, password });
    return response.data;
  } catch (error) {
    throw handleRequestError(error);
  }
};


export const registerUser = async (userData) => {
  try {
    const response = await api.post('/userauth/register', userData);
    return response.data.token;
  } catch (error) {
    throw handleRequestError(error);
  }
};

export const getProducts = async ({ page, limit, sort, filter, search }) => {
  try {
    const { data } = await api.get('/users/products', {
      params: { page, limit, sort, filter, search },
    });

    return data;
  } catch (error) {
    throw error.response ? error.response.data.message : error.message;
  }
};

export const getProductById = async (productId) => {
  console.log('Function called with productId:', productId);

  try {
    const response = await api.get(`/users/products/${productId}`);
    console.log('getProductById Response:', response);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data.message : error.message;
  }
};

export const getAllProducts = async () => {
  try {
    const response = await api.get('/users/allProducts');
    console.log('getAllProducts Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    throw handleRequestError(error);
  }
};


export const getCategories = async () => {
  try {
    const response = await api.get('/users/categories');
    return response.data;
  } catch (error) {
    throw handleRequestError(error);
  }
};

export const fetchUserData = async (token) => {
  try {
    const tokenString = typeof token === 'object' ? token.token : token;
    console.log('Token in fetchUserData:', token);

    const response = await api.get('/userauth/view-profile', {
      headers: {
        Authorization: token,
      },
    });

    const userData = response.data.user_profile;
    console.log('Fetch User Data:', userData);

    return userData;
  } catch (error) {
    console.error('Fetch User Data Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getProvinceList = async () => {
  try {
    const response = await api.get('/api/provinces');
    return response.data;
  } catch (error) {
    console.error('Error getting province list:', error);
    throw new Error('Failed to get province list');
  }
};


export const getCityList = async (provinceId) => {
  try {
    const url = `/api/cities/${provinceId}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error getting city list:', error);
    throw new Error(`Failed to get city list: ${error.message}`);
  }
};

export const updateAddress = async (addressData, token) => {
  try {
    const response = await api.put('/userauth/update-address', addressData, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Update address error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getAllPromo = async (token) => {
  try {
    const response = await api.get('/userauth/promotions', {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw handleRequestError(error);
  }
};

export const fetchCart = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get(`/shoppingCart/${userId}`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw handleRequestError(error);
  }
};

export const addToCart = async (userId, productId, quantity, token) => {
  try {
    const response = await api.post('/shoppingCart/add-to-cart', { userId, productId, quantity }, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw handleRequestError(error);
  }
};

export const removeFromCart = async (cartItemId, userId, productId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.delete(`/shoppingCart/removeFromCart/${cartItemId}/${userId}/${productId}`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw handleRequestError(error);
  }
};

export const updateCartItemQuantity = async (cartItemId, newQuantity, userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.put(`/shoppingCart/updateCartItemQuantity/${cartItemId}/${newQuantity}/${userId}`, null, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw handleRequestError(error);
  }
};

export const getShippingFee = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get(`/shipping/shipping-fees/${userId}`, {
      headers: {
        Authorization: token,
      },
    });

    const shippingFee = response.data.shippingFee;

    return shippingFee;
  } catch (error) {
    console.error('Error getting shipping fee:', error);
    throw new Error('Failed to get shipping fee');
  }
};


export const calculateTotalPrice = async (orderItems) => {
  try {
    const response = await api.post('/user/orders/calculateTotalPrice', { orderItems });
    return response.data.totalPrice;
  } catch (error) {
    throw handleRequestError(error);
  }
};

export const createOrder = async (userId, promoCode, courier, token) => {
  try {
    const response = await api.post(`/user/orders/${userId}`, { promoCode: promoCode, courier: courier }, {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.status} - ${promoCode}`);
    }

    const data = response.data;

    if (data && data.error) {
      throw new Error(`Failed to create order: ${data.error}`);
    }

    console.log('Order creation data:', data);

    if (data && data.orderId) {
      return data;
    } else {
      throw new Error('Unexpected response format:', data);
    }
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
};



export const getOrdersForUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get(`/user/orders/${userId}`, {
      headers: {
        Authorization: token,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Failed to get user orders: ${response.status} - ${response.statusText}`);
    }

    const data = response.data;
    console.log('User orders:', data.orders);
    return data.orders;
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw new Error('Failed to get user orders');
  }
};

export const uploadProofOfPayment = async (orderId, proofOfPaymentFile, token) => {
  try {
    const formData = new FormData();
    formData.append('proofOfPaymentFile', proofOfPaymentFile);

    const response = await api.post(`/user/upload-proof-of-payment/${orderId}`, formData, {
      headers: {
        Authorization: token,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;

  } catch (error) {
    console.error('Error uploading proof of payment:', error);
    throw new Error('Failed to upload proof of payment');
  }
};


export const getOrderById = async (orderId, token) => {
  try {
    const response = await api.get(`/user/orders/getById/${orderId}`, {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get order by ID: ${response.status} - ${response.statusText}`);
    }

    const data = response.data;
    console.log('Order by ID:', data.order);
    return data.order;
  } catch (error) {
    console.error('Error getting order by ID:', error);
    throw new Error('Failed to get order by ID');
  }
};

export const fetchCategoryById = async (categoryId) => {
  try {
    const response = await api.get(`/users/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    throw error;
  }
};

export const completeOrder = async (orderId, token) => {
  try {
    const response = await api.post(`/user/orders/completeOrder/${orderId}`, null, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;

  } catch (error) {
    console.error('Error completing order:', error);
    throw new Error('Failed to complete order');
  }
};



export default api;
