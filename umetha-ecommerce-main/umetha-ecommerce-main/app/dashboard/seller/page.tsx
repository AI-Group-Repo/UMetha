"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  BarChart,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  PlusCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function SellerDashboard() {
  const { user, userRole, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalRevenue: "$38,493",
    totalProducts: "74",
    totalOrders: "526",
    averageRating: "4.7",
    pendingOrders: "12",
    lowStockItems: "8",
  });

  // Check for proper role authorization
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/signin");
        return;
      }

      // Verify the user is a seller
      if (!userRole || userRole.toUpperCase() !== "SELLER") {
        router.push("/dashboard");
        return;
      }

      setLoading(false);
    }
  }, [user, userRole, isLoading, router]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Seller Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back! Here's an overview of your store performance.
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
          <Button variant="outline">
            <LineChart className="mr-2 h-4 w-4" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-indigo-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{statistics.totalRevenue}</p>
                <p className="text-xs text-green-500">+12% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-8 w-8 text-indigo-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{statistics.totalProducts}</p>
                <p className="text-xs text-green-500">+6 new this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-indigo-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{statistics.totalOrders}</p>
                <p className="text-xs text-green-500">+23 this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-indigo-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">
                  {statistics.averageRating}/5
                </p>
                <p className="text-xs text-green-500">+0.3 from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-md">
              <LineChart className="h-16 w-16 text-gray-300 dark:text-gray-600" />
              {/* We would include an actual chart library like recharts here */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Units sold by product</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-md">
              <BarChart className="h-16 w-16 text-gray-300 dark:text-gray-600" />
              {/* We would include an actual chart library like recharts here */}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer purchases</CardDescription>
            </div>
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200"
            >
              {statistics.pendingOrders} Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4">#ORD-7893</td>
                  <td className="py-4">John Smith</td>
                  <td className="py-4">Apr 14, 2025</td>
                  <td className="py-4">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Shipped
                    </Badge>
                  </td>
                  <td className="py-4">$169.99</td>
                  <td className="py-4 text-right">
                    <Button variant="link" className="h-auto p-0">
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4">#ORD-7890</td>
                  <td className="py-4">Emily Johnson</td>
                  <td className="py-4">Apr 13, 2025</td>
                  <td className="py-4">
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200"
                    >
                      Processing
                    </Badge>
                  </td>
                  <td className="py-4">$253.75</td>
                  <td className="py-4 text-right">
                    <Button variant="link" className="h-auto p-0">
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4">#ORD-7882</td>
                  <td className="py-4">Robert Wilson</td>
                  <td className="py-4">Apr 12, 2025</td>
                  <td className="py-4">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Delivered
                    </Badge>
                  </td>
                  <td className="py-4">$89.50</td>
                  <td className="py-4 text-right">
                    <Button variant="link" className="h-auto p-0">
                      View Details
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard/seller/orders">View All Orders</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Alerts */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Inventory Alerts</CardTitle>
              <CardDescription>Products that require attention</CardDescription>
            </div>
            <Badge
              variant="outline"
              className="bg-red-50 text-red-700 border-red-200"
            >
              {statistics.lowStockItems} Low Stock
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-between items-center">
              <div className="flex items-start">
                <div className="h-10 w-10 mr-3 rounded-md bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Wireless Earbuds - Black</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Only 2 items left in stock
                  </p>
                </div>
              </div>
              <Button size="sm">Restock</Button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-between items-center">
              <div className="flex items-start">
                <div className="h-10 w-10 mr-3 rounded-md bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Leather Wallet - Brown</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Only 3 items left in stock
                  </p>
                </div>
              </div>
              <Button size="sm">Restock</Button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-between items-center">
              <div className="flex items-start">
                <div className="h-10 w-10 mr-3 rounded-md bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Smartphone Stand - Aluminum</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Only 8 items left in stock
                  </p>
                </div>
              </div>
              <Button size="sm">Restock</Button>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard/seller/products">Manage Inventory</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
