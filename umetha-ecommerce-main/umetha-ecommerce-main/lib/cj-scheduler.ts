import { syncCJProducts } from "./cj-dropshipping";

/**
 * CJ Dropshipping Product Scheduler
 * Handles automatic syncing of products from CJ Dropshipping
 */

export interface SyncConfig {
  keywords: string[];
  productsPerKeyword: number;
  intervalHours: number;
  enabled: boolean;
}

const DEFAULT_CONFIG: SyncConfig = {
  keywords: ["fashion", "electronics", "home", "beauty", "sports"],
  productsPerKeyword: 15,
  intervalHours: 6, // Sync every 6 hours
  enabled: true,
};

let syncInterval: NodeJS.Timeout | null = null;
let isRunning = false;

/**
 * Start the automatic sync scheduler
 */
export function startCJSync(config: Partial<SyncConfig> = {}): void {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  if (!finalConfig.enabled) {
    console.log("⏸️ CJ sync scheduler is disabled");
    return;
  }

  if (syncInterval) {
    console.log("⚠️ CJ sync scheduler is already running");
    return;
  }

  console.log("🚀 Starting CJ Dropshipping sync scheduler");
  console.log(`📅 Sync interval: every ${finalConfig.intervalHours} hours`);
  console.log(`🔍 Keywords: ${finalConfig.keywords.join(", ")}`);
  console.log(`📦 Products per keyword: ${finalConfig.productsPerKeyword}`);

  // Run initial sync
  runSync(finalConfig);

  // Set up interval
  syncInterval = setInterval(() => {
    runSync(finalConfig);
  }, finalConfig.intervalHours * 60 * 60 * 1000); // Convert hours to milliseconds
}

/**
 * Stop the automatic sync scheduler
 */
export function stopCJSync(): void {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    console.log("⏹️ CJ sync scheduler stopped");
  } else {
    console.log("⚠️ CJ sync scheduler is not running");
  }
}

/**
 * Run a single sync operation
 */
async function runSync(config: SyncConfig): Promise<void> {
  if (isRunning) {
    console.log("⏳ Sync already in progress, skipping this cycle");
    return;
  }

  isRunning = true;
  const startTime = Date.now();

  try {
    console.log(`\n🔄 Starting scheduled CJ sync at ${new Date().toISOString()}`);
    
    const result = await syncCJProducts(config.keywords, config.productsPerKeyword);
    
    const duration = Date.now() - startTime;
    console.log(`✅ Scheduled sync completed in ${duration}ms`);
    console.log(`📊 Results: ${result.totalProducts} products synced, ${result.errors.length} errors`);
    
    if (result.errors.length > 0) {
      console.log("❌ Errors encountered:");
      result.errors.forEach(error => console.log(`  - ${error}`));
    }

  } catch (error: any) {
    console.error("❌ Scheduled sync failed:", error.message);
  } finally {
    isRunning = false;
  }
}

/**
 * Get sync status
 */
export function getSyncStatus(): {
  isRunning: boolean;
  hasInterval: boolean;
  isEnabled: boolean;
} {
  return {
    isRunning,
    hasInterval: syncInterval !== null,
    isEnabled: DEFAULT_CONFIG.enabled,
  };
}

/**
 * Force run a sync operation (bypasses the running check)
 */
export async function forceSync(config: Partial<SyncConfig> = {}): Promise<{
  success: boolean;
  totalProducts: number;
  errors: string[];
}> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  console.log("🔄 Force sync requested");
  return await syncCJProducts(finalConfig.keywords, finalConfig.productsPerKeyword);
}

/**
 * Update sync configuration
 */
export function updateSyncConfig(newConfig: Partial<SyncConfig>): void {
  const updatedConfig = { ...DEFAULT_CONFIG, ...newConfig };
  
  console.log("⚙️ Updating sync configuration:", updatedConfig);
  
  // Restart scheduler with new config
  stopCJSync();
  startCJSync(updatedConfig);
}

