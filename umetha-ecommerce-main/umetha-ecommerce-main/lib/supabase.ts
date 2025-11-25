import { getSupabaseBrowserClient } from "./supabaseClient";

export const supabase = getSupabaseBrowserClient();

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
  getProducts: async (limit = 50, offset = 0) => {
    return await supabase
      .from("products")
      .select("*")
      .range(offset, offset + limit - 1);
  },
  getProductById: async (productId: string) => {
    return await supabase
      .from("products")
      .select("*")
      .eq("products_id", isNaN(Number(productId)) ? productId : Number(productId))
      .single();
  },
  searchProducts: async (query: string, language = "en") => {
    // Search on fields that exist in the new schema
    const trimmed = query.trim();
    if (!trimmed) {
      return await supabase.from("products").select("*").order("name", { ascending: true }).limit(20);
    }

    // Build a simple OR pattern on name (and SKU if present)
    const patterns: string[] = [`name.ilike.%${trimmed}%`];
    const words = trimmed.split(" ").filter(Boolean);
    for (const word of words) {
      patterns.push(`name.ilike.%${word}%`);
    }

    return await supabase
      .from("products")
      .select("*")
      .or(patterns.join(","))
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

    let queryBuilder = supabase.from("products").select("*");

    // Text search with fuzzy matching - at least 2 consecutive letters
    if (query) {
      const trimmed = query.trim();
      const searchPatterns: string[] = [`name.ilike.%${trimmed}%`];
      const words = trimmed.split(" ").filter(Boolean);
      for (const word of words) {
        searchPatterns.push(`name.ilike.%${word}%`);
      }
      queryBuilder = queryBuilder.or(searchPatterns.join(","));
    }

    // Category filter
    if (Category) {
      // New schema uses Category (capitalized) and categoryId for mapping; try both
      queryBuilder = queryBuilder.or(`Category.ilike.%${Category}%,categoryId.ilike.%${Category}%`);
    }

    // Price range filter
    if (minPrice !== undefined) {
      queryBuilder = queryBuilder.gte("price", minPrice);
    }
    if (maxPrice !== undefined) {
      queryBuilder = queryBuilder.lte("price", maxPrice);
    }

    // Sorting
    const sortField =
      sortBy === "price" ? "price" : sortBy === "date_created" ? "date_created" : "name";
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
      .select(`*`)
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
    const client = supabase as any;
    return await client.from(table).insert(data).select();
  },
  update: async (table: string, id: string, data: any, idField = "products_id") => {
    const client = supabase as any;
    return await client.from(table).update(data).eq(idField, id).select();
  },
  delete: async (table: string, id: string, idField = "products_ id") => {
    const client = supabase as any;
    return await client.from(table).delete().eq(idField, id);
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
