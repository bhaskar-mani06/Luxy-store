import { createClient } from '@supabase/supabase-js';
import { Product, ProductImage } from '../types';
import { categories, Category } from '../data/categories';

// Direct Supabase configuration with correct keys
const supabaseUrl = 'https://hjbynsyoyipnwovkytrm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqYnluc3lveWlwbndvdmt5dHJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzOTkwMTgsImV4cCI6MjA2MDk3NTAxOH0.2z8kGzrUe4vNSORd2aPNp9MRnwklOTLLLHgo7BJzbDc';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqYnluc3lveWlwbndvdmt5dHJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTM5OTAxOCwiZXhwIjoyMDYwOTc1MDE4fQ.WcVgMFUOSFzdK7tZG3IaIRW8JwEeyl3T7mUj_NK0a6E';

// Log configuration
console.log('Initializing Supabase with URL:', supabaseUrl);
console.log('Anon key available:', !!supabaseAnonKey);
console.log('Service role key available:', !!supabaseServiceRoleKey);

// Create a Supabase client for public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

// Create a separate client for admin operations using service role key
export const adminSupabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: {
      Authorization: `Bearer ${supabaseServiceRoleKey}`
    }
  }
});

// Create a separate client for service role operations with proper headers
export const serviceRoleSupabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: {
      Authorization: `Bearer ${supabaseServiceRoleKey}`
    }
  }
});

// Initialize storage
const initializeStorage = async () => {
  try {
    console.log('Checking storage configuration...');
    
    // Check authentication status
    const { data: { session } } = await adminSupabase.auth.getSession();
    if (!session) {
      console.warn('No active session found during storage initialization');
      return;
    }

    // Try to list files in the images bucket
    const { data: files, error } = await adminSupabase.storage
      .from('images')
      .list();
    
    if (error) {
      console.error('Error accessing images bucket:', error);
      return;
    }

    console.log('Successfully accessed images bucket');
  } catch (error) {
    console.error('Storage access error:', error);
  }
};

// Call initialization when the app starts
initializeStorage();

// Add after initializeStorage function
export const testStorageAccess = async () => {
  try {
    console.log('Testing storage access...');
    
    // Test bucket listing
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      throw listError;
    }
    
    console.log('Available buckets:', buckets);
    
    // Test images bucket access
    const { data: files, error: listFilesError } = await supabase.storage
      .from('images')
      .list();
      
    if (listFilesError) {
      console.error('Error listing files:', listFilesError);
      throw listFilesError;
    }
    
    console.log('Files in images bucket:', files);
    
    return {
      success: true,
      buckets,
      files
    };
  } catch (error) {
    console.error('Storage access test failed:', error);
    return {
      success: false,
      error
    };
  }
};

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

interface ProductImagesResult {
  success: boolean;
  data?: ProductImage[];
  error?: string;
}

