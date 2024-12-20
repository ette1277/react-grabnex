import React, { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  

  // Add an item to the cart
  const addToCart = async (itemId, size, color) => {
    if (!size || !color) {
      toast.error("Select size and color.");
      return;
    }

    const cartData = structuredClone(cartItems);

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    if (!cartData[itemId][color]) {
      cartData[itemId][color] = {};
    }

    cartData[itemId][color][size] = (cartData[itemId][color][size] || 0) + 1;
 
      

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/add`,
          { itemId, size, color },
          { headers: { token } }
        );
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }

    toast.success("Item added to cart.");
  };

  // Get total item count in the cart
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

  // Update quantity of a specific cart item
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

  // Get the total cart amount
  const getCartAmount = () => {
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
  };

  // Fetch products data
  const getProductsData = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products.reverse());
      } else {
        toast.error(response.data.message || "Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error.message);
      toast.error(error.message);
    }
  }, [backendUrl]);

  // Fetch user cart data
  const getUserCart = async (userToken) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token: userToken } }
      );

      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error.message);
      toast.error(error.message);
      if (error.response?.status === 401) {
        setToken(""); // Clear invalid token
        navigate("/login"); // Redirect to login
      }
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    getProductsData();
  }, [getProductsData]);

  // Handle token changes and fetch cart
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!token && savedToken) {
      setToken(savedToken);
      getUserCart(savedToken);
    } else if (token) {
      getUserCart(token);
    }
  }, [token]);

  // Context value to be provided
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
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};




export default ShopContextProvider;
