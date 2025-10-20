const { createClient } = require('@supabase/supabase-js');

// Use the same credentials as in the codebase
const supabaseUrl = 'https://zgdwrrsqjdlxfwjqamxk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZHdycnNxamRseGZ3anFhbXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MzkzNDUsImV4cCI6MjA3NjAxNTM0NX0._4EEFOEIJ6vZMc0aGbgXfmmVi-WedTX6HpTDW4dLeOs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addProductsToSupabase() {
  try {
    console.log('Adding products to Supabase database...\n');
    
    // First check if products already exist
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('products_id, name, description, price, sku, images, category_id')
      .limit(5);
    
    if (checkError) {
      console.error('Error checking existing products:', checkError);
      return;
    }
    
    if (existingProducts && existingProducts.length > 0) {
      console.log(`Found ${existingProducts.length} existing products:`);
      existingProducts.forEach(product => {
        console.log(`- ${product.name} (ID: ${product.id})`);
      });
      console.log('\nProducts already exist in database.');
      return;
    }
    
    // Sample products that match the database schema
    const sampleProducts = [
      {
        name: 'Classic White T-Shirt',
        description: 'Comfortable cotton t-shirt perfect for everyday wear. Made from 100% cotton for maximum comfort.',
        price: 29.99,
        sku: 'TSH-001',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
        category_id: 'fashion',
        stock: 50
      },
      {
        name: 'Blue Denim Jeans',
        description: 'Classic denim jeans with a comfortable fit. Perfect for casual wear and everyday activities.',
        price: 79.99,
        sku: 'JNS-001',
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'],
        category_id: 'fashion',
        stock: 30
      },
      {
        name: 'Running Shoes',
        description: 'Lightweight running shoes designed for athletes. Features advanced cushioning and breathable material.',
        price: 129.99,
        sku: 'SHO-001',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
        category_id: 'sports',
        stock: 25
      },
      {
        name: 'Smartphone',
        description: 'Latest smartphone with advanced features, high-resolution camera, and long-lasting battery.',
        price: 699.99,
        sku: 'PHN-001',
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'],
        category_id: 'electronics',
        stock: 15
      },
      {
        name: 'Laptop Computer',
        description: 'High-performance laptop perfect for work and play. Features fast processor and large storage.',
        price: 1299.99,
        sku: 'LPT-001',
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'],
        category_id: 'electronics',
        stock: 10
      },
      {
        name: 'Wireless Headphones',
        description: 'Premium wireless headphones with noise cancellation and crystal clear sound quality.',
        price: 199.99,
        sku: 'AUD-001',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
        category_id: 'electronics',
        stock: 20
      },
      {
        name: 'Coffee Mug',
        description: 'Ceramic coffee mug perfect for your morning coffee. Holds 12oz and features a comfortable handle.',
        price: 12.99,
        sku: 'MUG-001',
        images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400'],
        category_id: 'home',
        stock: 100
      },
      {
        name: 'Backpack',
        description: 'Durable backpack with multiple compartments. Perfect for school, work, or travel.',
        price: 59.99,
        sku: 'BAG-001',
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'],
        category_id: 'fashion',
        stock: 40
      },
      {
        name: 'Lipstick Set',
        description: 'Premium lipstick collection in various shades. Long-lasting and moisturizing formula.',
        price: 29.99,
        sku: 'LIP-001',
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400'],
        category_id: 'beauty',
        stock: 60
      },
      {
        name: 'Yoga Mat',
        description: 'Non-slip yoga mat perfect for fitness enthusiasts. Eco-friendly and easy to clean.',
        price: 39.99,
        sku: 'YGM-001',
        images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'],
        category_id: 'sports',
        stock: 35
      }
    ];
    
    console.log(`Adding ${sampleProducts.length} products to Supabase...`);
    
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
            images: product.images,
            category_id: product.category_id,
            stock: product.stock
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
      console.log('\n🎉 Products added successfully to Supabase!');
      console.log('The search API will now display real products from the database.');
    }
    
  } catch (error) {
    console.error('Error adding products to Supabase:', error);
  }
}

addProductsToSupabase();
