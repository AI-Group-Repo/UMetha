import axios from "axios";
import { supabase } from "./supabase";
import { getSupabaseServiceRoleClient } from "./supabaseClient";
import type { TablesInsert } from "@/types/supabase";
import Email from "next-auth/providers/email";

// CJ Dropshipping API configuration
const CJ_BASE_URL = "https://developers.cjdropshipping.com/api2.0/v1";
const CJ_API_KEY = process.env.CJ_API_KEY || "CJ4815762@api@ab76fe304ce14f85abca3cd5a64e7227";
const CJ_ACCESS_TOKEN = process.env.CJ_ACCESS_TOKEN || "API@CJ4815762@CJ:eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyOTU4OSIsInR5cGUiOiJBQ0NFU1NfVE9LRU4iLCJzdWIiOiJicUxvYnFRMGxtTm55UXB4UFdMWnlzMWFlbzhRdjNTdXd2MWI0c0lRL1dHTnJmcjlod2V0RllmTk50UkVBVlpEc05jakVvRmFsYXZBdWF2TUs4TDByR0plUEhjKzBTYjk2eEw4ZUprRXFXVnRKRlhBaENobDM2ZTBVMDVkY2NmNFVUZ281WjRpM0J4RTdMZ0FzNDV5UGxsSTRlNHVKbnNNVk5UZnZiT1UzR29JL1E4NkVvZHpUMzQ3cE1QTEc4RjhKaUkwQU9qcE9lUGxDUm5DblhTc2pJL2JOd2lnMTFXVi9DaVdGVllkWUQ1b3BzL0t0dS91UTN1Z1F4dWJiaEVzdXJYVk5kSFNkR3UzZUEyR0hHdEhNV2RGWjNTaEFMcXBSK3N6U0kxYTJkQT0iLCJpYXQiOjE3NjIxNzU1OTF9.k1EXL_-BgRL3_Y9sxwYZoogWN1clVamaNRcD8xo-kaA";

// Cache for CJ token
let cachedToken: string | null = CJ_ACCESS_TOKEN; // Use provided token initially
let tokenExpiry: number = Date.now() + (86400 * 1000); // 24 hours from now

export interface CJProduct {
  pid: string;
  productNameEn: string;
//  description?: string;
  sellPrice: number;
  productImage: string;
  categoryName: string;

//  product_link?: string;
  productSku?: string;
//  stock?: number;
//  variants?: any[];
//  images?: string[];
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
  result: boolean;
  message: string;
  data: {
    pageNum: number;
    pageSize: number;
    total: number;
    list: CJProduct[];
  };
  requestId: string;
  success: boolean;
}

/**
 * Get CJ Dropshipping access token
 * Handles token caching and renewal
 */
export async function getCJAccessToken(): Promise<string | null> {
  const now = Date.now();
  
  // Return cached token if still valid (using provided token or refreshed token)
  if (cachedToken && now < tokenExpiry) {
    console.log("✅ Using cached CJ access token");
    return cachedToken;
  }

  console.log("🔄 CJ token expired or not available, requesting new token...");

  if (!CJ_API_KEY) {
    console.error("❌ CJ_API_KEY not found in environment variables");
    return null;
  }

  try {
    const response = await axios.post<CJApiResponse>(
      `${CJ_BASE_URL}/authentication/getAccessToken`,
      { 
        apiKey: CJ_API_KEY
      },
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
      console.log("✅ New CJ access token obtained and cached!");
      return accessToken;
    } else {
      console.error("❌ CJ API error:", response.data.message);
      // If we can't get a new token, try using the provided token as fallback
      if (CJ_ACCESS_TOKEN) {
        console.log("⚠️ Using provided CJ_ACCESS_TOKEN as fallback");
        cachedToken = CJ_ACCESS_TOKEN;
        tokenExpiry = now + (86400 * 1000); // 24 hours
        return CJ_ACCESS_TOKEN;
      }
      return null;
    }
  } catch (error: any) {
    console.error("❌ Failed to get CJ token:", error.response?.data || error.message);
    // If we can't get a new token, try using the provided token as fallback
    if (CJ_ACCESS_TOKEN) {
      console.log("⚠️ Using provided CJ_ACCESS_TOKEN as fallback after error");
      cachedToken = CJ_ACCESS_TOKEN;
      tokenExpiry = now + (86400 * 1000); // 24 hours
      return CJ_ACCESS_TOKEN;
    }
    return null;
  }
}

/**
 * Fetch products from CJ Dropshipping
 * Simple extraction from /product/list endpoint
 */
