"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PriceCartButton from "@/components/ui/price-cart-button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';


interface Product {
  id: string;
  name: string;
  shortName: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  category: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Red Leather Gucci Soho Bag",
    shortName: "Gucci Soho Bag",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1169&auto=format&fit=crop",
    currentPrice: 899.99,
    originalPrice: 1459.99,
    category: "Accessories",
  },
  {
    id: "2",
    name: "LEXRX Triple Hyaluronic Acid Face Cream",
    shortName: "LEXRX Face Cream",
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1176&auto=format&fit=crop",
    currentPrice: 59.99,
    originalPrice: 147.99,
    category: "Skincare",
  },
  {
    id: "3",
    name: "Fujifilm X-T4 Mirrorless Camera",
    shortName: "Fujifilm X-T4",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1164&auto=format&fit=crop",
    currentPrice: 1199.99,
    originalPrice: 1749.99,
    category: "Electronics",
  },
  {
    id: "4",
    name: "Nike Air Sky Blue Kids Sneakers",
    shortName: "Nike Air Sneakers",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop",
    currentPrice: 49.99,
    originalPrice: 89.99,
    category: "Footwear",
  },
  {
    id: "5",
    name: "Fossil Logan Genuine Brown Leather Wallet",
    shortName: "Fossil Leather Wallet",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1171&auto=format&fit=crop",
    currentPrice: 39.99,
    originalPrice: 79.99,
    category: "Accessories",
  },
  {
    id: "6",
    name: "Apple MacBook Pro M2 13 Inch",
    shortName: "MacBook Pro M2",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1176&auto=format&fit=crop",
    currentPrice: 1299.99,
    originalPrice: 1499.99,
    category: "Electronics",
  },
  {
    id: "7",
    name: "Sony WH-1000XM4 Wireless Headphones",
    shortName: "Sony WH-1000XM4",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1170&auto=format&fit=crop",
    currentPrice: 299.99,
    originalPrice: 399.99,
    category: "Electronics",
  },
  {
    id: "8",
    name: "Samsung 49 Odyssey G9 Gaming Monitor",
    shortName: "Samsung Odyssey G9",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1170&auto=format&fit=crop",
    currentPrice: 999.99,
    originalPrice: 1499.99,
    category: "Electronics",
  },
];

