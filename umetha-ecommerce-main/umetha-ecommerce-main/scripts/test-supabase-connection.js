const { createClient } = require('@supabase/supabase-js');

// Use the same credentials as in the codebase
const supabaseUrl = 'https://zgdwrrsqjdlxfwjqamxk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZHdycnNxamRseGZ3anFhbXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MzkzNDUsImV4cCI6MjA3NjAxNTM0NX0._4EEFOEIJ6vZMc0aGbgXfmmVi-WedTX6HpTDW4dLeOs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...\n');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Connection error:', error);
      console.log('\nTrying to create a simple product...');
      
      // Try to insert a simple product
      const { data: insertData, error: insertError } = await supabase
        .from('products')
        .insert([{
          name: 'Test Product',
          description: 'A test product to verify database connection',
          price: 9.99,
          sku: 'TEST-001',
          images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
          category_id: 'test',
          stock: 1
        }])
        .select();
      
      if (insertError) {
        console.error('Insert error:', insertError);
      } else {
        console.log('✅ Successfully created test product:', insertData);
      }
    } else {
      console.log('✅ Connection successful!');
      console.log('Products found:', data);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testSupabaseConnection();
