import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount } = useContext(ShopContext);

  // Navigation Links Array for Reusability
  const navLinks = [
    { path: '/category/men', label: 'Men' },
    { path: '/category/women', label: 'Women' },
    { path: '/category/children', label: 'Children' },
    { path: '/category/pets', label: 'Pets' },
    { path: '/category/decors', label: 'Decors' },
    { path: '/category/toys', label: 'Toys' },
    { path: '/category/watches', label: 'Watches' },
    { path: '/category/computer-accessories', label: 'Computer' },
    { path: '/category/automotive-accessories', label: 'Automotive' },
  ];

  return (
    <nav className="flex items-center justify-between py-5 font-medium px-4 sm:px-[5vw]">
      {/* Logo Section */}
      <Link to="/">
        <img src={assets.logo} className="w-20" alt="logo" />
      </Link>

        <Link to='/about'>
        About Us
        </Link>



      {/* Desktop Navigation Links */}
      <ul className="hidden sm:flex gap-6 text-base text-gray-500 font-semibold">
        {navLinks.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `hover:underline mx-2 hover:text-black transition-all ${
                isActive ? 'text-black' : ''
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </ul>

      {/* Icons: Search, Profile, Cart, Hamburger Menu */}
      <div className="flex items-center gap-4">
        {/* Search Icon */}
        <button onClick={() => setShowSearch(true)} aria-label="Open Search" className="focus:outline-none">
          <img src={assets.search_icon} className="w-5 cursor-pointer" alt="Search Icon" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative group">
         <Link to='/login'> <img
            className="w-5 cursor-pointer"
            src={assets.login}
            alt="Profile Icon"
            aria-haspopup="true"
            aria-expanded="false"
          /></Link>
          <div className="hidden group-hover:block absolute right-0 pt-4 z-10">
            <div className="flex flex-col gap-2 w-36 py-3 px-3 bg-slate-100 text-gray-500 rounded shadow-lg">
              <Link to="/profile" className="hover:text-black transition-all">My Profile</Link>
              <Link to="/orders" className="hover:text-black transition-all">Orders</Link>
              <button className="hover:text-black transition-all text-left">Logout</button>
            </div>
          </div>
        </div>

        {/* Cart Icon */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5" alt="Cart Icon" />
          <p className="absolute right-[-10px] top-[-2px] w-4 text-center leading-4 bg-green-800 text-white aspect-square rounded-full text-[8px]">
          {getCartCount()} 
          </p>
        </Link>
         
       

        {/* Hamburger Menu for Small Screens */}
        <button onClick={() => setVisible(true)} className="sm:hidden focus:outline-none">
          <img src={assets.menu_icon} className="w-5 cursor-pointer" alt="Menu Icon" />
        </button>
      </div>

      {/* Sidebar for Small Screens */}
      <div
        className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white z-20 transition-all ${
          visible ? 'w-64' : 'w-0'
        } shadow-md`}
      >
        <div className="flex flex-col h-full">
          {/* Close Button */}
          <button
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 focus:outline-none border-b"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="Back" />
            <span>Close</span>
          </button>

          {/* Sidebar Navigation Links */}
          <div className="flex flex-col text-gray-600 mt-4">
            {navLinks.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setVisible(false)}
                className={({ isActive }) =>
                  `py-3 pl-6 border-b hover:bg-gray-100 transition-all ${
                    isActive ? 'bg-gray-200' : ''
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;