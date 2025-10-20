"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Globe, ArrowUpRight, MousePointer, Clock } from "lucide-react";
import DashboardLayout from "@/app/dashboard/layout";

export default function TrafficConversionPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [trafficData, setTrafficData] = useState({
    overview: {
      totalVisitors: "24,521",
      uniqueVisitors: "18,432",
      averageTime: "3m 45s",
      exitRate: "42.3%",
    },
    sourceData: [
      { source: "Direct", visitors: 8500 },
      { source: "Organic Search", visitors: 6200 },
      { source: "Social Media", visitors: 4800 },
      { source: "Referral", visitors: 2900 },
      { source: "Email", visitors: 2100 },
    ],
    conversionData: [
      { stage: "Visit", count: 24521 },
      { stage: "Product View", count: 12450 },
      { stage: "Add to Cart", count: 4320 },
      { stage: "Checkout", count: 2150 },
      { stage: "Purchase", count: 1280 },
    ],
    trafficOverTime: Array(7)
      .fill(0)
      .map((_, i) => ({
        day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
        visitors: Math.floor(Math.random() * 5000 + 15000),
        pageviews: Math.floor(Math.random() * 8000 + 25000),
      })),
  });

  // In a real implementation, we would fetch data based on the timeRange
  useEffect(() => {
    // Fetch traffic data from API
  }, [timeRange]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Time range selector */}
        <div className="flex justify-end gap-2">
          {["24h", "7d", "30d", "90d"].map((range) => (
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
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Visitors
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">
                    {trafficData.overview.totalVisitors}
                  </h3>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    +12.5%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
                <MousePointer className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Unique Visitors
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">
                    {trafficData.overview.uniqueVisitors}
                  </h3>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    +8.2%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-violet-100 dark:bg-violet-900/20 rounded-full">
                <Clock className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Average Time
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">
                    {trafficData.overview.averageTime}
                  </h3>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    +0.5m
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-100 dark:bg-pink-900/20 rounded-full">
                <ArrowUpRight className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Exit Rate
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">
                    {trafficData.overview.exitRate}
                  </h3>
                  <span className="text-sm text-red-600 dark:text-red-400">
                    +2.1%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Traffic over time chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Traffic Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData.trafficOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="Visitors"
                />
                <Line
                  type="monotone"
                  dataKey="pageviews"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Pageviews"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic sources chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficData.sourceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visitors" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Conversion funnel chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficData.conversionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
