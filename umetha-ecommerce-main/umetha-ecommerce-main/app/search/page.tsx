"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  ChevronDown,
  X,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Heart,
  Loader,
  Star,
  SlidersHorizontal,
  Trash2,
  ArrowUpDown,
  Image as ImageIcon,
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import MainLayout from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { useProductModal } from "@/context/product-modal-context";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define product interface based on your actual API response structure
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  images?: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  rating?: number;
  discount?: number;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
  slug?: string;
}

// Define pagination interface
interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
  limit: number;
}

export default function SearchPage() {
  // Get the search query from URL
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { t } = useTranslation();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { openModal } = useProductModal();

  // State for products and filters
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("newest");
  const [searchSource, setSearchSource] = useState<"prisma" | "supabase">("supabase");
  const [imageSearchMode, setImageSearchMode] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<"fuzzy" | "category" | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
    limit: 12,
  });

  // Categories state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);

  // Function to fetch search results
  const fetchSearchResults = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      // Build the query parameters
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: "12",
        language: 'en',
        source: searchSource,
      });

      // Handle sort parameter correctly
      if (sortBy === "price:asc") {
        params.append("sort", "price");
        params.append("order", "asc");
      } else if (sortBy === "price:desc") {
        params.append("sort", "price");
        params.append("order", "desc");
      } else {
        params.append("sort", "createdAt");
        params.append("order", "desc");
      }

      // Add price range if it has changed from default
      if (priceRange[0] > 0) {
        params.append("minPrice", priceRange[0].toString());
      }
      if (priceRange[1] < 1000) {
        params.append("maxPrice", priceRange[1].toString());
      }

      // Add category if selected
      if (selectedCategory !== "All") {
        params.append("categoryId", selectedCategory);
      }

      // Use regular search for now to avoid errors
      console.log(`Searching with params: ${params.toString()}`);
      const response = await fetch(`/api/search/products?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Search API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Search API response:", data);

      if (data.status === "success") {
        setProducts(data.data.products || []);
        setSearchType(data.data.searchType || "fuzzy");
        setPagination(
          data.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: data.data.totalResults || data.data.products?.length || 0,
            hasNext: false,
            hasPrevious: false,
            limit: 12,
          }
        );
      } else {
        setError(data.message || "Failed to fetch search results");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("An error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories?limit=20");
        const data = await response.json();
        if (data.status === "success") {
          setAvailableCategories(data.data.categories || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch results when search parameters change
  useEffect(() => {
    // Always fetch results, even without a query to show default products
    fetchSearchResults();
  }, [query, selectedCategory, sortBy, searchSource]);

  // Handle price filter changes
  const handlePriceFilterApply = () => {
    fetchSearchResults();
  };

  // Handle image search
  const handleImageSearch = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("imageData", file);
      formData.append("language", 'en');
      formData.append("source", searchSource);

      const response = await fetch("/api/search/image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === "success") {
        setProducts(data.data.products || []);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: data.data.products?.length || 0,
          hasNext: false,
          hasPrevious: false,
          limit: 12,
        });
      } else {
        setError(data.message || "Failed to search with image");
      }
    } catch (err) {
      console.error("Image search error:", err);
      setError("An error occurred while searching with image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle image file selection
  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle add to cart
  const handleAddToCart = async (product: Product) => {
    try {
      await addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || (product.images && product.images[0]) || '/placeholder-product.jpg',
        quantity: 1,
      });
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle image search submission
  const handleImageSearchSubmit = () => {
    if (imageFile) {
      handleImageSearch(imageFile);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchSearchResults(page);
  };

  return (
    <MainLayout hideFittingRoom hideRoomVisualizer>
      <div className="container mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {query ? (
              searchType === "category" 
                ? `Products in "${query}" Category`
                : `Search Results for "${query}"`
            ) : (
              "All Products"
            )}
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {pagination.totalItems} results found
            {searchType === "category" && (
              <span className="ml-2 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs">
                Category Search
              </span>
            )}
          </div>
        </div>

        {/* Search Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-indigo-50 dark:bg-gray-800/30 p-4 rounded-xl">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            {/* Text Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <form action="/search" method="get">
                <Input
                  type="text"
                  name="q"
                  placeholder={t("search.placeholder")}
                  className="pl-10 w-full bg-white dark:bg-gray-900"
                  defaultValue={query}
                />
              </form>
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                Category:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 min-w-[150px]"
              >
                <option value="All">All Categories</option>
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Search Toggle */}
            <Button
              variant={imageSearchMode ? "default" : "outline"}
              onClick={() => setImageSearchMode(!imageSearchMode)}
              className="flex items-center gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              {t("search.image")}
            </Button>

            {/* Data Source Toggle */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                {t("search.data_source")}:
              </label>
              <select
                value={searchSource}
                onChange={(e) => setSearchSource(e.target.value as "prisma" | "supabase")}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900"
              >
                <option value="supabase">Supabase</option>
                <option value="prisma">Local</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-4">

            {/* Sort By */}
            <div className="relative">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setSortBy(sortBy)}
              >
                <ArrowUpDown className="h-4 w-4" />
                Sort:{" "}
                {sortBy === "price:asc"
                  ? "Price Low to High"
                  : sortBy === "price:desc"
                  ? "Price High to Low"
                  : "Newest"}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 z-10 overflow-hidden hidden">
                {[
                  { value: "newest", label: "Newest" },
                  { value: "price:asc", label: "Price: Low to High" },
                  { value: "price:desc", label: "Price: High to Low" },
                ].map((option) => (
                  <button
                    key={option.value}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                    onClick={() => setSortBy(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter Button */}
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t("ecommerce.price")} {t("common.range")}
            </Button>
          </div>
        </div>

        {/* Image Search Interface */}
        {imageSearchMode && (
          <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t("search.image_search")}
            </h3>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  </div>
                )}
              </div>
              <Button
                onClick={handleImageSearchSubmit}
                disabled={!imageFile || loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                {t("search.search_with_image")}
              </Button>
            </div>
          </div>
        )}

        {/* Price Range Filter */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 bg-white dark:bg-gray-900 rounded-lg shadow p-6 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Price Range</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="px-3">
                <Slider
                  defaultValue={priceRange}
                  min={0}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="my-6"
                />
              </div>
              <div className="flex justify-between mb-4 text-sm">
                <div>Min: ${priceRange[0]}</div>
                <div>Max: ${priceRange[1]}</div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handlePriceFilterApply}>Apply Filter</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid or Loading/Error State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="h-8 w-8 text-indigo-600 dark:text-violet-500 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading results...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg max-w-md">
              <h3 className="text-red-600 dark:text-red-400 font-medium mb-2">
                Error
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => fetchSearchResults()}
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-lg max-w-md">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We couldn't find any products that match your search criteria.
              </p>
              <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Try:</p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    Checking your spelling
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    Using more general search terms
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    Adjusting your filters
                  </li>
                </ul>
              </div>
              <Link href="/">
                <Button className="mt-6">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Products grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group"
                >
                  <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-violet-700 transition-all duration-300 h-full flex flex-col">
                    <div 
                      className="relative pt-[100%] bg-gray-100 dark:bg-gray-900 overflow-hidden cursor-pointer"
                      onClick={() => openModal({
                        id: product.id,
                        name: product.name,
                        description: product.description || '',
                        price: product.price,
                        images: product.images || [product.image || ''],
                        category: product.category ? {
                          name: product.category.name,
                          slug: product.category.slug || ''
                        } : undefined,
                        stock: product.stock || 0
                      })}
                    >
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                          <ShoppingBag className="h-10 w-10 text-gray-400 dark:text-gray-600" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add to wishlist functionality
                          }}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      {product.discount && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-red-500 hover:bg-red-600">
                            {product.discount}% Off
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="flex-1 p-4">
                      <div className="flex items-center gap-1 mb-1">
                        {product.category && (
                          <span className="text-xs text-indigo-600 dark:text-violet-400 font-medium">
                            {product.category.name}
                          </span>
                        )}
                      </div>
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-2 hover:text-indigo-600 dark:hover:text-violet-400 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      {product.rating && (
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={`${
                                star <= product.rating!
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            ({product.rating})
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.discount && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                              $
                              {(
                                product.price /
                                (1 - product.discount / 100)
                              ).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                      >
                        Add to Cart
                        <ShoppingBag className="h-4 w-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pb-12 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrevious}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  className="flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center">
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    // Show only a window of pages
                    if (
                      index + 1 === 1 ||
                      index + 1 === pagination.totalPages ||
                      (index + 1 >= pagination.currentPage - 1 &&
                        index + 1 <= pagination.currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={index}
                          variant={
                            pagination.currentPage === index + 1
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="h-9 w-9 mx-1"
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </Button>
                      );
                    } else if (
                      index + 1 === pagination.currentPage - 2 ||
                      index + 1 === pagination.currentPage + 2
                    ) {
                      return (
                        <span
                          key={index}
                          className="h-9 w-4 flex items-center justify-center"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  className="flex items-center gap-1"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
