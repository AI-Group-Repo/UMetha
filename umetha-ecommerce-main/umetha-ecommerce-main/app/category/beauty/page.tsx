"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  useScroll,
  useTransform,
  motion,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link"; // Fix: Remove curly braces
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  Star,
  ArrowLeft,
  Heart,
  Droplet,
  Leaf,
  Sparkle,
  Gift,
  Zap,
  Layers,
  Brush,
  Palette,
  ShoppingBag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MainLayout from "@/components/main-layout";
import PriceCartButton from "@/components/ui/price-cart-button";

// Add this after your existing imports
const beautyBenefits = [
  {
    title: "Clean Ingredients",
    description:
      "Ethically sourced, natural ingredients that work in harmony with your skin",
    icon: <Leaf className="h-6 w-6 text-emerald-500" />,
    color: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    title: "Dermatologist Tested",
    description: "Clinically proven formulas that deliver real results",
    icon: <Sparkles className="h-6 w-6 text-blue-500" />,
    color: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "Sustainable Beauty",
    description:
      "Eco-friendly packaging and cruelty-free manufacturing processes",
    icon: <Droplet className="h-6 w-6 text-purple-500" />,
    color: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    title: "Advanced Science",
    description: "Innovative formulations backed by cutting-edge research",
    icon: <Zap className="h-6 w-6 text-rose-500" />,
    color: "bg-rose-50 dark:bg-rose-900/20",
  },
];

