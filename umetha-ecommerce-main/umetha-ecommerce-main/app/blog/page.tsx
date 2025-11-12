"use client";

import { motion } from "framer-motion";
import MainLayout from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  TrendingUp,
  Heart,
  Share2,
  Search,
  ArrowRight,
  Tag,
  Eye,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const blogPosts = [
  {
    id: 1,
    title: "The Future of Virtual Try-On Technology in Fashion E-Commerce",
    excerpt: "Discover how AR and AI are revolutionizing the way customers shop for clothing online, reducing returns and increasing customer satisfaction.",
    category: "Technology",
    author: "Sarah Chen",
    date: "January 20, 2025",
    readTime: "8 min read",
    image: "/blog/virtual-tryon.jpg",
    views: "12.5K",
    comments: 45,
    featured: true,
  },
  {
    id: 2,
    title: "10 Fashion Trends That Will Define 2025",
    excerpt: "From sustainable fabrics to tech-integrated clothing, explore the trends that are shaping the future of fashion.",
    category: "Fashion",
    author: "Marcus Rodriguez",
    date: "January 18, 2025",
    readTime: "6 min read",
    image: "/blog/fashion-trends.jpg",
    views: "8.3K",
    comments: 32,
    featured: true,
  },
  {
    id: 3,
    title: "Building a Sustainable Wardrobe: A Complete Guide",
    excerpt: "Learn how to make eco-friendly fashion choices without sacrificing style or breaking the bank.",
    category: "Sustainability",
    author: "Emma Thompson",
    date: "January 15, 2025",
    readTime: "10 min read",
    image: "/blog/sustainable-fashion.jpg",
    views: "15.2K",
    comments: 67,
    featured: true,
  },
  {
    id: 4,
    title: "How Influencer Marketing is Changing E-Commerce",
    excerpt: "The rise of authentic influencer partnerships and their impact on consumer purchasing decisions.",
    category: "Marketing",
    author: "David Park",
    date: "January 12, 2025",
    readTime: "7 min read",
    image: "/blog/influencer-marketing.jpg",
    views: "9.7K",
    comments: 28,
    featured: false,
  },
  {
    id: 5,
    title: "Cryptocurrency in E-Commerce: What You Need to Know",
    excerpt: "Understanding the benefits and challenges of accepting crypto payments in your online store.",
    category: "Technology",
    author: "Alex Kim",
    date: "January 10, 2025",
    readTime: "5 min read",
    image: "/blog/crypto-ecommerce.jpg",
    views: "6.8K",
    comments: 19,
    featured: false,
  },
  {
    id: 6,
    title: "The Psychology of Color in Fashion and Branding",
    excerpt: "How color choices influence customer perception and purchasing behavior in the fashion industry.",
    category: "Fashion",
    author: "Lisa Wang",
    date: "January 8, 2025",
    readTime: "6 min read",
    image: "/blog/color-psychology.jpg",
    views: "11.4K",
    comments: 41,
    featured: false,
  },
  {
    id: 7,
    title: "Optimizing Your Online Store for Mobile Shopping",
    excerpt: "Best practices for creating a seamless mobile shopping experience that converts.",
    category: "E-Commerce",
    author: "Tom Anderson",
    date: "January 5, 2025",
    readTime: "9 min read",
    image: "/blog/mobile-optimization.jpg",
    views: "7.9K",
    comments: 23,
    featured: false,
  },
  {
    id: 8,
    title: "The Art of Product Photography for E-Commerce",
    excerpt: "Professional tips for capturing stunning product photos that sell.",
    category: "Photography",
    author: "Rachel Green",
    date: "January 3, 2025",
    readTime: "8 min read",
    image: "/blog/product-photography.jpg",
    views: "13.6K",
    comments: 55,
    featured: false,
  },
];

const categories = [
  { name: "All", count: blogPosts.length },
  { name: "Technology", count: 2 },
  { name: "Fashion", count: 2 },
  { name: "Sustainability", count: 1 },
  { name: "Marketing", count: 1 },
  { name: "E-Commerce", count: 1 },
  { name: "Photography", count: 1 },
];

const popularTags = [
  "Virtual Try-On", "AI", "Sustainability", "Fashion Trends", "E-Commerce", 
  "Influencer Marketing", "Cryptocurrency", "Mobile Shopping", "Photography",
  "Branding", "Customer Experience", "Technology"
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <MainLayout hideShopCategory={true} hideFittingRoom={true}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <BookOpen className="h-3 w-3 mr-1" />
              UMetha Blog
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-100">
              Stories, Insights & Inspiration
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Discover the latest trends, tips, and innovations in fashion and e-commerce
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      {!searchQuery && selectedCategory === "All" && (
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Articles
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Don't miss our most popular and trending content
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-indigo-100 dark:border-violet-900/40 hover:shadow-xl transition-all overflow-hidden group">
                    <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-violet-600 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-white/20" />
                      </div>
                      <Badge className="absolute top-4 left-4 bg-white text-indigo-600">
                        {post.category}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {post.comments}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-indigo-600 dark:text-violet-400 hover:text-indigo-700"
                        >
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Categories */}
              <Card className="mb-6 border-indigo-100 dark:border-violet-900/40">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-white">
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                          selectedCategory === category.name
                            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span>{category.name}</span>
                        <Badge
                          variant="outline"
                          className={
                            selectedCategory === category.name
                              ? "border-white text-white"
                              : "border-gray-300 dark:border-gray-600"
                          }
                        >
                          {category.count}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Tags */}
              <Card className="border-indigo-100 dark:border-violet-900/40">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-white">
                    Popular Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-indigo-200 text-indigo-700 dark:border-violet-800 dark:text-violet-300 hover:bg-indigo-50 dark:hover:bg-violet-900/20 cursor-pointer"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Blog Posts Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedCategory === "All" ? "All Articles" : selectedCategory}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredPosts.length} articles
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full border-indigo-100 dark:border-violet-900/40 hover:shadow-lg transition-all overflow-hidden group">
                      <div className="relative h-40 bg-gradient-to-br from-indigo-500 to-violet-600 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-white/20" />
                        </div>
                        <Badge className="absolute top-3 left-3 bg-white text-indigo-600 text-xs">
                          {post.category}
                        </Badge>
                      </div>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <Calendar className="h-3 w-3" />
                          <span>{post.date}</span>
                        </div>
                        <CardTitle className="text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-sm">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {post.comments}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-indigo-600 dark:text-violet-400 hover:text-indigo-700 h-auto p-0"
                          >
                            Read
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <Button
                      key={page}
                      variant={page === 1 ? "default" : "outline"}
                      size="sm"
                      className={
                        page === 1
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                          : ""
                      }
                    >
                      {page}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <TrendingUp className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">
              Never Miss an Update
            </h2>
            <p className="text-xl mb-8 text-indigo-100">
              Subscribe to our newsletter and get the latest articles, insights, and exclusive content delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
              />
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-indigo-50 whitespace-nowrap"
              >
                Subscribe
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}

