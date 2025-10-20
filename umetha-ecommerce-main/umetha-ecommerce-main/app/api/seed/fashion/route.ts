import { seedFashionProducts } from "@/scripts/database/seed-fashion-products";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // This is an admin endpoint that should be protected in production
    // For now, we'll just use it for seeding data

    const result = await seedFashionProducts();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error seeding fashion products:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}


