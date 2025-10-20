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

async function testActualSearch() {
  try {
    console.log('Testing search with your actual database schema...\n');
    
    // First, let's see what products you have
    console.log('1. Checking what products exist in your database:');
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('*')
      .limit(10);
    
    if (allError) {
      console.error('Error fetching products:', allError);
      return;
    }
    
    console.log(`Found ${allProducts.length} products:`);
    allProducts.forEach(product => {
      console.log(`- ID: ${product.products_id}, Name: "${product.name}", Price: $${product.price}`);
      if (product.description) {
        console.log(`  Description: ${product.description.substring(0, 100)}...`);
      }
    });
    
    if (allProducts.length === 0) {
      console.log('\n❌ No products found in your database!');
      console.log('You need to add some products first. Here are some sample products you can add:');
      
      const sampleProducts = [
        {
          name: 'Classic White T-Shirt',
          description: 'Comfortable cotton t-shirt perfect for everyday wear',
          price: 19.99,
          sku: 'TSH-001'
        },
        {
          name: 'Blue Jeans',
          description: 'Classic denim jeans with a comfortable fit',
          price: 49.99,
          sku: 'JNS-001'
        },
        {
          name: 'Running Shoes',
          description: 'Lightweight running shoes for athletes',
          price: 89.99,
          sku: 'SHO-001'
        },
        {
          name: 'Smartphone',
          description: 'Latest smartphone with advanced features',
          price: 699.99,
          sku: 'PHN-001'
        },
        {
          name: 'Laptop',
          description: 'High-performance laptop for work and play',
          price: 1299.99,
          sku: 'LPT-001'
        }
      ];
      
      console.log('\nSample products to add:');
      sampleProducts.forEach(product => {
        console.log(`- ${product.name} ($${product.price}) - ${product.description}`);
      });
      
      console.log('\nTo add these products, run this SQL in your Supabase SQL editor:');
      console.log('INSERT INTO products (name, description, price, sku, date_created) VALUES');
      sampleProducts.forEach((product, index) => {
        const comma = index < sampleProducts.length - 1 ? ',' : ';';
        console.log(`  ('${product.name}', '${product.description}', ${product.price}, '${product.sku}', now())${comma}`);
      });
      
      return;
    }
    
    // Test search functionality
    console.log('\n2. Testing search functionality:');
    
    // Test search for "shirt" or "t-shirt"
    console.log('\nSearching for "shirt":');
    const { data: shirtResults, error: shirtError } = await supabase
      .from('products')
      .select('*')
      .or('name.ilike.%shirt%,description.ilike.%shirt%');
    
    if (shirtError) {
      console.error('Error searching for shirt:', shirtError);
    } else {
      console.log(`Found ${shirtResults.length} results for "shirt"`);
      shirtResults.forEach(product => {
        console.log(`- ${product.name} ($${product.price})`);
      });
    }
    
    // Test search for "shoes"
    console.log('\nSearching for "shoes":');
    const { data: shoesResults, error: shoesError } = await supabase
      .from('products')
      .select('*')
      .or('name.ilike.%shoes%,description.ilike.%shoes%');
    
    if (shoesError) {
      console.error('Error searching for shoes:', shoesError);
    } else {
      console.log(`Found ${shoesResults.length} results for "shoes"`);
      shoesResults.forEach(product => {
        console.log(`- ${product.name} ($${product.price})`);
      });
    }
    
    // Test search for any product name
    if (allProducts.length > 0) {
      const firstProductName = allProducts[0].name;
      const searchTerm = firstProductName.split(' ')[0]; // Use first word
      
      console.log(`\nSearching for "${searchTerm}":`);
      const { data: searchResults, error: searchError } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      
      if (searchError) {
        console.error(`Error searching for ${searchTerm}:`, searchError);
      } else {
        console.log(`Found ${searchResults.length} results for "${searchTerm}"`);
        searchResults.forEach(product => {
          console.log(`- ${product.name} ($${product.price})`);
        });
      }
    }
    
    console.log('\n✅ Search test completed!');
    console.log('\nIf you see results above, your search should work in the browser.');
    console.log('If you see 0 results, you need to add products to your database first.');
    
  } catch (error) {
    console.error('Error testing search:', error);
  }
}

testActualSearch();
