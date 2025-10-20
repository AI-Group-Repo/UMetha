import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  serverErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/api-utils";
import { authOptions } from "../../auth/[...nextauth]/route";

// Get dashboard statistics (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    // Verify admin role
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Only admins can access dashboard statistics");
    }

    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get("timeRange") || "week"; // day, week, month, year

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case "day":
        startDate.setDate(now.getDate() - 1);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7); // Default to week
    }

    // Get statistics in parallel
    const [
      totalSales,
      totalOrders,
      totalUsers,
      totalProducts,
      lowStockProducts,
      recentOrders,
      salesByStatus,
      topSellingProducts,
    ] = await Promise.all([
      // Total sales amount
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: { gte: startDate },
        },
      }),

      // Total number of orders
      prisma.order.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),

      // Total number of users
      prisma.user.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),

      // Total number of products
      prisma.product.count(),

      // Low stock products (less than 10 in stock)
      prisma.product.findMany({
        where: {
          stock: { lt: 10 },
        },
        orderBy: {
          stock: "asc",
        },
        take: 10,
        select: {
          id: true,
          name: true,
          stock: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      }),

      // Recent orders
      prisma.order.findMany({
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: { items: true },
          },
        },
      }),

      // Orders by status
      prisma.order.groupBy({
        by: ["status"],
        _count: true,
        where: {
          createdAt: { gte: startDate },
        },
      }),

      // Top selling products
      prisma.orderItem
        .groupBy({
          by: ["productId"],
          _sum: {
            quantity: true,
            price: true,
          },
          orderBy: {
            _sum: {
              quantity: "desc",
            },
          },
          take: 5,
          where: {
            order: {
              createdAt: { gte: startDate },
            },
          },
        })
        .then(async (items) => {
          // Get product details for the top sellers
          if (items.length === 0) return [];

          const productIds = items.map((item) => item.productId);
          const products = await prisma.product.findMany({
            where: {
              id: { in: productIds },
            },
            select: {
              id: true,
              name: true,
              price: true,
              category: {
                select: {
                  name: true,
                },
              },
            },
          });

          // Merge quantities with product details
          return items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            return {
              ...product,
              totalQuantity: item._sum.quantity,
              totalSales: item._sum.price,
            };
          });
        }),
    ]);

    // Format the response
    const stats = {
      summary: {
        totalSales: totalSales._sum.total || 0,
        totalOrders,
        totalUsers,
        totalProducts,
      },
      lowStockProducts,
      recentOrders,
      salesByStatus: salesByStatus.reduce((acc, curr) => {
        acc[curr.status] = curr._count;
        return acc;
      }, {} as Record<string, number>),
      topSellingProducts,
    };

    return successResponse(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return serverErrorResponse("Failed to fetch dashboard statistics");
  }
}
