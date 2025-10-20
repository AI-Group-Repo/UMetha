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
  Search,
  ShoppingCart,
  ChevronRight,
  Star,
  Heart,
  Eye,
  Zap,
  Smartphone,
  Headphones,
  Watch,
  Tv,
  Camera,
  Laptop,
  Wifi,
  Speaker,
  ArrowRight,
  Sparkles,
  Plus,
  Check,
  RefreshCw,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/main-layout";
import PriceCartButton from "@/components/ui/price-cart-button";

export default function ElectronicsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Hero section images
  const heroImages = [
    "/smartTV.jpeg",
    "/earpods.jpeg",
    "/devices.jpeg",
  ];

  // Featured categories
  const categories = [
    {
      id: 1,
      name: "Smartphones",
      description: "Latest flagship devices",
      image: "/smartphones.jpeg",
      icon: <Smartphone className="h-5 w-5" />,
      items: 84,
      color: "from-blue-600/60 to-indigo-600/40",
    },
    {
      id: 2,
      name: "Laptops",
      description: "Powerful computing on-the-go",
      image: "/laptops.jpeg",
      icon: <Laptop className="h-5 w-5" />,
      items: 62,
      color: "from-emerald-600/60 to-cyan-600/40",
    },
    {
      id: 3,
      name: "Audio",
      description: "Immersive sound experience",
      image: "/audio.jpeg",
      icon: <Headphones className="h-5 w-5" />,
      items: 78,
      color: "from-purple-600/60 to-violet-600/40",
    },
    {
      id: 4,
      name: "Wearables",
      description: "Smart accessories for life",
      image: "/smartwatch.jpeg",
      icon: <Watch className="h-5 w-5" />,
      items: 56,
      color: "from-rose-600/60 to-pink-600/40",
    },
  ];

  // Trending products
  const trendingProducts = [
    {
      id: 1,
      name: "UltraVision Pro Display",
      price: 1299.99,
      originalPrice: 1599.99,
      image: "/LG-TV.jpeg",
      tag: "Best Seller",
      rating: 4.9,
      reviews: 218,
      category: "Displays",
    },
    {
      id: 2,
      name: "SonicWave Headphones",
      price: 349.99,
      originalPrice: 449.99,
      image: "/SonyHeadphones.jpeg",
      tag: "New Arrival",
      rating: 4.8,
      reviews: 156,
      category: "Audio",
    },
    {
      id: 3,
      name: "PowerSync Pro Charger",
      price: 89.99,
      originalPrice: 119.99,
      image: "/powerbank.jpeg",
      tag: "Trending",
      rating: 4.7,
      reviews: 203,
      category: "Accessories",
    },
    {
      id: 4,
      name: "QuadCore Ultra Laptop",
      price: 1799.99,
      originalPrice: 1999.99,
      image: "/macbook.jpeg",
      tag: "Premium",
      rating: 4.9,
      reviews: 182,
      category: "Computing",
    },
  ];

  // Featured offers with countdown
  const featuredOffer = {
    title: "Galaxy Ultra S25",
    description:
      "The next evolution in smartphone technology with AI-powered features",
    price: 999.99,
    originalPrice: 1299.99,
    savings: 300,
    image: "/GalaxyS25Ultra.jpeg",
    features: [
      "8K Dynamic AMOLED Display",
      "Neural Processing Engine",
      "Quantum Battery Technology",
      "Sapphire Glass Protection",
    ],
    timeRemaining: {
      days: 2,
      hours: 14,
      minutes: 35,
    },
  };

  return (
    <MainLayout hideFittingRoom={true} hideRoomVisualizer={true} >
      <div ref={containerRef} className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-indigo-600/5 dark:to-indigo-600/10 z-10" />

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
                    className="absolute -left-20 -top-20 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="absolute -right-20 -bottom-20 w-40 h-40 bg-violet-600/20 rounded-full blur-3xl"
                  />

                  <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-8">
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600"
                    >
                      Future Tech
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="block"
                    >
                      Available Now
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
                      className="rounded-full bg-indigo-600 hover:bg-indigo-700 group flex items-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-300"
                    >
                      Shop New Arrivals
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
                      className="rounded-full border-indigo-600/20 text-indigo-600 hover:bg-indigo-600/10 group"
                    >
                      View Offers
                      <Zap className="ml-2 h-4 w-4" />
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
                      className={`relative rounded-2xl overflow-hidden ${
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
                        alt={`Electronics showcase ${index + 1}`}
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

        {/* Featured Deal Section */}
        <section className="py-16 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
                <div className="relative bg-white dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-6 overflow-hidden shadow-xl">
                  <div className="absolute -right-20 -top-20 w-40 h-40 bg-indigo-400/30 rounded-full blur-2xl"></div>
                  <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-violet-400/30 rounded-full blur-2xl"></div>

                  <div className="relative">
                    <Badge className="mb-4 px-3 py-1 bg-rose-600 text-white rounded-full">
                      Limited Time Offer
                    </Badge>
                    <h2 className="text-3xl font-bold mb-2">
                      {featuredOffer.title}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {featuredOffer.description}
                    </p>

                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl font-bold text-indigo-600">
                          ${featuredOffer.price}
                        </span>
                        <span className="text-xl text-muted-foreground line-through">
                          ${featuredOffer.originalPrice}
                        </span>
                        <Badge className="bg-green-600">
                          ${featuredOffer.savings} OFF
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-xl p-4 text-center">
                          <span className="block text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            {featuredOffer.timeRemaining.days}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Days
                          </span>
                        </div>
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-xl p-4 text-center">
                          <span className="block text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            {featuredOffer.timeRemaining.hours}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Hours
                          </span>
                        </div>
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-xl p-4 text-center">
                          <span className="block text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            {featuredOffer.timeRemaining.minutes}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Minutes
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {featuredOffer.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                              <Check className="h-3 w-3 text-green-600" />
                            </div>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Claim Special Offer
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex justify-center items-center"
              >
                <div className="relative w-[400px] h-[400px]">
                  <motion.div
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 2, 0, -2, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative z-10 top-1/4 left-10"
                  >
                    <Image
                      src={featuredOffer.image}
                      alt={featuredOffer.title}
                      width={300}
                      height={300}
                      className="object-contain rounded-2xl shadow-lg shadow-indigo-600/20"
                    />
                  </motion.div>

                  {/* Orbit effect */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 z-0"
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-transparent via-indigo-400/30 to-transparent" />
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />

                    <div className="absolute top-[15%] right-[15%] h-10 w-10 rounded-full bg-indigo-600/90 shadow-lg shadow-indigo-600/20 flex items-center justify-center text-white">
                      <Zap className="h-5 w-5" />
                    </div>

                    <div className="absolute bottom-[15%] left-[15%] h-10 w-10 rounded-full bg-violet-600/90 shadow-lg shadow-violet-600/20 flex items-center justify-center text-white">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-20 bg-gradient-to-b from-background to-background/95">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-3 px-3 py-1 bg-indigo-600/10 text-indigo-600 rounded-full">
                Categories
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Explore Our Tech
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover innovative devices across all major electronics
                categories
              </p>
            </motion.div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={`/category/electronics/${category.name.toLowerCase()}`}
                  >
                    <div className="group relative h-[400px] w-[200px] rounded-2xl overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <div className="flex items-center gap-2 mb-2">
                          {category.icon}
                          <h3 className="text-2xl font-bold text-white">
                            {category.name}
                          </h3>
                        </div>
                        <p className="text-white/90 mb-4">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">
                            {category.items} items
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                          >
                            Browse
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Products */}
        <section className="py-20 bg-indigo-50/50 dark:bg-indigo-950/10">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-3 px-3 py-1 bg-indigo-600/10 text-indigo-600 rounded-full">
                Featured
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Bestsellers
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our most popular tech products that customers love
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6">
                     
                      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                      <div className="mb-4">
                        <PriceCartButton
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          originalPrice={product.originalPrice}
                          image={product.image}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-3 px-3 py-1 bg-indigo-600/10 text-indigo-600 rounded-full">
                Why Choose Us
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                The UltraTech Experience
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We go beyond just selling electronics
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg"
              >
                <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">3-Year Protection</h3>
                <p className="text-muted-foreground mb-4">
                  Every product comes with our industry-leading warranty and
                  protection plan.
                </p>
                <Button variant="link" className="p-0 h-auto text-indigo-600">
                  Learn More <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg"
              >
                <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
                  <RefreshCw className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">30-Day Returns</h3>
                <p className="text-muted-foreground mb-4">
                  Try your devices risk-free with our hassle-free return policy.
                </p>
                <Button variant="link" className="p-0 h-auto text-indigo-600">
                  Learn More <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg"
              >
                <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
                  <Sparkles className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Expert Support</h3>
                <p className="text-muted-foreground mb-4">
                  Get 24/7 technical assistance from our certified
                  professionals.
                </p>
                <Button variant="link" className="p-0 h-auto text-indigo-600">
                  Contact Support <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
