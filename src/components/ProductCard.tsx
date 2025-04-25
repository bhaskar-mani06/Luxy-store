import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, ImageOff } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  originalPrice?: number;
  discount?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  category,
  originalPrice,
  discount
}) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

  const formattedOriginalPrice = originalPrice ? new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(originalPrice) : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();  // Prevent navigation
    e.stopPropagation(); // Stop event from bubbling up
    addToCart({
      id,
      name,
      price,
      image,
    });
    toast.success('Added to cart!');
  };

  // Generate product URL
  const productUrl = `/product/${id}`;

  return (
    <div className="group bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-md">
      <div className="relative">
        <Link to={productUrl} className="block">
          {imageError ? (
            <div className="w-full h-64 bg-gray-100 flex flex-col items-center justify-center">
              <ImageOff className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Image not available</span>
            </div>
          ) : (
            <img
              src={image}
              alt={name}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          )}
        </Link>
      </div>

      <div className="p-4">
        <Link to={productUrl} className="block">
          <span className="text-sm text-gray-500 block mb-1">{category}</span>
          <h3 className="font-semibold text-lg mb-2 group-hover:text-gold-600 transition-colors line-clamp-2">
            {name}
          </h3>
          
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl font-bold text-gold-600">
              {formattedPrice}
            </span>
            {formattedOriginalPrice && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  {formattedOriginalPrice}
                </span>
                {discount && (
                  <span className="text-green-600 text-sm font-semibold">
                    ({discount}% off)
                  </span>
                )}
              </>
            )}
          </div>
        </Link>

        <div className="flex justify-between items-center">
          <button 
            onClick={handleAddToCart}
            className="bg-gold-500 text-white px-4 py-2 rounded-lg hover:bg-gold-600 transition-colors flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
          <button 
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;