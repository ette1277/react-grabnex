import React, { createContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { products } from "../assets/assets";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cloneDeep from 'lodash/cloneDeep';


// Create the context
export const ShopContext = createContext();

// Create the provider component
const ShopContextProvider = (props) => {
  const currency = '$';
  const delivery_fee = 10;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  
  const navigate = useNavigate();

  

  const addToCart = (itemId, size, color) => {
      if (!itemId || !size || !color) {
          toast.error("Select size and color.");
          return;
      }
  
      // Create a deep copy of cartItems to avoid direct mutation
      let cartData = cloneDeep(cartItems);
  
      // Check if the item already exists in the cart
      if (!cartData[itemId]) {
          // If the itemId does not exist, initialize it
          cartData[itemId] = {};
      }
  
      // Check if the color already exists for this item
      if (!cartData[itemId][color]) {
          // If the color does not exist, initialize it
          cartData[itemId][color] = {};
      }
  
      // Check if the size already exists for this color of the item
      if (cartData[itemId][color][size]) {
          // If the size already exists, increment the quantity
          cartData[itemId][color][size] += 1;
      } else {
          // If the size does not exist, initialize the quantity to 1
          cartData[itemId][color][size] = 1;
      }
  
      // Set the updated cart items
      setCartItems(cartData);
      toast.success("Item added to cart.");
  };
  

  const getCartCount = () => {
    let totalCount = 0;

    for (const itemId in cartItems) {
        if (!cartItems.hasOwnProperty(itemId)) continue; // Safeguard for unexpected inherited properties
        const colors = cartItems[itemId];
        
        for (const color in colors) {
            if (!colors.hasOwnProperty(color)) continue; // Safeguard for unexpected inherited properties
            const sizes = colors[color];
            
            for (const size in sizes) {
                if (!sizes.hasOwnProperty(size)) continue; // Safeguard for unexpected inherited properties
                
                // Ensure the count is a valid number and add to totalCount
                const quantity = sizes[size];
                if (typeof quantity === 'number' && !isNaN(quantity) && quantity > 0) {
                    totalCount += quantity;
                }
            }
        }
    }

    return totalCount;
};



const updateQuantity = async (itemId, size, color, quantity) => {
  // Create a deep copy of cartItems to avoid direct mutation
  let cartData = cloneDeep(cartItems);

  // Ensure itemId exists in cartData, otherwise initialize it
  if (!cartData[itemId]) {
      cartData[itemId] = {};
  }

  // Ensure color exists in the item, otherwise initialize it
  if (!cartData[itemId][color]) {
      cartData[itemId][color] = {};
  }

  // Update the quantity for the specified size and color
  cartData[itemId][color][size] = quantity;

  // Set the updated cart items
  setCartItems(cartData);
};
    

  

const getCartAmount = () => {
  let totalAmount = 0;

  for (const productId in cartItems) {
      // Find the product by productId
      const product = products.find(p => p._id === productId);

      if (product) {
          const colors = cartItems[productId]; // Assumed structure: itemId -> color -> size
          for (const color in colors) {
              if (!colors.hasOwnProperty(color)) continue; // Safeguard for unexpected properties
              
              const sizes = colors[color];
              for (const size in sizes) {
                  if (!sizes.hasOwnProperty(size)) continue; // Safeguard for unexpected properties

                  const quantity = sizes[size];
                  // Add product price * quantity to totalAmount, but only if quantity is valid
                  if (typeof quantity === 'number' && quantity > 0) {
                      totalAmount += product.price * quantity;
                  }
              }
          }
      }
  }

  console.log(totalAmount);
  return totalAmount;
};


  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
