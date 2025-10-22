import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import axios from "axios";
import { GoogleGenAI, Modality } from "@google/genai";
// Environment variables for API keys
const FURNITURE_NANO_BANANA_API_KEY = process.env.nanoBananaApiKey || "AIzaSyAlDFVyERRgGemp3hMLjPRuch3Q7-Z8BDM";
const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;
const api = new GoogleGenAI({ apiKey: FURNITURE_NANO_BANANA_API_KEY });
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const roomImage = formData.get("roomImage") as File;
    const furnitureImage = formData.get("furnitureImage") as File;
    const furnitureName = formData.get("furnitureName") as string;

    if (!roomImage || !furnitureImage) {
      return NextResponse.json(
        { error: "Both room image and furniture image are required" },
        { status: 400 }
      );
    }

    if (!FURNITURE_NANO_BANANA_API_KEY) {
      return NextResponse.json(
        { error: "Furniture try-on API key not configured" },
        { status: 500 }
      );
    }

    // Convert files to buffers
    const roomImageBuffer = Buffer.from(await roomImage.arrayBuffer());
    const furnitureImageBuffer = Buffer.from(await furnitureImage.arrayBuffer());

    // Compress images
    const compressedRoomImage = await sharp(roomImageBuffer)
      .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    const compressedFurnitureImage = await sharp(furnitureImageBuffer)
      .resize(512, 512, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Convert to base64 for Nano Banana API
    const roomImageBase64 = compressedRoomImage.toString("base64");
    const furnitureImageBase64 = compressedFurnitureImage.toString("base64");

    const prompt = [
      {
        text: `Create a realistic room visualization showing this ${furnitureName || "furniture piece"} placed naturally in the room. The furniture should fit the room's style and lighting, look proportional, and appear as if it belongs there. Make it look professional and realistic.`,
      },
      {
        inlineData: {
          mimeType: "image/png",
          data: roomImageBase64,
        },
      },
      {
        inlineData: {
          mimeType: "image/png",
          data: furnitureImageBase64,
        },
      },
    ];
    // Call Nano Banana API for furniture try-on
    const nanoBananaResponse = await api.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });

    if (nanoBananaResponse.candidates?.[0]?.content?.parts) {
      for (const part of nanoBananaResponse.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const imageData = part.inlineData.data;
          return NextResponse.json({
            success: true,
            resultImage: `data:image/png;base64,${imageData}`,
            message: "Furniture try-on generated successfully!",
          });
        }
      }
      return NextResponse.json(
        { success: false, error: "Gemini returned no image in response" },
        { status: 502 }
      );
    } else {
      throw new Error("Failed to generate furniture try-on");
    }
  } catch (error) {
      console.error("Furniture try-on error:", error);
      return NextResponse.json(
        { success: false, error: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
      );
    }
  }
