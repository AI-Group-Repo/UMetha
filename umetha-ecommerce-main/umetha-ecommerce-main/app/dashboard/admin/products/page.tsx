"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  Plus,
  FileDown,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  Package,
  Eye,
  Edit,
  Copy,
  Tag,
  Star,
  Layers,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  ImagePlus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// Mock product data - in a real app this would come from an API
const mockProducts = [
  {
    id: "p1",
    name: "Premium Wireless Headphones",
    image: "/headphones1.jpg", // Using an image that exists in the public folder
    category: "Electronics",
    price: 149.99,
    discountPrice: 129.99,
    inventory: 85,
    status: "Active",
    featured: true,
    rating: 4.8,
    createdAt: "2025-03-10",
  },
  {
    id: "p2",
    name: "Designer Handbag",
    image: "/handbag1.jpg", // Using an image that exists in the public folder
    category: "Fashion",
    price: 399.99,
    discountPrice: null,
    inventory: 12,
    status: "Active",
    featured: true,
    rating: 4.9,
    createdAt: "2025-04-05",
  },
  {
    id: "p3",
    name: "Smart TV 55-inch",
    image: "/LG-TV.jpeg", // Using an image that exists in the public folder
    category: "Electronics",
    price: 699.99,
    discountPrice: 649.99,
    inventory: 23,
    status: "Active",
    featured: false,
    rating: 4.7,
    createdAt: "2025-03-25",
  },
  {
    id: "p4",
    name: "Office Chair",
    image: "/chair.jpeg", // Using an image that exists in the public folder
    category: "Home",
    price: 199.99,
    discountPrice: null,
    inventory: 45,
    status: "Active",
    featured: false,
    rating: 4.5,
    createdAt: "2025-04-01",
  },
  {
    id: "p5",
    name: "Smartphone Earbuds",
    image: "/earpods.jpeg", // Using an image that exists in the public folder
    category: "Electronics",
    price: 79.99,
    discountPrice: 59.99,
    inventory: 120,
    status: "Active",
    featured: true,
    rating: 4.6,
    createdAt: "2025-03-15",
  },
  {
    id: "p6",
    name: "Digital Camera",
    image: "/camera.jpeg", // Using an image that exists in the public folder
    category: "Electronics",
    price: 449.99,
    discountPrice: null,
    inventory: 0,
    status: "Out of Stock",
    featured: false,
    rating: 4.7,
    createdAt: "2025-02-28",
  },
  {
    id: "p7",
    name: "Designer Backpack",
    image: "/backpack.jpeg", // Using an image that exists in the public folder
    category: "Fashion",
    price: 129.99,
    discountPrice: null,
    inventory: 38,
    status: "Active",
    featured: false,
    rating: 4.4,
    createdAt: "2025-03-20",
  },
  {
    id: "p8",
    name: "Gucci Men's Wallet",
    image: "/Gucci.jpg", // Using an image that exists in the public folder
    category: "Fashion",
    price: 299.99,
    discountPrice: null,
    inventory: 15,
    status: "Draft",
    featured: false,
    rating: 0,
    createdAt: "2025-04-15",
  },
];

// Mock categories
const mockCategories = [
  "Electronics",
  "Fashion",
  "Home",
  "Beauty",
  "Sports",
  "Toys",
  "Books",
  "Jewelry",
];

