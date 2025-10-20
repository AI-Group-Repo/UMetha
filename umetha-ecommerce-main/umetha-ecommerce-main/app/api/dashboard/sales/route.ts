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

// Get sales data (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return unauthorizedResponse();
    }

    // Verify admin role
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Only admins can access sales data");
    }

    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get("timeRange") || "week"; // day, week, month, year
    const groupBy = searchParams.get("groupBy") || "day"; // hour, day, week, month

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

    let formatSql: string;

    // Format SQL based on group by parameter
    switch (groupBy) {
      case "hour":
        formatSql = "date_trunc('hour', \"createdAt\")";
        break;
      case "day":
        formatSql = "date_trunc('day', \"createdAt\")";
        break;
      case "week":
        formatSql = "date_trunc('week', \"createdAt\")";
        break;
      case "month":
        formatSql = "date_trunc('month', \"createdAt\")";
        break;
      default:
        formatSql = "date_trunc('day', \"createdAt\")";
    }

    // Get sales data by time period
    const salesByTime = await prisma.$queryRaw`
      SELECT 
        ${formatSql} as date, 
        SUM(total) as sales,
        COUNT(*) as orders
      FROM "Order"
      WHERE "createdAt" >= ${startDate}
      GROUP BY date
      ORDER BY date ASC
    `;

    // Get sales by category
    const salesByCategory = await prisma.$queryRaw`
      SELECT 
        c.name as category, 
        SUM(oi.price * oi.quantity) as sales,
        SUM(oi.quantity) as units
      FROM "OrderItem" oi
      JOIN "Product" p ON p.id = oi."productId"
      JOIN "Category" c ON c.id = p."categoryId"
      JOIN "Order" o ON o.id = oi."orderId"
      WHERE o."createdAt" >= ${startDate}
      GROUP BY c.name
      ORDER BY sales DESC
    `;

    // Get revenue by payment status
    const revenueByStatus = await prisma.order.groupBy({
      by: ["status"],
      _sum: {
        total: true,
      },
      where: {
        createdAt: { gte: startDate },
      },
    });

    // Format status revenue data
    const statusRevenue = revenueByStatus.reduce(
      (acc: Record<string, number>, curr) => {
        acc[curr.status] = curr._sum.total || 0;
        return acc;
      },
      {}
    );

    return successResponse({
      salesByTime,
      salesByCategory,
      statusRevenue,
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return serverErrorResponse("Failed to fetch sales data");
  }
}
