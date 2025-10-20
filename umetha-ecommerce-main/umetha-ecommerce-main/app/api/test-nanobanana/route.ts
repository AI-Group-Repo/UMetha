import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Test different Nano Banana API endpoints
const TEST_ENDPOINTS = [
  "https://api.nanobanana.ai/v1/generate",
  "https://api.nanobanana.fans/v1/generate", 
  "https://api.nanobanana.run/v1/generate",
  "https://api.nanobanana.com/v1/generate"
];

export async function GET(request: NextRequest) {
  try {
    console.log("Testing Nano Banana API endpoints...");
    
    const results = [];
    const apiKey = process.env.VIRTUAL_NANO_BANANA_API_KEY || "fd57fdce5d923edb588a6bb46b5e4bb0";
    
    for (const endpoint of TEST_ENDPOINTS) {
      try {
        console.log(`Testing endpoint: ${endpoint}`);
        
        const response = await axios.get(endpoint, {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 5000, // 5 second timeout
        });
        
        results.push({
          endpoint,
          status: "SUCCESS",
          statusCode: response.status,
          message: "Endpoint is reachable"
        });
        
      } catch (error: any) {
        results.push({
          endpoint,
          status: "ERROR",
          statusCode: error.response?.status || "N/A",
          message: error.message,
          errorType: error.code
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: "API endpoint test completed",
      results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("API endpoint test error:", error);
    return NextResponse.json(
      { 
        error: "Failed to test API endpoints", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, apiKey } = body;
    
    if (!endpoint || !apiKey) {
      return NextResponse.json(
        { error: "Endpoint and API key are required" },
        { status: 400 }
      );
    }
    
    console.log(`Testing custom endpoint: ${endpoint}`);
    
    // Test with a simple request
    const response = await axios.post(
      endpoint,
      {
        model: "gemini-2.0-flash-exp",
        prompt: "Test prompt",
        images: [],
        style: "realistic",
        quality: "high",
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      }
    );
    
    return NextResponse.json({
      success: true,
      message: "Custom endpoint test successful",
      endpoint,
      statusCode: response.status,
      responseData: response.data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error("Custom endpoint test error:", error);
    return NextResponse.json({
      success: false,
      message: "Custom endpoint test failed",
      endpoint: body?.endpoint,
      error: error.message,
      errorType: error.code,
      statusCode: error.response?.status,
      responseData: error.response?.data,
      timestamp: new Date().toISOString()
    });
  }
}
