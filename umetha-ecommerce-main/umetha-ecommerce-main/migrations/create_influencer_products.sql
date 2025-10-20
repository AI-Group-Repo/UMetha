-- Create influencer_products table
CREATE TABLE IF NOT EXISTS public.influencer_products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  category_id TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),
  tags TEXT[] DEFAULT '{}',
  weight DECIMAL(8,2),
  dimensions JSONB DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  influencer_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on influencer_id for faster queries
CREATE INDEX IF NOT EXISTS idx_influencer_products_influencer_id ON public.influencer_products(influencer_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_influencer_products_status ON public.influencer_products(status);

-- Create index on category_id for filtering
CREATE INDEX IF NOT EXISTS idx_influencer_products_category_id ON public.influencer_products(category_id);

-- Create index on featured for featured products
CREATE INDEX IF NOT EXISTS idx_influencer_products_featured ON public.influencer_products(featured);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_influencer_products_created_at ON public.influencer_products(created_at);

-- Add foreign key constraint to profiles table (assuming profiles table exists)
-- ALTER TABLE public.influencer_products 
-- ADD CONSTRAINT fk_influencer_products_influencer_id 
-- FOREIGN KEY (influencer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Create product_images storage bucket (if using Supabase Storage)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Create RLS policies for influencer_products
ALTER TABLE public.influencer_products ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own products
CREATE POLICY "Users can view their own products" ON public.influencer_products
  FOR SELECT USING (influencer_id = auth.uid());

-- Policy: Users can insert their own products
CREATE POLICY "Users can insert their own products" ON public.influencer_products
  FOR INSERT WITH CHECK (influencer_id = auth.uid());

-- Policy: Users can update their own products
CREATE POLICY "Users can update their own products" ON public.influencer_products
  FOR UPDATE USING (influencer_id = auth.uid());

-- Policy: Users can delete their own products
CREATE POLICY "Users can delete their own products" ON public.influencer_products
  FOR DELETE USING (influencer_id = auth.uid());

-- Policy: Public can view active products
CREATE POLICY "Public can view active products" ON public.influencer_products
  FOR SELECT USING (status = 'active');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_influencer_products_updated_at 
  BEFORE UPDATE ON public.influencer_products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
