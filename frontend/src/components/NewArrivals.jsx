import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem';

const NewArrivals = () => {

const { products } = useContext(ShopContext);
const [newArrivals, setNewArrivals] = useState([]);

useEffect(() => {
      setNewArrivals(products.slice(0,10));
},[])



  return (
    <div className='my-10'>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>

     {
      newArrivals.map((item, index) => (
        <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
      ))
     }

      </div>
    </div>
  )
}

export default NewArrivals