import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import axios from "axios";

// Environment variables for API keys
const FURNITURE_NANO_BANANA_API_KEY = "AIzaSyA9ybO1IqMANa87pfef15Kkpur1zr08QEU";
const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;

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

    // Call Nano Banana API for furniture try-on
    const nanoBananaResponse = await axios.post(
      "https://api.nanobanana.ai/v1/generate",
      {
        model: "gemini-2.5-flash-image",
        prompt: `Create a realistic room visualization showing this ${furnitureName || "furniture piece"} placed naturally in the room. The furniture should fit the room's style and lighting, look proportional, and appear as if it belongs there. Make it look professional and realistic.`,
        images: [
          {
            type: "room_photo",
            data: roomImageBase64,
          },
          {
            type: "furniture_image",
            data: furnitureImageBase64,
          },
        ],
        style: "realistic",
        quality: "high",
      },
      {
        headers: {
          "Authorization": `Bearer AIzaSyA9ybO1IqMANa87pfef15Kkpur1zr08QEU`,
          "Content-Type": "application/json",
        },
      }
    );

    if (nanoBananaResponse.data.success) {
      return NextResponse.json({
        success: true,
        resultImage: nanoBananaResponse.data.result_image,
        message: "Furniture try-on generated successfully!",
      });
    } else {
      throw new Error(nanoBananaResponse.data.error || "Failed to generate furniture try-on");
    }
  } catch (error) {
    console.error("Furniture try-on error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate furniture try-on", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
