import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/categories';
import { fetchProducts } from '../lib/supabase';
import { Product } from '../types';
import LoadingSpinner from './LoadingSpinner';

const CategoryShowcase: React.FC = () => {
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategoryImages = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts();
        
        // Group products by category
        const productsByCategory = products.reduce((acc: Record<string, Product[]>, product) => {
          if (!acc[product.category]) {
            acc[product.category] = [];
          }
          acc[product.category].push(product);
          return acc;
        }, {});

        // For each category, select a random product image
        const images: Record<string, string> = {};
        categories.forEach(category => {
          const categoryProducts = productsByCategory[category.slug] || [];
          if (categoryProducts.length > 0) {
            const randomIndex = Math.floor(Math.random() * categoryProducts.length);
            images[category.slug] = categoryProducts[randomIndex].imageUrl;
          }
        });

        setCategoryImages(images);
      } catch (error) {
        console.error('Error loading category images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryImages();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Shop By Category</h2>
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Shop By Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((category) => (
            <Link 
              key={category.id}
              to={`/category/${category.slug}`}
              className="group"
            >
              <div className="rounded-lg overflow-hidden relative aspect-square bg-gray-100">
                {categoryImages[category.slug] ? (
                  <img 
                    src={categoryImages[category.slug]} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <span className="text-white font-medium text-sm">{category.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;