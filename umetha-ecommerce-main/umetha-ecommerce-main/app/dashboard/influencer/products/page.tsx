"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Store,
  TrendingUp,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function InfluencerProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [businessModels, setBusinessModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("ai_dropshipping");
  
  // AI Dropshipping State
  const [cjAvailableProducts, setCjAvailableProducts] = useState<any[]>([]); // Products to review
  const [cjApprovedProducts, setCjApprovedProducts] = useState<any[]>([]); // Approved products
  const [loadingCJ, setLoadingCJ] = useState(false);
  const [showCJBrowser, setShowCJBrowser] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  
  // Direct Marketplace State
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [loadingMyProducts, setLoadingMyProducts] = useState(false);
  
  // Affiliate Marketing State
  const [clickbankProducts, setClickbankProducts] = useState<any[]>([]);
  const [loadingClickBank, setLoadingClickBank] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState<string[]>([]);

  useEffect(() => {
    loadBusinessModels();
  }, [user]);

  const loadBusinessModels = async () => {
    if (!user) return;
    
    try {
      const isDemoAccount = user.email?.includes("@umetha.com");

      // For demo accounts, check localStorage first
      if (isDemoAccount) {
        const { loadDemoProfile } = await import("@/lib/demo-account-storage");
        const demoProfile = loadDemoProfile(user.email);
        
        if (demoProfile) {
          const models = demoProfile.businessModels;
          setBusinessModels(models);
          
          if (models.length > 0) {
            setActiveTab(models[0]);
          }

          // Load approved products from localStorage
          if (models.includes("ai_dropshipping")) {
            loadApprovedCJProducts();
          }
          if (models.includes("direct_marketplace")) {
            loadMyProducts();
          }
          if (models.includes("affiliate_marketing")) {
            loadClickBankProducts();
          }

          setLoading(false);
          return;
        }
      }

      // For real accounts, use Supabase
      const getCookieValue = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
        return null;
      };

      const mockUserId = getCookieValue("mock-user-id");
      const userId = mockUserId || user.id;

      const { data, error } = await supabase
        .from("profiles")
        .select("business_models, onboarding_completed")
        .eq("id", userId)
        .single();

      if (error) throw error;

      const profileData: any = data;
      
      if (!profileData?.onboarding_completed) {
        router.push("/dashboard/influencer/onboarding");
        return;
      }

      const models = profileData?.business_models || [];
      setBusinessModels(models);
      
      // Set active tab to first available business model
      if (models.length > 0) {
        setActiveTab(models[0]);
      }

      // Load products based on business models
      if (models.includes("ai_dropshipping")) {
        loadApprovedCJProducts();
      }
      if (models.includes("direct_marketplace")) {
        loadMyProducts();
      }
      if (models.includes("affiliate_marketing")) {
        loadClickBankProducts();
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading business models:", error);
      setLoading(false);
    }
  };

  // Browse available CJ products to review
  const browseCJProducts = async () => {
    setLoadingCJ(true);
    setShowCJBrowser(true);
    setSelectedProducts(new Set());
    
    try {
      console.log("🔍 Fetching products from CJ...");
      const response = await fetch("/api/cj/products?limit=20");
      
      const data = await response.json();
      console.log("📦 Response:", data);
      
      if (data.success && data.products && data.products.length > 0) {
        setCjAvailableProducts(data.products);
        toast({
          title: "Products Loaded",
          description: `Found ${data.products.length} products from CJ`,
        });
      } else {
        setCjAvailableProducts([]);
        toast({
          title: "No Products Found",
          description: data.message || "No products available from CJ",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("❌ Error loading products:", error);
      toast({
        title: "Failed to Load Products",
        description: "Could not connect to CJ API",
        variant: "destructive",
      });
      setCjAvailableProducts([]);
    } finally {
      setLoadingCJ(false);
    }
  };

  // Load approved CJ products
  const loadApprovedCJProducts = async () => {
    const isDemoAccount = user?.email?.includes("@umetha.com");
    
    if (isDemoAccount) {
      // Load from localStorage for demo accounts
      const { getDemoCJApprovals } = await import("@/lib/demo-account-storage");
      const approved = getDemoCJApprovals(user?.email);
      setCjApprovedProducts(approved);
    } else {
      // Load from Supabase for real accounts
      try {
        const getCookieValue = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
          return null;
        };

        const mockUserId = getCookieValue("mock-user-id");
        const userId = mockUserId || user?.id || "";

        const { data, error } = await supabase
          .from("influencer_products")
          .select("*")
          .eq("influencer_id", userId)
          .eq("source", "cj_dropshipping")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setCjApprovedProducts(data || []);
      } catch (error) {
        console.error("Error loading approved CJ products:", error);
      }
    }
  };

  // Approve a CJ product
  const approveCJProduct = async (product: any) => {
    const isDemoAccount = user?.email?.includes("@umetha.com");
    
    try {
      if (isDemoAccount) {
        // Save to localStorage for demo accounts
        const { addDemoCJProduct } = await import("@/lib/demo-account-storage");
        addDemoCJProduct(product, user?.email);
      } else {
        // Save to Supabase for real accounts
        const getCookieValue = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
          return null;
        };

        const mockUserId = getCookieValue("mock-user-id");
        const userId = mockUserId || user?.id || "";

        // @ts-ignore - Supabase type issue with influencer_products table
        const { error } = await supabase
          .from("influencer_products")
          // @ts-ignore
          .insert({
            influencer_id: userId,
            name: product.productNameEn || product.productName,
            description: product.description,
            price: product.sellPrice,
            images: [product.productImage],
            stock: product.productStock || 100,
            source: "cj_dropshipping",
            external_id: product.pid,
            created_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      toast({
        title: "Product Approved!",
        description: "Product added to your store",
      });

      // Remove from available list
      setCjAvailableProducts(prev => prev.filter(p => p.pid !== product.pid));
      
      // Reload approved products
      loadApprovedCJProducts();
    } catch (error: any) {
      console.error("Error approving product:", error);
      toast({
        title: "Error",
        description: "Failed to approve product",
        variant: "destructive",
      });
    }
  };

  // Reject a CJ product
  const rejectCJProduct = (productId: string) => {
    setCjAvailableProducts(prev => prev.filter(p => p.pid !== productId));
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
    toast({
      title: "Product Rejected",
      description: "Product removed from review list",
    });
  };

  // Toggle product selection
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  // Select/Deselect all products
  const toggleSelectAll = () => {
    if (selectedProducts.size === cjAvailableProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(cjAvailableProducts.map(p => p.pid)));
    }
  };

  // Approve selected products
  const approveSelectedProducts = async () => {
    if (selectedProducts.size === 0) {
      toast({
        title: "No Products Selected",
        description: "Please select at least one product to add to your store",
        variant: "default",
      });
      return;
    }

    const productsToApprove = cjAvailableProducts.filter(p => selectedProducts.has(p.pid));
    let successCount = 0;
    let failCount = 0;

    for (const product of productsToApprove) {
      try {
        await approveCJProduct(product);
        successCount++;
      } catch (error) {
        failCount++;
        console.error("Failed to approve product:", product.pid, error);
      }
    }

    if (successCount > 0) {
      toast({
        title: "Products Added!",
        description: `${successCount} product(s) added to your store${failCount > 0 ? `, ${failCount} failed` : ''}`,
      });
    }

    setSelectedProducts(new Set());
  };

  const loadMyProducts = async () => {
    setLoadingMyProducts(true);
    try {
      // Get the mock user ID from cookie if it exists (for test accounts)
      const getCookieValue = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
        return null;
      };

      const mockUserId = getCookieValue("mock-user-id");
      const userId = mockUserId || user?.id || "";

      const { data, error } = await supabase
        .from("influencer_products")
        .select("*")
        .eq("influencer_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMyProducts(data || []);
    } catch (error) {
      console.error("Error loading my products:", error);
    } finally {
      setLoadingMyProducts(false);
    }
  };

  const loadClickBankProducts = async () => {
    setLoadingClickBank(true);
    try {
      const response = await fetch("/api/clickbank/products");
      const data = await response.json();
      setClickbankProducts(data.products || []);
      setPendingApprovals(data.pendingApprovals || []);
    } catch (error) {
      console.error("Error loading ClickBank products:", error);
    } finally {
      setLoadingClickBank(false);
    }
  };

  // Add product to cart
  const addToCart = async (product: any) => {
    try {
      // TODO: Implement your cart logic here
      // For now, show a success message
      toast({
        title: "Added to Cart!",
        description: `${product.name} has been added to your cart`,
      });
      
      // You can dispatch to your cart context or make an API call here
      console.log("Adding to cart:", product);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    }
  };

  const approveClickBankProduct = async (productId: string) => {
    try {
      const response = await fetch("/api/clickbank/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        toast({
          title: "Product Approved",
          description: "This product will now be displayed on your platform",
        });
        setPendingApprovals((prev) => prev.filter((id) => id !== productId));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve product",
        variant: "destructive",
      });
    }
  };

  const deleteMyProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from("influencer_products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      toast({
        title: "Product Deleted",
        description: "Product has been removed",
      });
      loadMyProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-12">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Products</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and organize your product catalog
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-{businessModels.length}">
          {businessModels.includes("ai_dropshipping") && (
            <TabsTrigger value="ai_dropshipping">
              <Package className="mr-2 h-4 w-4" />
              AI Dropshipping
            </TabsTrigger>
          )}
          {businessModels.includes("direct_marketplace") && (
            <TabsTrigger value="direct_marketplace">
              <Store className="mr-2 h-4 w-4" />
              Direct Marketplace
            </TabsTrigger>
          )}
          {businessModels.includes("affiliate_marketing") && (
            <TabsTrigger value="affiliate_marketing">
              <TrendingUp className="mr-2 h-4 w-4" />
              Affiliate Marketing
            </TabsTrigger>
          )}
        </TabsList>

        {/* AI Dropshipping Tab */}
        {businessModels.includes("ai_dropshipping") && (
          <TabsContent value="ai_dropshipping" className="space-y-6">
            {/* Header with action buttons */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">CJ Dropshipping Products</h2>
                <p className="text-gray-500">Browse, review, and approve products to sell</p>
              </div>
              <Button onClick={browseCJProducts} disabled={loadingCJ}>
                <Package className={`mr-2 h-4 w-4 ${loadingCJ ? "animate-spin" : ""}`} />
                {showCJBrowser ? "Refresh Products" : "Browse Products"}
              </Button>
            </div>

            {/* Review Section - Products to approve/reject */}
            {showCJBrowser && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold">Review Products</h3>
                  <Badge variant="secondary">{cjAvailableProducts.length} products to review</Badge>
                    {selectedProducts.size > 0 && (
                      <Badge variant="default">{selectedProducts.size} selected</Badge>
                    )}
                  </div>
                  {cjAvailableProducts.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={toggleSelectAll}
                      >
                        {selectedProducts.size === cjAvailableProducts.length ? "Deselect All" : "Select All"}
                      </Button>
                      <Button
                        size="sm"
                        onClick={approveSelectedProducts}
                        disabled={selectedProducts.size === 0}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Add Selected to Store ({selectedProducts.size})
                      </Button>
                    </div>
                  )}
                </div>
                
                {cjAvailableProducts.length === 0 ? (
                  <Card className="p-8">
                    <div className="text-center space-y-2">
                      <Package className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="text-gray-500">No products loaded yet. Click "Browse Products" to fetch from CJ.</p>
                    </div>
                  </Card>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {cjAvailableProducts.map((product) => (
                      <Card 
                        key={product.pid} 
                        className={`overflow-hidden transition-all cursor-pointer hover:shadow-lg ${
                          selectedProducts.has(product.pid) ? "ring-2 ring-indigo-500" : ""
                        }`}
                        onClick={() => toggleProductSelection(product.pid)}
                      >
                        {/* Checkbox */}
                        <div className="absolute top-3 left-3 z-10">
                          <input
                            type="checkbox"
                            checked={selectedProducts.has(product.pid)}
                            onChange={() => toggleProductSelection(product.pid)}
                            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        {/* Product Image */}
                        <div className="aspect-square relative bg-gray-100">
                          <img
                            src={product.productImage || product.image || "/placeholder-product.png"}
                            alt={product.productNameEn || product.productName || "Product"}
                          className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder-product.png";
                            }}
                        />
                      </div>

                        {/* Product Info */}
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base line-clamp-2 min-h-[3rem]">
                            {product.productNameEn || product.productName || "Untitled Product"}
                        </CardTitle>
                          <CardDescription className="text-xs line-clamp-2 min-h-[2.5rem]">
                          {product.description || "No description available"}
                        </CardDescription>
                      </CardHeader>

                        {/* Product Details */}
                        <CardContent className="space-y-2 text-sm">
                          {/* Price */}
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Price:</span>
                            <span className="text-lg font-bold text-indigo-600">
                              ${product.sellPrice || product.price || "N/A"}
                            </span>
                          </div>

                          {/* Stock */}
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Stock:</span>
                            <Badge variant={product.productStock || product.stock ? "default" : "secondary"}>
                              {product.productStock || product.stock || "Not Available"}
                            </Badge>
                          </div>

                          {/* Category */}
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Category:</span>
                            <span className="text-xs font-medium truncate max-w-[150px]">
                              {product.categoryName || product.category || "Not Available"}
                            </span>
                          </div>

                          {/* Product ID */}
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Product ID:</span>
                            <span className="text-xs font-mono">
                              {product.pid || product.id || "Not Available"}
                            </span>
                          </div>

                          {/* SKU */}
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">SKU:</span>
                            <span className="text-xs font-mono truncate max-w-[150px]">
                              {product.productSku || product.sku || "Not Available"}
                            </span>
                          </div>

                          {/* Variants */}
                          {product.variants && product.variants.length > 0 && (
                          <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Variants:</span>
                              <Badge variant="outline">{product.variants.length} options</Badge>
                          </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-4 pt-2 border-t">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                rejectCJProduct(product.pid);
                              }}
                              className="flex-1"
                            >
                              <XCircle className="mr-1 h-3 w-3" />
                              Reject
                            </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                )}
              </div>
            )}

            {/* Approved Products Section - Products in your store */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Your Store Products</h3>
                <Badge>{cjApprovedProducts.length} products</Badge>
              </div>
              
              {cjApprovedProducts.length === 0 ? (
                <Card className="p-12">
                  <div className="text-center space-y-4">
                    <Package className="mx-auto h-16 w-16 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-600">No Products Yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Click "Browse Products" above to extract products from CJ Dropshipping.
                      Review and approve products to add them to your store.
                    </p>
                    <Button onClick={browseCJProducts}>
                      <Package className="mr-2 h-4 w-4" />
                      Browse CJ Products
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {cjApprovedProducts.map((product) => (
                    <Card key={product.id || product.pid} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-square relative">
                        <img
                          src={product.productImage || product.images?.[0] || "/placeholder-product.png"}
                          alt={product.name || product.productNameEn}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-green-500">
                          In Stock
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-base line-clamp-2">
                          {product.name || product.productNameEn || product.productName}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {product.description || "Premium quality product"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-indigo-600">
                              ${product.price || product.sellPrice}
                            </span>
                            <Badge variant="secondary">
                              {product.stock || product.productStock || 100}+ stock
                            </Badge>
                          </div>
                          <Button 
                            onClick={() => addToCart(product)} 
                            className="w-full"
                            size="sm"
                          >
                            <Package className="mr-2 h-4 w-4" />
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        )}

        {/* Direct Marketplace Tab */}
        {businessModels.includes("direct_marketplace") && (
          <TabsContent value="direct_marketplace" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">My Products</h2>
                <p className="text-gray-500">Products you've added to your store</p>
              </div>
              <Button onClick={() => router.push("/dashboard/influencer/products/add")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {myProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={product.images?.[0] || "/placeholder-product.png"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">${product.price}</span>
                        <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                          {product.stock} in stock
                        </Badge>
                      </div>
                      <Button 
                        onClick={() => addToCart(product)} 
                        className="w-full mb-2"
                        size="sm"
                        disabled={product.stock === 0}
                      >
                        <Package className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/dashboard/influencer/products/edit/${product.id}`)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMyProduct(product.id)}
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}

        {/* Affiliate Marketing Tab */}
        {businessModels.includes("affiliate_marketing") && (
          <TabsContent value="affiliate_marketing" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">ClickBank Products</h2>
                <p className="text-gray-500">Products auto-synced every 24 hours</p>
              </div>
              <Badge variant="outline">
                {pendingApprovals.length} pending approval
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {clickbankProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={product.image || "/placeholder-product.png"}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    {product.popular && (
                      <Badge className="absolute top-2 right-2 bg-red-500">
                        🔥 Popular
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-base line-clamp-2">{product.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">${product.initialPrice}</span>
                        <Badge variant="secondary">${product.commission} commission</Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        Gravity: {product.gravity} | {product.commissionPercentage}% commission
                      </div>
                      {pendingApprovals.includes(product.id) ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => approveClickBankProduct(product.id)}
                            className="flex-1"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" className="w-full">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Affiliate Link
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
