"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useCart } from "@/context/cart-context";

interface PriceCartButtonProps {
  id: number | string; // Update to accept both number and string
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image?: string;
}

export default function PriceCartButton({
  id,
  name,
  price,
  originalPrice,
  discount,
  image = "",
}: PriceCartButtonProps) {
  const { theme } = useTheme();
  const { addItem } = useCart();
  const isDark = theme === "dark";
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAdding || isAdded) return;

    setIsAdding(true);
    try {
      await addItem({
        id,
        name,
        price,
        originalPrice,
        image,
        quantity: 1,
      });
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="relative">
      {/* Discount Badge - Enhanced */}
      {discount && discount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 z-10"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-600 blur-sm opacity-50" />
            <div className="relative bg-gradient-to-br from-red-500 to-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              -{Math.round(discount)}%
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Button */}
      <motion.button
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        className={cn(
          "group relative w-full overflow-hidden rounded-2xl transition-all duration-300",
          "flex items-center justify-between",
          "shadow-lg hover:shadow-xl",
          "h-[3rem] sm:h-[3rem] max-w-full", // Changed min-h to h for consistent sizing
          isAdded
            ? "bg-gradient-to-br from-emerald-500 to-green-600 border-0"
            : "bg-gradient-to-r from-indigo-500 to-blue-400 border-0 shadow-blue-600/20"
        )}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Price Section - Enhanced with shrinking effect */}
        <div
          className={cn(
            "flex items-center flex-shrink",
            "px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2",
          
            "w-full overflow-hidden rounded-l-2xl transition-all duration-300",
            isAdded ? "border-emerald-400/30" : "border-purple-400/20"
          )}
        >
          <div className="flex flex-col w-full min-w-0 scale-100 group-hover:scale-90 transition-all duration-300">
            {originalPrice && (
              <span className="text-[8px] xs:text-[9px] sm:text-xs text-white/60 line-through font-medium truncate transform transition-transform duration-300 group-hover:scale-[0.85]">
                ${originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-[10px] xs:text-xs sm:text-sm md:text-base font-bold text-white tracking-wide truncate transform transition-transform duration-300 group-hover:scale-[0.85]">
              ${price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Cart Section - Enhanced with shrinking effect */}
        <div className="flex items-center justify-center flex-shrink-0 px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 backdrop-blur-sm w-[28px] xs:w-[32px] sm:w-[36px] md:w-[40px] rounded-r-2xl transition-all duration-300">
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 border-2 border-white/40 border-t-white rounded-full animate-spin transform group-hover:scale-90 transition-transform duration-300"
              />
            ) : isAdded ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, rotate: [0, 360] }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-white/90 transform group-hover:scale-90 transition-transform duration-300"
              >
                <Check className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 drop-shadow" />
              </motion.div>
            ) : (
              <motion.div
                key="cart"
                initial={false}
                animate={{
                  y: isHovered ? -2 : 0,
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 400 }}
                className="text-white/90 transform group-hover:scale-90 transition-transform duration-300"
              >
                <ShoppingCart 
                  className={cn(
                    "h-2 w-2 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 drop-shadow",
                    "transform transition-transform duration-300 group-hover:scale-[0.85]"
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Hover Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 rounded-2xl"
          initial={{ x: "100%" }}
          animate={{
            x: isHovered ? "-100%" : "100%",
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
        />
      </motion.button>
    </div>
  );
}