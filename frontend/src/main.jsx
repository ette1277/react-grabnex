import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import CartProvider from './context/CartContext';
import ProductProvider from './context/ProductContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {/* Wrap AuthProvider at the root */}
    <AuthProvider backendUrl={import.meta.env.VITE_BACKEND_URL}>
      {/* ProductProvider depends on AuthProvider (if token is used in product requests) */}
      <ProductProvider backendUrl={import.meta.env.VITE_BACKEND_URL}>
        {/* CartProvider depends on AuthProvider (for token) and ProductProvider (for products) */}
        <CartProvider backendUrl={import.meta.env.VITE_BACKEND_URL}>
          <App />
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  </BrowserRouter>
);
