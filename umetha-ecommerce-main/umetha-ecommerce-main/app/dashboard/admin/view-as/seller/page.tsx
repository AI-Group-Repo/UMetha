"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, ShoppingCart, Star, AlertCircle, ArrowLeft, Store, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminViewAsSeller() {
  const { user, userRole, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Mock statistics for admin viewing seller dashboard
  const [statistics, setStatistics] = useState({
    totalRevenue: "$38,493",
    totalProducts: "74",
    totalOrders: "526",
    averageRating: "4.7",
    pendingOrders: "12",
    lowStockItems: "8",
  });

  // Check for proper admin authorization
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/signin");
        return;
      }

      // Verify the user is an admin
      if (!userRole || userRole.toUpperCase() !== "ADMIN") {
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
      <Alert className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/50">
        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-blue-800 dark:text-blue-300">Admin Mode</AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-400">
          You are viewing the Seller Dashboard as an admin. Any actions will be performed with your admin privileges.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Seller Dashboard <span className="text-sm text-gray-500">(Admin View)</span></h1>
          <p className="text-gray-500 dark:text-gray-400">
            Viewing the seller dashboard interface and features
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/view-as">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Role Selection
          </Link>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500 mr-3" />
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
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-8 w-8 text-indigo-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{statistics.totalProducts}</p>
                <p className="text-xs text-green-500">+5 this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{statistics.totalOrders}</p>
                <p className="text-xs text-green-500">+42 this week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders requiring your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Products</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4">#ORD-5923</td>
                  <td className="py-4">Michael Johnson</td>
                  <td className="py-4">3 items</td>
                  <td className="py-4">$125.00</td>
                  <td className="py-4">
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      Processing
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="link" className="h-auto p-0">
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4">#ORD-5922</td>
                  <td className="py-4">Sarah Williams</td>
                  <td className="py-4">1 item</td>
                  <td className="py-4">$85.99</td>
                  <td className="py-4">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      Shipped
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="link" className="h-auto p-0">
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4">#ORD-5921</td>
                  <td className="py-4">David Brown</td>
                  <td className="py-4">2 items</td>
                  <td className="py-4">$199.98</td>
                  <td className="py-4">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Delivered
                    </Badge>
                  </td>
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
              <Link href="/dashboard/admin/view-as/seller/orders">View All Orders</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feature Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inventory</CardTitle>
            <CardDescription>Manage your product inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard/admin/view-as/seller/inventory">Manage Inventory</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Store</CardTitle>
            <CardDescription>Customize your storefront</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard/admin/view-as/seller/store">Manage Store</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analytics</CardTitle>
            <CardDescription>View sales analytics and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard/admin/view-as/seller/analytics">View Analytics</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Admin Action Panel */}
      <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-purple-800 dark:text-purple-300">Admin Actions</CardTitle>
          <CardDescription className="text-purple-700 dark:text-purple-400">
            Actions available only to administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="bg-white dark:bg-gray-900" asChild>
              <Link href="/dashboard/admin/sellers">
                Manage All Sellers
              </Link>
            </Button>
            <Button variant="outline" className="bg-white dark:bg-gray-900">
              Edit Seller Permissions
            </Button>
            <Button variant="outline" className="bg-white dark:bg-gray-900">
              Review Seller Applications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}