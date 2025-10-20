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
  Download,
  Calendar,
  Store,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  ThumbsUp,
  AlertCircle,
  Mail,
  Eye,
  UserPlus,
  BarChart3,
  CheckCircle2,
  XCircle,
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
import { format } from "date-fns";

export default function SellersPage() {
  const { user, userRole, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);

  // Mock data for sellers
  const [sellers, setSellers] = useState([
    {
      id: "1",
      name: "AudioTech Inc.",
      contactName: "Michael Rodriguez",
      email: "info@audiotech.com",
      logo: "/audio.jpeg",
      joined: "2024-12-05T00:00:00Z",
      status: "active",
      verified: true,
      productCount: 48,
      sales: 1243,
      revenue: 56789.95,
      rating: 4.8,
      categories: ["Electronics", "Audio"],
      featured: true,
      location: "San Francisco, USA",
    },
    {
      id: "2",
      name: "LuxeStyle",
      contactName: "Jennifer Lopez",
      email: "contact@luxestyle.com",
      logo: "",
      joined: "2025-01-15T00:00:00Z",
      status: "active",
      verified: true,
      productCount: 156,
      sales: 2435,
      revenue: 127684.5,
      rating: 4.6,
      categories: ["Fashion", "Accessories"],
      featured: false,
      location: "New York, USA",
    },
    {
      id: "3",
      name: "TechGear",
      contactName: "David Chen",
      email: "support@techgear.com",
      logo: "",
      joined: "2024-11-20T00:00:00Z",
      status: "active",
      verified: true,
      productCount: 87,
      sales: 1876,
      revenue: 109542.75,
      rating: 4.7,
      categories: ["Electronics", "Gadgets"],
      featured: true,
      location: "Austin, USA",
    },
    {
      id: "4",
      name: "ErgoDesign",
      contactName: "Sarah Williams",
      email: "sales@ergodesign.com",
      logo: "",
      joined: "2025-02-08T00:00:00Z",
      status: "active",
      verified: true,
      productCount: 42,
      sales: 729,
      revenue: 68450.25,
      rating: 4.9,
      categories: ["Furniture", "Office"],
      featured: false,
      location: "Chicago, USA",
    },
    {
      id: "5",
      name: "GamerZone",
      contactName: "Alex Thompson",
      email: "info@gamerzone.com",
      logo: "",
      joined: "2025-01-03T00:00:00Z",
      status: "active",
      verified: true,
      productCount: 64,
      sales: 1105,
      revenue: 87329.5,
      rating: 4.5,
      categories: ["Gaming", "Electronics"],
      featured: false,
      location: "Los Angeles, USA",
    },
    {
      id: "6",
      name: "FragranceHub",
      contactName: "Emily Baker",
      email: "contact@fragrancehub.com",
      logo: "",
      joined: "2024-12-18T00:00:00Z",
      status: "inactive",
      verified: false,
      productCount: 29,
      sales: 387,
      revenue: 32456.75,
      rating: 4.3,
      categories: ["Beauty", "Fragrance"],
      featured: false,
      location: "Miami, USA",
    },
    {
      id: "7",
      name: "HomeEssentials",
      contactName: "Robert Johnson",
      email: "service@homeessentials.com",
      logo: "",
      joined: "2025-03-01T00:00:00Z",
      status: "active",
      verified: true,
      productCount: 112,
      sales: 1543,
      revenue: 95678.0,
      rating: 4.7,
      categories: ["Homeware", "Kitchen"],
      featured: true,
      location: "Seattle, USA",
    },
    {
      id: "8",
      name: "PhotoPro",
      contactName: "Jessica Lee",
      email: "support@photopro.com",
      logo: "",
      joined: "2025-02-20T00:00:00Z",
      status: "pending",
      verified: false,
      productCount: 37,
      sales: 0,
      revenue: 0,
      rating: 0,
      categories: ["Photography", "Electronics"],
      featured: false,
      location: "Denver, USA",
    },
  ]);

  // Statistics for sellers overview
  const stats = {
    totalSellers: sellers.length,
    activeSellers: sellers.filter((s) => s.status === "active").length,
    featuredSellers: sellers.filter((s) => s.featured).length,
    pendingSellers: sellers.filter((s) => s.status === "pending").length,
    totalRevenue: sellers.reduce((acc, seller) => acc + seller.revenue, 0),
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

  // Filter sellers based on search query and active tab
  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.categories.some((cat) =>
        cat.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active")
      return matchesSearch && seller.status === "active";
    if (activeTab === "featured") return matchesSearch && seller.featured;
    if (activeTab === "pending")
      return matchesSearch && seller.status === "pending";
    if (activeTab === "inactive")
      return matchesSearch && seller.status === "inactive";
    return matchesSearch;
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedSellers([]);
  };

  const handleSellerSelection = (sellerId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedSellers([...selectedSellers, sellerId]);
    } else {
      setSelectedSellers(selectedSellers.filter((id) => id !== sellerId));
    }
  };

  const handleSelectAllSellers = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedSellers(filteredSellers.map((seller) => seller.id));
    } else {
      setSelectedSellers([]);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Seller Management</h1>
          <p className="text-gray-500 dark:text-gray-400">
            View and manage all sellers on the platform
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          {selectedSellers.length > 0 ? (
            <>
              <Button variant="outline">
                <ThumbsUp className="mr-2 h-4 w-4" />
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
                Add New Seller
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Sellers stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Sellers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Store className="h-8 w-8 text-indigo-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.totalSellers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Active Sellers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.activeSellers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Featured Sellers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ThumbsUp className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.featuredSellers}</p>
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
              <AlertCircle className="h-8 w-8 text-amber-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.pendingSellers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalRevenue)}
                </p>
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
                <TabsTrigger value="all">All Sellers</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sellers..."
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
                    <DropdownMenuItem>Sort by revenue</DropdownMenuItem>
                    <DropdownMenuItem>Sort by sales</DropdownMenuItem>
                    <DropdownMenuItem>Sort by rating</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Filter by category</DropdownMenuItem>
                    <DropdownMenuItem>Filter by location</DropdownMenuItem>
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
                        selectedSellers.length === filteredSellers.length &&
                        filteredSellers.length > 0
                      }
                      onChange={(e) => handleSelectAllSellers(e.target.checked)}
                    />
                  </TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSellers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No sellers found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSellers.map((seller) => (
                    <TableRow key={seller.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={selectedSellers.includes(seller.id)}
                          onChange={(e) =>
                            handleSellerSelection(seller.id, e.target.checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={seller.logo} />
                            <AvatarFallback>
                              <Store className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium flex items-center gap-1">
                              {seller.name}
                              {seller.verified && (
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
                              {seller.featured && (
                                <span
                                  className="ml-1 text-yellow-500"
                                  title="Featured"
                                >
                                  <ThumbsUp className="h-3 w-3 fill-current" />
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {seller.location}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {seller.contactName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {seller.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusBadgeClass(seller.status)}
                        >
                          {seller.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <ShoppingBag className="h-4 w-4 text-indigo-500" />
                          <span>{seller.productCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-4 w-4 text-indigo-500" />
                          <span>{seller.sales}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(seller.revenue)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="text-yellow-500 mr-1">★</div>
                          <span>
                            {seller.rating > 0
                              ? seller.rating.toFixed(1)
                              : "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(seller.joined), "MMM d, yyyy")}
                      </TableCell>
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
                              Contact seller
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ShoppingBag className="mr-2 h-4 w-4" />
                              View products
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {seller.featured ? (
                              <DropdownMenuItem>
                                Remove featured status
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <ThumbsUp className="mr-2 h-4 w-4" />
                                Set as featured
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {seller.status === "pending" && (
                              <DropdownMenuItem className="text-green-600">
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Approve seller
                              </DropdownMenuItem>
                            )}
                            {seller.status === "active" ? (
                              <DropdownMenuItem className="text-amber-600">
                                <XCircle className="mr-2 h-4 w-4" />
                                Deactivate seller
                              </DropdownMenuItem>
                            ) : (
                              seller.status === "inactive" && (
                                <DropdownMenuItem className="text-green-600">
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Activate seller
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
              Showing <strong>{filteredSellers.length}</strong> out of{" "}
              <strong>{sellers.length}</strong> sellers
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
