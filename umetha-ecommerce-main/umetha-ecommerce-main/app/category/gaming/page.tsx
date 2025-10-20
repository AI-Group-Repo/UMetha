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
  Search,
  ShoppingCart,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  Globe,
  ArrowRight,
  Star,
  Heart,
  Eye,
  Gamepad,
  Monitor,
  Headphones,
  Cpu,
  Zap,
  Award,
  Clock,
  BarChart,
  Flame,
  Download,
  Users,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/main-layout";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import PriceCartButton from "@/components/ui/price-cart-button";

export default function GamingPage() {
  const containerRef = useRef(null);
  const [hoveredImage, setHoveredImage] = useState(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hero section featured games
  const heroImages = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800", // Gaming setup
    "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=800", // Gaming console
    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800", // Gaming atmosphere
  ];

  // Game categories
  const gameCategories = [
    {
      id: 1,
      name: "Action",
      description: "Fast-paced combat and challenges",
      image: "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=800",
      icon: <Flame className="h-5 w-5" />,
      items: 124,
      color: "from-red-600/60 to-orange-600/40",
    },
    {
      id: 2,
      name: "RPG",
      description: "Epic adventures and quests",
      image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800",
      icon: <Award className="h-5 w-5" />,
      items: 98,
      color: "from-blue-600/60 to-indigo-600/40",
    },
    {
      id: 3,
      name: "Strategy",
      description: "Test your tactical genius",
      image: "https://images.unsplash.com/photo-1614465000772-1b302f406c63?w=800",
      icon: <BarChart className="h-5 w-5" />,
      items: 156,
      color: "from-emerald-600/60 to-green-600/40",
    },
    {
      id: 4,
      name: "Multiplayer",
      description: "Compete with friends worldwide",
      image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800",
      icon: <Users className="h-5 w-5" />,
      items: 87,
      color: "from-violet-600/60 to-purple-600/40",
    },
  ];

  // Trending games
  const trendingGames = [
    {
      id: 1,
      name: "Cyberpunk 2077",
      price: 59.99,
      originalPrice: 69.99,
      image: "https://images.unsplash.com/photo-1627856014754-2907e2355fc3?w=800",
      tag: "Best Seller",
      rating: 4.7,
      reviews: 3420,
      category: "RPG",
    },
    {
      id: 2,
      name: "Elden Ring",
      price: 49.99,
      originalPrice: 59.99,
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800",
      tag: "New DLC",
      rating: 4.9,
      reviews: 5231,
      category: "Action",
    },
    {
      id: 3,
      name: "Call of Duty: Modern Warfare",
      price: 39.99,
      originalPrice: 69.99,
      image: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=800",
      tag: "Sale",
      rating: 4.5,
      reviews: 4582,
      category: "FPS",
    },
    {
      id: 4,
      name: "FIFA 25",
      price: 59.99,
      originalPrice: 69.99,
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800",
      tag: "New Release",
      rating: 4.6,
      reviews: 2187,
      category: "Sports",
    },
  ];

  // Gaming gear items
  const gamingGear = [
    {
      id: 1,
      name: "Razer Kraken X Headset",
      price: 129.99,
      originalPrice: 159.99,
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800",
      category: "Audio",
      rating: 4.8,
      icon: <Headphones className="h-4 w-4" />,
    },
    {
      id: 2,
      name: "Logitech G Pro Wireless Mouse",
      price: 89.99,
      originalPrice: 119.99,
      image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800",
      category: "Controllers",
      rating: 4.9,
      icon: <Gamepad className="h-4 w-4" />,
    },
    {
      id: 3,
      name: "SteelSeries Apex Pro Keyboard",
      price: 149.99,
      originalPrice: 199.99,
      image: "https://images.unsplash.com/photo-1595225476474-87563907664c?w=800",
      category: "Input",
      rating: 4.7,
      icon: <Cpu className="h-4 w-4" />,
    },
    {
      id: 4,
      name: 'ASUS ROG Swift 27" Monitor',
      price: 599.99,
      originalPrice: 699.99,
      image: "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?w=800",
      category: "Display",
      rating: 4.8,
      icon: <Monitor className="h-4 w-4" />,
    },
  ];

  return (
    <MainLayout hideFittingRoom={true} hideRoomVisualizer={true} >
      <div className="min-h-screen bg-gray-950 text-gray-100">
        {/* Main Content */}
        <div ref={containerRef} className="min-h-screen">
          {/* Hero Section - adjust top padding to account for MainLayout header */}
          <section className="relative min-h-[95vh] overflow-hidden pt-24">
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
                  backgroundImage: `radial-gradient(circle at 1px 1px, #8b5cf6 1px, transparent 0)`,
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900/95 to-purple-900/20 z-10" />

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
                      className="absolute -left-20 -top-20 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl"
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="absolute -right-20 -bottom-20 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"
                    />

                    <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-8">
                      <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500"
                      >
                        Level Up Your
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="block"
                      >
                        Gaming Experience
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
                        Browse Games
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
                        className="rounded-full border-purple-600/20 text-purple-400 hover:bg-purple-600/10 group"
                      >
                        Join Community
                        <Users className="ml-2 h-4 w-4" />
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
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 to-gray-900/80 z-10" />
                        <motion.div
                          animate={{
                            scale: hoveredImage === index ? 1.1 : 1,
                          }}
                          transition={{ duration: 0.7 }}
                          style={{
                            backgroundImage: `url(${image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            position: "absolute",
                            inset: 0,
                          }}
                        />
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: hoveredImage === index ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                        />

                        {/* Game Info Overlay */}
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 p-4 z-30"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{
                            y: hoveredImage === index ? 0 : 20,
                            opacity: hoveredImage === index ? 1 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <Button
                            size="sm"
                            className="rounded-full bg-purple-600/90 hover:bg-purple-600 backdrop-blur-sm"
                          >
                            Play Now
                          </Button>
                        </motion.div>
                      </motion.div>
                    ))}

                    {/* Floating Elements */}
                    

                    
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Categories Grid */}
          <section className="py-20 bg-gradient-to-b from-gray-950 to-gray-900">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <Badge className="mb-3 px-3 py-1 bg-purple-600/10 text-purple-400 rounded-full">
                  Genres
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Explore Game Worlds
                </h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Discover your next adventure across our curated game
                  collections
                </p>
              </motion.div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {gameCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      href={`/category/games/${category.name.toLowerCase()}`}
                    >
                      <div className="group relative h-[300px] rounded-2xl overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{ backgroundImage: `url(${category.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
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
                              {category.items} games
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

          {/* Featured Games */}
          <section className="py-20 bg-purple-950/10">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <Badge className="mb-3 px-3 py-1 bg-purple-600/10 text-purple-400 rounded-full">
                  Featured
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Trending Games
                </h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  The hottest titles everyone is playing right now
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {trendingGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-800">
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                          style={{ backgroundImage: `url(${game.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />

                        {/* Quick action buttons */}
                        <div className="absolute right-4 top-4">
                          <Badge className="bg-purple-600/90 backdrop-blur-sm text-white">
                            {game.tag}
                          </Badge>
                        </div>

                        <div className="absolute right-4 bottom-4 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                          <Button
                            size="icon"
                            className="h-10 w-10 rounded-full bg-white text-purple-600 hover:bg-white/90 shadow-lg"
                          >
                            <Heart className="h-5 w-5" />
                          </Button>
                          <Button
                            size="icon"
                            className="h-10 w-10 rounded-full bg-white text-purple-600 hover:bg-white/90 shadow-lg"
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant="outline"
                            className="border-gray-700 text-gray-300"
                          >
                            {game.category}
                          </Badge>
                          
                        </div>

                        <h3 className="text-lg font-semibold mb-4 text-white">
                          {game.name}
                        </h3>

                        <PriceCartButton
                          price={game.price}
                          originalPrice={game.originalPrice}
                         
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

              <div className="flex justify-center mt-12">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                >
                  View All Games
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>

          {/* Gaming Gear */}
          <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-950">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <Badge className="mb-3 px-3 py-1 bg-blue-600/10 text-blue-400 rounded-full">
                  Pro Setup
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Premium Gaming Gear
                </h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Upgrade your gaming experience with professional-grade
                  equipment
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {gamingGear.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-800">
                      <div className="relative aspect-square overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />

                        <div className="absolute right-4 top-4">
                          <Badge className="bg-blue-600/90 backdrop-blur-sm text-white">
                            {item.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-6">

                        <h3 className="text-lg font-semibold mb-4 text-white">
                          {item.name}
                        </h3>

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
              </div>

              <div className="flex justify-center mt-12">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                >
                  View All Gear
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
