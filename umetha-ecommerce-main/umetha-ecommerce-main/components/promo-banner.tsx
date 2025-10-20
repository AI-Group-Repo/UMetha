"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
const getSlides = (t: any) => [
  {
    src: "/fashion-slider.png",
    alt: "Luxury Fashion",
    title: 'Homepage Curated Collections',
    href:"/category/fashion",
    subtitle: 'Homepage Elevate Style',
    gradient: "from-blue-400 to-blue-600",
  },
  {
    src: "/gaming.png",
    alt: "Premium Tech",
    title: 'Homepage Smart Gadgets',
    href:"/category/gaming",
    subtitle: 'Homepage Tomorrow\'s Technology',
    gradient: "from-blue-400 to-blue-600",
  },
  {
    src: "/UNIQUE.png",
    alt: "Abstract Art",
    title: 'Homepage Creative Designs',
    href:"/category/unique",
    subtitle: 'Homepage Artistic Expressions',
    gradient: "from-blue-400 to-blue-600",
  },
  {
    src: "/fashion-slide2.png",
    alt: "Fashion Model",
    title: 'Homepage Trending Fashion',
    href:"/category/fashion",
    subtitle: 'Homepage Trendsetting Styles',
    gradient: "from-blue-400 to-blue-600",
  },
  {
    src: "/electronics2.png",
    alt: "Home Appliances",
    title: 'Homepage Modern Living',
    href:"/category/decoration",
    subtitle: 'Homepage Effortless Comfort',
    gradient: "from-blue-400 to-blue-600",
  },
  {
    src: "/beauty-slider.png",
    alt: "Skincare Products",
    title: 'Homepage Glow Naturally',
    href:"/category/beauty",
    subtitle: 'Homepage Healthy Skin',
    gradient: "from-blue-400 to-blue-600",
  },
];

export default function PromoBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  
  const { t } = useTranslation();
  
  const slides = getSlides(t);

  useEffect(() => {
    if (!isAutoplay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoplay, slides.length]);

  const nextSlide = () => {
    setIsAutoplay(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIsAutoplay(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };


  return (
    <div className="relative overflow-hidden rounded-xl shadow-2xl mt-4 mx-6 group">
      {/* Gradient Background with Animation */}

      <motion.div 
        className={`absolute inset-0 bg-gradient-to-r from-[#87D3FA] to-[#00A9FF] opacity-90`}

        initial={{ opacity: 0.7 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 1 }}
      />
      <div className="absolute inset-0 bg-opacity-20 backdrop-blur-sm" />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/30"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 h-[350px] md:h-[420px] relative overflow-hidden">
        {/* Left Side - Text */}
        <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center relative z-10">
          <motion.h2
            key={`subtitle-${currentSlide}`}
            className="text-sm md:text-base font-semibold mb-2 text-white/80 uppercase tracking-wider"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {slides[currentSlide].subtitle}
          </motion.h2>

          <motion.h1
            key={`title-${currentSlide}`}
            className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-md"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {slides[currentSlide].title}
          </motion.h1>

          <motion.p
            key={`description-${currentSlide}`}
            className="text-sm md:text-base mb-6 text-white/90 max-w-md"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          ></motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >

            <Link
              href={slides[currentSlide].href} 
              className=" bg-gradient-to-r from-indigo-500 to-blue-400 w-fit px-6 py-2.5 text-sm md:text-base bg-white/20 hover:bg-white/40 text-white border-none shadow-xl transition-all duration-300 rounded-xl"

            >
              {t('common.explore')}
            </Link>
          </motion.div>
        </div>

        {/* Right Side - Image */}
        <div className="relative h-full flex justify-center items-center overflow-hidden">
          <Tilt
            glareEnable={true}
            glareMaxOpacity={0.3}
            tiltMaxAngleX={8}
            tiltMaxAngleY={8}
            scale={1.05}
            transitionSpeed={1500}
            className="w-full h-full"
          >
            <motion.div
              className="relative h-[90%] w-full overflow-hidden "
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                y: [0, -10, 0]
              }}
              transition={{ 
                delay: 0.5,
                y: {
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }
              }}
            >
              {slides.map((slide, index) => (
                <motion.div
                  key={index}
                  className={`absolute inset-0 w-full h-full transition-all duration-1000 ${

                    index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{
                    opacity: index === currentSlide ? 1 : 0,
                    scale: index === currentSlide ? 1 : 1.1,


                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain md:object-cover h-[90%] rounded-lg shadow-2xl brightness-95 contrast-110"
                    priority
                  />
                </motion.div>
              ))}
            </motion.div>
          </Tilt>

          {/* Decorative elements */}
          <motion.div
          
            className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-white/5"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setIsAutoplay(false);
              setCurrentSlide(index);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white"
                : "bg-white/40 hover:bg-white/60"
            }`}
            whileHover={{ scale: 1.5 }}
            animate={
              index === currentSlide
                ? {
                    scale: [1, 1.5, 1],
                    transition: { duration: 1.5, repeat: Infinity },
                  }
                : {}
            }
          />
        ))}
      </div>
    </div>
  );
}
