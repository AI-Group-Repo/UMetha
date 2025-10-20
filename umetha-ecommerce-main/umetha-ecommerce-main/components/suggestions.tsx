"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingCart, Heart, Sparkles } from "lucide-react"
import PriceCartButton from "@/components/ui/price-cart-button"
import { cn } from "@/lib/utils"
import { useTranslation } from 'react-i18next'

interface Product {
  id: string
  name: string
  image: string
  price: number
  tagline: string
  color: string
}

const suggestedProducts: Product[] = [
  {
    id: "1",
    name: "Urban Backpack",
    image: "/backpack.jpeg",
    price: 59.99,
    tagline: "Your journey, elevated",
    color: "from-cyan-100 to-blue-200"
  },
  {
    id: "2",
    name: "Chrono Watch",
    image: "/watch.jpg",
    price: 149.99,
    tagline: "Time redefined",
    color: "from-purple-100 to-indigo-200"
  },
  {
    id: "3",
    name: "Sound Buds",
    image: "/buds.jpg",
    price: 89.99,
    tagline: "Immerse in audio",
    color: "from-emerald-100 to-teal-200"
  },
  {
    id: "4",
    name: "Silk Luxe",
    image: "/scarf.jpg",
    price: 39.99,
    tagline: "Elegance personified",
    color: "from-rose-100 to-pink-200"
  },
]

export default function Suggestions() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const { t } = useTranslation()

  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  return (
    <div className="bg-gradient-to-br from-slate-50/80 to-indigo-50/80 dark:from-slate-950/20 dark:to-indigo-950/20 rounded-3xl p-6 md:p-10 shadow-2xl">
      <div className="flex justify-between items-center mb-8 md:mb-12">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
            {t('homepage.exclusive_picks')}
          </h2>
        </div>
        <Link 
          href="/suggestions" 
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors text-sm font-medium flex items-center gap-1"
        >
          {t('homepage.explore_more')}
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 1,
              repeatType: "loop"
            }}
          >
            →
          </motion.span>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {suggestedProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className={cn(
                "overflow-hidden group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 relative bg-white dark:bg-gray-900/50",
                hoveredProduct === product.id ? 'ring-2 ring-indigo-400 dark:ring-indigo-500/50' : ''
              )}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div 
                className={cn(
                  "absolute top-0 left-0 w-full h-1 bg-gradient-to-r transition-all duration-300",
                  product.color,
                  "dark:opacity-75",
                  hoveredProduct === product.id ? 'h-2' : ''
                )}
              />
              
              <div className="relative pt-[100%] bg-white dark:bg-gray-900/30 overflow-hidden">
                <div className="absolute inset-0 p-4 flex items-center justify-center">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-gray-900/50">
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    {product.tagline}
                  </p>
                </div>

                <PriceCartButton
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}