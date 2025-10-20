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

/**
 * Add to Cart API
 *
 * This endpoint allows users to add products to their shopping cart with specified quantities.
 * It handles various edge cases including:
 * - Stock availability validation
 * - Existing items in cart (quantity updates)
 * - Cart creation for new users
 *
 * Request Body:
 * {
 *   productId: Unique identifier of the product to add
 *   quantity: Number of units to add (defaults to 1 if not specified)
 * }
 *
 * Authentication:
 * - Requires user to be logged in (valid session)
 *
 * Response Format:
 * {
 *   status: "success",
 *   data: {
 *     cart: Updated cart with all items and totals
 *     addedItem: Details of the specific item added/updated
 *     message: Success message
 *   }
 * }
 *
 * Error Cases:
 * - Insufficient stock
 * - Product not found
 * - Invalid quantity
 * - Unauthorized access
 */

// Schema for adding items to cart
const addToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive().default(1),
});

// Add item to cart
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;
    const body = await req.json();

    // Validate request body
    const validationResult = addToCartSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(validationResult.error.message);
    }

    const { productId, quantity } = validationResult.data;

    // Check if product exists and is in stock
    // This prevents adding unavailable products to the cart
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return notFoundResponse("Product not found");
    }

    if (product.stock < quantity) {
      return errorResponse(
        `Not enough stock. Only ${product.stock} available.`
      );
    }

    // Get or create cart
    // Ensures every user has a cart object to add items to
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Check if product already in cart
    // If so, we'll update the quantity rather than creating a duplicate entry
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    let cartItem;

    if (existingItem) {
      // Update quantity if item already exists
      // This avoids duplicate products in cart and makes quantity management easier
      const newQuantity = existingItem.quantity + quantity;

      // Check stock again with new total quantity
      // This prevents users from bypassing stock limits with multiple add operations
      if (product.stock < newQuantity) {
        return errorResponse(
          `Cannot add ${quantity} more. Only ${product.stock} available in total.`
        );
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: true },
      });
    } else {
      // Create new cart item if product isn't already in cart
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
        include: { product: true },
      });
    }

    // Get updated cart with all items
    // This provides a complete picture of the cart after the operation
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
    // This is done on-the-fly to ensure accurate pricing
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
      addedItem: cartItem,
      message: "Item added to cart",
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return serverErrorResponse("Failed to add item to cart");
  }
}
