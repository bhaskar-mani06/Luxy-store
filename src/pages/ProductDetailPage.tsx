import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product, ProductImage } from '../types';
import { fetchProductById, fetchProductImages } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id) throw new Error('Product ID is required');
        
        console.log('Attempting to fetch product with ID:', id);
        // Fetch product details
        const productData = await fetchProductById(id);
        console.log('Fetched product data:', productData);
        setProduct(productData);

        // Fetch all product images
        console.log('Fetching product images for ID:', id);
        const images = await fetchProductImages(id);
        console.log('Fetched product images:', images);
        setProductImages(images);

        // Set the primary image as selected, or fall back to the first image
        const primaryImage = images.find(img => img.isPrimary);
        setSelectedImage(primaryImage ? primaryImage.imageUrl : (images[0]?.imageUrl || productData.imageUrl));
      } catch (err) {
        console.error('Error loading product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <div className="text-center text-red-600">
            {error || 'Product not found'}
          </div>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-16"
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div 
              className="aspect-square rounded-lg overflow-hidden bg-gray-100"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={selectedImage || product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </motion.div>
            
            {/* Thumbnail Gallery */}
            {(productImages.length > 0 || product.imageUrl) && (
              <motion.div 
                className="flex gap-2 overflow-x-auto pb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {/* Always include the primary product image */}
                {!productImages.some(img => img.imageUrl === product.imageUrl) && (
                  <button
                    onClick={() => setSelectedImage(product.imageUrl)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === product.imageUrl ? 'border-gold-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={product.imageUrl}
                      alt={`${product.name} - Primary`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                )}
                
                {/* Display all additional product images */}
                {productImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(image.imageUrl)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === image.imageUrl ? 'border-gold-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={`${product.name} - View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Product Info */}
          <motion.div
            className="space-y-6"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl font-bold">{product.name}</h1>
            
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-gold-600">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-green-600 font-semibold">
                    ({discount}% off)
                  </span>
                </>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="font-semibold">Description</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <motion.button 
                  className="btn-primary flex-1 py-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </motion.button>
                <motion.button 
                  className="btn-secondary py-3 px-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart size={24} />
                </motion.button>
              </div>
              <motion.button 
                className="btn-dark w-full py-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Buy Now
              </motion.button>
            </div>

            {/* Product Features */}
            <motion.div 
              className="space-y-4 border-t pt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="font-semibold">Product Features</h2>
              <ul className="space-y-2 text-gray-600">
                <li>• Premium Quality Build</li>
                <li>• Water Resistant</li>
                <li>• 1 Year Warranty</li>
                <li>• Free Shipping</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage; 