import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { fetchProducts } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';
import { Product } from '../types';

const NewArrivals: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await fetchProducts();
        
        // Get first 4 products (newest products)
        const newestProducts = allProducts.slice(0, 4);
        setProducts(newestProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-luxury-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">New Arrivals</h2>
          </div>
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-luxury-50">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">New Arrivals</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.imageUrl}
              category={product.category}
              originalPrice={product.originalPrice || undefined}
              discount={product.discount}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;