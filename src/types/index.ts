export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  isPrimary: boolean;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  imageUrl: string;
  images?: ProductImage[];
  featured?: boolean;
  isNew?: boolean;
  onSale?: boolean;
  discount?: number;
  rating?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'popular';