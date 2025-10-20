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

// Schema for address update
const updateAddressSchema = z.object({
  street: z.string().min(3, "Street address is required").optional(),
  city: z.string().min(2, "City is required").optional(),
  state: z.string().min(2, "State is required").optional(),
  country: z.string().min(2, "Country is required").optional(),
  zipCode: z.string().min(3, "Zip code is required").optional(),
  isDefault: z.boolean().optional(),
});

// Get address by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;

    const address = await prisma.address.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!address) {
      return notFoundResponse("Address not found");
    }

    return successResponse(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    return serverErrorResponse("Failed to fetch address");
  }
}

// Update address
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;
    const body = await req.json();

    // Validate request body
    const validationResult = updateAddressSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(validationResult.error.message);
    }

    const addressData = validationResult.data;

    // Check if address exists and belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!address) {
      return notFoundResponse("Address not found");
    }

    // If setting as default, unset any other default addresses
    if (addressData.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId,
          id: {
            not: id,
          },
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    // Update address
    const updatedAddress = await prisma.address.update({
      where: { id },
      data: addressData,
    });

    return successResponse(updatedAddress, "Address updated successfully");
  } catch (error) {
    console.error("Error updating address:", error);
    return serverErrorResponse("Failed to update address");
  }
}

// Delete address
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;

    // Check if address exists and belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!address) {
      return notFoundResponse("Address not found");
    }

    // Check if address is used in any orders
    const ordersWithAddress = await prisma.order.count({
      where: {
        addressId: id,
      },
    });

    if (ordersWithAddress > 0) {
      return errorResponse("Cannot delete address as it is used in orders");
    }

    // Delete address
    await prisma.address.delete({
      where: { id },
    });

    // If deleted address was default, set another as default if available
    if (address.isDefault) {
      const otherAddress = await prisma.address.findFirst({
        where: { userId },
      });

      if (otherAddress) {
        await prisma.address.update({
          where: { id: otherAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return successResponse(null, "Address deleted successfully");
  } catch (error) {
    console.error("Error deleting address:", error);
    return serverErrorResponse("Failed to delete address");
  }
}
