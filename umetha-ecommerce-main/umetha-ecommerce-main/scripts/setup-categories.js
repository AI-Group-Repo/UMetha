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

async function setupCategories() {
  try {
    console.log('Setting up categories and updating products...\n');
    
    // First, create the categories table and insert categories
    console.log('1. Creating categories table and inserting categories...');
    
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
      console.error('Error creating categories table:', sqlError);
      console.log('\nPlease run this SQL manually in your Supabase SQL editor:');
      console.log(createCategoriesSQL);
      return;
    }
    
    console.log('✅ Categories table created and populated');
    
    // Check if categories were created
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(10);
    
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      return;
    }
    
    console.log(`✅ Found ${categories.length} categories:`);
    categories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.slug})`);
    });
    
    // Now update existing products with categories
    console.log('\n2. Updating existing products with categories...');
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('products_id, name, description')
      .limit(20);
    
    if (productsError) {
      console.error('Error fetching products:', productsError);
      return;
    }
    
    if (!products || products.length === 0) {
      console.log('No products found to update. Please add some products first.');
      return;
    }
    
    console.log(`Found ${products.length} products to update:`);
    
    let updatedCount = 0;
    
    for (const product of products) {
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
        console.error(`Error updating product ${product.name}:`, updateError.message);
      } else {
        console.log(`✅ Updated: ${product.name} → ${categoryId}`);
        updatedCount++;
      }
    }
    
    console.log(`\n📊 Results:`);
    console.log(`✅ Successfully updated: ${updatedCount} products`);
    console.log(`❌ Errors: ${products.length - updatedCount} products`);
    
    // Test the category search
    console.log('\n3. Testing category search...');
    
    const { data: fashionProducts, error: fashionError } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', 'cat-fashion')
      .limit(5);
    
    if (fashionError) {
      console.error('Error testing fashion category:', fashionError);
    } else {
      console.log(`Found ${fashionProducts.length} products in Fashion category:`);
      fashionProducts.forEach(product => {
        console.log(`- ${product.name} ($${product.price})`);
      });
    }
    
    console.log('\n🎉 Category setup completed!');
    console.log('You can now use the category dropdown in your search interface.');
    
  } catch (error) {
    console.error('Error setting up categories:', error);
  }
}

setupCategories();
