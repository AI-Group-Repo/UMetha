"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Heart,
  ShoppingBag,
  Instagram,
  Twitter,
  Youtube,
  Filter,
  ArrowUpDown,
  ChevronDown,
  Sparkles,
  Users,
  Package,
  ArrowRight,
  Search,
  ChevronLeft,
  Check,
  ExternalLink,
  UserCheck,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import MainLayout from "@/components/main-layout";
import { useMobile } from "@/hooks/use-mobile";
import PriceCartButton from "@/components/ui/price-cart-button";
import { useFollowedInfluencers } from "@/context/followed-influencers-context";
import { useToast } from "@/hooks/use-toast";

// Sample data for influencers with real images
const influencers = [
  {
    id: 1,
    name: "Sophia Martinez",
    handle: "@sophiastyle",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    followers: "2.4M",
    category: "Fashion",
    verified: true,
    featured: true,
    background: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    products: 48,
    engagement: "4.8%",
    bio: "Fashion enthusiast and style curator. I believe in sustainable fashion and empowering people through self-expression.",
    social: {
      instagram: "sophiastyle",
      twitter: "sophiastyle",
      youtube: "SophiaStyleOfficial",
    },
  },
  {
    id: 2,
    name: "Alex Johnson",
    handle: "@alexfitness",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5",
    followers: "1.8M",
    category: "Fitness",
    verified: true,
    featured: true,
    background: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f",
    products: 36,
    engagement: "5.2%",
    bio: "Certified personal trainer and nutrition expert. I help people transform their lives through fitness and healthy habits.",
    social: {
      instagram: "alexfitness",
      twitter: "alexfitness",
      youtube: "AlexFitnessOfficial",
    },
  },
  {
    id: 3,
    name: "Emma Watson",
    handle: "@emmastyle",
    avatar: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    followers: "3.1M",
    category: "Beauty",
    verified: true,
    featured: true,
    background: "https://images.unsplash.com/photo-1541643600914-78b084683601",
    products: 52,
    engagement: "4.5%",
    bio: "Beauty expert and skincare enthusiast. I'm passionate about clean beauty and helping everyone feel confident in their own skin.",
    social: {
      instagram: "emmastyle",
      twitter: "emmastyle",
      youtube: "EmmaStyleOfficial",
    },
  },
  {
    id: 4,
    name: "David Chen",
    handle: "@davidtech",
    avatar: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    followers: "1.2M",
    category: "Technology",
    verified: true,
    featured: true,
    background: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    products: 28,
    engagement: "3.9%",
    bio: "Tech reviewer and gadget enthusiast. I break down complex tech concepts and help you find the best products for your digital lifestyle.",
    social: {
      instagram: "davidtech",
      twitter: "davidtech",
      youtube: "DavidTechOfficial",
    },
  },
  {
    id: 5,
    name: "Mia Rodriguez",
    handle: "@miafood",
    avatar: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    followers: "950K",
    category: "Food",
    verified: true,
    featured: false,
    background: "https://images.unsplash.com/photo-1541643600914-78b084683601",
    products: 32,
    engagement: "6.1%",
    bio: "Chef and food creator. I believe good food brings people together. Join me as I explore flavors from around the world.",
    social: {
      instagram: "miafood",
      twitter: "miafood",
      youtube: "MiaFoodOfficial",
    },
  },
  {
    id: 6,
    name: "James Wilson",
    handle: "@jamestravel",
    avatar: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    followers: "1.5M",
    category: "Travel",
    verified: true,
    featured: false,
    background: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    products: 24,
    engagement: "4.2%",
    bio: "Travel photographer and adventure seeker. I document my journeys around the globe to inspire others to explore this beautiful world we live in.",
    social: {
      instagram: "jamestravel",
      twitter: "jamestravel",
      youtube: "JamesTravelOfficial",
    },
  },
];

