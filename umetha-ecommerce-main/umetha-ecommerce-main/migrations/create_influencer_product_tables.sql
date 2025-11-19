-- Create table for influencer's own products (Direct Marketplace)
CREATE TABLE IF NOT EXISTS public.influencer_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  category TEXT,
  stock INT DEFAULT 0,
  sku TEXT,
  courier_service TEXT,
  shipping_cost DECIMAL(10, 2),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for ClickBank product approvals (Affiliate Marketing)
CREATE TABLE IF NOT EXISTS public.influencer_clickbank_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_data JSONB,
  approved BOOLEAN DEFAULT false,
  approved_at TIMESTAMP WITH TIME ZONE,
  displayed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(influencer_id, product_id)
);

-- Create table for CJ Dropshipping product mappings (AI Dropshipping)
CREATE TABLE IF NOT EXISTS public.influencer_cj_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cj_product_id TEXT NOT NULL,
  product_data JSONB,
  active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(influencer_id, cj_product_id)
);

-- Create table for ClickBank sync logs
CREATE TABLE IF NOT EXISTS public.clickbank_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sync_completed_at TIMESTAMP WITH TIME ZONE,
  products_fetched INT DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'success', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_influencer_products_influencer_id ON influencer_products(influencer_id);
CREATE INDEX IF NOT EXISTS idx_influencer_products_active ON influencer_products(active);
CREATE INDEX IF NOT EXISTS idx_influencer_clickbank_products_influencer_id ON influencer_clickbank_products(influencer_id);
CREATE INDEX IF NOT EXISTS idx_influencer_clickbank_products_approved ON influencer_clickbank_products(approved);
CREATE INDEX IF NOT EXISTS idx_influencer_cj_products_influencer_id ON influencer_cj_products(influencer_id);

-- Enable RLS
ALTER TABLE influencer_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_clickbank_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_cj_products ENABLE ROW LEVEL SECURITY;

-- Create policies for influencer_products
CREATE POLICY "Influencers can view their own products"
  ON influencer_products FOR SELECT
  USING (auth.uid() = influencer_id);

CREATE POLICY "Influencers can insert their own products"
  ON influencer_products FOR INSERT
  WITH CHECK (auth.uid() = influencer_id);

CREATE POLICY "Influencers can update their own products"
  ON influencer_products FOR UPDATE
  USING (auth.uid() = influencer_id);

CREATE POLICY "Influencers can delete their own products"
  ON influencer_products FOR DELETE
  USING (auth.uid() = influencer_id);

-- Create policies for influencer_clickbank_products
CREATE POLICY "Influencers can view their ClickBank approvals"
  ON influencer_clickbank_products FOR SELECT
  USING (auth.uid() = influencer_id);

CREATE POLICY "Influencers can manage their ClickBank approvals"
  ON influencer_clickbank_products FOR ALL
  USING (auth.uid() = influencer_id);

-- Create policies for influencer_cj_products
CREATE POLICY "Influencers can view their CJ products"
  ON influencer_cj_products FOR SELECT
  USING (auth.uid() = influencer_id);

CREATE POLICY "Influencers can manage their CJ products"
  ON influencer_cj_products FOR ALL
  USING (auth.uid() = influencer_id);

-- Create function to automatically update stock when product is sold
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- When an order item is created, decrease the stock
  UPDATE influencer_products
  SET stock = stock - NEW.quantity,
      updated_at = now()
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic stock updates (if order_items table exists)
-- CREATE TRIGGER update_stock_on_order
-- AFTER INSERT ON order_items
-- FOR EACH ROW
-- EXECUTE FUNCTION update_product_stock();

COMMENT ON TABLE influencer_products IS 'Products added by influencers for direct marketplace';
COMMENT ON TABLE influencer_clickbank_products IS 'ClickBank affiliate products approved by influencers';
COMMENT ON TABLE influencer_cj_products IS 'CJ Dropshipping products selected by influencers';

