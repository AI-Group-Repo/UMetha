import { NextRequest } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  createdResponse,
  errorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/lib/api-utils";
import { authOptions } from "../auth/[...nextauth]/route";

// Schema for address creation and update
const addressSchema = z.object({
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  zipCode: z.string().min(3, "Zip code is required"),
  isDefault: z.boolean().default(false),
});

// Get user addresses
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return successResponse(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return serverErrorResponse("Failed to fetch addresses");
  }
}

// Create new address
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;
    const body = await req.json();

    // Validate request body
    const validationResult = addressSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(validationResult.error.message);
    }

    const addressData = validationResult.data;

    // If this is marked as default, unset any other default addresses
    if (addressData.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Create address
    const address = await prisma.address.create({
      data: {
        ...addressData,
        userId,
      },
    });

    return createdResponse(address, "Address created successfully");
  } catch (error) {
    console.error("Error creating address:", error);
    return serverErrorResponse("Failed to create address");
  }
}
