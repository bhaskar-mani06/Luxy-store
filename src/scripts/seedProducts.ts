import { supabase } from '../lib/supabase';
import { products } from '../data/products';

const seedProducts = async () => {
  try {
    console.log('Starting to seed products...');

    // Transform products to match database structure
    const dbProducts = products.map(product => ({
      name: product.name,
      description: product.description,
      price: product.price,
      original_price: product.originalPrice,
      category: product.category.toLowerCase().replace(/\s+/g, '-'),
      image_url: product.imageUrl,
      featured: product.featured || false,
      is_new: product.isNew || false,
      on_sale: product.onSale || false,
      discount: product.discount || 0,
      rating: 0
    }));

    // Insert products into Supabase
    const { data, error } = await supabase
      .from('products')
      .upsert(dbProducts)
      .select();

    if (error) {
      console.error('Error seeding products:', error);
      throw error;
    }

    console.log('Successfully seeded products:', data);
    return data;
  } catch (error) {
    console.error('Error in seedProducts:', error);
    throw error;
  }
};

// Execute the seeding
seedProducts()
  .then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  }); 