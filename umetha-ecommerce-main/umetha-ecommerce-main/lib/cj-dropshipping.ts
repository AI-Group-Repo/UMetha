import axios from "axios";
import { supabase } from "./supabase";

// CJ Dropshipping API configuration
const CJ_BASE_URL = "https://developers.cjdropshipping.com/api2.0/v1";
const CJ_API_KEY = process.env.CJ_API_KEY;

// Cache for CJ token
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export interface CJProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  Url: string;
  Category: string;
  product_link: string;
  sku?: string;
  stock?: number;
  variants?: any[];
  images?: string[];
}

export interface CJApiResponse {
  code: number;
  message: string;
  data: {
    accessToken: string;
    expiresIn: number;
  };
}

export interface CJProductResponse {
  code: number;
  message: string;
  data: CJProduct[];
  totalCount: number;
  pageNum: number;
  pageSize: number;
}

/**
 * Get CJ Dropshipping access token
 * Handles token caching and renewal
 */
export async function getCJAccessToken(): Promise<string | null> {
  const now = Date.now();
  
  // Return cached token if still valid
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  if (!CJ_API_KEY) {
    console.error("❌ CJ_API_KEY not found in environment variables");
    return null;
  }

  try {
    const response = await axios.post<CJApiResponse>(
      `${CJ_BASE_URL}/authentication/getAccessToken`,
      { apiKey: CJ_API_KEY },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.code === 200) {
      const { accessToken, expiresIn } = response.data.data;
      cachedToken = accessToken;
      // Set expiry with 60 second buffer
      tokenExpiry = now + (expiresIn - 60) * 1000;
      console.log("✅ New CJ access token obtained!");
      return accessToken;
    } else {
      console.error("❌ CJ API error:", response.data.message);
      return null;
    }
  } catch (error: any) {
    console.error("❌ Failed to get CJ token:", error.response?.data || error.message);
    return null;
  }
}

/**
 * Fetch products from CJ Dropshipping
 */
