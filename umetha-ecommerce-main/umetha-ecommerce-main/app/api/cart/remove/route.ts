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

// Schema for removing cart item
const removeCartItemSchema = z.object({
  cartItemId: z.string(),
});

// Remove item from cart
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;

    // Get data from query params
    const { searchParams } = new URL(req.url);
    const cartItemId = searchParams.get("cartItemId");

    if (!cartItemId) {
      return errorResponse("Cart item ID is required");
    }

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return notFoundResponse("Cart not found");
    }

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });

    if (!cartItem) {
      return notFoundResponse("Cart item not found");
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    // Get updated cart with all items
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Calculate cart total
    const total =
      updatedCart?.items.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0
      ) || 0;

    return successResponse({
      cart: {
        id: updatedCart?.id,
        items: updatedCart?.items,
        total,
        itemCount:
          updatedCart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0,
      },
      message: "Item removed from cart successfully",
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return serverErrorResponse("Failed to remove item from cart");
  }
}
