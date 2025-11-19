/**
 * ClickBank Auto-Sync Cron Job
 * This endpoint should be called every 24 hours by a cron service
 * 
 * For Vercel: Add this to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/clickbank-sync",
 *     "schedule": "0 0 * * *"
 *   }]
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { syncClickBankProductsForAll } from "@/lib/clickbank-scheduler";

export async function GET(req: NextRequest) {
  try {
    // Verify the request is from an authorized source (cron job)
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "your-secret-key";

    // In production, verify the cron secret
    if (process.env.NODE_ENV === "production") {
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    console.log("🔄 ClickBank cron job triggered");

    // Run the sync
    const result = await syncClickBankProductsForAll();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "ClickBank products synced successfully",
        productsFetched: result.productsFetched,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "ClickBank sync completed with errors",
          productsFetched: result.productsFetched,
          errors: result.errors,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("❌ Error in ClickBank cron job:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Allow POST as well for manual triggering
export async function POST(req: NextRequest) {
  return GET(req);
}

