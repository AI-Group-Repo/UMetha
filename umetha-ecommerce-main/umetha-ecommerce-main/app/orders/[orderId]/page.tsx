"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  ChevronRight,
  Download,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/main-layout";

const steps = [
  {
    id: "ordered",
    title: "Order Placed",
    description: "Your order has been confirmed",
    icon: Package,
    date: "April 2, 2025",
    time: "10:30 AM",
    completed: true,
  },
  {
    id: "processing",
    title: "Processing",
    description: "Your order is being prepared",
    icon: Clock,
    date: "April 2, 2025",
    time: "11:45 AM",
    completed: true,
  },
  {
    id: "shipped",
    title: "Shipped",
    description: "Your package is on its way",
    icon: Truck,
    date: "April 3, 2025",
    time: "09:15 AM",
    completed: false,
    current: true,
  },
  {
    id: "delivered",
    title: "Delivered",
    description: "Package will arrive soon",
    icon: CheckCircle,
    date: "April 5, 2025",
    time: "Expected by 8:00 PM",
    completed: false,
  },
];

// Updated to use the proper typing for Next.js 15.1.0 App Router
export default async function OrderTrackingPage({
  params,
}: {
  params: { orderId: string };
}) {
  // If you need to fetch data based on the orderId, you can do it here
  // const orderData = await fetchOrderData(params.orderId);
  
  return (
    <MainLayout hideShopCategory hide3DFitting>
      <div className="max-w-6xl mx-auto px-4 pt-24">
        {/* Order Status Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/50 dark:to-violet-900/50 rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Order #{params.orderId}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                4 items • Total $458.95
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Invoice
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Support
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tracking Timeline */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Tracking Details
              </h2>

              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                {/* Steps */}
                <div className="space-y-8 relative">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start"
                    >
                      <div
                        className={`relative flex h-12 w-12 items-center justify-center rounded-full ${
                          step.completed
                            ? "bg-green-100 dark:bg-green-900/30"
                            : step.current
                            ? "bg-indigo-100 dark:bg-indigo-900/30"
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        <step.icon
                          className={`h-6 w-6 ${
                            step.completed
                              ? "text-green-600 dark:text-green-400"
                              : step.current
                              ? "text-indigo-600 dark:text-indigo-400"
                              : "text-gray-400 dark:text-gray-500"
                          }`}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3
                            className={`font-medium ${
                              step.completed || step.current
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {step.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="h-4 w-4 mr-1" />
                            {step.date}
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {step.description}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                          {step.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sticky top-24"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Delivery Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Delivery Address
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      John Doe
                      <br />
                      123 Main Street
                      <br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Shipping Method
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Express Delivery
                      <br />
                      Estimated delivery: Apr 5, 2025
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600"
                  size="lg"
                >
                  Track on Map
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
