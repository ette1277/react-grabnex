import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const Hero = ({ title = "New Arrivals", subtitle = "Welcome to GrabneX eCommerce", ctaText = "Shop Now" }) => {
  return (
    <section className='relative w-full overflow-hidden'>
      <div className='flex flex-col-reverse sm:flex-row items-center border border-gray-200 rounded-lg shadow-md'>
        {/* Hero Left Side */}
        <div className='w-full sm:w-1/2 p-6 sm:p-10 lg:p-16 flex flex-col items-start justify-center text-left'>
          <div className='flex items-center gap-3 mb-4'>
            <span className='block w-12 h-[3px] bg-gray-800'></span>
            <p className='text-gray-600 font-medium text-base md:text-lg'>{subtitle}</p>
          </div>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-6'>
            {title}
          </h1>
          <p className='text-lg md:text-xl text-gray-700 mb-8'>
            Discover the latest and greatest products in our collection. Exclusive designs and offers just for you!
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Navigate to ${ctaText}`}
          >
            {ctaText}
          </Link>
        </div>

        {/* Hero Right Side */}
        <div className='w-full sm:w-1/2 flex items-center justify-center overflow-hidden'>
          <img
            className='max-w-[1000px] h-auto max-h-[450px] object-cover transition-transform duration-500 ease-in-out hover:scale-105'
            src={assets.hero_img}
            alt="Latest Collection"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