export default function BeautyPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax effect for hero section
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // State for featured collection slideshow
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Add these state variables at the top of your component
  const [selectedSkincareCategory, setSelectedSkincareCategory] =
    useState("All");
  const [selectedMakeupCategory, setSelectedMakeupCategory] = useState("All");

  // Featured collections with beauty images
  const featuredCollections = [
    {
      id: 1,
      title: "Luminous Radiance",
      subtitle: "Discover skin-transforming essentials",
      image:
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
      badge: "New Collection",
    },
    {
      id: 2,
      title: "Bold Expression",
      subtitle: "Makeup that speaks volumes",
      image:
        "https://images.unsplash.com/photo-1631730358747-500d5cdb3175?w=800",
      badge: "Trending Now",
    },
    {
      id: 3,
      title: "Natural Glow",
      subtitle: "Clean beauty for mindful consumers",
      image:
        "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800",
      badge: "Organic",
    },
  ];

  // Autoplay for slideshow
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) =>
        prev === featuredCollections.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, featuredCollections.length]);

  // Add these category definitions
  const skincareCategories = {
    All: "All Products",
    Cleansers: "Facial Cleansers",
    Serums: "Treatment Serums",
    Moisturizers: "Face Moisturizers",
    Treatments: "Special Treatments",
    Masks: "Face Masks",
    Toners: "Toners & Essences",
    "Eye Care": "Eye Products",
  };

  const makeupCategories = {
    All: "All Products",
    Face: "Face Makeup",
    Eyes: "Eye Makeup",
    Lips: "Lip Products",
    Cheeks: "Blush & Bronzer",
    Brushes: "Makeup Tools",
    Sets: "Makeup Sets",
    Palettes: "Eye Palettes",
  };

  // Beauty categories with dynamic content
  const beautyCategories = [
    {
      name: "Skincare",
      image:
        "https://images.unsplash.com/photo-1570554886111-e80fcca6f841?w=800",
      categories: ["Cleansers", "Serums", "Moisturizers", "Treatments"],
      featured: "Self-Care Essentials",
      discount: "Up to 30% Off",
      color: "from-rose-600/60 to-pink-600/40",
      link: "/category/beauty/skincare",
      icon: <Droplet className="h-5 w-5" />,
    },
    {
      name: "Makeup",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
      categories: ["Face", "Eyes", "Lips", "Sets"],
      featured: "Express Your Uniqueness",
      discount: "Up to 25% Off",
      color: "from-violet-600/60 to-purple-600/40",
      link: "/category/beauty/makeup",
      icon: <Brush className="h-5 w-5" />,
    },
  ];

  // Trending beauty items
  const trendingItems = [
    {
      id: 1,
      name: "Hydrating Serum",
      price: 79.99,
      originalPrice: 99.99,
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
      tag: "Best Seller",
      benefits: ["Hydrating", "Anti-aging", "Brightening"],
    },
    {
      id: 2,
      name: "Matte Lip Collection",
      price: 45.99,
      originalPrice: 59.99,
      image:
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800",
      tag: "Limited Edition",
      benefits: ["Long-lasting", "Vegan", "Vibrant"],
    },
    {
      id: 3,
      name: "Overnight Repair Mask",
      price: 55.99,
      originalPrice: 69.99,
      image:
        "https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=800",
      tag: "New Arrival",
      benefits: ["Restorative", "Soothing", "Nourishing"],
    },
    {
      id: 4,
      name: "Vitamin C Brightener",
      price: 65.99,
      originalPrice: 79.99,
      image:
        "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800",
      tag: "Editor's Choice",
      benefits: ["Antioxidant", "Radiance", "Even tone"],
    },
  ];

  const beautyProducts = {
    skincare: [
      {
        id: "sk-1",
        name: "Gentle Foam Cleanser",
        price: 34.99,
        image:
          "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800",
        category: "Cleansers",
        benefits: ["Gentle", "pH Balanced", "Hydrating"],
      },
      {
        id: "sk-2",
        name: "Purifying Clay Cleanser",
        price: 39.99,
        image:
          "https://images.unsplash.com/photo-1601612628452-9e99ced43524?w=800",
        category: "Cleansers",
        benefits: ["Deep Cleansing", "Pore Refining", "Oil Control"],
      },
      {
        id: "sk-3",
        name: "Vitamin C Brightening Serum",
        price: 79.99,
        image:
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
        category: "Serums",
        benefits: ["Brightening", "Antioxidant", "Anti-aging"],
      },
      {
        id: "sk-4",
        name: "Hyaluronic Acid Serum",
        price: 64.99,
        image:
          "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800",
        category: "Serums",
        benefits: ["Hydrating", "Plumping", "Anti-wrinkle"],
      },
      {
        id: "sk-5",
        name: "Daily Glow Moisturizer",
        price: 54.99,
        image:
          "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=800",
        category: "Moisturizers",
        benefits: ["Lightweight", "All-day Hydration", "Radiant"],
      },
      {
        id: "sk-6",
        name: "Brightening Face Mask",
        price: 69.99,
        image:
          "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800",
        category: "Treatments",
        benefits: ["Radiance", "Even Tone", "Hydrating"],
      },
      {
        id: "sk-7",
        name: "Retinol Night Treatment",
        price: 89.99,
        image:
          "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800",
        category: "Treatments",
        benefits: ["Anti-aging", "Cell Renewal", "Texture Improvement"],
      },
      {
        id: "sk-8",
        name: "AHA/BHA Exfoliating Solution",
        price: 49.99,
        image:
          "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800",
        category: "Treatments",
        benefits: ["Exfoliating", "Pore Clearing", "Brightening"],
      },
    ],
    makeup: [
      {
        id: "mk-1",
        name: "Skin Perfecting Foundation",
        price: 49.99,
        image:
          "https://images.unsplash.com/photo-1631214540553-ff044a3ff1d4?w=800",
        category: "Face",
        benefits: ["Buildable Coverage", "Natural Finish", "Long-wearing"],
        rating: 4.8,
        reviews: 567,
      },
      {
        id: "mk-2",
        name: "Dewy Highlighter",
        price: 39.99,
        image:
          "https://images.unsplash.com/photo-1571646034647-52e6ea84b28c?w=800",
        category: "Face",
        benefits: ["Luminous", "Blendable", "Multi-dimensional"],
        rating: 4.7,
        reviews: 345,
      },
      {
        id: "mk-3",
        name: "Luxury Eyeshadow Palette",
        price: 59.99,
        image:
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800",
        category: "Eyes",
        benefits: ["High Pigment", "Blendable", "Long-lasting"],
        rating: 4.9,
        reviews: 789,
      },
      {
        id: "mk-4",
        name: "Volumizing Mascara",
        price: 29.99,
        image:
          "https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?w=800",
        category: "Eyes",
        benefits: ["Volume", "Length", "Smudge-proof"],
        rating: 4.8,
        reviews: 654,
      },
      {
        id: "mk-5",
        name: "Velvet Matte Lipstick",
        price: 34.99,
        image:
          "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800",
        category: "Lips",
        benefits: ["Matte Finish", "Long-wearing", "Comfortable"],
        rating: 4.7,
        reviews: 432,
      },
      {
        id: "mk-6",
        name: "Hydrating Lip Gloss",
        price: 24.99,
        image:
          "https://images.unsplash.com/photo-1664574263343-c5466d65ba66?w=800",
        category: "Lips",
        benefits: ["High Shine", "Hydrating", "Non-sticky"],
        rating: 4.6,
        reviews: 321,
      },
      {
        id: "mk-7",
        name: "Soft Blur Blush",
        price: 32.99,
        image:
          "https://images.unsplash.com/photo-1643185694410-3d6568600c6e?w=800",
        category: "Cheeks",
        benefits: ["Buildable", "Natural Flush", "Silky Texture"],
        rating: 4.8,
        reviews: 234,
      },
      {
        id: "mk-8",
        name: "Bronzing Powder",
        price: 44.99,
        image:
          "https://images.unsplash.com/photo-1643185694410-3d6568600c6e?w=800",
        category: "Cheeks",
        benefits: ["Sun-kissed Glow", "Buildable", "Natural"],
        rating: 4.7,
        reviews: 198,
      },
    ],
  };

  // Add category filters at the top of the product grid
  const skincareCategoriesList = [
    "All",
    "Cleansers",
    "Serums",
    "Moisturizers",
    "Treatments",
  ];
  const makeupCategoriesList = ["All", "Face", "Eyes", "Lips", "Cheeks"];

  return (
    <MainLayout hideFittingRoom={true} hideRoomVisualizer={true}>
      <div ref={containerRef} className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative h-[90vh] overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10 z-0"></div>
          <div className="absolute inset-0 z-0 opacity-5">
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-primary/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-primary/10 to-transparent"></div>
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-primary/10 to-transparent"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-primary/10 to-transparent"></div>
          </div>

          {/* Floating circles background */}
          <div className="absolute inset-0 overflow-hidden z-0">
            <motion.div
              className="absolute h-40 w-40 rounded-full bg-rose-200 dark:bg-rose-900/30 blur-3xl opacity-30"
              animate={{
                x: [0, 30, 0, -30, 0],
                y: [0, -30, 0, 30, 0],
              }}
              transition={{ duration: 15, repeat: Infinity }}
              style={{ top: "20%", left: "10%" }}
            />
            <motion.div
              className="absolute h-60 w-60 rounded-full bg-purple-200 dark:bg-purple-900/30 blur-3xl opacity-20"
              animate={{
                x: [0, -40, 0, 40, 0],
                y: [0, 40, 0, -40, 0],
              }}
              transition={{ duration: 18, repeat: Infinity }}
              style={{ bottom: "10%", right: "15%" }}
            />
            <motion.div
              className="absolute h-32 w-32 rounded-full bg-pink-200 dark:bg-pink-900/30 blur-3xl opacity-25"
              animate={{
                x: [0, 20, 0, -20, 0],
                y: [0, 20, 0, -20, 0],
              }}
              transition={{ duration: 12, repeat: Infinity }}
              style={{ top: "40%", right: "30%" }}
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
                <Badge className="bg-primary text-white px-4 py-2 rounded-full text-base font-medium shadow-lg shadow-primary/20">
                  <Sparkles className="h-4 w-4 mr-2" />
                  2025 Beauty Collection
                </Badge>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-primary/10 blur-2xl"></div>
                <div className="absolute -right-6 -bottom-6 h-16 w-16 rounded-full bg-primary/20 blur-xl"></div>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium leading-tight mb-8 relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 font-bold">
                    Radiate
                  </span>{" "}
                  Your
                  <br />
                  <span className="relative inline-block">
                    True Beauty
                    <div className="absolute -bottom-3 left-0 w-full h-2 bg-primary/20 rounded-full"></div>
                  </span>
                </h1>
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Link href="/category/beauty/skincare">
                  <Button
                    size="lg"
                    className="rounded-full bg-primary hover:bg-primary/90 group flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 text-base font-medium h-14 px-8"
                  >
                    Shop Skincare
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/category/beauty/makeup">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-primary/30 text-primary hover:bg-primary/10 flex items-center gap-2 hover:border-primary transition-all duration-300 transform hover:-translate-y-1 text-base font-medium h-14 px-8"
                  >
                    Shop Makeup
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>

              {/* Trust indicator */}
              <motion.div
                className="mt-12 flex items-center gap-4 bg-background/80 border border-primary/10 rounded-xl p-4 backdrop-blur-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full bg-primary/20 border-2 border-white dark:border-gray-800 overflow-hidden"
                    >
                      <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10"></div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Over{" "}
                    <span className="font-medium text-foreground">15,000+</span>{" "}
                    glowing reviews
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Image Display */}
            <motion.div
              className="md:col-span-6 relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative w-full h-[80vh] md:h-[70vh] perspective-1000">
                {/* 3D Rotating Container */}
                <motion.div
                  className="relative w-full h-full transform-style-3d"
                  animate={{
                    rotateY: [0, 5, 0, -5, 0],
                    rotateX: [0, -5, 0, 5, 0],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Product image display with animation */}
                  <div className="relative h-full w-full flex items-center justify-center">
                    {/* Main product spotlight */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
                      animate={{
                        y: [0, -10, 0, 10, 0],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="relative w-64 h-80">
                        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
                          <div className="w-full h-full bg-gradient-to-t from-pink-100 to-purple-50 dark:from-pink-900/30 dark:to-purple-900/20"></div>
                        </div>
                        <div className="relative h-full w-full flex items-center justify-center">
                          <div className="h-48 w-48 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md shadow-lg"></div>
                        </div>
                      </div>

                      {/* Floating product label */}
                      <motion.div
                        className="absolute top-4 left-2 -right-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-30"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.5, duration: 0.6 }}
                      >
                        <div className="flex items-center gap-2">
                          <Sparkle className="h-4 w-4 text-amber-500" />
                          <span className="text-sm font-medium">
                            Bestseller
                          </span>
                        </div>
                        <Image
                          src="/beauty-banner1.jpeg"
                          alt="Beauty Banner 1"
                          className="rounded-lg mt-2"
                          width={200}
                          height={100}
                        />
                      </motion.div>
                    </motion.div>

                    {/* Floating product 1 */}
                    <motion.div
                      className="absolute top-1/4 -left-6 z-10 shadow-xl rounded-lg overflow-hidden"
                      animate={{
                        y: [0, 15, 0, -15, 0],
                        rotate: [0, 5, 0, -5, 0],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                    >
                      <div className="relative w-44 h-56 rounded-lg bg-gradient-to-br from-rose-100 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/20 p-3">
                        <div className="w-full h-full rounded-lg border border-white/30 backdrop-blur-sm">
                          <Image
                            src="/beauty-banner2.jpeg"
                            alt="Beauty Banner 2"
                            className="rounded-lg"
                            fill
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Floating product 2 */}
                    <motion.div
                      className="absolute top-1 -right-8 z-10 shadow-xl rounded-lg overflow-hidden"
                      animate={{
                        y: [0, -15, 0, 15, 0],
                        rotate: [0, -5, 0, 5, 0],
                      }}
                      transition={{
                        duration: 11,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="relative w-40 h-52 rounded-lg bg-gradient-to-br from-purple-100 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/20 p-3">
                        <div className="w-full h-full rounded-lg border border-white/30 backdrop-blur-sm">
                          <Image
                            src="/beauty-banner3.jpeg"
                            alt="Beauty Banner 3"
                            className="rounded-lg"
                            fill
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Decorative elements */}
                    <motion.div
                      className="absolute top-1/3 right-1/4 w-10 h-10 rounded-full bg-rose-200 dark:bg-rose-500/20 z-5"
                      animate={{
                        y: [0, 20, 0, -20, 0],
                        scale: [1, 1.1, 1, 0.9, 1],
                      }}
                      transition={{ duration: 7, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute bottom-1/3 left-1/4 w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-500/20 z-5"
                      animate={{
                        y: [0, -15, 0, 15, 0],
                        scale: [1, 0.9, 1, 1.1, 1],
                      }}
                      transition={{ duration: 8, repeat: Infinity, delay: 0.5 }}
                    />
                    <motion.div
                      className="absolute top-2/3 right-1/3 w-6 h-6 rounded-full bg-pink-200 dark:bg-pink-500/20 z-5"
                      animate={{
                        y: [0, 10, 0, -10, 0],
                        x: [0, -10, 0, 10, 0],
                      }}
                      transition={{ duration: 9, repeat: Infinity, delay: 1 }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-b from-background to-background/95">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge className="mb-3 px-3 py-1 bg-primary/10 text-primary rounded-full">
                Our Promise
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                Beauty With Purpose
              </h2>
              
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {beautyBenefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 transform group-hover:scale-105 transition-transform duration-300 -z-10"></div>
                  <div className="relative z-10 p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-primary/10 h-full flex flex-col items-center text-center">
                    <div className={`p-4 rounded-full ${benefit.color} mb-4`}>
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-20 bg-gradient-to-b from-background to-background/95">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-3 px-3 py-1 bg-primary/10 text-primary rounded-full">
                Categories
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                Discover Our Collections
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our carefully curated skincare and makeup products
              </p>
            </motion.div>

            <Tabs defaultValue="skincare" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-background/95 backdrop-blur-sm border-2 border-primary/10 rounded-full p-1">
                  <TabsTrigger
                    value="skincare"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-8 py-2.5"
                  >
                    Skincare
                  </TabsTrigger>
                  <TabsTrigger
                    value="makeup"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-8 py-2.5"
                  >
                    Makeup
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="skincare">
                <div className="flex justify-center mb-6">
                  {Object.keys(skincareCategories).map((category) => (
                    <Button
                      key={category}
                      variant={
                        selectedSkincareCategory === category
                          ? "default"
                          : "outline"
                      }
                      className="rounded-full px-4 py-2 mx-2"
                      onClick={() => setSelectedSkincareCategory(category)}
                    >
                      {skincareCategories[category]}
                    </Button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {beautyProducts.skincare
                    .filter(
                      (product) =>
                        selectedSkincareCategory === "All" ||
                        product.category === selectedSkincareCategory
                    )
                    .map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="group"
                      >
                        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300">
                          <div className="relative aspect-[3/4] overflow-hidden">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="absolute bottom-4 left-4 right-4 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                              <Button className="w-full rounded-full bg-white/90 backdrop-blur-sm text-primary hover:bg-white">
                                Quick View
                              </Button>
                            </div>
                          </div>

                          <div className="p-4">
                            <h3 className="font-medium text-lg mb-2">
                              {product.name}
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {product.benefits.map((benefit, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                                >
                                  {benefit}
                                </span>
                              ))}
                            </div>
                            <PriceCartButton
                              price={product.price}
                              originalPrice={product.originalPrice}
                              discount={
                                product.originalPrice
                                  ? Math.round(
                                      ((product.originalPrice - product.price) /
                                        product.originalPrice) *
                                        100
                                    )
                                  : undefined
                              }
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
                </div>
              </TabsContent>

              <TabsContent value="makeup">
                <div className="flex justify-center mb-6">
                  {Object.keys(makeupCategories).map((category) => (
                    <Button
                      key={category}
                      variant={
                        selectedMakeupCategory === category
                          ? "default"
                          : "outline"
                      }
                      className="rounded-full px-4 py-2 mx-2"
                      onClick={() => setSelectedMakeupCategory(category)}
                    >
                      {makeupCategories[category]}
                    </Button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {beautyProducts.makeup
                    .filter(
                      (product) =>
                        selectedMakeupCategory === "All" ||
                        product.category === selectedMakeupCategory
                    )
                    .map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="group"
                      >
                        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300">
                          <div className="relative aspect-[3/4] overflow-hidden">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="absolute bottom-4 left-4 right-4 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                              <Button className="w-full rounded-full bg-white/90 backdrop-blur-sm text-primary hover:bg-white">
                                Quick View
                              </Button>
                            </div>
                          </div>

                          <div className="p-4">
                            <Badge variant="secondary" className="mb-2">
                              {product.category}
                            </Badge>
                            <h3 className="font-medium text-lg mb-2">
                              {product.name}
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {product.benefits.map((benefit, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                                >
                                  {benefit}
                                </span>
                              ))}
                            </div>
                            <PriceCartButton
                              price={product.price}
                              originalPrice={product.originalPrice}
                              discount={
                                product.originalPrice
                                  ? Math.round(
                                      ((product.originalPrice - product.price) /
                                        product.originalPrice) *
                                        100
                                    )
                                  : undefined
                              }
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
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Featured Products Slider */}
        <section className="py-20 bg-gradient-to-b from-background/95 to-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-3 px-3 py-1 bg-primary/10 text-primary rounded-full">
                  Featured
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                  Trending Now
                </h2>
                <p className="text-lg text-muted-foreground max-w-xl">
                  Our most popular formulas that customers can't stop talking
                  about.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center gap-3 mt-6 md:mt-0"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => {
                    setActiveSlide((prev) =>
                      prev === 0 ? trendingItems.length - 4 : prev - 1
                    );
                    setAutoplay(false);
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => {
                    setActiveSlide((prev) =>
                      prev === trendingItems.length - 4 ? 0 : prev + 1
                    );
                    setAutoplay(false);
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>

            <div className="overflow-hidden">
              <motion.div
                className="flex gap-6"
                initial={{ x: 0 }}
                animate={{ x: `-${activeSlide * 25}%` }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {trendingItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden group">
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-50 dark:from-pink-900/30 dark:to-purple-900/20" />
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/90 text-primary backdrop-blur-sm">
                            {item.tag}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 rounded-full bg-white/80 hover:bg-white/90 backdrop-blur-sm"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-medium text-lg mb-1">
                          {item.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.benefits.map((benefit, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                        <PriceCartButton
                          price={item.price}
                          originalPrice={item.originalPrice}
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
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
