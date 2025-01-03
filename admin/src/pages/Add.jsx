import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [customCategory, setCustomCategory] = useState("");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [customSubCategory, setCustomSubCategory] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [stock, setStock] = useState(0);
  const [sizes, setSizes] = useState([]);
  const [customSize, setCustomSize] = useState("");
  const [colors, setColors] = useState([]);
  const [customColor, setCustomColor] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Basic validations
    if (!token) {
        toast.error('Unauthorized: Please log in again.');
        return;
    }
    if (!name.trim() || !description.trim()) {
        toast.error('Name and description are required.');
        return;
    }
    if (isNaN(price) || price <= 0) {
        toast.error('Price must be a valid positive number.');
        return;
    }
    if (isNaN(stock) || stock < 0) {
        toast.error('Stock must be a non-negative number.');
        return;
    }

    try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("category", customCategory || category);
        formData.append("subCategory", customSubCategory || subCategory);
        formData.append("bestseller", bestseller.toString());
        formData.append("stock", stock);
        formData.append("sizes", JSON.stringify(sizes));
        formData.append("colors", JSON.stringify(colors));

        image1 && formData.append("image1", image1);
        image2 && formData.append("image2", image2);
        image3 && formData.append("image3", image3);
        image4 && formData.append("image4", image4);

        const response = await axios.post( backendUrl  + '/api/product/add', formData, {
            headers: { token },
        });

        if (response.data.success) {
            toast.success(response.data.message);
            // Reset form fields
            setName('');
            setDescription('');
            setImage1(false);
            setImage2(false);
            setImage3(false);
            setImage4(false);
            setPrice('');
            setCategory('Men');
            setCustomCategory('');
            setSubCategory('Topwear');
            setCustomSubCategory('');
            setBestseller(false);
            setStock(0);
            setSizes([]);
            setCustomSize('');
            setColors([]);
            setCustomColor('');
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
        if (error.response && error.response.data && error.response.data.message) {
            toast.error(error.response.data.message);
        } else {
            toast.error('An unexpected error occurred. Please try again.');
        }
    }
};


  


  const addSize = () => {
    if (customSize && !sizes.includes(customSize)) {
      setSizes((prev) => [...prev, customSize]);
      setCustomSize("");
    }
  };

  const addColor = () => {
    if (customColor && !colors.includes(customColor)) {
      setColors((prev) => [...prev, customColor]);
      setCustomColor("");
    }
  };

 
    return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
        <div>
          <p className='mb-2'>Upload Image</p>

          <div className='flex gap-2'>
            <label htmlFor="image1">
              <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
              <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden/>
            </label>
            <label htmlFor="image2">
              <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
              <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden/>
            </label>
            <label htmlFor="image3">
              <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
              <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden/>
            </label>
            <label htmlFor="image4">
              <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
              <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden/>
            </label>
          </div>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product name</p>
          <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required/>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product description</p>
          <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write content here' required/>
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
            <div>
              <p className='mb-2'>Product category</p>
              <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-3 py-2'>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
              </select>
              <input 
                type="text" 
                placeholder="Add custom category" 
                className='w-full px-3 py-2 mt-2' 
                value={customCategory} 
                onChange={(e) => setCustomCategory(e.target.value)}
              />
            </div>

            <div>
              <p className='mb-2'>Sub category</p>
              <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2'>
                  <option value="Topwear">Topwear</option>
                  <option value="Bottomwear">Bottomwear</option>
                  <option value="Winterwear">Winterwear</option>
              </select>
              <input 
                type="text" 
                placeholder="Add custom sub-category" 
                className='w-full px-3 py-2 mt-2' 
                value={customSubCategory} 
                onChange={(e) => setCustomSubCategory(e.target.value)}
              />
            </div>

            <div>
              <p className='mb-2'>Product Price</p>
              <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='25' />
            </div>
        </div>

        <div>
          <p className='mb-2'>Product Stock</p>
          <input onChange={(e) => setStock(e.target.value)} value={stock} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='0' required />
        </div>

        <div>
          <p className='mb-2'>Product Sizes</p>
          <div className='flex gap-2'>
            <input 
              type="text" 
              placeholder="Add custom size" 
              className='w-full px-3 py-2' 
              value={customSize} 
              onChange={(e) => setCustomSize(e.target.value)}
            />
            <button type="button" onClick={addSize} className='px-3 py-2 bg-gray-200'>Add</button>
          </div>
          <ul className='mt-2'>
            {sizes.map((size, index) => (
              <li key={index} className='inline-block bg-gray-100 px-3 py-1 mr-2 mt-1 rounded'>
                {size}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className='mb-2'>Product Colors</p>
          <div className='flex gap-2'>
            <input 
              type="text" 
              placeholder="Add custom color" 
              className='w-full px-3 py-2' 
              value={customColor} 
              onChange={(e) => setCustomColor(e.target.value)}
            />
            <button type="button" onClick={addColor} className='px-3 py-2 bg-gray-200'>Add</button>
          </div>
          <ul className='mt-2'>
            {colors.map((color, index) => (
              <li key={index} className='inline-block bg-gray-100 px-3 py-1 mr-2 mt-1 rounded'>
                {color}
              </li>
            ))}
          </ul>
        </div>

        <div className='flex gap-2 mt-2'>
          <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
          <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
        </div>

        <button type="submit" className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>
    </form>
  );
};

export default Add;
