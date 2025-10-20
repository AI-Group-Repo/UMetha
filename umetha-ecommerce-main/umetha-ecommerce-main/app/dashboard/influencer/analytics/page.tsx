"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Users, ShoppingBag } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Jan", revenue: 4000, orders: 240, visitors: 1200 },
  { name: "Feb", revenue: 3000, orders: 198, visitors: 900 },
  { name: "Mar", revenue: 5000, orders: 300, visitors: 1500 },
  { name: "Apr", revenue: 8000, orders: 450, visitors: 2100 },
  { name: "May", revenue: 7500, orders: 420, visitors: 1800 },
  { name: "Jun", revenue: 9000, orders: 580, visitors: 2500 },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("7d");

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Monitor your store performance
          </p>
        </div>
        <div className="flex gap-2">
          {["7d", "30d", "90d", "1y"].map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? "default" : "outline"}
              onClick={() => setDateRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Add statistics cards */}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Revenue Growth</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Orders Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
