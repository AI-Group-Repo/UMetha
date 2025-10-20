"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  BarChart,
  LineChart,
  DollarSign,
  Users,
  ShoppingBag,
  TrendingUp,
  Settings,
  UserCog,
  FileBarChart,
  ShoppingCart,
  PersonStanding,
  TrendingDown,
  ArrowUpRightSquare,
  Bell,
  ArrowRight,
  Calendar,
  Globe,
  AlertCircle,
  Package,
  Eye,
  Tag,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  CreditCard,
  MoreHorizontal,
  ChevronRight,
  CircleHelp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const { user, userRole, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week");
  const [statistics, setStatistics] = useState({
    totalRevenue: "$167,842",
    totalUsers: "12,493",
    totalOrders: "3,287",
    growthRate: "+24.5%",
    newUsers: "386",
    pendingIssues: "12",
    activeVisitors: "243",
    conversionRate: "3.8%",
    averageOrderValue: "$78.50",
    topSellingProducts: [
      { name: "Wireless Earbuds Pro", sales: 1284, revenue: "$115,560" },
      { name: "Smart Watch Series 5", sales: 842, revenue: "$92,620" },
      { name: "Ultra HD 4K Monitor", sales: 654, revenue: "$78,480" },
      { name: "Premium Leather Wallet", sales: 423, revenue: "$16,920" },
    ],
  });

  // Mock data for dashboard
  const [dashboardData, setDashboardData] = useState({
    revenue: {
      total: "$156,389.42",
      trend: "+12.5%",
      isUp: true,
    },
    orders: {
      total: "1,243",
      trend: "+18.2%",
      isUp: true,
    },
    customers: {
      total: "28,456",
      trend: "+5.3%",
      isUp: true,
    },
    conversion: {
      total: "3.6%",
      trend: "-0.4%",
      isUp: false,
    },
  });

  // Chart data for revenue
  const revenueData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue",
        data: [12500, 19200, 15300, 21400, 18700, 24100, 23200],
        backgroundColor: "rgba(79, 70, 229, 0.5)",
        borderColor: "rgba(79, 70, 229, 1)",
        borderWidth: 2,
      },
    ],
  };

  // Chart data for orders
  const orderData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Orders",
        data: [45, 62, 58, 71, 84, 92, 86],
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Top products data
  const topProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      sales: 253,
      revenue: "$37,950",
      status: "In Stock",
    },
    {
      id: 2,
      name: "Designer Handbag",
      sales: 184,
      revenue: "$73,600",
      status: "Low Stock",
    },
    {
      id: 3,
      name: "Smart TV 55-inch",
      sales: 152,
      revenue: "$106,400",
      status: "In Stock",
    },
    {
      id: 4,
      name: "Smartphone Earbuds",
      sales: 138,
      revenue: "$8,280",
      status: "In Stock",
    },
    {
      id: 5,
      name: "Digital Camera",
      sales: 97,
      revenue: "$43,650",
      status: "Out of Stock",
    },
  ];

  // Check for proper admin authorization
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/signin");
        return;
      }

      // Verify the user is an admin
      if (!userRole || userRole.toUpperCase() !== "ADMIN") {
        router.push("/dashboard");
        return;
      }

      setLoading(false);

      // In a real application, fetch dashboard statistics here
      // Example: fetchDashboardStats(timeRange).then(data => setStatistics(data));
    }
  }, [user, userRole, isLoading, router, timeRange]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with date and actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your store's performance and recent activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs
            defaultValue="week"
            className="w-[300px]"
            onValueChange={setTimeRange}
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Welcome Section with Quick Stats */}
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 border-none shadow-md bg-gradient-to-br from-indigo-500 to-violet-600">
          <CardHeader className="pb-2 text-white">
            <CardTitle className="text-2xl font-bold">
              Welcome back, {user?.email?.split("@")[0]}!
            </CardTitle>
            <CardDescription className="text-indigo-100">
              Here's what's happening with your store today.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-white">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>
                {statistics.activeVisitors} customers browsing right now
              </span>
            </div>
          </CardContent>
          <CardFooter className="text-indigo-100">
            <div className="flex gap-3">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white text-indigo-600 hover:bg-indigo-50"
              >
                <FileBarChart className="mr-2 h-4 w-4" />
                View Reports
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-white border-white hover:bg-indigo-700"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-2 gap-4 lg:w-7/12">
          <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Today's Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-4">
                  <DollarSign className="h-8 w-8 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">$4,289</p>
                  <div className="flex items-center text-xs font-medium text-emerald-500">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +12% from yesterday
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Today's Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-4">
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">86</p>
                  <div className="flex items-center text-xs font-medium text-blue-500">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +8% from yesterday
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-4">
                  <CreditCard className="h-8 w-8 text-violet-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {statistics.conversionRate}
                  </p>
                  <div className="flex items-center text-xs font-medium text-violet-500">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +0.5% from last week
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Avg. Order Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-4">
                  <Tag className="h-8 w-8 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {statistics.averageOrderValue}
                  </p>
                  <div className="flex items-center text-xs font-medium text-amber-500">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +3.2% from last week
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dashboard Header Components */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              placeholder="Search dashboard..."
              className="pl-9 w-60 rounded-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 gap-1 w-full max-w-3xl mx-auto">
          <TabsTrigger
            value="overview"
            className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-50 data-[state=active]:to-violet-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:from-indigo-950/50 dark:data-[state=active]:to-violet-950/50 dark:data-[state=active]:text-indigo-300"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="sales"
            className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-50 data-[state=active]:to-violet-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:from-indigo-950/50 dark:data-[state=active]:to-violet-950/50 dark:data-[state=active]:text-indigo-300"
          >
            Sales & Revenue
          </TabsTrigger>
          <TabsTrigger
            value="products"
            className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-50 data-[state=active]:to-violet-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:from-indigo-950/50 dark:data-[state=active]:to-violet-950/50 dark:data-[state=active]:text-indigo-300"
          >
            Products
          </TabsTrigger>
          <TabsTrigger
            value="customers"
            className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-50 data-[state=active]:to-violet-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:from-indigo-950/50 dark:data-[state=active]:to-violet-950/50 dark:data-[state=active]:text-indigo-300"
          >
            Customers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:to-indigo-800/30 flex items-center justify-center mr-4">
                    <DollarSign className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {statistics.totalRevenue}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      +18% from last month
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-100 to-violet-50 dark:from-violet-900/30 dark:to-violet-800/30 flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {statistics.totalUsers}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      {statistics.newUsers} new this month
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center mr-4">
                    <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {statistics.totalOrders}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      +215 this week
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Growth Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/30 flex items-center justify-center mr-4">
                    <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {statistics.growthRate}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      +5.2% from last quarter
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      Revenue Trends
                    </CardTitle>
                    <CardDescription>
                      Daily revenue for the past 30 days
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-md">
                  <Line data={revenueData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      Sale by Category
                    </CardTitle>
                    <CardDescription>
                      Distribution of sales across product categories
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-md">
                  <Bar data={orderData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity and Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-white dark:bg-gray-800 lg:col-span-2">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      Recent Orders
                    </CardTitle>
                    <CardDescription>Latest customer orders</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/admin/orders">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-gray-100 dark:border-gray-700">
                        <th className="py-3 px-4 font-medium">Order ID</th>
                        <th className="py-3 px-4 font-medium">Customer</th>
                        <th className="py-3 px-4 font-medium">Status</th>
                        <th className="py-3 px-4 font-medium">Date</th>
                        <th className="py-3 px-4 font-medium">Total</th>
                        <th className="py-3 px-4 font-medium text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 px-4">#ORD-7893</td>
                        <td className="py-3 px-4">Sarah Johnson</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          >
                            Completed
                          </Badge>
                        </td>
                        <td className="py-3 px-4">Apr 14, 2025</td>
                        <td className="py-3 px-4">$184.99</td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 px-4">#ORD-7892</td>
                        <td className="py-3 px-4">Michael Rodriguez</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                          >
                            Processing
                          </Badge>
                        </td>
                        <td className="py-3 px-4">Apr 13, 2025</td>
                        <td className="py-3 px-4">$79.99</td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 px-4">#ORD-7891</td>
                        <td className="py-3 px-4">Emma Thompson</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          >
                            Shipped
                          </Badge>
                        </td>
                        <td className="py-3 px-4">Apr 12, 2025</td>
                        <td className="py-3 px-4">$124.50</td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">#ORD-7890</td>
                        <td className="py-3 px-4">James Wilson</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                          >
                            Delivered
                          </Badge>
                        </td>
                        <td className="py-3 px-4">Apr 11, 2025</td>
                        <td className="py-3 px-4">$237.25</td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-100 dark:border-gray-700 py-3 px-6">
                <div className="flex justify-center w-full">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href="/dashboard/admin/orders"
                      className="flex items-center"
                    >
                      View All Orders
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">
                    Top Selling Products
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {statistics.topSellingProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4"
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3">
                          <Package className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">
                            {product.sales} sales
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{product.revenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-100 dark:border-gray-700 py-3 px-6">
                <div className="flex justify-center w-full">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href="/dashboard/admin/products"
                      className="flex items-center"
                    >
                      View All Products
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-3">
                <CardTitle className="flex items-center text-lg font-semibold">
                  <AlertCircle className="h-5 w-5 mr-2 text-indigo-500" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">API Status</span>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                    >
                      Operational
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Database Status</span>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                    >
                      Operational
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">CDN Status</span>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                    >
                      Operational
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Search Service</span>
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                    >
                      Degraded
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-3">
                <CardTitle className="flex items-center text-lg font-semibold">
                  <Bell className="h-5 w-5 mr-2 text-indigo-500" />
                  Pending Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Payment Processing Issues
                    </span>
                    <Badge className="bg-indigo-500 text-white">
                      {statistics.pendingIssues}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Inventory Alerts
                    </span>
                    <Badge className="bg-amber-500 text-white">8</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Customer Support Tickets
                    </span>
                    <Badge className="bg-blue-500 text-white">24</Badge>
                  </div>
                  <Button variant="outline" className="w-full mt-2" asChild>
                    <Link href="/dashboard/admin/support">
                      View Support Dashboard
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-3">
                <CardTitle className="flex items-center text-lg font-semibold">
                  <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <Tag className="mr-2 h-4 w-4" />
                    Manage Product Categories
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Review Featured Products
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Tag className="mr-2 h-4 w-4" />
                    Manage Promotions
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Search className="mr-2 h-4 w-4" />
                    View System Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          {/* Sales & Revenue Content */}
          <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Sales Analytics
                  </CardTitle>
                  <CardDescription>
                    Detailed sales and revenue data
                  </CardDescription>
                </div>
                <Button>
                  <FileBarChart className="mr-2 h-4 w-4" /> Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-md">
                <Line data={revenueData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          {/* Products Content */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Products Management</h3>
              <p className="text-sm text-gray-500">
                Manage and monitor your product inventory
              </p>
            </div>
            <div className="flex gap-2">
              <Button>
                <ShoppingBag className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </div>
          </div>

          <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-gray-100 dark:border-gray-700">
                      <th className="py-3 px-4 font-medium">Product</th>
                      <th className="py-3 px-4 font-medium">Category</th>
                      <th className="py-3 px-4 font-medium">Price</th>
                      <th className="py-3 px-4 font-medium">Stock</th>
                      <th className="py-3 px-4 font-medium">Status</th>
                      <th className="py-3 px-4 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3">
                            <Package className="h-5 w-5 text-gray-500" />
                          </div>
                          <span>Wireless Earbuds Pro</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">Electronics</td>
                      <td className="py-3 px-4">$89.99</td>
                      <td className="py-3 px-4">245</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        >
                          In Stock
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          {/* Customers Content */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Customer Management</h3>
              <p className="text-sm text-gray-500">
                View and manage your customer base
              </p>
            </div>
            <div className="flex gap-2">
              <Button>
                <Users className="mr-2 h-4 w-4" /> Add User
              </Button>
            </div>
          </div>

          <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-gray-100 dark:border-gray-700">
                      <th className="py-3 px-4 font-medium">Name</th>
                      <th className="py-3 px-4 font-medium">Email</th>
                      <th className="py-3 px-4 font-medium">Role</th>
                      <th className="py-3 px-4 font-medium">Orders</th>
                      <th className="py-3 px-4 font-medium">Spent</th>
                      <th className="py-3 px-4 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-3">
                            SJ
                          </div>
                          <span>Sarah Johnson</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">sarah.j@example.com</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                        >
                          Influencer
                        </Badge>
                      </td>
                      <td className="py-3 px-4">8</td>
                      <td className="py-3 px-4">$945.32</td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.revenue.total}
            </div>
            <div className="flex items-center pt-1 text-xs">
              {dashboardData.revenue.isUp ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-red-500 mr-1" />
              )}
              <span
                className={
                  dashboardData.revenue.isUp ? "text-green-500" : "text-red-500"
                }
              >
                {dashboardData.revenue.trend}
              </span>
              <span className="text-muted-foreground ml-1">
                vs. previous period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.orders.total}
            </div>
            <div className="flex items-center pt-1 text-xs">
              {dashboardData.orders.isUp ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-red-500 mr-1" />
              )}
              <span
                className={
                  dashboardData.orders.isUp ? "text-green-500" : "text-red-500"
                }
              >
                {dashboardData.orders.trend}
              </span>
              <span className="text-muted-foreground ml-1">
                vs. previous period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.customers.total}
            </div>
            <div className="flex items-center pt-1 text-xs">
              {dashboardData.customers.isUp ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-red-500 mr-1" />
              )}
              <span
                className={
                  dashboardData.customers.isUp
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {dashboardData.customers.trend}
              </span>
              <span className="text-muted-foreground ml-1">
                vs. previous period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.conversion.total}
            </div>
            <div className="flex items-center pt-1 text-xs">
              {dashboardData.conversion.isUp ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-red-500 mr-1" />
              )}
              <span
                className={
                  dashboardData.conversion.isUp
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {dashboardData.conversion.trend}
              </span>
              <span className="text-muted-foreground ml-1">
                vs. previous period
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Daily revenue for the last week</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Bar data={revenueData} options={chartOptions} />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Order Analytics</CardTitle>
            <CardDescription>Daily orders for the last week</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Line data={orderData} options={chartOptions} />
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>
            Your best performing products this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left">Product</th>
                  <th className="pb-3 text-right">Sales</th>
                  <th className="pb-3 text-right">Revenue</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="py-3">{product.name}</td>
                    <td className="py-3 text-right">{product.sales}</td>
                    <td className="py-3 text-right">{product.revenue}</td>
                    <td className="py-3 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${
                          product.status === "In Stock"
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : product.status === "Low Stock"
                            ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                            : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity and Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest actions on your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-4 bg-green-100 rounded-full p-2 dark:bg-green-900/20">
                  <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    New order #ORD-5932 received
                  </p>
                  <p className="text-xs text-muted-foreground">
                    15 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 bg-blue-100 rounded-full p-2 dark:bg-blue-900/20">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">New customer registered</p>
                  <p className="text-xs text-muted-foreground">
                    42 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 bg-yellow-100 rounded-full p-2 dark:bg-yellow-900/20">
                  <ShoppingBag className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Product stock low: Premium Wireless Headphones
                  </p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 bg-purple-100 rounded-full p-2 dark:bg-purple-900/20">
                  <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Payment received for order #ORD-5927
                  </p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-24 flex flex-col">
                <ShoppingBag className="h-5 w-5 mb-2" />
                <span>Add Product</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col">
                <Users className="h-5 w-5 mb-2" />
                <span>Manage Users</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col">
                <Package className="h-5 w-5 mb-2" />
                <span>View Orders</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col">
                <TrendingUp className="h-5 w-5 mb-2" />
                <span>Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
