import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { GoogleGenAI } from "@google/genai";

// Google Gemini API key (using user's provided key as dev fallback)
const GOOGLE_GENERATIVE_AI_API_KEY =
  process.env.nanoBananaApiKey ||
  "AIzaSyAlDFVyERRgGemp3hMLjPRuch3Q7-Z8BDM";
const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;

export async function POST(request: NextRequest) {
  
  try {
    console.log("Virtual try-on API called");
    
    const formData = await request.formData();
    const userImage = formData.get("userImage") as File;
    const productImage = formData.get("productImage") as File;
    const productName = formData.get("productName") as string;

    console.log("Received data:", {
      hasUserImage: !!userImage,
      hasProductImage: !!productImage,
      productName: productName,
      userImageSize: userImage?.size,
      productImageSize: productImage?.size
    });

    if (!userImage || !productImage) {
      console.log("Missing required images");
      return NextResponse.json(
        { error: "Both user image and product image are required" },
        { status: 400 }
      );
    }

    // Convert files to buffers
    console.log("Converting files to buffers...");
    const userImageBuffer = Buffer.from(await userImage.arrayBuffer());
    const productImageBuffer = Buffer.from(await productImage.arrayBuffer());
    console.log("Buffer sizes:", {
      userImageBuffer: userImageBuffer.length,
      productImageBuffer: productImageBuffer.length
    });

    // Compress images
    console.log("Compressing images...");
    const compressedUserImage = await sharp(userImageBuffer)
      .resize(512, 512, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    const compressedProductImage = await sharp(productImageBuffer)
      .resize(512, 512, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();
    
    console.log("Images compressed successfully");

    // Remove background from user image
    let processedUserImage = compressedUserImage;
    if (REMOVE_BG_API_KEY) {
      try {
        const form = new FormData();
        form.append("image_file", new Blob([new Uint8Array(compressedUserImage)], { type: "image/jpeg" }));
        form.append("size", "regular");
        form.append("type", "person");
        const removeBgResponse = await fetch("https://api.remove.bg/v1.0/removebg", {
          method: "POST",
          headers: {
            "X-Api-Key": REMOVE_BG_API_KEY,
          },
          body: form as any,
        });
        const arrayBuf = await removeBgResponse.arrayBuffer();
        processedUserImage = Buffer.from(arrayBuf);
      } catch (error) {
        console.warn("Background removal failed, using original image:", error);
      }
    }

    // Convert to base64 for AI providers
    const userImageBase64 = processedUserImage.toString("base64");
    const productImageBase64 = compressedProductImage.toString("base64");
    // Call Google Gemini using the exact format requested
    try {
      const ai = new GoogleGenAI({ apiKey: GOOGLE_GENERATIVE_AI_API_KEY });
      const prompt = [
        {
          inlineData: {
            mimeType: "image/png",
            data: productImageBase64, // Product image
          },
        },
        {
          inlineData: {
            mimeType: "image/png", 
            data: userImageBase64, // User image
          },
        },
        { 
          text: "Create a professional e-commerce fashion photo. Take the [product] from the first image and let the person from the second image wear it. Generate a realistic, full-body shot of the person wearing the [product], with the lighting and shadows adjusted to match the environment." 
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
      });

      if (response?.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            const imageData = part.inlineData.data;
            return NextResponse.json({
              success: true,
              resultImage: `data:image/png;base64,${imageData}`,
              message: "Virtual try-on generated successfully with Google Gemini!",
            });
          }
        }
      }

      // No image returned
      return NextResponse.json(
        { success: false, error: "Gemini returned no image in response" },
        { status: 502 }
      );
    } catch (apiError) {
      console.error("Gemini API error:", apiError);
      return NextResponse.json(
        { success: false, error: apiError instanceof Error ? apiError.message : "Unknown error" },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Virtual try-on error:", error);
    
    // Log more detailed error information
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    // Check if it's an API response error
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as any;
      console.error("API Error Response:", apiError.response?.data);
      console.error("API Error Status:", apiError.response?.status);
    }
    
    return NextResponse.json(
      { 
        error: "Failed to generate virtual try-on", 
        details: error instanceof Error ? error.message : "Unknown error",
        success: false
      },
      { status: 500 }
    );
  }
}
