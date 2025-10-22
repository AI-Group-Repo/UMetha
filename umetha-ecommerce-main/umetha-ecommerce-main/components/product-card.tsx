"use client";

import React from 'react';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { useProductModal } from '@/context/product-modal-context';
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
  translations?: {
    name: string;
    description: string;
    language: string;
  }[];
}

interface ProductCardProps {
  product: Product;
  language?: string;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  className?: string;
}

export function ProductCard({ 
  product, 
  language = 'en', 
  onAddToCart, 
  onAddToWishlist,
  className = "" 
}: ProductCardProps) {
  const { t } = useTranslation();
  const { openModal } = useProductModal();
  // Get translated content based on language
  const getTranslatedContent = () => {
    if (product.translations && product.translations.length > 0) {
      const translation = product.translations.find(t => t.language === language);
      if (translation) {
        return {
          name: t(translation.name),
          description: translation.description
        };
      }
    }
    return {
      name: t(product.name),
      description: product.description
    };
  };

  const { name, description } = getTranslatedContent();
  const mainImage = product.images?.[0] || '/placeholder-product.jpg';
  const isInStock = product.stock > 0;

  return (
    <div className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${className}`}>
      {/* Product Image Section */}
      <div 
        className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer"
        onClick={() => openModal(product)}
      >
        <Image
          src={mainImage}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToWishlist?.(product.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
          aria-label="Add to wishlist"
        >
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
        </button>

        {/* Stock Badge */}
        {!isInStock && (
          <div className="absolute top-3 left-3">
            <Badge variant="destructive" className="text-xs">
              Out of Stock
            </Badge>
          </div>
        )}

        {/* Category Badge */}
        {product.category && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="text-xs bg-black/20 text-white border-white/30">
              {t(product.category.name)}
            </Badge>
          </div>
        )}
      </div>

      {/* Product Information Section */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">
          {t(name)}
        </h3>
        <p className="text-gray-600 text-sm italic line-clamp-2">
          {t(description)}
        </p>
      </div>

      {/* Call to Action Section */}
      <div className="px-4 pb-4">
        <Button
          onClick={() => onAddToCart?.(product.id)}
          disabled={!isInStock}
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-bold">
              ${product.price.toFixed(2)}
            </span>
            <ShoppingCart className="w-5 h-5" />
          </div>
        </Button>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}

// Product Grid Component
interface ProductGridProps {
  products: Product[];
  language?: string;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  className?: string;
}

export function ProductGrid({ 
  products, 
  language = 'en', 
  onAddToCart, 
  onAddToWishlist,
  className = "" 
}: ProductGridProps) {
  const { t } = useTranslation();
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold mb-2">{t('homepage.no_products_found')}</h3>
        <p className="text-sm">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          language={language}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
        />
      ))}
    </div>
  );
}