// Calculate discount percentages
const productsWithDiscount = products.map((product) => ({
  ...product,
  discount: Math.round(
    ((product.originalPrice - product.currentPrice) / product.originalPrice) *
      100
  ),
}));

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export default function FlashDeals() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [countdown, setCountdown] = useState({
    hours: 5,
    minutes: 59,
    seconds: 59,
  });
  const { t } = useTranslation();
  const itemsPerPage = 4;
  const [[page, direction], setPage] = useState([0, 0]);

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset timer when it reaches zero
          return { hours: 5, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const next = () => {
    setPage([page + 1, 1]);
    setActiveIndex(
      (prevIndex) =>
        (prevIndex + 1) % Math.ceil(productsWithDiscount.length / itemsPerPage)
    );
  };

  const prev = () => {
    setPage([page - 1, -1]);
    setActiveIndex(
      (prevIndex) =>
        (prevIndex -
          1 +
          Math.ceil(productsWithDiscount.length / itemsPerPage)) %
        Math.ceil(productsWithDiscount.length / itemsPerPage)
    );
  };

  useEffect(() => {
    const interval = setInterval(next, 8000);
    return () => clearInterval(interval);
  }, []);

  const visibleProducts = productsWithDiscount.slice(
    activeIndex * itemsPerPage,
    activeIndex * itemsPerPage + itemsPerPage
  );

  return (
    <div  className=" p-8 bg-gradient-to-br from-indigo-50/80 via-purple-50/80 to-violet-50/80 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-violet-950/20 rounded-xl shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-indigo-200/60 dark:border-indigo-800/30">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-violet-600 dark:from-indigo-400/90 dark:to-violet-300/90 bg-clip-text text-transparent">
            ⚡ {t('common.flash_deals')}
          </h2>
          <div className="flex items-center mt-3 text-indigo-700/90 dark:text-indigo-300/90">
            <Clock className="h-5 w-5 mr-2 text-red-500/90 dark:text-red-400/90 animate-pulse" />
            <div className="flex space-x-1 text-sm font-medium">
              <span className="bg-indigo-700/90 dark:bg-indigo-600/70 text-white/90 px-2 py-1 rounded-md">
                {countdown.hours.toString().padStart(2, "0")}
              </span>
              <span className="text-indigo-700/90 dark:text-indigo-300/90 font-bold">
                :
              </span>
              <span className="bg-indigo-700/90 dark:bg-indigo-600/70 text-white/90 px-2 py-1 rounded-md">
                {countdown.minutes.toString().padStart(2, "0")}
              </span>
              <span className="text-indigo-700/90 dark:text-indigo-300/90 font-bold">
                :
              </span>
              <span className="bg-indigo-700/90 dark:bg-indigo-600/70 text-white/90 px-2 py-1 rounded-md">
                {countdown.seconds.toString().padStart(2, "0")}
              </span>
            </div>
            <span className="ml-2 text-xs font-medium text-indigo-600/90 dark:text-indigo-400/90">
              {t('homepage.remaining')}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            className="text-indigo-600/90 dark:text-indigo-400/90 border-indigo-200/60 dark:border-indigo-800/30 hover:bg-indigo-100/80 dark:hover:bg-indigo-800/40 hover:text-indigo-800/90 dark:hover:text-indigo-300/90 hover:border-indigo-300/70 dark:hover:border-indigo-600/50"
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
            variant="outline"
            size="icon"
            onClick={next}
            className="text-indigo-600/90 dark:text-indigo-400/90 border-indigo-200/60 dark:border-indigo-800/30 hover:bg-indigo-100/80 dark:hover:bg-indigo-800/40 hover:text-indigo-800/90 dark:hover:text-indigo-300/90 hover:border-indigo-300/70 dark:hover:border-indigo-600/50"
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

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6"
        >
          {visibleProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.1 * parseInt(product.id),
              }}
              className="group"
            >
              <Card
                className={cn(
                  "overflow-hidden border border-indigo-100/60 dark:border-indigo-800/30 hover:border-violet-300/70 dark:hover:border-violet-700/50 hover:shadow-xl transition-all duration-300 relative bg-white/90 dark:bg-gray-900/40 h-full flex flex-col",
                  hoveredProduct === product.id ? "scale-[1.03]" : ""
                )}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Discount Badge */}
                <div className="absolute left-4 top-4 z-10">
                  <Badge className="px-2.5 py-1.5 bg-red-500/90 dark:bg-red-500/70 text-white/90 font-medium shadow-md">
                    {product.discount}% {t('homepage.off')}
                  </Badge>
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm text-indigo-500/90 dark:text-indigo-400/90 hover:text-indigo-600/90 dark:hover:text-indigo-300/90 hover:bg-white/90 dark:hover:bg-gray-800/70 shadow-sm"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <div className="relative h-48 w-full bg-indigo-50/40 dark:bg-indigo-950/20 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <CardContent className="p-4 space-y-3 flex-grow flex flex-col">
                  <Link href={`/product/${product.id}`} className="flex-grow">
                    <h3 className="font-medium text-sm md:text-base line-clamp-2 min-h-[40px] text-indigo-800/90 dark:text-indigo-200/90 hover:text-indigo-600/90 dark:hover:text-indigo-300/90 transition-colors">
                      {product.shortName}
                    </h3>
                  </Link>

                  <PriceCartButton
                    id={product.id}
                    name={product.name}
                    price={product.currentPrice}
                    originalPrice={product.originalPrice}
                    image={product.image}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center mt-8 space-x-2">
        {Array(Math.ceil(productsWithDiscount.length / itemsPerPage))
          .fill(0)
          .map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 rounded-full transition-all duration-300 focus:outline-none",
                index === activeIndex
                  ? "bg-indigo-600/90 dark:bg-indigo-400/80 w-8"
                  : "bg-indigo-200/70 dark:bg-indigo-700/40 w-2 hover:bg-indigo-300/70 dark:hover:bg-indigo-600/50"
              )}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
      </div>
    </div>
  );
}