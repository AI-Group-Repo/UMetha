import { NextRequest, NextResponse } from "next/server";
import { fetchEdiUpdates } from "@/lib/edi-scheduler";
import { ediConfig } from "@/lib/edi-config";

/**
 * API endpoint to trigger scheduled EDI updates
 * This can be called by a cron job or scheduled task
 * POST /api/edi/scheduled-update
 */
export async function POST(req: NextRequest) {
  try {
    // Verify secret key for security
    const secretKey = req.headers.get("x-api-key");
    const configuredKey =
      ediConfig.schedulerApiKey || process.env.EDI_SCHEDULER_API_KEY;

    if (!secretKey || secretKey !== configuredKey) {
      console.warn("Unauthorized attempt to trigger EDI scheduled update");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Run the scheduled update
    const result = await fetchEdiUpdates();

    if (!result.success) {
      return NextResponse.json(
        { message: "Error during scheduled EDI update", error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Scheduled EDI update completed successfully",
      ...result,
    });
  } catch (error: any) {
    console.error("Error in scheduled EDI update endpoint:", error);
    return NextResponse.json(
      {
        message: "Error in scheduled EDI update endpoint",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
