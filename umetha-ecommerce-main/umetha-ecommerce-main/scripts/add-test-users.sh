#!/bin/bash

# UMetha Dashboard Test Users Creation Script
# This script adds test users for admin, seller, and influencer roles

# Load environment variables from .env file if present
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | sed 's/\r$//' | xargs)
fi

# Check if required variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo "Error: Missing Supabase credentials"
  echo "Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file"
  exit 1
fi

echo "UMetha Dashboard Test Users Creation"
echo "====================================="
echo "This script will create test users for the UMetha dashboard"
echo "URL: $NEXT_PUBLIC_SUPABASE_URL"
echo

echo "Creating profiles table if it doesn't exist..."
curl -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/rpc/create_profiles_table" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json"
echo

# Function to create a user account
create_user() {
  local email=$1
  local password=$2
  local role=$3
  local full_name=$4
  
  echo "Creating $role user: $email"
  
  # 1. Create user in Auth
  local user_response=$(curl -s -X POST "$NEXT_PUBLIC_SUPABASE_URL/auth/v1/signup" \
    -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$email\",\"password\":\"$password\"}")
  
  local user_id=$(echo $user_response | jq -r '.id')
  
  if [ "$user_id" = "null" ]; then
    echo "Failed to create user. Error message: $(echo $user_response | jq -r '.message')"
    return 1
  fi
  
  echo "User created with ID: $user_id"
  
  # 2. Create profile with role
  local profile_response=$(curl -s -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/profiles" \
    -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=representation" \
    -d "{\"id\":\"$user_id\",\"role\":\"$role\",\"full_name\":\"$full_name\",\"updated_at\":\"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"}")
  
  echo "Profile created successfully for $email with role $role"
  echo
}

# Create admin user
create_user "admin@umetha.com" "admin123" "ADMIN" "Admin User"

# Create seller user
create_user "seller@umetha.com" "seller123" "SELLER" "Seller Account"

# Create influencer user
create_user "influencer@umetha.com" "influencer123" "INFLUENCER" "Influencer Account"

echo "Test users creation completed!"
echo "You can now sign in to the dashboard with any of these accounts:"
echo "- Admin: admin@umetha.com / admin123"
echo "- Seller: seller@umetha.com / seller123"
echo "- Influencer: influencer@umetha.com / influencer123"