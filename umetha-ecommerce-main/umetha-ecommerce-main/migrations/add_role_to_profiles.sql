-- Step 1: Add a role column to the profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'USER';

-- Step 2: Create an index on the role column for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Step 3: Update Thabo's profile to have ADMIN role
UPDATE profiles 
SET role = 'ADMIN'
FROM auth.users
WHERE profiles.id = auth.users.id 
AND auth.users.email = 'thabochambule@outlook.com';

-- Verify the update
SELECT 
  auth.users.email,
  profiles.role
FROM 
  profiles
JOIN 
  auth.users ON profiles.id = auth.users.id
WHERE 
  auth.users.email = 'thabochambule@outlook.com';