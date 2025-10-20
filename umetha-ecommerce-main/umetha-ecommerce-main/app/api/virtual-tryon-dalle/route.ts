import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import OpenAI from "openai";

// Environment variables for API keys
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;

export async function POST(request: NextRequest) {
  try {
    console.log("DALL-E 3 Virtual try-on API called");

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

    if (!OPENAI_API_KEY) {
      console.log("OpenAI API key not configured");
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
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
      .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();

    const compressedProductImage = await sharp(productImageBuffer)
      .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();

    console.log("Images compressed successfully");

    // Remove background from user image (optional)
    let processedUserImage = compressedUserImage;
    if (REMOVE_BG_API_KEY) {
      try {
        const removeBgResponse = await fetch("https://api.remove.bg/v1.0/removebg", {
          method: "POST",
          headers: {
            "X-Api-Key": REMOVE_BG_API_KEY,
          },
          body: compressedUserImage,
        });
        
        if (removeBgResponse.ok) {
          processedUserImage = Buffer.from(await removeBgResponse.arrayBuffer());
          console.log("Background removed successfully");
        }
      } catch (error) {
        console.warn("Background removal failed, using original image:", error);
      }
    }

    // Convert to base64 for OpenAI API
    const userImageBase64 = processedUserImage.toString("base64");
    const productImageBase64 = compressedProductImage.toString("base64");

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    console.log("Calling DALL-E 3 API with product:", productName);
    
    try {
      // Generate image with DALL-E 3
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Professional e-commerce fashion photo showing a person wearing ${productName || "clothing item"}. The person should be from the uploaded photo and wearing the clothing item from the product image. High quality, realistic, full-body shot with proper lighting and shadows. The result should look natural and professional, suitable for an e-commerce website.`,
        size: "1024x1024",
        quality: "hd",
        n: 1,
      });

      console.log("DALL-E 3 response received");

      if (response.data && response.data.length > 0) {
        const imageUrl = response.data[0].url;
        
        // Download the generated image
        console.log("Downloading generated image...");
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        
        console.log("Virtual try-on image generated successfully");
        
        return NextResponse.json({
          success: true,
          resultImage: `data:image/jpeg;base64,${base64Image}`,
          message: "Virtual try-on generated successfully with DALL-E 3!",
        });
      } else {
        throw new Error("No image data received from DALL-E 3");
      }

    } catch (apiError) {
      console.error("DALL-E 3 API error:", apiError);
      if (apiError instanceof Error) {
        console.error("Error message:", apiError.message);
        throw new Error(`DALL-E 3 API Error: ${apiError.message}`);
      }
      throw apiError;
    }

  } catch (error) {
    console.error("Virtual try-on error:", error);

    // Log more detailed error information
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
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
