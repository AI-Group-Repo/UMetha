"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, ShoppingCart, Zap } from "lucide-react";

export default function RealTimeAnalytics() {
  const [liveData, setLiveData] = useState({
    overview: {
      activeUsers: 342,
      activeUsersChange: "+12",
      activeSessionLength: "4m 12s",
      cartValue: "$4,285",
      conversionRate: "3.8%",
    },
    recentActivity: [
      { type: "view", page: "/products/electronics", users: 5, time: "2m ago" },
      { type: "cart", page: "/cart", users: 2, time: "3m ago" },
      { type: "purchase", page: "/checkout", users: 1, time: "5m ago" },
    ],
    timeSeriesData: Array(30)
      .fill(0)
      .map((_, i) => ({
        time: `${29 - i}m ago`,
        users: Math.floor(Math.random() * 100 + 250),
        actions: Math.floor(Math.random() * 50 + 100),
      })),
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData((prev) => ({
        ...prev,
        timeSeriesData: [
          ...prev.timeSeriesData.slice(1),
          {
            time: "now",
            users: Math.floor(Math.random() * 100 + 250),
            actions: Math.floor(Math.random() * 50 + 100),
          },
        ],
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header with live indicator */}
      <div className="flex items-center gap-2">
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
          Live
        </Badge>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Data updates every 10 seconds
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
              <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Active Users
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">
                  {liveData.overview.activeUsers}
                </h3>
                <span className="text-sm text-green-600 dark:text-green-400">
                  {liveData.overview.activeUsersChange}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Session Length
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">
                  {liveData.overview.activeSessionLength}
                </h3>
                <span className="text-sm text-green-600 dark:text-green-400">
                  +18s
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-100 dark:bg-pink-900/20 rounded-full">
              <ShoppingCart className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Active Cart Value
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">
                  {liveData.overview.cartValue}
                </h3>
                <span className="text-sm text-green-600 dark:text-green-400">
                  +$245
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-100 dark:bg-rose-900/20 rounded-full">
              <Zap className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Live Conversion
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">
                  {liveData.overview.conversionRate}
                </h3>
                <span className="text-sm text-green-600 dark:text-green-400">
                  +0.2%
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Real-time activity chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Real-Time Activity</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={liveData.timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" interval={4} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#6366f1"
                strokeWidth={2}
                name="Active Users"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="actions"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="User Actions"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent activity list */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Live Activity Feed</h3>
        <div className="space-y-4">
          {liveData.recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {activity.type === "view" && (
                  <Users className="h-5 w-5 text-blue-500" />
                )}
                {activity.type === "cart" && (
                  <ShoppingCart className="h-5 w-5 text-purple-500" />
                )}
                {activity.type === "purchase" && (
                  <Zap className="h-5 w-5 text-green-500" />
                )}
                <div>
                  <p className="text-sm font-medium">{activity.page}</p>
                  <p className="text-xs text-gray-500">
                    {activity.users} user{activity.users > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
