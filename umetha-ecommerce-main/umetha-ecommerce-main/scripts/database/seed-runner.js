// This is a simple JavaScript file that will import our TypeScript seeding code
// We'll execute this using Node with the TypeScript loader

// Set the environment variables for Supabase connection
// Make sure these match your .env.local values
process.env.NEXT_PUBLIC_SUPABASE_URL =
  "https://mhkyibdilmpvazhszczv.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZHdycnNxamRseGZ3anFhbXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MzkzNDUsImV4cCI6MjA3NjAxNTM0NX0._4EEFOEIJ6vZMc0aGbgXfmmVi-WedTX6HpTDW4dLeOs";

// Import the seed function
import("../database/seed-products.ts")
  .then((module) => {
    // Execute the seed function
    return module.seedProducts();
  })
  .then((result) => {
    console.log("Seeding completed:", result);
    // Exit after seeding completes
    setTimeout(() => process.exit(0), 1000);
  })
  .catch((error) => {
    console.error("Failed to seed products:", error);
    process.exit(1);
  });
