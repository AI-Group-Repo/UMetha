import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="p-6">
        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-transparent border-b">
            <TabsTrigger value="sales" asChild>
              <Link href="/dashboard/admin/analytics/sales">
                Sales Performance
              </Link>
            </TabsTrigger>
            <TabsTrigger value="customer" asChild>
              <Link href="/dashboard/admin/analytics/customer">
                Customer Insights
              </Link>
            </TabsTrigger>
            <TabsTrigger value="traffic" asChild>
              <Link href="/dashboard/admin/analytics/traffic">
                Traffic & Conversion
              </Link>
            </TabsTrigger>
            <TabsTrigger value="real-time" asChild>
              <Link href="/dashboard/admin/analytics/real-time">
                Real-Time Analytics
              </Link>
            </TabsTrigger>
            <TabsTrigger value="behavior" asChild>
              <Link href="/dashboard/admin/analytics/behavior">
                User Behavior
              </Link>
            </TabsTrigger>
          </TabsList>
          {children}
        </Tabs>
      </Card>
    </div>
  );
}
