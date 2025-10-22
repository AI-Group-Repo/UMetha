"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Sparkles } from "lucide-react";
import MainLayout from "@/components/main-layout";
import VirtualTryOn from "@/components/virtual-tryon";
import { useTranslation } from 'react-i18next';
const products = [
  // Dresses
  {
    id: "1",
    name: "Casual Summer Dress",
    price: 89.99,
    image: "https://img.kwcdn.com/thumbnail/s/b10896c49443cf81ca870805c0e3b5be_30a68369c827.jpg?imageView2/2/w/264/q/70/format/webp",
    category: "Dresses",
  },
  {
    id: "2",
    name: "Evening Gown",
    price: 299.99,
    image: "https://img.kwcdn.com/thumbnail/s/e83c2e468b9f7538546f699791beecc2_18eebe2f1d81.jpg?imageView2/2/w/264/q/70/format/webp",
    category: "Dresses",
  },
  {
    id: "3",
    name: "Cocktail Dress",
    price: 149.99,
    image: "https://img.kwcdn.com/thumbnail/s/571d50301ce558b2f3fcc682f1693747_e199858053b0.jpg?imageView2/2/w/264/q/70/format/webp",
    category: "Dresses",
  },
  {
    id: "4",
    name: "Maxi Dress",
    price: 119.99,
    image: "https://img.kwcdn.com/thumbnail/s/7f4753ccf1c316113aec86c33674181b_576e16a6622f.jpg?imageView2/2/w/264/q/70/format/webp",
    category: "Dresses",
  },
  {
    id: "5",
    name: "Midi Dress",
    price: 99.99,
    image: "https://img.kwcdn.com/thumbnail/s/bc4337832ee55a502ace3318239a761e_aef8ba04c838.jpg?imageView2/2/w/264/q/70/format/webp",
    category: "Dresses",
  },
  {
    id: "6",
    name: "Wrap Dress",
    price: 79.99,
    image: "https://img.kwcdn.com/thumbnail/s/c153aa093b7f4ef67ab5b9ebaaf07200_70b8f166a8c5.jpg?imageView2/2/w/264/q/70/format/webp",
    category: "Dresses",
  },
  {
    id: "7",
    name: "Shift Dress",
    price: 69.99,
    image: "https://img.kwcdn.com/thumbnail/s/75fb94f29a5b57787f204fd2a95a06c3_5a34552a3daa.jpg?imageView2/2/w/264/q/70/format/webp",
    category: "Dresses",
  },
  {
    id: "8",
    name: "Bodycon Dress",
    price: 89.99,
    image: "https://img.kwcdn.com/thumbnail/s/e9e8deceee5efd7defe13ec4914a90a9_aa762b71ffad.jpg?imageView2/2/w/264/q/70/format/webp",
    category: "Dresses",
  },

  // Suits & Blazers
  {
    id: "9",
    name: "Business Suit",
    price: 199.99,
    image: "https://img.kwcdn.com/thumbnail/s/f74fb18fbf23e4d7dd60a381e21ec153_37aa09ac997e.jpg?imageView2/2/w/264/q/70/format/webp",
    category: "Suits",
  },
  {
    id: "10",
    name: "Blazer",
    price: 129.99,
    image: "https://img.kwcdn.com/thumbnail/s/e9e06971cec183935b6924dc958cae70_59d56feb168c.jpg?imageView2/2/w/264/q/70/format/webp",
    category: "Suits",
  },
  {
    id: "11",
    name: "Pantsuit",
    price: 179.99,
    image: "https://img.kwcdn.com/thumbnail/s/7ed9ae84a8840c50d95ee135739c2a23_f172447c758a.jpg?imageView2/2/w/264/q/70/format/webp",
    category: "Suits",
  },
  {
    id: "12",
    name: "Tuxedo",
    price: 399.99,
    image: "https://img.kwcdn.com/thumbnail/s/2d0b6b29950eabb879014ded30af97c7_2744e1c6007a.jpg?imageView2/2/w/264/q/70/format/webp",
    category: "Suits",
  },
  {
    id: "13",
    name: "Trouser Suit",
    price: 159.99,
    image: "https://img.kwcdn.com/thumbnail/s/ddcea4f9c094ceaf2240dc6bb103f86c_d0f7328df467.jpg?imageView2/2/w/264/q/70/format/webp",
    category: "Suits",
  },

  // Tops
  {
    id: "14",
    name: "Casual T-Shirt",
    price: 29.99,
    image: "https://image.made-in-china.com/202f0j00EVzoYpRtUfrH/Wholesale-100-Cotton-High-Quality-Printing-Your-Brand-Logo-Men-s-T-Shirt-Solid-Color-Casual-Men-Short-Sleeve-Custom-T-Shirt.webp",
    category: "Tops",
  },
  {
    id: "15",
    name: "Blouse",
    price: 59.99,
    image: "https://img.kwcdn.com/thumbnail/s/53d6ff93e3b0b1ee0ba12e3cdfb892da_3c24406bd24d.jpg?imageView2/2/w/264/q/70/format/webp",
    category: "Tops",
  },
  
];

export default function VirtualRoomPage() {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const { t } = useTranslation();

  // Check for preloaded product from modal
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const preloadedProduct = sessionStorage.getItem('selectedProductForTryOn');
      if (preloadedProduct) {
        try {
          const product = JSON.parse(preloadedProduct);
          // Find matching product in the available products or create a new one
          const existingProduct = products.find(p => p.id === product.id);
          if (existingProduct) {
            setSelectedProduct(existingProduct);
          } else {
            // Create a new product object that matches the expected structure
            setSelectedProduct({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              category: product.category || 'Clothing'
            });
          }
          // Clear the session storage after use
          sessionStorage.removeItem('selectedProductForTryOn');
        } catch (error) {
          console.error('Error parsing preloaded product:', error);
        }
      }
    }
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-4"
            >
              {t("virtual_tryon.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              {t("virtual_tryon.subtitle")}
            </motion.p>
          </div>

          {/* Virtual Try-On Component */}
          <VirtualTryOn
            selectedProduct={selectedProduct}
            onProductSelect={setSelectedProduct}
            availableProducts={products}
          />
        </div>
      </div>
    </MainLayout>
  );
}