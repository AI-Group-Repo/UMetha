"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ArrowLeft, UserCog } from "lucide-react";

export default function ViewAsPage() {
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

  const roleViewOptions = [
    {
      name: "Influencer Dashboard",
      description: "View the platform as an influencer",
      path: "/dashboard/admin/view-as/influencer",
      icon: "🎥",
    },
    {
      name: "Seller Dashboard",
      description: "View the platform as a seller",
      path: "/dashboard/admin/view-as/seller",
      icon: "🛒",
    },
    {
      name: "User Dashboard",
      description: "View the platform as a regular user",
      path: "/dashboard/admin/view-as/user",
      icon: "👤",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            User Role Impersonation
          </h1>
          <p className="text-muted-foreground">
            View the platform as different user roles for testing and
            verification
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roleViewOptions.map((option) => (
          <Card
            key={option.name}
            className="border-none shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-2">{option.icon}</span>
                {option.name}
              </CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Button className="w-full" asChild>
                <Link href={option.path}>
                  <Eye className="mr-2 h-4 w-4" />
                  Access Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-amber-800 dark:text-amber-300 text-lg flex items-center">
            <UserCog className="h-5 w-5 mr-2" />
            Admin Note
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-amber-700 dark:text-amber-400">
            This view-as feature allows you to see the platform from the
            perspective of different user roles. You will maintain your admin
            privileges while browsing these dashboards. Any changes you make
            will be attributed to your admin account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
