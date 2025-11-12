import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // Fixed NextAuth import
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma"; // Fixed prisma import

/**
 * Get EDI transaction history with filtering options
 * GET /api/edi/transactions
 */
export async function GET(req: NextRequest) {
  try {
    // Check authentication - only admins should be able to view EDI transactions
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);

    // Parse query parameters for filtering
    const documentType = url.searchParams.get("documentType");
    const partnerId = url.searchParams.get("partnerId");
    const status = url.searchParams.get("status");
    const direction = url.searchParams.get("direction");
    const orderId = url.searchParams.get("orderId");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = Math.min(
      parseInt(url.searchParams.get("pageSize") || "20"),
      100
    );

    // Build the where clause for filtering
    const where: any = {};

    if (documentType) {
      where.documentType = documentType;
    }

    if (partnerId) {
      where.partnerId = partnerId;
    }

    if (status) {
      where.status = status;
    }

    if (direction) {
      where.direction = direction;
    }

    if (orderId) {
      where.orderId = orderId;
    }

    // Date range filtering
    if (startDate || endDate) {
      where.createdAt = {};

      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }

      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // Get total count for pagination
    const total = await prisma.ediTransaction.count({ where });

    // Get paginated transactions with related order info
    const transactions = await prisma.ediTransaction.findMany({
      where,
      include: {
        order: {
          select: {
            orderNumber: true,
            status: true,
            total: true,
            userId: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error: any) {
    console.error("Error fetching EDI transactions:", error);
    return NextResponse.json(
      { message: "Error fetching EDI transactions", error: error.message },
      { status: 500 }
    );
  }
}
