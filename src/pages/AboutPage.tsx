import React, { useEffect } from 'react';
import { Award, ShieldCheck, Truck, Clock } from 'lucide-react';

const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-16">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Luxy Store</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Welcome to Luxy Store, your premier destination for luxury fashion and lifestyle products. 
            We curate the finest collection of premium brands to bring you an exceptional shopping experience.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded with a passion for luxury and excellence, Luxy Store has been serving 
              discerning customers since our inception. We believe in offering not just products, 
              but experiences that reflect sophistication and elegance.
            </p>
            <p className="text-gray-600 mb-4">
              Our carefully curated collection represents the pinnacle of quality and style, 
              bringing together the world's most prestigious brands under one roof.
            </p>
            <p className="text-gray-600">
              At Luxy Store, we're committed to providing an unparalleled shopping experience, 
              combining premium products with exceptional customer service.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <div className="bg-luxury-100 rounded-lg p-8">
              <img 
                src="/about-store.jpg" 
                alt="Luxury Store Interior" 
                className="rounded-lg shadow-lg w-full h-[300px] object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';
                }}
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-luxury-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-luxury-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
            <p className="text-gray-600">Only the finest products from renowned luxury brands</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-luxury-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-luxury-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Authenticity</h3>
            <p className="text-gray-600">100% authentic products with guarantee</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-luxury-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="text-luxury-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Swift and secure worldwide shipping</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-luxury-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-luxury-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600">Dedicated customer service round the clock</p>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To provide our customers with an exclusive collection of luxury products while 
              delivering exceptional service and maintaining the highest standards of quality 
              and authenticity.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-600">
              To be the most trusted and preferred destination for luxury shopping, setting 
              new standards in customer experience and product curation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 