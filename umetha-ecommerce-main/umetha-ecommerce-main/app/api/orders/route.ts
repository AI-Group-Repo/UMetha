import { NextRequest } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  createdResponse,
  errorResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/lib/api-utils";
import { authOptions } from "../auth/[...nextauth]/route";

// Schema for creating a new order
const createOrderSchema = z.object({
  addressId: z.string({ required_error: "Address is required" }),
});

// Get user orders
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    const { searchParams } = new URL(req.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Filtering
    const status = searchParams.get("status");

    // Build where clause for filtering
    const where: any = {};

    // If not admin, only show user's orders
    if (!isAdmin) {
      where.userId = userId;
    }

    if (status) {
      where.status = status;
    }

    // Get orders with pagination
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: true,
            },
          },
          address: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);

    return successResponse({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return serverErrorResponse("Failed to fetch orders");
  }
}

// Create new order from cart
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;
    const body = await req.json();

    // Validate request body
    const validationResult = createOrderSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(validationResult.error.message);
    }

    const { addressId } = validationResult.data;

    // Check if address exists and belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      return notFoundResponse("Address not found");
    }

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return errorResponse("Cart is empty");
    }

    // Check product stock for each item
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return errorResponse(
          `Not enough stock for "${item.product.name}". Only ${item.product.stock} available.`
        );
      }
    }

    // Calculate order total
    const total = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    // Start a transaction to create order and update inventory
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          addressId,
          total,
          status: "PENDING",
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          address: true,
        },
      });

      // Update product stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: item.product.stock - item.quantity },
        });
      }

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return createdResponse(order, "Order created successfully");
  } catch (error) {
    console.error("Error creating order:", error);
    return serverErrorResponse("Failed to create order");
  }
}
