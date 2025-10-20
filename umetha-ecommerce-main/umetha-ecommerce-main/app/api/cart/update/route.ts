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

// Schema for updating cart item
const updateCartItemSchema = z.object({
  cartItemId: z.string(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

// Update cart item quantity
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;
    const body = await req.json();

    // Validate request body
    const validationResult = updateCartItemSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(validationResult.error.message);
    }

    const { cartItemId, quantity } = validationResult.data;

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return notFoundResponse("Cart not found");
    }

    // Get cart item
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      return notFoundResponse("Cart item not found");
    }

    // Check product stock
    if (cartItem.product.stock < quantity) {
      return errorResponse(
        `Not enough stock. Only ${cartItem.product.stock} available.`
      );
    }

    // Update cart item quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { product: true },
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
      updatedItem: updatedCartItem,
      message: "Cart updated successfully",
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return serverErrorResponse("Failed to update cart");
  }
}
