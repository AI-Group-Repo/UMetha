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
  Home,
  ArrowRight,
  Sofa,
  Star,
  Heart,
  Eye,
  PanelTop,
  Palmtree,
  Sun,
  Moon,
  Sparkles,
  ChevronRight,
  Tag,
  BedDouble,
  Armchair,
  Bath,
  Coffee,
  Palette,
  Lamp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/main-layout";
import PriceCartButton from "@/components/ui/price-cart-button";

export default function DecorationPage() {
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
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=174",
    "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1742",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1632",
  ];

  // Featured collections with modern interior images
  const collections = [
    {
      id: 1,
      name: "Living Room",
      description: "Create your perfect gathering space",
      image:
        "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1600",
      icon: <Sofa className="h-5 w-5" />,
      items: 124,
      color: "from-amber-600/60 to-orange-600/40",
    },
    {
      id: 2,
      name: "Bedroom",
      description: "Design your sanctuary",
      image:
        "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1600",
      icon: <BedDouble className="h-5 w-5" />,
      items: 98,
      color: "from-blue-600/60 to-indigo-600/40",
    },
    {
      id: 3,
      name: "Kitchen",
      description: "Modern culinary spaces",
      image:
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1600",
      icon: <Coffee className="h-5 w-5" />,
      items: 156,
      color: "from-emerald-600/60 to-green-600/40",
    },
    {
      id: 4,
      name: "Bathroom",
      description: "Spa-like relaxation",
      image:
        "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1600",
      icon: <Bath className="h-5 w-5" />,
      items: 87,
      color: "from-violet-600/60 to-purple-600/40",
    },
  ];

  // Trending items showcase
  const trendingItems = [
    {
      id: 1,
      name: "Modern Velvet Sofa",
      price: 1299.99,
      originalPrice: 1599.99,
      image:
        "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=1600",
      tag: "Best Seller",
      rating: 4.9,
      reviews: 128,
      category: "Seating",
    },
    {
      id: 2,
      name: "Artisan Coffee Table",
      price: 449.99,
      originalPrice: 599.99,
      image:
        "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1600",
      tag: "New Arrival",
      rating: 4.8,
      reviews: 96,
      category: "Tables",
    },
    {
      id: 3,
      name: "Designer Floor Lamp",
      price: 299.99,
      originalPrice: 399.99,
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1600",
      tag: "Trending",
      rating: 4.7,
      reviews: 156,
      category: "Lighting",
    },
    {
      id: 4,
      name: "Minimalist Bookshelf",
      price: 799.99,
      originalPrice: 999.99,
      image:
        "https://images.unsplash.com/photo-1594620302200-e7cac4a29634?q=80&w=1600",
      tag: "Premium",
      rating: 4.9,
      reviews: 87,
      category: "Storage",
    },
  ];

  return (
    <MainLayout hideFittingRoom>
      <div ref={containerRef} className="min-h-screen bg-background">
        {/* Enhanced Hero Section - KEPT THE SAME */}
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
                      Elevate Your
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
                      Explore Collection
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
                      View Lookbook
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
                        alt={`Interior design ${index + 1}`}
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

        {/* Categories Grid */}
        <section className="py-20 bg-gradient-to-b from-background to-background/95">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-3 px-3 py-1 bg-amber-600/10 text-amber-600 rounded-full">
                Spaces
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Design By Room
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our curated collections for every space in your home
              </p>
            </motion.div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {collections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={`/category/decoration/${collection.name.toLowerCase()}`}
                  >
                    <div className="group relative h-[400px] rounded-2xl overflow-hidden">
                      <Image
                        src={collection.image}
                        alt={collection.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <div className="flex items-center gap-2 mb-2">
                          {collection.icon}
                          <h3 className="text-2xl font-bold text-white">
                            {collection.name}
                          </h3>
                        </div>
                        <p className="text-white/90 mb-4">
                          {collection.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">
                            {collection.items} items
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                          >
                            Explore
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

        {/* Trending Items */}
        <section className="py-20 bg-amber-50/50 dark:bg-amber-950/10">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-3 px-3 py-1 bg-amber-600/10 text-amber-600 rounded-full">
                Featured
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Trending Now
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our most popular pieces that define modern living
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Quick action buttons */}
                      <div className="absolute right-4 bottom-4 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        <Button
                          size="icon"
                          className="h-10 w-10 rounded-full bg-white text-amber-600 hover:bg-white/90 shadow-lg"
                        >
                          <Heart className="h-5 w-5" />
                        </Button>
                        <Button
                          size="icon"
                          className="h-10 w-10 rounded-full bg-white text-amber-600 hover:bg-white/90 shadow-lg"
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        {item.name}
                      </h3>

                      {/* Replace the old price and cart button with PriceCartButton */}
                      <PriceCartButton
                        price={item.price}
                        originalPrice={item.originalPrice}
                       
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
    </MainLayout>
  );
}
