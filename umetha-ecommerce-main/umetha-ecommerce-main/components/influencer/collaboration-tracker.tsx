import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronUp,
  ChevronDown,
  BarChart3,
  Calendar,
  Users,
  CheckCircle2,
  ShoppingBag,
  Megaphone,
  Zap,
  Briefcase,
  Clock,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Types for collaboration data
export interface Collaboration {
  id: string;
  brandName: string;
  brandLogo: string;
  campaignName: string;
  status: "active" | "completed" | "pending" | "draft";
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  targets: {
    sales: number;
    reach: number;
    engagement: number;
  };
  performance: {
    sales: number;
    reach: number;
    engagement: number;
  };
  products: Array<{
    id: string;
    name: string;
    image: string;
    soldUnits: number;
    revenue: number;
  }>;
  recentActivities: Array<{
    type: "message" | "milestone" | "payment" | "content";
    date: string;
    description: string;
  }>;
}

interface CollaborationTrackerProps {
  collaborations: Collaboration[];
  influencerId?: number;
  brandId?: number;
  viewMode?: "influencer" | "brand";
}

export function CollaborationTracker({
  collaborations,
  influencerId,
  brandId,
  viewMode = "influencer",
}: CollaborationTrackerProps) {
  const [activeTab, setActiveTab] = useState("active");

  // Filter collaborations based on status and user type
  const filteredCollaborations = collaborations.filter((collab) => {
    if (activeTab === "all") return true;
    return collab.status === activeTab;
  });

  return (
    <Card className="shadow-md border-purple-100 dark:border-purple-900/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Collaboration Hub</span>
          <Badge
            variant="outline"
            className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
          >
            {viewMode === "influencer" ? "Influencer View" : "Brand View"}
          </Badge>
        </CardTitle>
        <CardDescription>
          Track and manage your brand partnerships and campaigns
        </CardDescription>
      </CardHeader>

      <Tabs
        defaultValue="active"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="px-6">
          <TabsList className="grid grid-cols-4 mb-4 bg-purple-50/50 dark:bg-purple-900/10">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          <div className="space-y-4 px-6 pb-6">
            {filteredCollaborations.length > 0 ? (
              filteredCollaborations.map((collab) => (
                <CollaborationCard
                  key={collab.id}
                  collaboration={collab}
                  viewMode={viewMode}
                />
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  No {activeTab} collaborations found.
                </p>
                <Button variant="outline" className="mt-4">
                  {viewMode === "influencer"
                    ? "Find Brands to Collaborate With"
                    : "Find Influencers to Collaborate With"}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function CollaborationCard({
  collaboration,
  viewMode,
}: {
  collaboration: Collaboration;
  viewMode: "influencer" | "brand";
}) {
  const [expanded, setExpanded] = useState(false);

  // Calculate percentage of budget spent
  const budgetPercentage = Math.round(
    (collaboration.spent / collaboration.budget) * 100
  );

  // Calculate days left or days since completion
  const today = new Date();
  const endDate = new Date(collaboration.endDate);
  const daysLeft = Math.ceil(
    (endDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
  );

  // Calculate performance percentages
  const salesPercentage = Math.round(
    (collaboration.performance.sales / collaboration.targets.sales) * 100
  );
  const reachPercentage = Math.round(
    (collaboration.performance.reach / collaboration.targets.reach) * 100
  );
  const engagementPercentage = Math.round(
    (collaboration.performance.engagement / collaboration.targets.engagement) *
      100
  );

  return (
    <Card
      className={`border overflow-hidden transition-all duration-300 ${
        collaboration.status === "active"
          ? "border-green-200 dark:border-green-800/30 bg-green-50/30 dark:bg-green-950/10"
          : collaboration.status === "pending"
          ? "border-amber-200 dark:border-amber-800/30 bg-amber-50/30 dark:bg-amber-950/10"
          : "border-gray-200 dark:border-gray-800/30 bg-gray-50/30 dark:bg-gray-950/10"
      }`}
    >
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={collaboration.brandLogo}
                alt={collaboration.brandName}
              />
              <AvatarFallback>{collaboration.brandName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{collaboration.campaignName}</h3>
              <p className="text-sm text-muted-foreground">
                {collaboration.brandName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              className={`${
                collaboration.status === "active"
                  ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                  : collaboration.status === "pending"
                  ? "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                  : collaboration.status === "completed"
                  ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  : "bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300"
              }`}
            >
              {collaboration.status.charAt(0).toUpperCase() +
                collaboration.status.slice(1)}
            </Badge>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExpanded(!expanded)}
              className="h-8 w-8"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          expanded ? "max-h-screen" : "max-h-0"
        }`}
      >
        <CardContent className="p-4 pt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>Campaign Duration</span>
                </div>
                <span className="font-medium">
                  {daysLeft > 0
                    ? `${daysLeft} days left`
                    : `Ended ${Math.abs(daysLeft)} days ago`}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>
                  {new Date(collaboration.startDate).toLocaleDateString()}
                </span>
                <span>—</span>
                <span>
                  {new Date(collaboration.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>Budget</span>
                </div>
                <span className="font-medium">
                  ${collaboration.spent} / ${collaboration.budget}
                </span>
              </div>
              <Progress value={budgetPercentage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>Products</span>
                </div>
                <span className="font-medium">
                  {collaboration.products.length} items
                </span>
              </div>
              <div className="flex items-center">
                {collaboration.products.slice(0, 3).map((product, index) => (
                  <Avatar
                    key={product.id}
                    className={`h-8 w-8 border-2 border-white dark:border-gray-800 ${
                      index > 0 ? "-ml-3" : ""
                    }`}
                  >
                    <AvatarImage src={product.image} alt={product.name} />
                    <AvatarFallback>{product.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
                {collaboration.products.length > 3 && (
                  <div className="h-8 w-8 -ml-3 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xs font-medium text-purple-700 dark:text-purple-300 border-2 border-white dark:border-gray-800">
                    +{collaboration.products.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>Performance Metrics</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Sales</span>
                  <span className="font-medium">
                    {collaboration.performance.sales} /{" "}
                    {collaboration.targets.sales}
                  </span>
                </div>
                <Progress value={salesPercentage} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Reach</span>
                  <span className="font-medium">
                    {collaboration.performance.reach} /{" "}
                    {collaboration.targets.reach}
                  </span>
                </div>
                <Progress value={reachPercentage} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Engagement</span>
                  <span className="font-medium">
                    {collaboration.performance.engagement}% /{" "}
                    {collaboration.targets.engagement}%
                  </span>
                </div>
                <Progress value={engagementPercentage} className="h-2" />
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>Recent Activity</span>
            </h4>

            <div className="space-y-3">
              {collaboration.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`p-1.5 rounded-full mt-0.5 ${
                      activity.type === "message"
                        ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        : activity.type === "milestone"
                        ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                        : activity.type === "payment"
                        ? "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                        : "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                    }`}
                  >
                    {activity.type === "message" && (
                      <Megaphone className="h-3.5 w-3.5" />
                    )}
                    {activity.type === "milestone" && (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}
                    {activity.type === "payment" && (
                      <Zap className="h-3.5 w-3.5" />
                    )}
                    {activity.type === "content" && (
                      <Users className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-end gap-2">
          <Button variant="outline">View Details</Button>
          <Button>
            {collaboration.status === "active"
              ? "Manage Campaign"
              : collaboration.status === "pending"
              ? "Review Proposal"
              : "View Report"}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
