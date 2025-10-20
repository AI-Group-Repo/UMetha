"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Search,
  ArrowLeft,
  Calendar,
  Eye,
  ShoppingBag,
  Heart,
  Trash2,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import MainLayout from "@/components/main-layout";
import PageHeader from "@/components/page-header";

// Type definitions
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  viewedAt: Date;
  inStock: boolean;
  discountPercent?: number;
  rating: number;
}

// Mock data for recently viewed products
const mockProducts: Product[] = [
  {
    id: "PROD-101",
    name: "Premium Leather Crossbody Bag",
    price: 699.99,
    image: "/crossbag.webp",
    category: "Accessories",
    viewedAt: new Date(2025, 3, 10, 14, 30), // April 10, 2025, 14:30
    inStock: true,
    rating: 4.8,
  },
  {
    id: "PROD-102",
    name: "Wireless Noise Cancelling Headphones",
    price: 549.99,
    image: "/headphone.webp",
    category: "Electronics",
    viewedAt: new Date(2025, 3, 10, 12, 15), // April 10, 2025, 12:15
    inStock: true,
    rating: 4.9,
  },
  {
    id: "PROD-103",
    name: "Ultra HD Smart TV 55-inch",
    price: 1899.99,
    image: "/LG-TV.jpeg",
    category: "Electronics",
    viewedAt: new Date(2025, 3, 9, 18, 45), // April 9, 2025, 18:45
    inStock: true,
    rating: 4.7,
  },
  {
    id: "PROD-104",
    name: "Galaxy S25 Ultra Smartphone",
    price: 1499.99,
    image: "/GalaxyS25Ultra.jpeg",
    category: "Electronics",
    viewedAt: new Date(2025, 3, 8, 10, 20), // April 8, 2025, 10:20
    inStock: false,
    rating: 4.9,
  },
  {
    id: "PROD-105",
    name: "MacBook Pro 14-inch",
    price: 1999.99,
    image: "/macbook.jpeg",
    category: "Electronics",
    viewedAt: new Date(2025, 3, 7, 15, 10), // April 7, 2025, 15:10
    inStock: true,
    discountPercent: 10,
    rating: 4.8,
  },
  {
    id: "PROD-106",
    name: "Designer Silk Scarf",
    price: 499.95,
    image: "/scarf.jpg",
    category: "Fashion",
    viewedAt: new Date(2025, 3, 6, 9, 30), // April 6, 2025, 9:30
    inStock: true,
    rating: 4.6,
  },
  {
    id: "PROD-107",
    name: "Luxury Watch",
    price: 2499.99,
    image: "/audio.jpeg",
    category: "Accessories",
    viewedAt: new Date(2025, 3, 5, 11, 15), // April 5, 2025, 11:15
    inStock: true,
    rating: 4.9,
  },
  {
    id: "PROD-108",
    name: "Ergonomic Office Chair",
    price: 899.99,
    image: "/chair.jpg",
    category: "Furniture",
    viewedAt: new Date(2025, 3, 4, 16, 45), // April 4, 2025, 16:45
    inStock: true,
    discountPercent: 15,
    rating: 4.7,
  },
];

// Time formatter function
function formatViewTime(date: Date): string {
  const now = new Date(2025, 3, 11); // April 11, 2025 (current date from context)
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}

