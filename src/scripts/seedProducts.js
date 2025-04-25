import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { products } from '../data/products.js';

// Initialize Supabase client
const supabaseUrl = 'https://hjbynsyoyipnwovkytrm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqYnluc3lveWlwbndvdmt5dHJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg3NzE5NzAsImV4cCI6MjAyNDM0Nzk3MH0.MRnwklOTLLLHgo7BJzbDc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const seedProducts = async () => {
  try {
    // Transform products to match database structure
    const dbProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      original_price: product.originalPrice,
      category: product.category,
      image_url: product.imageUrl,
      featured: product.featured || false,
      is_new: product.isNew || false,
      on_sale: product.onSale || false,
      discount: product.discount || 0,
      rating: product.rating || 0,
      is_active: true,
      created_at: new Date().toISOString()
    }));

    // Insert products into Supabase
    const { data, error } = await supabase
      .from('products')
      .upsert(dbProducts, { onConflict: 'id' });

    if (error) {
      throw error;
    }

    console.log('Successfully seeded products:', data);
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

// Run the seeding function
seedProducts(); 