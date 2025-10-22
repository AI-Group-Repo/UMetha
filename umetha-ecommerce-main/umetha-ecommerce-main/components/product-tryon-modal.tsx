"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ShoppingBag, X, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { useProductModal } from '@/context/product-modal-context';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  images: string[];
  category?: {
    name: string;
    slug: string;
  };
  stock: number;
}

// Clothing-related categories that support virtual try-on
const CLOTHING_CATEGORIES = [
  'dress', 'shirt', 'blouse', 'top', 't-shirt', 'tshirt', 'pants', 'jeans', 'trousers',
  'skirt', 'shorts', 'jacket', 'blazer', 'coat', 'sweater', 'hoodie', 'cardigan',
  'shoes', 'sneakers', 'boots', 'heels', 'sandals', 'flats', 'loafers',
  'bag', 'handbag', 'purse', 'backpack', 'tote', 'clutch', 'wallet',
  'hat', 'cap', 'beanie', 'scarf', 'belt', 'watch', 'jewelry', 'accessories',
  'fashion', 'clothing', 'apparel', 'wear', 'outfit', 'garment'
];

export default function ProductTryOnModal() {
  const router = useRouter();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { isOpen, selectedProduct: product, closeModal } = useProductModal();

  if (!product) return null;

  const isClothingRelated = () => {
    if (!product.category) return false;
    
    const categoryName = product.category.name.toLowerCase();
    const productName = product.name.toLowerCase();
    const description = product.description.toLowerCase();
    
    return CLOTHING_CATEGORIES.some(category => 
      categoryName.includes(category) || 
      productName.includes(category) || 
      description.includes(category)
    );
  };

  const handleTryOn = async () => {
    if (!isClothingRelated()) {
      toast({
        title: "Virtual Try-On Not Available",
        description: "This product category doesn't support virtual try-on. You can still add it to your cart.",
        variant: "destructive",
      });
      return;
    }

    // Store the selected product for the virtual try-on page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedProductForTryOn', JSON.stringify({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        category: product.category?.name || 'clothing'
      }));
    }

    closeModal();
    router.push('/virtual-room');
  };

  const handleAddToCart = async () => {
    try {
      await addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        quantity: 1,
      });
      
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
      
      closeModal();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const mainImage = product.images?.[0] || '/placeholder-product.jpg';
  const canTryOn = isClothingRelated();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Product Options
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Product Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-sm">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-green-600">${product.price.toFixed(2)}</span>
              {product.category && (
                <Badge variant="secondary" className="text-xs">
                  {product.category.name}
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {canTryOn ? (
              <Button 
                onClick={handleTryOn}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                size="lg"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Try it on
              </Button>
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">
                  Virtual try-on not available for this product category
                </p>
              </div>
            )}

            <Button 
              onClick={handleAddToCart}
              variant="outline"
              className="w-full"
              size="lg"
              disabled={product.stock === 0}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>

            <Button 
              onClick={closeModal}
              variant="ghost"
              className="w-full"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
