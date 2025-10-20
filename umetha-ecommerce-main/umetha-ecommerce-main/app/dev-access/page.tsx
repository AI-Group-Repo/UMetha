"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function DevAccessPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const router = useRouter();

  // Check if the bypass cookie already exists on page load
  useEffect(() => {
    const existingCookie = Cookies.get("dashboard-dev-bypass");
    if (existingCookie === "true") {
      setDebugInfo(
        "Bypass cookie already exists. You should have dashboard access."
      );
    }
  }, []);

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setDebugInfo(null);

    if (password === "umetha-dev") {
      try {
        // Set the bypass cookie for 7 days
        Cookies.set("dashboard-dev-bypass", "true", {
          expires: 7,
          path: "/",
          sameSite: "strict",
        });

        // Show success message
        setDebugInfo("Access granted! Redirecting to admin dashboard...");

        // Delay navigation slightly to ensure cookie is set
        setTimeout(() => {
          // Use window.location for hard navigation instead of router.push
          window.location.href = "/dashboard/admin";
        }, 1000);
      } catch (err) {
        console.error("Error during redirect:", err);
        setError(
          "Failed to set cookie or redirect. Check console for details."
        );
        setIsLoading(false);
      }
    } else {
      setError("Invalid development password");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Development Access
        </h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/30">
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        {debugInfo && (
          <div className="mb-4 rounded-md bg-green-50 p-4 dark:bg-green-900/30">
            <p className="text-sm text-green-800 dark:text-green-300">
              {debugInfo}
            </p>
          </div>
        )}

        <form onSubmit={handleAccess}>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
            >
              Development Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              placeholder="Enter development password"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Use the development password to bypass authentication
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Accessing..." : "Access Dashboard"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This is for development use only. In production, proper
            authentication should be used.
          </p>

          <div className="mt-4 border-t pt-4 space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                // Direct link to admin dashboard
                window.location.href = "/dashboard/admin";
              }}
            >
              Force Navigation to Admin Dashboard
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600"
              onClick={() => {
                // Direct link to influencer dashboard
                window.location.href = "/dashboard/influencer";
              }}
            >
              🎭 Access Influencer Features
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600"
              onClick={() => {
                // Direct link to influencer product management
                window.location.href = "/dashboard/influencer/products";
              }}
            >
              📦 Manage Products
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
              onClick={() => {
                // Direct link to influencer store
                window.location.href = "/dashboard/influencer/store";
              }}
            >
              🛍️ View My Store
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
              onClick={() => {
                // Direct link to enhanced checkout
                window.location.href = "/checkout/enhanced";
              }}
            >
              💳 Enhanced Checkout (Multi-Payment)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
