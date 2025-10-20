const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up CJ Dropshipping integration...\n');

// Create .env.local file with CJ API configuration
const envContent = `# CJ Dropshipping API Configuration
CJ_API_KEY=your_cj_api_key_here

# Supabase Configuration (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://zgdwrrsqjdlxfwjqamxk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZHdycnNxamRseGZ3anFhbXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MzkzNDUsImV4cCI6MjA3NjAxNTM0NX0._4EEFOEIJ6vZMc0aGbgXfmmVi-WedTX6HpTDW4dLeOs

# Database URL for Prisma (if needed)
DATABASE_URL=your_database_url_here
`;

const envPath = path.join(process.cwd(), '.env.local');

try {
  // Check if .env.local already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️ .env.local already exists. Please add the following variables manually:');
    console.log('\n' + envContent);
  } else {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local file');
  }

  console.log('\n📋 Next steps:');
  console.log('1. Get your CJ Dropshipping API key from: https://developers.cjdropshipping.com/');
  console.log('2. Replace "your_cj_api_key_here" in .env.local with your actual API key');
  console.log('3. Update your Supabase database schema to include CJ product fields');
  console.log('4. Test the connection by visiting: http://localhost:3000/cj-dashboard');
  console.log('5. Use the dashboard to sync products from CJ Dropshipping');

  console.log('\n🔧 Required Supabase schema updates:');
  console.log(`
-- Add these columns to your products table:
ALTER TABLE products ADD COLUMN IF NOT EXISTS cj_product_id TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS cj_product_link TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS cj_category TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS supplier TEXT DEFAULT 'Local';
ALTER TABLE products ADD COLUMN IF NOT EXISTS supplier_product_id TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_dropshipping BOOLEAN DEFAULT false;

-- Create unique index for CJ products
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_cj_product_id ON products(cj_product_id);
  `);

  console.log('\n🎯 Available API endpoints:');
  console.log('- GET /api/sync/cj-products?action=test - Test CJ connection');
  console.log('- GET /api/sync/cj-products?action=categories - Get CJ categories');
  console.log('- GET /api/sync/cj-products?keywords=fashion,electronics&limit=20 - Sync products');
  console.log('- POST /api/sync/scheduler?action=start - Start automatic sync');
  console.log('- POST /api/sync/scheduler?action=stop - Stop automatic sync');

  console.log('\n✨ Integration setup complete!');

} catch (error) {
  console.error('❌ Error setting up CJ integration:', error.message);
  console.log('\nPlease create .env.local manually with the following content:');
  console.log(envContent);
}

