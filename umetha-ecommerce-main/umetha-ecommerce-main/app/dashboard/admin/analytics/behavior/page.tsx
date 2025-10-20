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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Clock, MousePointer, Users, ArrowDownUp } from "lucide-react";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e"];

import DashboardLayout from "@/app/dashboard/layout";

export default function UserBehaviorPage() {
  const [timeRange, setTimeRange] = useState("24h");
  const [behaviorData, setBehaviorData] = useState({
    overview: {
      avgSessionDuration: "3m 42s",
      bounceRate: "42.3%",
      pagesPerSession: "4.2",
      engagementRate: "68.5%",
    },
    sessionData: [
      { hour: "00:00", sessions: 245, engagedSessions: 180 },
      { hour: "04:00", sessions: 188, engagedSessions: 145 },
      { hour: "08:00", sessions: 456, engagedSessions: 340 },
      { hour: "12:00", sessions: 678, engagedSessions: 520 },
      { hour: "16:00", sessions: 542, engagedSessions: 410 },
      { hour: "20:00", sessions: 334, engagedSessions: 260 },
    ],
    interactions: [
      { name: "Product Views", value: 45 },
      { name: "Add to Cart", value: 25 },
      { name: "Checkout", value: 15 },
      { name: "Purchase", value: 15 },
    ],
  });

  // In a real implementation, we would fetch data based on the timeRange
  useEffect(() => {
    // Fetch behavior data from API using analytics service
  }, [timeRange]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-10 space-y-8">
        <h1 className="text-2xl font-bold mb-4">User Behavior</h1>
        <div className="flex justify-end gap-2">
          {["24h", "7d", "30d"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
                <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Avg Session Duration
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">
                    {behaviorData.overview.avgSessionDuration}
                  </h3>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    +0.3%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <MousePointer className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Bounce Rate
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">
                    {behaviorData.overview.bounceRate}
                  </h3>
                  <span className="text-sm text-red-600 dark:text-red-400">
                    +2.1%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-100 dark:bg-pink-900/20 rounded-full">
                <ArrowDownUp className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pages per Session
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">
                    {behaviorData.overview.pagesPerSession}
                  </h3>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    +0.8
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-100 dark:bg-rose-900/20 rounded-full">
                <Users className="h-6 w-6 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Engagement Rate
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">
                    {behaviorData.overview.engagementRate}
                  </h3>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    +5.2%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Session Activity</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={behaviorData.sessionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    stroke="#6366f1"
                    strokeWidth={2}
                    name="Total Sessions"
                  />
                  <Line
                    type="monotone"
                    dataKey="engagedSessions"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Engaged Sessions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">User Interactions</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={behaviorData.interactions}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {behaviorData.interactions.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
