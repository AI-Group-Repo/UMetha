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

// Schema for removing item from wishlist
const removeItemSchema = z.object({
  wishlistItemId: z.string(),
});

// Remove item from wishlist
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;

    // Get data from query params
    const { searchParams } = new URL(req.url);
    const wishlistItemId = searchParams.get("wishlistItemId");

    if (!wishlistItemId) {
      return errorResponse("Wishlist item ID is required");
    }

    // Validate parameter
    if (typeof wishlistItemId !== "string") {
      return errorResponse("Invalid wishlist item ID");
    }

    // Get item to verify ownership
    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: { id: wishlistItemId },
      include: { wishlist: true },
    });

    if (!wishlistItem) {
      return notFoundResponse("Wishlist item not found");
    }

    // Check if user owns this wishlist
    if (wishlistItem.wishlist.userId !== userId) {
      return unauthorizedResponse(
        "You don't have permission to remove this item"
      );
    }

    // Delete item
    await prisma.wishlistItem.delete({
      where: { id: wishlistItemId },
    });

    // Update wishlist updated_at timestamp
    await prisma.wishlist.update({
      where: { id: wishlistItem.wishlistId },
      data: { updatedAt: new Date() },
    });

    return successResponse(null, "Item removed from wishlist");
  } catch (error) {
    console.error("Error removing item from wishlist:", error);
    return serverErrorResponse("Failed to remove item from wishlist");
  }
}
