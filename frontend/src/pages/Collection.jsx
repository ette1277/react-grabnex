import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import ProductItem from '../components/ProductItem';
import { useParams } from 'react-router-dom';

const Collection = () => {
  // Get category type from the URL using useParams
  const { type } = useParams();
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState(type ? [type] : []);  // Initially set based on the URL parameter
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('');

  // Toggle category selection
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  // Toggle sub-category selection
  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  // Apply filters to the product list
  const applyFilter = () => {
    if (!products) return;

    let productsCopy = products.slice();

    // Apply search filter if the search is enabled
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category filter
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) => category.includes(item.category.toLowerCase()));
    }

    // Apply sub-category filter
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) => subCategory.includes(item.subCategory.toLowerCase()));
    }

    setFilterProducts(productsCopy);
  };

  // Sort products
  const sortProducts = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyFilter();
        break;
    }
  };

  // Run the filter logic whenever category, subCategory, search, or showSearch changes
  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, type]);

  // Run sorting whenever sortType changes
  useEffect(() => {
    sortProducts();
  }, [sortType]);

  // Update category when the route parameter changes
  useEffect(() => {
    if (type) {
      setCategory([type.toLowerCase()]);
    }
  }, [type]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 border-t'>
      {/* Filter Option */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
          FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''} `} src={assets.dropdown_icon} />
        </p>

        {/* Category filter */}
        <div className={`border border-green-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'> Categories</p>
          <div className='flex flex-col gap-2 text-sm font-light text-green-700'>
            {['men', 'women', 'children', 'pets', 'decors', 'toys', 'watches', 'computer', 'automotive'].map((cat) => (
              <p className='flex gap-2' key={cat}>
                <input
                  className='w-3'
                  type='checkbox'
                  value={cat}
                  onChange={toggleCategory}
                  checked={category.includes(cat)}
                />
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </p>
            ))}
          </div>
        </div>

        {/* SubCategory Filter */}
        <div className={`border border-green-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>SubCategories</p>
          <div className='flex flex-col gap-2 text-sm font-light text-green-700'>
            {['tops', 'underwears', 'jackets', 'pets', 'decors', 'toys', 'watches', 'computer', 'automotive'].map(
              (subCat) => (
                <p className='flex gap-2' key={subCat}>
                  <input
                    className='w-3'
                    type='checkbox'
                    value={subCat}
                    onChange={toggleSubCategory}
                    checked={subCategory.includes(subCat)}
                  />
                  {subCat.charAt(0).toUpperCase() + subCat.slice(1)}
                </p>
              )
            )}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
        GrabneX eCommerce

          {/* Sort Product */}
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
            <option value='relevance'>Relevance</option>
            <option value='low-high'>Low to High</option>
            <option value='high-low'>High to Low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.map((item, index) => (
            <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
