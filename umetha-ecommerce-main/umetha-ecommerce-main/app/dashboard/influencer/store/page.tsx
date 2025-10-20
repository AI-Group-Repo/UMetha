"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star,
  Heart,
  Share2,
  Eye,
  Settings,
  Palette,
  Layout,
  Typography,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

interface StoreProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category_id: string;
  stock: number;
  featured: boolean;
  status: string;
  tags: string[];
  created_at: string;
}

export default function StorePage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [storeData, setStoreData] = useState({
    name: "",
    description: "",
    primaryColor: "#6366F1",
    theme: "modern",
    logo: null,
    banner: null,
    layout: "modern",
    typography: "sans",
    animationSpeed: "normal",
    borderRadius: "medium",
    spacing: "comfortable",
    colorScheme: "custom",
    navigationStyle: "sidebar",
    productLayout: "grid",
    enableAnimations: true,
    enableGlass: false,
  });

  const categories = [
    "all",
    "fashion",
    "beauty", 
    "fitness",
    "lifestyle",
    "electronics",
    "home",
    "travel",
    "food",
    "books",
    "other"
  ];

  // Fetch products
  const fetchProducts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/influencer-products?influencerId=${user.id}&status=active`);
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products || []);
      } else {
        throw new Error(data.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (productId: string) => {
    // TODO: Implement add to cart functionality
    toast.success("Product added to cart!");
  };

  const handleAddToWishlist = (productId: string) => {
    // TODO: Implement add to wishlist functionality
    toast.success("Product added to wishlist!");
  };

  const ProductCard = ({ product }: { product: StoreProduct }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
          )}
          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
              Featured
            </Badge>
          )}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary" className="mr-2">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">4.8</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                onClick={() => handleAddToCart(product.id)}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleAddToWishlist(product.id)}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const ProductListItem = ({ product }: { product: StoreProduct }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex">
          <div className="relative w-32 h-32 flex-shrink-0">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
            )}
            {product.featured && (
              <Badge className="absolute top-1 left-1 bg-yellow-500 text-white text-xs">
                Featured
              </Badge>
            )}
          </div>
          <CardContent className="flex-1 p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">{product.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">4.8</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {product.category_id}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button 
                  onClick={() => handleAddToCart(product.id)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleAddToWishlist(product.id)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Store Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Store</h1>
            <p className="text-indigo-100 mb-4">
              Showcase your products and grow your business
            </p>
            <div className="flex gap-4">
              <Button variant="secondary" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview Store
              </Button>
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-indigo-600">
                <Settings className="h-4 w-4 mr-2" />
                Store Settings
              </Button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-indigo-100">Products</div>
          </div>
        </div>
      </div>

      {/* Store Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-2xl font-bold">{products.filter(p => p.featured).length}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Stock</p>
                <p className="text-2xl font-bold">{products.filter(p => p.stock > 0).length}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold">{new Set(products.map(p => p.category_id)).size}</p>
              </div>
              <Filter className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Store Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || selectedCategory !== 'all' ? 'No products found' : 'No products yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first product'
              }
            </p>
            <Button asChild className="bg-gradient-to-r from-indigo-500 to-purple-500">
              <Link href="/dashboard/influencer/products/new">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Create Product
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {filteredProducts.map((product) => (
            viewMode === 'grid' ? (
              <ProductCard key={product.id} product={product} />
            ) : (
              <ProductListItem key={product.id} product={product} />
            )
          ))}
        </div>
      )}
    </div>
  );
}