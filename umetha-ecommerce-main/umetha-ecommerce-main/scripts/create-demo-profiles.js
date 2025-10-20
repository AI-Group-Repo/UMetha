// Script to create demo profiles for the UMetha dashboard
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config(); // Add this to load environment variables from .env file

// Get Supabase credentials from environment variables or use the ones from your current project
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if we have valid credentials
if (
  !supabaseUrl ||
  !supabaseServiceKey ||
  supabaseUrl === "YOUR_SUPABASE_URL"
) {
  console.error("Error: Missing or invalid Supabase credentials");
  console.error(
    "Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env file"
  );
  console.error("Or run this command with:");
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL=your_url SUPABASE_SERVICE_KEY=your_key node scripts/create-demo-profiles.js"
  );
  process.exit(1);
}

console.log(`Using Supabase URL: ${supabaseUrl}`);

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const demoUsers = [
  {
    email: "admin@umetha.com",
    password: "admin123",
    role: "ADMIN",
    data: {
      full_name: "Admin User",
      avatar_url: "",
      bio: "System administrator responsible for overall platform management.",
    },
  },
  {
    email: "seller@umetha.com",
    password: "seller123",
    role: "SELLER",
    data: {
      full_name: "Seller Account",
      avatar_url: "",
      bio: "Seller account for managing products and orders.",
      company_name: "LuxeStyle Fashion",
      store_description:
        "Premium fashion and accessories for the modern lifestyle.",
      location: "New York, USA",
      contact_phone: "+1234567890",
    },
  },
  {
    email: "influencer@umetha.com",
    password: "influencer123",
    role: "INFLUENCER",
    data: {
      full_name: "Influencer Account",
      avatar_url: "",
      bio: "Fashion influencer specializing in premium lifestyle content.",
      social_media: {
        instagram: "@umetha_influencer",
        tiktok: "@umethainfluencer",
        youtube: "UMethaInfluencerOfficial",
      },
      categories: ["Fashion", "Lifestyle", "Beauty"],
      followers_count: 150000,
      engagement_rate: "4.7%",
    },
  },
];

async function createDemoProfiles() {
  console.log("Starting demo profile creation...");

  for (const user of demoUsers) {
    console.log(`Creating profile for ${user.email}...`);

    try {
      // 1. Create user in Auth
      const { data: authUser, error: authError } =
        await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true, // Auto-confirm the email
          user_metadata: user.data,
        });

      if (authError) {
        console.error(`Error creating auth user ${user.email}:`, authError);
        continue;
      }

      console.log(
        `Auth user created for ${user.email} with ID: ${authUser.user.id}`
      );

      // 2. Create profile in profiles table with role
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: authUser.user.id,
        role: user.role,
        ...user.data,
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error(
          `Error creating profile for ${user.email}:`,
          profileError
        );
      } else {
        console.log(
          `Profile created successfully for ${user.email} with role ${user.role}`
        );
      }

      // 3. Add role-specific data if needed
      if (user.role === "SELLER") {
        // Create seller-specific entry
        const { error: sellerError } = await supabase.from("sellers").upsert({
          user_id: authUser.user.id,
          company_name: user.data.company_name,
          description: user.data.store_description,
          location: user.data.location,
          contact_email: user.email,
          contact_phone: user.data.contact_phone,
          status: "active",
          verified: true,
          created_at: new Date().toISOString(),
        });

        if (sellerError) {
          console.error(`Error creating seller record:`, sellerError);
        } else {
          console.log(`Seller record created successfully for ${user.email}`);
        }
      }

      if (user.role === "INFLUENCER") {
        // Create influencer-specific entry
        const { error: influencerError } = await supabase
          .from("influencers")
          .upsert({
            user_id: authUser.user.id,
            social_media: user.data.social_media,
            categories: user.data.categories,
            followers_count: user.data.followers_count,
            engagement_rate: user.data.engagement_rate,
            status: "active",
            verified: true,
            created_at: new Date().toISOString(),
          });

        if (influencerError) {
          console.error(`Error creating influencer record:`, influencerError);
        } else {
          console.log(
            `Influencer record created successfully for ${user.email}`
          );
        }
      }
    } catch (error) {
      console.error(`Unexpected error processing ${user.email}:`, error);
    }
  }

  console.log("Demo profile creation completed!");
}

createDemoProfiles().catch((err) => {
  console.error("Fatal error during profile creation:", err);
  process.exit(1);
});
