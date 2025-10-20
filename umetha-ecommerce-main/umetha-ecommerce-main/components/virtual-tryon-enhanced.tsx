"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, Loader, Download, RotateCcw, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useTranslation } from 'react-i18next';
import { db } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  stock: number;
}

interface VirtualTryOnEnhancedProps {
  onClose?: () => void;
}

export default function VirtualTryOnEnhanced({ onClose }: VirtualTryOnEnhancedProps) {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const { data, error } = await db.getProducts(20); // Get 20 products for try-on
        
        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          // Transform Supabase data to our Product interface
          const transformedProducts = data.map((product: any) => ({
            id: product.products_id || product.id,
            name: product.name,
            price: product.price,
            image: product.image || product.images?.[0] || "/placeholder.svg",
            images: product.images || [],
            category: product.category || "General",
            stock: product.stock || 0
          }));
          
          setAvailableProducts(transformedProducts);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserImage(e.target?.result as string);
        setError(null);
        setResultImage(null); // Clear previous result when new image is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const addProductToSelection = (product: Product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      return; // Product already selected
    }
    setSelectedProducts(prev => [...prev, product]);
  };

  const removeProductFromSelection = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const clearAllSelections = () => {
    setSelectedProducts([]);
    setUserImage(null);
    setResultImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleVirtualTryOn = async () => {
    if (!userImage || selectedProducts.length === 0) {
      setError("Please upload your photo and select at least one product to try on");
      return;
    }

    setIsLoading(true);
    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);

      const formData = new FormData();
      
      // Convert base64 to blob for user image
      setGenerationProgress(10);
      const userImageBlob = await fetch(userImage).then(r => r.blob());
      formData.append("userImage", userImageBlob, "user.jpg");
      
      // For multiple products, we'll try the first one for now
      // In a more advanced implementation, you could combine multiple products
      setGenerationProgress(20);
      const firstProduct = selectedProducts[0];
      const productImageBlob = await fetch(firstProduct.image).then(r => r.blob());
      formData.append("productImage", productImageBlob, "product.jpg");
      formData.append("productName", firstProduct.name);

      console.log("Sending virtual try-on request for product:", firstProduct.name);
      setGenerationProgress(30);

            const response = await fetch("/api/virtual-tryon", {
              method: "POST",
              body: formData,
            });

      setGenerationProgress(70);
      const data = await response.json();
      console.log("Virtual try-on response:", data);

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (data.success) {
        setResultImage(data.resultImage);
        console.log("Virtual try-on generated successfully!");
      } else {
        setError(data.error || "Failed to generate virtual try-on");
        console.error("Virtual try-on error:", data.error);
      }
    } catch (err) {
      setError("Failed to generate virtual try-on. Please try again.");
      console.error("Virtual try-on error:", err);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const downloadResult = () => {
    if (resultImage) {
      const link = document.createElement("a");
      link.href = resultImage;
      link.download = `virtual-tryon-${selectedProducts.map(p => p.name).join('-') || "result"}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Virtual Try-On
        </h2>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Upload Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Camera className="w-5 h-5 mr-2 text-indigo-600" />
            {t("virtual_tryon.upload_photo")}
          </h3>
          
          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">{t("virtual_tryon.tips_title")}</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• {t("virtual_tryon.tip_1")}</li>
              <li>• {t("virtual_tryon.tip_2")}</li>
              <li>• {t("virtual_tryon.tip_3")}</li>
              <li>• {t("virtual_tryon.tip_4")}</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            {!userImage ? (
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {t("virtual_tryon.upload_placeholder")}
                </p>
                <p className="text-sm text-gray-500">
                  {t("virtual_tryon.upload_hint")}
                </p>
              </div>
            ) : (
              <div className="relative">
                <Image
                  src={userImage}
                  alt="Your photo"
                  width={300}
                  height={400}
                  className="w-full max-w-sm mx-auto rounded-lg"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={() => setUserImage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-indigo-600" />
                Selected Items ({selectedProducts.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllSelections}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {selectedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400">
                        ${product.price}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeProductFromSelection(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Selection */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-indigo-600" />
            Choose Products to Try On
          </h3>
          
          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableProducts.map((product) => {
                const isSelected = selectedProducts.find(p => p.id === product.id);
                return (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-indigo-300"
                    }`}
                    onClick={() => addProductToSelection(product)}
                  >
                    <div className="aspect-square relative mb-2">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover rounded"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-indigo-500/20 rounded flex items-center justify-center">
                          <div className="bg-indigo-500 text-white rounded-full p-1">
                            <X className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </div>
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                      ${product.price}
                    </p>
                    {isSelected && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        Selected
                      </Badge>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Try On Button */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <Button
            onClick={handleVirtualTryOn}
            disabled={!userImage || selectedProducts.length === 0 || isLoading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Combining Your Photo with Selected Product...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Try On Selected Items
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={clearAllSelections}
            disabled={isLoading}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        {isGenerating && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Generating your virtual try-on...</span>
              <span>{Math.round(generationProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${generationProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Result Display */}
      {resultImage && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Virtual Try-On Result</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={downloadResult}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            
            {/* Success Message */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                    Virtual Try-On Generated Successfully!
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Here's how you look wearing the selected product.
                  </p>
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      ✨ Powered by Nano Banana API for realistic virtual try-on results!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src={resultImage}
                alt="Virtual try-on result"
                width={400}
                height={600}
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
            </div>
            
            <div className="mt-4 text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                How do you like your virtual try-on? You can try on more items or start over!
              </p>
              <div className="flex justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setResultImage(null)}
                >
                  Try Another Product
                </Button>
                <Button
                  size="sm"
                  onClick={clearAllSelections}
                >
                  Start Over
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
