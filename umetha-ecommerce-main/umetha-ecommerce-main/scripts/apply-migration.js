#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

// Get Supabase URL and key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use the anon key instead of the service key
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if credentials are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase credentials. Make sure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file"
  );
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to execute SQL directly instead of using RPC
async function applyMigration(migrationFile) {
  try {
    console.log(`Applying migration from ${migrationFile}...`);

    // Read SQL from file
    const migrationSQL = fs.readFileSync(migrationFile, "utf8");

    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(";")
      .filter((stmt) => stmt.trim().length > 0);

    console.log(`Found ${statements.length} SQL statements to execute.`);

    // Execute each statement individually
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);

      const { error } = await supabase.rpc("exec_sql", {
        sql: statement + ";",
      });

      if (error) {
        // If there's an error with RPC method, try direct SQL
        console.log("RPC method failed, trying direct SQL execution...");
        const { error: sqlError } = await supabase.sql(statement + ";");

        if (sqlError) {
          throw new Error(`SQL execution failed: ${sqlError.message}`);
        }
      }
    }

    console.log(
      `Migration from ${path.basename(migrationFile)} applied successfully!`
    );
    return true;
  } catch (error) {
    console.error(`Error applying migration: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  const migrationFile = process.argv[2];

  if (!migrationFile) {
    console.error("Please provide a migration file path");
    console.log("Usage: node apply-migration.js <path-to-migration-file.sql>");
    process.exit(1);
  }

  if (!fs.existsSync(migrationFile)) {
    console.error(`Migration file not found: ${migrationFile}`);
    process.exit(1);
  }

  const success = await applyMigration(migrationFile);

  if (success) {
    console.log("Migration completed successfully.");
  } else {
    console.error("Migration failed.");
    process.exit(1);
  }
}

main();
