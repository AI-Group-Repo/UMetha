"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import Cookies from "js-cookie";

export default function DashboardRedirect() {
  const router = useRouter();
  const { user, isLoading, userRole, getDashboardRoute } = useAuth();

  useEffect(() => {
    // Only run this effect once the auth state is loaded
    if (!isLoading) {
      // Check for development bypass cookie first
      const devBypass = Cookies.get("dashboard-dev-bypass");
      if (devBypass === "true") {
        console.log("Dev bypass detected, redirecting to admin dashboard");
        router.replace("/dashboard/admin");
        return;
      }

      // If not authenticated, redirect to dashboard sign-in
      if (!user) {
        console.log("User not authenticated, redirecting to dashboard sign-in");
        router.replace("/dashboard-signin");
        return;
      }

      // Get the appropriate dashboard route based on user's role
      const dashboardRoute = getDashboardRoute();
      console.log(
        `User authenticated as ${userRole}, redirecting to ${dashboardRoute}`
      );

      if (dashboardRoute) {
        router.replace(dashboardRoute);
        return;
      }

      // Fallback - if no specific dashboard for the role, go to main site
      router.replace("/");
    }
  }, [router, user, isLoading, userRole, getDashboardRoute]);

  // Show loading state while determining where to redirect
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-950">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-white text-lg">
          {!user ? "Redirecting to sign-in..." : "Loading your dashboard..."}
        </p>
      </div>
    </div>
  );
}
