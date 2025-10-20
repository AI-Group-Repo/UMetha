"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  User,
  Heart,
  AlertCircle,
  ArrowLeft,
  MapPin,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminViewAsUser() {
  const { user, userRole, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
        <AlertTitle className="text-blue-800 dark:text-blue-300">
          Admin Mode
        </AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-400">
          You are viewing the User Dashboard as an admin. Any actions will be
          performed with your admin privileges.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            User Dashboard{" "}
            <span className="text-sm text-gray-500">(Admin View)</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Viewing the regular user dashboard interface and features
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/view-as">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Role Selection
          </Link>
        </Button>
      </div>

      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your order history and tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">#ORD-7452</h4>
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 border-purple-200"
                    >
                      Shipped
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">April 15, 2025</span>
                </div>
                <p className="text-sm mb-3">2 items • $156.98</p>
                <Button variant="outline" size="sm" className="w-full">
                  Track Order
                </Button>
              </div>

              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">#ORD-7439</h4>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Delivered
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">April 8, 2025</span>
                </div>
                <p className="text-sm mb-3">1 item • $89.99</p>
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard/admin/view-as/user/orders">
                  View All Orders
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved Items</CardTitle>
            <CardDescription>Products you've saved for later</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-md"></div>
                <div className="flex-1">
                  <h4 className="font-medium">Wireless Headphones</h4>
                  <p className="text-sm text-gray-500">$129.99</p>
                </div>
                <Button size="sm">Add to Cart</Button>
              </div>

              <div className="border rounded-md p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-md"></div>
                <div className="flex-1">
                  <h4 className="font-medium">Smart Watch</h4>
                  <p className="text-sm text-gray-500">$199.99</p>
                </div>
                <Button size="sm">Add to Cart</Button>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard/admin/view-as/user/wishlist">
                  View All Saved Items
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Profile</CardTitle>
            <CardDescription>
              View and edit your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard/admin/view-as/user/profile">
                View Profile
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Addresses</CardTitle>
            <CardDescription>Manage your shipping addresses</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard/admin/view-as/user/addresses">
                Manage Addresses
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Methods</CardTitle>
            <CardDescription>Manage your payment options</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard/admin/view-as/user/payment">
                Manage Payments
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Admin Action Panel */}
      <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-purple-800 dark:text-purple-300">
            Admin Actions
          </CardTitle>
          <CardDescription className="text-purple-700 dark:text-purple-400">
            Actions available only to administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              className="bg-white dark:bg-gray-900"
              asChild
            >
              <Link href="/dashboard/admin/users">Manage All Users</Link>
            </Button>
            <Button variant="outline" className="bg-white dark:bg-gray-900">
              Edit User Permissions
            </Button>
            <Button variant="outline" className="bg-white dark:bg-gray-900">
              View Purchase History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
