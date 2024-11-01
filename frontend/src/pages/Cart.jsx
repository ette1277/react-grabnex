import React, { useContext, useEffect, useState } from 'react'; 
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';


const Cart = () => { 
  const { products, currency, cartItems, updateQuantity, navigate} = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  // Update cartData based on cartItems and products
  useEffect(() => {
    const tempData = [];

    for (const itemId in cartItems) {
      if (!cartItems[itemId]) continue;  // Ensure itemId exists

      for (const color in cartItems[itemId]) {
        if (!cartItems[itemId][color]) continue;  // Ensure color exists

        for (const size in cartItems[itemId][color]) {
          if (cartItems[itemId][color][size] > 0) {
            tempData.push({
              _id: itemId,
              color: color,
              size: size,
              quantity: cartItems[itemId][color][size],
            });
          }
        }
      }
    }

    // Debugging output
    console.log(tempData);

    // Set the updated cart data
    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <h1>Your Cart</h1>
      </div>

      {cartData.map((item) => {
        const productData = products.find((product) => product._id === item._id);

        return (
          <div 
            key={item._id}  // Use item._id for a stable unique key
            className='py-4 border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
          >
            <div className='flex items-start gap-6'>
              {/* Safe access to image data with fallback */}
              <img 
                className='w-16 sm:w-20' 
                src={productData?.image?.[0] || 'fallback-image-url'} 
                alt={`${productData?.name || 'Product Image'}`} 
              />

              <div>
                {/* Product name with a fallback */}
                <p className='text-xs sm:text-lg font-medium'>Product Name: {productData?.name || 'N/A'}</p>

                <div className='flex items-center gap-5 mt-2'>
                  {/* Price rendering with safe fallback */}
                  <p>{currency}{productData?.price ?? '0.00'}</p>

                  {/* Size and Color with fallbacks */}
                  <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item?.size || 'N/A'}</p>
                  <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item?.color || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Input to update quantity, handling undefined values properly */}
            <input
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value > 0) {
                  updateQuantity(item._id, item.size, item.color, value);
                }
              }}
              className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1'
              type="number"
              min={1}
              defaultValue={item?.quantity || 1}
            />

            {/* Delete button with safe handling */}
            <img
              onClick={() => updateQuantity(item._id, item.size, item.color, 0)}
              className='w-4 mr-4 sm:w-5 cursor-pointer'
              src={assets?.bin_icon || 'fallback-icon-url'}
              alt="Delete"
            />
          </div>
        );
      })}

      {/* Cart Total should be outside the map iteration */}
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className=' w-full text-end'>
            <button onClick={()=>navigate('/place-order')} className='bg-black text-white text-sm my-8 py-3'>PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
