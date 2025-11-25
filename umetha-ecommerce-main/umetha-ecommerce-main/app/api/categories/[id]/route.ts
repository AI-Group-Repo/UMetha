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

// Ensure Node.js runtime (Prisma is not supported on Edge)
export const runtime = "nodejs";

// Update category schema
const updateCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  slug: z.string().min(2, "Slug must be at least 2 characters").optional(),
  description: z.string().optional(),
  image: z.string().url("Invalid image URL").optional(),
  parentId: z.string().optional().nullable(),
});
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Since we don't have a categories table in the actual database,
    // we'll create some default categories based on common product types
    const defaultCategories = [
      { id: 'fashion', name: 'Fashion', slug: 'fashion' },
      { id: 'electronics', name: 'Electronics', slug: 'electronics' },
      { id: 'home', name: 'Home & Garden', slug: 'home' },
      { id: 'beauty', name: 'Beauty & Health', slug: 'beauty' },
      { id: 'sports', name: 'Sports & Fitness', slug: 'sports' },
      { id: 'books', name: 'Books & Media', slug: 'books' },
      { id: 'toys', name: 'Toys & Games', slug: 'toys' },
      { id: 'automotive', name: 'Automotive', slug: 'automotive' },
    ];

    // Try to get categories from the database if they exist
    try {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .range(offset, offset + limit - 1);

      if (!error && categories && categories.length > 0) {
        return NextResponse.json({
          status: 'success',
          data: {
            categories: categories.map(cat => ({
              id: cat.id,
              name: cat.name,
              slug: cat.slug
            }))
          }
        });
      }
    } catch (dbError) {
      console.log('Categories table not found, using default categories');
    }

    // Return default categories
    return NextResponse.json({
      status: 'success',
      data: {
        categories: defaultCategories.slice(offset, offset + limit)
      }
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to fetch categories' 
      },
      { status: 500 }
    );
  }
}

// Get single category by ID
export async function GET(
  req: NextRequest,
  { params }: any
) {
  try {
    const id = params.id;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          include: {
            _count: {
              select: { products: true },
            },
          },
        },
        products: {
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return notFoundResponse("Category not found");
    }

    return successResponse(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return serverErrorResponse("Failed to fetch category");
  }
}

// Update category by ID (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: any
) {
  try {
    // Check if admin
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Only admins can update categories");
    }

    const id = params.id;
    const body = await req.json();

    // Validate request body
    const validationResult = updateCategorySchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(validationResult.error.message);
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return notFoundResponse("Category not found");
    }

    // Check if new slug is already in use by another category
    if (body.slug && body.slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findFirst({
        where: {
          slug: body.slug,
          NOT: { id },
        },
      });

      if (slugExists) {
        return errorResponse("Category with this slug already exists");
      }
    }

    // Check for circular reference when setting parentId
    if (body.parentId && body.parentId !== existingCategory.parentId) {
      // Can't set parent to self
      if (body.parentId === id) {
        return errorResponse("Category cannot be its own parent");
      }

      // Check if the new parent exists
      const parentExists = await prisma.category.findUnique({
        where: { id: body.parentId },
      });

      if (!parentExists) {
        return notFoundResponse("Parent category not found");
      }

      // Check if the new parent is not a child of this category (to avoid circular references)
      const potentialChildren = await prisma.category.findMany({
        where: {
          OR: [{ parentId: id }, { parent: { parentId: id } }],
        },
      });

      const childIds = potentialChildren.map((child) => child.id);
      if (childIds.includes(body.parentId)) {
        return errorResponse(
          "Cannot set a child category as the parent (circular reference)"
        );
      }
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: validationResult.data,
      include: {
        parent: true,
        children: true,
      },
    });

    return successResponse(updatedCategory, "Category updated successfully");
  } catch (error) {
    console.error("Error updating category:", error);
    return serverErrorResponse("Failed to update category");
  }
}

// Delete category by ID (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: any
) {
  try {
    // Check if admin
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Only admins can delete categories");
    }

    const id = params.id;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        _count: {
          select: { products: true },
        },
      },
    });

    if (!existingCategory) {
      return notFoundResponse("Category not found");
    }

    // Check if category has children or products
    if (existingCategory.children.length > 0) {
      return errorResponse(
        "Cannot delete category with subcategories. Please delete or reassign subcategories first."
      );
    }

    if (existingCategory._count.products > 0) {
      return errorResponse(
        "Cannot delete category with products. Please delete or reassign products first."
      );
    }

    // Delete category
    await prisma.category.delete({
      where: { id },
    });

    return successResponse(null, "Category deleted successfully");
  } catch (error) {
    console.error("Error deleting category:", error);
    return serverErrorResponse("Failed to delete category");
  }
}
