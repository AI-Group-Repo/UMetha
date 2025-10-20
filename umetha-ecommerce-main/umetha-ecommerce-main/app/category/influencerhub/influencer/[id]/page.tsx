"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Heart,
  ShoppingBag,
  Filter,
  Share2,
  Instagram,
  Twitter,
  Youtube,
  Check,
  MessageCircle,
  Users,
  TrendingUp,
  Award,
  Package,
  Bookmark,
  ChevronDown,
  ExternalLink,
  ShoppingCart,
  Grid,
  List,
  UserPlus,
  UserMinus,
  ChevronRight,
  ArrowUpDown,
  Calendar,
  Clock,
  Tag,
  Percent,
  Mail,
  Bell,
  Truck,
  Gift,
  ShieldCheck,
  CreditCard,
  MapPin,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import MainLayout from "@/components/main-layout";
import { useToast } from "@/hooks/use-toast";
import { useFollowedInfluencers } from "@/context/followed-influencers-context";
import { cn } from "@/lib/utils";

// Sample data for influencers (same as in marketplace page)
const influencers = [
  {
    id: 1,
    name: "Sophia Martinez",
    handle: "@sophiastyle",
    avatar: "/placeholder.svg?height=400&width=400",
    followers: "2.4M",
    category: "Fashion",
    verified: true,
    featured: true,
    background: "/placeholder.svg?height=600&width=1200",
    products: 48,
    engagement: "4.8%",
    bio: "Fashion enthusiast and style curator. I believe in sustainable fashion and empowering people through self-expression. Join me on this stylish journey!",
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
    avatar: "/placeholder.svg?height=400&width=400",
    followers: "1.8M",
    category: "Fitness",
    verified: true,
    featured: true,
    background: "/placeholder.svg?height=600&width=1200",
    products: 36,
    engagement: "5.2%",
    bio: "Certified personal trainer and nutrition expert. I help people transform their lives through fitness and healthy habits. Let's crush those goals together!",
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
    avatar: "/placeholder.svg?height=400&width=400",
    followers: "3.1M",
    category: "Beauty",
    verified: true,
    featured: false,
    background: "/placeholder.svg?height=600&width=1200",
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
    avatar: "/placeholder.svg?height=400&width=400",
    followers: "1.2M",
    category: "Technology",
    verified: true,
    featured: false,
    background: "/placeholder.svg?height=600&width=1200",
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
    avatar: "/placeholder.svg?height=400&width=400",
    followers: "950K",
    category: "Food",
    verified: true,
    featured: false,
    background: "/placeholder.svg?height=600&width=1200",
    products: 32,
    engagement: "6.1%",
    bio: "Chef and food creator. I believe good food brings people together. Join me as I explore flavors from around the world and create easy recipes for everyone.",
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
    avatar: "/placeholder.svg?height=400&width=400",
    followers: "1.5M",
    category: "Travel",
    verified: true,
    featured: false,
    background: "/placeholder.svg?height=600&width=1200",
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

// Sample data for products (same as in marketplace page)
const products = [
  {
    id: 1,
    name: "Premium Fitness Watch",
    price: 199.99,
    image: "/placeholder.svg?height=400&width=400",
    influencer: "Alex Johnson",
    influencerId: 2,
    category: "Fitness",
    rating: 4.8,
    reviews: 245,
    discount: 15,
    featured: true,
    bestseller: true,
    new: false,
    description:
      "Track your workouts, monitor your heart rate, and stay connected with this premium fitness watch. Water-resistant and long battery life.",
  },
  {
    id: 2,
    name: "Signature Perfume Collection",
    price: 129.99,
    image: "/placeholder.svg?height=400&width=400",
    influencer: "Sophia Martinez",
    influencerId: 1,
    category: "Beauty",
    rating: 4.9,
    reviews: 189,
    discount: 0,
    featured: true,
    bestseller: false,
    new: true,
    description:
      "A luxurious fragrance collection that captures the essence of modern elegance. Notes of jasmine, vanilla, and sandalwood create a captivating scent.",
  },
  {
    id: 3,
    name: "Luxury Skincare Set",
    price: 89.99,
    image: "/placeholder.svg?height=400&width=400",
    influencer: "Emma Watson",
    influencerId: 3,
    category: "Beauty",
    rating: 4.7,
    reviews: 156,
    discount: 10,
    featured: true,
    bestseller: false,
    new: false,
    description:
      "A complete skincare routine with cleanser, toner, serum, and moisturizer. Made with natural ingredients for radiant, healthy skin.",
  },
  {
    id: 4,
    name: "Smart Home Assistant",
    price: 149.99,
    image: "/placeholder.svg?height=400&width=400",
    influencer: "David Chen",
    influencerId: 4,
    category: "Technology",
    rating: 4.6,
    reviews: 132,
    discount: 0,
    featured: false,
    bestseller: true,
    new: false,
    description:
      "Control your home with voice commands, play music, get weather updates, and more with this intelligent smart home assistant.",
  },
  {
    id: 5,
    name: "Gourmet Cooking Kit",
    price: 79.99,
    image: "/placeholder.svg?height=400&width=400",
    influencer: "Mia Rodriguez",
    influencerId: 5,
    category: "Food",
    rating: 4.8,
    reviews: 98,
    discount: 5,
    featured: false,
    bestseller: false,
    new: true,
    description:
      "Everything you need to create restaurant-quality meals at home. Includes premium spices, oils, and cooking tools.",
  },
  {
    id: 6,
    name: "Travel Essentials Bundle",
    price: 119.99,
    image: "/placeholder.svg?height=400&width=400",
    influencer: "James Wilson",
    influencerId: 6,
    category: "Travel",
    rating: 4.5,
    reviews: 87,
    discount: 0,
    featured: false,
    bestseller: false,
    new: true,
    description:
      "The perfect travel companion with compact toiletries, neck pillow, eye mask, and more for comfortable journeys.",
  },
  {
    id: 7,
    name: "Designer Sunglasses",
    price: 249.99,
    image: "/placeholder.svg?height=400&width=400",
    influencer: "Sophia Martinez",
    influencerId: 1,
    category: "Fashion",
    rating: 4.9,
    reviews: 176,
    discount: 0,
    featured: true,
    bestseller: true,
    new: false,
    description:
      "Stylish UV-protected sunglasses with a lightweight frame and polarized lenses. The perfect accessory for any outfit.",
  },
  {
    id: 8,
    name: "Protein Supplement Pack",
    price: 59.99,
    image: "/placeholder.svg?height=400&width=400",
    influencer: "Alex Johnson",
    influencerId: 2,
    category: "Fitness",
    rating: 4.7,
    reviews: 210,
    discount: 20,
    featured: false,
    bestseller: true,
    new: false,
    description:
      "High-quality protein supplements to support your fitness goals. Available in multiple flavors with no artificial ingredients.",
  },
  {
    id: 9,
    name: "Casual Summer Dress",
    price: 79.99,
    image: "/placeholder.svg?height=400&width=400",
    influencer: "Sophia Martinez",
    influencerId: 1,
    category: "Fashion",
    rating: 4.8,
    reviews: 142,
    discount: 10,
    featured: false,
    bestseller: false,
    new: true,
    description:
      "A lightweight, flowy summer dress perfect for warm days. Made from sustainable materials with a flattering silhouette.",
  },
  {
    id: 10,
    name: "Premium Yoga Mat",
    price: 49.99,
    image: "/placeholder.svg?height=400&width=400",
    influencer: "Alex Johnson",
    influencerId: 2,
    category: "Fitness",
    rating: 4.9,
    reviews: 178,
    discount: 0,
    featured: true,
    bestseller: false,
    new: false,
    description:
      "Extra thick, non-slip yoga mat for comfortable practice. Eco-friendly materials and includes a carrying strap.",
  },
];

export default function InfluencerProfile() {
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [viewMode, setViewMode] = useState("grid");
  const [isFollowing, setIsFollowing] = useState(false);
  const [sortOption, setSortOption] = useState("featured");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [wishlistedProducts, setWishlistedProducts] = useState([]);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { toast } = useToast();

  const influencerId = Number(params.id);
  const influencer = influencers.find((inf) => inf.id === influencerId);
  const influencerProducts = products.filter(
    (product) => product.influencerId === influencerId
  );

  // Handle hydration
  useEffect(() => {
    setMounted(true);

    // Scroll listener for sticky nav effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  // Sort products based on selected option
  const sortProducts = (products) => {
    switch (sortOption) {
      case "featured":
        return [...products].sort(
          (a, b) => Number(b.featured) - Number(a.featured)
        );
      case "newest":
        return [...products].sort((a, b) => Number(b.new) - Number(a.new));
      case "bestselling":
        return [...products].sort(
          (a, b) => Number(b.bestseller) - Number(a.bestseller)
        );
      case "priceAsc":
        return [...products].sort((a, b) => a.price - b.price);
      case "priceDesc":
        return [...products].sort((a, b) => b.price - a.price);
      default:
        return products;
    }
  };

  // Filter products by category
  const filterProducts = (products) => {
    if (categoryFilter === "all") return products;
    return products.filter(
      (product) =>
        product.category.toLowerCase() === categoryFilter.toLowerCase()
    );
  };

  // Final products after sorting and filtering
  const processedProducts = sortProducts(filterProducts(influencerProducts));

  // Toggle wishlist
  const toggleWishlist = (productId) => {
    setWishlistedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );

    const product = influencerProducts.find((p) => p.id === productId);
    toast({
      title: wishlistedProducts.includes(productId)
        ? "Removed from wishlist"
        : "Added to wishlist",
      description: wishlistedProducts.includes(productId)
        ? `${product.name} has been removed from your wishlist`
        : `${product.name} has been added to your wishlist`,
      duration: 2000,
    });
  };

  // Add to cart
  const addToCart = (product) => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
      duration: 2000,
    });
  };

  // Open quick view
  const openQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  // Handle follow/unfollow
  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing
        ? `You've unfollowed ${influencer.name}`
        : `You're now following ${influencer.name}`,
      duration: 2000,
    });
  };

  // If influencer not found
  if (!influencer) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold mb-4">Influencer not found</h1>
          <p className="text-gray-500 mb-6">
            The influencer you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/category/influencerhub">Back to Marketplace</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Animation variants
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

  return (
    <MainLayout>
      {/* Hero Section with Immersive Background */}
      <section className="relative">
        <div className="h-[50vh] md:h-[60vh] relative overflow-hidden">
          <Image
            src={influencer.background || "/placeholder.svg"}
            alt={`${influencer.name} cover`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"></div>

          {/* Floating decorative elements */}
          <motion.div
            className="absolute inset-0 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-2 w-2 rounded-full bg-white/30"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </motion.div>

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center z-10">
            <div className="container mx-auto px-4">
              <motion.div
                className="max-w-3xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.2,
                    }}
                  >
                    <Avatar className="h-24 w-24 border-4 border-white/70 shadow-xl">
                      <AvatarImage
                        src={influencer.avatar}
                        alt={influencer.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-2xl">
                        {influencer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>

                  <div>
                    <motion.div
                      className="flex items-center gap-2 mb-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <h1 className="text-3xl md:text-4xl font-bold text-white">
                        {influencer.name}
                      </h1>
                      {influencer.verified && (
                        <Badge className="bg-blue-500/90 text-white">
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <p className="text-white/90 text-lg">
                        {influencer.handle}
                      </p>
                      <Badge className="mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {influencer.category}
                      </Badge>
                    </motion.div>
                  </div>
                </div>

                <motion.p
                  className="text-white/85 text-lg max-w-2xl mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {influencer.bio}
                </motion.p>

                <motion.div
                  className="flex flex-wrap items-center gap-6 mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="flex items-center text-white/90">
                    <Users className="h-5 w-5 mr-2 text-pink-400" />
                    <span className="font-medium text-lg">
                      {influencer.followers}
                    </span>
                    <span className="ml-1">followers</span>
                  </div>

                  <div className="flex items-center text-white/90">
                    <Package className="h-5 w-5 mr-2 text-purple-400" />
                    <span className="font-medium text-lg">
                      {influencer.products}
                    </span>
                    <span className="ml-1">products</span>
                  </div>

                  <div className="flex items-center text-white/90">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
                    <span className="font-medium text-lg">
                      {influencer.engagement}
                    </span>
                    <span className="ml-1">engagement</span>
                  </div>
                </motion.div>

                <motion.div
                  className="flex flex-wrap gap-3 mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Button
                    className={cn(
                      "px-6 font-medium",
                      isFollowing
                        ? "bg-white text-purple-700 hover:bg-white/90"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    )}
                    onClick={handleFollowToggle}
                  >
                    {isFollowing ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>

                  <TooltipProvider>
                    {Object.entries(influencer.social).map(
                      ([platform, handle]) => {
                        const Icon = {
                          instagram: Instagram,
                          twitter: Twitter,
                          youtube: Youtube,
                        }[platform];

                        return (
                          <Tooltip key={platform}>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                                asChild
                              >
                                <a
                                  href={`https://${platform}.com/${handle}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Icon className="h-4 w-4" />
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {platform.charAt(0).toUpperCase() +
                                  platform.slice(1)}
                                : @{handle}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      }
                    )}

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share profile</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky navigation bar */}
      <div
        className={cn(
          "sticky top-0 z-30 bg-background/80 backdrop-blur-md transition-all duration-300 border-b shadow-sm py-3",
          scrolled ? "translate-y-0" : "translate-y-0 md:-translate-y-full"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={influencer.avatar} alt={influencer.name} />
                <AvatarFallback>{influencer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{influencer.name}</p>
                <p className="text-xs text-muted-foreground">
                  {influencer.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className={cn(activeTab === "products" && "bg-secondary")}
                onClick={() => setActiveTab("products")}
              >
                Products
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(activeTab === "collections" && "bg-secondary")}
                onClick={() => setActiveTab("collections")}
              >
                Collections
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(activeTab === "about" && "bg-secondary")}
                onClick={() => setActiveTab("about")}
              >
                About
              </Button>
            </div>

            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              View Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Announcement Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3">
        <div className="container mx-auto px-4">
          <div className="relative">
            <div className="flex items-center justify-center text-sm font-medium">
              <div className="hidden sm:flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                <span>Exclusive Deal:</span>
              </div>
              <p className="mx-2">
                Free shipping on all orders over $50 with code{" "}
                <span className="font-bold underline">FREESHIP50</span>
              </p>
              <Badge variant="outline" className="border-white/40 ml-2">
                Limited Time
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Store Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-100 dark:border-purple-900/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Truck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">
                  On orders over $50
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-100 dark:border-purple-900/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-muted-foreground">
                  100% secure checkout
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-100 dark:border-purple-900/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Quality Guarantee</p>
                <p className="text-xs text-muted-foreground">
                  30-day satisfaction
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-100 dark:border-purple-900/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Gift className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Special Offers</p>
                <p className="text-xs text-muted-foreground">
                  New deals every week
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collection Highlight Banner */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl overflow-hidden mb-8 border border-purple-200 dark:border-purple-800/20">
          <div className="flex flex-col md:flex-row">
            <div className="p-6 md:p-8 lg:p-10 space-y-4 md:w-1/2">
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                New Arrival
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold">
                Exclusive {influencer.name} Collection
              </h2>
              <p className="text-muted-foreground">
                Discover the latest arrivals hand-picked by {influencer.name}.
                Limited quantities available.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700">
                  Shop Now
                </Button>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-purple-700 dark:text-purple-400 font-medium">
                    Limited time offer
                  </span>
                </div>
              </div>
            </div>
            <div className="relative md:w-1/2 h-48 md:h-auto">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Collection Banner"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <TabsList className="bg-background/50 backdrop-blur-sm border p-1 rounded-full">
              <TabsTrigger
                value="products"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
              >
                All Products
              </TabsTrigger>
              <TabsTrigger
                value="collections"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
              >
                Collections
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
              >
                About
              </TabsTrigger>
            </TabsList>

            {activeTab === "products" && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Filter className="h-4 w-4" />
                      {categoryFilter === "all"
                        ? "All Categories"
                        : categoryFilter}
                      <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
                      All Categories
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setCategoryFilter("Fashion")}
                    >
                      Fashion
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setCategoryFilter("Beauty")}
                    >
                      Beauty
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setCategoryFilter("Fitness")}
                    >
                      Fitness
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                      Sort by
                      <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuItem onClick={() => setSortOption("featured")}>
                      Featured
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption("newest")}>
                      Newest
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("bestselling")}
                    >
                      Best Selling
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption("priceAsc")}>
                      Price: Low to High
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("priceDesc")}
                    >
                      Price: High to Low
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex border rounded-md overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "rounded-none px-3",
                      viewMode === "grid" && "bg-secondary"
                    )}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "rounded-none px-3",
                      viewMode === "list" && "bg-secondary"
                    )}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <TabsContent value="products" className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${categoryFilter}-${sortOption}-${viewMode}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "grid gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    : "grid-cols-1"
                )}
              >
                {processedProducts.length > 0 ? (
                  processedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      layout
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <Card
                        className={cn(
                          "overflow-hidden h-full border border-purple-100/40 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all duration-300",
                          viewMode === "list" && "flex sm:flex-row"
                        )}
                      >
                        <div
                          className={cn(
                            "relative",
                            viewMode === "list"
                              ? "w-[120px] sm:w-[200px]"
                              : "w-full"
                          )}
                        >
                          <div
                            className={cn(
                              "relative overflow-hidden",
                              viewMode === "grid" ? "h-[240px]" : "h-full"
                            )}
                          >
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Overlay for hover effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          {/* Badges */}
                          <div className="absolute top-2 left-2 flex flex-col gap-2">
                            {product.discount > 0 && (
                              <Badge className="bg-red-500 text-white font-medium px-2 shadow-sm">
                                {product.discount}% OFF
                              </Badge>
                            )}
                            {product.new && (
                              <Badge className="bg-green-500 text-white font-medium px-2 shadow-sm">
                                NEW
                              </Badge>
                            )}
                            {product.bestseller && (
                              <Badge className="bg-amber-500 text-white font-medium px-2 shadow-sm">
                                BESTSELLER
                              </Badge>
                            )}
                          </div>

                          {/* Quick actions */}
                          <div className="absolute top-2 right-2 flex flex-col gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm hover:bg-white dark:hover:bg-black/80 shadow-sm"
                                    onClick={() => toggleWishlist(product.id)}
                                  >
                                    <Heart
                                      className={cn(
                                        "h-4 w-4",
                                        wishlistedProducts.includes(product.id)
                                          ? "fill-red-500 text-red-500"
                                          : "text-gray-700 dark:text-gray-300"
                                      )}
                                    />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {wishlistedProducts.includes(product.id)
                                      ? "Remove from wishlist"
                                      : "Add to wishlist"}
                                  </p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm hover:bg-white dark:hover:bg-black/80 shadow-sm"
                                    onClick={() => openQuickView(product)}
                                  >
                                    <ExternalLink className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Quick view</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>

                        <CardContent
                          className={cn(
                            "p-4 md:p-5 flex flex-col",
                            viewMode === "list" && "flex-1"
                          )}
                        >
                          <div
                            className={cn(
                              "space-y-2 md:space-y-3",
                              viewMode === "list" &&
                                "flex flex-col h-full justify-between"
                            )}
                          >
                            <div>
                              <h3 className="font-medium text-base md:text-lg line-clamp-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                {product.name}
                              </h3>

                              <div className="flex items-center mt-1">
                                <div className="flex">
                                  {Array(5)
                                    .fill(0)
                                    .map((_, i) => (
                                      <Star
                                        key={i}
                                        className={cn(
                                          "h-3.5 w-3.5",
                                          i < Math.floor(product.rating)
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300"
                                        )}
                                      />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-1">
                                  ({product.reviews})
                                </span>
                              </div>

                              {viewMode === "list" && (
                                <p className="text-sm text-gray-500 mt-2 line-clamp-2 md:line-clamp-3">
                                  {product.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-2">
                                {product.discount > 0 ? (
                                  <>
                                    <span className="font-semibold text-base md:text-lg">
                                      $
                                      {(
                                        product.price *
                                        (1 - product.discount / 100)
                                      ).toFixed(2)}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                      ${product.price.toFixed(2)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="font-semibold text-base md:text-lg">
                                    ${product.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>

                            <Button
                              className="w-full mt-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                              onClick={() => addToCart(product)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16">
                    <Package className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      No products found
                    </h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      We couldn't find any products matching your criteria. Try
                      adjusting your filters or check back later.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="collections" className="mt-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Featured Collections</h2>
              <Badge variant="outline" className="px-3 py-1">
                4 Collections
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-72">
                    <Image
                      src="/placeholder.svg?height=800&width=1200"
                      alt="Summer Collection"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent group-hover:via-black/40 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <Badge className="w-fit mb-3 bg-pink-500 text-white">
                        New Season
                      </Badge>
                      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-pink-200 transition-colors">
                        Summer Collection
                      </h3>
                      <p className="text-white/80 mb-4">
                        12 premium products for the perfect summer style
                      </p>
                      <Button
                        className="w-fit bg-white text-purple-700 hover:bg-white/90"
                        variant="secondary"
                      >
                        Explore Collection
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-72">
                    <Image
                      src="/placeholder.svg?height=800&width=1200"
                      alt="Essentials"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent group-hover:via-black/40 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <Badge className="w-fit mb-3 bg-purple-500 text-white">
                        Bestsellers
                      </Badge>
                      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-purple-200 transition-colors">
                        Essentials Collection
                      </h3>
                      <p className="text-white/80 mb-4">
                        8 must-have items for your everyday look
                      </p>
                      <Button
                        className="w-fit bg-white text-purple-700 hover:bg-white/90"
                        variant="secondary"
                      >
                        Explore Collection
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-72">
                    <Image
                      src="/placeholder.svg?height=800&width=1200"
                      alt="Limited Edition"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent group-hover:via-black/40 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <Badge className="w-fit mb-3 bg-amber-500 text-white">
                        Exclusive
                      </Badge>
                      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-amber-200 transition-colors">
                        Limited Edition
                      </h3>
                      <p className="text-white/80 mb-4">
                        5 exclusive pieces only available for a limited time
                      </p>
                      <Button
                        className="w-fit bg-white text-purple-700 hover:bg-white/90"
                        variant="secondary"
                      >
                        Explore Collection
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-72">
                    <Image
                      src="/placeholder.svg?height=800&width=1200"
                      alt="Bestsellers"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent group-hover:via-black/40 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <Badge className="w-fit mb-3 bg-blue-500 text-white">
                        Fan Favorites
                      </Badge>
                      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-200 transition-colors">
                        Bestsellers
                      </h3>
                      <p className="text-white/80 mb-4">
                        10 top-rated products loved by our customers
                      </p>
                      <Button
                        className="w-fit bg-white text-purple-700 hover:bg-white/90"
                        variant="secondary"
                      >
                        Explore Collection
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-8 border border-purple-100 dark:border-purple-900/50">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 inline-block text-transparent bg-clip-text mb-6">
                    About {influencer.name}
                  </h2>

                  <div className="prose dark:prose-invert max-w-none text-lg">
                    <p>
                      {influencer.bio} With a passion for{" "}
                      {influencer.category.toLowerCase()} and a dedicated
                      following of {influencer.followers} fans,{" "}
                      {influencer.name} has established a reputation for
                      authenticity and quality.
                    </p>

                    <p>
                      Starting their journey in 2018, {influencer.name} quickly
                      gained recognition for their unique perspective and
                      engaging content. Now, they've partnered with UMetha to
                      bring their curated selection of products directly to you.
                    </p>

                    <p>
                      What sets {influencer.name} apart is their commitment to
                      quality, sustainability, and creating products that truly
                      resonate with their community. Each item in their
                      collection is personally tested and approved, ensuring you
                      receive only the best.
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                      <p className="text-3xl font-bold text-purple-600">
                        {influencer.followers}
                      </p>
                      <p className="text-sm text-gray-500">Followers</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                      <p className="text-3xl font-bold text-pink-600">
                        {influencerProducts.length}+
                      </p>
                      <p className="text-sm text-gray-500">Products</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                      <p className="text-3xl font-bold text-blue-600">
                        {influencer.engagement}
                      </p>
                      <p className="text-sm text-gray-500">Engagement Rate</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-6">
                    Connect with {influencer.name}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(influencer.social).map(
                      ([platform, handle]) => {
                        const Icon = {
                          instagram: Instagram,
                          twitter: Twitter,
                          youtube: Youtube,
                        }[platform];

                        const gradientClass = {
                          instagram: "from-purple-600 to-pink-600",
                          twitter: "from-blue-400 to-blue-600",
                          youtube: "from-red-500 to-red-700",
                        }[platform];

                        return (
                          <Card
                            key={platform}
                            className="overflow-hidden hover:shadow-md transition-all duration-300 group border border-purple-100/50 dark:border-purple-900/30"
                          >
                            <div
                              className={`h-1 w-full bg-gradient-to-r ${gradientClass}`}
                            ></div>
                            <CardContent className="p-6 flex items-center gap-4">
                              <div
                                className={`h-12 w-12 rounded-full bg-gradient-to-r ${gradientClass} flex items-center justify-center text-white`}
                              >
                                <Icon className="h-6 w-6" />
                              </div>
                              <div>
                                <p className="text-lg font-medium capitalize">
                                  {platform}
                                </p>
                                <p className="text-muted-foreground">
                                  @{handle}
                                </p>
                                <a
                                  href={`https://${platform}.com/${handle}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center mt-1"
                                >
                                  Visit profile
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      }
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-2xl font-bold mb-6">
                    Achievements & Recognition
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Card className="p-6 flex items-center gap-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-100 dark:border-amber-900/30">
                      <div className="h-14 w-14 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <Award className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">
                          Top Creator 2023
                        </p>
                        <p className="text-muted-foreground">
                          UMetha Annual Awards
                        </p>
                        <Badge
                          variant="outline"
                          className="mt-2 border-amber-200 text-amber-700 dark:border-amber-700/50 dark:text-amber-400"
                        >
                          Highest Honor
                        </Badge>
                      </div>
                    </Card>

                    <Card className="p-6 flex items-center gap-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-100 dark:border-green-900/30">
                      <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
                        <TrendingUp className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">
                          Fastest Growing Creator
                        </p>
                        <p className="text-muted-foreground">Q2 2023</p>
                        <Badge
                          variant="outline"
                          className="mt-2 border-green-200 text-green-700 dark:border-green-700/50 dark:text-green-400"
                        >
                          500K+ New Followers
                        </Badge>
                      </div>
                    </Card>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 py-12">
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-pink-900 opacity-95"></div>
            <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-10"></div>

            <div className="relative z-10 p-8 md:p-12">
              <div className="max-w-3xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Badge className="bg-white/20 text-white mb-4">
                    Stay Updated
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Get Exclusive Updates from {influencer.name}
                  </h2>
                  <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                    Be the first to know about new products, limited editions,
                    and special offers. Join our community today!
                  </p>
                </motion.div>

                <motion.div
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Input
                    placeholder="Enter your email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-purple-500"
                  />
                  <Button className="bg-white text-purple-700 hover:bg-white/90">
                    <Mail className="h-4 w-4 mr-2" />
                    Subscribe
                  </Button>
                </motion.div>

                <motion.p
                  className="text-white/60 text-xs mt-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  By subscribing, you agree to receive marketing emails. You can
                  unsubscribe at any time.
                </motion.p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-40 w-40 rounded-full bg-white/5"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    scale: 0.5 + Math.random() * 1,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 5 + i * 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* Collaboration CTA */}
      <section className="container mx-auto px-4 my-12">
        <Card className="overflow-hidden border-0 shadow-2xl">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-95"></div>
            <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center mix-blend-overlay"></div>

            {/* Decorative elements */}
            <div className="absolute inset-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-20 w-20 rounded-full bg-white/10"
                  style={{
                    top: `${20 + i * 15}%`,
                    left: `${10 + i * 20}%`,
                    scale: 0.5 + i * 0.3,
                  }}
                  animate={{
                    x: [0, 10, 0],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-white max-w-xl">
                  <Badge className="bg-white/20 text-white mb-4">
                    Business Opportunities
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Partner with {influencer.name}
                  </h2>
                  <p className="text-white/90 text-lg mb-6">
                    Interested in collaborating? Whether you're a brand looking
                    for partnerships or a business seeking promotional
                    opportunities, we'd love to hear from you.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      size="lg"
                      className="bg-white text-purple-700 hover:bg-white/90"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact for Business
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                    >
                      View Media Kit
                    </Button>
                  </div>
                </div>

                <div className="md:w-1/3">
                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardContent className="p-6">
                      <div className="space-y-4 text-white">
                        <h3 className="font-semibold text-xl">
                          Collaboration Options
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-400" />
                            <span>Sponsored Content</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-400" />
                            <span>Product Endorsements</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-400" />
                            <span>Brand Ambassadorship</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-400" />
                            <span>Co-branded Products</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isQuickViewOpen && quickViewProduct && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsQuickViewOpen(false)}
          >
            <motion.div
              className="bg-background rounded-xl overflow-hidden max-w-4xl w-full max-h-[85vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="relative h-80 md:h-full">
                  <Image
                    src={quickViewProduct.image || "/placeholder.svg"}
                    alt={quickViewProduct.name}
                    fill
                    className="object-cover"
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                    onClick={() => setIsQuickViewOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {quickViewProduct.discount > 0 && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white font-medium px-2 shadow-sm">
                      {quickViewProduct.discount}% OFF
                    </Badge>
                  )}
                </div>

                <div className="p-6 md:p-8">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">
                          {quickViewProduct.name}
                        </h2>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => toggleWishlist(quickViewProduct.id)}
                        >
                          <Heart
                            className={cn(
                              "h-5 w-5",
                              wishlistedProducts.includes(quickViewProduct.id)
                                ? "fill-red-500 text-red-500"
                                : "text-muted-foreground"
                            )}
                          />
                        </Button>
                      </div>

                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-4 w-4",
                                  i < Math.floor(quickViewProduct.rating)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                )}
                              />
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground ml-2">
                          {quickViewProduct.reviews} reviews
                        </span>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2">
                      {quickViewProduct.discount > 0 ? (
                        <>
                          <span className="text-2xl font-bold">
                            $
                            {(
                              quickViewProduct.price *
                              (1 - quickViewProduct.discount / 100)
                            ).toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${quickViewProduct.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold">
                          ${quickViewProduct.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Description</h3>
                      <p className="text-muted-foreground">
                        {quickViewProduct.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Quantity</h3>
                      <div className="flex items-center border rounded-md w-fit">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-none"
                        >
                          -
                        </Button>
                        <div className="w-12 text-center">1</div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-none"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 space-y-2">
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                        onClick={() => {
                          addToCart(quickViewProduct);
                          setIsQuickViewOpen(false);
                        }}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>

                      <Button variant="outline" className="w-full">
                        View Full Details
                      </Button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Truck className="h-4 w-4" />
                        <span>Free shipping on orders over $50</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ShieldCheck className="h-4 w-4" />
                        <span>30-day satisfaction guarantee</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
