"use client";

import React, { useState, useRef } from "react";
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
  ChevronRight,
  Heart,
  Eye,
  Star,
  Sparkles,
  Moon,
  Bed,
  BookOpen,
  AlignJustify,
  CircleDashed,
  Shirt,
  Tag,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/main-layout";
import PriceCartButton from "@/components/ui/price-cart-button";

export default function BedroomPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Featured products
  const featuredProducts = [
    {
      id: 1,
      name: "Luxe Velvet Platform Bed",
      price: 1699.99,
      originalPrice: 2099.99,
      rating: 4.9,
      reviews: 117,
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
      ],
      description: "Sumptuous upholstered bed with integrated LED lighting",
      colors: ["#8AA2A9", "#6B5B95", "#212121", "#F5F5F5"],
      tag: "Best Seller",
    },
    {
      id: 2,
      name: "Serenity Memory Foam Mattress",
      price: 1299.99,
      originalPrice: 1599.99,
      rating: 4.8,
      reviews: 203,
      images: [
        "https://images.unsplash.com/photo-1631050783105-bf1ea61e203d?w=800",
        "https://images.unsplash.com/photo-1568745631455-76f48ec8c8bc?w=800",
      ],
      description: "Cooling gel-infused memory foam for superior comfort",
      colors: ["#F5F5F5", "#EEEEEE", "#E0E0E0"],
      tag: "Premium",
    },
    {
      id: 3,
      name: "Harmony Bedside Table Set",
      price: 449.99,
      originalPrice: 599.99,
      rating: 4.7,
      reviews: 86,
      images: [
        "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800",
        "https://images.unsplash.com/photo-1595495648887-7ff19d3a7c18?w=800",
      ],
      description: "Solid oak nightstands with integrated wireless charging",
      colors: ["#A67C52", "#5D4037", "#D7CCC8"],
      tag: "New Arrival",
    },
  ];

  // Bedroom collections
  const collections = [
    {
      id: "modern",
      name: "Modern Sanctuary",
      description: "Clean lines with plush comfort",
      image:
        "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800",
      color: "from-rose-600/50 to-rose-800/40",
    },
    {
      id: "classic",
      name: "Classic Elegance",
      description: "Timeless designs with refined details",
      image:
        "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800",
      color: "from-purple-600/50 to-purple-800/40",
    },
    {
      id: "minimalist",
      name: "Minimalist Haven",
      description: "Tranquil spaces with essential elements",
      image:
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
      color: "from-slate-600/50 to-slate-800/40",
    },
    {
      id: "luxury",
      name: "Luxury Retreat",
      description: "Opulent materials and lavish details",
      image:
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
      color: "from-blue-600/50 to-blue-800/40",
    },
  ];

  // Bedroom products
  const products = [
    {
      id: 1,
      name: "King-Size Upholstered Bed",
      price: 1499.99,
      originalPrice: 1899.99,
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
      rating: 4.9,
      reviews: 98,
      category: "Beds",
      tag: "Best Seller",
      filter: ["beds", "all"],
    },
    {
      id: 2,
      name: "Premium Memory Foam Mattress",
      price: 999.99,
      originalPrice: 1299.99,
      image:
        "https://images.unsplash.com/photo-1631050783105-bf1ea61e203d?w=800",
      rating: 4.8,
      reviews: 176,
      category: "Mattresses",
      tag: "Top Rated",
      filter: ["mattresses", "all"],
    },
    {
      id: 3,
      name: "Solid Oak Dresser",
      price: 799.99,
      originalPrice: 999.99,
      image:
        "https://images.unsplash.com/photo-1595495501064-606a8f4026e0?w=800",
      rating: 4.7,
      reviews: 82,
      category: "Storage",
      tag: "Premium",
      filter: ["storage", "all"],
    },
    {
      id: 4,
      name: "Luxury Bedding Set",
      price: 299.99,
      originalPrice: 399.99,
      image:
        "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=800",
      rating: 4.9,
      reviews: 125,
      category: "Bedding",
      tag: "Best Seller",
      filter: ["bedding", "all"],
    },
    {
      id: 5,
      name: "Midnight Table Lamp",
      price: 149.99,
      originalPrice: 199.99,
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
      rating: 4.6,
      reviews: 64,
      category: "Lighting",
      tag: "New Arrival",
      filter: ["lighting", "all"],
    },
    {
      id: 6,
      name: "Velvet Accent Chair",
      price: 599.99,
      originalPrice: 749.99,
      image:
        "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800",
      rating: 4.8,
      reviews: 47,
      category: "Seating",
      tag: "Luxury",
      filter: ["seating", "all"],
    },
    {
      id: 7,
      name: "Full-Length Mirror",
      price: 249.99,
      originalPrice: 329.99,
      image:
        "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800",
      rating: 4.7,
      reviews: 58,
      category: "Decor",
      tag: "Featured",
      filter: ["decor", "all"],
    },
    {
      id: 8,
      name: "Bedside Table Set",
      price: 389.99,
      originalPrice: 499.99,
      image:
        "https://images.unsplash.com/photo-1595495648887-7ff19d3a7c18?w=800",
      rating: 4.8,
      reviews: 72,
      category: "Tables",
      tag: "New Arrival",
      filter: ["tables", "all"],
    },
  ];

  // Hero section design inspiration images
  const inspirationImages = [
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800",
    "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
    "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800",
  ];

  // Bedroom design tips
  const designTips = [
    {
      id: 1,
      title: "Layered Lighting",
      description:
        "Combine ambient, task, and accent lighting for a cozy atmosphere.",
      icon: <Moon className="h-5 w-5" />,
      color: "bg-purple-500",
    },
    {
      id: 2,
      title: "Bedding Textures",
      description:
        "Mix different textures in bedding for visual interest and comfort.",
      icon: <CircleDashed className="h-5 w-5" />,
      color: "bg-rose-500",
    },
    {
      id: 3,
      title: "Calm Color Palette",
      description:
        "Choose soothing colors that promote relaxation and restful sleep.",
      icon: <Shirt className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      id: 4,
      title: "Declutter Space",
      description:
        "Keep surfaces clear and utilize smart storage for a peaceful environment.",
      icon: <AlignJustify className="h-5 w-5" />,
      color: "bg-slate-500",
    },
  ];

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <MainLayout>
      <div ref={containerRef} className="min-h-screen bg-background">
        {/* Hero Section with Animated Elements */}
        <section className="relative min-h-[95vh] overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-purple-600/5 dark:to-rose-600/10 z-10" />

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
                backgroundImage: `radial-gradient(circle at 1px 1px, #9c27b0 1px, transparent 0)`,
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          {/* Content Container */}
          <div className="container relative z-20 h-full px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="pt-32 lg:pt-0"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8 relative"
                >
                  <Badge className="relative z-10 bg-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg shadow-purple-600/20">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 rounded-full bg-purple-400/20 blur-xl"
                    />
                    <Sparkles className="h-3.5 w-3.5 mr-2" />
                    Bedroom Collection 2025
                  </Badge>
                </motion.div>

                <motion.div className="relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -left-20 -top-20 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="absolute -right-20 -bottom-20 w-40 h-40 bg-rose-600/20 rounded-full blur-3xl"
                  />

                  <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-8">
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-rose-600"
                    >
                      Create Your
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="block"
                    >
                      Dream Retreat
                    </motion.span>
                  </h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="text-lg text-muted-foreground mb-8 max-w-md"
                  >
                    Transform your bedroom into a serene sanctuary with our
                    luxurious furniture, plush bedding, and thoughtful accents.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Button
                      size="lg"
                      className="rounded-full bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 group flex items-center gap-2 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 transition-all duration-300"
                    >
                      Shop Collection
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
                      className="rounded-full border-purple-600/20 text-purple-600 dark:text-rose-400 hover:bg-purple-600/10 group"
                    >
                      Sleep Tips
                      <Moon className="ml-2 h-4 w-4" />
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
                  {inspirationImages.map((image, index) => (
                    <motion.div
                      key={index}
                      className={`relative rounded-2xl overflow-hidden shadow-xl ${
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
                        alt={`Bedroom design ${index + 1}`}
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

                  {/* Floating Elements */}
                  <motion.div
                    className="absolute -left-8 top-1/4 bg-purple-600/90 text-white p-4 rounded-xl shadow-lg backdrop-blur-sm"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Bed className="h-6 w-6 mb-2" />
                    <p className="text-sm font-medium">Supreme Comfort</p>
                  </motion.div>

                  <motion.div
                    className="absolute right-8 bottom-1/4 bg-rose-600/90 text-white p-4 rounded-xl shadow-lg backdrop-blur-sm"
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <BookOpen className="h-6 w-6 mb-2" />
                    <p className="text-sm font-medium">Relaxing Atmosphere</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Product Carousel */}
        <section className="py-20 bg-gradient-to-b from-background to-background/95">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-3 px-3 py-1 bg-purple-600/10 text-purple-600 dark:text-rose-400 rounded-full">
                Featured
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Luxury Essentials
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Premium bedroom pieces designed for exceptional comfort and
                style
              </p>
            </motion.div>

            {/* Featured Products Showcase */}
            <div className="flex flex-col lg:flex-row gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:w-1/2"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src={featuredProducts[activeProductIndex].images[0]}
                    alt={featuredProducts[activeProductIndex].name}
                    fill
                    className="object-cover transition-all duration-700 ease-out"
                  />

                  {/* Product tag */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-purple-600 text-white px-3 py-1.5 rounded-full text-sm">
                      {featuredProducts[activeProductIndex].tag}
                    </Badge>
                  </div>

                  {/* Quick action buttons */}
                  <div className="absolute right-4 bottom-4 flex flex-col gap-2">
                    <Button
                      size="icon"
                      className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm text-purple-600 hover:bg-white/100 shadow-lg"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm text-purple-600 hover:bg-white/100 shadow-lg"
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Thumbnail Navigation */}
                <div className="flex gap-2 mt-4">
                  {featuredProducts[activeProductIndex].images.map(
                    (image, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className={`p-0 h-16 w-16 rounded-lg overflow-hidden ${
                          i === 0
                            ? "ring-2 ring-purple-600 dark:ring-rose-500"
                            : ""
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Thumbnail ${i + 1}`}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </Button>
                    )
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:w-1/2 flex flex-col justify-center"
              >
                <div className="mb-2 flex items-center">
                  <div className="flex items-center mr-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i <
                          Math.floor(
                            featuredProducts[activeProductIndex].rating
                          )
                            ? "text-amber-400"
                            : "text-gray-300"
                        }`}
                        fill={
                          i <
                          Math.floor(
                            featuredProducts[activeProductIndex].rating
                          )
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {featuredProducts[activeProductIndex].rating} (
                    {featuredProducts[activeProductIndex].reviews} reviews)
                  </span>
                </div>

                <h3 className="text-3xl font-bold mb-4">
                  {featuredProducts[activeProductIndex].name}
                </h3>

                <p className="text-lg text-muted-foreground mb-8">
                  {featuredProducts[activeProductIndex].description}
                </p>

                <div className="mb-8">
                  <p className="text-sm font-medium mb-2">Available Colors</p>
                  <div className="flex gap-3">
                    {featuredProducts[activeProductIndex].colors.map(
                      (color, i) => (
                        <Button
                          key={i}
                          size="icon"
                          variant="outline"
                          className="rounded-full p-0 h-8 w-8 flex items-center justify-center"
                        >
                          <span
                            className="h-6 w-6 rounded-full"
                            style={{ backgroundColor: color }}
                          ></span>
                        </Button>
                      )
                    )}
                  </div>
                </div>

                <PriceCartButton
                  id={featuredProducts[activeProductIndex].id}
                  name={featuredProducts[activeProductIndex].name}
                  price={featuredProducts[activeProductIndex].price}
                  originalPrice={
                    featuredProducts[activeProductIndex].originalPrice
                  }
                  image={featuredProducts[activeProductIndex].images[0]}
                />

                <div className="mt-6"></div>

                {/* Tabs for product information */}
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="details">Features</TabsTrigger>
                    <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
                    <TabsTrigger value="delivery">Assembly</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="details"
                    className="text-sm text-muted-foreground space-y-2 pt-4"
                  >
                    <p>• Premium materials with luxurious finish</p>
                    <p>• Integrated LED ambient lighting</p>
                    <p>• Reinforced frame with padded headboard</p>
                    <p>• USB charging ports on both sides</p>
                  </TabsContent>
                  <TabsContent
                    value="dimensions"
                    className="text-sm text-muted-foreground space-y-2 pt-4"
                  >
                    <p>• King Size: 76" × 80" (193 × 203 cm)</p>
                    <p>• Headboard Height: 48" (122 cm)</p>
                    <p>• Clearance: 7" (18 cm)</p>
                    <p>• Total Weight: 165 lbs (75 kg)</p>
                  </TabsContent>
                  <TabsContent
                    value="delivery"
                    className="text-sm text-muted-foreground space-y-2 pt-4"
                  >
                    <p>• White glove delivery and setup available</p>
                    <p>• Easy assembly with included tools</p>
                    <p>• Assembly time: Approximately 45 minutes</p>
                    <p>• Old mattress removal service included</p>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between items-center mt-6">
                  {featuredProducts.map((product, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`px-3 py-1 ${
                        index === activeProductIndex
                          ? "bg-purple-600/10 text-purple-600 dark:text-rose-400"
                          : ""
                      }`}
                      onClick={() => setActiveProductIndex(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Design Tips Section */}
        <section className="py-20 bg-purple-50/50 dark:bg-purple-950/10">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-3 px-3 py-1 bg-purple-600/10 text-purple-600 dark:text-rose-400 rounded-full">
                Expert Advice
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Bedroom Design Tips
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Professional insights to create a relaxing and rejuvenating
                space
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {designTips.map((tip, index) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className={`${tip.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}
                  >
                    {tip.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{tip.title}</h3>
                  <p className="text-muted-foreground">{tip.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Collection Showcase */}
        <section className="py-20 bg-gradient-to-b from-background to-background/95">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-3 px-3 py-1 bg-purple-600/10 text-purple-600 dark:text-rose-400 rounded-full">
                Styles
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Bedroom Collections
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our curated bedroom styles for every taste
              </p>
            </motion.div>

            {/* Collections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {collections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Link
                    href={`/category/decoration/bedroom/collections/${collection.id}`}
                  >
                    <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-md">
                      <Image
                        src={collection.image}
                        alt={collection.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {collection.name}
                        </h3>
                        <p className="text-white/90 mb-4">
                          {collection.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                          >
                            View Collection
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

        {/* Product Showcase */}
        <section className="py-20 bg-gradient-to-b from-background/95 to-background">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Badge className="mb-3 px-3 py-1 bg-purple-600/10 text-purple-600 dark:text-rose-400 rounded-full">
                Shop
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Bedroom Essentials
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Create your perfect sleep sanctuary with our premium collection
              </p>
            </motion.div>

            {/* Filter tabs */}
            <div className="flex justify-center mb-10">
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant={activeFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("all")}
                  className={
                    activeFilter === "all"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : ""
                  }
                >
                  All
                </Button>
                <Button
                  variant={activeFilter === "beds" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("beds")}
                  className={
                    activeFilter === "beds"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : ""
                  }
                >
                  Beds
                </Button>
                <Button
                  variant={
                    activeFilter === "mattresses" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleFilterChange("mattresses")}
                  className={
                    activeFilter === "mattresses"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : ""
                  }
                >
                  Mattresses
                </Button>
                <Button
                  variant={activeFilter === "storage" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("storage")}
                  className={
                    activeFilter === "storage"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : ""
                  }
                >
                  Storage
                </Button>
                <Button
                  variant={activeFilter === "bedding" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("bedding")}
                  className={
                    activeFilter === "bedding"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : ""
                  }
                >
                  Bedding
                </Button>
                <Button
                  variant={activeFilter === "lighting" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("lighting")}
                  className={
                    activeFilter === "lighting"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : ""
                  }
                >
                  Lighting
                </Button>
                <Button
                  variant={activeFilter === "decor" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("decor")}
                  className={
                    activeFilter === "decor"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : ""
                  }
                >
                  Decor
                </Button>
              </div>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {products
                .filter((product) => product.filter.includes(activeFilter))
                .map((product) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Link href={`/product/${product.id}`}>
                      <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />

                          {/* Tag */}
                          {product.tag && (
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-purple-600 text-white px-2 py-1 text-xs">
                                {product.tag}
                              </Badge>
                            </div>
                          )}

                          {/* Quick action buttons */}
                          <div className="absolute right-4 bottom-4 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                            <Button
                              size="icon"
                              className="h-9 w-9 rounded-full bg-white text-purple-600 hover:bg-white/90 shadow-lg"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              className="h-9 w-9 rounded-full bg-white text-purple-600 hover:bg-white/90 shadow-lg"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold line-clamp-1">
                              {product.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1 mb-3">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(product.rating)
                                      ? "text-amber-400"
                                      : "text-gray-300"
                                  }`}
                                  fill={
                                    i < Math.floor(product.rating)
                                      ? "currentColor"
                                      : "none"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              ({product.reviews})
                            </span>
                          </div>

                          <PriceCartButton
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            originalPrice={product.originalPrice}
                            image={product.image}
                          />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </motion.div>

            <div className="flex justify-center mt-12">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-purple-600/20 text-purple-600 hover:bg-purple-600/10 px-8"
              >
                View All Products
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Sleep Better CTA */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-rose-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="grid"
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 8 0 L 0 0 0 8"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="container px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge className="mb-6 px-4 py-1.5 bg-white/20 text-white backdrop-blur-sm rounded-full text-sm font-medium inline-flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Sleep Science
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Discover Better Sleep
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
                Learn how our expertly designed bedroom furniture and
                accessories can help improve your sleep quality and overall
                wellbeing.
              </p>
              <Button
                size="lg"
                className="rounded-full bg-white text-purple-700 hover:bg-white/90 group px-8 py-6 text-lg shadow-lg shadow-purple-800/20"
              >
                Get Sleep Tips
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.span>
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
