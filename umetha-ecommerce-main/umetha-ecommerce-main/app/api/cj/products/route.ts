import { NextRequest, NextResponse } from "next/server";
import { fetchCJProducts, getCJAccessToken } from "@/lib/cj-dropshipping";

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

export async function GET(req: NextRequest) {
  try {
    console.log("🚀 CJ Products API called");
    
    const searchParams = req.nextUrl.searchParams;
    const keyword = searchParams.get("keyword") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    console.log(`🔍 Fetching from CJ: page=${page}, limit=${limit}, keyword="${keyword}"`);

    // Get token
    const token = await getCJAccessToken();
    if (!token) {
      console.error("❌ Failed to get CJ access token");
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to authenticate with CJ Dropshipping.",
          products: [] 
        },
        { status: 401 }
      );
    }

    console.log("✅ CJ token obtained");

    // Fetch products from CJ
    const products = await fetchCJProducts(keyword, page, limit);

    console.log(`📊 Products received: ${products.length}`);

    if (!products || products.length === 0) {
      console.log("⚠️ No products returned from CJ");
      return NextResponse.json({
        success: false,
        products: [],
        totalCount: 0,
        message: "No products available from CJ at this time."
      });
    }

    console.log(`✅ Returning ${products.length} products`);

    return NextResponse.json({
      success: true,
      products: products,
      totalCount: products.length,
    });
  } catch (error: any) {
    console.error("❌ Error in CJ products API:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to fetch CJ products",
        products: [] 
      },
      { status: 500 }
    );
  }
}

