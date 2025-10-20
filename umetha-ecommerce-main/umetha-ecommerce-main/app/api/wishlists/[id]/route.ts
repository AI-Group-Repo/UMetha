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
import { authOptions } from "../../auth/[...nextauth]/route";

// Schema for updating wishlist
const updateWishlistSchema = z.object({
  name: z.string().min(1, "Wishlist name is required"),
});

// Get single wishlist with items
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;
    const id = params.id;

    const wishlist = await prisma.wishlist.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!wishlist) {
      return notFoundResponse("Wishlist not found");
    }

    return successResponse(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return serverErrorResponse("Failed to fetch wishlist");
  }
}

// Update wishlist name
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;
    const id = params.id;
    const body = await req.json();

    // Validate request body
    const validationResult = updateWishlistSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(validationResult.error.message);
    }

    const { name } = validationResult.data;

    // Check if wishlist exists and belongs to user
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!wishlist) {
      return notFoundResponse("Wishlist not found");
    }

    // Update wishlist
    const updatedWishlist = await prisma.wishlist.update({
      where: { id },
      data: { name },
    });

    return successResponse(updatedWishlist, "Wishlist updated successfully");
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return serverErrorResponse("Failed to update wishlist");
  }
}

// Delete wishlist
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;
    const id = params.id;

    // Check if wishlist exists and belongs to user
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!wishlist) {
      return notFoundResponse("Wishlist not found");
    }

    // Delete all wishlist items first (cascading delete does not seem to work reliably)
    await prisma.wishlistItem.deleteMany({
      where: { wishlistId: id },
    });

    // Delete wishlist
    await prisma.wishlist.delete({
      where: { id },
    });

    return successResponse(null, "Wishlist deleted successfully");
  } catch (error) {
    console.error("Error deleting wishlist:", error);
    return serverErrorResponse("Failed to delete wishlist");
  }
}
