"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
  ShoppingCart,
  User,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  Truck,
  Shield,
  Award,
  TrendingUp,
  Users,
  MessageCircle,
  ArrowLeft,
  Plus,
  Minus,
  X
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

interface InfluencerProfile {
  id: string;
  name: string;
  bio: string;
  avatar_url: string;
  social_links: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    facebook?: string;
  };
  followers_count: number;
  verified: boolean;
  store_theme: {
    primary_color: string;
    secondary_color: string;
    font_family: string;
  };
}

export default function InfluencerStorePage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [influencer, setInfluencer] = useState<InfluencerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [quantity, setQuantity] = useState(1);

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

  // Fetch influencer profile and products
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch influencer profile
      const profileResponse = await fetch(`/api/influencer/${params.id}`);
      const profileData = await profileResponse.json();
      
      if (profileResponse.ok) {
        setInfluencer(profileData.influencer);
      }

      // Fetch products
      const productsResponse = await fetch(`/api/influencer-products?influencerId=${params.id}&status=active`);
      const productsData = await productsResponse.json();
      
      if (productsResponse.ok) {
        setProducts(productsData.products || []);
      } else {
        throw new Error(productsData.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load store');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: StoreProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder-product.jpg',
    });
    toast.success(`${product.name} added to cart!`);
    setSelectedProduct(null);
    setQuantity(1);
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
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedProduct(product)}>
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
              <Package className="h-12 w-12 text-gray-400" />
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
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProduct(product);
                }}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWishlist(product.id);
                }}
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
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedProduct(product)}>
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
                <Package className="h-8 w-8 text-gray-400" />
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProduct(product);
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToWishlist(product.id);
                  }}
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Influencer not found</h2>
          <p className="text-gray-600 mb-4">This influencer's store is not available</p>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/influencer-marketplace">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10">
                  <Image
                    src={influencer.avatar_url || '/placeholder-avatar.jpg'}
                    alt={influencer.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="font-semibold text-lg">{influencer.name}</h1>
                  <p className="text-sm text-gray-600">Influencer Store</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Store
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Influencer Info */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative w-24 h-24">
                <Image
                  src={influencer.avatar_url || '/placeholder-avatar.jpg'}
                  alt={influencer.name}
                  width={96}
                  height={96}
                  className="rounded-full object-cover"
                />
                {influencer.verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Award className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-2xl font-bold">{influencer.name}</h2>
                  {influencer.verified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{influencer.bio}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{influencer.followers_count.toLocaleString()} followers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Package className="h-4 w-4" />
                    <span>{products.length} products</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  {influencer.social_links.instagram && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://instagram.com/${influencer.social_links.instagram}`} target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-4 w-4 mr-2" />
                        Instagram
                      </a>
                    </Button>
                  )}
                  {influencer.social_links.twitter && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://twitter.com/${influencer.social_links.twitter}`} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </a>
                    </Button>
                  )}
                  {influencer.social_links.youtube && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://youtube.com/@${influencer.social_links.youtube}`} target="_blank" rel="noopener noreferrer">
                        <Youtube className="h-4 w-4 mr-2" />
                        YouTube
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Controls */}
        <Card className="mb-6">
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
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || selectedCategory !== 'all' ? 'No products found' : 'No products available'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'This influencer has not added any products yet'
                }
              </p>
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

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    <Image
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">${selectedProduct.price.toFixed(2)}</h3>
                    <p className="text-gray-600">{selectedProduct.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">4.8 (24 reviews)</span>
                    </div>
                    <Badge variant="outline">{selectedProduct.category_id}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      onClick={() => handleAddToCart(selectedProduct)}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add to Cart - ${(selectedProduct.price * quantity).toFixed(2)}
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Heart className="h-4 w-4 mr-2" />
                      Add to Wishlist
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4" />
                      <span>Free shipping on orders over $50</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>30-day return policy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
