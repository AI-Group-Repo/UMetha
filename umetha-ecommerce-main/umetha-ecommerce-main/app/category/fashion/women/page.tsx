"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Filter,
  ChevronDown,
  ShoppingBag,
  X,
  Search,
  ArrowRight,
  Star,
  Sparkles,
  TrendingUp,
  ArrowUpDown,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/main-layout";
import PageHeader from "@/components/page-header";
import { Input } from "@/components/ui/input";
import PriceCartButton from "@/components/ui/price-cart-button";

export default function WomensPage() {
  // State for category filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Featured");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Scroll progress for parallax effect
  const heroRef = useRef(null);

  // Categories
  const categories = [
    "All",
    "Dresses",
    "Tops",
    "Bottoms",
    "Jackets",
    "Accessories",
    "Shoes",
    "Swimwear",
  ];

  // Featured collections
  const featuredCollections = [
    {
      id: 1,
      name: "Spring Essentials",
      description: "Light and airy pieces for the perfect spring wardrobe",
      image:
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1586",
    },
    {
      id: 2,
      name: "Evening Elegance",
      description: "Sophisticated styles for memorable nights",
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1470",
    },
    {
      id: 3,
      name: "Urban Casual",
      description: "Effortless everyday looks for the modern woman",
      image:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1473",
    },
  ];

  // Products with proper data structure
  const products = [
    {
      id: 1,
      name: "Floral Maxi Dress",
      price: 89.99,
      originalPrice: 119.99,
      discount: 25,
      category: "Dresses",
      rating: 4.8,
      reviews: 124,
      image:
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1600",
      tags: ["New Arrival", "Bestseller"],
      colors: ["Blue", "Pink", "Yellow"],
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      id: 2,
      name: "Classic Silk Blouse",
      price: 69.99,
      originalPrice: 89.99,
      discount: 22,
      category: "Tops",
      rating: 4.5,
      reviews: 86,
      image:
        "https://images.unsplash.com/photo-1509631179407-329d2a2e9733?q=80&w=1600",
      tags: ["Premium"],
      colors: ["White", "Black", "Cream"],
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      id: 3,
      name: "High-Waist Denim Jeans",
      price: 79.99,
      originalPrice: 99.99,
      discount: 20,
      category: "Bottoms",
      rating: 4.7,
      reviews: 152,
      image:
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1600",
      tags: ["Bestseller"],
      colors: ["Blue", "Black", "Light Blue"],
      sizes: ["24", "26", "28", "30", "32"],
    },
    {
      id: 4,
      name: "Cashmere Sweater",
      price: 129.99,
      originalPrice: 169.99,
      discount: 24,
      category: "Tops",
      rating: 4.9,
      reviews: 78,
      image:
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1600",
      tags: ["Premium", "New Season"],
      colors: ["Beige", "Gray", "Navy"],
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: 5,
      name: "Tailored Blazer",
      price: 149.99,
      originalPrice: 199.99,
      discount: 25,
      category: "Jackets",
      rating: 4.6,
      reviews: 92,
      image:
        "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=1600",
      tags: ["Premium"],
      colors: ["Black", "Navy", "Burgundy"],
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      id: 6,
      name: "Summer Sundress",
      price: 59.99,
      originalPrice: 79.99,
      discount: 25,
      category: "Dresses",
      rating: 4.4,
      reviews: 112,
      image:
        "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1600",
      tags: ["Trending"],
      colors: ["Yellow", "Blue", "White"],
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      id: 7,
      name: "Leather Crossbody Bag",
      price: 99.99,
      originalPrice: 129.99,
      discount: 23,
      category: "Accessories",
      rating: 4.8,
      reviews: 65,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600",
      tags: ["New Arrival"],
      colors: ["Black", "Brown", "Tan"],
      sizes: [],
    },
    {
      id: 8,
      name: "Designer Stilettos",
      price: 159.99,
      originalPrice: 199.99,
      discount: 20,
      category: "Shoes",
      rating: 4.7,
      reviews: 48,
      image:
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1600",
      tags: ["Exclusive"],
      colors: ["Red", "Black", "Nude"],
      sizes: ["5", "6", "7", "8", "9"],
    },
  ];

  // Filter products based on category and search
  const filteredProducts = products.filter((product) => {
    // Filter by category
    const categoryMatch =
      selectedCategory === "All" || product.category === selectedCategory;

    // Filter by price range
    const priceMatch =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    // Filter by search query
    const searchMatch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return categoryMatch && priceMatch && searchMatch;
  });

  // Handle sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "Price: Low to High":
        return a.price - b.price;
      case "Price: High to Low":
        return b.price - a.price;
      case "Rating":
        return b.rating - a.rating;
      case "Newest":
        return b.id - a.id;
      default: // Featured
        return 0;
    }
  });

  return (
    <MainLayout hideRoomVisualizer={true}>
      {/* Hero Section with Parallax Effect */}
      <div
        ref={heroRef}
        className="relative h-[70vh] overflow-hidden rounded-2xl mb-12"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-violet-600/40"></div>
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1470"
            alt="Women's Fashion"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>
        </div>

        <div className="relative h-full container mx-auto flex flex-col justify-center items-start px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <Badge className="bg-white/90 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Spring Collection 2025
            </Badge>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Redefine Your <span className="text-indigo-300">Style</span>{" "}
              Journey
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-lg">
              Discover curated pieces that blend timeless elegance with
              contemporary design, tailored for the modern woman.
            </p>

            <div className="flex gap-4">
              <Button
                size="lg"
                className="rounded-full bg-white/90 text-indigo-700 hover:bg-white group shadow-lg px-8"
              >
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 text-white hover:bg-white/20 px-8"
              >
                View Collections
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Category Section */}
      <div className="container mx-auto mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Women's Collection</h2>
            <p className="text-muted-foreground">
              Find your perfect style from our curated selection
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-full flex items-center gap-2"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-4 w-4" />
              Search
            </Button>

            <Button
              variant="outline"
              className="rounded-full flex items-center gap-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>

            <div className="relative">
              <Button
                variant="outline"
                className="rounded-full flex items-center gap-2"
                onClick={() => setSortBy(sortBy)}
              >
                <ArrowUpDown className="h-4 w-4" />
                {sortBy}
                <ChevronDown className="h-4 w-4" />
              </Button>

              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 z-10 overflow-hidden">
                {[
                  "Featured",
                  "Price: Low to High",
                  "Price: High to Low",
                  "Rating",
                  "Newest",
                ].map((option) => (
                  <button
                    key={option}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                    onClick={() => setSortBy(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for items, categories, or collections..."
                  className="pl-12 pr-12 py-6 rounded-full border-indigo-200 dark:border-violet-800/40"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400 dark:text-violet-400" />
                {searchQuery && (
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-5 w-5 text-indigo-400 dark:text-violet-400" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Section */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800/20">
                <div className="flex flex-wrap gap-6">
                  <div className="flex-1 min-w-[200px]">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          className={`px-4 py-2 rounded-full text-sm ${
                            selectedCategory === category
                              ? "bg-indigo-600 text-white"
                              : "bg-white dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                          }`}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="w-full md:w-auto md:flex-1">
                    <h3 className="font-medium mb-3">Price Range</h3>
                    <div className="px-2">
                      <div className="flex justify-between text-sm mb-2">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={1000}
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value),
                          ])
                        }
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-6 py-3 rounded-full text-sm whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Collections */}
      <div className="container mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
          Featured Collections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCollections.map((collection) => (
            <motion.div
              key={collection.id}
              className="group relative rounded-xl overflow-hidden h-80 shadow-md"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {collection.name}
                </h3>
                <p className="text-white/90 mb-4">{collection.description}</p>
                <Button
                  variant="outline"
                  className="rounded-full text-white border-white/30 hover:bg-white/20"
                >
                  View Collection
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {selectedCategory === "All" ? "All Products" : selectedCategory}
          </h2>
          <p className="text-muted-foreground">{sortedProducts.length} items</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <motion.div
              key={product.id}
              className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 transition-all hover:shadow-lg"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {product.tags[0] && (
                  <Badge className="absolute top-3 right-3 bg-indigo-600 text-white">
                    {product.tags[0]}
                  </Badge>
                )}

                <div className="absolute bottom-0 left-0 right-0 flex justify-between p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex items-center gap-1 text-white">
                    
                    <span className="text-xs text-white/70">
                      ({product.reviews})
                    </span>
                  </div>

                  <button className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Heart className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-medium mb-4">{product.name}</h3>

                <PriceCartButton
                  price={product.price}
                  originalPrice={product.originalPrice}
                  
                  onAddToCart={async () => {
                    // Add your cart logic here
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                  }}
                />

                {product.sizes.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1">
                    {product.sizes.slice(0, 5).map((size) => (
                      <span
                        key={size}
                        className="inline-block px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-800"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="container mx-auto mb-16">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600"></div>
          <div className="relative py-16 px-8 md:px-16 max-w-3xl mx-auto text-center">
            <motion.h3
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Join Our Style Community
            </motion.h3>
            <motion.p
              className="text-white/90 mb-8 max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Subscribe to our newsletter and be the first to know about new
              collections, exclusive offers and style inspiration.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Input
                type="email"
                placeholder="Your email address"
                className="rounded-full bg-white/90 border-0 text-indigo-900 placeholder:text-indigo-900/60 px-6"
              />
              <Button className="rounded-full bg-white text-indigo-700 hover:bg-white/90 px-6">
                Subscribe
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
