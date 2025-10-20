"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Sparkles } from "lucide-react";
import MainLayout from "@/components/main-layout";
import VirtualTryOnEnhanced from "@/components/virtual-tryon-enhanced";
import { useTranslation } from 'react-i18next';

export default function VirtualTryOnPage() {
  const { t } = useTranslation();

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
              Virtual Try-On
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Upload your photo and try on any products from our collection. See how you look before you buy!
            </motion.p>
          </div>

          {/* Virtual Try-On Component */}
          <VirtualTryOnEnhanced />
        </div>
      </div>
    </MainLayout>
  );
}
