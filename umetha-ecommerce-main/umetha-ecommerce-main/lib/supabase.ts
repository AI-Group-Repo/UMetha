import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Use the createClient constructor with explicit options to avoid URL validation errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zgdwrrsqjdlxfwjqamxk.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZHdycnNxamRseGZ3anFhbXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MzkzNDUsImV4cCI6MjA3NjAxNTM0NX0._4EEFOEIJ6vZMc0aGbgXfmmVi-WedTX6HpTDW4dLeOs";

if (
  process.env.NODE_ENV !== "development" &&
  (!supabaseUrl || !supabaseAnonKey)
) {
  console.error(
    "Missing Supabase environment variables. Authentication will not work correctly."
  );
}

// Using the createClient method with options object instead of direct URL parameter
// This avoids the URL constructor validation
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// Auth helper functions
export const auth = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  },
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  signOut: async () => {
    return await supabase.auth.signOut();
  },
  getUser: async () => {
    return await supabase.auth.getUser();
  },
  getSession: async () => {
    return await supabase.auth.getSession();
  },
};

// Database helper functions
export const db = {
  // Users
  getUsers: async () => {
    return await supabase.from("users").select("*");
  },
  getUserById: async (userId: string) => {
    return await supabase
      .from("users")
      .select("*")
      .eq("user_id", userId)
      .single();
  },

  // Products
  getProducts: async (limit = 12, offset = 0) => {
    return await supabase
      .from("products")
      .select("*")
      .range(offset, offset + limit - 1);
  },
  getProductById: async (productId: string) => {
    return await supabase
      .from("products")
      .select("*")
      .eq("products_id", productId)
      .single();
  },
  searchProducts: async (query: string, language = "en") => {
    // Enhanced search with fuzzy matching for the actual database schema
    const searchPatterns = [];
    
    // Exact match patterns
    searchPatterns.push(`name.ilike.%${query}%`);
    if (query.length > 0) {
      searchPatterns.push(`description.ilike.%${query}%`);
    }
    
    // Multi-word patterns
    const words = query.split(' ').filter(word => word.length > 0);
    words.forEach(word => {
      searchPatterns.push(`name.ilike.%${word}%`);
      if (word.length > 0) {
        searchPatterns.push(`description.ilike.%${word}%`);
      }
    });
    
    // 2+ consecutive letter patterns for better fuzzy matching
    if (query.length >= 2) {
      for (let i = 0; i <= query.length - 2; i++) {
        const substring = query.substring(i, i + 2);
        searchPatterns.push(`name.ilike.%${substring}%`);
        searchPatterns.push(`description.ilike.%${substring}%`);
      }
    }
    
    return await supabase
      .from("products")
      .select("*")
      .or(searchPatterns.join(','))
      .order("name", { ascending: true });
  },
  searchProductsAdvanced: async (params: {
    query?: string;
    language?: string;
    Category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    order?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }) => {
    const {
      query = "",
      language = "en",
      Category,
      minPrice,
      maxPrice,
      sortBy = "name",
      order = "asc",
      limit = 12,
      offset = 0
    } = params;

    let queryBuilder = supabase
      .from("products")
      .select("*");

    // Text search with fuzzy matching - at least 2 consecutive letters
    if (query) {
      const searchPatterns = [];
      
      // Exact match patterns
      searchPatterns.push(`name.ilike.%${query}%`);
      if (query.length > 0) {
        searchPatterns.push(`description.ilike.%${query}%`);
      }
      
      // Multi-word patterns
      const words = query.split(' ').filter(word => word.length > 0);
      words.forEach(word => {
        searchPatterns.push(`name.ilike.%${word}%`);
        if (word.length > 0) {
          searchPatterns.push(`description.ilike.%${word}%`);
        }
      });
      
      // 2+ consecutive letter patterns for better fuzzy matching
      if (query.length >= 2) {
        for (let i = 0; i <= query.length - 2; i++) {
          const substring = query.substring(i, i + 2);
          searchPatterns.push(`name.ilike.%${substring}%`);
          searchPatterns.push(`description.ilike.%${substring}%`);
        }
      }
      
      queryBuilder = queryBuilder.or(searchPatterns.join(','));
    }

    // Category filter
    if (Category) {
      queryBuilder = queryBuilder.eq("Category", Category);
    }

    // Price range filter
    if (minPrice !== undefined) {
      queryBuilder = queryBuilder.gte("price", minPrice);
    }
    if (maxPrice !== undefined) {
      queryBuilder = queryBuilder.lte("price", maxPrice);
    }

    // Sorting
    const sortField = sortBy === "price" ? "price" : 
                     sortBy === "date_created" ? "date_created" : 
                     "name";
    queryBuilder = queryBuilder.order(sortField, { ascending: order === "asc" });

    // Pagination
    queryBuilder = queryBuilder.range(offset, offset + limit - 1);

    return await queryBuilder;
  },
  searchProductsByImage: async (imageUrl: string, language = "en") => {
    // This would integrate with an AI service for image-based search
    // For now, we'll return a placeholder implementation
    return await supabase
      .from("products")
      .select(`
        *,
        product_translations!inner(
          name,
          description,
          language
        )
      `)
      .eq("product_translations.language", language)
      .limit(10);
  },

  // Orders
  getUserOrders: async (userId: string) => {
    return await supabase
      .from("orders")
      .select(
        `
      *,
      order_items(*)
    `
      )
      .eq("user_id", userId);
  },

  // Generic CRUD operations
  create: async (table: string, data: any) => {
    return await supabase.from(table).insert(data).select();
  },
  update: async (table: string, id: string, data: any, idField = "products_id") => {
    return await supabase.from(table).update(data).eq(idField, id).select();
  },
  delete: async (table: string, id: string, idField = "products_ id") => {
    return await supabase.from(table).delete().eq(idField, id);
  },
};

// Storage helper functions
export const storage = {
  uploadFile: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    return { data, error };
  },
  getPublicUrl: (bucket: string, path: string) => {
    return supabase.storage.from(bucket).getPublicUrl(path);
  },
  deleteFile: async (bucket: string, path: string) => {
    return await supabase.storage.from(bucket).remove([path]);
  },
};