export default function ProductsManagement() {
  const { user, userRole, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("all-products");
  const [editProduct, setEditProduct] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // For demo pagination
  const PRODUCTS_PER_PAGE = 5;

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

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter and sort products
  const filteredProducts = mockProducts
    .filter((product) => {
      // Filter by active tab
      if (activeTab === "featured" && !product.featured) return false;
      if (activeTab === "out-of-stock" && product.inventory > 0) return false;
      if (activeTab === "drafts" && product.status !== "Draft") return false;

      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === null || product.category === categoryFilter;
      const matchesStatus =
        statusFilter === null || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      const fieldA = a[sortField as keyof typeof a];
      const fieldB = b[sortField as keyof typeof b];

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }

      if (typeof fieldA === "number" && typeof fieldB === "number") {
        return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }

      return 0;
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  // Handle checkbox changes
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map((product) => product.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
      setSelectAll(false);
    } else {
      setSelectedProducts([...selectedProducts, productId]);
      if (selectedProducts.length + 1 === paginatedProducts.length) {
        setSelectAll(true);
      }
    }
  };

  // Product actions
  const handleEdit = (product: any) => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    // In a real app, this would save the changes to the database
    console.log("Saving product:", editProduct);
    setShowEditModal(false);
    setEditProduct(null);
  };

  const handleBulkDelete = () => {
    // In a real app, this would delete the products from the database
    console.log("Deleting products:", selectedProducts);
    setShowDeleteConfirm(false);
    setSelectedProducts([]);
    setSelectAll(false);
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
            Product Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View, search, and manage all products in your catalog
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600 border-none">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Product Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all-products">
            <Package className="h-4 w-4 mr-2" />
            All Products
          </TabsTrigger>
          <TabsTrigger value="featured">
            <Star className="h-4 w-4 mr-2" />
            Featured
          </TabsTrigger>
          <TabsTrigger value="out-of-stock">
            <XCircle className="h-4 w-4 mr-2" />
            Out of Stock
          </TabsTrigger>
          <TabsTrigger value="drafts">
            <Layers className="h-4 w-4 mr-2" />
            Drafts
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters and Search */}
      <Card className="mb-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="md:col-span-2">
              <Select
                value={categoryFilter || ""}
                onValueChange={(value) => setCategoryFilter(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  {mockCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Select
                value={statusFilter || ""}
                onValueChange={(value) => setStatusFilter(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3 flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter(null);
                  setStatusFilter(null);
                  setSortField("createdAt");
                  setSortDirection("desc");
                  setCurrentPage(1);
                }}
                className="flex-1"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                disabled={selectedProducts.length === 0}
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({selectedProducts.length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[40px]">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center">
                      <span>Category</span>
                      {sortField === "category" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center">
                      <span>Price</span>
                      {sortField === "price" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("inventory")}
                  >
                    <div className="flex items-center">
                      <span>Inventory</span>
                      {sortField === "inventory" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("rating")}
                  >
                    <div className="flex items-center">
                      <span>Rating</span>
                      {sortField === "rating" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ID: {product.id}
                            </p>
                          </div>
                          {product.featured && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                            >
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                        >
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.discountPrice && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs line-through text-muted-foreground">
                                ${product.price.toFixed(2)}
                              </span>
                              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                -
                                {(
                                  ((product.price - product.discountPrice) /
                                    product.price) *
                                  100
                                ).toFixed(0)}
                                %
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.inventory > 0 ? (
                          <span>{product.inventory} units</span>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          >
                            Out of stock
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`
                            ${
                              product.status === "Active"
                                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                : product.status === "Draft"
                                ? "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            }
                          `}
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {product.rating > 0 ? (
                            <>
                              <Star className="h-4 w-4 text-amber-500 fill-current mr-1" />
                              <span>{product.rating.toFixed(1)}</span>
                            </>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              No ratings
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleEdit(product)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Product
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <ImagePlus className="mr-2 h-4 w-4" />
                                Update Images
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Tag className="mr-2 h-4 w-4" />
                                Manage Variants
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-2" />
                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          No products found
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Try adjusting your search or filter to find what
                          you're looking for.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(
                startIndex + PRODUCTS_PER_PAGE,
                filteredProducts.length
              )}
            </span>{" "}
            of <span className="font-medium">{filteredProducts.length}</span>{" "}
            products
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant="outline"
                size="sm"
                className={
                  currentPage === page
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                    : ""
                }
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information in the catalog.
            </DialogDescription>
          </DialogHeader>
          {editProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-medium block mb-1"
                  >
                    Product Name
                  </label>
                  <Input
                    id="name"
                    value={editProduct.name}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="text-sm font-medium block mb-1"
                  >
                    Category
                  </label>
                  <Select
                    value={editProduct.category}
                    onValueChange={(value) =>
                      setEditProduct({ ...editProduct, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="text-sm font-medium block mb-1"
                  >
                    Price ($)
                  </label>
                  <Input
                    id="price"
                    type="number"
                    value={editProduct.price}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        price: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="discountPrice"
                    className="text-sm font-medium block mb-1"
                  >
                    Discount Price ($)
                  </label>
                  <Input
                    id="discountPrice"
                    type="number"
                    value={editProduct.discountPrice || ""}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        discountPrice: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                    placeholder="Leave blank for no discount"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="inventory"
                    className="text-sm font-medium block mb-1"
                  >
                    Inventory
                  </label>
                  <Input
                    id="inventory"
                    type="number"
                    value={editProduct.inventory}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        inventory: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="text-sm font-medium block mb-1"
                  >
                    Status
                  </label>
                  <Select
                    value={editProduct.status}
                    onValueChange={(value) =>
                      setEditProduct({ ...editProduct, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="featured" className="text-sm font-medium">
                    Featured Product
                  </label>
                  <input
                    id="featured"
                    type="checkbox"
                    checked={editProduct.featured}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        featured: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="text-sm font-medium block mb-1"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Product description..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Product Images</h3>
                    <Button variant="outline" size="sm">
                      <ImagePlus className="h-4 w-4 mr-2" />
                      Add Image
                    </Button>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={editProduct.image}
                        alt="Product"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Trash2 className="h-5 w-5 text-white cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedProducts.length} product
              {selectedProducts.length !== 1 ? "s" : ""}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
