"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ArrowRight,
  Heart,
  ShoppingBag,
  Eye,
  Star,
  TrendingUp,
  Sparkles,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  Camera,
  Globe,
  MapPin,
  ShoppingCart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MainLayout from "@/components/main-layout";
import { useTheme } from "next-themes";
import PriceCartButton from "@/components/ui/price-cart-button";

const BabyFashionPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showShopCategory, setShowShopCategory] = useState(true); // New state
  const containerRef = useRef(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeCategory !== "all") {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }
  }, [activeCategory]);

  const handleCategoryChange = (value) => {
    setActiveCategory(value);
  };

  const featuredItems = [
    {
      id: 1,
      title: "Spring Baby Collection",
      description:
        "Adorable outfits designed for comfort and style, perfect for your little one's adventures.",
      image:
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800",
      alt: "Baby Spring Collection",
      link: "/collections/spring-baby",
      cta: "Shop Now",
    },
    {
      id: 2,
      title: "Organic Cotton Essentials",
      description:
        "Gentle on sensitive skin, our organic cotton collection provides all-day comfort.",
      image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800",
      alt: "Organic Cotton Baby Clothes",
      link: "/collections/organic-essentials",
      cta: "Explore Collection",
    },
    {
      id: 3,
      title: "Special Occasion Outfits",
      description:
        "Adorable formal wear for your baby's special moments and celebrations.",
      image: "https://images.unsplash.com/photo-1554342872-034a06541bad?w=800",
      alt: "Baby Special Occasion Clothes",
      link: "/collections/special-occasion",
      cta: "View Collection",
    },
  ];

  const trendingCategories = [
    {
      name: "Onesies & Rompers",
      items: 42,
      image:
        "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800",
      color: "from-pink-600 to-purple-600",
    },
    {
      name: "Sleep & Play",
      items: 36,
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800", // Updated image
      color: "from-blue-600 to-sky-600",
    },
    {
      name: "Dresses & Sets",
      items: 28,
      image:
        "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800",
      color: "from-amber-600 to-yellow-600",
    },
    {
      name: "Accessories",
      items: 54,
      image:
        "https://images.unsplash.com/photo-1527866512907-a35a62a0f6c5?w=800",
      color: "from-emerald-600 to-teal-600",
    },
  ];

  const collections = [
    { id: "all", name: "All" },
    { id: "newborn", name: "Newborn" },
    { id: "3-6m", name: "3-6m" },
    { id: "6-12m", name: "6-12m" },
    { id: "toddler", name: "Toddler" },
  ];

  const products = [
    {
      id: 1,
      name: "Cloud Dreams Romper",
      price: 29.99,
      originalPrice: 34.99,
      rating: 4.8,
      reviews: 126,
      colors: ["White", "Pink", "Blue", "Mint"],
      image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800",
      tag: "Bestseller",
      isNew: false,
      category: ["all", "newborn", "3-6m"],
    },
    {
      id: 2,
      name: "Sunshine Bodysuit Set",
      price: 24.99,
      originalPrice: 24.99,
      rating: 4.7,
      reviews: 98,
      colors: ["Yellow", "White", "Gray"],
      image:
        "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800",
      tag: null,
      isNew: true,
      category: ["all", "3-6m", "6-12m"],
    },
    {
      id: 3,
      name: "Dreamy Night Sleeper",
      price: 32.99,
      originalPrice: 39.99,
      rating: 4.9,
      reviews: 214,
      colors: ["Navy", "Gray", "Pink", "Green"],
      image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800", // Updated image
      tag: "Sale",
      isNew: false,
      category: ["all", "newborn", "3-6m", "6-12m"],
    },
    {
      id: 4,
      name: "Safari Adventure Onesie",
      price: 27.99,
      originalPrice: 27.99,
      rating: 4.6,
      reviews: 87,
      colors: ["Khaki", "Green", "Brown"],
      image:
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800",
      tag: null,
      isNew: true,
      category: ["all", "6-12m", "toddler"],
    },
    {
      id: 5,
      name: "Twinkle Star Dress",
      price: 34.99,
      originalPrice: 42.99,
      rating: 4.8,
      reviews: 156,
      colors: ["Pink", "Purple", "Blue", "White"],
      image:
        "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800",
      tag: "Sale",
      isNew: false,
      category: ["all", "6-12m", "toddler"],
    },
    {
      id: 6,
      name: "Cozy Cuddles Knit Set",
      price: 39.99,
      originalPrice: 39.99,
      rating: 4.7,
      reviews: 104,
      colors: ["Cream", "Gray", "Pink", "Blue"],
      image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800",
      tag: null,
      isNew: true,
      category: ["all", "3-6m", "6-12m"],
    },
    {
      id: 7,
      name: "Little Explorer Overalls",
      price: 36.99,
      originalPrice: 44.99,
      rating: 4.9,
      reviews: 173,
      colors: ["Denim", "Gray", "Khaki"],
      image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800",
      tag: "Sale",
      isNew: false,
      category: ["all", "6-12m", "toddler"],
    },
    {
      id: 8,
      name: "Magical Unicorn Pajamas",
      price: 26.99,
      originalPrice: 26.99,
      rating: 4.8,
      reviews: 132,
      colors: ["Purple", "Pink", "Blue", "White"],
      image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800", // Updated image
      tag: "Bestseller",
      isNew: false,
      category: ["all", "3-6m", "6-12m", "toddler"],
    },
  ];

  const filteredProducts = products.filter(
    (product) =>
      product.category.includes(activeCategory) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1]
  );

  return (
    <MainLayout hideRoomVisualizer={true}>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <div ref={containerRef} className="min-h-screen bg-background pt-20">
          <section className="relative h-[90vh] overflow-hidden">
            {/* Background gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-pink-600/5 dark:to-purple-600/10 z-0"></div>
            <div className="absolute inset-0 z-0 opacity-5">
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-pink-600/10 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-pink-600/10 to-transparent"></div>
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-pink-600/10 to-transparent"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-pink-600/10 to-transparent"></div>
            </div>

            {/* Animated decoration elements */}
            <div className="absolute inset-0 overflow-hidden z-0">
              {/* Top left circle */}
              <motion.div
                className="absolute h-40 w-40 rounded-full bg-rose-200 dark:bg-rose-900/30 blur-3xl opacity-30"
                animate={{
                  x: [0, 30, 0, -30, 0],
                  y: [0, -30, 0, 30, 0],
                }}
                transition={{ duration: 15, repeat: Infinity }}
                style={{ top: "15%", left: "15%" }}
              />

              {/* Bottom right circle */}
              <motion.div
                className="absolute h-60 w-60 rounded-full bg-purple-200 dark:bg-purple-900/30 blur-3xl opacity-20"
                animate={{
                  x: [0, -40, 0, 40, 0],
                  y: [0, 40, 0, -40, 0],
                }}
                transition={{ duration: 18, repeat: Infinity }}
                style={{ bottom: "15%", right: "15%" }}
              />

              {/* Middle right circle */}
              <motion.div
                className="absolute h-32 w-32 rounded-full bg-pink-200 dark:bg-pink-900/30 blur-3xl opacity-25"
                animate={{
                  x: [0, 20, 0, -20, 0],
                  y: [0, 20, 0, -20, 0],
                }}
                transition={{ duration: 12, repeat: Infinity }}
                style={{ top: "45%", right: "25%" }}
              />

              {/* Additional decoration elements with careful positioning */}
              <motion.div
                className="absolute h-24 w-24 rounded-full bg-blue-200 dark:bg-blue-900/30 blur-3xl opacity-20"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{ duration: 10, repeat: Infinity }}
                style={{ top: "30%", left: "35%" }}
              />

              <motion.div
                className="absolute h-28 w-28 rounded-full bg-violet-200 dark:bg-violet-900/30 blur-3xl opacity-15"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.15, 0.25, 0.15],
                }}
                transition={{ duration: 8, repeat: Infinity }}
                style={{ bottom: "25%", left: "20%" }}
              />
            </div>

            {/* Content container */}
            <div className="grid grid-cols-1 md:grid-cols-12 h-full container relative z-10">
              {/* Left Content */}
              <motion.div
                className="md:col-span-6 flex flex-col justify-center px-6 py-12 md:py-0"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8"
                >
                  <Badge className="bg-pink-500 text-white px-4 py-2 rounded-full text-base font-medium shadow-lg shadow-pink-500/20 dark:bg-purple-600 dark:shadow-purple-600/20">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Spring/Summer 2025
                  </Badge>
                </motion.div>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-pink-600/10 dark:bg-purple-600/10 blur-2xl"></div>
                  <div className="absolute -right-6 -bottom-6 h-16 w-16 rounded-full bg-pink-600/20 dark:bg-purple-600/20 blur-xl"></div>
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium leading-tight mb-8 relative">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 font-bold">
                      Tiny
                    </span>
                    <br />
                    <span className="relative inline-block">
                      Treasures
                      <div className="absolute -bottom-3 left-0 w-full h-2 bg-pink-600/20 dark:bg-purple-600/20 rounded-full"></div>
                    </span>
                  </h1>
                </motion.div>

                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button
                    size="lg"
                    className="rounded-full bg-pink-500 hover:bg-pink-600 dark:bg-purple-600 dark:hover:bg-purple-700 group flex items-center gap-2 shadow-lg shadow-pink-500/20 dark:shadow-purple-600/20 hover:shadow-pink-600/30 dark:hover:shadow-purple-700/30 transition-all duration-300 transform hover:-translate-y-1 text-base font-medium h-14 px-8"
                  >
                    Shop Collection
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-pink-500/30 dark:border-purple-600/30 text-pink-500 dark:text-purple-500 hover:bg-pink-500/10 dark:hover:bg-purple-600/10 flex items-center gap-2 hover:border-pink-500 dark:hover:border-purple-600 transition-all duration-300 transform hover:-translate-y-1 text-base font-medium h-14 px-8"
                  >
                    New Arrivals
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Right Content - Dynamic Hero Image Carousel */}
              <motion.div
                className="md:col-span-6 flex items-center justify-center px-6 py-12 md:py-0 relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <div className="w-full h-full relative">
                  {featuredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: activeSlide === index ? 1 : 0,
                        scale: activeSlide === index ? 1 : 0.9,
                      }}
                      transition={{ duration: 0.7 }}
                    >
                      <div className="relative w-full h-[60vh] rounded-2xl overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
                        <Image
                          src={item.image}
                          alt={item.alt}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-2xl brightness-95 transition-all duration-700"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                          <h2 className="text-3xl font-bold text-white mb-2">
                            {item.title}
                          </h2>
                          <p className="text-white/90 mb-4 max-w-md">
                            {item.description}
                          </p>
                          <Button className="rounded-full bg-white text-pink-500 dark:text-purple-600 hover:bg-white/90 group flex items-center gap-2">
                            {item.cta}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Navigation dots */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-30">
                    {featuredItems.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          activeSlide === index
                            ? "bg-white shadow-lg w-6"
                            : "bg-white/50 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom scroll indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Scroll to discover
                </p>
                <div className="w-[30px] h-[50px] rounded-full border-2 border-muted-foreground/30 flex justify-center pt-3">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-pink-500 dark:bg-purple-600"
                    animate={{ y: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                </div>
              </div>
            </motion.div>
          </section>

          {/* Categories Section */}
          <section
            className="py-16 container relative overflow-hidden"
            id="collections"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-12 text-center"
            >
              <Badge className="bg-pink-100 text-pink-600 dark:bg-purple-900/30 dark:text-purple-400 mb-3">
                <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                Trending Now
              </Badge>
              <h2 className="text-4xl font-bold mb-4">Explore Categories</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our carefully curated collections designed for your
                baby's comfort and your peace of mind.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
              {trendingCategories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{ y: -10 }}
                >
                  <div className="group relative rounded-2xl overflow-hidden h-[400px] shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10"></div>
                    <Image
                      src={category.image}
                      alt={category.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500 z-10`}
                    ></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform transition-transform duration-300 group-hover:translate-y-0">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {category.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-white/90 text-sm">
                          {category.items} Items
                        </span>
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-center text-white group-hover:text-pink-300 transition-colors"
                        >
                          <span className="text-sm font-medium mr-1">
                            Shop Now
                          </span>
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Products Section */}
          <section className="py-16 bg-pink-50/50 dark:bg-purple-950/10">
            <div className="container">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <Badge className="mb-3 bg-pink-100 text-pink-600 dark:bg-purple-900/30 dark:text-purple-400">
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    Featured Products
                  </Badge>
                  <h2 className="text-4xl font-bold">Our Collection</h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Tabs
                    value={activeCategory}
                    onValueChange={handleCategoryChange}
                    className="w-full sm:w-auto"
                  >
                    <TabsList className="bg-white dark:bg-gray-900/50 p-1 rounded-full">
                      {collections.map((col) => (
                        <TabsTrigger
                          key={col.id}
                          value={col.id}
                          className="rounded-full"
                        >
                          {col.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {isLoading
                  ? Array(8)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          className="animate-pulse bg-white dark:bg-gray-900 rounded-2xl p-4 h-[400px]"
                        >
                          <div className="bg-gray-200 dark:bg-gray-800 h-[250px] rounded-xl mb-4"></div>
                          <div className="space-y-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))
                  : filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="group"
                      >
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                            <Image
                              src={product.image}
                              alt={product.name}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-xl"
                            />
                            
                            <div className="absolute top-3 right-3 space-y-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="secondary"
                                      className="rounded-full"
                                    >
                                      <Heart className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Add to Wishlist</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg">
                              {product.name}
                            </h3>
                            <PriceCartButton
                              price={product.price}
                              originalPrice={product.originalPrice}
                              
                              onAddToCart={async () => {
                                // Add your cart logic here
                                await new Promise((resolve) =>
                                  setTimeout(resolve, 1000)
                                );
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default BabyFashionPage;
