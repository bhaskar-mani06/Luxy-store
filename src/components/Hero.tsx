import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="pt-32 pb-16 bg-luxury-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Discover <span className="text-gold-500">Luxury</span> For Less
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Elevate your style with premium accessories from India's favorite luxury store.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <Link to="/products" className="btn-primary px-8 py-3 text-lg">
                Shop Now
              </Link>
              
            </div>
          </div>
          
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1687719/pexels-photo-1687719.jpeg"
              alt="Luxury Accessories"
              className="rounded-lg shadow-xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
              <p className="text-sm font-bold">NEW COLLECTION</p>
              <p className="text-gold-500 font-bold">Up to 40% Off</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;