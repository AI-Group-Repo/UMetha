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
  Sun,
  Sofa,
  Maximize2,
  Lamp,
  Coffee,
  Palmtree,
  Tag,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/main-layout";
import PriceCartButton from "@/components/ui/price-cart-button";

export default function LivingRoomPage() {
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
      name: "Meridian Cloud Modular Sofa",
      price: 1999.99,
      originalPrice: 2499.99,
      rating: 4.9,
      reviews: 127,
      images: [
        "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800",
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
      ],
      description: "Ultra-comfortable modular design with premium upholstery",
      colors: ["#F5F5F5", "#212121", "#D4A373", "#4A5859"],
      tag: "Best Seller",
    },
    {
      id: 2,
      name: "Nordic Accent Lounge Chair",
      price: 749.99,
      originalPrice: 899.99,
      rating: 4.8,
      reviews: 86,
      images: [
        "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800",
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800",
      ],
      description: "Scandinavian-inspired design with ergonomic comfort",
      colors: ["#E0E0E0", "#263238", "#FFF3E0"],
      tag: "New Arrival",
    },
    {
      id: 3,
      name: "Artisan Coffee Table",
      price: 549.99,
      originalPrice: 699.99,
      rating: 4.7,
      reviews: 94,
      images: [
        "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800",
        "https://images.unsplash.com/photo-1565191999001-550f0e5b29cf?w=800",
      ],
      description: "Solid wood construction with premium craftsmanship",
      colors: ["#A67C52", "#5D4037", "#D7CCC8"],
      tag: "Limited Edition",
    },
  ];

  // Living room collections
  const collections = [
    {
      id: "minimalist",
      name: "Minimalist",
      description: "Clean lines and uncluttered spaces",
      image:
        "https://images.unsplash.com/photo-1519642918688-7e43b19245d8?w=800",
      color: "from-slate-600/50 to-slate-800/40",
    },
    {
      id: "scandi",
      name: "Scandinavian",
      description: "Warm functionality with natural elements",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800",
      color: "from-amber-600/50 to-amber-800/40",
    },
    {
      id: "modern",
      name: "Modern Luxury",
      description: "Bold statements with premium materials",
      image:
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      color: "from-indigo-600/50 to-violet-800/40",
    },
    {
      id: "bohemian",
      name: "Bohemian",
      description: "Eclectic patterns and artistic expression",
      image:
        "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=800",
      color: "from-rose-600/50 to-pink-800/40",
    },
  ];

  // Living room products
  const products = [
    {
      id: 1,
      name: "Modern Velvet Sofa",
      price: 1299.99,
      originalPrice: 1599.99,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
      rating: 4.9,
      reviews: 128,
      category: "Seating",
      tag: "Best Seller",
      filter: ["seating", "all"],
    },
    {
      id: 2,
      name: "Artisan Coffee Table",
      price: 449.99,
      originalPrice: 599.99,
      image:
        "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800",
      rating: 4.8,
      reviews: 96,
      category: "Tables",
      tag: "New Arrival",
      filter: ["tables", "all"],
    },
    {
      id: 3,
      name: "Designer Floor Lamp",
      price: 299.99,
      originalPrice: 399.99,
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
      rating: 4.7,
      reviews: 156,
      category: "Lighting",
      tag: "Trending",
      filter: ["lighting", "all"],
    },
    {
      id: 4,
      name: "Minimalist Bookshelf",
      price: 799.99,
      originalPrice: 999.99,
      image:
        "https://images.unsplash.com/photo-1594620302200-e7cac4a29634?w=800",
      rating: 4.9,
      reviews: 87,
      category: "Storage",
      tag: "Premium",
      filter: ["storage", "all"],
    },
    {
      id: 5,
      name: "Plush Area Rug",
      price: 349.99,
      originalPrice: 449.99,
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      rating: 4.6,
      reviews: 103,
      category: "Textiles",
      tag: "Editor's Choice",
      filter: ["textiles", "all"],
    },
    {
      id: 6,
      name: "Accent Armchair",
      price: 649.99,
      originalPrice: 799.99,
      image:
        "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800",
      rating: 4.8,
      reviews: 74,
      category: "Seating",
      tag: "Luxury",
      filter: ["seating", "all"],
    },
    {
      id: 7,
      name: "Wall Art Collection",
      price: 249.99,
      originalPrice: 349.99,
      image:
        "https://images.unsplash.com/photo-1571937767435-749e8c957aa8?w=800",
      rating: 4.7,
      reviews: 62,
      category: "Decor",
      tag: "Featured",
      filter: ["decor", "all"],
    },
    {
      id: 8,
      name: "Console Table",
      price: 529.99,
      originalPrice: 649.99,
      image:
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800",
      rating: 4.5,
      reviews: 48,
      category: "Tables",
      tag: "New Arrival",
      filter: ["tables", "all"],
    },
  ];

  // Hero section design inspiration images
  const inspirationImages = [
    "https://images.unsplash.com/photo-1618219740975-d40978bb7378?w=800",
    "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800",
  ];

  // Design tips
  const designTips = [
    {
      id: 1,
      title: "Layer Your Lighting",
      description:
        "Combine ambient, task, and accent lighting for depth and functionality.",
      icon: <Lamp className="h-5 w-5" />,
      color: "bg-amber-500",
    },
    {
      id: 2,
      title: "Rule of Threes",
      description:
        "Group decor items in threes for a visually pleasing arrangement.",
      icon: <Maximize2 className="h-5 w-5" />,
      color: "bg-indigo-500",
    },
    {
      id: 3,
      title: "Natural Elements",
      description:
        "Incorporate plants and natural materials to bring life to your space.",
      icon: <Palmtree className="h-5 w-5" />,
      color: "bg-emerald-500",
    },
    {
      id: 4,
      title: "Focal Point",
      description:
        "Create a statement piece that draws attention and anchors the room.",
      icon: <Eye className="h-5 w-5" />,
      color: "bg-violet-500",
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
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-indigo-600/5 dark:to-violet-600/10 z-10" />

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
                  <Badge className="relative z-10 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg shadow-indigo-600/20">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 rounded-full bg-indigo-400/20 blur-xl"
                    />
                    <Sparkles className="h-3.5 w-3.5 mr-2" />
                    Living Room Collection 2025
                  </Badge>
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

                  <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-8">
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600"
                    >
                      Transform Your
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="block"
                    >
                      Living Space
                    </motion.span>
                  </h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="text-lg text-muted-foreground mb-8 max-w-md"
                  >
                    Discover premium furniture and accessories that blend style,
                    comfort, and functionality for the heart of your home.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Button
                      size="lg"
                      className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 group flex items-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-300"
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
                      className="rounded-full border-indigo-600/20 text-indigo-600 dark:text-violet-400 hover:bg-indigo-600/10 group"
                    >
                      Design Inspiration
                      <Star className="ml-2 h-4 w-4" />
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
                        alt={`Living room design ${index + 1}`}
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
                    className="absolute -left-8 top-1/4 bg-indigo-600/90 text-white p-4 rounded-xl shadow-lg backdrop-blur-sm"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sofa className="h-6 w-6 mb-2" />
                    <p className="text-sm font-medium">Premium Comfort</p>
                  </motion.div>

                  <motion.div
                    className="absolute right-8 bottom-1/4 bg-violet-600/90 text-white p-4 rounded-xl shadow-lg backdrop-blur-sm"
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Sun className="h-6 w-6 mb-2" />
                    <p className="text-sm font-medium">Perfect Ambiance</p>
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
              <Badge className="mb-3 px-3 py-1 bg-indigo-600/10 text-indigo-600 dark:text-violet-400 rounded-full">
                Featured
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Statement Pieces
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Anchor your living space with these designer-curated focal
                points
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
                    <Badge className="bg-indigo-600 text-white px-3 py-1.5 rounded-full text-sm">
                      {featuredProducts[activeProductIndex].tag}
                    </Badge>
                  </div>

                  {/* Quick action buttons */}
                  <div className="absolute right-4 bottom-4 flex flex-col gap-2">
                    <Button
                      size="icon"
                      className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm text-indigo-600 hover:bg-white/100 shadow-lg"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm text-indigo-600 hover:bg-white/100 shadow-lg"
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
                            ? "ring-2 ring-indigo-600 dark:ring-violet-500"
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
                    <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
                    <TabsTrigger value="delivery">Delivery</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="details"
                    className="text-sm text-muted-foreground space-y-2 pt-4"
                  >
                    <p>• Premium upholstery with stain-resistant fabric</p>
                    <p>• Engineered hardwood frame for durability</p>
                    <p>• High-resilience foam cushions for lasting comfort</p>
                    <p>• Modular design allows for custom configurations</p>
                  </TabsContent>
                  <TabsContent
                    value="dimensions"
                    className="text-sm text-muted-foreground space-y-2 pt-4"
                  >
                    <p>• Width: 96" (244 cm)</p>
                    <p>• Depth: 38" (97 cm)</p>
                    <p>• Height: 34" (86 cm)</p>
                    <p>• Seat Height: 18" (46 cm)</p>
                  </TabsContent>
                  <TabsContent
                    value="delivery"
                    className="text-sm text-muted-foreground space-y-2 pt-4"
                  >
                    <p>• Free white-glove delivery service</p>
                    <p>• Estimated delivery: 2-3 weeks</p>
                    <p>• Professional assembly included</p>
                    <p>• 30-day returns policy</p>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between items-center mt-6">
                  {featuredProducts.map((product, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`px-3 py-1 ${
                        index === activeProductIndex
                          ? "bg-indigo-600/10 text-indigo-600 dark:text-violet-400"
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
        <section className="py-20 bg-indigo-50/50 dark:bg-indigo-950/10">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-3 px-3 py-1 bg-indigo-600/10 text-indigo-600 dark:text-violet-400 rounded-full">
                Expert Advice
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Design Tips & Tricks
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Professional insights to elevate your living room aesthetic
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
              <Badge className="mb-3 px-3 py-1 bg-indigo-600/10 text-indigo-600 dark:text-violet-400 rounded-full">
                Styles
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Curated Collections
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our designer-curated living room styles
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
                    href={`/category/decoration/livingroom/collections/${collection.id}`}
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
              <Badge className="mb-3 px-3 py-1 bg-indigo-600/10 text-indigo-600 dark:text-violet-400 rounded-full">
                Shop
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Living Room Essentials
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Complete your space with our premium furniture collection
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
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : ""
                  }
                >
                  All
                </Button>
                <Button
                  variant={activeFilter === "seating" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("seating")}
                  className={
                    activeFilter === "seating"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : ""
                  }
                >
                  Seating
                </Button>
                <Button
                  variant={activeFilter === "tables" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("tables")}
                  className={
                    activeFilter === "tables"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : ""
                  }
                >
                  Tables
                </Button>
                <Button
                  variant={activeFilter === "storage" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("storage")}
                  className={
                    activeFilter === "storage"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : ""
                  }
                >
                  Storage
                </Button>
                <Button
                  variant={activeFilter === "lighting" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("lighting")}
                  className={
                    activeFilter === "lighting"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : ""
                  }
                >
                  Lighting
                </Button>
                <Button
                  variant={activeFilter === "textiles" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("textiles")}
                  className={
                    activeFilter === "textiles"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : ""
                  }
                >
                  Textiles
                </Button>
                <Button
                  variant={activeFilter === "decor" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("decor")}
                  className={
                    activeFilter === "decor"
                      ? "bg-indigo-600 hover:bg-indigo-700"
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
                              <Badge className="bg-indigo-600 text-white px-2 py-1 text-xs">
                                {product.tag}
                              </Badge>
                            </div>
                          )}

                          {/* Quick action buttons */}
                          <div className="absolute right-4 bottom-4 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                            <Button
                              size="icon"
                              className="h-9 w-9 rounded-full bg-white text-indigo-600 hover:bg-white/90 shadow-lg"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              className="h-9 w-9 rounded-full bg-white text-indigo-600 hover:bg-white/90 shadow-lg"
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
                className="rounded-full border-indigo-600/20 text-indigo-600 hover:bg-indigo-600/10 px-8"
              >
                View All Products
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Virtual Room Designer CTA */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-violet-600 relative overflow-hidden">
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
                Design Your Living Room in 3D
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
                Try our virtual room designer to visualize how our furniture
                will look in your space before you buy.
              </p>
              <Button
                size="lg"
                className="rounded-full bg-white text-indigo-700 hover:bg-white/90 group px-8 py-6 text-lg shadow-lg shadow-indigo-800/20"
              >
                Try Our 3D Room Designer
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
