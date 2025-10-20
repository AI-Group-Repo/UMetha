"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Star,
  Heart,
  Eye,
  ShoppingCart,
  Sparkles,
  Flame,
  Percent,
  Clock,
  Tag,
  BadgePercent,
  Timer,
  Gift,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/main-layout";
import PriceCartButton from "@/components/ui/price-cart-button";

export default function BargainPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredDeal, setHoveredDeal] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  

  // Categories
  const categories = [
    {
      id: "all",
      name: "All Deals",
      icon: <BadgePercent className="h-4 w-4" />,
    },
    { id: "fashion", name: "Fashion", icon: <Tag className="h-4 w-4" /> },
    {
      id: "electronics",
      name: "Electronics",
      icon: <Sparkles className="h-4 w-4" />,
    },
    { id: "home", name: "Home & Living", icon: <Gift className="h-4 w-4" /> },
  ];

  // Flash deals
  const flashDeals = [
    {
      id: 1,
      name: "Premium Leather Jacket",
      price: 89.99,
      originalPrice: 299.99,
      discount: 70,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
      tag: "Flash Deal",
      rating: 4.8,
      reviews: 347,
      category: "fashion",
      tagColor: "from-indigo-600 to-violet-400",
      timeLeft: "4:59:32",
      sold: 76,
      total: 100,
      isHot: true,
    },
    {
      id: 2,
      name: "Wireless Headphones",
      price: 129.99,
      originalPrice: 349.99,
      discount: 63,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      tag: "Lightning Sale",
      rating: 4.9,
      reviews: 512,
      category: "electronics",
      tagColor: "from-indigo-600 to-violet-400",
      timeLeft: "2:34:18",
      sold: 189,
      total: 200,
      isHot: true,
    },
    {
      id: 3,
      name: "Designer Sunglasses",
      price: 59.99,
      originalPrice: 179.99,
      discount: 67,
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
      tag: "Limited Stock",
      rating: 4.7,
      reviews: 215,
      category: "fashion",
      tagColor: "from-indigo-600 to-violet-400",
      timeLeft: "8:12:45",
      sold: 42,
      total: 50,
      isHot: false,
    },
    {
      id: 4,
      name: "Smart Home Assistant",
      price: 49.99,
      originalPrice: 149.99,
      discount: 66,
      image:
        "https://images.unsplash.com/photo-1512446816042-444d641267d4?w=800",
      tag: "Best Value",
      rating: 4.8,
      reviews: 378,
      category: "electronics",
      tagColor: "from-indigo-600 to-violet-400",
      timeLeft: "5:23:10",
      sold: 156,
      total: 200,
      isHot: true,
    },
  ];

  // Trending deals
  const trendingDeals = [
    {
      id: 5,
      name: "Luxury Watch Collection",
      price: 199.99,
      originalPrice: 499.99,
      discount: 60,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      tag: "Premium",
      rating: 4.9,
      reviews: 124,
      category: "fashion",
      sold: 43,
      total: 50,
    },
    {
      id: 6,
      name: "Ergonomic Office Chair",
      price: 149.99,
      originalPrice: 329.99,
      discount: 55,
      image:
        "/chair.jpeg",
      tag: "Work From Home",
      rating: 4.7,
      reviews: 186,
      category: "home",
      sold: 62,
      total: 100,
    },
    {
      id: 7,
      name: "Artisan Coffee Maker",
      price: 79.99,
      originalPrice: 199.99,
      discount: 60,
      image:
        "https://images.unsplash.com/photo-1520970014086-2208d157c9e2?w=800",
      tag: "Home Essential",
      rating: 4.8,
      reviews: 214,
      category: "home",
      sold: 78,
      total: 100,
    },
    {
      id: 8,
      name: "Ultra HD Smart TV",
      price: 499.99,
      originalPrice: 1299.99,
      discount: 62,
      image:
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800",
      tag: "Entertainment",
      rating: 4.9,
      reviews: 325,
      category: "electronics",
      sold: 34,
      total: 50,
    },
  ];

   // Hero section images
   const heroImages = [
    "/sale1.jpeg",
    "/sale2.jpeg",
    "/sale3.jpeg",
  ];
  const filteredFlashDeals =
    activeCategory === "all"
      ? flashDeals
      : flashDeals.filter((deal) => deal.category === activeCategory);

  const filteredTrendingDeals =
    activeCategory === "all"
      ? trendingDeals
      : trendingDeals.filter((deal) => deal.category === activeCategory);

  return (
    <MainLayout>
      <div ref={containerRef} className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative min-h-[95vh] overflow-hidden">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-blue-600/5 dark:to-blue-600/10 z-10" />
        
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        backgroundPosition: ["0% 0%", "100% 100%"],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear",
                      }}
                      style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #4f46e5 1px, transparent 0)`,
                        backgroundSize: "40px 40px",
                      }}
                    />
                  </div>
        
                  {/* Content Container */}
                  <div className="container relative z-20 h-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-center">
                      {/* Left Content */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="pt-20 lg:pt-0"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="mb-8 relative"
                        >
                          
                        </motion.div>
        
                        <motion.div className="relative">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -left-20 -top-20 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            className="absolute -right-20 -bottom-20 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl"
                          />
        
                          <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-8">
                            <motion.span
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7 }}
                              className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                            >
                              Incredible
                            </motion.span>
                            <motion.span
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.9 }}
                              className="block"
                            >
                              Savings Await
                            </motion.span>
                          </h1>
        
                       
        
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.3 }}
                            className="flex flex-wrap gap-4"
                          >
                            <Button
                              size="lg"
                              className="rounded-full bg-blue-600 hover:bg-blue-700 group flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-300"
                            >
                              Shop Flash Deals
                              <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <ArrowRight className="h-4 w-4" />
                              </motion.span>
                            </Button>
                            <Button
                              size="lg"
                              variant="outline"
                              className="rounded-full border-blue-600/20 text-blue-600 hover:bg-blue-600/10 group"
                            >
                              Browse Categories
                              <Tag className="ml-2 h-4 w-4" />
                            </Button>
                          </motion.div>
                        </motion.div>
                      </motion.div>
        
                      {/* Right Content - Interactive Image Gallery */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="relative h-[600px] hidden lg:block"
                      >
                        <div className="grid grid-cols-2 gap-4 h-full">
                          {heroImages.map((image, index) => (
                            <motion.div
                              key={index}
                              className={`relative rounded-2xl overflow-hidden   ${
                                index === 2 ? "col-span-2" : ""
                              }`}
                              initial={{ y: 50, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.2 * index }}
                              onHoverStart={() => setHoveredImage(index)}
                              onHoverEnd={() => setHoveredImage(null)}
                            >
                              <Image
                                src={image}
                                alt={`Sale banner image ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-700"
                                style={{
                                  transform:
                                    hoveredImage === index ? "scale(1.1)" : "scale(1)",
                                }}
                              />
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: hoveredImage === index ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                              />
                            </motion.div>
                          ))}
        
                          
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </section>
        {/* Filter Section */}
        <section className="py-8">
          <div className="container">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${
                    activeCategory === category.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-violet-800"
                  }`}
                >
                  {category.icon}
                  <span className="font-medium">{category.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Flash Deals */}
        <section className="py-12">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-8"
            >
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-violet-900/30 p-2 rounded-full">
                  <Flame className="h-6 w-6 text-indigo-600 dark:text-violet-400" />
                </div>
                <h2 className="text-3xl font-bold">Flash Deals</h2>
              </div>
              <Button
                variant="ghost"
                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100 dark:hover:bg-violet-900/30"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {filteredFlashDeals.map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                    whileHover={{ y: -5 }}
                  >
                    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800">
                      <div
                        className="relative aspect-square overflow-hidden"
                        onMouseEnter={() => setHoveredDeal(deal.id)}
                        onMouseLeave={() => setHoveredDeal(null)}
                      >
                        <Image
                          src={deal.image}
                          alt={deal.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                      
                        {/* Time remaining pill */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                          <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                            <Timer className="h-4 w-4 text-indigo-400" />
                            <span className="font-medium">{deal.timeLeft}</span>
                          </div>
                        </div>

                        {/* Quick action buttons */}
                        <div className="absolute right-4 bottom-4 flex flex-col gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                          <Button
                            size="icon"
                            className="h-10 w-10 rounded-full bg-white text-indigo-600 hover:bg-white/90 shadow-lg"
                          >
                            <Heart className="h-5 w-5" />
                          </Button>
                          <Button
                            size="icon"
                            className="h-10 w-10 rounded-full bg-white text-indigo-600 hover:bg-white/90 shadow-lg"
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                        </div>

                        {/* View product overlay on hover */}
                        <AnimatePresence>
                          {hoveredDeal === deal.id && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                            >
                              <Button className="bg-white text-white hover:bg-white/90">
                                View Product
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-semibold mb-4">
                          {deal.name}
                        </h3>

                        {/* Progress bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>
                              {deal.sold}/{deal.total} sold
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <motion.div
                              className="bg-gradient-to-r from-indigo-600 to-violet-600 h-2.5 rounded-full"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(deal.sold / deal.total) * 100}%`,
                              }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>

                        {/* Replace price and cart button with PriceCartButton */}
                        <PriceCartButton
                          price={deal.price}
                          originalPrice={deal.originalPrice}
                          discount={deal.discount}
                          
                          onAddToCart={async () => {
                            await new Promise((resolve) =>
                              setTimeout(resolve, 1000)
                            );
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Banner */}
        <section className="py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-10 md:p-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div className="text-white">
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-3xl md:text-4xl font-bold mb-4"
                    >
                      Extra 25% Off
                      <br />
                      First Purchase
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="text-white/80 mb-8"
                    >
                      Use code <span className="font-bold">FIRSTBUY25</span> at
                      checkout.
                      <br />
                      Valid for new customers only.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button className="bg-white text-indigo-600 hover:bg-white/90 rounded-full shadow-lg">
                        Shop Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                  <div className="relative h-[300px]">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        delay: 0.2,
                      }}
                      className="absolute inset-0"
                    >
                      <Image
                        src="/first-buy.jpeg"
                        alt="Special offer"
                        fill
                        className="object-contain rounded-3xl"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <motion.div
                className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/10"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.2, 0.3],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white/10"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{ duration: 7, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </section>

        {/* Trending Deals */}
        <section className="py-12">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-8"
            >
              <div className="flex items-center gap-3">
                <div className="bg-violet-100 dark:bg-violet-900/30 p-2 rounded-full">
                  <TrendingUp className="h-6 w-6 text-violet-600" />
                </div>
                <h2 className="text-3xl font-bold">Trending Deals</h2>
              </div>
              <Button
                variant="ghost"
                className="text-violet-600 hover:text-violet-700 hover:bg-violet-100 dark:hover:bg-violet-900/30"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {filteredTrendingDeals.map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                    whileHover={{ y: -5 }}
                  >
                    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800">
                      <div
                        className="relative aspect-square overflow-hidden"
                        onMouseEnter={() => setHoveredDeal(deal.id)}
                        onMouseLeave={() => setHoveredDeal(null)}
                      >
                        <Image
                          src={deal.image}
                          alt={deal.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Discount badge */}
                        <div className="absolute left-4 top-4 z-10">
                          <Badge className="px-2.5 py-1.5 bg-violet-500 text-white font-medium shadow-md">
                            {deal.discount}% OFF
                          </Badge>
                        </div>

                        {/* Quick action buttons */}
                        <div className="absolute right-4 top-4 flex flex-col gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                          <Button
                            size="icon"
                            className="h-9 w-9 rounded-full bg-white text-violet-600 hover:bg-white/90 shadow-lg"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* View product overlay on hover */}
                        <AnimatePresence>
                          {hoveredDeal === deal.id && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                            >
                              <Button className="bg-white text-white hover:bg-white/90">
                                Quick View
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="p-5">
                        
                        <h3 className="text-lg font-semibold mb-4">
                          {deal.name}
                        </h3>

                        {/* Progress bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            
                            <span>
                              {deal.sold}/{deal.total} sold
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div
                              className="bg-gradient-to-r from-violet-500 to-violet-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(deal.sold / deal.total) * 100}%`,
                              }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>

                        {/* Replace price and cart button with PriceCartButton */}
                        <PriceCartButton
                          price={deal.price}
                          originalPrice={deal.originalPrice}
                          discount={deal.discount}
                          onAddToCart={async () => {
                            await new Promise((resolve) =>
                              setTimeout(resolve, 1000)
                            );
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-to-b from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <Badge className="mb-4 px-3 py-1 bg-indigo-100 dark:bg-violet-900/40 text-indigo-700 dark:text-violet-300">
                Never Miss a Deal
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Subscribe for Exclusive Offers
              </h2>
              <p className="text-muted-foreground mb-8">
                Be the first to know about flash sales, special discounts, and
                limited-time deals.
              </p>

              <form className="flex gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-full border border-indigo-200 dark:border-violet-800 
                           bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <Button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 
                           hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg"
                >
                  Subscribe
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
