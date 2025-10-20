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
  Bath,
  Droplets,
  Waves,
  ShowerHead,
  Flower2,
  ShoppingBag,
  Tag,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/main-layout";
import PriceCartButton from "@/components/ui/price-cart-button";

export default function BathroomPage() {
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
      name: "Waterfall Freestanding Bathtub",
      price: 2499.99,
      originalPrice: 2999.99,
      rating: 4.9,
      reviews: 118,
      images: [
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800",
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800",
      ],
      description: "Luxurious acrylic soaking tub with seamless design",
      colors: ["#FFFFFF", "#ECEFF1", "#CFD8DC"],
      tag: "Premium",
    },
    {
      id: 2,
      name: "Smart Rainfall Shower System",
      price: 899.99,
      originalPrice: 1199.99,
      rating: 4.8,
      reviews: 94,
      images: [
        "https://images.unsplash.com/photo-1584622781867-1239067c21d4?w=800",
        "https://images.unsplash.com/photo-1600566752447-f4bfdb0eb95c?w=800",
      ],
      description: "Programmable shower with temperature control and LED lighting",
      colors: ["#BDBDBD", "#616161", "#CFD8DC"],
      tag: "Smart Home",
    },
    {
      id: 3,
      name: "Floating Vanity Cabinet Set",
      price: 1299.99,
      originalPrice: 1699.99,
      rating: 4.7,
      reviews: 76,
      images: [
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800",
        "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800",
      ],
      description: "Wall-mounted vanity with marble countertop and soft-close drawers",
      colors: ["#A67C52", "#5D4037", "#D7CCC8"],
      tag: "Best Seller",
    },
  ];

  // Bathroom collections
  const collections = [
    {
      id: "modern",
      name: "Modern Spa",
      description: "Sleek designs with therapeutic features",
      image:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      color: "from-cyan-600/50 to-blue-800/40",
    },
    {
      id: "minimalist",
      name: "Minimalist",
      description: "Clean, efficient spaces with essential elements",
      image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800",
      color: "from-sky-600/50 to-sky-800/40",
    },
    {
      id: "luxe",
      name: "Luxe Retreat",
      description: "Opulent materials and indulgent features",
      image:
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3fc?w=800",
      color: "from-blue-600/50 to-blue-800/40",
    },
    {
      id: "natural",
      name: "Natural Organic",
      description: "Sustainable materials with biophilic elements",
      image:
        "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800",
      color: "from-teal-600/50 to-teal-800/40",
    },
  ];

  // Bathroom products
  const products = [
    {
      id: 1,
      name: "Freestanding Soaking Tub",
      price: 1899.99,
      originalPrice: 2499.99,
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800",
      rating: 4.9,
      reviews: 87,
      category: "Bathtubs",
      tag: "Premium",
      filter: ["bathtubs", "all"],
    },
    {
      id: 2,
      name: "Wall-Mounted Vanity",
      price: 899.99,
      originalPrice: 1199.99,
      image:
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800",
      rating: 4.8,
      reviews: 102,
      category: "Vanities",
      tag: "Best Seller",
      filter: ["vanities", "all"],
    },
    {
      id: 3,
      name: "Digital Shower System",
      price: 649.99,
      originalPrice: 899.99,
      image:
        "https://images.unsplash.com/photo-1584622781867-1239067c21d4?w=800",
      rating: 4.7,
      reviews: 75,
      category: "Showers",
      tag: "Smart Home",
      filter: ["showers", "all"],
    },
    {
      id: 4,
      name: "Luxury Towel Set",
      price: 149.99,
      originalPrice: 199.99,
      image:
        "https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?w=800",
      rating: 4.9,
      reviews: 132,
      category: "Linens",
      tag: "Best Seller",
      filter: ["linens", "all"],
    },
    {
      id: 5,
      name: "LED Bathroom Mirror",
      price: 249.99,
      originalPrice: 349.99,
      image:
        "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800",
      rating: 4.6,
      reviews: 58,
      category: "Accessories",
      tag: "New Arrival",
      filter: ["accessories", "all"],
    },
    {
      id: 6,
      name: "Motion Sensor Faucet",
      price: 299.99,
      originalPrice: 399.99,
      image:
        "https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=800",
      rating: 4.8,
      reviews: 63,
      category: "Fixtures",
      tag: "Smart Home",
      filter: ["fixtures", "all"],
    },
    {
      id: 7,
      name: "Heated Floor System",
      price: 549.99,
      originalPrice: 749.99,
      image:
        "https://images.unsplash.com/photo-1539922631499-09155deb4b94?w=800",
      rating: 4.7,
      reviews: 42,
      category: "Heating",
      tag: "Luxury",
      filter: ["heating", "all"],
    },
    {
      id: 8,
      name: "Wall Storage Cabinet",
      price: 349.99,
      originalPrice: 449.99,
      image:
        "https://images.unsplash.com/photo-1600566753375-17f2d92325e5?w=800",
      rating: 4.5,
      reviews: 89,
      category: "Storage",
      tag: "Space Saver",
      filter: ["storage", "all"],
    },
  ];

  // Hero section design inspiration images
  const inspirationImages = [
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3fc?w=800",
    "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800",
    "https://images.unsplash.com/photo-1600566752447-f4bfdb0eb95c?w=800",
  ];

  // Bathroom design tips
  const designTips = [
    {
      id: 1,
      title: "Water Efficiency",
      description:
        "Choose eco-friendly fixtures to conserve water and reduce utility costs.",
      icon: <Droplets className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Proper Ventilation",
      description:
        "Ensure adequate air flow to prevent moisture damage and mold growth.",
      icon: <Waves className="h-5 w-5" />,
      color: "bg-sky-500",
    },
    {
      id: 3,
      title: "Strategic Storage",
      description:
        "Maximize space with vertical solutions and built-in organization.",
      icon: <ShoppingBag className="h-5 w-5" />,
      color: "bg-teal-500",
    },
    {
      id: 4,
      title: "Natural Elements",
      description:
        "Incorporate plants and natural materials for a spa-like atmosphere.",
      icon: <Flower2 className="h-5 w-5" />,
      color: "bg-cyan-500",
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
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-blue-600/5 dark:to-cyan-600/10 z-10" />

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
                backgroundImage: `radial-gradient(circle at 1px 1px, #0284c7 1px, transparent 0)`,
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
                  <Badge className="relative z-10 bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg shadow-blue-600/20">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl"
                    />
                    <Sparkles className="h-3.5 w-3.5 mr-2" />
                    Bathroom Collection 2025
                  </Badge>
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
                    className="absolute -right-20 -bottom-20 w-40 h-40 bg-cyan-600/20 rounded-full blur-3xl"
                  />

                  <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-8">
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600"
                    >
                      Reinvent Your
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="block"
                    >
                      Personal Oasis
                    </motion.span>
                  </h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="text-lg text-muted-foreground mb-8 max-w-md"
                  >
                    Elevate your bathroom into a luxurious spa-like retreat with 
                    our premium fixtures, elegant accessories, and innovative solutions.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Button
                      size="lg"
                      className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 group flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-300"
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
                      className="rounded-full border-blue-600/20 text-blue-600 dark:text-cyan-400 hover:bg-blue-600/10 group"
                    >
                      Design Ideas
                      <Bath className="ml-2 h-4 w-4" />
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
                        alt={`Bathroom design ${index + 1}`}
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
                    className="absolute -left-8 top-1/4 bg-blue-600/90 text-white p-4 rounded-xl shadow-lg backdrop-blur-sm"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Bath className="h-6 w-6 mb-2" />
                    <p className="text-sm font-medium">Luxurious Features</p>
                  </motion.div>

                  <motion.div
                    className="absolute right-8 bottom-1/4 bg-cyan-600/90 text-white p-4 rounded-xl shadow-lg backdrop-blur-sm"
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <ShowerHead className="h-6 w-6 mb-2" />
                    <p className="text-sm font-medium">Modern Innovations</p>
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
              <Badge className="mb-3 px-3 py-1 bg-blue-600/10 text-blue-600 dark:text-cyan-400 rounded-full">
                Featured
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Luxury Fixtures
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transform your bathroom with premium fixtures and features
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
                    <Badge className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm">
                      {featuredProducts[activeProductIndex].tag}
                    </Badge>
                  </div>

                  {/* Quick action buttons */}
                  <div className="absolute right-4 bottom-4 flex flex-col gap-2">
                    <Button
                      size="icon"
                      className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-white/100 shadow-lg"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-white/100 shadow-lg"
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
                            ? "ring-2 ring-blue-600 dark:ring-cyan-500"
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
                  <p className="text-sm font-medium mb-2">Available Finishes</p>
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
                  originalPrice={featuredProducts[activeProductIndex].originalPrice}
                  image={featuredProducts[activeProductIndex].images[0]}
                />

                <div className="mt-6"></div>

                {/* Tabs for product information */}
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="details">Features</TabsTrigger>
                    <TabsTrigger value="specs">Specifications</TabsTrigger>
                    <TabsTrigger value="installation">Installation</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="details"
                    className="text-sm text-muted-foreground space-y-2 pt-4"
                  >
                    <p>• Premium materials for long-lasting durability</p>
                    <p>• Ergonomic design for maximum comfort</p>
                    <p>• Easy-clean surface treatment</p>
                    <p>• Scratch and stain resistant finish</p>
                  </TabsContent>
                  <TabsContent
                    value="specs"
                    className="text-sm text-muted-foreground space-y-2 pt-4"
                  >
                    <p>• Dimensions: 67" × 32" × 23" (170 × 81 × 58 cm)</p>
                    <p>• Weight: 165 lbs (75 kg)</p>
                    <p>• Material: Premium acrylic with reinforcement</p>
                    <p>• Water Capacity: 58 gallons (220 liters)</p>
                  </TabsContent>
                  <TabsContent
                    value="installation"
                    className="text-sm text-muted-foreground space-y-2 pt-4"
                  >
                    <p>• Professional installation recommended</p>
                    <p>• Plumbing requirements: 3/4" hot and cold water lines</p>
                    <p>• Drain size: 1-1/2" standard waste outlet</p>
                    <p>• Floor reinforcement may be required</p>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between items-center mt-6">
                  {featuredProducts.map((product, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`px-3 py-1 ${
                        index === activeProductIndex
                          ? "bg-blue-600/10 text-blue-600 dark:text-cyan-400"
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
        <section className="py-20 bg-blue-50/50 dark:bg-blue-950/10">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-3 px-3 py-1 bg-blue-600/10 text-blue-600 dark:text-cyan-400 rounded-full">
                Expert Advice
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Bathroom Design Tips
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Professional insights to maximize function and style in your bathroom
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
              <Badge className="mb-3 px-3 py-1 bg-blue-600/10 text-blue-600 dark:text-cyan-400 rounded-full">
                Styles
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Bathroom Collections
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our curated bathroom design styles
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
                    href={`/category/decoration/bathroom/collections/${collection.id}`}
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
              <Badge className="mb-3 px-3 py-1 bg-blue-600/10 text-blue-600 dark:text-cyan-400 rounded-full">
                Shop
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Bathroom Essentials
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Premium fixtures and accessories for your perfect bathroom
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
                      ? "bg-blue-600 hover:bg-blue-700"
                      : ""
                  }
                >
                  All
                </Button>
                <Button
                  variant={activeFilter === "bathtubs" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("bathtubs")}
                  className={
                    activeFilter === "bathtubs"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : ""
                  }
                >
                  Bathtubs
                </Button>
                <Button
                  variant={activeFilter === "vanities" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("vanities")}
                  className={
                    activeFilter === "vanities"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : ""
                  }
                >
                  Vanities
                </Button>
                <Button
                  variant={activeFilter === "showers" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("showers")}
                  className={
                    activeFilter === "showers"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : ""
                  }
                >
                  Showers
                </Button>
                <Button
                  variant={activeFilter === "fixtures" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("fixtures")}
                  className={
                    activeFilter === "fixtures"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : ""
                  }
                >
                  Fixtures
                </Button>
                <Button
                  variant={activeFilter === "accessories" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("accessories")}
                  className={
                    activeFilter === "accessories"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : ""
                  }
                >
                  Accessories
                </Button>
                <Button
                  variant={activeFilter === "storage" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("storage")}
                  className={
                    activeFilter === "storage"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : ""
                  }
                >
                  Storage
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
                              <Badge className="bg-blue-600 text-white px-2 py-1 text-xs">
                                {product.tag}
                              </Badge>
                            </div>
                          )}

                          {/* Quick action buttons */}
                          <div className="absolute right-4 bottom-4 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                            <Button
                              size="icon"
                              className="h-9 w-9 rounded-full bg-white text-blue-600 hover:bg-white/90 shadow-lg"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              className="h-9 w-9 rounded-full bg-white text-blue-600 hover:bg-white/90 shadow-lg"
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
                className="rounded-full border-blue-600/20 text-blue-600 hover:bg-blue-600/10 px-8"
              >
                View All Products
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* 3D Design CTA */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 relative overflow-hidden">
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
                Smart Planning
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Design Your Dream Bathroom
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
                Try our interactive 3D bathroom planner to visualize your perfect space 
                before making any purchases or renovations.
              </p>
              <Button
                size="lg"
                className="rounded-full bg-white text-blue-700 hover:bg-white/90 group px-8 py-6 text-lg shadow-lg shadow-blue-800/20"
              >
                Start 3D Planner
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