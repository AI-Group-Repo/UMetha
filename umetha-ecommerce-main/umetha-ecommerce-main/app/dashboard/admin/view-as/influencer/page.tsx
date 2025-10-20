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
  LineChart,
  BarChart,
  Wallet,
  Users,
  TrendingUp,
  ShoppingBag,
  Camera,
  Share2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminViewAsInfluencer() {
  const { user, userRole, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Mock statistics for admin viewing influencer dashboard
  const [statistics, setStatistics] = useState({
    totalEarnings: "$12,538",
    followers: "128.4K",
    engagementRate: "4.7%",
    productsSold: "843",
    avgOrderValue: "$78.24",
    clickThroughRate: "3.2%",
    pendingMessages: "8",
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
        <AlertTitle className="text-blue-800 dark:text-blue-300">
          Admin Mode
        </AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-400">
          You are viewing the Influencer Dashboard as an admin. Any actions will
          be performed with your admin privileges.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Influencer Dashboard{" "}
            <span className="text-sm text-gray-500">(Admin View)</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Viewing the influencer dashboard interface and features
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-indigo-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{statistics.totalEarnings}</p>
                <p className="text-xs text-green-500">+18% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Followers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-indigo-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{statistics.followers}</p>
                <p className="text-xs text-green-500">+2.3K this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Engagement Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-indigo-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">
                  {statistics.engagementRate}
                </p>
                <p className="text-xs text-green-500">+0.8% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Sales Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-indigo-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{statistics.productsSold}</p>
                <p className="text-xs text-green-500">+125 this week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Performance Analytics</CardTitle>
            <CardDescription>
              Monthly engagement and conversions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-md">
              <LineChart className="h-16 w-16 text-gray-300 dark:text-gray-600" />
              {/* In a real implementation, this would be an actual chart */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Promotions</CardTitle>
            <CardDescription>Sales by promoted product</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-md">
              <BarChart className="h-16 w-16 text-gray-300 dark:text-gray-600" />
              {/* In a real implementation, this would be an actual chart */}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>Your ongoing brand collaborations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3 font-medium">Campaign</th>
                  <th className="pb-3 font-medium">Brand</th>
                  <th className="pb-3 font-medium">Duration</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Earnings</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4">Summer Collection Launch</td>
                  <td className="py-4">Fashion Brand X</td>
                  <td className="py-4">Apr 10 - May 15</td>
                  <td className="py-4">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Active
                    </Badge>
                  </td>
                  <td className="py-4">$3,250</td>
                  <td className="py-4 text-right">
                    <Button variant="link" className="h-auto p-0">
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4">Fitness Product Review</td>
                  <td className="py-4">GymTech</td>
                  <td className="py-4">Apr 5 - Apr 25</td>
                  <td className="py-4">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Active
                    </Badge>
                  </td>
                  <td className="py-4">$1,800</td>
                  <td className="py-4 text-right">
                    <Button variant="link" className="h-auto p-0">
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4">Beauty Tutorial Series</td>
                  <td className="py-4">Glow Cosmetics</td>
                  <td className="py-4">Mar 20 - Apr 20</td>
                  <td className="py-4">
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200"
                    >
                      Due Soon
                    </Badge>
                  </td>
                  <td className="py-4">$2,500</td>
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
              <Link href="/dashboard/admin/view-as/influencer/campaigns">
                View All Campaigns
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feature Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Products</CardTitle>
            <CardDescription>Manage your promoted products</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard/admin/view-as/influencer/products">
                View Products
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content</CardTitle>
            <CardDescription>Manage your content library</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard/admin/view-as/influencer/content">
                Manage Content
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analytics</CardTitle>
            <CardDescription>Detailed performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard/admin/view-as/influencer/analytics">
                View Analytics
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
              <Link href="/dashboard/admin/influencers">
                Manage All Influencers
              </Link>
            </Button>
            <Button variant="outline" className="bg-white dark:bg-gray-900">
              Edit Influencer Permissions
            </Button>
            <Button variant="outline" className="bg-white dark:bg-gray-900">
              Adjust Commission Rates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
