import React, { useState, useEffect } from 'react';
import OrderCard from './OrderCard';
import { useAuth } from '../../context/AuthContext';
import { getOrdersForUser, fetchUserData } from '../../api/api';

const OrderList = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserDataAndOrders = async () => {
      try {
        if (token) {
          const user = await fetchUserData(token);
          setUserId(user.user_id);
          const userOrders = await getOrdersForUser(user.user_id);
          setOrders(userOrders);
        }
      } catch (error) {
        console.error('Error fetching user data and orders:', error);
      }
    };

    fetchUserDataAndOrders();
  }, [token]);

  return (
    <div>
      {orders.map((order) => (
        <OrderCard key={order.order_id} order={order} />
      ))}
    </div>
  );
};

export default OrderList;
