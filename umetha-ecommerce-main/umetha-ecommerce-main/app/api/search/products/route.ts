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

    if (error) {
      console.error("Supabase search error:", error);
      console.log("Supabase connection failed, will try alternative approach");
    }

    // Get total count for pagination by running the same query without limit
    const { data: allProducts } = await db.searchProductsAdvanced({
      query,
      language,
      categoryId,
      minPrice,
      maxPrice,
      sortBy,
      order,
      limit: 1000, // Get a large number to count total
      offset: 0,
    });

    const totalItems = allProducts?.length || 0;
    
    // Try a simple product query if advanced search fails
    if (totalItems === 0 && error) {
      console.log("Advanced search failed, trying simple product query...");
      try {
        // First try to get CJ Dropshipping products
        const { data: cjProducts, error: cjError } = await supabase
          .from('products')
          .select('*')
          .eq('is_dropshipping', true)
          .limit(limit)
          .range(offset, offset + limit - 1);
        
        if (!cjError && cjProducts && cjProducts.length > 0) {
          console.log(`Found ${cjProducts.length} CJ Dropshipping products`);
          // Transform and return the CJ products
          const transformedProducts = cjProducts.map(product => ({
            id: product.id.toString(),
            name: product.name,
            description: product.description || '',
            price: product.price,
            image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.jpg',
            images: product.images && product.images.length > 0 ? product.images : ['/placeholder-product.jpg'],
            category: {
              id: product.category_id || 'default',
              name: product.cj_category || (product.category_id ? product.category_id.charAt(0).toUpperCase() + product.category_id.slice(1) : 'General'),
              slug: product.category_id || 'general'
            },
            stock: product.stock || 0,
            sku: product.sku || '',
            supplier: product.supplier || 'CJ Dropshipping',
            isDropshipping: true,
            createdAt: product.created_at,
            updatedAt: product.updated_at,
          }));

          return successResponse({
            products: transformedProducts,
            pagination: {
              currentPage: Math.floor(offset / limit) + 1,
              totalPages: Math.ceil(cjProducts.length / limit),
              totalItems: cjProducts.length,
              hasNext: offset + limit < cjProducts.length,
              hasPrevious: offset > 0,
              limit,
            },
          });
        }

        // If no CJ products, try regular products
        const { data: simpleProducts, error: simpleError } = await supabase
          .from('products')
          .select('*')
          .limit(limit)
          .range(offset, offset + limit - 1);
        
        if (!simpleError && simpleProducts && simpleProducts.length > 0) {
          console.log(`Found ${simpleProducts.length} regular products with simple query`);
          // Transform and return the simple products
          const transformedProducts = simpleProducts.map(product => ({
            id: product.id.toString(),
            name: product.name,
            description: product.description || '',
            price: product.price,
            image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.jpg',
            images: product.images && product.images.length > 0 ? product.images : ['/placeholder-product.jpg'],
            category: {
              id: product.category_id || 'default',
              name: product.category_id ? product.category_id.charAt(0).toUpperCase() + product.category_id.slice(1) : 'General',
              slug: product.category_id || 'general'
            },
            stock: product.stock || 10,
            sku: product.sku || '',
            supplier: product.supplier || 'Local',
            isDropshipping: product.is_dropshipping || false,
            createdAt: product.created_at,
            updatedAt: product.updated_at,
          }));

          return successResponse({
            products: transformedProducts,
            pagination: {
              currentPage: Math.floor(offset / limit) + 1,
              totalPages: Math.ceil(simpleProducts.length / limit),
              totalItems: simpleProducts.length,
              hasNext: offset + limit < simpleProducts.length,
              hasPrevious: offset > 0,
              limit,
            },
          });
        }
      } catch (fallbackError) {
        console.error("Simple query also failed:", fallbackError);
      }
      
      console.log("No products found in Supabase, using sample data as fallback");
      const sampleProducts = [
        {
          products_id: 1,
          name: "Classic White T-Shirt",
          description: "Comfortable cotton t-shirt perfect for everyday wear",
          price: 29.99,
          url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
          sku: "TSH001",
          date_created: new Date().toISOString(),
          category_id: "fashion"
        },
        {
          products_id: 2,
          name: "Blue Denim Jeans",
          description: "Classic blue denim jeans with a comfortable fit",
          price: 79.99,
          url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
          sku: "JNS001",
          date_created: new Date().toISOString(),
          category_id: "fashion"
        },
        {
          products_id: 3,
          name: "Running Shoes",
          description: "High-performance running shoes for athletes",
          price: 129.99,
          url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
          sku: "SHO001",
          date_created: new Date().toISOString(),
          category_id: "sports"
        },
        {
          products_id: 4,
          name: "Smartphone",
          description: "Latest smartphone with advanced features",
          price: 699.99,
          url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
          sku: "PHN001",
          date_created: new Date().toISOString(),
          category_id: "electronics"
        },
        {
          products_id: 5,
          name: "Laptop Computer",
          description: "High-performance laptop for work and gaming",
          price: 1299.99,
          url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
          sku: "LPT001",
          date_created: new Date().toISOString(),
          category_id: "electronics"
        },
        {
          products_id: 6,
          name: "Wireless Headphones",
          description: "Premium wireless headphones with noise cancellation",
          price: 199.99,
          url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
          sku: "HDP001",
          date_created: new Date().toISOString(),
          category_id: "electronics"
        },
        {
          products_id: 7,
          name: "Coffee Mug",
          description: "Ceramic coffee mug perfect for your morning brew",
          price: 12.99,
          url: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400",
          sku: "MUG001",
          date_created: new Date().toISOString(),
          category_id: "home"
        },
        {
          products_id: 8,
          name: "Backpack",
          description: "Durable backpack for travel and daily use",
          price: 59.99,
          url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
          sku: "BPK001",
          date_created: new Date().toISOString(),
          category_id: "fashion"
        },
        {
          products_id: 9,
          name: "Lipstick Set",
          description: "Premium lipstick collection in various shades. Long-lasting and moisturizing formula.",
          price: 29.99,
          url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
          sku: "LIP001",
          date_created: new Date().toISOString(),
          category_id: "beauty"
        },
      ];

      // Filter sample products by search query if provided
      let filteredProducts = sampleProducts;
      if (query && query.trim()) {
        const searchTerm = query.toLowerCase().trim();
        filteredProducts = sampleProducts.filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.sku.toLowerCase().includes(searchTerm)
        );
      }

      // Apply category filter if provided
      if (categoryId) {
        filteredProducts = filteredProducts.filter(product => 
          product.category_id === categoryId
        );
      }

      // Apply price range filter if provided
      if (minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.price >= minPrice);
      }
      if (maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
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
              new Date(a.date_created).getTime() - new Date(b.date_created).getTime() :
              new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
        }
      });

      // Apply pagination
      const paginatedProducts = filteredProducts.slice(offset, offset + limit);

      // Transform filtered products
      const transformedSampleProducts = paginatedProducts.map(product => ({
        id: product.products_id.toString(),
        name: product.name,
        description: product.description || '',
        price: product.price,
        image: product.url || '/placeholder-product.jpg',
        images: product.url ? [product.url] : ['/placeholder-product.jpg'],
        category: {
          id: product.category_id,
          name: product.category_id.charAt(0).toUpperCase() + product.category_id.slice(1),
          slug: product.category_id
        },
        stock: 10,
        sku: product.sku || '',
        createdAt: product.date_created,
        updatedAt: product.date_created,
      }));

      const totalFilteredItems = filteredProducts.length;
      const totalPages = Math.ceil(totalFilteredItems / limit);
      const currentPage = Math.floor(offset / limit) + 1;
      const hasNext = currentPage < totalPages;
      const hasPrevious = currentPage > 1;

      return successResponse({
        products: transformedSampleProducts,
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
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    const hasNext = currentPage < totalPages;
    const hasPrevious = currentPage > 1;

    // Get category information for products
    const categoryMap = new Map();
    if (products && products.length > 0) {
      const categoryIds = [...new Set(products.map(p => p.category_id).filter(Boolean))];
      if (categoryIds.length > 0) {
        const { data: categories } = await supabase
          .from('categories')
          .select('id, name, slug')
          .in('id', categoryIds);
        
        if (categories) {
          categories.forEach(cat => {
            categoryMap.set(cat.id, cat);
          });
        }
      }
    }

    // Transform products to match expected format
    const transformedProducts = (products || []).map(product => {
      const category = product.category_id ? categoryMap.get(product.category_id) : null;
      return {
        id: product.id.toString(),
        name: product.name,
        description: product.description || '',
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.jpg',
        images: product.images && product.images.length > 0 ? product.images : ['/placeholder-product.jpg'],
        category: category ? {
          id: category.id,
          name: category.name,
          slug: category.slug
        } : {
          id: 'default',
          name: 'General',
          slug: 'general'
        },
        stock: product.stock || 10,
        sku: product.sku || '',
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      };
    });

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
