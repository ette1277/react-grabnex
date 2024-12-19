import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');

  const fetchProductData = async () => {

    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0])
        return null;
      }
    })

  }

  useEffect(() => {
    fetchProductData()
  }, [productId, products])


  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex flex-col sm:flex-row gap-12">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt={`Product preview ${index + 1}`}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="Selected product view" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(4)].map((_, index) => (
              <img key={index} src={assets.star_icon} alt="star icon" className="w-3.5" />
            ))}
            <img src={assets.star_dull_icon} alt="star icon" className="w-3.5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>

          {/* Size and Color Selection */}
          <div className="flex flex-col gap-4 my-8">
            {/* Select Size */}
            {productData.sizes && productData.sizes.length > 0 && (
              <div>
                <p className="font-semibold mb-2">Select Size</p>
                <div className="flex gap-2">
                  {productData.sizes.map((item, index) => (
                    <button
                      onClick={() => setSize(item)}
                      key={index}
                      className={`w-12 h-12 rounded-md border-2 px-3 py-2 transition-all duration-300 ${
                        item === size ? 'border-orange-500 bg-gray-200' : 'border-gray-300'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Select Color */}
            {productData.colors && productData.colors.length > 0 && (
              <div>
                <p className="font-semibold mb-2">Select Color</p>
                <div className="flex gap-4">
                  {productData.colors.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setColor(item)}
                      className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                        color === item ? 'border-orange-500 scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: item }}
                      aria-label={`Select color ${item}`}
                    >
                      {color === item && (
                        <span className="block w-full h-full rounded-full border-4 border-white"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(productData._id, size, color)}
            disabled={(productData.sizes && productData.sizes.length > 0 && !size) || 
                      (productData.colors && productData.colors.length > 0 && !color)}
            className={`bg-black text-white px-8 py-3 text-sm active:bg-gray-700 transition-colors duration-300 ${
              (productData.sizes && productData.sizes.length > 0 && !size) || 
              (productData.colors && productData.colors.length > 0 && !color)
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description & Review Section */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            Welcome to GrabneX eCommerce, an innovative platform for the best goods, food, and
            housing products. This cloth looks very nice.
          </p>
          <p>Shop now—there is so much to shop for, go ahead!</p>
        </div>
      </div>

      {/* Related Products Section */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;

