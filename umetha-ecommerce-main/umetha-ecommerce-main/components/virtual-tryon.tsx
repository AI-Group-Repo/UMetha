"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, X, Loader, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, CheckCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface VirtualTryOnProps {
  selectedProduct: Product | null;
  onProductSelect: (product: Product) => void;
  availableProducts: Product[];
}

export default function VirtualTryOn({ 
  selectedProduct, 
  onProductSelect, 
  availableProducts 
}: VirtualTryOnProps) {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserImage(e.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVirtualTryOn = async () => {
    if (!userImage || !selectedProduct) {
      setError(t("virtual_tryon.error_upload_select"));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert user image to base64
      const userImageBase64 = userImage.split(',')[1]; // Remove data:image/...;base64, prefix
      
      // Convert product image URL to base64
      const productImageResponse = await fetch(selectedProduct.image);
      const productImageBlob = await productImageResponse.blob();
      const productImageBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data:image/...;base64, prefix
        };
        reader.readAsDataURL(productImageBlob);
      });

      // Create FormData for the API call
      const formData = new FormData();
      
      // Convert base64 strings back to Blobs for FormData
      const userImageBlob = new Blob([Uint8Array.from(atob(userImageBase64), c => c.charCodeAt(0))], { type: 'image/jpeg' });
      const productImageBlobFromBase64 = new Blob([Uint8Array.from(atob(productImageBase64), c => c.charCodeAt(0))], { type: 'image/jpeg' });
      
      formData.append('userImage', userImageBlob, 'user-image.jpg');
      formData.append('productImage', productImageBlobFromBase64, 'product-image.jpg');
      formData.append('productName', selectedProduct.name);

      // Call the nanoBanana API endpoint
      const response = await fetch('/api/virtual-tryon', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.resultImage) {
        setResultImage(result.resultImage);
        console.log("Virtual try-on generated successfully:", result.message);
      } else {
        // Provide more specific error messages
        let errorMessage = t("virtual_tryon.error_generation");
        
        if (result.error) {
          if (result.error.includes("quota") || result.error.includes("limit")) {
            errorMessage = "API quota exceeded. Please try again later or contact support.";
          } else if (result.error.includes("network") || result.error.includes("timeout")) {
            errorMessage = "Network error. Please check your connection and try again.";
          } else if (result.error.includes("image") || result.error.includes("format")) {
            errorMessage = "Image format not supported. Please try a different image.";
          } else {
            errorMessage = result.error;
          }
        }
        
        setError(errorMessage);
        console.error("API Error:", result);
      }
      
    } catch (err) {
      // Provide more specific error messages for different error types
      let errorMessage = t("virtual_tryon.error_generation");
      
      if (err instanceof Error) {
        if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (err.message.includes("quota") || err.message.includes("limit")) {
          errorMessage = "API quota exceeded. Please try again later or contact support.";
        } else if (err.message.includes("API key") || err.message.includes("authentication")) {
          errorMessage = "API configuration error. Please contact support.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      console.error("Virtual try-on error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetTryOn = () => {
    setUserImage(null);
    setResultImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadResult = () => {
    if (resultImage) {
      const link = document.createElement("a");
      link.href = resultImage;
      link.download = `virtual-tryon-${selectedProduct?.name || "result"}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    setIsAddingToCart(true);
    try {
      await addItem({
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: selectedProduct.image,
      });
      
      toast({
        title: "Added to Cart",
        description: `${selectedProduct.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Camera className="w-5 h-5 mr-2 text-indigo-600" />
            {t("virtual_tryon.upload_photo")}
          </h3>
          
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

      {/* Product Selection */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-indigo-600" />
            {t("virtual_tryon.select_product")}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {availableProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedProduct?.id === product.id
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-300"
                }`}
                onClick={() => onProductSelect(product)}
              >
                <div className="aspect-square relative mb-2">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover rounded"
                  />
                </div>
                <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                  {product.name}
                </h4>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                  ${product.price}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Try On Button */}
      <div className="flex gap-4">
        <Button
          onClick={handleVirtualTryOn}
          disabled={!userImage || !selectedProduct || isLoading}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              {t("virtual_tryon.generating")}
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 mr-2" />
              {t("virtual_tryon.try_on_now")}
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={resetTryOn}
          disabled={isLoading}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          {error.includes("API configuration") && (
            <p className="text-red-500 dark:text-red-300 text-xs mt-2">
              💡 Tip: Make sure the VIRTUAL_NANO_BANANA_API_KEY environment variable is set in your .env.local file
            </p>
          )}
        </div>
      )}

      {/* Result Display */}
      {resultImage && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{t("virtual_tryon.result_title")}</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={downloadResult}
              >
                <Download className="w-4 h-4 mr-2" />
                {t("virtual_tryon.download")}
              </Button>
            </div>
            
            <div className="relative">
              {resultImage && (resultImage.startsWith('data:image/') || resultImage.startsWith('http')) ? (
                <Image
                  src={resultImage.trim()}
                  alt="Virtual try-on result"
                  width={400}
                  height={600}
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              ) : (
                <div className="w-full max-w-md mx-auto h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    {t("virtual_tryon.error_generation")}
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-6 text-center space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("virtual_tryon.result_question").replace("{productName}", selectedProduct?.name || "")}
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isAddingToCart ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept & Add to Cart
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={resetTryOn}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Try Different Look
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
