"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Sparkles } from "lucide-react";
import MainLayout from "@/components/main-layout";
import FurnitureTryOn from "@/components/furniture-tryon";
import { useTranslation } from 'react-i18next';

const furniture = [
  // Living Room Furniture
  {
    id: "1",
    name: "Modern Sofa",
    price: 1299.99,
    image: "https://th.bing.com/th/id/R.3b505f07e30f69a945b3502af2e4e134?rik=yBA%2fcdF%2fNdz%2f%2bw&pid=ImgRaw&r=0",
    category: "Living Room",
    description: "Comfortable modern sofa with clean lines",
  },
  {
    id: "2",
    name: "L-Shaped Sectional",
    price: 1899.99,
    image: "https://www.cielo.co.za/162594-large_default/montclair-modular-l-shape-couch-flint.jpg",
    category: "Living Room",
    description: "Spacious L-shaped sectional sofa in gray fabric",
  },
  {
    id: "3",
    name: "Leather Recliner",
    price: 899.99,
    image: "https://www.cielo.co.za/136031-large_default/replica-eames-chair-and-ottoman.jpg",
    category: "Living Room",
    description: "Premium leather recliner with massage function",
  },
  {
    id: "4",
    name: "Coffee Table",
    price: 299.99,
    image: "https://i5.walmartimages.com/seo/Better-Homes-Gardens-Steele-Coffee-Table-with-Lower-Shelf-Espresso_ba91d128-eb1e-42a8-878c-6a79f75a1e6c_1.4d5cd4ce45ea17270d17e0e6142ad856.jpeg",
    category: "Living Room",
    description: "Glass top coffee table with metal legs",
  },
  {
    id: "5",
    name: "Nesting Coffee Tables",
    price: 449.99,
    image: "https://img.kwcdn.com/product/fancy/6a628f97-36f1-492c-abe9-6ee145ca4716.jpg?imageView2/2/w/264/q/70/format/webp",
    category: "Living Room",
    description: "Set of 3 nesting coffee tables in walnut finish",
  },
  {
    id: "6",
    name: "TV Stand",
    price: 449.99,
    image: "https://www.greenleafhome.co.za/greenleafnew/wp-content/uploads/2025/01/Bragg-Cali-TV-Stand.jpg",
    category: "Living Room",
    description: "Modern TV stand with storage compartments",
  },
  {
    id: "7",
    name: "Entertainment Center",
    price: 799.99,
    image: "https://tse3.mm.bing.net/th/id/OIP.hCPgzxmDLaoCJcxf9TCJxQHaFY?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "Living Room",
    description: "Large entertainment center with built-in lighting",
  },
  {
    id: "8",
    name: "Accent Chair",
    price: 599.99,
    image: "https://i5.walmartimages.com/asr/00805ffa-0d44-4c7d-a4ab-0ed15f7c2903.6adcbd3b129db9632ee72461f4f5b73b.jpeg",
    category: "Living Room",
    description: "Velvet accent chair in emerald green",
  },
  {
    id: "9",
    name: "Ottoman",
    price: 199.99,
    image: "https://cdn.media.amplience.net/i/mrpricegroup/02_105479810_SI_00?$preset$&fmt=auto",
    category: "Living Room",
    description: "Storage ottoman with removable top",
  },
  {
    id: "10",
    name: "Side Table",
    price: 149.99,
    image: "https://www.greenleafhome.co.za/greenleafnew/wp-content/uploads/2025/04/Bragg-Orlando-Side-End-Table-Black-510x510.jpg",
    category: "Living Room",
    description: "Marble top side table with gold legs",
  },

  // Dining Room Furniture
  {
    id: "11",
    name: "Dining Table Set",
    price: 899.99,
    image: "https://i5.walmartimages.com/seo/5-Piece-Dining-Table-Set-Modern-Faux-Marble-Tabletop-4-PU-Leather-Upholstered-Chairs-Rectangle-Kitchen-Chairs-Persons-Small-Set-Bar-Room-Breakfast-No_d3398f02-ba5b-4105-adae-991bf7227e8e.453c52f5b5ff827a5059aef9f7974642.jpeg",
    category: "Dining Room",
    description: "Elegant dining table with 6 chairs",
  },
  {
    id: "12",
    name: "Dining Table",
    price: 799.99,
    image: "https://i5.walmartimages.com/seo/5-Piece-Dining-Table-Set-Modern-Faux-Marble-Tabletop-4-PU-Leather-Upholstered-Chairs-Rectangle-Kitchen-Chairs-Persons-Small-Set-Bar-Room-Breakfast-No_d3398f02-ba5b-4105-adae-991bf7227e8e.453c52f5b5ff827a5059aef9f7974642.jpeg",
    category: "Dining Room",
    description: "Solid wood dining table for 8 people",
  },
  {
    id: "13",
    name: "Round Dining Table",
    price: 699.99,
    image: "https://img.kwcdn.com/product/fancy/dc5e3f61-d313-40e4-87ad-98a419ccf1c8.jpg?imageView2/2/w/264/q/70/format/webp",
    category: "Dining Room",
    description: "Round dining table with pedestal base",
  },
  {
    id: "14",
    name: "Dining Chairs (Set of 4)",
    price: 399.99,
    image: "https://tse1.mm.bing.net/th/id/OIP.OIEfCiiU8C9usldl2tnl4gHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "Dining Room",
    description: "Upholstered dining chairs in navy blue",
  },
  {
    id: "15",
    name: "Bar Stools (Set of 2)",
    price: 299.99,
    image: "https://www.greenleafhome.co.za/greenleafnew/wp-content/uploads/2025/05/Vasagle-Kitchen-Bar-Stool-Chair-Set-of-2-Black-510x510.jpg",
    category: "Dining Room",
    description: "Adjustable height bar stools with backrest",
  },
 ];

export default function RoomVisualizerPage() {
  const [selectedFurniture, setSelectedFurniture] = useState(furniture[0]);
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
              {t("furniture_tryon.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              {t("furniture_tryon.subtitle")}
            </motion.p>
          </div>

          {/* Furniture Try-On Component */}
          <FurnitureTryOn
            selectedFurniture={selectedFurniture}
            onFurnitureSelect={setSelectedFurniture}
            availableFurniture={furniture}
          />
        </div>
      </div>
    </MainLayout>
  );
}