-- ============================================
-- IMPORTANT: Run this in Supabase SQL Editor
-- This adds the columns and refreshes the schema cache
-- ============================================

-- Step 1: Add the columns if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS business_models TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS store_settings JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS clickbank_settings JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS cj_settings JSONB DEFAULT '{}'::jsonb;

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_business_models ON profiles USING GIN(business_models);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed ON profiles(onboarding_completed);

-- Step 3: Add comments
COMMENT ON COLUMN profiles.business_models IS 'Array of business models: ai_dropshipping, direct_marketplace, affiliate_marketing. Must have 1-2 options.';
COMMENT ON COLUMN profiles.onboarding_completed IS 'Whether the influencer has completed the onboarding process';

-- Step 4: CRITICAL - Force Supabase to refresh its schema cache
-- This is done by performing a dummy operation that forces cache invalidation
DO $$
BEGIN
    -- This forces PostgREST to reload the schema
    NOTIFY pgrst, 'reload schema';
END $$;

-- Step 5: Verify the columns exist
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' 
AND column_name IN ('business_models', 'onboarding_completed', 'store_settings', 'clickbank_settings', 'cj_settings')
ORDER BY column_name;

-- Step 6: Create a test profile for the demo account
INSERT INTO profiles (
    id, 
    email, 
    role, 
    onboarding_completed, 
    business_models,
    created_at,
    updated_at
)
VALUES (
    'test-influencer-id',
    'influencer@umetha.com',
    'INFLUENCER',
    FALSE,
    '{}',
    now(),
    now()
)
ON CONFLICT (id) 
DO UPDATE SET
    onboarding_completed = FALSE,
    business_models = '{}',
    updated_at = now();

-- Step 7: Verify the test profile was created
SELECT 
    id,
    email,
    role,
    onboarding_completed,
    business_models,
    created_at
FROM profiles
WHERE id = 'test-influencer-id';

-- ============================================
-- IMPORTANT NEXT STEPS:
-- 1. After running this, wait 5-10 seconds
-- 2. Refresh your application
-- 3. Clear browser cache
-- 4. Try signing in again
-- ============================================

