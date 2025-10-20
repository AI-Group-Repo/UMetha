// room-visualizer.tsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  RotateCcw,
  Maximize,
  Minimize,
  Sparkles,
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
const DecorViewer = dynamic(() => import("@/components/decor-viewer"), { ssr: false });

const decorStyles = [
  {
    id: 1,
    name: "Modern Minimalist",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&q=80",
  },
  {
    id: 2,
    name: "Bohemian Chic",
    image:
      "https://images.unsplash.com/photo-1586105251261-72a756497a12?w=800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1586105251261-72a756497a12?w=200&q=80",
  },
  {
    id: 3,
    name: "Rustic Farmhouse",
    image:
      "https://images.unsplash.com/photo-1578898886721-d29f3eebf2d0?w=800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1578898886721-d29f3eebf2d0?w=200&q=80",
  },
];

const RoomVisualizerPage = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(75);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  return (
    <MainLayout hideShopCategory>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
            Room Visualizer
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Experiment with interior styles and visualize your dream room
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
                <Button variant="outline" size="icon" className="rounded-full" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Camera size={18} />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <RotateCcw size={18} />
                </Button>
              </div>

              <div className="relative aspect-square md:aspect-video w-full overflow-hidden bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/20">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p className="mt-4 text-sm font-medium text-indigo-700 dark:text-violet-300">
                        Loading room preview...
                      </p>
                    </div>
                  </div>
                )}

                {showTutorial && !isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm z-10">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="max-w-md text-center p-6"
                    >
                      <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-indigo-100 dark:bg-violet-900/40 flex items-center justify-center">
                        <Sparkles size={24} className="text-indigo-600 dark:text-violet-400" />
                      </div>
                      <h3 className="text-xl font-bold text-indigo-700 dark:text-violet-300">
                        Welcome to the Room Visualizer
                      </h3>
                      <p className="text-muted-foreground mt-2 mb-6">
                        Choose decor styles and visualize them in real time
                      </p>
                      <Button onClick={() => setShowTutorial(false)}>
                        Get Started
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  <DecorViewer selected={selectedStyle} />
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
            <Tabs defaultValue="styles" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="styles">Styles</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="styles" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {decorStyles.map((style) => (
                    <motion.div
                      key={style.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedStyle(style)}
                      className={`relative cursor-pointer rounded-lg overflow-hidden shadow-sm ${
                        selectedStyle?.id === style.id
                          ? "ring-2 ring-indigo-500 dark:ring-violet-500"
                          : "ring-1 ring-indigo-100 dark:ring-violet-900/40"
                      }`}
                    >
                      <div className="aspect-square">
                        <Image
                          src={style.thumbnail}
                          alt={style.name}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-xs font-medium truncate">
                          {style.name}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  <Upload size={16} className="mr-2" /> Upload Your Room
                </Button>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="zoom">Zoom Level</Label>
                    <span className="text-xs text-muted-foreground">{zoomLevel}%</span>
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
                    <Label htmlFor="lighting">Lighting Simulation</Label>
                    <Switch id="lighting" defaultChecked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="shadows">Shadow Depth</Label>
                    <Switch id="shadows" defaultChecked={true} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RoomVisualizerPage;
