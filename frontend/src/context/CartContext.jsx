import React, { createContext, useState, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const CartContext = createContext();

const CartProvider = ({ children, backendUrl, token, setToken, currency, }) => {



  const [cartItems, setCartItems] = useState({});
  const [showSearch, setShowSearch] = useState(false);

  const addToCart = async (itemId, size, color) => {
    if (!size || !color) {
      toast.error("Select size and color.");
      return;
    }

    const cartData = structuredClone(cartItems);
    if (!cartData[itemId]) cartData[itemId] = {};
    if (!cartData[itemId][color]) cartData[itemId][color] = {};
    cartData[itemId][color][size] = (cartData[itemId][color][size] || 0) + 1;

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, size, color },
          { headers: { token } }
        );
        toast.success("Item added to cart.");
      } catch (error) {
        console.error(error);
        toast.error(error.message);

        cartData[itemId][color][size] -= 1;
        if (cartData[itemId][color][size] <= 0) delete cartData[itemId][color][size];
        setCartItems(cartData);
      }
    }
  };

  const updateQuantity = async (itemId, size, color, quantity) => {
    if (quantity <= 0) {
      toast.error("Quantity must be greater than zero.");
      return;
    }

    const cartData = structuredClone(cartItems);

    if (cartData[itemId] && cartData[itemId][color]) {
      cartData[itemId][color][size] = quantity;
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, size, color, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((total, colors) => {
      return (
        total +
        Object.values(colors).reduce((colorCount, sizes) => {
          return (
            colorCount +
            Object.values(sizes).reduce((sizeCount, quantity) => {
              return sizeCount + (quantity || 0);
            }, 0)
          );
        }, 0)
      );
    }, 0);
  };

  const getCartAmount = useCallback(
    (products) => {
      return Object.entries(cartItems).reduce((total, [productId, colors]) => {
        const product = products.find((p) => p._id === productId);
        if (!product) return total;

        return (
          total +
          Object.values(colors).reduce((colorTotal, sizes) => {
            return (
              colorTotal +
              Object.entries(sizes).reduce(
                (sizeTotal, [size, quantity]) =>
                  sizeTotal + product.price * (quantity || 0),
                0
              )
            );
          }, 0)
        );
      }, 0);
    },
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      updateQuantity,
      showSearch,
      setShowSearch,
      getCartCount,
      getCartAmount,
      setCartItems,
    }),
    [cartItems, getCartAmount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
