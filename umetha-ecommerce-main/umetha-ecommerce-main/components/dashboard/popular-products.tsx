"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function PopularProducts() {
  const products = [
    {
      id: 1,
      name: "Premium Fitness Watch",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      sales: 245,
      revenue: 48955,
      growth: 12.5,
    },
    {
      id: 2,
      name: "Wireless Earbuds Pro",
      image: "https://images.unsplash.com/photo-1505751171710-1f6d0e5a773b",
      sales: 189,
      revenue: 28350,
      growth: 8.3,
    },
    // Add more products...
  ];

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold">Popular Products</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400"
        >
          View all
        </motion.button>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ x: 5 }}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="relative h-12 w-12 rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{product.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-green-600">
                  +{product.growth}%
                </span>
                <TrendingUp className="h-3 w-3 text-green-600" />
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                ${product.revenue.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {product.sales} sales
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
