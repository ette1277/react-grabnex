import React from "react";
import { Route, Navigate } from "react-router-dom";


const isAuthenticated = () => {
  // Check if the user is authenticated
  return  !!localStorage.getItem("token");
};


const ProtectedRoute = ( props ) => {
  return isAuthenticated() ? (
    <Route {...props} />
  ) : (
    <Navigate to="/login" />
  );
};


export default ProtectedRoute;