// Sample data for products with real images
const products = [
  {
    id: 1,
    name: "Premium Fitness Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6",
    influencer: "Alex Johnson",
    influencerId: 2,
    category: "Fitness",
    rating: 4.8,
    reviews: 245,
    discount: 15,
    featured: true,
    bestseller: true,
    new: false,
  },
  {
    id: 2,
    name: "Signature Perfume Collection",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569",
    influencer: "Sophia Martinez",
    influencerId: 1,
    category: "Beauty",
    rating: 4.9,
    reviews: 189,
    discount: 0,
    featured: true,
    bestseller: false,
    new: true,
  },
  {
    id: 3,
    name: "Luxury Skincare Set",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1570554886111-e80fcca6a029",
    influencer: "Emma Watson",
    influencerId: 3,
    category: "Beauty",
    rating: 4.7,
    reviews: 156,
    discount: 10,
    featured: true,
    bestseller: false,
    new: false,
  },
  {
    id: 4,
    name: "Smart Home Assistant",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc",
    influencer: "David Chen",
    influencerId: 4,
    category: "Technology",
    rating: 4.6,
    reviews: 132,
    discount: 0,
    featured: false,
    bestseller: true,
    new: false,
  },
  {
    id: 5,
    name: "Gourmet Cooking Kit",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba",
    influencer: "Mia Rodriguez",
    influencerId: 5,
    category: "Food",
    rating: 4.8,
    reviews: 98,
    discount: 5,
    featured: false,
    bestseller: false,
    new: true,
  },
  {
    id: 6,
    name: "Travel Essentials Bundle",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1553531384-cc64ac80f931",
    influencer: "James Wilson",
    influencerId: 6,
    category: "Travel",
    rating: 4.5,
    reviews: 87,
    discount: 0,
    featured: false,
    bestseller: false,
    new: true,
  },
  {
    id: 7,
    name: "Designer Sunglasses",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
    influencer: "Sophia Martinez",
    influencerId: 1,
    category: "Fashion",
    rating: 4.9,
    reviews: 176,
    discount: 0,
    featured: true,
    bestseller: true,
    new: false,
  },
  {
    id: 8,
    name: "Protein Supplement Pack",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9",
    influencer: "Alex Johnson",
    influencerId: 2,
    category: "Fitness",
    rating: 4.7,
    reviews: 210,
    discount: 20,
    featured: false,
    bestseller: true,
    new: false,
  },
  {
    id: 9,
    name: "Wireless Earbuds Pro",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1631867675167-1bb40bee04a5",
    influencer: "David Chen",
    influencerId: 4,
    category: "Technology",
    rating: 4.8,
    reviews: 178,
    discount: 0,
    featured: true,
    bestseller: false,
    new: true,
  },
  {
    id: 10,
    name: "Vegan Cookbook",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    influencer: "Mia Rodriguez",
    influencerId: 5,
    category: "Food",
    rating: 4.6,
    reviews: 92,
    discount: 0,
    featured: true,
    bestseller: false,
    new: false,
  },
  {
    id: 11,
    name: "Compact Camera",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    influencer: "James Wilson",
    influencerId: 6,
    category: "Travel",
    rating: 4.7,
    reviews: 124,
    discount: 10,
    featured: true,
    bestseller: false,
    new: false,
  },
  {
    id: 12,
    name: "Hydrating Face Mask",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273",
    influencer: "Emma Watson",
    influencerId: 3,
    category: "Beauty",
    rating: 4.9,
    reviews: 215,
    discount: 0,
    featured: true,
    bestseller: true,
    new: false,
  },
];

// Categories for filtering
const categories = [
  "All",
  "Fashion",
  "Beauty",
  "Fitness",
  "Technology",
  "Food",
  "Travel",
];

// Animation variants - defined outside component to avoid re-creation on each render
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const scaleUpVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.4 },
    },
  },
  exit: (direction) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.4 },
    },
  }),
};