export default function RecentlyViewedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // Simulate fetching products
  useEffect(() => {
    const fetchProducts = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setProducts(mockProducts);
        setIsLoading(false);
      }, 1000);
    };

    fetchProducts();
  }, []);

  // Handle product removal
  const handleRemoveProduct = (productId: string) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  // Handle wishlist addition
  const handleAddToWishlist = (productId: string) => {
    // In a real app, this would add to wishlist
    console.log(`Added product ${productId} to wishlist`);
  };

  // Handle clearing all history
  const handleClearAll = () => {
    setProducts([]);
  };

  // Filter products based on search, category, and time
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      product.category.toLowerCase() === categoryFilter.toLowerCase();

    let matchesTime = true;
    const now = new Date(2025, 3, 11); // April 11, 2025

    if (timeFilter === "today") {
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      matchesTime = product.viewedAt >= today;
    } else if (timeFilter === "week") {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesTime = product.viewedAt >= weekAgo;
    } else if (timeFilter === "month") {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesTime = product.viewedAt >= monthAgo;
    }

    return matchesSearch && matchesCategory && matchesTime;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "newest") {
      return b.viewedAt.getTime() - a.viewedAt.getTime();
    } else if (sortOrder === "oldest") {
      return a.viewedAt.getTime() - b.viewedAt.getTime();
    } else if (sortOrder === "price-high") {
      return b.price - a.price;
    } else if (sortOrder === "price-low") {
      return a.price - b.price;
    }
    return 0;
  });

  const mainContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex flex-col gap-6">
        {/* Page header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="text-indigo-600 dark:text-violet-400 hover:text-indigo-700 dark:hover:text-violet-300"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Recently Viewed
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Browse your product viewing history
          </p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 border-indigo-200 dark:border-violet-800/40 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 border-indigo-200 dark:border-violet-800/40 bg-white dark:bg-black/20 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500">
                <SelectValue placeholder="Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
              </SelectContent>
            </Select>

            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-full sm:w-48 border-indigo-200 dark:border-violet-800/40 bg-white dark:bg-black/20 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-between sm:justify-end">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full sm:w-44 border-indigo-200 dark:border-violet-800/40 bg-white dark:bg-black/20 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/20"
                  disabled={products.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear browsing history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all products from your recently viewed
                    history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAll}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Yes, Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Products list */}
        <div className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="border border-indigo-100 dark:border-violet-800/30 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm"
                  >
                    <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                      <Skeleton className="h-full w-full" />
                    </div>
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-2/5" />
                      <Skeleton className="h-6 w-1/3" />
                      <div className="flex justify-between mt-2">
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group border border-indigo-100 dark:border-violet-800/30 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow relative flex flex-col"
                >
                  {/* Product image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Link href={`/product/${product.id}`}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>

                    {/* Time viewed badge */}
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-gray-300" />
                      {formatViewTime(product.viewedAt)}
                    </div>

                    {/* Out of stock badge */}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
                        <Badge
                          variant="destructive"
                          className="text-sm font-medium"
                        >
                          Out of Stock
                        </Badge>
                      </div>
                    )}

                    {/* Discount badge */}
                    {product.discountPercent && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-md">
                        {product.discountPercent}% OFF
                      </div>
                    )}

                    {/* Quick actions */}
                    <div className="absolute -bottom-10 group-hover:bottom-3 inset-x-0 flex justify-center space-x-2 transition-all duration-300">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full h-9 w-9 p-0 bg-white/90 hover:bg-white text-indigo-600"
                        onClick={() => handleAddToWishlist(product.id)}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Link href={`/product/${product.id}`}>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="rounded-full h-9 w-9 p-0 bg-white/90 hover:bg-white text-indigo-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="rounded-full h-9 w-9 p-0 bg-white/90 hover:bg-white text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Remove from history?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove "{product.name}" from your
                              recently viewed products.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveProduct(product.id)}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {/* Product details */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                      <Link
                        href={`/product/${product.id}`}
                        className="hover:underline"
                      >
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {product.category}
                      </p>

                      <div className="mt-2 flex items-baseline">
                        {product.discountPercent ? (
                          <>
                            <span className="text-lg font-semibold text-indigo-600 dark:text-violet-400">
                              $
                              {(
                                product.price *
                                (1 - product.discountPercent / 100)
                              ).toFixed(2)}
                            </span>
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ${product.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-semibold text-indigo-600 dark:text-violet-400">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-indigo-200 dark:border-violet-800/50 bg-white dark:bg-black/20 hover:bg-indigo-50 dark:hover:bg-violet-900/30 text-indigo-600 dark:text-violet-400"
                        disabled={!product.inStock}
                      >
                        <Heart className="h-4 w-4 mr-1.5" />
                        Wishlist
                      </Button>

                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 dark:bg-violet-600 dark:hover:bg-violet-700 text-white"
                        disabled={!product.inStock}
                      >
                        <ShoppingBag className="h-4 w-4 mr-1.5" />
                        Buy
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-indigo-200 dark:border-violet-800/30 rounded-xl bg-indigo-50/50 dark:bg-violet-900/10">
              <Eye className="h-12 w-12 mx-auto text-indigo-400 dark:text-violet-500 mb-3 opacity-80" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                No viewed products
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || categoryFilter !== "all" || timeFilter !== "all"
                  ? "Try adjusting your filters or search term"
                  : "You haven't viewed any products yet"}
              </p>
              <Link href="/">
                <Button
                  variant="default"
                  className="bg-indigo-600 hover:bg-indigo-700 dark:bg-violet-600 dark:hover:bg-violet-700 text-white"
                >
                  Start Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <PageHeader
        title="Recently Viewed Products"
        description="Revisit products you've browsed and continue shopping"
        backgroundImage="/LG-TV.jpeg"
      />
      <MainLayout hideShopCategory={true}>{mainContent}</MainLayout>
    </>
  );
}
