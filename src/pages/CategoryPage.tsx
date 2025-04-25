import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard';
import { fetchProductsByCategory } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  originalPrice?: number;
  onSale?: boolean;
  discount?: number;
}

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  console.log('Current category slug from URL:', slug);
  
  const normalizedSlug = slug?.toLowerCase().trim();
  console.log('Normalized URL slug:', normalizedSlug);
  console.log('Available categories:', categories.map(c => ({
    name: c.name,
    slug: c.slug,
    normalized: c.slug.toLowerCase().trim()
  })));
  
  const category = categories.find(cat => 
    cat.slug.toLowerCase().trim() === normalizedSlug
  );
  
  console.log('Found category from categories list:', category);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('Loading products for category slug:', slug);
        setIsLoading(true);
        setError(null);
        
        // Debug log to check category slug
        console.log('Category from URL:', slug);
        console.log('Category from categories list:', category);
        
        const data = await fetchProductsByCategory(slug || '');
        console.log('Received products from API:', data);
        console.log('Product categories:', data.map(p => p.category));
        
        if (!data || data.length === 0) {
          console.log('No products found for category:', slug);
          console.log('Available categories in categories.ts:', categories.map(c => ({ name: c.name, slug: c.slug })));
        }
        
        setProducts(data);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      loadProducts();
    }
  }, [slug]);

  if (!category) {
    console.log('Category not found for slug:', slug);
    return (
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <h1 className="text-2xl font-bold mb-8">Category Not Found</h1>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-8">{category.name}</h1>
          <div className="text-center py-10">
            <p>No products found in this category.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600">{category.description}</p>
          )}
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
              originalPrice={product.originalPrice}
              discount={product.discount}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;