import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Elite Chronograph Men\'s Watch',
    description: 'A premium timepiece featuring Swiss movement and sapphire crystal.',
    price: 1299.99,
    originalPrice: 1999.99,
    category: 'mens-watch',
    imageUrl: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg',
    featured: true,
    rating: 4.8,
    onSale: true,
    discount: 35
  },
  {
    id: '2',
    name: 'Aviator Polarized Sunglasses',
    description: 'Classic aviator design with 100% UV protection and polarized lenses.',
    price: 299.99,
    originalPrice: 499.99,
    category: 'sunglasses',
    imageUrl: 'https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg',
    rating: 4.6,
    onSale: true,
    discount: 40
  },
  {
    id: '3',
    name: 'Diamond Encrusted Ladies Watch',
    description: 'Elegant timepiece with genuine diamond accents and mother of pearl dial.',
    price: 2499.99,
    originalPrice: 2999.99,
    category: 'ladies-watch',
    imageUrl: 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg',
    featured: true,
    rating: 4.9,
    onSale: true,
    discount: 17
  },
  {
    id: '4',
    name: 'Pro Wireless Earbuds',
    description: 'Premium true wireless earbuds with active noise cancellation.',
    price: 249.99,
    category: 'airpods',
    imageUrl: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg',
    isNew: true,
    rating: 4.7
  },
  {
    id: '5',
    name: 'Smart Watch Series 7',
    description: 'Advanced smartwatch with health monitoring and cellular connectivity.',
    price: 499.99,
    category: 'iwatch',
    imageUrl: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
    isNew: true,
    rating: 4.5
  },
  {
    id: '6',
    name: 'Italian Leather Bifold Wallet',
    description: 'Handcrafted from premium Italian leather with RFID protection.',
    price: 199.99,
    originalPrice: 299.99,
    category: 'wallet',
    imageUrl: 'https://images.pexels.com/photos/2346006/pexels-photo-2346006.jpeg',
    rating: 4.6,
    onSale: true,
    discount: 33
  },
  {
    id: '7',
    name: 'Designer Leather Belt',
    description: 'Luxury belt made from full-grain leather with signature buckle.',
    price: 349.99,
    category: 'belts',
    imageUrl: 'https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg',
    rating: 4.4
  },
  {
    id: '8',
    name: 'Oversized Cat Eye Sunglasses',
    description: 'Elegant oversized frames with gradient lenses and UV protection.',
    price: 279.99,
    originalPrice: 329.99,
    category: 'ladies-sunglasses',
    imageUrl: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg',
    onSale: true,
    discount: 15,
    rating: 4.3
  },
  {
    id: '9',
    name: 'Signature Unisex Fragrance',
    description: 'Exclusive fragrance with notes of bergamot, jasmine, and sandalwood.',
    price: 199.99,
    originalPrice: 249.99,
    category: 'unisex-perfume',
    imageUrl: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg',
    rating: 4.8,
    onSale: true,
    discount: 20
  },
  {
    id: '10',
    name: 'Premium Gift Set: Wallet & Belt',
    description: 'Luxury matching wallet and belt set in premium leather.',
    price: 449.99,
    originalPrice: 499.99,
    category: 'wallets-belts',
    imageUrl: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
    onSale: true,
    discount: 10,
    rating: 4.7
  },
  {
    id: '11',
    name: 'Automatic Buckle Leather Belt',
    description: 'Premium leather belt with automatic sliding buckle mechanism.',
    price: 299.99,
    category: 'belt',
    imageUrl: 'https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg',
    rating: 4.5
  },
  {
    id: '12',
    name: 'Luxury Fragrance Collection',
    description: 'Set of three signature fragrances in elegant bottles.',
    price: 499.99,
    originalPrice: 699.99,
    category: 'fragrance-gift-set',
    imageUrl: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg',
    featured: true,
    rating: 4.9,
    onSale: true,
    discount: 29
  },
  {
    name: "WOEM",
    description: "Elegant ladies watch with rose gold finish. Features a sophisticated design with premium materials and precise timekeeping mechanism. Perfect for both casual and formal occasions.",
    price: 15000,
    originalPrice: 1400,
    category: "ladies-watch",
    imageUrl: "https://hjbynsyoyipnwovkytrm.supabase.co/storage/v1/object/public/images/watch1.jpg",
    featured: true,
    isNew: true,
    onSale: true,
    discount: 45
  },
  {
    name: "RM",
    description: "Premium men's watch with modern design. Features a durable stainless steel case, precise automatic movement, and water resistance. Ideal for everyday wear.",
    price: 20000,
    originalPrice: 5000,
    category: "mens-watch",
    imageUrl: "https://hjbynsyoyipnwovkytrm.supabase.co/storage/v1/object/public/images/watch2.jpg",
    featured: true,
    isNew: false,
    onSale: true,
    discount: 30
  },
  {
    name: "sunglass",
    description: "Designer sunglasses with UV protection. Features premium quality lenses, comfortable fit, and stylish design. Perfect for both fashion and eye protection.",
    price: 14000,
    originalPrice: 5000,
    category: "sunglasses",
    imageUrl: "https://hjbynsyoyipnwovkytrm.supabase.co/storage/v1/object/public/images/sunglass1.jpg",
    featured: false,
    isNew: true,
    onSale: true,
    discount: 20
  },
  {
    name: "rolex",
    description: "Luxury men's watch with classic design. Features premium materials, automatic movement, and elegant styling. A timeless piece for the discerning gentleman.",
    price: 15000,
    originalPrice: 4500,
    category: "mens-watch",
    imageUrl: "https://hjbynsyoyipnwovkytrm.supabase.co/storage/v1/object/public/images/watch3.jpg",
    featured: true,
    isNew: true,
    onSale: false,
  }
];

export const getProductsByCategory = (categorySlug: string): Product[] => {
  return products.filter(product => product.category === categorySlug);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getNewArrivals = (): Product[] => {
  return products.filter(product => product.isNew);
};

export const getOnSaleProducts = (): Product[] => {
  return products.filter(product => product.onSale);
};