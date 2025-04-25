import React, { useState, useEffect } from 'react';
import { Sliders, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/categories';
import { FilterOption, SortOption, Product } from '../types';
import { fetchProducts, adminSupabase, fetchProductsByCategory, fixProductCategories } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';

const AllProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryOptions: FilterOption[] = categories.map(category => ({
    id: category.slug,
    label: category.name,
    value: category.slug,
  }));

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Popular', value: 'popular' },
  ];

  // Load initial products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Loading initial products...');
        
        // First fix any category format issues
        await fixProductCategories();
        
        const data = await fetchProducts();
        console.log('Initial products loaded:', data);
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();

    // Set up real-time subscription
    const subscription = adminSupabase
      .channel('products_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        async (payload) => {
          console.log('Real-time update received:', payload);
          const data = await fetchProducts();
          console.log('Products after real-time update:', data);
          setProducts(data);
          setFilteredProducts(data);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle filtering
  useEffect(() => {
    const applyFilters = async () => {
      console.log('Starting filtering process...');
      console.log('Current products:', products);
      console.log('Selected categories:', selectedCategories);
      console.log('Price range:', priceRange);
      console.log('Sort by:', sortBy);

      try {
        let result = [...products];

        // Apply category filter
        if (selectedCategories.length > 0) {
          console.log('Applying category filter...');
          const filteredByCategory: Product[] = [];
          for (const category of selectedCategories) {
            const categoryProducts = await fetchProductsByCategory(category);
            console.log(`Products for category ${category}:`, categoryProducts);
            filteredByCategory.push(...categoryProducts);
          }
          // Remove duplicates
          result = Array.from(new Set(filteredByCategory.map(p => p.id)))
            .map(id => filteredByCategory.find(p => p.id === id))
            .filter((p): p is Product => p !== undefined);
          console.log('After category filter:', result);
        }

        // Apply price range filter
        result = result.filter(product => {
          const inRange = product.price >= priceRange[0] && product.price <= priceRange[1];
          console.log(`Price filter for ${product.name}: ${inRange} (price: ${product.price}, range: ${priceRange[0]}-${priceRange[1]})`);
          return inRange;
        });
        console.log('After price filter:', result);

        // Apply sorting
        switch (sortBy) {
          case 'price-asc':
            result.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            result.sort((a, b) => b.price - a.price);
            break;
          case 'newest':
            result.sort((a, b) => {
              console.log(`Sorting ${a.name} vs ${b.name}:`, a.created_at, b.created_at);
              return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
            });
            break;
          case 'popular':
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        }

        console.log('Final filtered result:', result);
        setFilteredProducts(result);
      } catch (error) {
        console.error('Error applying filters:', error);
      }
    };

    applyFilters();
  }, [products, selectedCategories, priceRange, sortBy]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = value;
      return newRange;
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 200000]);
    setSortBy('newest');
  };

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

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-md"
          >
            <span className="flex items-center">
              <Sliders size={18} className="mr-2" />
              Filters
            </span>
            <ChevronDown size={18} className={`transition-transform ${isMobileFilterOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`w-full md:w-64 flex-shrink-0 ${isMobileFilterOpen ? 'block' : 'hidden'} md:block`}>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-xs text-gold-500 hover:text-gold-600"
                >
                  Reset All
                </button>
              </div>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categoryOptions.map(category => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.value)}
                        onChange={() => handleCategoryChange(category.value)}
                        className="mr-2 h-4 w-4 text-gold-500 focus:ring-gold-500"
                      />
                      <label htmlFor={`category-${category.id}`} className="text-sm">
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">₹{priceRange[0]}</span>
                    <span className="text-sm">₹{priceRange[1]}</span>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="min-price" className="text-xs">Min Price</label>
                    <input
                      type="range"
                      id="min-price"
                      min="0"
                      max="200000"
                      step="5000"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(e, 0)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="max-price" className="text-xs">Max Price</label>
                    <input
                      type="range"
                      id="max-price"
                      min="0"
                      max="200000"
                      step="5000"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(e, 1)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Controls */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-600">{filteredProducts.length} products</p>
              <div className="flex items-center">
                <label htmlFor="sort" className="text-sm mr-2">Sort by:</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="border border-gray-200 rounded-md py-1 px-2 text-sm"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
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
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-gray-600 mb-4">No products match your filters</p>
                <button
                  onClick={resetFilters}
                  className="btn-secondary"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;