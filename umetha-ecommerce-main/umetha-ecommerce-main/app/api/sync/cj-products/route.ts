import { NextRequest, NextResponse } from "next/server";
import { 
  syncCJProducts, 
  fetchCJProducts, 
  saveCJProductsToSupabase,
  syncTrendingProducts,
  deleteOldCJProducts,
  fetchTrendingCJProducts
} from "@/lib/cj-dropshipping";
import { successResponse, errorResponse, serverErrorResponse } from "@/lib/api-utils";

/**
 * CJ Dropshipping Product Sync API
 * 
 * This endpoint syncs products from CJ Dropshipping to your Supabase database
 * 
 * Query Parameters:
 * - keywords: Comma-separated keywords to search for (default: "fashion,electronics,home,beauty")
 * - limit: Number of products per keyword (default: 10)
 * - action: Action to perform - "sync" (default), "test", "categories", "trending", "cleanup"
 * 
 * Example requests:
 * - GET /api/sync/cj-products - Sync with default keywords
 * - GET /api/sync/cj-products?keywords=fashion,shoes&limit=20 - Sync specific keywords
 * - GET /api/sync/cj-products?action=test - Test connection without syncing
 * - GET /api/sync/cj-products?action=categories - Get available categories
 * - GET /api/sync/cj-products?action=trending&limit=50 - Sync trending products
 * - GET /api/sync/cj-products?action=cleanup - Delete old CJ products
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const action = searchParams.get("action") || "sync";
    const keywordsParam = searchParams.get("keywords") || "fashion,electronics,home,beauty";
    const limit = parseInt(searchParams.get("limit") || "10");
    
    const keywords = keywordsParam.split(",").map(k => k.trim()).filter(k => k.length > 0);

    // Test connection
    if (action === "test") {
      try {
        const testProducts = await fetchCJProducts("test", 1, 1);
        return successResponse({
          message: "CJ Dropshipping connection successful",
          productsFound: testProducts.length,
          keywords: keywords,
          limit: limit
        });
      } catch (error: any) {
        return errorResponse("CJ Dropshipping connection failed", 500, {
          error: error.message,
          details: "Please check your CJ_API_KEY environment variable"
        });
      }
    }

    // Get categories
    if (action === "categories") {
      try {
        const { fetchCJCategories } = await import("@/lib/cj-dropshipping");
        const categories = await fetchCJCategories();
        return successResponse({
          message: "Categories fetched successfully",
          categories: categories,
          count: categories.length
        });
      } catch (error: any) {
        return errorResponse("Failed to fetch categories", 500, {
          error: error.message
        });
      }
    }

    // Sync trending products
    if (action === "trending") {
      console.log(`🔄 Starting trending products sync with limit: ${limit}`);
      
      const result = await syncTrendingProducts(limit);
      
      if (result.success) {
        return successResponse({
          message: "Trending products synced successfully",
          totalProducts: result.totalProducts,
          limit: limit,
          errors: result.errors
        });
      } else {
        return errorResponse("Trending products sync completed with errors", 207, {
          totalProducts: result.totalProducts,
          errors: result.errors,
          limit: limit
        });
      }
    }

    // Cleanup old products
    if (action === "cleanup") {
      console.log("🗑️ Starting cleanup of old CJ products...");
      
      const success = await deleteOldCJProducts();
      
      if (success) {
        return successResponse({
          message: "Old CJ products deleted successfully",
          action: "cleanup"
        });
      } else {
        return errorResponse("Failed to delete old products", 500, {
          action: "cleanup"
        });
      }
    }

    // Sync products (default action)
    if (action === "sync") {
      console.log(`🔄 Starting CJ product sync with keywords: ${keywords.join(", ")}`);
      
      const result = await syncCJProducts(keywords, limit);
      
      if (result.success) {
        return successResponse({
          message: "CJ products synced successfully",
          totalProducts: result.totalProducts,
          keywords: keywords,
          limit: limit,
          errors: result.errors
        });
      } else {
        return errorResponse("CJ product sync completed with errors", 207, {
          totalProducts: result.totalProducts,
          errors: result.errors,
          keywords: keywords,
          limit: limit
        });
      }
    }

    return errorResponse("Invalid action parameter", 400, {
      validActions: ["sync", "test", "categories", "trending", "cleanup"],
      providedAction: action
    });

  } catch (error: any) {
    console.error("CJ sync API error:", error);
    return serverErrorResponse("Failed to sync CJ products");
  }
}

/**
 * Manual product sync via POST
 * Allows for more complex sync operations
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      keywords = ["fashion", "electronics", "home", "beauty"], 
      limit = 10,
      forceSync = false 
    } = body;

    console.log(`🔄 Manual CJ product sync requested`);
    console.log(`Keywords: ${keywords.join(", ")}`);
    console.log(`Limit per keyword: ${limit}`);
    console.log(`Force sync: ${forceSync}`);

    const result = await syncCJProducts(keywords, limit);
    
    return successResponse({
      message: "Manual CJ product sync completed",
      totalProducts: result.totalProducts,
      keywords: keywords,
      limit: limit,
      errors: result.errors,
      success: result.success
    });

  } catch (error: any) {
    console.error("Manual CJ sync error:", error);
    return serverErrorResponse("Failed to perform manual CJ sync");
  }
}
