/**
 * ClickBank Auto-Sync Scheduler
 * Automatically syncs ClickBank products every 24 hours
 */

import { fetchTrendingClickBankProducts } from "./clickbank";
import { supabase } from "./supabase";

export interface SyncResult {
  success: boolean;
  productsFetched: number;
  errors: string[];
}

/**
 * Sync ClickBank products for all influencers
 * This function should be called by a cron job every 24 hours
 */
export async function syncClickBankProductsForAll(): Promise<SyncResult> {
  console.log("\n==============================");
  console.log(`🕐 Starting ClickBank product sync at ${new Date().toLocaleString()}`);
  console.log("==============================");

  const errors: string[] = [];
  let productsFetched = 0;

  try {
    // Create sync log entry
    const { data: syncLog, error: logError } = await supabase
      .from("clickbank_sync_logs")
      .insert({
        sync_started_at: new Date().toISOString(),
        status: "pending",
      })
      .select()
      .single();

    if (logError) {
      console.error("❌ Error creating sync log:", logError);
      errors.push(logError.message);
    }

    // Fetch trending products from ClickBank
    const products = await fetchTrendingClickBankProducts(50);
    productsFetched = products.length;

    console.log(`📦 Fetched ${productsFetched} products from ClickBank`);

    // Get all influencers who have affiliate marketing enabled
    const { data: influencers, error: influencersError } = await supabase
      .from("profiles")
      .select("id, email, business_models")
      .contains("business_models", ["affiliate_marketing"])
      .eq("role", "INFLUENCER");

    if (influencersError) {
      console.error("❌ Error fetching influencers:", influencersError);
      errors.push(influencersError.message);
    } else {
      console.log(`👥 Found ${influencers?.length || 0} influencers with affiliate marketing`);

      // For each influencer, save the new products for approval
      if (influencers && influencers.length > 0) {
        for (const influencer of influencers) {
          try {
            // Save products for this influencer's approval
            const productsToInsert = products.map((product) => ({
              influencer_id: influencer.id,
              product_id: product.id,
              product_data: product,
              approved: false, // Requires influencer approval
              created_at: new Date().toISOString(),
            }));

            // Use upsert to avoid duplicates
            const { error: insertError } = await supabase
              .from("influencer_clickbank_products")
              .upsert(productsToInsert, {
                onConflict: "influencer_id,product_id",
                ignoreDuplicates: true,
              });

            if (insertError) {
              console.error(`❌ Error inserting products for ${influencer.email}:`, insertError);
              errors.push(`${influencer.email}: ${insertError.message}`);
            } else {
              console.log(`✅ Products added for approval: ${influencer.email}`);
            }
          } catch (error: any) {
            console.error(`❌ Error processing influencer ${influencer.email}:`, error);
            errors.push(`${influencer.email}: ${error.message}`);
          }
        }
      }
    }

    // Update sync log
    if (syncLog) {
      await supabase
        .from("clickbank_sync_logs")
        .update({
          sync_completed_at: new Date().toISOString(),
          products_fetched: productsFetched,
          status: errors.length === 0 ? "success" : "failed",
          error_message: errors.length > 0 ? errors.join("; ") : null,
        })
        .eq("id", syncLog.id);
    }

    console.log("✅ ClickBank sync completed successfully!");
    console.log("==============================\n");

    return {
      success: errors.length === 0,
      productsFetched,
      errors,
    };
  } catch (error: any) {
    console.error("❌ Fatal error in ClickBank sync:", error);
    errors.push(error.message);

    return {
      success: false,
      productsFetched: 0,
      errors,
    };
  }
}

/**
 * Schedule ClickBank sync to run every 24 hours
 * This can be called from a cron job endpoint or Vercel Cron
 */
export function scheduleClickBankSync() {
  // For Vercel Cron or similar services, this function should be exposed via API route
  // Example: /api/cron/clickbank-sync
  
  // For local development with setInterval (not recommended for production)
  if (process.env.NODE_ENV === "development" && process.env.ENABLE_LOCAL_CRON === "true") {
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    
    setInterval(async () => {
      await syncClickBankProductsForAll();
    }, TWENTY_FOUR_HOURS);

    console.log("✅ ClickBank sync scheduler started (24-hour interval)");
  }
}

