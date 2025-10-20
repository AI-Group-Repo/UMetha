"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Users, Heart, ShoppingBag, Repeat } from "lucide-react";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#0ea5e9"];

export default function CustomerInsights() {
  const [timeRange, setTimeRange] = useState("30d");
  const [customerData, setCustomerData] = useState({
    overview: {
      totalCustomers: "12,845",
      activeCustomers: "8,234",
      avgLifetimeValue: "$842",
      repeatRate: "68%",
    },
    segments: [
      { name: "VIP", value: 15 },
      { name: "Regular", value: 35 },
      { name: "Occasional", value: 25 },
      { name: "New", value: 15 },
      { name: "At Risk", value: 10 },
    ],
    acquisition: [
      { month: "Jan", organic: 450, paid: 280, referral: 190 },
      { month: "Feb", organic: 520, paid: 310, referral: 220 },
      { month: "Mar", organic: 480, paid: 350, referral: 250 },
      { month: "Apr", organic: 580, paid: 420, referral: 280 },
      { month: "May", organic: 620, paid: 380, referral: 310 },
      { month: "Jun", organic: 680, paid: 450, referral: 340 },
    ],
    retention: [
      { month: 1, rate: 100 },
      { month: 2, rate: 80 },
      { month: 3, rate: 65 },
      { month: 4, rate: 55 },
      { month: 5, rate: 48 },
      { month: 6, rate: 45 },
    ],
  });

  // In a real implementation, we would fetch data based on the timeRange
  useEffect(() => {
    // Fetch customer data from API
  }, [timeRange]);

  return (
    <div className="space-y-8">
      {/* Time range selector */}
      <div className="flex justify-end gap-2">
        {["7d", "30d", "90d", "1y"].map((range) => (
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
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
              <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Customers
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">
                  {customerData.overview.totalCustomers}
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
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Active Customers
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">
                  {customerData.overview.activeCustomers}
                </h3>
                <span className="text-sm text-green-600 dark:text-green-400">
                  +5.1%
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-100 dark:bg-pink-900/20 rounded-full">
              <ShoppingBag className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Avg Lifetime Value
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">
                  {customerData.overview.avgLifetimeValue}
                </h3>
                <span className="text-sm text-green-600 dark:text-green-400">
                  +12.3%
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <Repeat className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Repeat Purchase Rate
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">
                  {customerData.overview.repeatRate}
                </h3>
                <span className="text-sm text-green-600 dark:text-green-400">
                  +3.8%
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Segments */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Segments</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerData.segments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {customerData.segments.map((entry, index) => (
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

        {/* Customer Acquisition */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Acquisition</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerData.acquisition}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="organic"
                  stackId="a"
                  fill="#6366f1"
                  name="Organic"
                />
                <Bar dataKey="paid" stackId="a" fill="#8b5cf6" name="Paid" />
                <Bar
                  dataKey="referral"
                  stackId="a"
                  fill="#ec4899"
                  name="Referral"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Retention Rate */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Customer Retention Rate</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={customerData.retention}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                label={{
                  value: "Months",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                label={{
                  value: "Retention Rate (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#6366f1"
                strokeWidth={2}
                name="Retention Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