export async function fetchCJProducts(
  keyword: string = "trending",
  pageNum: number = 1,
  pageSize: number = 20
): Promise<CJProduct[]> {
  const token = await getCJAccessToken();
  
  if (!token) {
    console.error("❌ No valid CJ token available");
    return [];
  }

  try {
    const response = await axios.post<CJProductResponse>(
      `${CJ_BASE_URL}/product/list`,
      {
        pageNum,
        pageSize,
        keyword,
      },
      {
        headers: {
          "CJ-Access-Token": token,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.code === 200) {
      console.log(`✅ Fetched ${response.data.data.length} products from CJ`);
      return response.data.data;
    } else {
      console.error("❌ CJ API error:", response.data.message);
      return [];
    }
  } catch (error: any) {
    console.error("❌ CJ API request failed:", error.response?.data || error.message);
    return [];
  }
}

/**
 * Get product categories from CJ Dropshipping
 */
export async function fetchCJCategories(): Promise<any[]> {
  const token = await getCJAccessToken();
  
  if (!token) {
    console.error("❌ No valid CJ token available");
    return [];
  }

  try {
    const response = await axios.get(
      `${CJ_BASE_URL}/product/category`,
      {
        headers: {
          "CJ-Access-Token": token,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.code === 200) {
      console.log("✅ Fetched categories from CJ");
      return response.data.data || [];
    } else {
      console.error("❌ CJ categories API error:", response.data.message);
      return [];
    }
  } catch (error: any) {
    console.error("❌ CJ categories request failed:", error.response?.data || error.message);
    return [];
  }
}

/**
 * Get product details by ID from CJ Dropshipping
 */
export async function fetchCJProductDetails(productId: string): Promise<CJProduct | null> {
  const token = await getCJAccessToken();
  
  if (!token) {
    console.error("❌ No valid CJ token available");
    return null;
  }

  try {
    const response = await axios.post(
      `${CJ_BASE_URL}/product/info`,
      { productId },
      {
        headers: {
          "CJ-Access-Token": token,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.code === 200) {
      console.log(`✅ Fetched product details for ID: ${productId}`);
      return response.data.data;
    } else {
      console.error("❌ CJ product details API error:", response.data.message);
      return null;
    }
  } catch (error: any) {
    console.error("❌ CJ product details request failed:", error.response?.data || error.message);
    return null;
  }
}

/**
 * Save CJ products to Supabase
 */
export async function saveCJProductsToSupabase(products: CJProduct[]): Promise<boolean> {
  if (!products.length) {
    console.log("⚠️ No products to save.");
    return false;
  }

  try {
    // Transform CJ products to match our Supabase schema
    const formattedProducts = products.map((product) => ({
      name: product.name,
      description: product.description || "",
      price: product.price,
      sku: product.sku || product.id,
      images: product.images || [product.Url],
      category_id: product.Category?.toLowerCase() || "general",
      stock: product.stock || 0,
      cj_product_id: product.id,
      cj_product_link: product.product_link,
      cj_category: product.Category || "General",
      // Add additional fields for CJ integration
      supplier: "CJ Dropshipping",
      supplier_product_id: product.id,
      is_dropshipping: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Use upsert to avoid duplicates based on CJ product ID
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

/**
 * Delete old CJ Dropshipping products from Supabase
 */
export async function deleteOldCJProducts(): Promise<boolean> {
  try {
    console.log("🗑️ Deleting old CJ Dropshipping products...");
    
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
  } catch (error: any) {
    console.error("❌ Error in deleteOldCJProducts:", error.message);
    return false;
  }
}

/**
 * Fetch trending products from CJ Dropshipping
 */
export async function fetchTrendingCJProducts(limit: number = 50): Promise<CJProduct[]> {
  try {
    console.log("🔥 Fetching trending products from CJ Dropshipping...");
    
    const token = await getCJAccessToken();
    if (!token) {
      console.error("❌ No valid CJ token available");
      return [];
    }

    // Fetch trending products using the trending keyword
    const products = await fetchCJProducts("trending", 1, limit);
    
    if (products.length > 0) {
      console.log(`✅ Fetched ${products.length} trending products`);
    } else {
      console.log("⚠️ No trending products found");
    }

    return products;
  } catch (error: any) {
    console.error("❌ Error fetching trending products:", error.message);
    return [];
  }
}

/**
 * Sync trending products with cleanup
 */
export async function syncTrendingProducts(limit: number = 50): Promise<{
  success: boolean;
  totalProducts: number;
  errors: string[];
}> {
  const errors: string[] = [];
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
    const products = await fetchTrendingCJProducts(limit);
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
  } catch (error: any) {
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

/**
 * Sync products from CJ Dropshipping to Supabase
 */
export async function syncCJProducts(
  keywords: string[] = ["fashion", "electronics", "home", "beauty"],
  productsPerKeyword: number = 10
): Promise<{ success: boolean; totalProducts: number; errors: string[] }> {
  const errors: string[] = [];
  let totalProducts = 0;

  console.log("🚀 Starting CJ Dropshipping product sync...");

  for (const keyword of keywords) {
    try {
      console.log(`📦 Fetching products for keyword: ${keyword}`);
      const products = await fetchCJProducts(keyword, 1, productsPerKeyword);
      
      if (products.length > 0) {
        const success = await saveCJProductsToSupabase(products);
        if (success) {
          totalProducts += products.length;
          console.log(`✅ Synced ${products.length} products for "${keyword}"`);
        } else {
          errors.push(`Failed to save products for keyword: ${keyword}`);
        }
      } else {
        console.log(`⚠️ No products found for keyword: ${keyword}`);
      }
    } catch (error: any) {
      const errorMsg = `Error syncing keyword "${keyword}": ${error.message}`;
      console.error(`❌ ${errorMsg}`);
      errors.push(errorMsg);
    }
  }

  const success = errors.length === 0;
  console.log(`\n📊 Sync completed: ${totalProducts} products synced, ${errors.length} errors`);

  return {
    success,
    totalProducts,
    errors,
  };
}