// Upload multiple images
export const uploadImages = async (files: File[]): Promise<UploadResult[]> => {
  const results: UploadResult[] = [];
  
  for (const file of files) {
    try {
      const { data, error } = await supabase.storage
        .from('images')
        .upload(`products/${Date.now()}-${file.name}`, file);

      if (error) {
        console.error('Error uploading image:', error);
        results.push({ success: false, error: error.message });
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(data.path);

      results.push({ success: true, url: publicUrl });
    } catch (error) {
      console.error('Error in uploadImage:', error);
      results.push({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to upload image' 
      });
    }
  }

  return results;
};

// Save product images
export const saveProductImages = async (
  productId: string, 
  imageUrls: string[],
  primaryImageIndex: number = 0
): Promise<ProductImagesResult> => {
  try {
    const productImages = imageUrls.map((url, index) => ({
      product_id: productId,
      image_url: url,
      is_primary: index === primaryImageIndex
    }));

    const { data, error } = await adminSupabase
      .from('product_images')
      .insert(productImages)
      .select();

    if (error) {
      console.error('Error saving product images:', error);
      return { success: false, error: error.message };
    }

    // Transform the response to match the ProductImage interface
    const savedImages: ProductImage[] = data.map(item => ({
      id: item.id,
      productId: item.product_id,
      imageUrl: item.image_url,
      isPrimary: item.is_primary,
      createdAt: item.created_at
    }));

    return { success: true, data: savedImages };
  } catch (error) {
    console.error('Error in saveProductImages:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save product images' 
    };
  }
};

// Fetch product images
export const fetchProductImages = async (productId: string): Promise<ProductImage[]> => {
  try {
    const { data, error } = await adminSupabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('is_primary', { ascending: false });

    if (error) {
      console.error('Error fetching product images:', error);
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      productId: item.product_id,
      imageUrl: item.image_url,
      isPrimary: item.is_primary,
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error('Error in fetchProductImages:', error);
    throw error;
  }
};

// Delete product image
export const deleteProductImage = async (imageId: string): Promise<boolean> => {
  try {
    const { error } = await adminSupabase
      .from('product_images')
      .delete()
      .eq('id', imageId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting product image:', error);
    throw error;
  }
};

interface DBProductImage {
  id: string;
  image_url: string;
  is_primary: boolean;
}

interface RawProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  category: string;
  imageUrl: string;
  featured: boolean;
  is_new: boolean;
  on_sale: boolean;
  discount: number;
  rating: number;
  created_at: string;
  updated_at: string;
  product_images?: DBProductImage[];
}

export const saveProduct = async (product: Partial<Product>): Promise<ProductResult> => {
  try {
    console.log('Original product data:', product);
    
    // Transform the category to match our slug format
    let categorySlug = product.category?.toLowerCase()
      .trim()
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/\'s/g, 's')     // Remove apostrophes
      .replace(/[^a-z0-9-]/g, ''); // Remove any other special characters

    // Ensure the category matches one from our predefined list
    const validCategory = categories.find((cat: Category) => cat.slug === categorySlug);
    if (validCategory) {
      categorySlug = validCategory.slug; // Use the exact slug from our categories
    } else {
      console.warn('Category not found in predefined list:', categorySlug);
    }

    // Special handling for mens-watch to mens-watches
    if (categorySlug === 'mens-watch') {
      categorySlug = 'mens-watches';
    }

    console.log('Original category:', product.category);
    console.log('Transformed category slug:', categorySlug);
    console.log('Valid category from list:', validCategory);

    // Transform the product data to match the database schema
    const productData = {
      name: product.name,
      description: product.description,
      price: product.price,
      original_price: product.originalPrice,
      category: categorySlug,
      image_url: product.imageUrl,
      featured: product.featured || false,
      is_new: product.isNew || false,
      on_sale: product.onSale || false,
      discount: product.discount || 0,
      rating: product.rating || 0,
      created_at: new Date().toISOString()
    };

    console.log('Saving product data to Supabase:', productData);

    // First check if the product already exists
    let existingProduct = null;
    if (product.id) {
      const { data: existing } = await adminSupabase
        .from('products')
        .select('*')
        .eq('id', product.id)
        .single();
      existingProduct = existing;
    }

    let result;
    if (existingProduct) {
      // Update existing product
      result = await adminSupabase
        .from('products')
        .update(productData)
        .eq('id', product.id)
        .select()
        .single();
    } else {
      // Insert new product
      result = await adminSupabase
        .from('products')
        .insert([productData])
        .select()
        .single();
    }

    const { data, error } = result;

    if (error) {
      console.error('Error saving product to Supabase:', error);
      return { success: false, error: error.message };
    }

    if (!data) {
      console.error('No data returned from Supabase');
      return { success: false, error: 'Failed to save product - no data returned' };
    }

    // Transform the response back to match the Product interface
    const savedProduct: Product = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      originalPrice: data.original_price,
      category: data.category,
      imageUrl: data.image_url,
      featured: data.featured,
      isNew: data.is_new,
      onSale: data.on_sale,
      discount: data.discount,
      rating: data.rating,
      created_at: data.created_at
    };

    console.log('Successfully saved product:', savedProduct);
    return { success: true, data: savedProduct };
  } catch (error) {
    console.error('Error in saveProduct:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save product' };
  }
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<ProductResult> => {
  try {
    // Transform the product data to match the database schema
    const productData = {
      name: product.name,
      description: product.description,
      price: product.price,
      original_price: product.originalPrice,
      category: product.category?.toLowerCase().replace(/\s+/g, '-'),
      image_url: product.imageUrl,
      featured: product.featured || false,
      is_new: product.isNew || false,
      on_sale: product.onSale || false,
      discount: product.discount || 0,
      rating: product.rating || 0,
      created_at: new Date().toISOString()
    };

    const { data, error } = await adminSupabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return { success: false, error: error.message };
    }

    // Transform the response back to match the Product interface
    const updatedProduct: Product = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      originalPrice: data.original_price,
      category: data.category,
      imageUrl: data.image_url,
      featured: data.featured,
      isNew: data.is_new,
      onSale: data.on_sale,
      discount: data.discount,
      rating: data.rating,
      created_at: data.created_at
    };

    return { success: true, data: updatedProduct };
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update product' };
  }
};

