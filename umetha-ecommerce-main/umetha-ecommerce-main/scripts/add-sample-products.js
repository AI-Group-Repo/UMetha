const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addSampleProducts() {
  try {
    console.log('Adding sample products to your database...\n');
    
    // First check if products already exist
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('products_id, name')
      .limit(5);
    
    if (checkError) {
      console.error('Error checking existing products:', checkError);
      return;
    }
    
    if (existingProducts && existingProducts.length > 0) {
      console.log(`Found ${existingProducts.length} existing products:`);
      existingProducts.forEach(product => {
        console.log(`- ${product.name} (ID: ${product.products_id})`);
      });
      console.log('\nProducts already exist. Skipping addition.');
      return;
    }
    
    // Sample products that match your database schema with categories
    const sampleProducts = [
      {
        name: 'Classic White T-Shirt',
        description: 'Comfortable cotton t-shirt perfect for everyday wear. Made from 100% cotton for maximum comfort.',
        price: 19.99,
        sku: 'TSH-001',
        url: '/tshirt1.jpg',
        category_id: 'cat-fashion'
      },
      {
        name: 'Blue Denim Jeans',
        description: 'Classic denim jeans with a comfortable fit. Perfect for casual wear and everyday activities.',
        price: 49.99,
        sku: 'JNS-001',
        url: '/jeans1.jpg',
        category_id: 'cat-fashion'
      },
      {
        name: 'Running Shoes',
        description: 'Lightweight running shoes designed for athletes. Features advanced cushioning and breathable material.',
        price: 89.99,
        sku: 'SHO-001',
        url: '/shoes1.jpg',
        category_id: 'cat-fashion'
      },
      {
        name: 'Smartphone',
        description: 'Latest smartphone with advanced features, high-resolution camera, and long-lasting battery.',
        price: 699.99,
        sku: 'PHN-001',
        url: '/phone1.jpg',
        category_id: 'cat-electronics'
      },
      {
        name: 'Laptop Computer',
        description: 'High-performance laptop perfect for work and play. Features fast processor and large storage.',
        price: 1299.99,
        sku: 'LPT-001',
        url: '/laptop1.jpg',
        category_id: 'cat-electronics'
      },
      {
        name: 'Wireless Headphones',
        description: 'Premium wireless headphones with noise cancellation and crystal clear sound quality.',
        price: 149.99,
        sku: 'AUD-001',
        url: '/headphones1.jpg',
        category_id: 'cat-electronics'
      },
      {
        name: 'Coffee Mug',
        description: 'Ceramic coffee mug perfect for your morning coffee. Holds 12oz and features a comfortable handle.',
        price: 12.99,
        sku: 'MUG-001',
        url: '/mug1.jpg',
        category_id: 'cat-home'
      },
      {
        name: 'Backpack',
        description: 'Durable backpack with multiple compartments. Perfect for school, work, or travel.',
        price: 39.99,
        sku: 'BAG-001',
        url: '/backpack1.jpg',
        category_id: 'cat-fashion'
      },
      {
        name: 'Lipstick Set',
        description: 'Premium lipstick collection in various shades. Long-lasting and moisturizing formula.',
        price: 29.99,
        sku: 'LIP-001',
        url: '/lipstick1.jpg',
        category_id: 'cat-beauty'
      },
      {
        name: 'Yoga Mat',
        description: 'Non-slip yoga mat perfect for fitness enthusiasts. Eco-friendly and easy to clean.',
        price: 39.99,
        sku: 'YGM-001',
        url: '/yogamat1.jpg',
        category_id: 'cat-sports'
      }
    ];
    
    console.log(`Adding ${sampleProducts.length} sample products...`);
    
    // Insert products one by one to handle any errors
    let successCount = 0;
    let errorCount = 0;
    
    for (const product of sampleProducts) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert([{
            name: product.name,
            description: product.description,
            price: product.price,
            sku: product.sku,
            url: product.url,
            category_id: product.category_id,
            date_created: new Date().toISOString()
          }])
          .select();
        
        if (error) {
          console.error(`Error adding ${product.name}:`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Added: ${product.name} ($${product.price})`);
          successCount++;
        }
      } catch (err) {
        console.error(`Error adding ${product.name}:`, err.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Results:`);
    console.log(`✅ Successfully added: ${successCount} products`);
    console.log(`❌ Errors: ${errorCount} products`);
    
    if (successCount > 0) {
      console.log('\n🎉 Sample products added successfully!');
      console.log('You can now test the search functionality in your browser.');
      console.log('Try searching for: "shirt", "shoes", "laptop", "phone", etc.');
    }
    
  } catch (error) {
    console.error('Error adding sample products:', error);
  }
}

addSampleProducts();
