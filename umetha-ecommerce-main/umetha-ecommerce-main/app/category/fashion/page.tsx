"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Heart,
  ArrowRight,
  ChevronRight,
  ShoppingBag,
  TrendingUp,
  Sparkles,
  CircleDollarSign,
  Star,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/main-layout";
import PageHeader from "@/components/page-header";
import PriceCartButton from "@/components/ui/price-cart-button";
import FashionFittingRoomPanel from "@/components/FashionFittingRoomPanel";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";

type Product = Tables<"products">;

export default function FashionPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const { toast } = useToast();

  // Parallax effect for hero section
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // State for featured collection slideshow
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [trendingItems, setTrendingItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch fashion products from Supabase
  const fetchFashionProducts = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch products with name containing "Dress" or specific fashion keywords
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(
          "name.ilike.%Dress%,name.ilike.%Blazer%,name.ilike.%Handbag%,name.ilike.%Coat%,name.ilike.%Suit%,name.ilike.%Boot%"
        )
        .order("name", { ascending: true })
        .limit(8);

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.length > 0) {
        setTrendingItems(data);
        console.log("Fetched fashion products from Supabase:", data);
      } else {
        // Fallback to the existing static data if no products found
        console.log("No products found in database, using fallback data");
      }
    } catch (err) {
      console.error("Error fetching fashion products:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load fashion products"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Refresh function to manually reload data
  const refreshData = useCallback(async () => {
    setRefreshing(true);
    await fetchFashionProducts();
    toast({
      title: "Data refreshed",
      description: "The latest product data has been loaded from the database.",
      duration: 3000,
    });
  }, [fetchFashionProducts, toast]);

  // Fetch products on component mount
  useEffect(() => {
    fetchFashionProducts();
  }, [fetchFashionProducts]);

  // Featured collections with modern fashion images
  const featuredCollections = [
    {
      id: 1,
      title: "Modern Elegance",
      subtitle: "Discover timeless sophistication",
      image:
        "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1472",
      badge: "New Season",
    },
    {
      id: 2,
      title: "Urban Style",
      subtitle: "Contemporary fashion for city life",
      image:
        "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?q=80&w=1470",
      badge: "Trending Now",
    },
    {
      id: 3,
      title: "Luxury Collection",
      subtitle: "Premium pieces for distinguished taste",
      image:
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1587",
      badge: "Exclusive",
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
  }, [autoplay]);

  // Fashion categories with more dynamic content
  const fashionCategories = [
    {
      name: "Women",
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1470",
      categories: ["Dresses", "Tops", "Bottoms", "Accessories"],
      featured: "New Spring Collection",
      discount: "Up to 40% Off",
      color: "from-fuchsia-600/60 to-violet-600/40",
      link: "/category/fashion/women",
    },
    {
      name: "Men",
      image:
        "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1374",
      categories: ["Suits", "Casual", "Active", "Accessories"],
      featured: "Tailored Excellence",
      discount: "Up to 30% Off",
      color: "from-blue-600/60 to-indigo-600/40",
      link: "/category/fashion/men",
    },
  ];

  // Fallback trending items (used if database fetch fails)
  const fallbackTrendingItems = [
    {
      products_id: 1,
      name: "Silk Evening Dress",
      price: 289.99,
      originalPrice: 349.99,
      image:
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1600",
      tag: "Best Seller",
      description:
        "Elegant silk evening dress with delicate embroidery and flattering silhouette.",
      sku: "FASH-1001",
      date_created: new Date().toISOString(),
      supplier_id: 1,
    },
    {
      products_id: 2,
      name: "Designer Blazer",
      price: 499.99,
      originalPrice: 599.99,
      image:
        "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=1600",
      tag: "Premium",
      description:
        "Tailored designer blazer made from high-quality materials for a sophisticated look.",
      sku: "FASH-1002",
      date_created: new Date().toISOString(),
      supplier_id: 1,
    },
    {
      products_id: 3,
      name: "Luxury Handbag",
      price: 199.99,
      originalPrice: 249.99,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600",
      tag: "New Arrival",
      description:
        "Statement luxury handbag with premium hardware and spacious interior compartments.",
      sku: "FASH-1003",
      date_created: new Date().toISOString(),
      supplier_id: 1,
    },
    {
      products_id: 4,
      name: "Statement Coat",
      price: 349.99,
      originalPrice: 429.99,
      image:
        "https://images.unsplash.com/photo-1592669241067-2f92a1048085?q=80&w=1600",
      tag: "Limited Edition",
      description:
        "Bold statement coat that combines comfort with striking design elements.",
      sku: "FASH-1004",
      date_created: new Date().toISOString(),
      supplier_id: 1,
    },
    {
      products_id: 5,
      name: "Summer Dress",
      price: 159.99,
      originalPrice: 199.99,
      image:
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1600",
      tag: "Trending",
      description:
        "Light and flowy summer dress in breathable fabric, perfect for warm days.",
      sku: "FASH-1005",
      date_created: new Date().toISOString(),
      supplier_id: 1,
    },
    {
      products_id: 6,
      name: "Classic Suit",
      price: 799.99,
      originalPrice: 999.99,
      image:
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1600",
      tag: "Premium",
      description:
        "Timeless classic suit with exquisite tailoring and premium wool fabric.",
      sku: "FASH-1006",
      date_created: new Date().toISOString(),
      supplier_id: 1,
    },
    {
      products_id: 7,
      name: "Designer Boots",
      price: 299.99,
      originalPrice: 379.99,
      image:
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1600",
      tag: "New Season",
      description:
        "Designer boots crafted from genuine leather with durable soles for lasting comfort.",
      sku: "FASH-1007",
      date_created: new Date().toISOString(),
      supplier_id: 1,
    },
    {
      products_id: 8,
      name: "Casual Ensemble",
      price: 249.99,
      originalPrice: 299.99,
      image:
        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1600",
      tag: "Essential",
      description:
        "Versatile casual ensemble that creates an effortlessly stylish look for everyday wear.",
      sku: "FASH-1008",
      date_created: new Date().toISOString(),
      supplier_id: 1,
    },
  ];

  // Use fallback data if no products found in the database
  const displayProducts =
    trendingItems.length > 0 ? trendingItems : fallbackTrendingItems;

  return (
    <MainLayout hideRoomVisualizer={true}>
      <div ref={containerRef} className="min-h-screen bg-background">
        {/* Enhanced Hero Section with Better Integration */}
        <div className="relative h-[90vh] overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10 z-0"></div>
          <div className="absolute inset-0 z-0 opacity-5">
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-primary/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-primary/10 to-transparent"></div>
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-primary/10 to-transparent"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-primary/10 to-transparent"></div>
          </div>

          {/* Content container */}
          <div className="grid grid-cols-1 md:grid-cols-12 h-full container relative z-10">
            {/* Left Content - Enhanced */}
            <motion.div
              className="md:col-span-6 flex flex-col justify-center px-6 py-12 md:py-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
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
                    Elevate
                  </span>{" "}
                  Your
                  <br />
                  <span className="relative inline-block">
                    Style Game
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
                <Link href="/category/fashion/women/">
                  <Button
                    size="lg"
                    className="rounded-full bg-primary hover:bg-primary/90 group flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 text-base font-medium h-14 px-8"
                  >
                    Explore Women
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/category/fashion/men">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-primary/30 text-primary hover:bg-primary/10 flex items-center gap-2 hover:border-primary transition-all duration-300 transform hover:-translate-y-1 text-base font-medium h-14 px-8"
                  >
                    Explore Men
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>

              {/* Added testimonial/trust indicator */}
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
                      className="h-10 w-10 rounded-full bg-primary/20 border-2 border-white overflow-hidden"
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
                    <span className="font-medium text-foreground">10,000+</span>{" "}
                    happy customers
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Image Grid - Enhanced with overlapping & 3D effect */}
            <motion.div
              className="md:col-span-6 relative flex items-center"
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
                  {/* Main large image */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-2xl overflow-hidden shadow-2xl z-20 border-4 border-white/90 dark:border-background"
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1586"
                      alt="Fashion main"
                      fill
                      className="object-cover scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent mix-blend-overlay"></div>
                  </motion.div>

                  {/* Top left image */}
                  <motion.div
                    className="absolute top-[10%] left-[5%] w-[40%] h-[40%] rounded-2xl overflow-hidden shadow-xl z-10 border-4 border-white/90 dark:border-background transform rotate-[-8deg]"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1473"
                      alt="Fashion detail 1"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 to-transparent mix-blend-overlay"></div>
                  </motion.div>

                  {/* Bottom right image */}
                  <motion.div
                    className="absolute bottom-[10%] right-[5%] w-[45%] h-[45%] rounded-2xl overflow-hidden shadow-xl z-10 border-4 border-white/90 dark:border-background transform rotate-[8deg]"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1581338834647-b0fb40704e21?q=80&w=1587"
                      alt="Fashion detail 2"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-600/30 to-transparent mix-blend-overlay"></div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent z-10"></div>
        </div>

        {/* Fashion Categories with Enhanced Design */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-primary/5 dark:bg-primary/2 z-0"></div>
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent z-0"></div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-0"></div>

          <motion.div
            className="container relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-1 rounded-full mb-4"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">
                  Discover Our Collections
                </span>
              </motion.div>
              <motion.h2
                className="text-4xl md:text-5xl font-medium mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Shop By Category
              </motion.h2>
              <motion.p
                className="text-muted-foreground text-lg max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Explore our curated collections designed to elevate your
                personal style
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {fashionCategories.map((category, index) => (
                <Link key={category.name} href={category.link}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="group relative cursor-pointer h-full transform hover:-translate-y-2 transition-all duration-500"
                  >
                    {/* Enhanced Category Display */}
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/50 dark:border-background/80">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80 group-hover:opacity-90 transition-opacity duration-300`}
                      />
                      <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
                        <div>
                          <h2 className="text-5xl font-medium text-white mb-6 drop-shadow-md">
                            {category.name}
                          </h2>
                          <motion.div
                            className="flex flex-wrap gap-2 mb-8"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            viewport={{ once: true }}
                          >
                            {category.categories.map((subcat) => (
                              <Badge
                                key={subcat}
                                className="bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm cursor-pointer text-base px-3 py-1"
                              >
                                {subcat}
                              </Badge>
                            ))}
                          </motion.div>

                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                            <Button className="bg-white text-white hover:bg-white/90 rounded-full text-base font-medium px-6 py-6 h-12 shadow-lg">
                              Browse Collection
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-primary/20 blur-xl -z-10"></div>
                    <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-primary/30 blur-xl -z-10"></div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Collection Preview Section - Enhanced Slideshow */}
        <section className="py-24 relative">
          <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-primary/5 rounded-br-full -z-10"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-primary/5 rounded-tl-full -z-10"></div>

          <div className="container">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-1 rounded-full mb-4"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">
                  Exclusively Curated
                </span>
              </motion.div>
              <motion.h2
                className="text-4xl md:text-5xl font-medium mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Featured Collections
              </motion.h2>
              <motion.p
                className="text-muted-foreground text-lg max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Discover our latest featured collections designed with attention
                to detail
              </motion.p>
            </motion.div>

            <motion.div
              className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/50 dark:border-background/80"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              onMouseEnter={() => setAutoplay(false)}
              onMouseLeave={() => setAutoplay(true)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={featuredCollections[activeSlide].id}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={featuredCollections[activeSlide].image}
                    alt={featuredCollections[activeSlide].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-0 p-12 md:p-20 flex flex-col justify-end">
                    <Badge className="w-fit mb-4 bg-white/10 backdrop-blur-sm text-white border-none">
                      {featuredCollections[activeSlide].badge}
                    </Badge>
                    <motion.h1
                      className="text-4xl md:text-6xl font-light text-white mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {featuredCollections[activeSlide].title}
                    </motion.h1>
                    <motion.p
                      className="text-white/90 mb-8 text-xl max-w-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      {featuredCollections[activeSlide].subtitle}
                    </motion.p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slide Navigation */}
              <div className="absolute bottom-8 right-8 flex items-center gap-2">
                {featuredCollections.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeSlide
                        ? "w-8 bg-white"
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trending Items Section */}
        <section className="py-24">
          <div className="container">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-1 rounded-full mb-4"
              >
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">Trending Now</span>
              </motion.div>
              <motion.h2
                className="text-4xl md:text-5xl font-medium mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Popular Items
              </motion.h2>
              <motion.p
                className="text-muted-foreground text-lg max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Discover the most sought-after pieces from our collection
              </motion.p>

              {/* Add refresh button */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                className="mt-4"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshData}
                  disabled={loading || refreshing}
                  className="gap-2"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  {refreshing ? "Refreshing..." : "Refresh Products"}
                </Button>
              </motion.div>
            </motion.div>

            {/* Loading state */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-800 rounded-xl aspect-square mb-4"></div>
                    <div className="bg-gray-200 dark:bg-gray-800 h-6 w-3/4 rounded mb-2"></div>
                    <div className="bg-gray-200 dark:bg-gray-800 h-4 w-1/2 rounded"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Products grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {displayProducts.map((item) => (
                  <motion.div
                    key={item.products_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="group relative"
                  >
                    <Link href={`/product/${item.products_id}`}>
                      <div className="relative aspect-square rounded-xl overflow-hidden">
                        <Image
                          src={item.image || "/placeholder-fashion.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Badge */}
                        <div className="absolute top-4 left-4">
                          <Badge
                            variant="secondary"
                            className="bg-white/90 text-primary"
                          >
                            {item.sku?.includes("FASH") ? "Fashion" : "New"}
                          </Badge>
                        </div>
                      </div>
                    </Link>

                    <div className="mt-4 space-y-2">
                      <h3 className="font-medium">{item.name}</h3>

                      {/* Use PriceCartButton with database product */}
                      <PriceCartButton
                        id={item.products_id}
                        name={item.name}
                        price={item.price}
                        originalPrice={item.price * 1.25} // Example for display purposes
                        image={item.image || "/placeholder-fashion.jpg"}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
