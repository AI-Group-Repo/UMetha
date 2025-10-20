# How to Get Your Supabase API Keys

To connect to your Supabase database, you need to get the correct API keys from your Supabase dashboard:

## Steps to Get API Keys:

1. **Go to your Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Sign in to your account

2. **Select Your Project:**
   - Find your project (the one with URL: zgdwrrsqjdlxfwjqamxk.supabase.co)
   - Click on it to open the project dashboard

3. **Get the API Keys:**
   - In the left sidebar, click on "Settings" (gear icon)
   - Click on "API" in the settings menu
   - You'll see two important keys:
     - **Project URL**: `https://zgdwrrsqjdlxfwjqamxk.supabase.co` (you already have this)
     - **anon public key**: This is the key that starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
     - **service_role secret key**: This is the key that starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (longer key)

4. **Update the Configuration:**
   - Copy the `anon public key` and replace the placeholder in `lib/supabase.ts`
   - Copy the `service_role secret key` if you need it for server-side operations

## Current Configuration Status:
- ✅ Database URL: `postgresql://postgres:[David@0712057102]@db.zgdwrrsqjdlxfwjqamxk.supabase.co:5432/postgres`
- ✅ Supabase URL: `https://zgdwrrsqjdlxfwjqamxk.supabase.co`
- ❌ API Key: Need to get the correct anon key from dashboard

## Next Steps:
1. Get your API keys from the Supabase dashboard
2. Update the `supabaseAnonKey` in `lib/supabase.ts` with your actual anon key
3. Run the seeding script again to populate your database with sample products
4. Test the products page to see your products displayed with language switching

## Security Note:
- The `anon` key is safe to use in client-side code
- The `service_role` key should only be used in server-side code and kept secret
- Never commit these keys to version control - use environment variables in production
