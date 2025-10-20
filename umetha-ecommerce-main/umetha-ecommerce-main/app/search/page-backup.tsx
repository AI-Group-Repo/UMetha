"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import MainLayout from "@/components/main-layout";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <MainLayout hideFittingRoom hideRoomVisualizer>
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Search Results for "{query}"
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Search functionality is being loaded...
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
