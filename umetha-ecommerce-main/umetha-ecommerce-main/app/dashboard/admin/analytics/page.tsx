"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
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
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsDashboard() {
  const { user, userRole, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");
  const [chartType, setChartType] = useState("bar");

  const [salesData, setSalesData] = useState({
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Sales 2025",
        data: [
          18500, 20100, 24300, 19800, 26200, 32100, 31700, 29400, 33800, 36200,
          39800, 41200,
        ],
        borderColor: "rgba(79, 70, 229, 1)",
        backgroundColor: "rgba(79, 70, 229, 0.4)",
      },
      {
        label: "Sales 2024",
        data: [
          15300, 16800, 18900, 16500, 21000, 28000, 26400, 25800, 28600, 31000,
          30200, 32400,
        ],
        borderColor: "rgba(99, 102, 241, 1)",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
      },
    ],
  });

  const [categoryData, setCategoryData] = useState({
    labels: [
      "Electronics",
      "Fashion",
      "Home",
      "Beauty",
      "Sports",
      "Books",
      "Toys",
    ],
    datasets: [
      {
        label: "Sales by Category",
        data: [35, 25, 15, 10, 8, 4, 3],
        backgroundColor: [
          "rgba(79, 70, 229, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(14, 165, 233, 0.7)",
          "rgba(168, 85, 247, 0.7)",
          "rgba(249, 115, 22, 0.7)",
        ],
      },
    ],
  });

  const [trafficData, setTrafficData] = useState({
    labels: [
      "Direct",
      "Organic Search",
      "Social Media",
      "Email",
      "Referral",
      "Paid Ads",
    ],
    datasets: [
      {
        label: "Traffic Sources",
        data: [30, 25, 20, 15, 5, 5],
        backgroundColor: [
          "rgba(79, 70, 229, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(14, 165, 233, 0.7)",
          "rgba(168, 85, 247, 0.7)",
        ],
      },
    ],
  });

  const [deviceData, setDeviceData] = useState({
    labels: ["Mobile", "Desktop", "Tablet"],
    datasets: [
      {
        label: "Device Usage",
        data: [65, 30, 5],
        backgroundColor: [
          "rgba(79, 70, 229, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
        ],
      },
    ],
  });

  // This would normally be fetched from an API
  const performanceMetrics = [
    { metric: "Avg. Order Value", value: "$87.42", trend: "+5.2%", isUp: true },
    { metric: "Conversion Rate", value: "3.8%", trend: "+0.6%", isUp: true },
    { metric: "Cart Abandonment", value: "68.3%", trend: "-2.1%", isUp: true },
    { metric: "Return Rate", value: "5.7%", trend: "+0.3%", isUp: false },
    {
      metric: "Avg. Session Duration",
      value: "4m 12s",
      trend: "+18s",
      isUp: true,
    },
    { metric: "Pages per Session", value: "3.4", trend: "-0.2", isUp: false },
  ];

  const topProducts = [
    { name: "Premium Wireless Headphones", revenue: "$37,950", units: "253" },
    { name: "Designer Handbag", revenue: "$73,600", units: "184" },
    { name: "Smart TV 55-inch", revenue: "$106,400", units: "152" },
    { name: "Smartphone Earbuds", revenue: "$8,280", units: "138" },
    { name: "Digital Camera", revenue: "$43,650", units: "97" },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

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
    }
  }, [user, userRole, isLoading, router]);

  // This would normally update data based on the selected time range
  useEffect(() => {
    // Simulating API call to get data based on timeRange
    console.log(`Fetching data for ${timeRange} time range`);
    // In a real application, you would make an API call here
    // and update the state with the returned data
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            In-depth analysis of your store's performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="30d" onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid grid-cols-4 max-w-[600px]">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Monthly sales performance</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="bar" onValueChange={setChartType}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Chart type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="h-[400px]">
                {chartType === "bar" ? (
                  <Bar data={salesData} options={chartOptions} />
                ) : (
                  <Line data={salesData} options={chartOptions} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>
                  Distribution across product categories
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Doughnut data={categoryData} options={chartOptions} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Products by Revenue</CardTitle>
                <CardDescription>Best performing products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {product.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {product.units} units sold
                        </div>
                      </div>
                      <div className="font-medium">{product.revenue}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Performance metrics cards */}
            {performanceMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.metric}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center pt-1 text-xs">
                    <span
                      className={
                        metric.isUp ? "text-green-500" : "text-red-500"
                      }
                    >
                      {metric.trend}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      vs. previous period
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
                <CardDescription>Customer device usage</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Pie data={deviceData} options={chartOptions} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>
                  Where your customers come from
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Doughnut data={trafficData} options={chartOptions} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>
                  Performance by product category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <Bar data={categoryData} options={chartOptions} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>
                  Current stock levels by category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Pie
                  data={{
                    labels: ["In Stock", "Low Stock", "Out of Stock"],
                    datasets: [
                      {
                        label: "Inventory Status",
                        data: [65, 25, 10],
                        backgroundColor: [
                          "rgba(16, 185, 129, 0.7)", // green
                          "rgba(245, 158, 11, 0.7)", // amber
                          "rgba(239, 68, 68, 0.7)", // red
                        ],
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Ratings</CardTitle>
                <CardDescription>Average ratings by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Bar
                  data={{
                    labels: [
                      "Electronics",
                      "Fashion",
                      "Home",
                      "Beauty",
                      "Sports",
                      "Books",
                      "Toys",
                    ],
                    datasets: [
                      {
                        label: "Average Rating",
                        data: [4.7, 4.3, 4.5, 4.8, 4.2, 4.6, 4.1],
                        backgroundColor: "rgba(79, 70, 229, 0.7)",
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    scales: {
                      y: {
                        min: 0,
                        max: 5,
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Breakdown of visitor sources</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Doughnut data={trafficData} options={chartOptions} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>ROI for marketing campaigns</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Bar
                  data={{
                    labels: [
                      "Summer Sale",
                      "Back to School",
                      "Black Friday",
                      "Holiday Special",
                      "New Year",
                    ],
                    datasets: [
                      {
                        label: "Revenue",
                        data: [12500, 9800, 25600, 18900, 14300],
                        backgroundColor: "rgba(79, 70, 229, 0.7)",
                      },
                      {
                        label: "Cost",
                        data: [2500, 1800, 5600, 3900, 2300],
                        backgroundColor: "rgba(239, 68, 68, 0.7)",
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>
                  Customer journey through the sales funnel
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <Bar
                  data={{
                    labels: [
                      "Page Views",
                      "Add to Cart",
                      "Checkout",
                      "Purchase",
                    ],
                    datasets: [
                      {
                        label: "Conversion Steps",
                        data: [10000, 3000, 1800, 1000],
                        backgroundColor: [
                          "rgba(79, 70, 229, 0.7)",
                          "rgba(16, 185, 129, 0.7)",
                          "rgba(245, 158, 11, 0.7)",
                          "rgba(14, 165, 233, 0.7)",
                        ],
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    indexAxis: "y",
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
