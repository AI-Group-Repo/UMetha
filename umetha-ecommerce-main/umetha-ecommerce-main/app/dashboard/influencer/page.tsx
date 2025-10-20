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
  Wallet,
  Users,
  TrendingUp,
  ShoppingBag,
  Camera,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function InfluencerDashboard() {
  const { user, userRole, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalEarnings: "$12,538",
    followers: "128.4K",
    engagementRate: "4.7%",
    productsSold: "843",
    avgOrderValue: "$78.24",
    clickThroughRate: "3.2%",
    pendingMessages: "8",
  });

  // Check for proper role authorization
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/signin");
        return;
      }

      // Check for temporary role impersonation by admins
      const getCookieValue = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
        return null;
      };

      const tempRole = getCookieValue("temp_role");
      const originalRole = getCookieValue("original_role");
      const isAdminImpersonating =
        tempRole === "INFLUENCER" && originalRole === "ADMIN";

      // Allow access if the user is actually an influencer OR an admin impersonating an influencer
      if (
        !userRole ||
        (userRole.toUpperCase() !== "INFLUENCER" && !isAdminImpersonating)
      ) {
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
      <RoleImpersonationBanner />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Influencer Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back! Here's an overview of your performance and campaigns.
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button>
            <Camera className="mr-2 h-4 w-4" />
            Create Content
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share Profile
          </Button>
        </div>
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
              {/* We would include an actual chart library like recharts here */}
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
              {/* We would include an actual chart library like recharts here */}
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
              <Link href="/dashboard/influencer/campaigns">
                View All Campaigns
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>New Collaboration Opportunities</CardTitle>
          <CardDescription>
            Brand partnership requests waiting for your response
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-semibold">Luxury Watch Brand</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Looking for lifestyle content featuring our new collection
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Budget:</span> $2,000 - $3,500
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Duration:</span> 30 days
                  </p>
                </div>
                <div className="ml-4 flex flex-col gap-2">
                  <Button size="sm">View Details</Button>
                  <Button size="sm" variant="outline">
                    Decline
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-semibold">Organic Food Delivery</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Seeking health and wellness content creators for a 3-month
                    campaign
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Budget:</span> $4,500 - $6,000
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Duration:</span> 90 days
                  </p>
                </div>
                <div className="ml-4 flex flex-col gap-2">
                  <Button size="sm">View Details</Button>
                  <Button size="sm" variant="outline">
                    Decline
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              Browse More Opportunities
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
