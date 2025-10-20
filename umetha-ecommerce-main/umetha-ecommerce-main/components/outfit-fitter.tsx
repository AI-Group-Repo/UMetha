"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shirt, 
  Footprints, 
  Watch, 
   
  Sparkles, 
  RotateCcw,
  Palette,
  CheckCircle2,
  X
} from "lucide-react";
import Image from "next/image";
import { useTranslation } from 'react-i18next';
interface OutfitItem {
  id: string;
  name: string;
  type: "top" | "bottom" | "shoes" | "accessories";
  price: number;
  image: string;
  color?: string;
  availableColors?: string[];
  size?: string;
  category: string;
}

interface OutfitFitterProps {
  onOutfitChange: (outfit: OutfitItem) => void;
  currentOutfit?: OutfitItem;
  className?: string;
}
const { t } = useTranslation();

const outfitCategories = [
  {
    id: "tops",
    name: t('homepage.tops'),
    icon: <Shirt className="h-5 w-5" />,
    items: [
      {
        id: "casual-tshirt",
        name: t('homepage.classic_white_t_shirt'),
        type: "top" as const,
        price: 29.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
        color: "#ffffff",
        availableColors: ["#ffffff", "#000000", "#4f46e5", "#dc2626"],
        size: "M",
        category: "tops"
      },
      {
        id: "denim-jacket",
        name: t('homepage.vintage_denim_jacket'),
        type: "top" as const,
        price: 89.99,
        image: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=400&q=80",
        color: "#1e40af",
        availableColors: ["#1e40af", "#000000", "#dc2626"],
        size: "L",
        category: "tops"
      },
      {
        id: "blazer",
        name: t('homepage.business_blazer'),
        type: "top" as const,
        price: 199.99,
        image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&q=80",
        color: "#000000",
        availableColors: ["#000000", "#1f2937", "#4f46e5"],
        size: "M",
        category: "tops"
      }
    ]
  },
  {
    id: "bottoms",
    name: t('homepage.bottoms'),
    icon: <Shirt className="h-5 w-5" />,
    items: [
      {
        id: "jeans",
        name: t('homepage.classic_blue_jeans'),
        type: "bottom" as const,
        price: 79.99,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80",
        color: "#1e40af",
        availableColors: ["#1e40af", "#000000", "#dc2626"],
        size: "32",
        category: "bottoms"
      },
      {
        id: "chinos",
        name: t('homepage.khaki_chinos'),
        type: "bottom" as const,
        price: 69.99,
        image: "https://images.unsplash.com/photo-1506629905607-3b3b4b4b4b4b?w=400&q=80",
        color: "#a3a3a3",
        availableColors: ["#a3a3a3", "#000000", "#4f46e5"],
        size: "30",
        category: "bottoms"
      }
    ]
  },
  {
    id: "shoes",
    name: t('homepage.shoes'),
    icon: <Footprints className="h-5 w-5" />,
    items: [
      {
        id: "sneakers",
        name: t('homepage.white_sneakers'),
        type: "shoes" as const,
        price: 129.99,
        image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&q=80",
        color: "#ffffff",
        availableColors: ["#ffffff", "#000000", "#dc2626"],
        size: "9",
        category: "shoes"
      },
      {
        id: "dress-shoes",
      name: t('homepage.leather_dress_shoes'),
        type: "shoes" as const,
        price: 199.99,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80",
        color: "#000000",
        availableColors: ["#000000", "#8b5cf6", "#dc2626"],
        size: "9",
        category: "shoes"
      }
    ]
  },
  {
    id: "accessories",
    name: "Accessories",
    icon: <Watch className="h-5 w-5" />,
    items: [
      {
        id: "watch",
        name: "Classic Watch",
        type: "accessories" as const,
        price: 299.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
        color: "#000000",
        availableColors: ["#000000", "#8b5cf6", "#dc2626"],
        size: "One Size",
        category: "accessories"
      },
      {
        id: "bag",
        name: "Leather Handbag",
        type: "accessories" as const,
        price: 149.99,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
        color: "#8b5cf6",
        availableColors: ["#8b5cf6", "#000000", "#dc2626"],
        size: "One Size",
        category: "accessories"
      }
    ]
  }
];

export default function OutfitFitter({ 
  onOutfitChange, 
  currentOutfit,
  className = "" 
}: OutfitFitterProps) {
  const [activeCategory, setActiveCategory] = useState("tops");
  const [selectedItems, setSelectedItems] = useState<OutfitItem[]>([]);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);

  // Auto-fit outfit when item is selected
  const handleItemSelect = (item: OutfitItem) => {
    // Remove existing item of same type
    const filteredItems = selectedItems.filter(selectedItem => selectedItem.type !== item.type);
    
    // Add new item
    const newItems = [...filteredItems, item];
    setSelectedItems(newItems);
    
    // Notify parent component immediately for auto-fitting
    onOutfitChange(item);
    
    // Show success feedback
    setShowSuccessMessage(`${item.name} applied to model!`);
    setTimeout(() => {
      setShowSuccessMessage(null);
    }, 2000);
  };

  // Handle color change
  const handleColorChange = (itemId: string, color: string) => {
    setSelectedItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, color } : item
      )
    );
    setShowColorPicker(null);
  };

  // Remove item from outfit
  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const currentCategory = outfitCategories.find(cat => cat.id === activeCategory);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Success Message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center"
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                {showSuccessMessage}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {outfitCategories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className="flex items-center gap-2"
          >
            {category.icon}
            {category.name}
          </Button>
        ))}
      </div>

      {/* Current Outfit Display */}
      {selectedItems.length > 0 && (
        <Card className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <h3 className="font-medium text-indigo-700 dark:text-violet-300">
                Current Outfit
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-2 border"
                >
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                  <button
                    onClick={() => setShowColorPicker(item.id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Palette className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                  >
                    <X className="h-3 w-3 text-red-500" />
                  </button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-2 gap-3">
        {currentCategory?.items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative cursor-pointer"
            onClick={() => handleItemSelect(item)}
          >
            <Card className="overflow-hidden border-2 border-transparent hover:border-indigo-200 dark:hover:border-violet-800/50 transition-all">
              <div className="relative aspect-square">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
                {selectedItems.some(selected => selected.id === item.id) && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center"
                  >
                    <CheckCircle2 className="h-8 w-8 text-indigo-600" />
                  </motion.div>
                )}
              </div>
              <CardContent className="p-3">
                <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">${item.price}</p>
                <div className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">{item.size}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Color Picker Modal */}
      <AnimatePresence>
        {showColorPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowColorPicker(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-medium mb-4">Choose Color</h3>
              <div className="grid grid-cols-4 gap-3">
                {currentCategory?.items
                  .find(item => item.id === showColorPicker)
                  ?.availableColors?.map((color) => (
                    <button
                      key={color}
                      className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-indigo-500 transition-colors"
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(showColorPicker, color)}
                    />
                  ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
