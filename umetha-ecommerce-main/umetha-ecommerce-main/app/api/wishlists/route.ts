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

// Schema for creating wishlist
const createWishlistSchema = z.object({
  name: z.string().min(1, "Wishlist name is required"),
});

// Get user wishlists
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;

    const wishlists = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        _count: {
          select: { items: true },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return successResponse(wishlists);
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    return serverErrorResponse("Failed to fetch wishlists");
  }
}

// Create new wishlist
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;
    const body = await req.json();

    // Validate request body
    const validationResult = createWishlistSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(validationResult.error.message);
    }

    const { name } = validationResult.data;

    // Check how many wishlists the user already has
    const wishlists = await prisma.wishlist.count({
      where: { userId },
    });

    // Limit the number of wishlists per user to prevent abuse
    if (wishlists >= 10) {
      return errorResponse("Maximum number of wishlists reached (10)");
    }

    // Create wishlist
    const wishlist = await prisma.wishlist.create({
      data: {
        name,
        userId,
      },
    });

    return createdResponse(wishlist, "Wishlist created successfully");
  } catch (error) {
    console.error("Error creating wishlist:", error);
    return serverErrorResponse("Failed to create wishlist");
  }
}
