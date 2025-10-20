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
  forbiddenResponse,
} from "@/lib/api-utils";
import { authOptions } from "../../auth/[...nextauth]/route";

// Schema for updating order
const updateOrderSchema = z.object({
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
});

// Get order by ID
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
    const isAdmin = session.user.role === "ADMIN";
    const id = params.id;

    // Build query
    const where: any = { id };

    // If not admin, can only view own orders
    if (!isAdmin) {
      where.userId = userId;
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return notFoundResponse("Order not found");
    }

    return successResponse(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return serverErrorResponse("Failed to fetch order");
  }
}

// Update order status (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    const isAdmin = session.user.role === "ADMIN";

    // Only admins can update order status
    if (!isAdmin) {
      return forbiddenResponse("You are not authorized to update order status");
    }

    const id = params.id;
    const body = await req.json();

    // Validate request body
    const validationResult = updateOrderSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(validationResult.error.message);
    }

    const { status } = validationResult.data;

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!existingOrder) {
      return notFoundResponse("Order not found");
    }

    // Special handling for cancelled orders: restore stock
    if (status === "CANCELLED" && existingOrder.status !== "CANCELLED") {
      await prisma.$transaction(async (tx) => {
        // Update order status
        await tx.order.update({
          where: { id },
          data: { status },
        });

        // Restore product stock for each order item
        for (const item of existingOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }
      });

      const updatedOrder = await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          address: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return successResponse(
        updatedOrder,
        "Order cancelled and stock restored"
      );
    } else {
      // Normal status update
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          address: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return successResponse(updatedOrder, `Order status updated to ${status}`);
    }
  } catch (error) {
    console.error("Error updating order:", error);
    return serverErrorResponse("Failed to update order");
  }
}
