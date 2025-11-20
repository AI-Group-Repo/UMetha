-- Add business model preferences for influencers
-- Influencers can choose 1-2 of: AI Dropshipping, Direct Marketplace, Affiliate Marketing

-- Add business model columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS business_models TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS store_settings JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS clickbank_settings JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS cj_settings JSONB DEFAULT '{}'::jsonb;

-- Create index for faster queries on business models
CREATE INDEX IF NOT EXISTS idx_profiles_business_models ON profiles USING GIN(business_models);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed ON profiles(onboarding_completed);

-- Add comment to explain the schema
COMMENT ON COLUMN profiles.business_models IS 'Array of business models: ai_dropshipping, direct_marketplace, affiliate_marketing. Must have 1-2 options.';
COMMENT ON COLUMN profiles.store_settings IS 'JSON object containing store customization settings';
COMMENT ON COLUMN profiles.clickbank_settings IS 'JSON object containing ClickBank integration settings';
COMMENT ON COLUMN profiles.cj_settings IS 'JSON object containing CJ Dropshipping settings';

-- Create a function to validate business models
CREATE OR REPLACE FUNCTION validate_business_models()
RETURNS TRIGGER AS $$
BEGIN
  -- Check that business_models has 1 or 2 elements, not 0 or 3+
  IF array_length(NEW.business_models, 1) IS NULL OR 
     array_length(NEW.business_models, 1) < 1 OR 
     array_length(NEW.business_models, 1) > 2 THEN
    RAISE EXCEPTION 'Influencers must select 1 or 2 business models, not % models', 
      COALESCE(array_length(NEW.business_models, 1), 0);
  END IF;
  
  -- Check that only valid business model types are used
  IF NOT (NEW.business_models <@ ARRAY['ai_dropshipping', 'direct_marketplace', 'affiliate_marketing']::TEXT[]) THEN
    RAISE EXCEPTION 'Invalid business model. Must be one of: ai_dropshipping, direct_marketplace, affiliate_marketing';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate business models (only for influencers)
DROP TRIGGER IF EXISTS validate_influencer_business_models ON profiles;
CREATE TRIGGER validate_influencer_business_models
  BEFORE INSERT OR UPDATE OF business_models ON profiles
  FOR EACH ROW
  WHEN (NEW.role = 'INFLUENCER' AND NEW.business_models IS NOT NULL AND array_length(NEW.business_models, 1) > 0)
  EXECUTE FUNCTION validate_business_models();

-- Add sample test data for the influencer test account
UPDATE profiles 
SET 
  business_models = ARRAY['ai_dropshipping', 'direct_marketplace'],
  onboarding_completed = TRUE,
  store_settings = '{"theme": "modern", "colors": {"primary": "#6366F1", "secondary": "#8B5CF6"}}'::jsonb
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'influencer@umetha.com'
);

-- Verify the update
SELECT 
  auth.users.email,
  profiles.role,
  profiles.business_models,
  profiles.onboarding_completed
FROM 
  profiles
JOIN 
  auth.users ON profiles.id = auth.users.id
WHERE 
  auth.users.email = 'influencer@umetha.com';

