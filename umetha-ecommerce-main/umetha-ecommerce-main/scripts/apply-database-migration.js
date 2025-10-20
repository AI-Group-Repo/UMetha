const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

async function applyMigration() {
  try {
    console.log('Applying database migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'migrations', 'create_products_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('Migration failed:', error);
      return;
    }
    
    console.log('Migration applied successfully!');
    
    // Test the migration by querying products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (productsError) {
      console.error('Error testing products table:', productsError);
      return;
    }
    
    console.log(`Found ${products.length} products in the database`);
    products.forEach(product => {
      console.log(`- ${product.name} ($${product.price})`);
    });
    
    // Test categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(5);
    
    if (categoriesError) {
      console.error('Error testing categories table:', categoriesError);
      return;
    }
    
    console.log(`Found ${categories.length} categories in the database`);
    categories.forEach(category => {
      console.log(`- ${category.name} (${category.slug})`);
    });
    
  } catch (error) {
    console.error('Error applying migration:', error);
  }
}

// Check if exec_sql function exists, if not create it
async function createExecSqlFunction() {
  const { error } = await supabase.rpc('exec_sql', { sql: 'SELECT 1' });
  
  if (error && error.message.includes('function exec_sql')) {
    console.log('Creating exec_sql function...');
    
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql text)
      RETURNS text
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql;
        RETURN 'OK';
      END;
      $$;
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createFunctionSQL });
    
    if (createError) {
      console.error('Error creating exec_sql function:', createError);
      return false;
    }
    
    console.log('exec_sql function created successfully');
    return true;
  }
  
  return true;
}

async function main() {
  console.log('Starting database migration...');
  
  // First, try to create the exec_sql function if it doesn't exist
  const functionCreated = await createExecSqlFunction();
  if (!functionCreated) {
    console.log('Could not create exec_sql function. Please run the migration manually in Supabase SQL editor.');
    console.log('Copy and paste the contents of migrations/create_products_schema.sql');
    return;
  }
  
  // Apply the migration
  await applyMigration();
}

main().catch(console.error);
