import { NextRequest, NextResponse } from "next/server";
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

// Ensure Node.js runtime for Prisma
export const runtime = "nodejs";

// Update category schema
const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  parentId: z.string().optional().nullable(),
});

/* ============================================================
   GET CATEGORY BY ID
============================================================ */
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          include: {
            _count: { select: { products: true } },
          },
        },
        products: {
          take: 10,
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { products: true } },
      },
    });

    if (!category) return notFoundResponse("Category not found");

    return successResponse(category);
  } catch (error) {
    console.error("GET category error:", error);
    return serverErrorResponse("Failed to fetch category");
  }
}

/* ============================================================
   UPDATE CATEGORY (PATCH)
============================================================ */
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) return unauthorizedResponse();
    if (session.user.role !== "ADMIN")
      return forbiddenResponse("Only admins can update categories");

    const { id } = context.params;
    const body = await req.json();

    const validation = updateCategorySchema.safeParse(body);
    if (!validation.success)
      return errorResponse(validation.error.message);

    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) return notFoundResponse("Category not found");

    // Check duplicate slug
    if (body.slug && body.slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findFirst({
        where: { slug: body.slug, NOT: { id } },
      });

      if (slugExists)
        return errorResponse("Category with this slug already exists");
    }

    // Prevent circular parent references
    if (body.parentId && body.parentId !== existingCategory.parentId) {
      if (body.parentId === id)
        return errorResponse("Category cannot be its own parent");

      const parentExists = await prisma.category.findUnique({
        where: { id: body.parentId },
      });

      if (!parentExists) return notFoundResponse("Parent category not found");

      const potentialChildren = await prisma.category.findMany({
        where: {
          OR: [{ parentId: id }, { parent: { parentId: id } }],
        },
      });

      const childIds = potentialChildren.map((c) => c.id);

      if (childIds.includes(body.parentId))
        return errorResponse("Cannot set a child category as parent");
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: validation.data,
      include: { parent: true, children: true },
    });

    return successResponse(updatedCategory, "Category updated successfully");
  } catch (error) {
    console.error("PATCH category error:", error);
    return serverErrorResponse("Failed to update category");
  }
}

/* ============================================================
   DELETE CATEGORY
============================================================ */
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) return unauthorizedResponse();
    if (session.user.role !== "ADMIN")
      return forbiddenResponse("Only admins can delete categories");

    const { id } = context.params;

    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        _count: { select: { products: true } },
      },
    });

    if (!existingCategory) return notFoundResponse("Category not found");

    if (existingCategory.children.length > 0)
      return errorResponse("Delete or reassign subcategories first");

    if (existingCategory._count.products > 0)
      return errorResponse("Delete or reassign products first");

    await prisma.category.delete({ where: { id } });

    return successResponse(null, "Category deleted successfully");
  } catch (error) {
    console.error("DELETE category error:", error);
    return serverErrorResponse("Failed to delete category");
  }
}
