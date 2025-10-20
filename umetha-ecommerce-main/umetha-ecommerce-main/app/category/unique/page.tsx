"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Tag,
  Star,
  Heart,
  Eye,
  ShoppingCart,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Crown,
  Gift,
  Flame,
  Clock,
  Gem,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/main-layout";
import PriceCartButton from "@/components/ui/price-cart-button";

export default function UniqueProductsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  // Featured unique products
  const uniqueProducts = [
    {
      id: 1,
      name: "Holographic Statement Bag",
      price: 259.99,
      originalPrice: 329.99,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
      tag: "Limited Edition",
      category: "accessories",
      tagColor: "from-purple-600 to-blue-400",
      stock: 7,
      description: "Futuristic holographic finish with adjustable chain strap",
      isNew: true,
    },
    {
      id: 2,
      name: "Smart Thermal Jacket",
      price: 499.99,
      originalPrice: 649.99,
      image:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
      tag: "Smart Tech",
      category: "clothing",
      tagColor: "from-emerald-600 to-green-400",
      stock: 12,
      description:
        "Temperature-regulating fabric with touch-sensitive controls",
      isNew: true,
    },
    {
      id: 3,
      name: "Transformable Modular Shoes",
      price: 179.99,
      originalPrice: 229.99,
      image:
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
      tag: "Exclusive",
      category: "footwear",
      tagColor: "from-orange-600 to-amber-400",
      stock: 5,
      description: "Detachable components for multiple style configurations",
      isNew: false,
    },
    {
      id: 4,
      name: "AR Fashion Glasses",
      price: 349.99,
      originalPrice: 399.99,
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
      tag: "Innovation",
      category: "accessories",
      tagColor: "from-indigo-600 to-violet-400",
      stock: 9,
      description: "Augmented reality display with fashion-forward design",
      isNew: true,
    },
    {
      id: 5,
      name: "Bioluminescent Evening Dress",
      price: 899.99,
      originalPrice: 1199.99,
      image:
        "https://images.unsplash.com/photo-1571908599407-cdb918ed83bf?w=800",
      tag: "Runway Collection",
      category: "clothing",
      tagColor: "from-teal-600 to-cyan-400",
      stock: 3,
      description: "Sustainable fabric with subtle light-emitting properties",
      isNew: false,
    },
    {
      id: 6,
      name: "3D-Printed Custom Boots",
      price: 449.99,
      originalPrice: 599.99,
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800",
      tag: "Made To Order",
      category: "footwear",
      tagColor: "from-rose-600 to-pink-400",
      stock: 8,
      description: "Personalized fit with biodegradable advanced materials",
      isNew: true,
    },
    {
      id: 7,
      name: "Mood-Sensing Bracelet",
      price: 129.99,
      originalPrice: 159.99,
      image:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800",
      tag: "Wellness Tech",
      category: "accessories",
      tagColor: "from-blue-600 to-sky-400",
      stock: 15,
      description: "Color-changing elements that respond to emotional states",
      isNew: false,
    },
    {
      id: 8,
      name: "Zero-Gravity Loungewear",
      price: 219.99,
      originalPrice: 279.99,
      image:
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800",
      tag: "Space Age",
      category: "clothing",
      tagColor: "from-gray-600 to-slate-400",
      stock: 6,
      description: "Weightless feel with pressure-point comfort technology",
      isNew: true,
    },
  ];

  const categories = [
    { id: "all", name: "All Products", icon: <Sparkles className="h-4 w-4" /> },
    { id: "clothing", name: "Clothing", icon: <Tag className="h-4 w-4" /> },
    {
      id: "footwear",
      name: "Footwear",
      icon: <ChevronRight className="h-4 w-4" />,
    },
    {
      id: "accessories",
      name: "Accessories",
      icon: <Gem className="h-4 w-4" />,
    },
  ];

   // Hero section images
   const heroImages = [
    "/limited3.jpeg",
    "/limited2.jpeg",
    "/limited1.jpeg",
  ];
  const filteredProducts =
    activeCategory === "all"
      ? uniqueProducts
      : uniqueProducts.filter((product) => product.category === activeCategory);

  return (
    <MainLayout hideFittingRoom hideRoomVisualizer>
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
                      className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-400"
                    >
                      Discover
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="block"
                    >
                      The Exclusive
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
                      className="rounded-full bg-purple-600 hover:bg-purple-700 group flex items-center gap-2 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 transition-all duration-300"
                    >
                      Discover Collection
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
                      className="rounded-full border-purple-600/20 text-purple-600 hover:bg-purple-600/10 group"
                    >
                      Limited Editions
                      <Crown className="ml-2 h-4 w-4" />
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
                        alt={`unique banner image ${index + 1}`}
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
        {/* Product Category Filter */}
        <section className="py-10">
          <div className="container">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${
                    activeCategory === category.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800"
                  }`}
                >
                  {category.icon}
                  <span className="font-medium">{category.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Unique Products Grid */}
        <section className="py-10">
          <div className="container">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                    whileHover={{ y: -5 }}
                  >
                    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                      <div
                        className="relative aspect-square overflow-hidden"
                        onMouseEnter={() => setHoveredProduct(product.id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        

                        {/* Stock indicator for limited items */}
                        {product.stock < 10 && (
                          <div className="absolute left-4 bottom-4 z-10">
                            <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm">
                              <Flame className="h-3.5 w-3.5 text-orange-500" />
                              <span>Only {product.stock} left</span>
                            </div>
                          </div>
                        )}

                        {/* New indicator */}
                        {product.isNew && (
                          <div className="absolute right-4 top-4 z-10">
                            <motion.div
                              className="bg-emerald-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <span className="text-xs font-bold">NEW</span>
                            </motion.div>
                          </div>
                        )}

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

                        {/* View details overlay on hover */}
                        <AnimatePresence>
                          {hoveredProduct === product.id && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                            >
                              <Button className="bg-white text-white hover:bg-white/90">
                                View Details
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="p-6">
                        <h3 className="text-lg font-semibold mb-1">
                          {product.name}
                        </h3>                        

                        <PriceCartButton
                          price={product.price}
                          originalPrice={product.originalPrice}
                         
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

        {/* Feature Banner */}
        <section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: <Gift className="h-8 w-8 text-indigo-500" />,
                  title: "Limited Editions",
                  description:
                    "Handcrafted pieces available in small quantities, ensuring exclusivity and uniqueness.",
                },
                {
                  icon: <Flame className="h-8 w-8 text-indigo-500" />,
                  title: "Innovation First",
                  description:
                    "Cutting-edge designs that integrate technology and sustainable materials.",
                },
                {
                  icon: <Clock className="h-8 w-8 text-indigo-500" />,
                  title: "Fast Global Delivery",
                  description:
                    "Premium shipping options to get your unique treasures to you wherever you are.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all"
                >
                  <div className="bg-indigo-100 dark:bg-indigo-900/50 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 dark:from-indigo-900/30 dark:to-purple-900/30">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <Badge className="mb-4 px-3 py-1 bg-purple-600/10 text-purple-600 rounded-full">
                Don't Miss Out
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Join Our Exclusive Preview List
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Be the first to know about new arrivals, limited editions, and
                secret drops before they're gone forever.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-full border border-indigo-200 dark:border-indigo-800/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                >
                  Subscribe
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
