"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowLeft,
  Search,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import MainLayout from "@/components/main-layout";
import PageHeader from "@/components/page-header";

// Mock data for wishlist items
const mockWishlistItems = [
  {
    id: "1",
    name: "Premium Leather Crossbody Bag",
    price: 699.99,
    image: "/crossbag.webp",
    category: "Accessories",
    inStock: true,
    discount: 0,
  },
  {
    id: "2",
    name: "Wireless Noise Cancelling Headphones",
    price: 549.99,
    image: "/headphone.webp",
    category: "Electronics",
    inStock: true,
    discount: 10,
  },
  {
    id: "3",
    name: "Ultra HD Smart TV 55-inch",
    price: 1899.99,
    image: "/LG-TV.jpeg",
    category: "Electronics",
    inStock: false,
    discount: 0,
  },
  {
    id: "4",
    name: "MacBook Pro 14-inch",
    price: 1999.99,
    image: "/macbook.jpeg",
    category: "Electronics",
    inStock: true,
    discount: 15,
  },
];

export default function WishlistPage() {
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/signin");
      return;
    }

    // Load wishlist items here
    setLoading(false);
  }

  const handleRemoveItem = (itemId: string) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== itemId));
  };

  const handleClearAll = () => {
    setWishlistItems([]);
  };

  const handleAddToCart = (itemId: string) => {
    // Add to cart logic
    console.log("Adding to cart:", itemId);
  };

  // Filter and sort items
  const filteredItems = wishlistItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      item.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOrder === "price-low") return a.price - b.price;
    if (sortOrder === "price-high") return b.price - a.price;
    if (sortOrder === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

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
              My Wishlist
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        {/* Search and filters */}
        {wishlistItems.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search wishlist"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 border-indigo-200 dark:border-violet-800/40 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48 border-indigo-200 dark:border-violet-800/40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full sm:w-48 border-indigo-200 dark:border-violet-800/40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear wishlist?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all items from your wishlist. This action
                    cannot be undone.
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
        )}

        {/* Wishlist items */}
        <div className="mt-6">
          {sortedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group border border-indigo-100 dark:border-violet-800/30 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow relative"
                >
                  {/* Product image */}
                  <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Link href={`/product/${item.id}`}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>

                    {/* Remove button */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all">
                          <X className="h-4 w-4 text-red-500" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove from wishlist?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove "{item.name}" from your wishlist.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveItem(item.id)}
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {/* Discount badge */}
                    {item.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-md">
                        {item.discount}% OFF
                      </div>
                    )}

                    {/* Stock status */}
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
                        <Badge variant="destructive" className="text-sm">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Product details */}
                  <div className="p-4">
                    <Link
                      href={`/product/${item.id}`}
                      className="hover:underline"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {item.category}
                    </p>

                    <div className="mt-3 flex items-baseline gap-2">
                      {item.discount > 0 ? (
                        <>
                          <span className="text-xl font-semibold text-indigo-600 dark:text-violet-400">
                            ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${item.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-semibold text-indigo-600 dark:text-violet-400">
                          ${item.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <Button
                      onClick={() => handleAddToCart(item.id)}
                      disabled={!item.inStock}
                      className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-violet-600 dark:hover:bg-violet-700 text-white"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      {item.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-indigo-200 dark:border-violet-800/30 rounded-xl bg-indigo-50/50 dark:bg-violet-900/10">
              <Heart className="h-16 w-16 mx-auto text-indigo-400 dark:text-violet-500 mb-4 opacity-80" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {searchTerm || categoryFilter !== "all"
                  ? "No items match your filters. Try adjusting your search."
                  : "Start adding items to your wishlist to save them for later!"}
              </p>
              <Link href="/products">
                <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-violet-600 dark:hover:bg-violet-700 text-white">
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
        title="My Wishlist"
        description="Save your favorite items for later"
        backgroundImage="/fashion-slide2.png"
      />
      <MainLayout hideShopCategory={true}>{mainContent}</MainLayout>
    </>
  );
}