export async function fetchCJProducts(
  keyword: string = "",
  pageNum: number = 1,
  pageSize: number = 20
): Promise<CJProduct[]> {
  const token = await getCJAccessToken();
  
  if (!token) {
    console.error("❌ No valid CJ token available");
    return [];
  }
  
  console.log(`📡 Fetching CJ products: pageNum=${pageNum}, pageSize=${pageSize}, keyword="${keyword || 'none'}"`);

  try {
    // Build request params
    const params: any = {
      pageNum,
      pageSize,
    };
    
    // Add keyword if provided
    if (keyword && keyword.trim()) {
      params.keyword = keyword.trim();
    }
    
    console.log(`🌐 Calling ${CJ_BASE_URL}/product/list with params:`, params);

    // Simple GET request to CJ product list endpoint
    const response = await axios.get<CJProductResponse>(
      `${CJ_BASE_URL}/product/list`,
      {
        params,
        headers: {
          "CJ-Access-Token": token,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    console.log(`📦 CJ Response: code=${response.data.code}, total=${response.data.data?.total || 0}`);

    if (response.data.code === 200 && response.data.data?.list && Array.isArray(response.data.data.list)) {
      const products = response.data.data.list;
      console.log(`✅ Fetched ${products.length} products from CJ`);
      return products;
    } else {
      console.error("❌ No products in CJ response");
      console.error("   Full response:", JSON.stringify(response.data, null, 2));
      return [];
    }
  } catch (error: any) {
    console.error("❌ CJ API request failed:", error.message);
    if (error.response?.data) {
      console.error("   Response data:", JSON.stringify(error.response.data, null, 2));
    }
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
    // Use GET method with query parameters
    const response = await axios.get(
      `${CJ_BASE_URL}/product/info`,
      {
        params: { productId },
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
 * Note: Disabled for now - use localStorage for demo accounts
 */
export async function saveCJProductsToSupabase(products: CJProduct[]): Promise<boolean> {
  if (!products.length) {
    console.log("⚠️ No products to save.");
    return false;
  }

  try {
    // Use service-role client to bypass RLS for backend ingestion
    const admin = getSupabaseServiceRoleClient();

    // Pick correct category table name (try "Category" then fallback to "category")
    let categoryTable = "Category";
    const probe = await admin.from(categoryTable).select("categoryId").limit(1);
    if (probe.error) {
      categoryTable = "category";
    }

    // Resolve categoryIds (int8 FK) from CJ categoryName strings
    const uniqueCategoryNames = Array.from(
      new Set(products.map((p) => (p.categoryName || "").trim()).filter(Boolean))
    );

    const categoryNameToId: Record<string, number> = {};

    if (uniqueCategoryNames.length > 0) {
      // 1) Fetch existing categories by name
      const { data: existingCats, error: fetchCatError } = await admin
        .from(categoryTable)
        .select("*")
        .in("categoryName", uniqueCategoryNames);

      if (fetchCatError) {
        console.warn("⚠️ Could not read categories, will attempt insert anyway:", fetchCatError.message);
      } else if (Array.isArray(existingCats)) {
        for (const row of existingCats as any[]) {
          const idCandidate =
            typeof row.id === "number"
              ? row.id
              : typeof row.category_id === "number"
              ? row.category_id
              : typeof row.categoryId === "number"
              ? row.categoryId
              : undefined;
          if (idCandidate) {
            categoryNameToId[row.categoryName] = idCandidate;
          }
        }
      }

      // 2) Insert any missing category names
      const missingNames = uniqueCategoryNames.filter((n) => categoryNameToId[n] === undefined);
      if (missingNames.length > 0) {
        const payload = missingNames.map((name) => ({
          // minimal payload; adjust if your schema requires more
          categoryName: name,
        }));

        const { error: insertCatError } = await admin.from(categoryTable).insert(payload);
        if (insertCatError) {
          console.warn("⚠️ Category insert failed (will proceed without linking):", insertCatError.message);
        } else {
          // Re-fetch to get numeric IDs
          const { data: afterInsertCats } = await admin
            .from(categoryTable)
            .select("*")
            .in("categoryName", missingNames);
          if (Array.isArray(afterInsertCats)) {
            for (const row of afterInsertCats as any[]) {
              const idCandidate =
                typeof row.id === "number"
                  ? row.id
                  : typeof row.category_id === "number"
                  ? row.category_id
                  : typeof row.categoryId === "number"
                  ? row.categoryId
                  : undefined;
              if (idCandidate) {
                categoryNameToId[row.categoryName] = idCandidate;
              }
            }
          }
        }
      }
    }

    // Map CJ products -> your products table schema
    // products_id is required in your types; derive a numeric ID from CJ pid safely
    const mapped = products.map((p) => {
      const numericId = (() => {
        const digits = (p.pid || "").replace(/\D/g, "");
        if (digits) return Number(digits.slice(-9)); // keep it within int range
        // fallback: simple hash to number
        let hash = 0;
        for (let i = 0; i < (p.pid || "").length; i++) {
          hash = (hash * 31 + (p.pid.charCodeAt(i) || 0)) >>> 0;
        }
        return hash % 1000000000;
      })();

      const categoryId =
        categoryNameToId[(p.categoryName || "").trim()] ?? null;

      return {
        products_id: numericId,
        name: p.productNameEn,
        Category: p.categoryName ?? null,
        sku: p.productSku ?? null,
        price: Number(p.sellPrice) || 0,
        productWeight: null,
        date_created: new Date().toISOString(),
        Url: p.productImage ?? null,
        categoryId,
        stock: 10,
        productType: "dropshipping",
        productUnit: "unit",
      };
    });

    // Upsert to avoid duplicates on products_id
    const { error } = await admin
      .from("products")
      .upsert(mapped as TablesInsert<"products">[], { onConflict: "products_id" });

    if (error) {
      console.error("❌ Failed to save CJ products to Supabase:", error);
      return false;
    }

    console.log(`✅ Saved ${mapped.length} CJ products to Supabase`);
    return true;
  } catch (error: any) {
    console.error("❌ Error saving CJ products:", error.message);
    return false;
  }
}

/**
 * Delete old CJ Dropshipping products from Supabase
 * Note: Disabled for now - using localStorage for demo accounts
 */
export async function deleteOldCJProducts(): Promise<boolean> {
  console.log("⚠️ Database cleanup skipped - using localStorage for demo accounts");
  return true;
  
  // TODO: Re-enable for production with proper supplier_id handling
}

/**
 * Fetch trending products from CJ Dropshipping
 */
export async function fetchTrendingCJProducts(limit: number = 20): Promise<CJProduct[]> {
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
export async function syncTrendingProducts(limit: number = 20): Promise<{
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
