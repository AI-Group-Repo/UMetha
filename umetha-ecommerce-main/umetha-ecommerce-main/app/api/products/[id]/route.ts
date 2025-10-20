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

// Update product schema
const updateProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  price: z.number().positive("Price must be positive").optional(),
  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image required")
    .optional(),
  categoryId: z.string().optional(),
  stock: z.number().int().min(0, "Stock cannot be negative").optional(),
});

// Get single product by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return notFoundResponse("Product not found");
    }

    return successResponse(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return serverErrorResponse("Failed to fetch product");
  }
}

// Update product by ID (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if admin
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Only admins can update products");
    }

    const id = params.id;
    const body = await req.json();

    // Validate request body
    const validationResult = updateProductSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(validationResult.error.message);
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return notFoundResponse("Product not found");
    }

    // If categoryId is provided, check if the category exists
    if (body.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: body.categoryId },
      });

      if (!categoryExists) {
        return notFoundResponse("Category not found");
      }
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: validationResult.data,
      include: {
        category: true,
      },
    });

    return successResponse(updatedProduct, "Product updated successfully");
  } catch (error) {
    console.error("Error updating product:", error);
    return serverErrorResponse("Failed to update product");
  }
}

// Delete product by ID (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if admin
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Only admins can delete products");
    }

    const id = params.id;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return notFoundResponse("Product not found");
    }

    // Delete product
    await prisma.product.delete({
      where: { id },
    });

    return successResponse(null, "Product deleted successfully");
  } catch (error) {
    console.error("Error deleting product:", error);
    return serverErrorResponse("Failed to delete product");
  }
}
