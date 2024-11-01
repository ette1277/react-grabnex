import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    if (!token) return;

    setLoading(true); // Set loading before fetching orders

    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } });
      console.log(response)
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Stop loading after fetching
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: newStatus },
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(prevOrders => prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )); // Optimistic UI update
        toast.success('Order status updated successfully!');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update order status.');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3>Order Page</h3>

      {/* Loading State */}
      {loading && <p>Loading orders...</p>}

      {/* Empty State */}
      {!loading && orders.length === 0 && <p>No orders found.</p>}

      {/* Order List */}
      <div>
        {!loading && orders.map((order, index) => (
          <div
            className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700'
            key={index}
          >
            <img className='w-12' src={assets.parcel_icon} alt="Parcel" />
            <div>
              {/* Order Items */}
              <div>
                {order.items.map((item, idx) => (
                  <p className='py-0.5' key={idx}>
                    {item.name} x {item.quantity} <span>{item.size}</span>{idx !== order.items.length - 1 ? ',' : ''}
                  </p>
                ))}
              </div>
              {/* Customer Address */}
              <p className='mt-3 mb-2 font-medium'>
                {order.address.firstName} {order.address.lastName}
              </p>
              <div>
                <p>{order.address.street},</p>
                <p>{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
              </div>
              <p>{order.address.phone}</p>
            </div>

            {/* Order Details */}
            <div>
              <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
              <p className='mt-3'>Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date: {new Date(order.date).toLocaleString()}</p> {/* More readable date format */}
            </div>

            {/* Total Amount */}
            <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>

            {/* Status Dropdown */}
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className='p-2 font-semibold'
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
