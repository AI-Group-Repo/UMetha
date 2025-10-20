"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  RotateCcw,
  User,
  Zap,
  Sparkles,
  ArrowRight,
  Maximize,
  Minimize,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import MainLayout from "@/components/main-layout";
import dynamic from "next/dynamic";
const FbxModelViewer = dynamic(() => import("@/components/fbx-model-viewer"), { ssr: false });
import AnimeOutfitFitter from "@/components/anime-outfit-fitter";

const outfits = [
  {
    id: 1,
    name: "Casual Summer",
    price: "$89.99",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    thumbnailImage:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=80",
  },
  {
    id: 2,
    name: "Business Formal",
    price: "$129.99",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80",
    thumbnailImage:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=200&q=80",
  },
  {
    id: 3,
    name: "Athletic Wear",
    price: "$79.99",
    image:
      "https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&q=80",
    thumbnailImage:
      "https://images.unsplash.com/photo-1483721310020-03333e577078?w=200&q=80",
  },
  {
    id: 4,
    name: "Evening Elegance",
    price: "$159.99",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80",
    thumbnailImage:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200&q=80",
  },
];

const suggestedItems = [
  {
    id: 1,
    name: "Classic White Sneakers",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&q=80",
  },
  {
    id: 2,
    name: "Denim Jacket",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=400&q=80",
  },
  {
    id: 3,
    name: "Leather Handbag",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
  },
  {
    id: 4,
    name: "Silver Watch",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  },
];

