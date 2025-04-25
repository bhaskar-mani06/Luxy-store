import React from 'react';
import Hero from '../components/Hero';
import CategoryShowcase from '../components/CategoryShowcase';
import FeaturedProducts from '../components/FeaturedProducts';
import NewArrivals from '../components/NewArrivals';
import { motion } from 'framer-motion';
import { Star, Truck, Shield, Gift, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] relative overflow-hidden">
      {/* Background Design */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[length:60px_60px] opacity-10"></div>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[length:60px_60px] opacity-10"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Hero />
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-16 bg-white/80 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-12"
            >
              Why Choose <span className="text-gold-500">Luxy Store</span>
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mb-6">
                  <Star className="text-gold-500 w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
                <p className="text-gray-600 text-center">Curated selection of luxury products</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mb-6">
                  <Truck className="text-gold-500 w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
                <p className="text-gray-600 text-center">Quick and reliable shipping</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mb-6">
                  <Shield className="text-gold-500 w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure Payment</h3>
                <p className="text-gray-600 text-center">100% safe transactions</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mb-6">
                  <Gift className="text-gold-500 w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Gift Ready</h3>
                <p className="text-gray-600 text-center">Perfect for special occasions</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Categories Section */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="py-16 bg-gradient-to-b from-gray-50 to-white"
        >
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl font-bold"
              >
                Shop by <span className="text-gold-500">Category</span>
              </motion.h2>
            </div>
            <CategoryShowcase />
          </div>
        </motion.div>

        {/* Featured Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="py-16 bg-gradient-to-b from-white to-gray-50"
        >
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl font-bold"
              >
                Featured <span className="text-gold-500">Products</span>
              </motion.h2>
              <Link 
                to="/products" 
                className="text-gold-500 hover:text-gold-600 flex items-center group"
              >
                View All Products
                <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <FeaturedProducts />
          </div>
        </motion.div>

        {/* New Arrivals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="py-16 bg-gradient-to-b from-gray-50 to-white"
        >
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl font-bold"
              >
                New <span className="text-gold-500">Arrivals</span>
              </motion.h2>
            </div>
            <NewArrivals />
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="py-16 bg-gradient-to-r from-indigo-50 to-purple-50"
        >
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-8"
            >
              What Our <span className="text-gold-500">Customers</span> Say
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Priya Sharma',
                  comment: 'I purchased a watch from Luxy Store for my husband\'s birthday. The quality is exceptional, and the packaging was truly luxurious. Will definitely shop here again!',
                  rating: 5
                },
                {
                  name: 'Arjun Kapoor',
                  comment: 'The sunglasses I bought exceeded my expectations. The customer service was excellent, and the delivery was prompt. Highly recommend!',
                  rating: 5
                },
                {
                  name: 'Nisha Patel',
                  comment: 'Beautiful products and fantastic service. My new wallet is just perfect - exactly as described. The quality is outstanding for the price.',
                  rating: 4
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
                  whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <motion.svg 
                        key={i} 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`w-6 h-6 ${i < testimonial.rating ? 'text-gold-500' : 'text-gray-300'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </motion.svg>
                    ))}
                  </div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-600 italic mb-6 text-lg"
                  >
                    "{testimonial.comment}"
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="font-semibold text-lg"
                  >
                    {testimonial.name}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;