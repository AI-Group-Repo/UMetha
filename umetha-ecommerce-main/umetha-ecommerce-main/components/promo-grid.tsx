"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTranslation } from 'react-i18next';

// Sample product data (keeping the same structure as original)
const getProducts = (t: any) => [
  {
    id: 1,
    title: t('homepage.up_to_30_off'),
    subtitle: t('homepage.for_all_hand_purses'),
    href: "/category/purses",
    image: "/handbag1.jpg",
  },
  {
    id: 2,
    title: t('homepage.explore_biggest_discount'),
    subtitle: t('homepage.time_zone'),
    href: "/category/bargains",
    image: "/headphones1.jpg",
  },
  {
    id: 3,
    title: t('homepage.dont_miss_year_end') + " " + t('homepage.sale'),
    subtitle: "7 " + t('homepage.days_left'),
    href: "/sale",
    image: "/shoes.jpg",
  },
  
];

export default function ProductCarousel3D() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useTranslation();
  const products = getProducts(t);
  
  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [products.length]);

  // Calculate positions for each product
  const getProductStyles = (index) => {
    // Determine position relative to active item
    const position = (index - activeIndex + products.length) % products.length;
    
    // Map positions to 0, 1, 2 (left, center, right)
    const positionMap = {
      0: { // Center
        zIndex: 3,
        x: 0,
        scale: 1,
        opacity: 1,
        rotateY: 0,
        filter: "blur(0px)",
      },
      1: { // Right
        zIndex: 1,
        x: 250,
        scale: 0.8,
        opacity: 0.6,
        rotateY: 15,
        filter: "blur(2px)",
      },
      2: { // Left
        zIndex: 1,
        x: -250,
        scale: 0.8,
        opacity: 0.6,
        rotateY: -15,
        filter: "blur(2px)",
      },
    };
    
    return positionMap[position];
  };

  // Handle navigation
  const goToNext = () => setActiveIndex((prev) => (prev + 1) % products.length);
  const goToPrev = () => setActiveIndex((prev) => (prev - 1 + products.length) % products.length);

  return (
    <div className="relative w-full h-[450px] flex justify-center items-center perspective-500">
      <div className="relative h-full w-full flex items-center justify-center">
        {/* Products */}
        {products.map((product, index) => {
          const styles = getProductStyles(index);
          
          return (
            <motion.div
              key={product.id}
              className="absolute w-[350px] md:w-[500px] lg:w-[500px] h-[350px] p-6 rounded-xl shadow-xl overflow-hidden cursor-pointer transition-all"
              style={{
                backgroundImage: `url(${product.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              animate={{
                x: styles.x,
                scale: styles.scale,
                opacity: styles.opacity,
                zIndex: styles.zIndex,
                rotateY: styles.rotateY,
                filter: styles.filter,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              onClick={() => setActiveIndex(index)}
            >
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              
              {/* Product information */}
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <motion.h2
                  className="text-3xl font-bold mb-2"
                  animate={{ opacity: styles.opacity }}
                >
                  {product.title}
                </motion.h2>
                <motion.p
                  className="text-lg opacity-90"
                  animate={{ opacity: styles.opacity }}
                >
                  {product.subtitle}
                </motion.p>
                <motion.div
                  className="mt-4"
                  animate={{ opacity: styles.opacity }}
                >
                  <Link 
                    href={product.href}
                    className={`inline-block px-6 py-2 rounded-full ${styles.zIndex === 3 ? 'bg-white text-black' : 'bg-white/30 text-white'} font-medium transition-all hover:bg-white hover:text-black`}
                  >
                    {t('homepage.shop_now')}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
        
     
        
        {/* Indicator Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex ? "bg-white scale-125" : "bg-white/40"
              }`}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}