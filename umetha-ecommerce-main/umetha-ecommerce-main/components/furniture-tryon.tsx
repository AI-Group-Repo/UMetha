"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, X, Loader, Download, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useTranslation } from 'react-i18next';

interface Furniture {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface FurnitureTryOnProps {
  selectedFurniture: Furniture | null;
  onFurnitureSelect: (furniture: Furniture) => void;
  availableFurniture: Furniture[];
}

export default function FurnitureTryOn({ 
  selectedFurniture, 
  onFurnitureSelect, 
  availableFurniture 
}: FurnitureTryOnProps) {
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setRoomImage(e.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFurnitureTryOn = async () => {
    if (!roomImage || !selectedFurniture) {
      setError(t("furniture_tryon.error_upload_select"));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Convert base64 to blob for room image
      const roomImageBlob = await fetch(roomImage).then(r => r.blob());
      formData.append("roomImage", roomImageBlob, "room.jpg");
      
      // Convert furniture image URL to blob
      const furnitureImageBlob = await fetch(selectedFurniture.image).then(r => r.blob());
      formData.append("furnitureImage", furnitureImageBlob, "furniture.jpg");
      formData.append("furnitureName", selectedFurniture.name);

      const response = await fetch("/api/furniture-tryon", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResultImage(data.resultImage);
      } else {
        setError(data.error || t("furniture_tryon.error_generation"));
      }
    } catch (err) {
      setError(t("furniture_tryon.error_generation"));
      console.error("Furniture try-on error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetTryOn = () => {
    setRoomImage(null);
    setResultImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadResult = () => {
    if (resultImage) {
      const link = document.createElement("a");
      link.href = resultImage;
      link.download = `furniture-tryon-${selectedFurniture?.name || "result"}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      {/* Room Upload Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Home className="w-5 h-5 mr-2 text-indigo-600" />
            {t("furniture_tryon.upload_room")}
          </h3>
          
          <div className="space-y-4">
            {!roomImage ? (
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {t("furniture_tryon.upload_placeholder")}
                </p>
                <p className="text-sm text-gray-500">
                  {t("furniture_tryon.upload_hint")}
                </p>
              </div>
            ) : (
              <div className="relative">
                <Image
                  src={roomImage}
                  alt="Your room"
                  width={400}
                  height={300}
                  className="w-full max-w-lg mx-auto rounded-lg"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={() => setRoomImage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Furniture Selection */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-indigo-600" />
            {t("furniture_tryon.select_furniture")}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableFurniture.map((furniture) => (
              <motion.div
                key={furniture.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedFurniture?.id === furniture.id
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-300"
                }`}
                onClick={() => onFurnitureSelect(furniture)}
              >
                <div className="flex flex-col gap-3">
                  <div className="w-full h-32 relative">
                    <Image
                      src={furniture.image}
                      alt={furniture.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {furniture.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {furniture.description}
                    </p>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
                      ${furniture.price}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Try On Button */}
      <div className="flex gap-4">
        <Button
          onClick={handleFurnitureTryOn}
          disabled={!roomImage || !selectedFurniture || isLoading}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              {t("furniture_tryon.generating")}
            </>
          ) : (
            <>
              <Home className="w-4 h-4 mr-2" />
              {t("furniture_tryon.try_in_room")}
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={resetTryOn}
          disabled={isLoading}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Result Display */}
      {resultImage && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{t("furniture_tryon.result_title")}</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={downloadResult}
              >
                <Download className="w-4 h-4 mr-2" />
                {t("furniture_tryon.download")}
              </Button>
            </div>
            
            <div className="relative">
              <Image
                src={resultImage}
                alt="Furniture try-on result"
                width={600}
                height={400}
                className="w-full max-w-2xl mx-auto rounded-lg"
              />
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("furniture_tryon.result_question").replace("{furnitureName}", selectedFurniture?.name || "")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
