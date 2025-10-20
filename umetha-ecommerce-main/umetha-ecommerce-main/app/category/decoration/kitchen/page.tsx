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
  UtensilsCrossed,
  Flame,
  Coffee,
  Utensils,
  Refrigerator,
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

export default function KitchenPage() {
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
      name: "Professional Chef Knife Set",
      price: 299.99,
      originalPrice: 399.99,
      rating: 4.9,
      reviews: 156,
      images: [
        "https://images.unsplash.com/photo-1566454825481-9c19f2087378?w=800",
        "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800",
      ],
      description: "Premium stainless steel knife set with ergonomic handles",
      colors: ["#E0E0E0", "#263238", "#5D4037"],
      tag: "Premium Quality",
    },
    {
      id: 2,
      name: "Smart Coffee Machine",
      price: 249.99,
      originalPrice: 329.99,
      rating: 4.7,
      reviews: 94,
      images: [
        "https://images.unsplash.com/photo-1507133750040-4a96f6fa1853?w=800",
        "https://images.unsplash.com/photo-1520970519539-3df4817e38d4?w=800",
      ],
      description: "Wi-Fi connected machine with customizable brewing options",
      colors: ["#212121", "#BDBDBD", "#795548"],
      tag: "Smart Home",
    },
    {
      id: 3,
      name: "Marble Cutting Board Set",
      price: 89.99,
      originalPrice: 119.99,
      rating: 4.8,
      reviews: 78,
      images: [
        "https://images.unsplash.com/photo-1619891669534-8d6f54895c77?w=800",
        "https://images.unsplash.com/photo-1593618999306-f1895acd8667?w=800",
      ],
      description: "Natural marble boards for elegant food preparation and serving",
      colors: ["#FFFFFF", "#ECEFF1", "#78909C"],
      tag: "Best Seller",
    },
  ];

  // Kitchen collections
  const collections = [
    {
      id: "modern",
      name: "Modern Kitchen",
      description: "Sleek designs with cutting-edge functionality",
      image:
        "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800",
      color: "from-blue-600/50 to-blue-800/40",
    },
    {
      id: "rustic",
      name: "Rustic Charm",
      description: "Warm, natural materials with vintage appeal",
      image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800",
      color: "from-amber-600/50 to-amber-800/40",
    },
    {
      id: "minimalist",
      name: "Minimalist",
      description: "Clean lines and clutter-free functionality",
      image:
        "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=800",
      color: "from-gray-600/50 to-gray-800/40",
    },
    {
      id: "gourmet",
      name: "Gourmet Chef",
      description: "Professional-grade tools for the home chef",
      image:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800",
      color: "from-emerald-600/50 to-emerald-800/40",
    },
  ];

  // Kitchen products
  const products = [
    {
      id: 1,
      name: "Cast Iron Dutch Oven",
      price: 129.99,
      originalPrice: 179.99,
      image: "https://images.unsplash.com/photo-1585667785249-774f57782b55?w=800",
      rating: 4.9,
      reviews: 142,
      category: "Cookware",
      tag: "Best Seller",
      filter: ["cookware", "all"],
    },
    {
      id: 2,
      name: "Professional Blender",
      price: 199.99,
      originalPrice: 249.99,
      image:
        "https://images.unsplash.com/photo-1631159993898-20255406393a?w=800",
      rating: 4.8,
      reviews: 104,
      category: "Appliances",
      tag: "Premium",
      filter: ["appliances", "all"],
    },
    {
      id: 3,
      name: "Bamboo Utensil Set",
      price: 39.99,
      originalPrice: 59.99,
      image:
        "https://images.unsplash.com/photo-1591871937573-74dbba250201?w=800",
      rating: 4.7,
      reviews: 86,
      category: "Utensils",
      tag: "Eco-friendly",
      filter: ["utensils", "all"],
    },
    {
      id: 4,
      name: "Modern Spice Rack",
      price: 49.99,
      originalPrice: 69.99,
      image:
        "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800",
      rating: 4.6,
      reviews: 73,
      category: "Organization",
      tag: "New Arrival",
      filter: ["organization", "all"],
    },
    {
      id: 5,
      name: "Ceramic Dinner Set",
      price: 129.99,
      originalPrice: 169.99,
      image:
        "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800",
      rating: 4.9,
      reviews: 98,
      category: "Dinnerware",
      tag: "Premium",
      filter: ["dinnerware", "all"],
    },
    {
      id: 6,
      name: "Chef's Apron",
      price: 34.99,
      originalPrice: 44.99,
      image:
        "https://images.unsplash.com/photo-1556909114-44e3e9699ba2?w=800",
      rating: 4.7,
      reviews: 62,
      category: "Textiles",
      tag: "Staff Pick",
      filter: ["textiles", "all"],
    },
    {
      id: 7,
      name: "Wall-Mounted Pot Rack",
      price: 89.99,
      originalPrice: 119.99,
      image:
        "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800",
      rating: 4.8,
      reviews: 53,
      category: "Organization",
      tag: "Space Saver",
      filter: ["organization", "all"],
    },
    {
      id: 8,
      name: "Smart Kitchen Scale",
      price: 49.99,
      originalPrice: 69.99,
      image:
        "https://images.unsplash.com/photo-1591261730799-ee4e6c2d6803?w=800",
      rating: 4.5,
      reviews: 76,
      category: "Appliances",
      tag: "Smart Home",
      filter: ["appliances", "all"],
    },
  ];

  // Hero section design inspiration images
  const inspirationImages = [
    "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800",
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800",
    "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800",
  ];

  // Kitchen tips
  const kitchenTips = [
    {
      id: 1,
      title: "Smart Storage",
      description:
        "Maximize space with vertical storage solutions and drawer organizers.",
      icon: <ShoppingBag className="h-5 w-5" />,
      color: "bg-emerald-500",
    },
    {
      id: 2,
      title: "Prep Stations",
      description:
        "Create dedicated zones for meal preparation to enhance efficiency.",
      icon: <Utensils className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      id: 3,
      title: "Proper Lighting",
      description:
        "Layer lighting with task, ambient, and accent sources for optimal visibility.",
      icon: <Flame className="h-5 w-5" />,
      color: "bg-amber-500",
    },
    {
      id: 4,
      title: "Quality Tools",
      description:
        "Invest in high-quality essential tools rather than numerous gadgets.",
      icon: <UtensilsCrossed className="h-5 w-5" />,
      color: "bg-indigo-500",
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
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-emerald-600/5 dark:to-emerald-600/10 z-10" />

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
                backgroundImage: `radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)`,
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
                  <Badge className="relative z-10 bg-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg shadow-emerald-600/20">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl"
                    />
                    <Sparkles className="h-3.5 w-3.5 mr-2" />
                    Kitchen Collection 2025
                  </Badge>
                </motion.div>

                <motion.div className="relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -left-20 -top-20 w-40 h-40 bg-emerald-600/20 rounded-full blur-3xl"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="absolute -right-20 -bottom-20 w-40 h-40 bg-teal-600/20 rounded-full blur-3xl"
                  />

                  <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-8">
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600"
                    >
                      Elevate Your
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="block"
                    >
                      Culinary Space
                    </motion.span>
                  </h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="text-lg text-muted-foreground mb-8 max-w-md"
                  >
                    Transform your kitchen with premium cookware, smart appliances, and stylish 
                    essentials designed for both form and function.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Button
                      size="lg"
                      className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 group flex items-center gap-2 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all duration-300"
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
                      className="rounded-full border-emerald-600/20 text-emerald-600 dark:text-teal-400 hover:bg-emerald-600/10 group"
                    >
                      Cooking Tips
                      <UtensilsCrossed className="ml-2 h-4 w-4" />
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
                        alt={`Kitchen design ${index + 1}`}
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
                    className="absolute -left-8 top-1/4 bg-emerald-600/90 text-white p-4 rounded-xl shadow-lg backdrop-blur-sm"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Utensils className="h-6 w-6 mb-2" />
                    <p className="text-sm font-medium">Culinary Excellence</p>
                  </motion.div>

                  <motion.div
                    className="absolute right-8 bottom-1/4 bg-teal-600/90 text-white p-4 rounded-xl shadow-lg backdrop-blur-sm"
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Coffee className="h-6 w-6 mb-2" />
                    <p className="text-sm font-medium">Modern Convenience</p>
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
              <Badge className="mb-3 px-3 py-1 bg-emerald-600/10 text-emerald-600 dark:text-teal-400 rounded-full">
                Featured
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Kitchen Essentials
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Professional-grade tools to elevate your cooking experience
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
                    <Badge className="bg-emerald-600 text-white px-3 py-1.5 rounded-full text-sm">
                      {featuredProducts[activeProductIndex].tag}
                    </Badge>
                  </div>

                  {/* Quick action buttons */}
                  <div className="absolute right-4 bottom-4 flex flex-col gap-2">
                    <Button
                      size="icon"
                      className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm text-emerald-600 hover:bg-white/100 shadow-lg"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm text-emerald-600 hover:bg-white/100 shadow-lg"
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
                            ? "ring-2 ring-emerald-600 dark:ring-teal-500"
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
                  price={featuredProducts[activeProductIndex].price}
                  originalPrice={
                    featuredProducts[activeProductIndex].originalPrice
                  }
                  onAddToCart={async () => {
                    // Add your cart logic here
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                  }}
                  className="mb-6"
                />

                {/* Tabs for product information */}
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="specs">Specifications</TabsTrigger>
                    <TabsTrigger value="care">Care</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="details"
                    className="text-sm text-muted-foreground space-y-2 pt-4"
                  >
                    <p>• Premium materials for durability and performance</p>
                    <p>• Ergonomic design for comfortable handling</p>
                    <p>• Professional-grade quality for home chefs</p>
                    <p>• Part of our exclusive culinary collection</p>
                  </TabsContent>
                  <TabsContent
                    value="specs"
                    className="text-sm text-muted-foreground space-y-2 pt-4"
                  >
                    <p>• Material: Stainless Steel / Premium Hardwood</p>
                    <p>• Dimensions: 14" x 10" x 2"</p>
                    <p>• Weight: 3.2 lbs</p>
                    <p>• Origin: Hand-crafted in Germany</p>
                  </TabsContent>
                  <TabsContent
                    value="care"
                    className="text-sm text-muted-foreground space-y-2 pt-4"
                  >
                    <p>• Hand wash with mild soap</p>
                    <p>• Dry immediately after cleaning</p>
                    <p>• Regular maintenance recommended</p>
                    <p>• Store in protective case when not in use</p>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between items-center mt-6">
                  {featuredProducts.map((product, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`px-3 py-1 ${
                        index === activeProductIndex
                          ? "bg-emerald-600/10 text-emerald-600 dark:text-teal-400"
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

        {/* Kitchen Tips Section */}
        <section className="py-20 bg-emerald-50/50 dark:bg-emerald-950/10">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-3 px-3 py-1 bg-emerald-600/10 text-emerald-600 dark:text-teal-400 rounded-full">
                Expert Advice
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Kitchen Design Tips
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Professional insights to create a functional and beautiful kitchen space
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {kitchenTips.map((tip, index) => (
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
              <Badge className="mb-3 px-3 py-1 bg-emerald-600/10 text-emerald-600 dark:text-teal-400 rounded-full">
                Styles
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Kitchen Collections
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our curated kitchen styles for every home
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
                    href={`/category/decoration/kitchen/collections/${collection.id}`}
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
              <Badge className="mb-3 px-3 py-1 bg-emerald-600/10 text-emerald-600 dark:text-teal-400 rounded-full">
                Shop
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Kitchen Products
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Premium tools and accessories for your culinary journey
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
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : ""
                  }
                >
                  All
                </Button>
                <Button
                  variant={activeFilter === "cookware" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("cookware")}
                  className={
                    activeFilter === "cookware"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : ""
                  }
                >
                  Cookware
                </Button>
                <Button
                  variant={activeFilter === "appliances" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("appliances")}
                  className={
                    activeFilter === "appliances"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : ""
                  }
                >
                  Appliances
                </Button>
                <Button
                  variant={activeFilter === "utensils" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("utensils")}
                  className={
                    activeFilter === "utensils"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : ""
                  }
                >
                  Utensils
                </Button>
                <Button
                  variant={activeFilter === "organization" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("organization")}
                  className={
                    activeFilter === "organization"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : ""
                  }
                >
                  Organization
                </Button>
                <Button
                  variant={activeFilter === "dinnerware" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("dinnerware")}
                  className={
                    activeFilter === "dinnerware"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : ""
                  }
                >
                  Dinnerware
                </Button>
                <Button
                  variant={activeFilter === "textiles" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("textiles")}
                  className={
                    activeFilter === "textiles"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : ""
                  }
                >
                  Textiles
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
                              <Badge className="bg-emerald-600 text-white px-2 py-1 text-xs">
                                {product.tag}
                              </Badge>
                            </div>
                          )}

                          {/* Quick action buttons */}
                          <div className="absolute right-4 bottom-4 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                            <Button
                              size="icon"
                              className="h-9 w-9 rounded-full bg-white text-emerald-600 hover:bg-white/90 shadow-lg"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              className="h-9 w-9 rounded-full bg-white text-emerald-600 hover:bg-white/90 shadow-lg"
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
                            price={product.price}
                            originalPrice={product.originalPrice}
                            size="sm"
                            onAddToCart={async () => {
                              // Add your cart logic here
                              await new Promise((resolve) =>
                                setTimeout(resolve, 1000)
                              );
                            }}
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
                className="rounded-full border-emerald-600/20 text-emerald-600 hover:bg-emerald-600/10 px-8"
              >
                View All Products
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Cooking Workshop CTA */}
        <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 relative overflow-hidden">
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
                Interactive Experience
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Join Our Cooking Workshops
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
                Learn from professional chefs, elevate your culinary skills, and experience our premium kitchen products firsthand.
              </p>
              <Button
                size="lg"
                className="rounded-full bg-white text-emerald-700 hover:bg-white/90 group px-8 py-6 text-lg shadow-lg shadow-emerald-800/20"
              >
                Register for Workshop
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