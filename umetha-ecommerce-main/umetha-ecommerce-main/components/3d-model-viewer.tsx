"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface OutfitItem {
  id: string;
  name: string;
  type: "top" | "bottom" | "shoes" | "accessories";
  modelUrl?: string;
  textureUrl?: string;
  color?: string;
  position?: [number, number, number];
  scale?: [number, number, number];
}

interface ModelViewerProps {
  selectedOutfit?: OutfitItem;
  onOutfitChange?: (outfit: OutfitItem) => void;
  modelType?: "male" | "female";
  zoomLevel?: number;
  className?: string;
}

// 3D Model Component using CSS 3D transforms
function Model3D({ 
  selectedOutfit, 
  modelType = "female",
  zoomLevel = 1 
}: { 
  selectedOutfit?: OutfitItem;
  modelType: "male" | "female";
  zoomLevel: number;
}) {
  const [rotation, setRotation] = useState(0);
  
  // Animate rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center"
      style={{ 
        transform: `scale(${zoomLevel})`,
        transformStyle: "preserve-3d"
      }}
    >
      {/* Adult Human Model */}
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
        </div>
        
        {/* Neck */}
        <div className="w-8 h-6 bg-gradient-to-b from-amber-200 to-amber-300 mx-auto rounded-full"></div>
        
        {/* Torso */}
        <div className="relative w-24 h-40 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full shadow-lg mt-2">
          {/* Outfit overlay */}
          {selectedOutfit && (
            <OutfitOverlay outfit={selectedOutfit} />
          )}
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

// Outfit overlay component
function OutfitOverlay({ outfit }: { outfit: OutfitItem }) {
  const getOutfitStyle = () => {
    const baseStyle = {
      position: "absolute" as const,
      left: "50%",
      transform: "translateX(-50%)",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      border: "2px solid rgba(255,255,255,0.3)"
    };

    switch (outfit.type) {
      case "top":
        return {
          ...baseStyle,
          top: "0px",
          width: "100px",
          height: "60px",
          backgroundColor: outfit.color || "#4f46e5",
          zIndex: 10
        };
      case "bottom":
        return {
          ...baseStyle,
          top: "60px",
          width: "90px",
          height: "100px",
          backgroundColor: outfit.color || "#4f46e5",
          zIndex: 10
        };
      case "shoes":
        return {
          ...baseStyle,
          top: "160px",
          width: "80px",
          height: "30px",
          backgroundColor: outfit.color || "#4f46e5",
          zIndex: 10
        };
      case "accessories":
        return {
          ...baseStyle,
          top: "10px",
          width: "30px",
          height: "30px",
          backgroundColor: outfit.color || "#4f46e5",
          zIndex: 15
        };
      default:
        return {
          ...baseStyle,
          top: "20px",
          width: "40px",
          height: "40px",
          backgroundColor: outfit.color || "#4f46e5",
          zIndex: 10
        };
    }
  };

  return (
    <div 
      style={getOutfitStyle()}
      className="transition-all duration-500 ease-in-out"
    />
  );
}

// Main 3D Model Viewer Component
export default function Model3DViewer({ 
  selectedOutfit, 
  onOutfitChange,
  modelType = "female",
  zoomLevel = 1,
  className = ""
}: ModelViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentOutfit, setCurrentOutfit] = useState<OutfitItem | undefined>(selectedOutfit);

  // Handle outfit changes
  const handleOutfitSelect = useCallback((outfit: OutfitItem) => {
    setCurrentOutfit(outfit);
    onOutfitChange?.(outfit);
  }, [onOutfitChange]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/20">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-medium text-indigo-700 dark:text-violet-300">
              Loading 3D model...
            </p>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/20 rounded-lg overflow-hidden">
          <Model3D 
            selectedOutfit={currentOutfit} 
            modelType={modelType}
            zoomLevel={zoomLevel}
          />
        </div>
      )}
      
      {/* Outfit selection overlay */}
      {currentOutfit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-lg p-4 shadow-lg"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-indigo-700 dark:text-violet-300">
                {currentOutfit.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentOutfit.type} • Fitted automatically
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-indigo-100 dark:bg-violet-900/40 text-indigo-700 dark:text-violet-300 rounded-full text-xs font-medium">
                Try Different Color
              </button>
              <button className="px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-medium hover:bg-indigo-700">
                Add to Cart
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
