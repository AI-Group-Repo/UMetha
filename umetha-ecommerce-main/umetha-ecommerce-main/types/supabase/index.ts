export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: number;
          first_name: string;
          last_name: string;
          phone_number: string;
          email: string;
          date_joined: string;
        };
        Insert: {
          user_id?: number;
          first_name: string;
          last_name: string;
          phone_number: string;
          email: string;
          date_joined: string;
        };
        Update: {
          user_id?: number;
          first_name?: string;
          last_name?: string;
          phone_number?: string;
          email?: string;
          date_joined?: string;
        };
      };
      credentials: {
        Row: {
          credentials_id: number;
          user_id: number;
          password_hash: string;
          last_login: string;
        };
        Insert: {
          credentials_id?: number;
          user_id: number;
          password_hash: string;
          last_login: string;
        };
        Update: {
          credentials_id?: number;
          user_id?: number;
          password_hash?: string;
          last_login?: string;
        };
      };
      addresses: {
        Row: {
          address_id: number;
          user_id: number;
          street_address: string;
          city: string | null;
          state: string | null;
          postal_code: string | null;
          country: string | null;
        };
        Insert: {
          address_id?: number;
          user_id: number;
          street_address: string;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          country?: string | null;
        };
        Update: {
          address_id?: number;
          user_id?: number;
          street_address?: string;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          country?: string | null;
        };
      };
      products: {
        Row: {
          products_id: number;
          name: string;
          description: string | null;
          sku: string | null;
          price: number;
          supplier_id: number | null;
          date_created: string;
          url: string | null;
          category_id: string | null;
        };
        Insert: {
          products_id?: number;
          name: string;
          description?: string | null;
          sku?: string | null;
          price: number;
          supplier_id?: number | null;
          date_created?: string;
          url?: string | null;
          category_id?: string | null;
        };
        Update: {
          products_id?: number;
          name?: string;
          description?: string | null;
          sku?: string | null;
          price?: number;
          supplier_id?: number | null;
          date_created?: string;
          url?: string | null;
          category_id?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_translations: {
        Row: {
          id: string;
          product_id: string;
          language: string;
          name: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          language: string;
          name: string;
          description: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          language?: string;
          name?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      category_translations: {
        Row: {
          id: string;
          category_id: string;
          language: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          language: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          language?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      suppliers: {
        Row: {
          supplier_id: number;
          name: string;
          email: string;
          phone_number: string;
          api_endpoint: string;
          date_created: string;
        };
        Insert: {
          supplier_id?: number;
          name: string;
          email: string;
          phone_number: string;
          api_endpoint: string;
          date_created: string;
        };
        Update: {
          supplier_id?: number;
          name?: string;
          email?: string;
          phone_number?: string;
          api_endpoint?: string;
          date_created?: string;
        };
      };
      orders: {
        Row: {
          order_id: number;
          user_id: number;
          order_date: string;
          status: string;
          total_amount: number;
        };
        Insert: {
          order_id?: number;
          user_id: number;
          order_date?: string;
          status: string;
          total_amount: number;
        };
        Update: {
          order_id?: number;
          user_id?: number;
          order_date?: string;
          status?: string;
          total_amount?: number;
        };
      };
      order_items: {
        Row: {
          order_items_id: number;
          order_id: number;
          product_id: number;
          quantity: number;
          price_per_item: number;
          total_price: number;
        };
        Insert: {
          order_items_id?: number;
          order_id: number;
          product_id: number;
          quantity: number;
          price_per_item: number;
          total_price: number;
        };
        Update: {
          order_items_id?: number;
          order_id?: number;
          product_id?: number;
          quantity?: number;
          price_per_item?: number;
          total_price?: number;
        };
      };
      payments: {
        Row: {
          payment_id: number;
          order_id: number;
          payment_method: string;
          payment_status: string;
          payemetn_date: string;
          payment_reference: string;
        };
        Insert: {
          payment_id?: number;
          order_id: number;
          payment_method: string;
          payment_status: string;
          payemetn_date: string;
          payment_reference: string;
        };
        Update: {
          payment_id?: number;
          order_id?: number;
          payment_method?: string;
          payment_status?: string;
          payemetn_date?: string;
          payment_reference?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types for more concise usage
export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;
