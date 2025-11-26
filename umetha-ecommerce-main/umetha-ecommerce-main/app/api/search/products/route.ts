import { NextRequest } from "next/server";
import { db } from "@/lib/supabase";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/api-utils";

/**
 * Product Search API
 *
 * This endpoint provides robust search functionality for products with multiple filtering options,
 * sorting capabilities, and pagination support.
 *
 * Query Parameters:
 * - q: Search query text to match against product names and descriptions
 * - language: Language code for multilingual search (default: "en")
 * - categoryId: Filter products by specific category ID
 * - categorySlug: Filter products by category slug (alternative to categoryId)
 * - minPrice: Filter products with price greater than or equal to this value
 * - maxPrice: Filter products with price less than or equal to this value
 * - sort: Sort field (options: "price", "name", "newest"/"createdAt")
 * - order: Sort direction ("asc" or "desc")
 * - page: Page number for pagination (starts at 1)
 * - limit: Number of products per page
 * - source: Data source ("prisma" or "supabase", default: "prisma")
 *
 * Response Format:
 * {
 *   status: "success",
 *   data: {
 *     products: Array of product objects,
 *     pagination: {
 *       currentPage: Current page number,
 *       totalPages: Total number of pages,
 *       totalItems: Total number of matching products,
 *       hasNext: Boolean indicating if there's a next page,
 *       hasPrevious: Boolean indicating if there's a previous page,
 *       limit: Number of items per page
 *     }
 *   }
 * }
 *
 * Note: Only products with available stock (stock > 0) will be returned
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Get search and filter parameters
    // These parameters allow for flexible filtering of products based on user preferences
    const query = searchParams.get("q") || "";
    const language = searchParams.get("language") || "en";
    const categoryId = searchParams.get("categoryId") || "";
    const categorySlug = searchParams.get("categorySlug");
    const minPrice = searchParams.has("minPrice")
      ? parseFloat(searchParams.get("minPrice") as string)
      : undefined;
    const maxPrice = searchParams.has("maxPrice")
      ? parseFloat(searchParams.get("maxPrice") as string)
      : undefined;
    const sortBy = searchParams.get("sort") || "createdAt";
    const order =
      searchParams.get("order")?.toLowerCase() === "asc" ? "asc" : "desc";
    const source = searchParams.get("source") || "supabase";

    // Pagination parameters
    // Default page size is 12 products, which works well for grid layouts
    // Page numbering starts at 1 for better UX understanding
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Always use Supabase (source param kept for forward compatibility)
    return await searchWithSupabase({
      query,
      language,
      categoryId,
      minPrice,
      maxPrice,
      sortBy,
      order: order as "asc" | "desc",
      limit,
      offset: skip,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return serverErrorResponse("Failed to search products");
  }
}

// Supabase search function for multilingual support
async function searchWithSupabase(params: {
  query: string;
  language: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy: string;
  order: "asc" | "desc";
  limit: number;
  offset: number;
}) {
  const { query, language, categoryId, minPrice, maxPrice, sortBy, order, limit, offset } = params;

  try {
    // Fetch strictly from Supabase using the new schema
    const { data: products, error } = await db.searchProductsAdvanced({
      query,
      language,
     Category: categoryId ? categoryId : undefined,
      minPrice,
      maxPrice,
      sortBy,
      order,
      limit,
      offset,
    });

    if (error) {
      console.error("Supabase search error:", error);
      return errorResponse("Search failed");
    }

    const list = products ?? [];

    // Transform to UI shape (map to new schema fields)
    const transformedProducts = list.map((product: any) => ({
      id: product.products_id?.toString() ?? product.id?.toString(),
      name: product.name,
      description: "", // not present in new schema
      price: product.price,
      image: product.Url ?? null,
      images: product.Url ? [product.Url] : [],
      category: {
        id: product.categoryId ?? "default",
        name: product.Category ?? product.categoryId ?? "General",
        slug: (product.categoryId ?? "general").toLowerCase().replace(/\s+/g, "-"),
      },
      stock: product.stock ?? 0,
      sku: product.sku ?? "",
      createdAt: product.date_created,
      updatedAt: product.updated_at,
    }));

    const totalItems = list.length;
    const totalPages = Math.ceil(totalItems / (limit || 1));
    const currentPage = Math.floor(offset / limit) + 1;
    const hasNext = currentPage < totalPages;
    const hasPrevious = currentPage > 1;

    return successResponse({
      products: transformedProducts,
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        hasNext,
        hasPrevious,
        limit,
      },
    });
  } catch (error) {
    console.error("Error in Supabase search:", error);
    return serverErrorResponse("Failed to search products");
  }
}
