"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Package, ShoppingCart } from "lucide-react";

export default function SalesAnalytics() {
  const [timeRange, setTimeRange] = useState("7d");
  const [salesData, setSalesData] = useState({
    overview: {
      totalRevenue: "$167,842",
      growth: "+24.5%",
      averageOrderValue: "$125",
      conversionRate: "3.2%",
    },
    timeSeriesData: [
      { date: "Mon", sales: 12000, orders: 145 },
      { date: "Tue", sales: 19000, orders: 238 },
      { date: "Wed", sales: 15000, orders: 180 },
      { date: "Thu", sales: 22000, orders: 264 },
      { date: "Fri", sales: 18000, orders: 220 },
      { date: "Sat", sales: 25000, orders: 298 },
      { date: "Sun", sales: 20000, orders: 245 },
    ],
    categoryData: [
      { name: "Electronics", value: 45000 },
      { name: "Fashion", value: 35000 },
      { name: "Home", value: 25000 },
      { name: "Beauty", value: 20000 },
      { name: "Sports", value: 15000 },
    ],
  });

  // In a real implementation, we would fetch data based on the timeRange
  useEffect(() => {
    // Fetch sales data from API
  }, [timeRange]);

  return (
    <div className="space-y-8">
      {/* Time range selector */}
      <div className="flex justify-end gap-2">
        {["24h", "7d", "30d", "90d", "1y"].map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? "default" : "outline"}
            onClick={() => setTimeRange(range)}
          >
            {range}
          </Button>
        ))}
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Revenue
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">
                  {salesData.overview.totalRevenue}
                </h3>
                <span className="text-sm text-green-600 dark:text-green-400">
                  {salesData.overview.growth}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Avg Order Value
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">
                  {salesData.overview.averageOrderValue}
                </h3>
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  +5.2%
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Orders
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">1,590</h3>
                <span className="text-sm text-purple-600 dark:text-purple-400">
                  +12.8%
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
              <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Conversion Rate
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">
                  {salesData.overview.conversionRate}
                </h3>
                <span className="text-sm text-orange-600 dark:text-orange-400">
                  +0.8%
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData.timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#6366f1"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData.categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