// Function to delete product from database
export const deleteProduct = async (id: string) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
};

// Function to fetch all products
export const fetchProducts = async () => {
  try {
    console.log('Fetching products...');
    
    // Fetch products with their images using adminSupabase
    const { data: products, error: productsError } = await adminSupabase
      .from('products')
      .select(`
        *,
        product_images (
          id,
          image_url,
          is_primary
        )
      `)
      .order('created_at', { ascending: false });

    if (productsError) {
      console.error('Error fetching products:', productsError);
      throw productsError;
    }

    if (!products || products.length === 0) {
      console.log('No products found');
      return [];
    }

    // Transform the data to match the Product interface
    const transformedProducts = (products as RawProduct[]).map(product => {
      // Try to get the primary image first
      let imageUrl = product.product_images?.find(img => img.is_primary)?.image_url;
      
      // If no primary image found, try to get the first image from product_images
      if (!imageUrl && product.product_images && product.product_images.length > 0) {
        imageUrl = product.product_images[0].image_url;
      }
      
      // If still no image, use the fallback imageUrl from the product
      if (!imageUrl) {
        imageUrl = product.imageUrl;
      }

      // If no image available at all, use a placeholder
      if (!imageUrl) {
        imageUrl = '/placeholder.png';
      }

      // Ensure the image URL is properly formatted
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
        imageUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${imageUrl}`;
      }
      
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.original_price,
        category: product.category,
        imageUrl: imageUrl,
        featured: product.featured,
        isNew: product.is_new,
        onSale: product.on_sale,
        discount: product.discount,
        rating: product.rating || 0,
        createdAt: product.created_at,
        updatedAt: product.updated_at
      };
    });

    return transformedProducts;
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    throw error;
  }
};

// Function to fetch products by category
export const fetchProductsByCategory = async (categorySlug: string) => {
  try {
    console.log('----------------------------------------');
    console.log('Starting product fetch for category:', categorySlug);
    console.log('----------------------------------------');
    
    // First, let's get all products to see what categories exist
    const { data: allProducts, error: allProductsError } = await adminSupabase
      .from('products')
      .select('*');

    if (allProductsError) {
      console.error('Error fetching all products:', allProductsError);
      throw allProductsError;
    }

    // Log all products and their categories in a table format
    console.log('\nAll products in database:');
    console.table(allProducts.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      created_at: p.created_at
    })));
    
    // Log all unique categories with counts
    const categoryCount = allProducts.reduce((acc: Record<string, number>, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
    console.log('\nCategory distribution:');
    console.table(Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
      normalized: category.toLowerCase().replace(/[-_\s]+/g, '-')
    })));

    // Try exact match first
    console.log('\nAttempting exact match for:', categorySlug);
    const { data: exactData, error: exactError } = await adminSupabase
      .from('products')
      .select('*')
      .eq('category', categorySlug)
      .order('created_at', { ascending: false });

    if (exactError) {
      console.error('Error in exact match search:', exactError);
      throw exactError;
    }

    console.log('Exact match results:', exactData?.length || 0, 'products found');
    if (exactData && exactData.length > 0) {
      console.log('Products found with exact match:');
      console.table(exactData.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category
      })));
      return exactData.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        originalPrice: item.original_price,
        category: item.category,
        imageUrl: item.image_url,
        featured: item.featured,
        isNew: item.is_new,
        onSale: item.on_sale,
        discount: item.discount,
        rating: item.rating,
        created_at: item.created_at
      }));
    }

    // If no exact match, try alternative category formats
    let alternativeSlug = categorySlug;
    if (categorySlug === 'mens-watches') {
      alternativeSlug = 'mens-watch';
    } else if (categorySlug === 'mens-watch') {
      alternativeSlug = 'mens-watches';
    }

    console.log('\nTrying alternative slug:', alternativeSlug);
    const { data: altData, error: altError } = await adminSupabase
      .from('products')
      .select('*')
      .eq('category', alternativeSlug)
      .order('created_at', { ascending: false });

    if (altError) {
      console.error('Error in alternative search:', altError);
      throw altError;
    }

    console.log('Alternative match results:', altData?.length || 0, 'products found');
    if (altData && altData.length > 0) {
      console.log('Products found with alternative category:');
      console.table(altData.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category
      })));
      return altData.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        originalPrice: item.original_price,
        category: item.category,
        imageUrl: item.image_url,
        featured: item.featured,
        isNew: item.is_new,
        onSale: item.on_sale,
        discount: item.discount,
        rating: item.rating,
        created_at: item.created_at
      }));
    }

    // If still no results, try flexible search
    console.log('\nTrying flexible search for:', categorySlug);
    const searchPattern = categorySlug.replace(/-/g, '%');
    console.log('Using search pattern:', searchPattern);
    
    const { data: flexData, error: flexError } = await adminSupabase
        .from('products')
        .select('*')
      .ilike('category', `%${searchPattern}%`)
        .order('created_at', { ascending: false });
        
    if (flexError) {
      console.error('Error in flexible search:', flexError);
      throw flexError;
    }

    console.log('Flexible search results:', flexData?.length || 0, 'products found');
    if (flexData && flexData.length > 0) {
      console.log('Products found with flexible search:');
      console.table(flexData.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        match_score: p.category.toLowerCase().includes(categorySlug.toLowerCase()) ? 'direct' : 'partial'
      })));
    }

    console.log('----------------------------------------');
    console.log('Search process completed');
    console.log('----------------------------------------');
    
    return (flexData || []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      originalPrice: item.original_price,
      category: item.category,
      imageUrl: item.image_url,
      featured: item.featured,
      isNew: item.is_new,
      onSale: item.on_sale,
      discount: item.discount,
      rating: item.rating,
      created_at: item.created_at
    }));

  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

// Function to fetch featured products
export const fetchFeaturedProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw new Error('Failed to fetch featured products');
  }
};

// Function to fetch new products
export const fetchNewProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_new', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching new products:', error);
    throw new Error('Failed to fetch new products');
  }
};

// Function to fetch on-sale products
export const fetchOnSaleProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('on_sale', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching on-sale products:', error);
    throw new Error('Failed to fetch on-sale products');
  }
};

// Function to fix product categories
export const fixProductCategories = async () => {
  try {
    // First get all products
    const { data: products, error: fetchError } = await adminSupabase
      .from('products')
      .select('*');

    if (fetchError) {
      console.error('Error fetching products:', fetchError);
      return;
    }

    console.log('Current products:', products);

    // Update each product's category to the correct format
    for (const product of products) {
      const currentCategory = product.category;
      let newCategory = currentCategory;

      // Convert MENS WATCH to mens-watch format
      if (currentCategory === 'MENS WATCH') {
        newCategory = 'mens-watch';
      }
      // Convert LADIES WATCH to ladies-watch format
      else if (currentCategory === 'LADIES WATCH') {
        newCategory = 'ladies-watch';
      }
      // Convert other formats as needed
      else if (currentCategory === 'WALLET') {
        newCategory = 'wallet';
      }
      else if (currentCategory === 'SUNGLASSES') {
        newCategory = 'sunglasses';
      }
      // If it's not already in slug format, convert it
      else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(currentCategory)) {
        newCategory = currentCategory.toLowerCase().replace(/\s+/g, '-');
      }

      // Only update if the category format changed
      if (newCategory !== currentCategory) {
        console.log(`Updating category for ${product.name}: ${currentCategory} -> ${newCategory}`);
        const { error: updateError } = await adminSupabase
          .from('products')
          .update({ category: newCategory })
          .eq('id', product.id);

        if (updateError) {
          console.error(`Error updating category for product ${product.id}:`, updateError);
        }
      }
    }

    console.log('Category update complete');
  } catch (error) {
    console.error('Error fixing categories:', error);
  }
};

// Function to fetch a single product by ID
export const fetchProductById = async (id: string): Promise<Product> => {
  try {
    console.log('Fetching product by ID:', id);
    
    // Fetch product with its images
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (
          id,
          image_url,
          is_primary
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      throw new Error(`Failed to fetch product: ${error.message}`);
    }

    if (!data) {
      console.error('Product not found with ID:', id);
      throw new Error('Product not found');
    }

    console.log('Raw product data:', data);

    // Transform the response to match the Product interface
    const product: Product = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      originalPrice: data.original_price,
      category: data.category,
      imageUrl: data.product_images?.find((img: any) => img.is_primary)?.image_url || data.image_url,
      featured: data.featured,
      isNew: data.is_new,
      onSale: data.on_sale,
      discount: data.discount,
      rating: data.rating,
      created_at: data.created_at,
      images: data.product_images?.map((img: any) => ({
        id: img.id,
        productId: data.id,
        imageUrl: img.image_url,
        isPrimary: img.is_primary
      }))
    };

    console.log('Transformed product:', product);
    return product;
  } catch (error) {
    console.error('Error in fetchProductById:', error);
    throw error;
  }
};

// Function to fix all product categories
export const fixAllProductCategories = async () => {
  try {
    console.log('Starting to fix all product categories...');
    
    // First get all products
    const { data: products, error: fetchError } = await adminSupabase
      .from('products')
      .select('*');

    if (fetchError) {
      console.error('Error fetching products:', fetchError);
      return;
    }

    console.log('Found products:', products);

    // Update each product's category
    for (const product of products) {
      const currentCategory = product.category;
      let newCategory = currentCategory;

      // Special handling for mens-watch/mens-watches
      if (currentCategory === 'mens-watch') {
        newCategory = 'mens-watches';
      }
      // Handle other categories
      else {
        newCategory = currentCategory?.toLowerCase()
          .replace(/\s+/g, '-')     // Replace spaces with hyphens
          .replace(/\'s/g, 's')     // Remove apostrophes
          .replace(/[^a-z0-9-]/g, '') // Remove any other special characters
          || 'uncategorized';
      }

      // Only update if the category format changed
      if (newCategory !== currentCategory) {
        console.log(`Updating category for product ${product.id}: ${currentCategory} -> ${newCategory}`);
        
        const { error: updateError } = await adminSupabase
          .from('products')
          .update({ category: newCategory })
          .eq('id', product.id);

        if (updateError) {
          console.error(`Error updating category for product ${product.id}:`, updateError);
        }
      }
    }

    console.log('Finished fixing product categories');
  } catch (error) {
    console.error('Error fixing product categories:', error);
  }
}; 