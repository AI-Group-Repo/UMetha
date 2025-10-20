"use client";

import React from "react";
import MainLayout from "@/components/main-layout";
import VirtualTryOnDebug from "@/components/virtual-tryon-debug";

export default function TestVirtualTryOnPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Virtual Try-On API Test
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Test the virtual try-on API integration
            </p>
          </div>
          
          <VirtualTryOnDebug />
        </div>
      </div>
    </MainLayout>
  );
}
