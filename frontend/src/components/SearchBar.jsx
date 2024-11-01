import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);

const location = useLocation();

  useEffect(() =>{

  }, [location])


  return showSearch ? (
    <div className='border-t border-b bg-gray-100  text-center'>
      <div className='inline-flex items-center justify-center border-gray-400 px-5 py-2 my-5 mx-5 rounded-full bg-white sm:w-3/4 sm:w-1/2'>
        <input 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className='flex-1 outline-none bg-inherit text-sm' 
          type='text' 
          placeholder='Search'
        />
        <img className='w-4' src={assets.search_icon} alt='Search icon' />
    </div>
      <img 
        onClick={() => setShowSearch(false)} 
        className='inline w-3 cursor-pointer' 
        src={assets.cross_icon} 
        alt='Close search'
      />
    </div>
  ) : null;
}

export default SearchBar;
