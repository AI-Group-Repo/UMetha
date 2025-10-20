-- Step 1: Update the Role enum to include the new roles
ALTER TYPE "Role" RENAME TO "Role_old";
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'INFLUENCER', 'SELLER');

-- Step 2: Update the User table to use the new enum
ALTER TABLE "User" 
  ALTER COLUMN role TYPE "Role" USING role::text::"Role";

-- Step 3: Drop the old enum
DROP TYPE "Role_old";

-- Step 4: Update Thabo's user account to have ADMIN role
UPDATE "User"
SET role = 'ADMIN'
WHERE email = 'thabochambule@outlook.com';