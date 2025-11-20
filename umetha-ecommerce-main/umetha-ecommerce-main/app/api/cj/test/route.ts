import { NextResponse } from "next/server";
import { getCJAccessToken } from "@/lib/cj-dropshipping";

export const dynamic = 'force-dynamic';

/**
 * Test endpoint to verify CJ Dropshipping API connection
 * Visit: http://localhost:3000/api/cj/test
 */
export async function GET() {
  try {
    console.log("\n=================================");
    console.log("🧪 Testing CJ API Connection");
    console.log("=================================\n");

    // Check environment variables
    const apiKey = process.env.CJ_API_KEY;
    const accessToken = process.env.CJ_ACCESS_TOKEN;

    console.log("📋 Environment Check:");
    console.log(`  CJ_API_KEY: ${apiKey ? "✅ Set" : "❌ Missing"}`);
    console.log(`  CJ_ACCESS_TOKEN: ${accessToken ? "✅ Set" : "❌ Missing"}`);

    // Test token retrieval
    console.log("\n🔑 Testing token retrieval...");
    const token = await getCJAccessToken();

    if (!token) {
      return NextResponse.json({
        success: false,
        error: "Failed to get CJ access token",
        checks: {
          apiKeySet: !!apiKey,
          accessTokenSet: !!accessToken,
          tokenRetrieved: false,
        }
      }, { status: 500 });
    }

    console.log("✅ Token retrieved successfully!");
    console.log(`   Token preview: ${token.substring(0, 20)}...`);

    return NextResponse.json({
      success: true,
      message: "CJ API connection successful!",
      checks: {
        apiKeySet: !!apiKey,
        accessTokenSet: !!accessToken,
        tokenRetrieved: true,
        tokenPreview: token.substring(0, 20) + "...",
      }
    });
  } catch (error: any) {
    console.error("❌ Test failed:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 });
  }
}

