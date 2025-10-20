import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || "AIzaSyBe8zyXAkPK4H7dQSyc1wtUn8LWXgXKDGA";

export async function GET(request: NextRequest) {
  try {
    console.log("Testing Google Gemini API connection...");
    
    if (!GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "Google Gemini API key not configured"
      });
    }

    // Initialize Google Gemini AI
    const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Test with a simple text prompt
    const result = await model.generateContent("Hello, can you respond with 'Gemini API is working!'?");
    const response = await result.response;
    const text = response.text();

    console.log("Gemini API test successful:", text);

    return NextResponse.json({
      success: true,
      message: "Google Gemini API is working!",
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Gemini API test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({
        success: false,
        error: "Prompt is required"
      }, { status: 400 });
    }

    console.log("Testing Gemini API with custom prompt:", prompt);

    if (!GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "Google Gemini API key not configured"
      });
    }

    // Initialize Google Gemini AI
    const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Test with custom prompt
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini API custom test successful:", text);

    return NextResponse.json({
      success: true,
      message: "Custom prompt processed successfully",
      prompt: prompt,
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Gemini API custom test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      prompt: body?.prompt,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
