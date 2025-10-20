"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  TrendingUp,
  Instagram,
  Twitter,
  Youtube,
  Filter,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import MainLayout from "@/components/main-layout";

// Sample data for influencers (same as in marketplace page)
const influencers = [
  {
    id: 1,
    name: "Sophia Martinez",
    handle: "@sophiastyle",
    description:
      "Fashion enthusiast and sustainable style curator. Creating content that inspires confidence through fashion.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    followers: "2.4M",
    category: "Fashion",
    verified: true,
    featured: true,
    background: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
    products: 48,
    engagement: "4.8%",
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
    description:
      "Certified fitness trainer and wellness coach. Helping you achieve your fitness goals through sustainable habits.",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5",
    followers: "1.8M",
    category: "Fitness",
    verified: true,
    featured: true,
    background: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    products: 36,
    engagement: "5.2%",
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
    description:
      "Beauty expert and skincare enthusiast. Sharing clean beauty tips and product recommendations.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    followers: "3.1M",
    category: "Beauty",
    verified: true,
    featured: true,
    background: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
    products: 52,
    engagement: "4.5%",
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
    description:
      "Tech reviewer and digital lifestyle expert. Breaking down complex tech into simple solutions.",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
    followers: "1.2M",
    category: "Technology",
    verified: true,
    featured: true,
    background: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
    products: 28,
    engagement: "3.9%",
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
    description:
      "Food creator and culinary explorer. Sharing recipes and food stories from around the world.",
    avatar: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c",
    followers: "950K",
    category: "Food",
    verified: true,
    featured: false,
    background: "https://images.unsplash.com/photo-1495195134817-033315eb7c89",
    products: 32,
    engagement: "6.1%",
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
    social: {
      instagram: "jamestravel",
      twitter: "jamestravel",
      youtube: "JamesTravelOfficial",
    },
  },
  {
    id: 7,
    name: "Olivia Brown",
    handle: "@oliviamakeup",
    avatar: "/placeholder.svg?height=400&width=400",
    followers: "1.7M",
    category: "Beauty",
    verified: true,
    featured: false,
    background: "/placeholder.svg?height=600&width=1200",
    products: 38,
    engagement: "4.7%",
    social: {
      instagram: "oliviamakeup",
      twitter: "oliviamakeup",
      youtube: "OliviaMakeupOfficial",
    },
  },
  {
    id: 8,
    name: "Michael Smith",
    handle: "@michaelgaming",
    avatar: "/placeholder.svg?height=400&width=400",
    followers: "2.2M",
    category: "Gaming",
    verified: true,
    featured: false,
    background: "/placeholder.svg?height=600&width=1200",
    products: 20,
    engagement: "5.5%",
    social: {
      instagram: "michaelgaming",
      twitter: "michaelgaming",
      youtube: "MichaelGamingOfficial",
    },
  },
  {
    id: 9,
    name: "Sarah Johnson",
    handle: "@sarahlifestyle",
    avatar: "/placeholder.svg?height=400&width=400",
    followers: "1.3M",
    category: "Lifestyle",
    verified: true,
    featured: false,
    background: "/placeholder.svg?height=600&width=1200",
    products: 42,
    engagement: "4.3%",
    social: {
      instagram: "sarahlifestyle",
      twitter: "sarahlifestyle",
      youtube: "SarahLifestyleOfficial",
    },
  },
  {
    id: 10,
    name: "Daniel Kim",
    handle: "@danielmusic",
    avatar: "/placeholder.svg?height=400&width=400",
    followers: "2.8M",
    category: "Music",
    verified: true,
    featured: false,
    background: "/placeholder.svg?height=600&width=1200",
    products: 18,
    engagement: "6.2%",
    social: {
      instagram: "danielmusic",
      twitter: "danielmusic",
      youtube: "DanielMusicOfficial",
    },
  },
  {
    id: 11,
    name: "Jessica Lee",
    handle: "@jessicaart",
    avatar: "/placeholder.svg?height=400&width=400",
    followers: "980K",
    category: "Art",
    verified: true,
    featured: false,
    background: "/placeholder.svg?height=600&width=1200",
    products: 30,
    engagement: "5.1%",
    social: {
      instagram: "jessicaart",
      twitter: "jessicaart",
      youtube: "JessicaArtOfficial",
    },
  },
  {
    id: 12,
    name: "Robert Taylor",
    handle: "@robertbooks",
    avatar: "/placeholder.svg?height=400&width=400",
    followers: "1.1M",
    category: "Books",
    verified: true,
    featured: false,
    background: "/placeholder.svg?height=600&width=1200",
    products: 25,
    engagement: "3.8%",
    social: {
      instagram: "robertbooks",
      twitter: "robertbooks",
      youtube: "RobertBooksOfficial",
    },
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
  "Gaming",
  "Lifestyle",
  "Music",
  "Art",
  "Books",
];

export default function AllInfluencers() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("followers");

  // Filter influencers based on category and search query
  const filteredInfluencers = influencers.filter((influencer) => {
    const matchesCategory =
      selectedCategory === "All" || influencer.category === selectedCategory;
    const matchesSearch =
      influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.handle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort influencers based on selected option
  const sortedInfluencers = [...filteredInfluencers].sort((a, b) => {
    switch (sortOption) {
      case "followers":
        return (
          Number.parseFloat(
            b.followers.replace("M", "000000").replace("K", "000")
          ) -
          Number.parseFloat(
            a.followers.replace("M", "000000").replace("K", "000")
          )
        );
      case "engagement":
        return (
          Number.parseFloat(b.engagement.replace("%", "")) -
          Number.parseFloat(a.engagement.replace("%", ""))
        );
      case "products":
        return b.products - a.products;
      case "nameAsc":
        return a.name.localeCompare(b.name);
      case "nameDesc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

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
      <div className="space-y-8">
        {/* Header */}
        <section>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Discover Our Influencers
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse our curated network of creators and shop their exclusive
              collections
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
              {/* Search */}
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search influencers..."
                  className="pl-10 w-full md:w-[250px] bg-white dark:bg-gray-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {selectedCategory}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuGroup>
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className="cursor-pointer"
                      >
                        {category}
                        {selectedCategory === category && (
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
                      onClick={() => setSortOption("followers")}
                      className="cursor-pointer"
                    >
                      Most Followers
                      {sortOption === "followers" && (
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
                      onClick={() => setSortOption("engagement")}
                      className="cursor-pointer"
                    >
                      Highest Engagement
                      {sortOption === "engagement" && (
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
                      onClick={() => setSortOption("products")}
                      className="cursor-pointer"
                    >
                      Most Products
                      {sortOption === "products" && (
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
                      onClick={() => setSortOption("nameAsc")}
                      className="cursor-pointer"
                    >
                      Name: A to Z
                      {sortOption === "nameAsc" && (
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
                      onClick={() => setSortOption("nameDesc")}
                      className="cursor-pointer"
                    >
                      Name: Z to A
                      {sortOption === "nameDesc" && (
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

            <div className="w-full md:w-auto">
              <Button className="w-full md:w-auto" asChild>
                <Link href="/category/influencerhub">Back to Marketplace</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Influencers Grid */}
        <section>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sortedInfluencers.map((influencer) => (
              <motion.div
                key={influencer.id}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Link
                  href={`/influencer-marketplace/influencer/${influencer.id}`}
                >
                  <Card className="overflow-hidden h-full border border-purple-100 dark:border-purple-900/30 hover:shadow-md transition-all duration-300">
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={influencer.background || "/placeholder.svg"}
                        alt={influencer.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>

                    <CardContent className="pt-0 relative">
                      <div className="flex justify-between items-start -mt-10">
                        <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-900 shadow-md">
                          <AvatarImage
                            src={influencer.avatar}
                            alt={influencer.name}
                          />
                          <AvatarFallback>
                            {influencer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 mt-2">
                          {influencer.category}
                        </Badge>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center">
                          <h3 className="font-bold text-lg">
                            {influencer.name}
                          </h3>
                          {influencer.verified && (
                            <Badge className="ml-2 bg-blue-500 text-white h-5 w-5 p-0 flex items-center justify-center rounded-full">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-3 w-3"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {influencer.handle}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                          {influencer.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                            <span>{influencer.followers} followers</span>
                          </div>
                          <div>
                            <span className="font-medium">
                              {influencer.products}
                            </span>{" "}
                            products
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="default"
                            size="sm"
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            asChild
                          >
                            <Link
                              href={`/category/influencerhub/store/${influencer.id}`}
                            >
                              View Store
                            </Link>
                          </Button>
                        </div>

                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-purple-100/50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                          >
                            <Instagram className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-purple-100/50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                          >
                            <Twitter className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-purple-100/50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                          >
                            <Youtube className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {sortedInfluencers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">
                No influencers found matching your criteria.
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-2"
              >
                Clear filters
              </Button>
            </div>
          )}
        </section>

        {/* Become an Influencer CTA */}
        <section className="relative overflow-hidden rounded-2xl mt-16">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 z-10"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] bg-cover bg-center"></div>

          <div className="relative z-20 px-6 py-12 md:py-16 max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Join Our Influencer Network
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Become part of UMetha's exclusive creator community and take
                your brand to the next level
              </p>

              <Button
                size="lg"
                className="bg-white text-purple-700 hover:bg-white/90"
              >
                Apply Now
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
