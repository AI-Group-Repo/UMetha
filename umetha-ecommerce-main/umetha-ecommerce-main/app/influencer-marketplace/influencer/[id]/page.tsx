"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { influencers, influencerProducts } from "@/data/influencer-data";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Heart,
  ShoppingBag,
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
  CheckCircle2, // Add this import for verified icon
  SlidersHorizontal,
  LayoutGrid as GridIcon,
  List as LayoutListIcon,
  UserPlus,
  UserMinus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MainLayout from "@/components/main-layout";
import PriceCartButton from "@/components/ui/price-cart-button";
import { cn } from "@/lib/utils";
import { useFollowedInfluencers } from "@/context/followed-influencers-context";
import { useProductModal } from "@/context/product-modal-context";
import { useToast } from "@/hooks/use-toast";

export default function InfluencerProfile() {
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { isFollowing, followInfluencer, unfollowInfluencer } =
    useFollowedInfluencers();
  const { toast } = useToast();

  // Find the influencer based on the ID from the URL
  const influencerId = parseInt(params.id as string);
  const influencer = influencers.find((inf) => inf.id === influencerId);

  // Filter products for this influencer
  const products = influencerProducts.filter(
    (product) => product.influencerId === influencerId
  );

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading skeleton
  }

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

  // Handle follow/unfollow actions
  const handleFollowToggle = () => {
    if (isFollowing(influencerId)) {
      unfollowInfluencer(influencerId);
      toast({
        title: "Unfollowed",
        description: `You've unfollowed ${influencer.name}`,
        variant: "default",
      });
    } else {
      followInfluencer(influencerId);
      toast({
        title: "Following!",
        description: `You're now following ${influencer.name}`,
        variant: "default",
      });
    }
  };

  const followStatus = isFollowing(influencerId);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-[400px] -mt-6 -mx-6">
        <div className="absolute inset-0">
          <Image
            src={influencer.background}
            alt={influencer.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="relative h-full container mx-auto px-6">
          <div className="flex items-end h-full pb-8">
            <div className="flex items-end gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-70" />
                <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800">
                  <AvatarImage src={influencer.avatar} alt={influencer.name} />
                  <AvatarFallback>{influencer.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </motion.div>

              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold">{influencer.name}</h1>
                    {influencer.verified && (
                      <Badge variant="secondary" className="h-6">
                        <CheckCircle2 className="h-3 w-3 mr-1 text-blue-500" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <p className="text-muted-foreground text-lg mb-4 max-w-2xl">
                    {influencer.bio}
                  </p>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {influencer.followers}
                      </span>
                      <span className="text-muted-foreground">followers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">4.8</span>
                      <span className="text-muted-foreground">rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {influencer.engagement}
                      </span>
                      <span className="text-muted-foreground">engagement</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="flex gap-2">
                {/* Follow/Unfollow Button */}
                <Button
                  variant={followStatus ? "outline" : "default"}
                  className={cn(
                    "gap-2",
                    followStatus
                      ? "border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  )}
                  onClick={handleFollowToggle}
                >
                  {followStatus ? (
                    <>
                      <UserMinus className="h-4 w-4" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Follow
                    </>
                  )}
                </Button>

                {/* Social Media Icons */}
                {Object.entries(influencer.social).map(([platform, handle]) => {
                  const Icon = {
                    instagram: Instagram,
                    twitter: Twitter,
                    youtube: Youtube,
                  }[platform];

                  return (
                    <Button
                      key={platform}
                      variant="secondary"
                      size="icon"
                      className="rounded-full"
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
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="all" className="space-y-8">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="bestsellers">Bestsellers</TabsTrigger>
              <TabsTrigger value="new">New Arrivals</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4">
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                <Badge variant="secondary" className="ml-2">
                  2
                </Badge>
              </Button>

              <div className="border-l h-6" />

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <GridIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <LayoutListIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="all" className="space-y-8">
            <motion.div
              className={cn(
                "grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                  : "grid-cols-1"
              )}
            >
              {products.length > 0 ? (
                products.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {viewMode === "grid" ? (
                      <ProductCard product={product} />
                    ) : (
                      <ProductListItem product={product} />
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground">
                    This influencer hasn't added any products yet.
                  </p>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Similar TabsContent for other tabs */}
        </Tabs>
      </div>
    </MainLayout>
  );
}

// Product Card Component
function ProductCard({ product }) {
  const { openModal } = useProductModal();
  
  return (
    <Card className="group relative overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300">
      <div 
        className="relative aspect-square cursor-pointer"
        onClick={() => openModal({
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          images: [product.image],
          category: product.category ? {
            name: product.category,
            slug: product.category.toLowerCase().replace(/\s+/g, '-')
          } : undefined,
          stock: product.stock || 0
        })}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay & Quick Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-4 left-4 right-4 space-y-4">
            <PriceCartButton
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={
                product.discount
                  ? product.price * (1 + product.discount / 100)
                  : undefined
              }
              image={product.image}
            />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.discount > 0 && (
            <Badge className="bg-red-500 text-white border-0">
              -{product.discount}% OFF
            </Badge>
          )}
          {product.new && (
            <Badge className="bg-emerald-500 text-white border-0">NEW</Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-medium line-clamp-2">{product.name}</h3>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                )}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-2">
              ({product.reviews})
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Product List Item Component
function ProductListItem({ product }) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="flex gap-6">
        <div className="relative w-48 aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {product.discount > 0 && (
            <Badge className="absolute top-4 left-4 bg-red-500 text-white border-0">
              -{product.discount}% OFF
            </Badge>
          )}
        </div>

        <div className="flex-1 p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">{product.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  )}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                ({product.reviews} reviews)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <PriceCartButton
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={
                  product.discount
                    ? product.price * (1 + product.discount / 100)
                    : undefined
                }
                image={product.image}
              />

              <Button variant="ghost" size="icon" className="rounded-full">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
