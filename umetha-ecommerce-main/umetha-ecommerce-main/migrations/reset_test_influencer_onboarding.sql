-- Reset test influencer account to show onboarding again
-- Use this during testing to reset the onboarding flow

-- Reset the test influencer account
UPDATE profiles 
SET 
  onboarding_completed = FALSE,
  business_models = '{}',
  updated_at = now()
WHERE id = 'test-influencer-id';

-- Verify the reset
SELECT 
  id,
  email,
  role,
  onboarding_completed,
  business_models,
  updated_at
FROM profiles 
WHERE id = 'test-influencer-id';

-- Alternative: Delete the profile to force recreation on next login
-- DELETE FROM profiles WHERE id = 'test-influencer-id';

-- To see all test account profiles:
-- SELECT * FROM profiles WHERE id LIKE 'test-%';

