import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { db, supabase } from "@/lib/supabase";
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
    const categoryId = searchParams.get("categoryId");
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
    const source = searchParams.get("source") || "prisma";

    // Pagination parameters
    // Default page size is 12 products, which works well for grid layouts
    // Page numbering starts at 1 for better UX understanding
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Use Supabase for multilingual search, Prisma for local data
    if (source === "supabase") {
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
    }

    // Always use Supabase since Prisma schema doesn't match the actual database
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
    // Fetch from multiple sources like new arrivals does
    const sources: any[] = [];
    
    // Fetch from Supabase
    const { data: products, error } = await db.searchProductsAdvanced({
      query,
      language,
      categoryId,
      minPrice,
      maxPrice,
      sortBy,
      order,
      limit,
      offset,
    });

    if (products && products.length > 0) {
      sources.push(...products);
    }

    if (error) {
      console.error("Supabase search error:", error);
      console.log("Supabase connection failed, will try alternative approach");
    }
    
    // Also fetch from CJ products with query and category filters
    try {
      let cjQuery = supabase
        .from('products')
        .select('*')
        .eq('is_dropshipping', true)
        .limit(50);
      
      // Apply query filter at the database level for CJ products
      if (query && query.trim()) {
        const searchTerm = query.trim();
        cjQuery = cjQuery.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      // Apply category filter if provided
      if (categoryId && categoryId !== "All") {
        cjQuery = cjQuery.or(`category_id.eq.${categoryId},cj_category.ilike.%${categoryId}%`);
      }
      
      const { data: cjProducts } = await cjQuery;
      
      if (cjProducts && cjProducts.length > 0) {
        sources.push(...cjProducts);
      }
    } catch (cjError) {
      console.error("Error fetching CJ products:", cjError);
    }
    
    // Fetch regular local products with query and category filters
    try {
      let localQuery = supabase
        .from('products')
        .select('*')
        .eq('is_dropshipping', false)
        .limit(50);
      
      // Apply query filter at the database level for local products
      if (query && query.trim()) {
        const searchTerm = query.trim();
        localQuery = localQuery.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      // Apply category filter if provided
      if (categoryId && categoryId !== "All") {
        localQuery = localQuery.eq('category_id', categoryId);
      }
      
      const { data: localProducts } = await localQuery;
      
      if (localProducts && localProducts.length > 0) {
        sources.push(...localProducts);
      }
    } catch (localError) {
      console.error("Error fetching local products:", localError);
    }
    
    // If we have products from any source
    if (sources.length > 0) {
      // Apply client-side filtering, sorting, and pagination
      let filteredProducts = sources;
      
      // Apply search query filter - THIS IS CRITICAL for exact matches
      if (query && query.trim()) {
        const searchTerm = query.toLowerCase().trim();
        const searchWords = searchTerm.split(' ').filter(w => w.length > 0);
        
        filteredProducts = filteredProducts.filter(p => {
          const name = p.name?.toLowerCase() || '';
          const description = p.description?.toLowerCase() || '';
          const sku = p.sku?.toLowerCase() || '';
          const category = p.category_id?.toLowerCase() || '';
          
          // Check if all search words appear in at least one field
          const matches = searchWords.every(word => 
            name.includes(word) || 
            description.includes(word) || 
            sku.includes(word) ||
            category.includes(word)
          );
          
          return matches;
        });
      }
      
      // Apply category filter - must match category_id or category name/slug
      if (categoryId && categoryId !== "All") {
        filteredProducts = filteredProducts.filter(p => {
          // Check if category_id matches
          if (p.category_id?.toLowerCase() === categoryId.toLowerCase()) return true;
          
          // Check if cj_category matches
          if (p.cj_category?.toLowerCase() === categoryId.toLowerCase()) return true;
          
          // Check if category slug matches (for fashion, electronics, etc.)
          const categorySlug = p.category_id?.toLowerCase().replace(/\s+/g, '-');
          if (categorySlug === categoryId.toLowerCase().replace(/\s+/g, '-')) return true;
          
          return false;
        });
      }
      
      // Apply price range filter
      if (minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= minPrice);
      }
      if (maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= maxPrice);
      }
      
      // Apply sorting
      filteredProducts.sort((a, b) => {
        switch (sortBy) {
          case 'price':
            return order === 'asc' ? a.price - b.price : b.price - a.price;
          case 'name':
            return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
          case 'createdAt':
          default:
            return order === 'asc' ? 
              new Date(a.date_created || a.created_at).getTime() - new Date(b.date_created || b.created_at).getTime() :
              new Date(b.date_created || b.created_at).getTime() - new Date(a.date_created || a.created_at).getTime();
        }
      });
      
      const totalFilteredItems = filteredProducts.length;
      const paginatedProducts = filteredProducts.slice(offset, offset + limit);
      
      // Transform products
      const transformedProducts = paginatedProducts.map(product => ({
        id: product.products_id?.toString() || product.id?.toString(),
        name: product.name,
        description: product.description || '',
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : product.url || null,
        images: product.images && product.images.length > 0 ? product.images : (product.url ? [product.url] : []),
        category: {
          id: product.category_id || 'default',
          name: product.cj_category || (product.category_id ? product.category_id.charAt(0).toUpperCase() + product.category_id.slice(1) : 'General'),
          slug: product.category_id || 'general'
        },
        stock: product.stock || 10,
        sku: product.sku || '',
        createdAt: product.date_created || product.created_at,
        updatedAt: product.updated_at,
      }));
      
      const totalPages = Math.ceil(totalFilteredItems / limit);
      const currentPage = Math.floor(offset / limit) + 1;
      const hasNext = currentPage < totalPages;
      const hasPrevious = currentPage > 1;
      
      return successResponse({
        products: transformedProducts,
        pagination: {
          currentPage,
          totalPages,
          totalItems: totalFilteredItems,
          hasNext,
          hasPrevious,
          limit,
        },
      });
    }
    
    // If no products found from any source, return empty results
    console.log("No products found from any source");
    
    // Return empty result set
    return successResponse({
      products: [],
      pagination: {
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: 0,
        totalItems: 0,
        hasNext: false,
        hasPrevious: false,
        limit,
      },
    });
  } catch (error) {
    console.error("Error in Supabase search:", error);
    return serverErrorResponse("Failed to search products");
  }
}
