"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Filter,
  ChevronDown,
  ShoppingBag,
  Heart,
  Eye,
  Star,
  Loader,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/main-layout";
import PriceCartButton from "@/components/ui/price-cart-button";

export default function MenFashionPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // State for current collection
  const [activeCollection, setActiveCollection] = useState("all");

  // State for featured items slideshow
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Price filter state
  const [priceRange, setPriceRange] = useState([0, 1000]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) =>
        prev === featuredItems.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulated filter/category change loading
  const handleCategoryChange = (category) => {
    setIsLoading(true);
    setActiveCollection(category);

    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Featured hero items with coordinated images
  const featuredItems = [
    {
      id: 1,
      title: "Tailored Perfection",
      description:
        "Expertly crafted suits and formal wear for the modern gentleman",
      image:
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
      alt: "Man in tailored suit",
      cta: "Shop Formal",
      link: "/men/formal",
    },
    {
      id: 2,
      title: "Urban Casual",
      description: "Effortless style for your everyday adventures",
      image:
        "https://images.unsplash.com/photo-1515131493472-b33649db808c?w=800&q=80",
      alt: "Man in casual urban outfit",
      cta: "Shop Casual",
      link: "/men/casual",
    },
    {
      id: 3,
      title: "Athletic Innovation",
      description: "Performance wear designed for movement and comfort",
      image:
        "https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=800&q=80",
      alt: "Man in athletic apparel",
      cta: "Shop Athletic",
      link: "/men/athletic",
    },
  ];

  // Collections categories
  const collections = [
    { id: "all", name: "All Collections" },
    { id: "formal", name: "Formal" },
    { id: "casual", name: "Casual" },
    { id: "athletic", name: "Athletic" },
    { id: "accessories", name: "Accessories" },
  ];

  // Trending categories
  const trendingCategories = [
    {
      name: "Business Casual",
      image:
        "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80",
      items: 42,
      color: "from-blue-600/60 to-indigo-600/40",
    },
    {
      name: "Summer Essentials",
      image:
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80",
      items: 56,
      color: "from-cyan-600/60 to-blue-600/40",
    },
    {
      name: "Footwear",
      image:
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80",
      items: 38,
      color: "from-indigo-600/60 to-violet-600/40",
    },
    {
      name: "Premium Denim",
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
      items: 24,
      color: "from-blue-800/60 to-indigo-800/40",
    },
  ];

  // Featured products
  const featuredProducts = [
    {
      id: 101,
      name: "Italian Wool Suit",
      price: 849.99,
      originalPrice: 999.99,
      image:
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
      rating: 4.9,
      reviews: 124,
      tag: "Best Seller",
      isNew: true,
      colors: ["Navy", "Charcoal", "Black"],
      category: "formal",
    },
    {
      id: 102,
      name: "Premium Cotton Shirt",
      price: 89.99,
      originalPrice: 119.99,
      image:
        "https://images.unsplash.com/photo-1602810316693-3667c854239a?w=800&q=80",
      rating: 4.7,
      reviews: 98,
      tag: "Trending",
      isNew: false,
      colors: ["White", "Blue", "Pink"],
      category: "formal",
    },
    {
      id: 103,
      name: "Slim Fit Chinos",
      price: 79.99,
      originalPrice: 99.99,
      image:
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
      rating: 4.8,
      reviews: 156,
      tag: "",
      isNew: false,
      colors: ["Khaki", "Navy", "Olive"],
      category: "casual",
    },
    {
      id: 104,
      name: "Leather Derby Shoes",
      price: 249.99,
      originalPrice: 299.99,
      image:
        "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80",
      rating: 4.9,
      reviews: 87,
      tag: "Premium",
      isNew: true,
      colors: ["Brown", "Black"],
      category: "formal",
    },
    {
      id: 105,
      name: "Performance T-Shirt",
      price: 49.99,
      originalPrice: 59.99,
      image:
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
      rating: 4.6,
      reviews: 203,
      tag: "",
      isNew: false,
      colors: ["Black", "Gray", "Blue", "Red"],
      category: "athletic",
    },
    {
      id: 106,
      name: "Luxury Watch",
      price: 499.99,
      originalPrice: 649.99,
      image:
        "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80",
      rating: 4.9,
      reviews: 76,
      tag: "Limited Edition",
      isNew: true,
      colors: ["Silver", "Gold", "Black"],
      category: "accessories",
    },
    {
      id: 107,
      name: "Casual Denim Jacket",
      price: 129.99,
      originalPrice: 169.99,
      image:
        "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80",
      rating: 4.8,
      reviews: 142,
      tag: "Trending",
      isNew: false,
      colors: ["Blue", "Black", "Gray"],
      category: "casual",
    },
    {
      id: 108,
      name: "Premium Track Pants",
      price: 89.99,
      originalPrice: 119.99,
      image:
        "https://images.unsplash.com/photo-1552902875-9ac1f9fe0c07?w=800&q=80",
      tag: "New Arrival",
      isNew: true,
      colors: ["Black", "Navy", "Gray"],
      category: "athletic",
    },
  ];

  // Filter products by active collection
  const filteredProducts =
    activeCollection === "all"
      ? featuredProducts
      : featuredProducts.filter(
          (product) => product.category === activeCollection
        );

  return (
    <MainLayout  hideRoomVisualizer={true}>
      <div ref={containerRef} className="min-h-screen bg-background">
        <section className="relative h-[90vh] overflow-hidden">
          {/* Background gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-blue-600/5 dark:to-indigo-600/10 z-0"></div>
          <div className="absolute inset-0 z-0 opacity-5">
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-blue-600/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-600/10 to-transparent"></div>
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-blue-600/10 to-transparent"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-blue-600/10 to-transparent"></div>
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
                <Badge className="bg-blue-600 text-white px-4 py-2 rounded-full text-base font-medium shadow-lg shadow-blue-600/20 dark:bg-indigo-600 dark:shadow-indigo-600/20">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Spring/Summer 2025
                </Badge>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-blue-600/10 dark:bg-indigo-600/10 blur-2xl"></div>
                <div className="absolute -right-6 -bottom-6 h-16 w-16 rounded-full bg-blue-600/20 dark:bg-indigo-600/20 blur-xl"></div>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium leading-tight mb-8 relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-600/80 dark:from-indigo-500 dark:to-indigo-500/80 font-bold">
                    Modern
                  </span>
                  <br />
                  <span className="relative inline-block">
                    Gentleman
                    <div className="absolute -bottom-3 left-0 w-full h-2 bg-blue-600/20 dark:bg-indigo-600/20 rounded-full"></div>
                  </span>
                </h1>
              </motion.div>

              <motion.p
                className="text-xl text-muted-foreground max-w-md mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Discover our premium collection of menswear designed for the
                contemporary man. From tailored suits to casual essentials,
                elevate your style with UMetha.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Link href="#collections">
                  <Button
                    size="lg"
                    className="rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 group flex items-center gap-2 shadow-lg shadow-blue-600/20 dark:shadow-indigo-600/20 hover:shadow-blue-700/30 dark:hover:shadow-indigo-700/30 transition-all duration-300 transform hover:-translate-y-1 text-base font-medium h-14 px-8"
                  >
                    Shop Collection
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="#popular">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-blue-600/30 dark:border-indigo-600/30 text-blue-600 dark:text-indigo-500 hover:bg-blue-600/10 dark:hover:bg-indigo-600/10 flex items-center gap-2 hover:border-blue-600 dark:hover:border-indigo-600 transition-all duration-300 transform hover:-translate-y-1 text-base font-medium h-14 px-8"
                  >
                    Popular Items
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content - Dynamic Hero Image Carousel */}
            <motion.div
              className="md:col-span-6 flex items-center justify-center px-6 py-12 md:py-0 relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{ scale }}
            >
              <div className="w-full h-full relative">
                {featuredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: activeSlide === index ? 1 : 0,
                      scale: activeSlide === index ? 1 : 0.9,
                    }}
                    transition={{ duration: 0.7 }}
                  >
                    <div className="relative w-full h-[60vh] rounded-2xl overflow-hidden shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
                      <Image
                        src={item.image}
                        alt={item.alt}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-2xl brightness-95 transition-all duration-700"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                        <h2 className="text-3xl font-bold text-white mb-2">
                          {item.title}
                        </h2>
                        <p className="text-white/90 mb-4 max-w-md">
                          {item.description}
                        </p>
                        <Link href={item.link}>
                          <Button className="rounded-full bg-white text-blue-600 dark:text-indigo-600 hover:bg-white/90 group flex items-center gap-2">
                            {item.cta}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Hero navigation dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-30">
                  {featuredItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        activeSlide === index
                          ? "bg-white shadow-lg w-6"
                          : "bg-white/50 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-2">
                Scroll to discover
              </p>
              <div className="w-[30px] h-[50px] rounded-full border-2 border-muted-foreground/30 flex justify-center pt-3">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-indigo-600"
                  animate={{ y: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Trending Categories */}
        <section
          className="py-16 container relative overflow-hidden"
          id="collections"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-12 text-center"
          >
            <Badge className="bg-blue-100 text-blue-600 dark:bg-indigo-900/30 dark:text-indigo-400 mb-3">
              <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
              Trending Now
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Explore Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our carefully curated collections designed for every
              occasion and personal style preference.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
            {trendingCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -10 }}
              >
                <Link
                  href={`/men/${category.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  <div className="group relative rounded-2xl overflow-hidden h-[400px] shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10"></div>
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500 z-10`}
                    ></div>
                    <Image
                      src={category.image}
                      alt={category.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform transition-transform duration-300 group-hover:translate-y-0">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {category.name}
                      </h3>
                      <p className="text-white/80 mb-4">
                        {category.items} items
                      </p>
                      <div className="flex items-center">
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-center text-white text-sm font-medium"
                        >
                          Explore Collection
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section
          className="py-16 bg-blue-50/50 dark:bg-blue-950/10 relative overflow-hidden"
          id="popular"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-wrap items-center justify-between mb-12"
            >
              <div className="mb-6 lg:mb-0">
                <Badge className="bg-blue-100 text-blue-600 dark:bg-indigo-900/30 dark:text-indigo-400 mb-3">
                  Featured Products
                </Badge>
                <h2 className="text-4xl font-bold mb-2">Our Collection</h2>
                <p className="text-muted-foreground max-w-xl">
                  Explore our latest arrivals and bestsellers, crafted with
                  premium materials and exceptional attention to detail.
                </p>
              </div>

              <div className="flex flex-col gap-4 w-full lg:w-auto">
                <div className="flex items-center gap-4 flex-wrap">
                  <p className="text-sm font-medium">Filter by:</p>
                  <Tabs
                    defaultValue="all"
                    className="w-full lg:w-auto"
                    onValueChange={handleCategoryChange}
                  >
                    <TabsList className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-1 rounded-full">
                      {collections.map((collection) => (
                        <TabsTrigger
                          key={collection.id}
                          value={collection.id}
                          className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-indigo-600"
                        >
                          {collection.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Price range:</p>
                    <p className="text-sm text-muted-foreground">
                      ${priceRange[0]} - ${priceRange[1]}
                    </p>
                  </div>
                  <Slider
                    defaultValue={[0, 1000]}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>

            {/* Product Grid */}
            <div className="relative min-h-[400px]">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <Loader className="h-8 w-8 text-blue-600 dark:text-indigo-600 animate-spin mb-2" />
                    <p className="text-muted-foreground">
                      Loading collection...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      viewport={{ once: true, margin: "-50px" }}
                      whileHover={{ y: -5 }}
                      className="group"
                    >
                      <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                        <div className="relative aspect-[3/4] overflow-hidden">

                          <Image
                            src={product.image}
                            alt={product.name}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>

                        <div className="p-4">
                          <h3 className="font-medium text-lg mb-3">
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

                          <div className="flex items-center gap-1 mt-3">
                            {product.colors.slice(0, 3).map((color, i) => (
                              <div
                                key={i}
                                className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-700"
                                style={{
                                  backgroundColor: color.toLowerCase(),
                                }}
                              />
                            ))}
                            {product.colors.length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{product.colors.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Load More Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex justify-center mt-12"
            >
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-blue-600/30 dark:border-indigo-600/30 text-blue-600 dark:text-indigo-500 hover:bg-blue-600/10 dark:hover:bg-indigo-600/10 group"
              >
                Load More Products
                <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
