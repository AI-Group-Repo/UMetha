-- Migration to setup test accounts with correct roles
-- This ensures demo accounts have the proper role assigned

-- Step 1: Ensure the role column exists in profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'USER';

-- Step 2: Create an index on the role column for better performance (if not exists)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Step 3: Update test accounts with their correct roles
-- Note: These updates will only work if the users exist in auth.users

-- Update admin test account
UPDATE profiles 
SET role = 'ADMIN'
FROM auth.users
WHERE profiles.id = auth.users.id 
AND auth.users.email = 'admin@umetha.com';

-- Update seller test account
UPDATE profiles 
SET role = 'SELLER'
FROM auth.users
WHERE profiles.id = auth.users.id 
AND auth.users.email = 'seller@umetha.com';

-- Update influencer test account
UPDATE profiles 
SET role = 'INFLUENCER'
FROM auth.users
WHERE profiles.id = auth.users.id 
AND auth.users.email = 'influencer@umetha.com';

-- Step 4: Verify the updates
SELECT 
  auth.users.email,
  profiles.role,
  profiles.created_at
FROM 
  profiles
JOIN 
  auth.users ON profiles.id = auth.users.id
WHERE 
  auth.users.email IN ('admin@umetha.com', 'seller@umetha.com', 'influencer@umetha.com')
ORDER BY 
  auth.users.email;

