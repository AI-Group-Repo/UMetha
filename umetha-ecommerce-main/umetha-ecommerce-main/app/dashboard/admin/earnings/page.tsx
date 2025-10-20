import DashboardLayout from "@/app/dashboard/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  Wallet,
  Download,
  Calendar,
} from "lucide-react";

export default function EarningsPage() {
  const earnings = {
    totalRevenue: "₹2,459,783",
    netProfit: "₹892,463",
    pendingPayouts: "₹145,890",
    lastPayout: "₹234,567",
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Earnings</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Track revenue and financial performance
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Select Period
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{earnings.totalRevenue}</p>
                  <p className="text-xs text-green-500">
                    +12.4% from last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Net Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-indigo-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{earnings.netProfit}</p>
                  <p className="text-xs text-green-500">
                    +8.2% from last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Pending Payouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Wallet className="h-8 w-8 text-amber-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {earnings.pendingPayouts}
                  </p>
                  <p className="text-xs text-amber-500">12 payouts pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Last Payout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{earnings.lastPayout}</p>
                  <p className="text-xs text-gray-500">
                    Processed Apr 15, 2025
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 min-h-[300px] flex flex-col items-center justify-center border border-indigo-100 dark:border-indigo-900">
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            Earnings chart and detailed analytics will appear here.
          </p>
          <div className="h-48 w-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/20 rounded">
            <span className="text-indigo-400 dark:text-indigo-600">
              [Earnings Chart]
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