const VirtualFittingRoomPage = () => {
  const [activeModel, setActiveModel] = useState("default");
  const [zoomLevel, setZoomLevel] = useState(75);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [currentOutfit, setCurrentOutfit] = useState(null);
  const [wornItems, setWornItems] = useState([]);

  // Add/replace item by type and set current outfit
  const handleApplyItem = (item) => {
    setCurrentOutfit(item);
    setWornItems((prev) => {
      const idx = prev.findIndex((p) => p.type === item.type);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = item;
        return copy;
      }
      return [...prev, item];
    });
  };

  const handleClearAll = () => {
    setWornItems([]);
    setCurrentOutfit(null);
  };

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const modelOptions = [
    { id: "default", name: "Default", gender: "female" },
    { id: "slim", name: "Slim", gender: "female" },
    { id: "athletic", name: "Athletic", gender: "male" },
    { id: "tall", name: "Tall", gender: "male" },
    { id: "petite", name: "Petite", gender: "female" },
  ];

  const handleModelChange = (id) => {
    setIsLoading(true);
    setActiveModel(id);
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleOutfitSelect = (outfit) => {
    setIsLoading(true);
    setSelectedOutfit(outfit);
    setTimeout(() => setIsLoading(false), 800);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <MainLayout hideShopCategory hide3DFitting>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
            3D Virtual Fitting Room
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Try on clothes virtually and see how they look on you before
            purchasing
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card
              className={`relative overflow-hidden rounded-xl border border-indigo-200 dark:border-violet-800/50 shadow-lg ${
                isFullscreen ? "fixed inset-0 z-50 m-4 lg:m-8" : ""
              }`}
            >
              <div className="absolute top-4 right-4 z-10 space-x-2 flex">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? (
                    <Minimize size={18} />
                  ) : (
                    <Maximize size={18} />
                  )}
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
                >
                  <RotateCcw size={18} />
                </Button>
              </div>

              <div className="relative aspect-square md:aspect-video lg:aspect-square w-full overflow-hidden bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/20">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p className="mt-4 text-sm font-medium text-indigo-700 dark:text-violet-300">
                        Loading your virtual fitting...
                      </p>
                    </div>
                  </div>
                )}

                {showTutorial && !isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm z-10">
                    <div className="max-w-md text-center p-6">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-indigo-100 dark:bg-violet-900/40 flex items-center justify-center">
                          <Sparkles
                            size={24}
                            className="text-indigo-600 dark:text-violet-400"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-indigo-700 dark:text-violet-300">
                          Welcome to the 3D Fitting Room!
                        </h3>
                        <p className="text-muted-foreground mt-2 mb-6">
                          Create your virtual model, try on outfits, and see how
                          they look on you in stunning 3D.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button
                            variant="default"
                            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                            onClick={() => setShowTutorial(false)}
                          >
                            Get Started
                          </Button>
                          <Button
                            variant="outline"
                            className="border-indigo-200 dark:border-violet-800/50"
                          >
                            Watch Tutorial
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  <FbxModelViewer
                    items={wornItems}
                    className="w-full h-full"
                  />
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <Tabs defaultValue="outfits" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="outfits">Outfits</TabsTrigger>
                <TabsTrigger value="model">My Model</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="outfits" className="space-y-4">
                <AnimeOutfitFitter
                  onOutfitChange={handleApplyItem}
                  onClearAll={handleClearAll}
                  currentOutfit={currentOutfit}
                />
              </TabsContent>

              <TabsContent value="model" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Body Type</h3>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-indigo-600 dark:text-violet-400 h-auto p-0"
                  >
                    <User size={14} className="mr-1" /> Customize
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {modelOptions.map((model) => (
                    <Button
                      key={model.id}
                      variant={activeModel === model.id ? "default" : "outline"}
                      className={`text-xs h-auto py-2 flex flex-col gap-1 ${
                        activeModel === model.id
                          ? "bg-indigo-600 hover:bg-indigo-700 dark:bg-violet-700 dark:hover:bg-violet-800"
                          : ""
                      }`}
                      onClick={() => handleModelChange(model.id)}
                    >
                      <span>{model.name}</span>
                      <span className="text-xs opacity-70">
                        {model.gender === "male" ? "♂" : "♀"}
                      </span>
                    </Button>
                  ))}
                </div>

                <div className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="height">Height</Label>
                      <span className="text-xs text-muted-foreground">
                        5'8"
                      </span>
                    </div>
                    <Slider
                      id="height"
                      defaultValue={[70]}
                      max={100}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="shoulders">Shoulders</Label>
                      <span className="text-xs text-muted-foreground">
                        Medium
                      </span>
                    </div>
                    <Slider
                      id="shoulders"
                      defaultValue={[50]}
                      max={100}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="waist">Waist</Label>
                      <span className="text-xs text-muted-foreground">30"</span>
                    </div>
                    <Slider id="waist" defaultValue={[60]} max={100} step={1} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hips">Hips</Label>
                      <span className="text-xs text-muted-foreground">38"</span>
                    </div>
                    <Slider id="hips" defaultValue={[65]} max={100} step={1} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="zoom">Zoom Level</Label>
                    <span className="text-xs text-muted-foreground">
                      {zoomLevel}%
                    </span>
                  </div>
                  <Slider
                    id="zoom"
                    defaultValue={[75]}
                    max={100}
                    min={50}
                    step={1}
                    onValueChange={(value) => setZoomLevel(value[0])}
                  />
                </div>

                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="lighting">Studio Lighting</Label>
                      <p className="text-xs text-muted-foreground">
                        Enhance visibility with professional lighting
                      </p>
                    </div>
                    <Switch id="lighting" defaultChecked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="shadows">Realistic Shadows</Label>
                      <p className="text-xs text-muted-foreground">
                        See how clothes drape and fall naturally
                      </p>
                    </div>
                    <Switch id="shadows" defaultChecked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ai-fit">AI Fit Recommendations</Label>
                      <p className="text-xs text-muted-foreground">
                        Get personalized size suggestions
                      </p>
                    </div>
                    <Switch id="ai-fit" defaultChecked={true} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Card className="overflow-hidden border border-indigo-200 dark:border-violet-800/50">
              <div className="bg-gradient-to-r from-indigo-500 to-violet-500 p-4">
                <div className="flex items-center gap-3">
                  <Zap size={24} className="text-white" />
                  <h3 className="text-lg font-semibold text-white">
                    Premium Features
                  </h3>
                </div>
                <p className="text-indigo-100 dark:text-violet-100 text-sm mt-1">
                  Unlock advanced 3D fitting features
                </p>
              </div>
              <CardContent className="p-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span>Advanced body measurements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span>Fabric simulation & physics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span>Create custom outfits</span>
                  </li>
                </ul>
                <Button className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold mb-4">Complete Your Look</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {suggestedItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.03 }}
                className="relative rounded-lg border border-indigo-100 dark:border-violet-800/30 overflow-hidden shadow-sm"
              >
                <div className="aspect-square">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${item.price}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2 text-xs"
                  >
                    Try On
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default VirtualFittingRoomPage;
