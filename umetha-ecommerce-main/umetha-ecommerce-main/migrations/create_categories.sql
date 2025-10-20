-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for categories (allow public read access)
CREATE POLICY "Categories are viewable by everyone" 
  ON public.categories 
  FOR SELECT 
  USING (true);

-- Insert sample categories
INSERT INTO public.categories (id, name, slug, description) VALUES
  ('cat-fashion', 'Fashion', 'fashion', 'Clothing, shoes, and accessories'),
  ('cat-electronics', 'Electronics', 'electronics', 'Electronic devices and gadgets'),
  ('cat-beauty', 'Beauty', 'beauty', 'Beauty and personal care products'),
  ('cat-home', 'Home & Living', 'home-living', 'Home decor and living essentials'),
  ('cat-sports', 'Sports', 'sports', 'Sports and fitness equipment'),
  ('cat-baby', 'Baby', 'baby', 'Baby products and essentials'),
  ('cat-appliances', 'Appliances', 'appliances', 'Home appliances and electronics'),
  ('cat-books', 'Books', 'books', 'Books and educational materials'),
  ('cat-toys', 'Toys', 'toys', 'Toys and games for all ages'),
  ('cat-automotive', 'Automotive', 'automotive', 'Car parts and accessories')
ON CONFLICT (id) DO NOTHING;

-- Add category_id column to products table if it doesn't exist
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
