const { createClient } = require('@supabase/supabase-js');

// Use the same credentials as in the codebase
const supabaseUrl = 'https://zgdwrrsqjdlxfwjqamxk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZHdycnNxamRseGZ3anFhbXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MzkzNDUsImV4cCI6MjA3NjAxNTM0NX0._4EEFOEIJ6vZMc0aGbgXfmmVi-WedTX6HpTDW4dLeOs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock CJ Dropshipping API functions for demo
async function getCJAccessToken() {
  console.log("🔑 Getting CJ access token...");
  // In real implementation, this would call the actual CJ API
  return "mock_token_123";
}

async function fetchCJProducts(keyword, pageNum = 1, pageSize = 20) {
  console.log(`📦 Fetching ${pageSize} products for keyword: "${keyword}"`);
  
  // Mock trending products data
  const mockProducts = [
    {
      id: "trending_001",
      name: "Trending Wireless Earbuds",
      description: "Latest trending wireless earbuds with noise cancellation",
      price: 49.99,
      Url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      Category: "Electronics",
      product_link: "https://cjdropshipping.com/product/trending_001"
    },
    {
      id: "trending_002", 
      name: "Viral Phone Case",
      description: "Trending phone case with unique design",
      price: 19.99,
      Url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
      Category: "Electronics",
      product_link: "https://cjdropshipping.com/product/trending_002"
    },
    {
      id: "trending_003",
      name: "Fashionable Sunglasses",
      description: "Trending sunglasses with UV protection",
      price: 29.99,
      Url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400",
      Category: "Fashion",
      product_link: "https://cjdropshipping.com/product/trending_003"
    }
  ];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockProducts.slice(0, pageSize);
}

async function deleteOldCJProducts() {
  console.log("🗑️ Deleting old CJ Dropshipping products...");
  
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('is_dropshipping', true)
      .not('cj_product_id', 'is', null);

    if (error) {
      console.error("❌ Error deleting old products:", error);
      return false;
    }

    console.log("✅ Old CJ products deleted successfully");
    return true;
  } catch (error) {
    console.error("❌ Error in deleteOldCJProducts:", error.message);
    return false;
  }
}

async function saveCJProductsToSupabase(products) {
  if (!products.length) {
    console.log("⚠️ No products to save.");
    return false;
  }

  try {
    const formattedProducts = products.map((product) => ({
      name: product.name,
      description: product.description || "",
      price: product.price,
      sku: product.id,
      images: [product.Url],
      category_id: product.Category?.toLowerCase() || "general",
      stock: 50, // Mock stock
      cj_product_id: product.id,
      cj_product_link: product.product_link,
      cj_category: product.Category || "General",
      supplier: "CJ Dropshipping",
      supplier_product_id: product.id,
      is_dropshipping: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from("products")
      .upsert(formattedProducts, { 
        onConflict: "cj_product_id",
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return false;
    } else {
      console.log(`✅ ${formattedProducts.length} CJ products synced to Supabase!`);
      return true;
    }
  } catch (error) {
    console.error("❌ Error saving products to Supabase:", error);
    return false;
  }
}

async function syncTrendingProducts(limit = 50) {
  const errors = [];
  let totalProducts = 0;

  console.log("\n==============================");
  console.log(`🕛 Starting CJ trending product sync at ${new Date().toLocaleString()}`);
  console.log("==============================");

  try {
    // Step 1: Delete old products
    const deleteSuccess = await deleteOldCJProducts();
    if (!deleteSuccess) {
      errors.push("Failed to delete old products");
    }

    // Step 2: Fetch trending products
    const products = await fetchCJProducts("trending", 1, limit);
    console.log(`🛍️ ${products.length} trending products fetched.`);

    // Step 3: Save new products
    if (products.length > 0) {
      const saveSuccess = await saveCJProductsToSupabase(products);
      if (saveSuccess) {
        totalProducts = products.length;
        console.log(`✅ Synced ${totalProducts} trending products`);
      } else {
        errors.push("Failed to save trending products");
      }
    } else {
      console.log("⚠️ No trending products to sync");
    }

    const success = errors.length === 0;
    console.log("✅ Trending product sync completed successfully!");
    console.log("==============================\n");

    return {
      success,
      totalProducts,
      errors,
    };
  } catch (error) {
    const errorMsg = `Error in syncTrendingProducts: ${error.message}`;
    console.error(`❌ ${errorMsg}`);
    errors.push(errorMsg);

    return {
      success: false,
      totalProducts: 0,
      errors,
    };
  }
}

// Main execution
async function main() {
  console.log("🚀 CJ Dropshipping Trending Products Sync Demo");
  console.log("This demonstrates the complete sync process:\n");
  console.log("1. Delete old CJ products");
  console.log("2. Fetch trending products from CJ");
  console.log("3. Save new trending products to Supabase");
  console.log("4. Products become available in search results\n");

  try {
    const result = await syncTrendingProducts(3); // Sync 3 products for demo
    
    console.log("\n📊 Final Results:");
    console.log(`✅ Success: ${result.success}`);
    console.log(`📦 Products Synced: ${result.totalProducts}`);
    console.log(`❌ Errors: ${result.errors.length}`);
    
    if (result.errors.length > 0) {
      console.log("\nError Details:");
      result.errors.forEach(error => console.log(`  - ${error}`));
    }

    console.log("\n🎉 Demo completed! Check your Supabase database for the new products.");
    console.log("💡 In production, this would run automatically every midnight via cron job.");

  } catch (error) {
    console.error("❌ Demo failed:", error.message);
  }
}

// Run the demo
main();

