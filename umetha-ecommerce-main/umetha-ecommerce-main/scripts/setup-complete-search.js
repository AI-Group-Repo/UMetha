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

async function setupCompleteSearch() {
  try {
    console.log('🚀 Setting up complete search functionality with categories...\n');
    
    // Step 1: Create categories table and insert categories
    console.log('1️⃣ Creating categories table and inserting categories...');
    
    const createCategoriesSQL = `
      -- Create categories table
      CREATE TABLE IF NOT EXISTS public.categories (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        image TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );

      -- Enable RLS on categories table
      ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

      -- Create RLS policy for categories (allow public read access)
      CREATE POLICY "Categories are viewable by everyone" 
        ON public.categories 
        FOR SELECT 
        USING (true);

      -- Insert sample categories
      INSERT INTO public.categories (id, name, slug, description) VALUES
        ('cat-fashion', 'Fashion', 'fashion', 'Clothing, shoes, and accessories'),
        ('cat-electronics', 'Electronics', 'electronics', 'Electronic devices and gadgets'),
        ('cat-beauty', 'Beauty', 'beauty', 'Beauty and personal care products'),
        ('cat-home', 'Home & Living', 'home-living', 'Home decor and living essentials'),
        ('cat-sports', 'Sports', 'sports', 'Sports and fitness equipment'),
        ('cat-baby', 'Baby', 'baby', 'Baby products and essentials'),
        ('cat-appliances', 'Appliances', 'appliances', 'Home appliances and electronics'),
        ('cat-books', 'Books', 'books', 'Books and educational materials'),
        ('cat-toys', 'Toys', 'toys', 'Toys and games for all ages'),
        ('cat-automotive', 'Automotive', 'automotive', 'Car parts and accessories')
      ON CONFLICT (id) DO NOTHING;

      -- Add category_id column to products table if it doesn't exist
      ALTER TABLE public.products 
      ADD COLUMN IF NOT EXISTS category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL;

      -- Create index for better performance
      CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
      CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
    `;
    
    // Execute the SQL
    const { error: sqlError } = await supabase.rpc('exec_sql', { sql: createCategoriesSQL });
    
    if (sqlError) {
      console.error('❌ Error creating categories table:', sqlError);
      console.log('\nPlease run this SQL manually in your Supabase SQL editor:');
      console.log(createCategoriesSQL);
      return;
    }
    
    console.log('✅ Categories table created and populated');
    
    // Step 2: Check existing products
    console.log('\n2️⃣ Checking existing products...');
    
    const { data: existingProducts, error: productsError } = await supabase
      .from('products')
      .select('products_id, name, description, category_id')
      .limit(20);
    
    if (productsError) {
      console.error('Error fetching products:', productsError);
      return;
    }
    
    if (!existingProducts || existingProducts.length === 0) {
      console.log('No products found. Adding sample products...');
      
      // Add sample products with categories
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
            console.error(`❌ Error adding ${product.name}:`, error.message);
            errorCount++;
          } else {
            console.log(`✅ Added: ${product.name} ($${product.price})`);
            successCount++;
          }
        } catch (err) {
          console.error(`❌ Error adding ${product.name}:`, err.message);
          errorCount++;
        }
      }
      
      console.log(`\n📊 Product Addition Results:`);
      console.log(`✅ Successfully added: ${successCount} products`);
      console.log(`❌ Errors: ${errorCount} products`);
      
    } else {
      console.log(`Found ${existingProducts.length} existing products`);
      
      // Update existing products with categories if they don't have them
      const productsWithoutCategories = existingProducts.filter(p => !p.category_id);
      
      if (productsWithoutCategories.length > 0) {
        console.log(`Updating ${productsWithoutCategories.length} products with categories...`);
        
        let updatedCount = 0;
        
        for (const product of productsWithoutCategories) {
          let categoryId = null;
          
          // Determine category based on product name and description
          const name = product.name.toLowerCase();
          const description = (product.description || '').toLowerCase();
          
          if (name.includes('shirt') || name.includes('jeans') || name.includes('shoes') || name.includes('fashion')) {
            categoryId = 'cat-fashion';
          } else if (name.includes('phone') || name.includes('laptop') || name.includes('headphones') || name.includes('electronic')) {
            categoryId = 'cat-electronics';
          } else if (name.includes('mug') || name.includes('coffee') || name.includes('home') || name.includes('decor')) {
            categoryId = 'cat-home';
          } else if (name.includes('beauty') || name.includes('makeup') || name.includes('cosmetic')) {
            categoryId = 'cat-beauty';
          } else if (name.includes('sport') || name.includes('fitness') || name.includes('gym')) {
            categoryId = 'cat-sports';
          } else if (name.includes('appliance') || name.includes('refrigerator') || name.includes('microwave')) {
            categoryId = 'cat-appliances';
          } else {
            categoryId = 'cat-electronics'; // Default category
          }
          
          // Update the product with the category
          const { error: updateError } = await supabase
            .from('products')
            .update({ category_id: categoryId })
            .eq('products_id', product.products_id);
          
          if (updateError) {
            console.error(`❌ Error updating ${product.name}:`, updateError.message);
          } else {
            console.log(`✅ Updated: ${product.name} → ${categoryId}`);
            updatedCount++;
          }
        }
        
        console.log(`\n📊 Update Results:`);
        console.log(`✅ Successfully updated: ${updatedCount} products`);
        console.log(`❌ Errors: ${productsWithoutCategories.length - updatedCount} products`);
      } else {
        console.log('All products already have categories assigned.');
      }
    }
    
    // Step 3: Test the search functionality
    console.log('\n3️⃣ Testing search functionality...');
    
    // Test text search
    console.log('\n🔍 Testing text search for "shirt":');
    const { data: shirtResults, error: shirtError } = await supabase
      .from('products')
      .select('*')
      .or('name.ilike.%shirt%,description.ilike.%shirt%');
    
    if (shirtError) {
      console.error('❌ Error searching for shirt:', shirtError);
    } else {
      console.log(`✅ Found ${shirtResults.length} results for "shirt"`);
      shirtResults.forEach(product => {
        console.log(`  - ${product.name} ($${product.price})`);
      });
    }
    
    // Test category search
    console.log('\n🔍 Testing category search for "Fashion":');
    const { data: fashionResults, error: fashionError } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', 'cat-fashion')
      .limit(5);
    
    if (fashionError) {
      console.error('❌ Error searching fashion category:', fashionError);
    } else {
      console.log(`✅ Found ${fashionResults.length} products in Fashion category:`);
      fashionResults.forEach(product => {
        console.log(`  - ${product.name} ($${product.price})`);
      });
    }
    
    // Test electronics category
    console.log('\n🔍 Testing category search for "Electronics":');
    const { data: electronicsResults, error: electronicsError } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', 'cat-electronics')
      .limit(5);
    
    if (electronicsError) {
      console.error('❌ Error searching electronics category:', electronicsError);
    } else {
      console.log(`✅ Found ${electronicsResults.length} products in Electronics category:`);
      electronicsResults.forEach(product => {
        console.log(`  - ${product.name} ($${product.price})`);
      });
    }
    
    // Step 4: Show categories
    console.log('\n4️⃣ Available categories:');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (categoriesError) {
      console.error('❌ Error fetching categories:', categoriesError);
    } else {
      console.log(`✅ Found ${categories.length} categories:`);
      categories.forEach(cat => {
        console.log(`  - ${cat.name} (${cat.slug})`);
      });
    }
    
    console.log('\n🎉 Complete search setup finished!');
    console.log('\n📋 What you can now do:');
    console.log('✅ Search for products by name or description');
    console.log('✅ Filter products by category using the dropdown');
    console.log('✅ Search within specific categories');
    console.log('✅ Use fuzzy matching for partial searches');
    console.log('✅ Sort and filter by price range');
    
    console.log('\n🌐 Test in your browser:');
    console.log('- Go to /search?q=shirt');
    console.log('- Go to /search?q=shoes');
    console.log('- Go to /search?q=laptop');
    console.log('- Use the category dropdown to filter results');
    
  } catch (error) {
    console.error('❌ Error setting up complete search:', error);
  }
}

setupCompleteSearch();
