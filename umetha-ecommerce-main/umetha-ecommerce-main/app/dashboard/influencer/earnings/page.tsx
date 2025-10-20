"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart } from "@/components/charts";
import { Download, DollarSign, TrendingUp, CreditCard } from "lucide-react";

export default function EarningsPage() {
  const earningStats = [
    {
      title: "Total Earnings",
      amount: "$12,546.00",
      change: "+12.5%",
      period: "vs last month",
    },
    {
      title: "Available Balance",
      amount: "$8,425.00",
      action: "Withdraw",
    },
    {
      title: "Pending Payments",
      amount: "$2,156.00",
      status: "Processing",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Earnings</h1>
          <p className="text-muted-foreground">
            Track your revenue and withdrawals
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {earningStats.map((stat, index) => (
          <Card key={index} className="p-6">
            {/* Earnings stats cards */}
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-6">Earnings Overview</h3>
          <LineChart />
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-6">Sales by Product</h3>
          <BarChart />
        </Card>
      </div>
    </div>
  );
}
