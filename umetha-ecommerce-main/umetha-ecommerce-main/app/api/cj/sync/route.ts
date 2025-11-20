import { NextRequest, NextResponse } from "next/server";
import { syncTrendingProducts } from "@/lib/cj-dropshipping";

export async function POST(req: NextRequest) {
  try {
    const { limit } = await req.json().catch(() => ({ limit: 50 }));

    // Sync trending products from CJ Dropshipping
    const result = await syncTrendingProducts(limit);

    if (result.success) {
      return NextResponse.json({
        success: true,
        totalProducts: result.totalProducts,
        message: `Successfully synced ${result.totalProducts} products`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.errors.join(", "),
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in CJ sync API:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

