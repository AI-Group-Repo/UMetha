import { NextRequest, NextResponse } from "next/server";
import { 
  startCJSync, 
  stopCJSync, 
  getSyncStatus, 
  forceSync, 
  updateSyncConfig 
} from "@/lib/cj-scheduler";
import { successResponse, errorResponse, serverErrorResponse } from "@/lib/api-utils";

/**
 * CJ Dropshipping Sync Scheduler Management API
 * 
 * This endpoint manages the automatic syncing of products from CJ Dropshipping
 * 
 * GET /api/sync/scheduler - Get current sync status
 * POST /api/sync/scheduler/start - Start the sync scheduler
 * POST /api/sync/scheduler/stop - Stop the sync scheduler
 * POST /api/sync/scheduler/force - Force run a sync operation
 * PUT /api/sync/scheduler/config - Update sync configuration
 */
export async function GET(req: NextRequest) {
  try {
    const status = getSyncStatus();
    
    return successResponse({
      message: "Sync scheduler status retrieved",
      status: status,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Scheduler status error:", error);
    return serverErrorResponse("Failed to get scheduler status");
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action") || "start";
    const body = await req.json().catch(() => ({}));

    switch (action) {
      case "start":
        const startConfig = {
          keywords: body.keywords || ["fashion", "electronics", "home", "beauty"],
          productsPerKeyword: body.productsPerKeyword || 15,
          intervalHours: body.intervalHours || 6,
          enabled: body.enabled !== false
        };
        
        startCJSync(startConfig);
        
        return successResponse({
          message: "Sync scheduler started",
          config: startConfig,
          timestamp: new Date().toISOString()
        });

      case "stop":
        stopCJSync();
        
        return successResponse({
          message: "Sync scheduler stopped",
          timestamp: new Date().toISOString()
        });

      case "force":
        const forceConfig = {
          keywords: body.keywords || ["fashion", "electronics", "home", "beauty"],
          productsPerKeyword: body.productsPerKeyword || 15
        };
        
        const result = await forceSync(forceConfig);
        
        return successResponse({
          message: "Force sync completed",
          result: result,
          config: forceConfig,
          timestamp: new Date().toISOString()
        });

      case "config":
        const newConfig = {
          keywords: body.keywords,
          productsPerKeyword: body.productsPerKeyword,
          intervalHours: body.intervalHours,
          enabled: body.enabled
        };
        
        updateSyncConfig(newConfig);
        
        return successResponse({
          message: "Sync configuration updated",
          config: newConfig,
          timestamp: new Date().toISOString()
        });

      default:
        return errorResponse("Invalid action", 400, {
          validActions: ["start", "stop", "force", "config"],
          providedAction: action
        });
    }
  } catch (error: any) {
    console.error("Scheduler action error:", error);
    return serverErrorResponse("Failed to perform scheduler action");
  }
}

