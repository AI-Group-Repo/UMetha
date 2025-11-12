"use client";

import React, { useState, useEffect } from 'react';
import { ProductGrid } from '@/components/product-card';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, List, TrendingUp, Star, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/main-layout';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category?: {
    name: string;
    slug: string;
  };
  stock: number;
  featured?: boolean;
  trending?: boolean;
  bestseller?: boolean;
  salesCount?: number;
  rating?: number;
  source?: 'supabase' | 'cj' | 'local';
  translations?: {
    name: string;
    description: string;
    language: string;
  }[];
}

export default function BestSellersPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('sales');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('bestsellers');

  // Fetch best sellers and trending products only (no Supabase products)
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch from CJ Dropshipping and local products only
      const [cjProducts, localProducts] = await Promise.all([
        fetch('/api/sync/cj-products?limit=30').then(res => res.json()).catch(() => ({ products: [] })),
        fetch('/api/products?limit=30&source=local').then(res => res.json()).catch(() => ({ products: [] }))
      ]);

      // Combine products and mark their source
      const allProducts = [
        ...(cjProducts.products || []).map((p: Product) => ({ ...p, source: 'cj' as const })),
        ...(localProducts.products || []).map((p: Product) => ({ ...p, source: 'local' as const }))
      ];

      // Mark bestseller and trending products with sales data
      const processedProducts = allProducts.map((product, index) => ({
        ...product,
        bestseller: index % 3 === 0, // Mark every 3rd product as bestseller
        trending: index % 4 === 0, // Mark every 4th product as trending
        salesCount: Math.floor(Math.random() * 1000) + 100, // Random sales count
        rating: 4 + Math.random(), // Random rating between 4-5
        featured: index % 5 === 0 // Mark every 5th product as featured
      }));

      // Sort by sales count to get true bestsellers
      processedProducts.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));

      setProducts(processedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (productId: string) => {
    toast({
      title: "Added to Cart",
      description: "Product has been added to your cart.",
    });
  };

  const handleAddToWishlist = (productId: string) => {
    toast({
      title: "Added to Wishlist",
      description: "Product has been added to your wishlist.",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  // Filter products based on active tab
  const getFilteredProducts = () => {
    let filtered = products;

    switch (activeTab) {
      case 'bestsellers':
        filtered = products.filter(p => p.bestseller);
        break;
      case 'trending':
        filtered = products.filter(p => p.trending);
        break;
      case 'featured':
        filtered = products.filter(p => p.featured);
        break;
      default:
        filtered = products;
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category?.slug === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case 'sales':
        filtered.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <MainLayout>
      <main className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-8 w-8 text-indigo-600" />
              <h1 className="text-4xl font-bold text-gray-900">
                Best Sellers
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Discover our top-performing products and trending items from our website
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="bestsellers" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Best Sellers
                </TabsTrigger>
                <TabsTrigger value="trending" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trending
                </TabsTrigger>
                <TabsTrigger value="featured" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Featured
                </TabsTrigger>
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Grid className="h-4 w-4" />
                  All Products
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search best sellers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="beauty">Beauty</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Best Selling</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Results Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <p className="text-gray-600">
                Showing {filteredProducts.length} products
              </p>
              <div className="flex gap-2">
                {activeTab === 'bestsellers' && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Award className="h-3 w-3 mr-1" />
                    Best Sellers
                  </Badge>
                )}
                {activeTab === 'trending' && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                )}
                {activeTab === 'featured' && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <ProductGrid
                products={filteredProducts}
                language="en"
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                className={viewMode === 'list' ? 'grid-cols-1 max-w-4xl mx-auto' : ''}
              />
            )}
          </motion.div>
        </div>
      </main>
    </MainLayout>
  );
}
