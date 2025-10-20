import cron from 'node-cron';
import { syncTrendingProducts } from './cj-dropshipping';

/**
 * CJ Dropshipping Cron Scheduler
 * Handles automatic syncing of trending products every midnight
 */

let isRunning = false;
let cronJob: cron.ScheduledTask | null = null;

/**
 * Start the midnight cron job for trending products
 */
export function startTrendingProductsCron(): void {
  if (cronJob) {
    console.log("⚠️ Trending products cron job is already running");
    return;
  }

  console.log("🕓 Starting CJ trending products cron job...");
  console.log("⏰ Scheduled to run every midnight (00:00)");

  // Schedule to run every midnight
  cronJob = cron.schedule("0 0 * * *", async () => {
    if (isRunning) {
      console.log("⏳ Trending products sync already in progress, skipping this cycle");
      return;
    }

    isRunning = true;
    console.log("\n🕛 Midnight cron job triggered - syncing trending products...");

    try {
      const result = await syncTrendingProducts(50); // Sync 50 trending products
      
      if (result.success) {
        console.log(`✅ Midnight sync completed: ${result.totalProducts} products synced`);
      } else {
        console.log(`⚠️ Midnight sync completed with ${result.errors.length} errors:`);
        result.errors.forEach(error => console.log(`  - ${error}`));
      }
    } catch (error: any) {
      console.error("❌ Midnight sync failed:", error.message);
    } finally {
      isRunning = false;
    }
  }, {
    scheduled: true,
    timezone: "UTC"
  });

  console.log("✅ Trending products cron job started successfully");
}

/**
 * Stop the midnight cron job
 */
export function stopTrendingProductsCron(): void {
  if (cronJob) {
    cronJob.stop();
    cronJob = null;
    console.log("⏹️ Trending products cron job stopped");
  } else {
    console.log("⚠️ No trending products cron job is running");
  }
}

/**
 * Get cron job status
 */
export function getCronStatus(): {
  isRunning: boolean;
  hasCronJob: boolean;
  nextRun?: Date;
} {
  return {
    isRunning,
    hasCronJob: cronJob !== null,
    nextRun: cronJob ? cronJob.nextDate() : undefined
  };
}

/**
 * Run trending products sync immediately (for testing)
 */
export async function runTrendingProductsSyncNow(): Promise<{
  success: boolean;
  totalProducts: number;
  errors: string[];
}> {
  console.log("🔄 Running trending products sync immediately...");
  return await syncTrendingProducts(50);
}

/**
 * Initialize the cron scheduler
 * This should be called when the application starts
 */
export function initializeCJCronScheduler(): void {
  console.log("🚀 Initializing CJ Dropshipping cron scheduler...");
  
  // Start the cron job
  startTrendingProductsCron();
  
  // Run initial sync immediately
  console.log("💡 Running initial trending products sync...");
  runTrendingProductsSyncNow().then(result => {
    if (result.success) {
      console.log(`✅ Initial sync completed: ${result.totalProducts} products synced`);
    } else {
      console.log(`⚠️ Initial sync completed with ${result.errors.length} errors`);
    }
  }).catch(error => {
    console.error("❌ Initial sync failed:", error.message);
  });
}

// Export the sync function for manual use
export { syncTrendingProducts };

