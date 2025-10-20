import { NextRequest } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/lib/api-utils";
import { authOptions } from "../../../auth/[...nextauth]/route";

// Schema for adding item to wishlist
const addItemSchema = z.object({
  wishlistId: z.string(),
  productId: z.string(),
});

// Add item to wishlist
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;
    const body = await req.json();

    // Validate request body
    const validationResult = addItemSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(validationResult.error.message);
    }

    const { wishlistId, productId } = validationResult.data;

    // Check if wishlist exists and belongs to user
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        id: wishlistId,
        userId,
      },
    });

    if (!wishlist) {
      return notFoundResponse("Wishlist not found");
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return notFoundResponse("Product not found");
    }

    // Check if item is already in wishlist
    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId,
        productId,
      },
    });

    if (existingItem) {
      return errorResponse("Product already in wishlist");
    }

    // Add item to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        wishlistId,
        productId,
      },
      include: {
        product: true,
      },
    });

    // Update wishlist updated_at timestamp
    await prisma.wishlist.update({
      where: { id: wishlistId },
      data: { updatedAt: new Date() },
    });

    return successResponse(wishlistItem, "Product added to wishlist");
  } catch (error) {
    console.error("Error adding item to wishlist:", error);
    return serverErrorResponse("Failed to add item to wishlist");
  }
}
