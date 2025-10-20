-- Create products table with proper schema
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  category_id TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  upc TEXT,
  edi_enabled BOOLEAN DEFAULT false,
  supplier_part_id TEXT,
  supplier_id TEXT,
  count_in_stock INTEGER DEFAULT 0,
  last_inventory_update TIMESTAMP WITH TIME ZONE,
  edi_inventory_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  parent_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create product translations table
CREATE TABLE IF NOT EXISTS public.product_translations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, language)
);

-- Create category translations table
CREATE TABLE IF NOT EXISTS public.category_translations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(category_id, language)
);

-- Add foreign key constraint for products -> categories
ALTER TABLE public.products 
ADD CONSTRAINT fk_products_category 
FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE RESTRICT;

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_translations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products (allow public read access)
CREATE POLICY "Products are viewable by everyone" 
  ON public.products 
  FOR SELECT 
  USING (true);

-- Create RLS policies for categories (allow public read access)
CREATE POLICY "Categories are viewable by everyone" 
  ON public.categories 
  FOR SELECT 
  USING (true);

-- Create RLS policies for product translations (allow public read access)
CREATE POLICY "Product translations are viewable by everyone" 
  ON public.product_translations 
  FOR SELECT 
  USING (true);

-- Create RLS policies for category translations (allow public read access)
CREATE POLICY "Category translations are viewable by everyone" 
  ON public.category_translations 
  FOR SELECT 
  USING (true);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_description ON public.products USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_product_translations_product_id ON public.product_translations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_translations_language ON public.product_translations(language);
CREATE INDEX IF NOT EXISTS idx_category_translations_category_id ON public.category_translations(category_id);
CREATE INDEX IF NOT EXISTS idx_category_translations_language ON public.category_translations(language);

-- Insert some default categories
INSERT INTO public.categories (id, name, slug, description) VALUES
  ('cat-fashion', 'Fashion', 'fashion', 'Clothing, shoes, and accessories'),
  ('cat-electronics', 'Electronics', 'electronics', 'Electronic devices and gadgets'),
  ('cat-beauty', 'Beauty', 'beauty', 'Beauty and personal care products'),
  ('cat-home', 'Home & Living', 'home-living', 'Home decor and living essentials'),
  ('cat-sports', 'Sports', 'sports', 'Sports and fitness equipment'),
  ('cat-baby', 'Baby', 'baby', 'Baby products and essentials')
ON CONFLICT (id) DO NOTHING;

-- Insert some sample products
INSERT INTO public.products (id, name, description, price, images, category_id, stock, sku) VALUES
  ('prod-1', 'Classic White T-Shirt', 'Comfortable cotton t-shirt perfect for everyday wear', 19.99, ARRAY['/tshirt1.jpg'], 'cat-fashion', 50, 'TSH-001'),
  ('prod-2', 'Blue Jeans', 'Classic denim jeans with a comfortable fit', 49.99, ARRAY['/jeans1.jpg'], 'cat-fashion', 30, 'JNS-001'),
  ('prod-3', 'Running Shoes', 'Lightweight running shoes for athletes', 89.99, ARRAY['/shoes1.jpg'], 'cat-fashion', 25, 'SHO-001'),
  ('prod-4', 'Smartphone', 'Latest smartphone with advanced features', 699.99, ARRAY['/phone1.jpg'], 'cat-electronics', 15, 'PHN-001'),
  ('prod-5', 'Laptop', 'High-performance laptop for work and play', 1299.99, ARRAY['/laptop1.jpg'], 'cat-electronics', 10, 'LPT-001'),
  ('prod-6', 'Lipstick Set', 'Premium lipstick collection in various shades', 29.99, ARRAY['/lipstick1.jpg'], 'cat-beauty', 40, 'LIP-001'),
  ('prod-7', 'Coffee Table', 'Modern wooden coffee table for living room', 199.99, ARRAY['/table1.jpg'], 'cat-home', 8, 'TBL-001'),
  ('prod-8', 'Yoga Mat', 'Non-slip yoga mat for fitness enthusiasts', 39.99, ARRAY['/yogamat1.jpg'], 'cat-sports', 60, 'YGM-001')
ON CONFLICT (id) DO NOTHING;
