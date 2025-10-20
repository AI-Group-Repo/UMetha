import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { db, supabase } from "@/lib/supabase";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/api-utils";

/**
 * Smart Search API
 *
 * This endpoint provides intelligent search that:
 * 1. If query matches a category name, returns all products in that category
 * 2. Otherwise, uses fuzzy matching with 2+ consecutive letters
 * 3. Prioritizes exact matches, then category matches, then fuzzy matches
 *
 * Query Parameters:
 * - q: Search query text
 * - language: Language code (default: "en")
 * - limit: Number of products to return (default: 12)
 * - source: Data source ("prisma" or "supabase", default: "supabase")
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const language = searchParams.get("language") || "en";
    const limit = parseInt(searchParams.get("limit") || "12");
    const source = searchParams.get("source") || "supabase";

    if (!query.trim()) {
      return successResponse({
        products: [],
        searchType: "empty",
        message: "No search query provided"
      });
    }

    if (source === "supabase") {
      return await smartSearchWithSupabase(query, language, limit);
    }

    return await smartSearchWithPrisma(query, limit);
  } catch (error) {
    console.error("Error in smart search:", error);
    return serverErrorResponse("Failed to perform smart search");
  }
}

// Smart search with Supabase
async function smartSearchWithSupabase(query: string, language: string, limit: number) {
  try {
    // First, check if query matches any category name exactly
    const { data: categories, error: categoryError } = await supabase
      .from("categories")
      .select("id, name")
      .ilike("name", query);

    if (!categoryError && categories && categories.length > 0) {
      // Query matches a category - return all products from that category
      const categoryIds = categories.map(cat => cat.id);
      const { data: products, error: productError } = await supabase
        .from("products")
        .select(`
          *,
          categories!inner(
            name,
            slug
          )
        `)
        .in("category_id", categoryIds)
        .limit(limit);

      if (!productError) {
        return successResponse({
          products: products || [],
          searchType: "category",
          matchedCategories: categories.map(cat => cat.name),
          totalResults: products?.length || 0
        });
      }
    }

    // If no exact category match, use fuzzy search
    const { data: products, error } = await db.searchProductsAdvanced({
      query,
      language,
      limit,
      sortBy: "name",
      order: "asc"
    });

    if (error) {
      console.error("Supabase fuzzy search error:", error);
      return serverErrorResponse("Failed to search products");
    }

    return successResponse({
      products: products || [],
      searchType: "fuzzy",
      totalResults: products?.length || 0
    });
  } catch (error) {
    console.error("Error in Supabase smart search:", error);
    return serverErrorResponse("Failed to perform smart search");
  }
}

// Smart search with Prisma
async function smartSearchWithPrisma(query: string, limit: number) {
  try {
    // First, check if query matches any category name exactly
    const categories = await prisma.category.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (categories.length > 0) {
      // Query matches a category - return all products from that category
      const categoryIds = categories.map(cat => cat.id);
      const products = await prisma.product.findMany({
        where: {
          categoryId: {
            in: categoryIds,
          },
        },
        include: {
          category: true,
        },
        take: limit,
        orderBy: {
          name: "asc",
        },
      });

      return successResponse({
        products,
        searchType: "category",
        matchedCategories: categories.map(cat => cat.name),
        totalResults: products.length
      });
    }

    // If no exact category match, use fuzzy search
    const searchConditions = [];
    
    // Exact match patterns
    searchConditions.push({
      name: {
        contains: query,
        mode: "insensitive",
      },
    });
    searchConditions.push({
      description: {
        contains: query,
        mode: "insensitive",
      },
    });
    
    // Multi-word patterns
    const words = query.split(' ').filter(word => word.length > 0);
    words.forEach(word => {
      searchConditions.push({
        name: {
          contains: word,
          mode: "insensitive",
        },
      });
      searchConditions.push({
        description: {
          contains: word,
          mode: "insensitive",
        },
      });
    });
    
    // 2+ consecutive letter patterns for better fuzzy matching
    if (query.length >= 2) {
      for (let i = 0; i <= query.length - 2; i++) {
        const substring = query.substring(i, i + 2);
        searchConditions.push({
          name: {
            contains: substring,
            mode: "insensitive",
          },
        });
        searchConditions.push({
          description: {
            contains: substring,
            mode: "insensitive",
          },
        });
      }
    }

    const products = await prisma.product.findMany({
      where: {
        OR: searchConditions,
        stock: {
          gt: 0,
        },
      },
      include: {
        category: true,
      },
      take: limit,
      orderBy: {
        name: "asc",
      },
    });

    return successResponse({
      products,
      searchType: "fuzzy",
      totalResults: products.length
    });
  } catch (error) {
    console.error("Error in Prisma smart search:", error);
    return serverErrorResponse("Failed to perform smart search");
  }
}
