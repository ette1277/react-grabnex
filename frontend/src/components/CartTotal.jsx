import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const [cartAmount, setCartAmount] = useState(0);

  // Update cart amount when component mounts or ShopContext changes
  useEffect(() => {
    const amount = getCartAmount();
    setCartAmount(amount);
  }, [getCartAmount]);

  // Format the numbers to 2 decimal places and handle the currency properly
  const formatAmount = (amount) => {
    return amount.toFixed(2);
  };

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <h1>CART TOTAL</h1>
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p>{currency} {formatAmount(cartAmount)}</p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <p>Shipping Fee</p>
          <p>{currency} {formatAmount(delivery_fee)}</p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <b>Total</b>
          <b>{currency} {formatAmount(cartAmount + (cartAmount === 0 ? 0 : delivery_fee))}</b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
