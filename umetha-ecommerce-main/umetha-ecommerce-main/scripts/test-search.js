const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testSearch() {
  try {
    console.log('Testing search functionality...');
    
    // Test 1: Search for "t-shirt"
    console.log('\n1. Searching for "t-shirt"...');
    const { data: tshirtResults, error: tshirtError } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(
          name,
          slug
        )
      `)
      .or('name.ilike.%t-shirt%,description.ilike.%t-shirt%');
    
    if (tshirtError) {
      console.error('Error searching for t-shirt:', tshirtError);
    } else {
      console.log(`Found ${tshirtResults.length} results for "t-shirt"`);
      tshirtResults.forEach(product => {
        console.log(`- ${product.name} ($${product.price}) - ${product.categories.name}`);
      });
    }
    
    // Test 2: Search for "shoes"
    console.log('\n2. Searching for "shoes"...');
    const { data: shoesResults, error: shoesError } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(
          name,
          slug
        )
      `)
      .or('name.ilike.%shoes%,description.ilike.%shoes%');
    
    if (shoesError) {
      console.error('Error searching for shoes:', shoesError);
    } else {
      console.log(`Found ${shoesResults.length} results for "shoes"`);
      shoesResults.forEach(product => {
        console.log(`- ${product.name} ($${product.price}) - ${product.categories.name}`);
      });
    }
    
    // Test 3: Search for "electronics"
    console.log('\n3. Searching for "electronics"...');
    const { data: electronicsResults, error: electronicsError } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(
          name,
          slug
        )
      `)
      .or('name.ilike.%electronics%,description.ilike.%electronics%,categories.name.ilike.%electronics%');
    
    if (electronicsError) {
      console.error('Error searching for electronics:', electronicsError);
    } else {
      console.log(`Found ${electronicsResults.length} results for "electronics"`);
      electronicsResults.forEach(product => {
        console.log(`- ${product.name} ($${product.price}) - ${product.categories.name}`);
      });
    }
    
    // Test 4: Get all products to see what's available
    console.log('\n4. All available products:');
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(
          name,
          slug
        )
      `)
      .limit(10);
    
    if (allError) {
      console.error('Error fetching all products:', allError);
    } else {
      console.log(`Found ${allProducts.length} total products`);
      allProducts.forEach(product => {
        console.log(`- ${product.name} ($${product.price}) - ${product.categories.name}`);
      });
    }
    
  } catch (error) {
    console.error('Error testing search:', error);
  }
}

testSearch();
