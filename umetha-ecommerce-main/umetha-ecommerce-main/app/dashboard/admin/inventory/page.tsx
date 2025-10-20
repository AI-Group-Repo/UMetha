"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Loader2,
  RefreshCcw,
  Settings,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashboardLayout from "@/app/dashboard/layout";

// Mock inventory data
const mockInventory = [
  {
    id: "PRD001",
    name: "Wireless Headphones",
    sku: "WH-2025-001",
    category: "Electronics",
    inStock: 45,
    reorderPoint: 20,
    supplier: "TechGear Inc",
    lastRestocked: "2025-04-01",
    status: "In Stock",
    price: 199.99,
    location: "Warehouse A",
  },
  {
    id: "PRD002",
    name: "Designer Handbag",
    sku: "DB-2025-002",
    category: "Fashion",
    inStock: 12,
    reorderPoint: 15,
    supplier: "LuxBrands Co",
    lastRestocked: "2025-03-28",
    status: "Low Stock",
    price: 299.99,
    location: "Warehouse B",
  },
  {
    id: "PRD003",
    name: "Smart Watch",
    sku: "SW-2025-003",
    category: "Electronics",
    inStock: 0,
    reorderPoint: 10,
    supplier: "TechGear Inc",
    lastRestocked: "2025-03-15",
    status: "Out of Stock",
    price: 149.99,
    location: "Warehouse A",
  },
  {
    id: "PRD004",
    name: "Running Shoes",
    sku: "RS-2025-004",
    category: "Sports",
    inStock: 78,
    reorderPoint: 25,
    supplier: "SportEquip Ltd",
    lastRestocked: "2025-04-10",
    status: "In Stock",
    price: 89.99,
    location: "Warehouse C",
  },
  {
    id: "PRD005",
    name: "Coffee Maker",
    sku: "CM-2025-005",
    category: "Appliances",
    inStock: 5,
    reorderPoint: 8,
    supplier: "HomeGoods Co",
    lastRestocked: "2025-03-20",
    status: "Low Stock",
    price: 129.99,
    location: "Warehouse B",
  },
];

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "Low Stock":
        return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Out of Stock":
        return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  // Filter inventory
  const filteredInventory = mockInventory.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "" || item.status === statusFilter;
    const matchesLocation =
      locationFilter === "" || item.location === locationFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Inventory Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Track stock levels, manage suppliers, and handle product
              replenishment
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Items
                  </p>
                  <h3 className="text-2xl font-bold mt-1">2,345</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>12% more than last month</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Low Stock</p>
                  <h3 className="text-2xl font-bold mt-1">28</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-yellow-600 dark:text-yellow-400">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>5 items need attention</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Out of Stock
                  </p>
                  <h3 className="text-2xl font-bold mt-1">12</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-red-600 dark:text-red-400">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span>3 items need reordering</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Value
                  </p>
                  <h3 className="text-2xl font-bold mt-1">$487,692</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>8% increase in value</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, SKU, or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="md:col-span-2">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Appliances">Appliances</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="In Stock">In Stock</SelectItem>
                    <SelectItem value="Low Stock">Low Stock</SelectItem>
                    <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Select
                  value={locationFilter}
                  onValueChange={setLocationFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                    <SelectItem value="Warehouse B">Warehouse B</SelectItem>
                    <SelectItem value="Warehouse C">Warehouse C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("");
                    setStatusFilter("");
                    setLocationFilter("");
                  }}
                  className="flex-1"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Inventory Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Last Restocked</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">ID: {item.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>{item.inStock}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusBadge(item.status)}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>{formatDate(item.lastRestocked)}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{formatCurrency(item.price)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Product</DropdownMenuItem>
                          <DropdownMenuItem>Update Stock</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Order History</DropdownMenuItem>
                          <DropdownMenuItem>Restock Request</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Remove Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
