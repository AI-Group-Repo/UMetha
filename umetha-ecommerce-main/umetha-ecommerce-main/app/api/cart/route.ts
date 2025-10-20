import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from "@/lib/api-utils";
import { authOptions } from "../auth/[...nextauth]/route";

/**
 * Cart API - Get User's Shopping Cart
 *
 * This endpoint retrieves the authenticated user's shopping cart contents, including
 * all cart items with their associated products. If the user doesn't have a cart yet,
 * a new empty cart is automatically created.
 *
 * Authentication:
 * - Requires user to be logged in (valid session)
 *
 * Response Format:
 * {
 *   status: "success",
 *   data: {
 *     id: The cart's unique ID,
 *     items: Array of cart items with product details,
 *     total: Calculated total price of all items in cart,
 *     itemCount: Total number of items in cart
 *   }
 * }
 *
 * Use Cases:
 * - Display cart contents to user
 * - Calculate total price for checkout
 * - Show cart item count in navigation
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;

    // Find or create cart for the user
    // This ensures every authenticated user always has a cart object
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      // Create new cart if user doesn't have one
      cart = await prisma.cart.create({
        data: {
          userId,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    // Calculate total price of all items in cart
    // This is calculated on-the-fly to ensure accurate pricing
    const total = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    return successResponse({
      id: cart.id,
      items: cart.items,
      total,
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return serverErrorResponse("Failed to fetch cart");
  }
}
