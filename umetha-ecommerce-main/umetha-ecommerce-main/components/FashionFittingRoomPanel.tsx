"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Sparkles,
  Shirt,
  ArrowRight,
  CheckCircle2,
  Camera,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Palette,
} from "lucide-react";
import { useTranslation } from 'react-i18next';
export default function FashionFittingRoomPanel() {
  const [activeView, setActiveView] = useState("main"); // main, tryOn, outfit
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
const { t } = useTranslation();
  const models = [
    {
      id: 1,  
      image: "/fitting.webp",
      name: t('homepage.casual_style'),
      items: 4,
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1566491888763-e71518bbe846?q=80&w=1374",
      name: t('homepage.evening_look'),
      items: 3,
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1470",
      name: t('homepage.summer_collection'),
      items: 5,
    },
  ];

  const features = [
    {
      title: t('homepage.3d_body_scanning'),
      description: "Create your digital twin",
      icon: <Camera className="h-5 w-5 text-white" />,
      color: "from-blue-500 to-indigo-700",
    },
    {
      title: t('homepage.mix_and_match'),
      description: "Create unlimited combinations",
      icon: <Shirt className="h-5 w-5 text-white" />,
      color: "from-fuchsia-500 to-purple-700",
    },
    {
      title: t('homepage.360_view'),
      description: "See outfits from all angles",
      icon: <RotateCcw className="h-5 w-5 text-white" />,
      color: "from-amber-500 to-orange-700",
    },
    {
      title: t('homepage.color_variations'),
      description: "Try different color options",
      icon: <Palette className="h-5 w-5 text-white" />,
      color: "from-emerald-500 to-green-700",
    },
  ];

  const renderMainView = () => (
    <>
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl mb-6 group">
        <Image
          src={models[currentModelIndex].image}
          alt="Virtual Fitting Room"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-all duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-semibold text-white mb-2">
            {models[currentModelIndex].name}
          </h3>
          <p className="text-white/80 text-sm">
            {models[currentModelIndex].items} items in this collection
          </p>
        </div>

        <Badge className="absolute top-6 right-6 bg-primary text-white font-medium px-4 py-1.5 shadow-xl">
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          {t('homepage.premium')}
        </Badge>

        <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/30 hover:bg-black/50 text-white rounded-full h-12 w-12 ml-3 backdrop-blur-sm"
            onClick={() =>
              setCurrentModelIndex((prev) =>
                prev === 0 ? models.length - 1 : prev - 1
              )
            }
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>

        <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/30 hover:bg-black/50 text-white rounded-full h-12 w-12 mr-3 backdrop-blur-sm"
            onClick={() =>
              setCurrentModelIndex((prev) => (prev + 1) % models.length)
            }
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          {t('homepage.virtual_fashion_studio')}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Experience clothes in our immersive 3D environment before purchasing.
          Create your digital avatar, try on outfits, and visualize your style
          with perfect fit and accuracy.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={`bg-gradient-to-br ${feature.color} rounded-xl p-4 text-white shadow-lg`}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center mb-3 backdrop-blur-sm">
              {feature.icon}
            </div>
            <h4 className="font-medium mb-1">{feature.title}</h4>
            <p className="text-xs text-white/80">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center mr-4">
            <CheckCircle2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-foreground">
              {t('homepage.perfect_fit_guaranteed')}
            </h4>
            <p className="text-xs text-muted-foreground">
              Our AI ensures accurate measurements
            </p>
          </div>
        </div>

        <div className="flex items-center bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center mr-4">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-foreground">
              {t('homepage.custom_avatar_creation')}
            </h4>
            <p className="text-xs text-muted-foreground">
              Make a digital twin with your exact measurements
            </p>
          </div>
        </div>
      </div>

      <Button
        className="w-full group bg-primary hover:bg-primary/90 text-white py-6 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20"
        size="lg"
        asChild
      >
        <Link
          href="/virtual-room?category=fashion"
          className="flex items-center justify-center"
        >
          {t('homepage.enter_immersive_studio')}
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </>
  );

  return (
    <motion.div
      className="w-full h-full flex flex-col bg-background/95 backdrop-blur-md rounded-2xl border border-primary/20 shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderMainView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
