"use client";

import { Card } from "@/components/ui/card";
import { LineChart } from "@/components/charts";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Heart, MessageSquare } from "lucide-react";

export function EngagementMetrics() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold">Engagement Overview</h3>
        <Badge variant="secondary">Last 30 days</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Profile Views",
            value: "12.5K",
            icon: Users,
            trend: "+12%",
          },
          { label: "Likes", value: "48.2K", icon: Heart, trend: "+25%" },
          {
            label: "Comments",
            value: "2.4K",
            icon: MessageSquare,
            trend: "+8%",
          },
          {
            label: "Growth Rate",
            value: "15%",
            icon: TrendingUp,
            trend: "+5%",
          },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <stat.icon className="h-4 w-4 text-purple-500" />
              <Badge variant="outline" className="text-xs">
                {stat.trend}
              </Badge>
            </div>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="h-[300px]">
        <LineChart />
      </div>
    </Card>
  );
}
