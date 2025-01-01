import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children, backendUrl }) => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const getUserCart = async (userToken) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token: userToken } }
      );

      if (!response.data.success) throw new Error(response.data.message);
      return response.data.cartData;
    } catch (error) {
      console.error("Error fetching cart data:", error.message);
      toast.error(error.message);
      if (error.response?.status === 401) {
        setToken("");
        navigate("/login");
      }
      throw error;
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  const value = {
    token,
    setToken,
    getUserCart,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