// Product Card Component - moved outside main component to avoid re-creation
function ProductCard({ product }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group"
    >
      <Card className="overflow-hidden h-full border border-purple-100 dark:border-purple-900/30 hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900">
        <div className="relative">
          <div className="relative h-64 overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Influencer badge */}
            <div className="absolute top-2 left-2 z-10">
              <Link
                href={`/influencer-marketplace/influencer/${product.influencerId}`}
              >
                <Badge className="flex items-center gap-1.5 px-2 py-1 bg-white/90 dark:bg-black/70 backdrop-blur-sm text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/30 hover:bg-white dark:hover:bg-black/80 transition-colors">
                  <Avatar className="h-4 w-4">
                    <AvatarImage
                      src={
                        influencers.find(
                          (inf) => inf.id === product.influencerId
                        )?.avatar
                      }
                      alt={product.influencer}
                    />
                    <AvatarFallback>
                      {product.influencer.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {product.influencer}
                </Badge>
              </Link>
            </div>
          </div>

          {/* Quick actions */}
          <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
            >
              <Heart className="h-4 w-4 text-gray-700" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            </div>

            <h3 className="font-medium line-clamp-2 h-12">{product.name}</h3>

            <PriceCartButton
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.discount ? product.price : undefined}
             
              image={product.image}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Category Pill Component for horizontal scrolling categories
function CategoryPill({ category, isActive, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap ${
        isActive
          ? "bg-purple-600 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/20"
          : "bg-purple-100/50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/30"
      }`}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="flex items-center gap-1.5">
        {isActive && <Check className="h-3.5 w-3.5" />}
        {category}
      </span>
    </motion.button>
  );
}

// Influencer Slideshow Component
function InfluencerSlideshow({ influencers }) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);
  const isMobile = useMobile();

  // Calculate current index with wrap-around
  const featuredInfluencers = influencers.filter((inf) => inf.featured);
  const currentIndex =
    ((page % featuredInfluencers.length) + featuredInfluencers.length) %
    featuredInfluencers.length;
  const currentInfluencer = featuredInfluencers[currentIndex];

  // Handle navigation
  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        paginate(1);
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, page]);

  // Products for current influencer
  const influencerProducts = products
    .filter((product) => product.influencerId === currentInfluencer.id)
    .slice(0, 3);

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
      {/* Navigation buttons */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-20">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-white/80 dark:bg-black/50 shadow-md text-purple-700 dark:text-purple-300"
          onClick={() => paginate(-1)}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="absolute top-1/2 right-4 -translate-y-1/2 z-20">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-white/80 dark:bg-black/50 shadow-md text-purple-700 dark:text-purple-300"
          onClick={() => paginate(1)}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="w-full"
        >
          <div className="relative">
            {/* Background Image */}
            <div className="absolute inset-0 h-[500px]">
              <div className="relative w-full h-full">
                <Image
                  src={currentInfluencer.background}
                  alt={currentInfluencer.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Influencer Profile - Enhanced */}
                <div className="md:col-span-4">
                  <div className="bg-white/15 backdrop-blur-md p-6 rounded-xl border border-white/30">
                    <div className="flex flex-col items-center text-center">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative mb-6"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-50" />
                        <Avatar className="h-28 w-28 border-4 border-white/50 shadow-2xl relative">
                          <AvatarImage
                            src={currentInfluencer.avatar}
                            alt={currentInfluencer.name}
                          />
                          <AvatarFallback>
                            {currentInfluencer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>

                      <h3 className="text-2xl font-bold text-white mb-2">
                        {currentInfluencer.name}
                      </h3>

                      <Badge className="bg-purple-600/90 text-white mb-3">
                        {currentInfluencer.category}
                      </Badge>

                      <div className="flex items-center text-white/90 text-sm mb-4">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{currentInfluencer.followers} followers</span>
                      </div>

                      <p className="text-white/80 text-sm mb-6">
                        {currentInfluencer.bio}
                      </p>

                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        asChild
                      >
                        <Link
                          href={`/influencer-marketplace/influencer/${currentInfluencer.id}`}
                        >
                          View Store
                        </Link>
                      </Button>

                      <div className="flex justify-center gap-3 mt-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full bg-white/10 hover:bg-white/20 text-white"
                        >
                          <Instagram className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full bg-white/10 hover:bg-white/20 text-white"
                        >
                          <Twitter className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full bg-white/10 hover:bg-white/20 text-white"
                        >
                          <Youtube className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Products Grid */}
                <div className="md:col-span-8">
                  <div className="grid grid-cols-3 gap-4">
                    {influencerProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        className="group relative"
                        whileHover={{ y: -5 }}
                      >
                        <div className="relative h-48 rounded-lg overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform">
                            <PriceCartButton
                              id={product.id}
                              name={product.name}
                              price={product.price}
                              originalPrice={product.discount ? product.price : undefined}
                              discount={product.discount}
                              image={product.image}
                            />
                          </div>
                        </div>
                        <div className="mt-2">
                          <h4 className="font-medium text-white text-sm line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="text-white/80 text-xs mt-1">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {featuredInfluencers.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? "w-6 bg-purple-600"
                : "w-2 bg-purple-200 dark:bg-purple-800"
            }`}
            onClick={() => setPage([index, index > currentIndex ? 1 : -1])}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function InfluencerMarketplace() {
  // State management
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [influencerFilter, setInfluencerFilter] = useState("All");
  const [isAnimationsEnabled, setIsAnimationsEnabled] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const categoriesRef = useRef(null);
  const isMobile = useMobile();
  const {
    followedInfluencers,
    followInfluencer,
    unfollowInfluencer,
    isFollowing,
  } = useFollowedInfluencers();
  const { toast } = useToast();

  // Refs for scroll animations
  const heroRef = useRef(null);
  const featuredInfluencersRef = useRef(null);
  const productsAndCategoriesRef = useRef(null);
  const trendingProductsRef = useRef(null);
  const ctaRef = useRef(null);

  // InView hooks for scroll animations
  const isHeroInView = useInView(heroRef, { once: true });
  const isFeaturedInfluencersInView = useInView(featuredInfluencersRef, {
    once: true,
  });
  const isProductsAndCategoriesInView = useInView(productsAndCategoriesRef, {
    once: true,
  });
  const isTrendingProductsInView = useInView(trendingProductsRef, {
    once: true,
  });
  const isCtaInView = useInView(ctaRef, { once: true });

  // Enable client-side animations after hydration
  useEffect(() => {
    setIsAnimationsEnabled(true);
  }, []);

  // Scroll categories horizontally
  const scrollCategories = (direction) => {
    if (categoriesRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      categoriesRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
      setScrollPosition(categoriesRef.current.scrollLeft + scrollAmount);
    }
  };

  // Filter products based on category, search query, and influencer
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.influencer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesInfluencer =
      influencerFilter === "All" ||
      product.influencerId === Number.parseInt(influencerFilter, 10);
    return matchesCategory && matchesSearch && matchesInfluencer;
  });

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "featured":
        return a.featured ? -1 : 1;
      case "newest":
        return a.new ? -1 : 1;
      case "bestselling":
        return a.bestseller ? -1 : 1;
      case "priceAsc":
        return a.price - b.price;
      case "priceDesc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // Generate deterministic particle positions for animations
  const heroParticles = Array.from({ length: 20 }).map((_, i) => ({
    id: `hero-particle-${i}`,
    width: 5 + (i % 4) * 5,
    height: 5 + (i % 4) * 5,
    left: `${(i * 5) % 100}%`,
    top: `${(i * 7) % 100}%`,
    yMovement: -50 - (i % 5) * 10,
    xMovement: (i % 10) - 5,
    duration: 5 + (i % 5),
    delay: i * 0.3,
  }));

  const ctaParticles = Array.from({ length: 15 }).map((_, i) => ({
    id: `cta-particle-${i}`,
    width: 5 + (i % 3) * 5,
    height: 5 + (i % 3) * 5,
    left: `${(i * 7) % 100}%`,
    top: `${(i * 5) % 100}%`,
    yMovement: -50 - (i % 5) * 10,
    xMovement: (i % 10) - 5,
    duration: 5 + (i % 5),
    delay: i * 0.3,
  }));

  // Function to handle following/unfollowing an influencer
  const handleFollowToggle = (influencer) => {
    if (isFollowing(influencer.id)) {
      unfollowInfluencer(influencer.id);
      toast({
        title: "Unfollowed",
        description: `You are no longer following ${influencer.name}`,
      });
    } else {
      followInfluencer(influencer.id);
      toast({
        title: "Following",
        description: `You are now following ${influencer.name}`,
      });
    }
  };

  return (
    <MainLayout hideFittingRoom hideRoomVisualizer hideShopCategory={false}>
      <div className="space-y-16">
        {/* Enhanced Hero Section */}
        <section
          ref={heroRef}
          className="relative overflow-hidden rounded-2xl min-h-[600px] flex items-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-violet-900/95 z-10"></div>

          {/* Dynamic Background Grid */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 grid grid-cols-6 gap-1">
              {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-lg"
                />
              ))}
            </div>
          </div>

          <div className="relative z-20 container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-left space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-purple-300" />
                  </motion.div>
                  <span className="text-sm font-medium text-purple-200">
                    Discover Exclusive Products
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-violet-200">
                    Influencer
                  </span>
                  <br />
                  <span className="text-white">Marketplace</span>
                </h1>

                <p className="text-lg md:text-xl text-purple-100/80 max-w-lg">
                  Connect with top creators, shop their exclusive collections,
                  and discover trending products curated just for you.
                </p>

                <div className="flex flex-wrap gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 h-12 px-8 shadow-lg font-medium"
                      onClick={() => {
                        const productsSection =
                          document.getElementById("products-section");
                        if (productsSection) {
                          productsSection.scrollIntoView({
                            behavior: "smooth",
                          });
                        }
                      }}
                    >
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Shop Collections
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200" />
                    <Link
                      href="/category/influencerhub/join"
                      className="relative flex items-center gap-2 px-8 h-12 rounded-lg bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Users className="h-5 w-5" />
                      Join Creator Hub
                      <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:block relative"
              >
                <div className="relative h-[500px] w-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-2xl backdrop-blur-sm"></div>
                  <motion.div
                    animate={{
                      scale: [1, 1.02, 1],
                      rotate: [0, 1, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="absolute inset-4 rounded-xl overflow-hidden"
                  >
                    <Image
                      src="/creator-hub.jpg" // Make sure to add this image to your public folder
                      alt="Creator Hub"
                      fill
                      className="object-cover rounded-xl"
                      priority
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Rest of the content */}
        <section ref={featuredInfluencersRef} className="relative">
          <motion.div
            initial="hidden"
            animate={isFeaturedInfluencersInView ? "visible" : "hidden"}
            variants={fadeInUpVariants}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Featured Influencers
              </h2>
              <p className="text-muted-foreground mt-1">
                Discover top creators and their exclusive collections
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200" />
              <Link
                href="/category/influencerhub/all-influencers"
                className="relative flex items-center gap-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                <span className="absolute right-0 -bottom-1 w-full h-[2px] bg-gradient-to-r from-purple-600 to-pink-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isFeaturedInfluencersInView ? "visible" : "hidden"}
            variants={fadeInUpVariants}
          >
            <InfluencerSlideshow influencers={influencers} />
          </motion.div>
        </section>

        {/* Integrated Products & Categories Section */}
        <section
          ref={productsAndCategoriesRef}
          className="relative pt-8"
          id="products-section"
        >
          <motion.div
            initial="hidden"
            animate={isProductsAndCategoriesInView ? "visible" : "hidden"}
            variants={fadeInUpVariants}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground mt-1">
              Browse products from all influencers across your favorite
              categories
            </p>
          </motion.div>

          {/* Horizontal Scrollable Categories */}
          <div className="relative mb-10">
            {!isMobile && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/80 dark:bg-black/50 shadow-md text-purple-700 dark:text-purple-300"
                  onClick={() => scrollCategories("left")}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
            )}

            <div
              ref={categoriesRef}
              className="flex overflow-x-auto scrollbar-hide py-2 px-8 gap-3 snap-x"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {categories.map((category) => (
                <div key={category} className="snap-start">
                  <CategoryPill
                    category={category}
                    isActive={selectedCategory === category}
                    onClick={() => setSelectedCategory(category)}
                  />
                </div>
              ))}
            </div>

            {!isMobile && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/80 dark:bg-black/50 shadow-md text-purple-700 dark:text-purple-300"
                  onClick={() => scrollCategories("right")}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 w-full md:w-[250px] bg-white dark:bg-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 md:gap-4">
              {/* Influencer Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {influencerFilter === "All"
                      ? "All Influencers"
                      : influencers.find(
                          (inf) =>
                            inf.id === Number.parseInt(influencerFilter, 10)
                        )?.name || "All Influencers"}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setInfluencerFilter("All")}
                      className="cursor-pointer"
                    >
                      All Influencers
                      {influencerFilter === "All" && (
                        <svg
                          className="h-4 w-4 ml-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {influencers.map((influencer) => (
                      <DropdownMenuItem
                        key={influencer.id}
                        onClick={() =>
                          setInfluencerFilter(influencer.id.toString())
                        }
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage
                              src={influencer.avatar}
                              alt={influencer.name}
                            />
                            <AvatarFallback>
                              {influencer.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {influencer.name}
                        </div>
                        {influencerFilter === influencer.id.toString() && (
                          <svg
                            className="h-4 w-4 ml-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setSortOption("featured")}
                      className="cursor-pointer"
                    >
                      Featured
                      {sortOption === "featured" && (
                        <svg
                          className="h-4 w-4 ml-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("newest")}
                      className="cursor-pointer"
                    >
                      Newest
                      {sortOption === "newest" && (
                        <svg
                          className="h-4 w-4 ml-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("bestselling")}
                      className="cursor-pointer"
                    >
                      Best Selling
                      {sortOption === "bestselling" && (
                        <svg
                          className="h-4 w-4 ml-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("priceAsc")}
                      className="cursor-pointer"
                    >
                      Price: Low to High
                      {sortOption === "priceAsc" && (
                        <svg
                          className="h-4 w-4 ml-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("priceDesc")}
                      className="cursor-pointer"
                    >
                      Price: High to Low
                      {sortOption === "priceDesc" && (
                        <svg
                          className="h-4 w-4 ml-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("rating")}
                      className="cursor-pointer"
                    >
                      Highest Rated
                      {sortOption === "rating" && (
                        <svg
                          className="h-4 w-4 ml-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Products Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate={isProductsAndCategoriesInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
              <Package className="h-12 w-12 mx-auto text-purple-300 mb-4" />
              <p className="text-lg font-medium">No products found</p>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters to find what you're looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory("All");
                  setInfluencerFilter("All");
                  setSearchQuery("");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="flex justify-center mt-10">
              <Button variant="outline" size="lg" className="px-8">
                Load More
              </Button>
            </div>
          )}

          {/* Influencer Hub Promo */}
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Are You an Influencer?
                </h3>
                <p className="text-white/80">
                  Join our hub and start monetizing your influence today
                </p>
              </div>
              <Button
                className="bg-white text-purple-700 hover:bg-white/90"
                asChild
              >
                <Link href="/category/influencerhub/join">
                  Join Influencer Hub
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Trending Products Section */}
        <section
          ref={trendingProductsRef}
          className="relative pt-8"
          id="trending-products"
        >
          <motion.div
            initial="hidden"
            animate={isTrendingProductsInView ? "visible" : "hidden"}
            variants={fadeInUpVariants}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Trending Products
              </h2>
              <p className="text-muted-foreground mt-1">
                Discover what's popular right now
              </p>
            </div>
          </motion.div>

          {/* Products Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate={isTrendingProductsInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            {products
              .filter((product) => product.featured || product.bestseller)
              .slice(0, 8)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </motion.div>

          <div className="flex justify-center mt-10">
            <Button variant="outline" size="lg" className="px-8">
              View All Trending Products
            </Button>
          </div>
        </section>

        {/* Join Influencer Hub CTA */}
        <section
          ref={ctaRef}
          className="relative overflow-hidden rounded-2xl mt-16"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737711867-e3b97375f902')] bg-cover bg-center"></div>

          {/* Background animation - client-side only */}
          <div className="absolute inset-0 z-0">
            {isAnimationsEnabled && (
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.1, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737711867-e3b97375f902')] bg-cover bg-center"></div>
              </motion.div>
            )}
          </div>

          <div className="relative z-20 px-6 py-12 md:py-16 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <motion.div
                className="text-white max-w-xl"
                initial="hidden"
                animate={isCtaInView ? "visible" : "hidden"}
                variants={{
                  hidden: { opacity: 0, x: -30 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
                }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Join Our Influencer Hub
                </h2>

                <p className="text-lg text-white/80 mb-6">
                  Join our exclusive network of creators and monetize your
                  influence. Showcase your products to millions of potential
                  customers on UMetha's premium marketplace.
                </p>

                <ul className="space-y-2 mb-8">
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Create your own branded storefront
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Earn competitive commissions on every sale
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Access detailed analytics and performance insights
                  </li>
                </ul>

                <Button
                  size="lg"
                  className="bg-white text-purple-700 hover:bg-white/90"
                  asChild
                >
                  <Link href="/category/influencerhub/join">Apply Now</Link>
                </Button>
              </motion.div>

              <motion.div
                initial="hidden"
                animate={isCtaInView ? "visible" : "hidden"}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: 0.2 },
                  },
                }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 max-w-sm w-full"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  Success by the Numbers
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      500+
                    </div>
                    <div className="text-sm text-white/70">
                      Active Influencers
                    </div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      $2.5M
                    </div>
                    <div className="text-sm text-white/70">Monthly Sales</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      15M+
                    </div>
                    <div className="text-sm text-white/70">
                      Monthly Visitors
                    </div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      25%
                    </div>
                    <div className="text-sm text-white/70">Avg. Commission</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Animated particles - client-side only */}
          <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
            {isAnimationsEnabled && (
              <>
                {ctaParticles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-white/20 backdrop-blur-sm"
                    style={{
                      width: particle.width,
                      height: particle.height,
                      left: particle.left,
                      top: particle.top,
                    }}
                    animate={{
                      y: [0, particle.yMovement],
                      x: [0, particle.xMovement],
                      opacity: [0, 0.7, 0],
                      scale: [0, 1, 0.5],
                    }}
                    transition={{
                      duration: particle.duration,
                      repeat: Infinity,
                      delay: particle.delay,
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
