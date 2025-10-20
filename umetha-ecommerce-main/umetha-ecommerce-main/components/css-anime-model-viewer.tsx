"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trash2, RotateCcw, Camera, Maximize, Minimize, ZoomIn, ZoomOut } from "lucide-react";

interface OutfitItem {
  id: string;
  name: string;
  type: "top" | "bottom" | "shoes" | "accessories" | "suit" | "dress";
  price: number;
  image: string;
  color?: string;
  gender?: "male" | "female" | "unisex";
  size?: string;
  category: string;
}

interface CSSAnimeModelViewerProps {
  selectedOutfit?: OutfitItem;
  onOutfitChange?: (outfit: OutfitItem) => void;
  onClearAll?: () => void;
  className?: string;
  // When provided, this overrides internal worn items state and is rendered directly
  items?: OutfitItem[];
}

// Anime-style Human Model Component using CSS 3D transforms
function CSSAnimeModel({ 
  gender = "female", 
  selectedItems = [],
  zoomLevel = 1,
  rotation = 0
}: { 
  gender: "male" | "female";
  selectedItems: OutfitItem[];
  zoomLevel: number;
  rotation: number;
}) {
  const [animationTime, setAnimationTime] = useState(0);

  // Gentle breathing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime(prev => prev + 0.1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Determine model gender based on items
  const isMasculine = selectedItems.some(item => 
    item.type === "suit" || 
    (item.gender === "male") ||
    item.name.toLowerCase().includes("suit") ||
    item.name.toLowerCase().includes("tie") ||
    item.name.toLowerCase().includes("sneakers")
  );

  const isFeminine = selectedItems.some(item => 
    item.type === "dress" || 
    (item.gender === "female") ||
    item.name.toLowerCase().includes("dress") ||
    item.name.toLowerCase().includes("heels") ||
    item.name.toLowerCase().includes("purse")
  );

  const currentGender = isMasculine ? "male" : isFeminine ? "female" : gender;

  // Breathing effect
  const breathingScale = 1 + Math.sin(animationTime * 2) * 0.02;

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center"
      style={{ 
        transform: `scale(${zoomLevel * breathingScale})`,
        transformStyle: "preserve-3d"
      }}
    >
      {/* Anime-style Human Model */}
      <div 
        className="relative"
        style={{
          transform: `rotateY(${rotation}deg)`,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Head */}
        <div className="relative w-20 h-24 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full shadow-lg mb-2">
          {/* Hair */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-22 h-10 bg-gradient-to-b from-amber-800 to-amber-900 rounded-full"></div>
          {/* Eyes */}
          <div className="absolute top-8 left-5 w-2 h-2 bg-black rounded-full"></div>
          <div className="absolute top-8 right-5 w-2 h-2 bg-black rounded-full"></div>
          {/* Nose */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full"></div>
          {/* Mouth */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-amber-500 rounded-full"></div>
          {/* Gender-specific features */}
          {currentGender === "male" && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-amber-600 rounded-full"></div>
          )}
        </div>
        
        {/* Neck */}
        <div className="w-8 h-6 bg-gradient-to-b from-amber-200 to-amber-300 mx-auto rounded-full"></div>
        
        {/* Torso */}
        <div className="relative w-24 h-40 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full shadow-lg mt-2">
          {/* Outfit overlays */}
          {selectedItems.map((item, index) => (
            <CSSOutfitOverlay key={`${item.id}-${index}`} item={item} />
          ))}
        </div>
        
        {/* Arms */}
        <div className="absolute top-12 -left-6 w-8 h-24 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full transform rotate-12"></div>
        <div className="absolute top-12 -right-6 w-8 h-24 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full transform -rotate-12"></div>
        
        {/* Legs */}
        <div className="flex justify-center gap-3 mt-2">
          <div className="w-10 h-32 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full"></div>
          <div className="w-10 h-32 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full"></div>
        </div>
        
        {/* Feet */}
        <div className="flex justify-center gap-6 mt-1">
          <div className="w-8 h-6 bg-gradient-to-b from-amber-300 to-amber-400 rounded-full"></div>
          <div className="w-8 h-6 bg-gradient-to-b from-amber-300 to-amber-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

// Individual worn item component using CSS
function CSSOutfitOverlay({ item }: { item: OutfitItem }) {
  const getItemStyle = () => {
    const baseStyle = {
      position: "absolute" as const,
      left: "50%",
      transform: "translateX(-50%)",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      border: "2px solid rgba(255,255,255,0.3)",
      zIndex: 10
    };

    switch (item.type) {
      case "top":
      case "suit":
        return {
          ...baseStyle,
          top: "0px",
          width: "100px",
          height: "60px",
          backgroundColor: item.color || "#4f46e5"
        };
      case "bottom":
        return {
          ...baseStyle,
          top: "60px",
          width: "90px",
          height: "100px",
          backgroundColor: item.color || "#4f46e5"
        };
      case "shoes":
        return {
          ...baseStyle,
          top: "160px",
          width: "80px",
          height: "30px",
          backgroundColor: item.color || "#4f46e5"
        };
      case "accessories":
        return {
          ...baseStyle,
          top: "10px",
          width: "30px",
          height: "30px",
          backgroundColor: item.color || "#4f46e5",
          zIndex: 15
        };
      case "dress":
        return {
          ...baseStyle,
          top: "0px",
          width: "110px",
          height: "120px",
          backgroundColor: item.color || "#4f46e5"
        };
      default:
        return {
          ...baseStyle,
          top: "20px",
          width: "40px",
          height: "40px",
          backgroundColor: item.color || "#4f46e5"
        };
    }
  };

  return (
    <div 
      style={getItemStyle()}
      className="transition-all duration-500 ease-in-out"
    />
  );
}

// Main CSS Anime Model Viewer Component
export default function CSSAnimeModelViewer({ 
  selectedOutfit, 
  onOutfitChange,
  onClearAll,
  className = "",
  items
}: CSSAnimeModelViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentOutfit, setCurrentOutfit] = useState<OutfitItem | undefined>(selectedOutfit);
  const [wornItems, setWornItems] = useState<OutfitItem[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  // Handle outfit changes
  const handleOutfitChange = useCallback((outfit: OutfitItem) => {
    setCurrentOutfit(outfit);
    
    // Add to worn items if not already worn
    setWornItems(prev => {
      const existingIndex = prev.findIndex(item => item.type === outfit.type);
      if (existingIndex >= 0) {
        // Replace existing item of same type
        const newItems = [...prev];
        newItems[existingIndex] = outfit;
        return newItems;
      } else {
        // Add new item
        return [...prev, outfit];
      }
    });
    
    onOutfitChange?.(outfit);
  }, [onOutfitChange]);

  // Clear all items
  const handleClearAll = useCallback(() => {
    setWornItems([]);
    setCurrentOutfit(undefined);
    onClearAll?.();
  }, [onClearAll]);

  // Auto rotation
  useEffect(() => {
    if (isAutoRotating) {
      const interval = setInterval(() => {
        setRotation(prev => (prev + 1) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isAutoRotating]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Prefer externally-controlled items if provided
  const displayedItems = Array.isArray(items) ? items : wornItems;

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/20">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-medium text-indigo-700 dark:text-violet-300">
              Loading anime model...
            </p>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full">
          {/* 3D Model Container */}
          <div className="relative w-full h-full bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/20 rounded-lg overflow-hidden">
            <CSSAnimeModel 
              gender="female"
              selectedItems={displayedItems}
              zoomLevel={zoomLevel}
              rotation={rotation}
            />
          </div>

          {/* Control Panel */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm"
            >
              <Camera size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm"
              onClick={() => setIsAutoRotating(!isAutoRotating)}
            >
              <RotateCcw size={18} />
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm"
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 2))}
            >
              <ZoomIn size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm"
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.5))}
            >
              <ZoomOut size={18} />
            </Button>
          </div>

          {/* Clear All Button */}
          <div className="absolute bottom-4 left-4">
            <Button
              onClick={handleClearAll}
              variant="destructive"
              size="sm"
              className="gap-2"
            >
              <Trash2 size={16} />
              Clear All
            </Button>
          </div>

          {/* Current Outfit Display */}
          {displayedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 right-4 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-lg p-4 shadow-lg max-w-xs"
            >
              <h3 className="font-medium text-indigo-700 dark:text-violet-300 mb-2">
                Currently Wearing
              </h3>
              <div className="space-y-1">
                {displayedItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Gender Indicator */}
          {displayedItems.length > 0 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full px-3 py-1 text-sm font-medium">
              {displayedItems.some(item => item.gender === "male" || item.type === "suit") ? "♂ Male Model" : "♀ Female Model"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
