import DashboardLayout from "@/app/dashboard/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart, PieChart } from "lucide-react";

export default function ReportsPage() {
  const reports = [
    {
      title: "Sales Summary",
      description: "Monthly sales and revenue breakdown",
      icon: BarChart,
    },
    {
      title: "Customer Analytics",
      description: "Customer behavior and demographics",
      icon: PieChart,
    },
    {
      title: "Inventory Status",
      description: "Current stock levels and projections",
      icon: FileText,
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Access and download business reports
            </p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card
              key={report.title}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <report.icon className="h-5 w-5 text-indigo-500" />
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                </div>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
