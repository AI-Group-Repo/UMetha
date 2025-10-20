import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("Test virtual try-on endpoint called");
    
    return NextResponse.json({
      success: true,
      message: "Virtual try-on API is working!",
      timestamp: new Date().toISOString(),
      apiKey: process.env.VIRTUAL_NANO_BANANA_API_KEY ? "Configured" : "Not configured"
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    return NextResponse.json(
      { 
        error: "Test endpoint failed", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Test virtual try-on POST endpoint called");
    
    const body = await request.json();
    console.log("Received body:", body);
    
    return NextResponse.json({
      success: true,
      message: "Test POST endpoint working!",
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Test POST endpoint error:", error);
    return NextResponse.json(
      { 
        error: "Test POST endpoint failed", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
