"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Filter,
  MoreVertical,
  Star,
  Download,
  Users,
  ThumbsUp,
  TrendingUp,
  ShoppingBag,
  Instagram,
  Twitter,
  Globe,
  Youtube,
  BarChart3,
  Mail,
  Eye,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function InfluencersPage() {
  const { user, userRole, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([]);

  // Mock data for influencers
  const [influencers, setInfluencers] = useState([
    {
      id: "1",
      name: "Sarah Johnson",
      handle: "@sarahjstyle",
      email: "sarah.j@example.com",
      avatar: "https://github.com/shadcn.png",
      followers: 128400,
      engagement: "4.7%",
      categories: ["Fashion", "Lifestyle"],
      status: "active",
      verified: true,
      sales: 843,
      platforms: ["instagram", "tiktok"],
      joined: "Jan 15, 2025",
      featureStatus: "featured",
      campaignCount: 12,
    },
    {
      id: "2",
      name: "Jessica Williams",
      handle: "@jessbeauty",
      email: "jessica.w@example.com",
      avatar: "",
      followers: 98700,
      engagement: "5.2%",
      categories: ["Beauty", "Skincare"],
      status: "active",
      verified: true,
      sales: 756,
      platforms: ["instagram", "youtube"],
      joined: "Feb 3, 2025",
      featureStatus: "standard",
      campaignCount: 8,
    },
    {
      id: "3",
      name: "Marcus Brown",
      handle: "@marcusfitness",
      email: "marcus.b@example.com",
      avatar: "",
      followers: 212000,
      engagement: "3.8%",
      categories: ["Fitness", "Health"],
      status: "active",
      verified: true,
      sales: 1204,
      platforms: ["instagram", "twitter"],
      joined: "Nov 12, 2024",
      featureStatus: "featured",
      campaignCount: 15,
    },
    {
      id: "4",
      name: "Emma Thompson",
      handle: "@emmafoods",
      email: "emma.t@example.com",
      avatar: "",
      followers: 67500,
      engagement: "6.1%",
      categories: ["Food", "Cooking"],
      status: "pending",
      verified: false,
      sales: 0,
      platforms: ["youtube", "instagram"],
      joined: "Mar 25, 2025",
      featureStatus: "standard",
      campaignCount: 0,
    },
    {
      id: "5",
      name: "Daniel Lee",
      handle: "@dantech",
      email: "daniel.l@example.com",
      avatar: "",
      followers: 156000,
      engagement: "2.9%",
      categories: ["Tech", "Gaming"],
      status: "active",
      verified: true,
      sales: 962,
      platforms: ["youtube", "twitter"],
      joined: "Dec 7, 2024",
      featureStatus: "standard",
      campaignCount: 6,
    },
    {
      id: "6",
      name: "Sophia Garcia",
      handle: "@sophiatravel",
      email: "sophia.g@example.com",
      avatar: "",
      followers: 189300,
      engagement: "4.3%",
      categories: ["Travel", "Lifestyle"],
      status: "inactive",
      verified: true,
      sales: 524,
      platforms: ["instagram", "tiktok"],
      joined: "Oct 18, 2024",
      featureStatus: "standard",
      campaignCount: 9,
    },
    {
      id: "7",
      name: "Ryan Miller",
      handle: "@ryanoutdoors",
      email: "ryan.m@example.com",
      avatar: "",
      followers: 73200,
      engagement: "5.8%",
      categories: ["Outdoors", "Adventure"],
      status: "active",
      verified: true,
      sales: 416,
      platforms: ["instagram", "youtube"],
      joined: "Feb 22, 2025",
      featureStatus: "standard",
      campaignCount: 4,
    },
    {
      id: "8",
      name: "Olivia Chen",
      handle: "@oliviastyle",
      email: "olivia.c@example.com",
      avatar: "",
      followers: 112600,
      engagement: "3.9%",
      categories: ["Fashion", "Beauty"],
      status: "pending",
      verified: false,
      sales: 0,
      platforms: ["instagram", "tiktok"],
      joined: "Apr 3, 2025",
      featureStatus: "standard",
      campaignCount: 0,
    },
  ]);

  // Statistics for influencers overview
  const stats = {
    totalInfluencers: influencers.length,
    activeInfluencers: influencers.filter((i) => i.status === "active").length,
    featuredInfluencers: influencers.filter(
      (i) => i.featureStatus === "featured"
    ).length,
    pendingInfluencers: influencers.filter((i) => i.status === "pending")
      .length,
    totalSales: influencers.reduce(
      (acc, influencer) => acc + influencer.sales,
      0
    ),
  };

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
    }
  }, [user, userRole, isLoading, router]);

  // Filter influencers based on search query and active tab
  const filteredInfluencers = influencers.filter((influencer) => {
    const matchesSearch =
      influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.categories.some((cat) =>
        cat.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active")
      return matchesSearch && influencer.status === "active";
    if (activeTab === "featured")
      return matchesSearch && influencer.featureStatus === "featured";
    if (activeTab === "pending")
      return matchesSearch && influencer.status === "pending";
    if (activeTab === "inactive")
      return matchesSearch && influencer.status === "inactive";
    return matchesSearch;
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedInfluencers([]);
  };

  const handleInfluencerSelection = (
    influencerId: string,
    isChecked: boolean
  ) => {
    if (isChecked) {
      setSelectedInfluencers([...selectedInfluencers, influencerId]);
    } else {
      setSelectedInfluencers(
        selectedInfluencers.filter((id) => id !== influencerId)
      );
    }
  };

  const handleSelectAllInfluencers = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedInfluencers(
        filteredInfluencers.map((influencer) => influencer.id)
      );
    } else {
      setSelectedInfluencers([]);
    }
  };

  const formatFollowers = (followers: number) => {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`;
    } else if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`;
    } else {
      return followers.toString();
    }
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "inactive":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getFeatureStatusBadgeClass = (status: string) => {
    switch (status) {
      case "featured":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case "youtube":
        return <Youtube className="h-4 w-4 text-red-500" />;
      case "twitter":
        return <Twitter className="h-4 w-4 text-blue-400" />;
      case "tiktok":
        return <span className="text-xs font-bold">TT</span>;
      default:
        return <Globe className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Influencer Management</h1>
          <p className="text-gray-500 dark:text-gray-400">
            View and manage all influencers on the platform
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          {selectedInfluencers.length > 0 ? (
            <>
              <Button variant="outline">
                <Star className="mr-2 h-4 w-4" />
                Set as Featured
              </Button>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Message Selected
              </Button>
            </>
          ) : (
            <>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Influencer
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Influencers stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Influencers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-indigo-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.totalInfluencers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Active Influencers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Star className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.activeInfluencers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Featured Influencers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ThumbsUp className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">
                  {stats.featuredInfluencers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-amber-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.pendingInfluencers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Sales Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.totalSales}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={handleTabChange}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TabsList>
                <TabsTrigger value="all">All Influencers</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search influencers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-[300px]"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem>Sort by followers</DropdownMenuItem>
                    <DropdownMenuItem>Sort by engagement</DropdownMenuItem>
                    <DropdownMenuItem>Sort by sales</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Filter by category</DropdownMenuItem>
                    <DropdownMenuItem>Filter by platform</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={
                        selectedInfluencers.length ===
                          filteredInfluencers.length &&
                        filteredInfluencers.length > 0
                      }
                      onChange={(e) =>
                        handleSelectAllInfluencers(e.target.checked)
                      }
                    />
                  </TableHead>
                  <TableHead>Influencer</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Platforms</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Campaigns</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInfluencers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No influencers found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInfluencers.map((influencer) => (
                    <TableRow key={influencer.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={selectedInfluencers.includes(influencer.id)}
                          onChange={(e) =>
                            handleInfluencerSelection(
                              influencer.id,
                              e.target.checked
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={influencer.avatar} />
                            <AvatarFallback>
                              {influencer.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium flex items-center gap-1">
                              {influencer.name}
                              {influencer.verified && (
                                <span
                                  className="text-blue-500"
                                  title="Verified"
                                >
                                  <svg
                                    className="h-4 w-4 fill-current"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                  </svg>
                                </span>
                              )}
                              {influencer.featureStatus === "featured" && (
                                <span
                                  className="ml-1 text-yellow-500"
                                  title="Featured"
                                >
                                  <Star className="h-3 w-3 fill-current" />
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {influencer.handle}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatFollowers(influencer.followers)}
                      </TableCell>
                      <TableCell>{influencer.engagement}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {influencer.categories.map((category, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {influencer.platforms.map((platform, idx) => (
                            <div
                              key={idx}
                              className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center"
                            >
                              {getPlatformIcon(platform)}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusBadgeClass(influencer.status)}
                        >
                          {influencer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-4 w-4 text-indigo-500" />
                          <span>{influencer.sales}</span>
                        </div>
                      </TableCell>
                      <TableCell>{influencer.campaignCount}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {influencer.featureStatus === "featured" ? (
                              <DropdownMenuItem>
                                Remove featured status
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <Star className="mr-2 h-4 w-4" />
                                Set as featured
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {influencer.status === "pending" && (
                              <DropdownMenuItem className="text-green-600">
                                Approve application
                              </DropdownMenuItem>
                            )}
                            {influencer.status === "active" ? (
                              <DropdownMenuItem className="text-amber-600">
                                Deactivate account
                              </DropdownMenuItem>
                            ) : (
                              influencer.status === "inactive" && (
                                <DropdownMenuItem className="text-green-600">
                                  Activate account
                                </DropdownMenuItem>
                              )
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{filteredInfluencers.length}</strong> out of{" "}
              <strong>{influencers.length}</strong> influencers
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
