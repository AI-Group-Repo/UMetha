"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Heart, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import PriceCartButton from "@/components/ui/price-cart-button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  salesCount: number;
  discountPercent?: number;
  currentPrice: number;
  originalPrice: number;
}


const bestSellerProducts: Product[] = [
  {
    id: "bs1",
    name: "Samsung QLED TV",
    image:
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=2070&auto=format&fit=crop",
    price: 799.99,
    salesCount: 5423,
    discountPercent: 20,
    currentPrice: 799.99,
    originalPrice: 999.99,
  },
  {
    id: "bs2",
    name: "Apple AirPods Pro",
    image:
      "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?q=80&w=2070&auto=format&fit=crop",
    price: 249.99,
    salesCount: 4256,
    discountPercent: 15,
    currentPrice: 249.99,
    originalPrice: 294.11,
  },
  {
    id: "bs3",
    name: "DJI Mini Drone",
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=2070&auto=format&fit=crop",
    price: 399.99,
    salesCount: 3891,
    discountPercent: 15,
    currentPrice: 399.99,
    originalPrice: 470.58,
  },
  {
    id: "bs4",
    name: "Bose Soundbar",
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=2070&auto=format&fit=crop",
    price: 449.99,
    salesCount: 3654,
    discountPercent: 15,
    currentPrice: 449.99,
    originalPrice: 529.40,
  },
  {
    id: "bs5",
    name: "Sony Headphones",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
    price: 179.99,
    salesCount: 3522,
    discountPercent: 25,
    currentPrice: 179.99,
    originalPrice: 239.99,
  },
  {
    id: "bs6",
    name: "iPad Pro",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=2070&auto=format&fit=crop",
    price: 799.99,
    salesCount: 3217,
    discountPercent: 10,
    currentPrice: 799.99,
    originalPrice: 888.88,
  },
  {
    id: "bs7",
    name: "Leather Wallet",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=2070&auto=format&fit=crop",
    price: 59.99,
    salesCount: 3150,
    discountPercent: 30,
    currentPrice: 59.99,
    originalPrice: 85.70,
  },
  {
    id: "bs8",
    name: "Apple Watch",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=2070&auto=format&fit=crop",
    price: 399.99,
    salesCount: 3050,
    discountPercent: 20,
    currentPrice: 399.99,
    originalPrice: 499.99,
  },
];

const productsWithDiscount = bestSellerProducts.map((product) => ({
  ...product,
  discount: Math.round(
    ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100
  ),
}));

export default function BestSellers() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const itemsPerPage = 4;
  const { t } = useTranslation();

  const next = () => {
    setActiveIndex(
      (prevIndex) =>
        (prevIndex + 1) % Math.ceil(bestSellerProducts.length / itemsPerPage)
    );
  };

  const prev = () => {
    setActiveIndex(
      (prevIndex) =>
        (prevIndex - 1 + Math.ceil(bestSellerProducts.length / itemsPerPage)) %
        Math.ceil(bestSellerProducts.length / itemsPerPage)
    );
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(id)) {
        newWishlist.delete(id);
      } else {
        newWishlist.add(id);
      }
      return newWishlist;
    });
  };

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const visibleProducts = bestSellerProducts.slice(
    activeIndex * itemsPerPage,
    activeIndex * itemsPerPage + itemsPerPage
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-indigo-100 to-violet-200 dark:from-indigo-950 dark:to-violet-900 rounded-2xl overflow-hidden shadow-xl p-8"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-violet-300" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-300 dark:to-violet-200 bg-clip-text text-transparent">
              {t("homepage.best_sellers")}
            </h2>
          </div>
          <p className="text-indigo-600 dark:text-violet-300 text-sm font-medium">
    {t('homepage.top_products_love')}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="text-indigo-700 dark:text-violet-300 border-indigo-300 dark:border-violet-700 bg-white/80 dark:bg-violet-950/50 hover:bg-indigo-100 dark:hover:bg-violet-900/70 font-medium shadow-sm"
          >
            {t("homepage.view_all")}
          </Button>
          <div className="flex space-x-2 bg-white/30 dark:bg-violet-950/30 p-1 rounded-lg shadow-inner">
            <Button
              variant="ghost"
              size="icon"
              onClick={prev}
              className="text-indigo-600 dark:text-violet-400 hover:bg-indigo-100/80 dark:hover:bg-violet-900/50 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              className="text-indigo-600 dark:text-violet-400 hover:bg-indigo-100/80 dark:hover:bg-violet-900/50 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="wait">
          {visibleProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative group"
              onHoverStart={() => setHoveredProduct(product.id)}
              onHoverEnd={() => setHoveredProduct(null)}
            >
              <Card
                className={`overflow-hidden border border-indigo-100 hover:border-violet-300 hover:shadow-xl transition-all duration-300 relative bg-white h-full flex flex-col ${
                  hoveredProduct === product.id ? "scale-[1.03]" : ""
                }`}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
               

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <Heart 
                    className={`h-5 w-5 ${
                      wishlist.has(product.id) 
                        ? "fill-red-500 text-red-500" 
                        : "text-gray-400 dark:text-gray-500 group-hover:text-red-400 dark:group-hover:text-red-400"
                    }`} 
                  />
                </button>
                
                <div className="relative aspect-square bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/50 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-indigo-900 dark:text-violet-200 mb-3 line-clamp-1 text-lg group-hover:text-indigo-700 dark:group-hover:text-violet-100 transition-colors">
                    {product.name}
                  </h3>

                  <PriceCartButton
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    originalPrice={
                      product.discountPercent
                        ? product.price / (1 - product.discountPercent / 100)
                        : undefined
                    }
                    
                    image={product.image}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-8 space-x-2">
        {Array(Math.ceil(bestSellerProducts.length / itemsPerPage))
          .fill(0)
          .map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "bg-indigo-600 dark:bg-violet-400 w-8"
                  : "bg-indigo-200 dark:bg-violet-800/50 w-2 hover:bg-indigo-300 dark:hover:bg-violet-700"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
      </div>
    </motion.div>
  );
}