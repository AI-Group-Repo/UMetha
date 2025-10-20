const { createClient } = require('@supabase/supabase-js');

// Use the same credentials as in the codebase
const supabaseUrl = 'https://zgdwrrsqjdlxfwjqamxk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZHdycnNxamRseGZ3anFhbXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MzkzNDUsImV4cCI6MjA3NjAxNTM0NX0._4EEFOEIJ6vZMc0aGbgXfmmVi-WedTX6HpTDW4dLeOs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addProductsDirect() {
  try {
    console.log('Attempting to add products directly to Supabase...\n');
    
    // Sample products with proper schema
    const products = [
      {
        name: 'Classic White T-Shirt',
        description: 'Comfortable cotton t-shirt perfect for everyday wear',
        price: 29.99,
        sku: 'TSH-001',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
        category_id: 'fashion',
        stock: 50
      },
      {
        name: 'Blue Denim Jeans',
        description: 'Classic denim jeans with a comfortable fit',
        price: 79.99,
        sku: 'JNS-001',
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'],
        category_id: 'fashion',
        stock: 30
      },
      {
        name: 'Running Shoes',
        description: 'High-performance running shoes for athletes',
        price: 129.99,
        sku: 'SHO-001',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
        category_id: 'sports',
        stock: 25
      }
    ];
    
    console.log(`Attempting to add ${products.length} products...`);
    
    for (const product of products) {
      try {
        console.log(`Adding: ${product.name}`);
        
        const { data, error } = await supabase
          .from('products')
          .insert([product])
          .select();
        
        if (error) {
          console.error(`❌ Error adding ${product.name}:`, error.message);
        } else {
          console.log(`✅ Successfully added: ${product.name}`);
        }
      } catch (err) {
        console.error(`❌ Exception adding ${product.name}:`, err.message);
      }
    }
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

addProductsDirect();
