const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

// Get Supabase URL and key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if credentials are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase credentials. Make sure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file'
  );
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupTestAccounts() {
  try {
    console.log('Setting up test accounts with proper roles...\n');

    // Test accounts configuration
    const testAccounts = [
      { email: 'admin@umetha.com', password: 'admin123', role: 'ADMIN' },
      { email: 'seller@umetha.com', password: 'seller123', role: 'SELLER' },
      { email: 'influencer@umetha.com', password: 'influencer123', role: 'INFLUENCER' }
    ];

    for (const account of testAccounts) {
      console.log(`\nProcessing ${account.email}...`);

      // Try to sign up the user (will fail if already exists)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: account.email,
        password: account.password,
        options: {
          data: { role: account.role }
        }
      });

      if (signUpError && !signUpError.message.includes('already registered')) {
        console.error(`  Error signing up ${account.email}:`, signUpError.message);
        continue;
      }

      if (!signUpError) {
        console.log(`  ✓ Created new account: ${account.email}`);
      } else {
        console.log(`  ℹ Account already exists: ${account.email}`);
      }

      // Now ensure the profile has the correct role
      // First, get the user ID by email
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.log('  ⚠ Could not list users (normal for anon key). Role will be set on next sign-in.');
        continue;
      }

      const user = users?.find(u => u.email === account.email);
      
      if (user) {
        // Update the profile with the correct role
        const { error: updateError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: account.email,
            role: account.role,
            updated_at: new Date().toISOString()
          });

        if (updateError) {
          console.log(`  ⚠ Could not update profile role: ${updateError.message}`);
        } else {
          console.log(`  ✓ Set role to ${account.role}`);
        }
      }
    }

    console.log('\n✅ Test accounts setup complete!');
    console.log('\nYou can now sign in with:');
    testAccounts.forEach(account => {
      console.log(`  ${account.email} / ${account.password} (${account.role})`);
    });

  } catch (error) {
    console.error('Error setting up test accounts:', error);
  }
}

setupTestAccounts().catch(console.error);

