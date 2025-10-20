"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Trash2,
  Plus,
  Minus,
  Heart,
  ShoppingBag,
  Tag,
  CreditCard,
  ArrowRight,
  Truck,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import MainLayout from "@/components/main-layout";
import { useCart } from "@/context/cart-context";
import {useTranslation} from "react-i18next";
export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const { t } = useTranslation();
  // Calculate totals
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 150 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax - discount;

  // Update quantity
  const handleUpdateQuantity = (id: string | number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  // Remove item
  const handleRemoveItem = (id: string | number) => {
    removeItem(id);
  };

  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "UMETHA20") {
      setDiscount(subtotal * 0.2);
      setPromoApplied(true);
    }
  };

  // Recommended products
  const recommendedProducts = [
    {
      id: 4,
      name: "Designer Silk Scarf",
      price: 29.99,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
    },
    {
      id: 5,
      name: "Luxury Sunglasses",
      price: 149.99,
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80",
    },
    {
      id: 6,
      name: "Premium Watch",
      price: 199.99,
      image:
        "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80",
    },
  ];

  return (
    <MainLayout hideFittingRoom hideRoomVisualizer>
      <div className="max-w-7xl mx-auto mt-8">
        {" "}
        {/* Added mt-8 for top margin */}
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/"
              className="text-sm text-indigo-600 dark:text-violet-400 hover:underline flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("continue_shopping")}
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("your_shopping_cart")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {items.length} {items.length === 1 ? t("item") : t("items")} {t("in_your_cart")}
          </p>
        </div>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="relative w-full sm:w-24 h-40 sm:h-24 rounded-lg overflow-hidden bg-indigo-50 dark:bg-violet-900/20">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                              {t("sale")}
                            </span>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </h3>
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <span>{item.color}</span> •{" "}
                                <span>Size: {item.size}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-semibold text-indigo-700 dark:text-violet-400">
                                  ${item.price.toFixed(2)}
                                </span>
                                {item.originalPrice && item.originalPrice > item.price && (
                                  <span className="text-sm line-through text-gray-400 dark:text-gray-500">
                                    ${item.originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-2">
                                <Tag className="h-3 w-3" />
                                <span>
                                  {t("estimated_delivery")}: 3-5 business days
                                </span>
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex flex-row sm:flex-col items-center gap-4 sm:items-end mt-4 sm:mt-0">
                              <div className="flex items-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-l-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.id,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={isUpdating}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <div className="h-8 px-4 flex items-center justify-center border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium min-w-[40px]">
                                  {isUpdating ? (
                                    <div className="h-3 w-3 rounded-full border-2 border-indigo-600 dark:border-violet-400 border-t-transparent animate-spin"></div>
                                  ) : (
                                    item.quantity
                                  )}
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-r-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.id,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={isUpdating}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400"
                                >
                                  <Heart className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Recommendations */}
              <div className="mt-8">
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
                  {t("recommended_for_you")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {recommendedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <div className="font-medium text-sm text-gray-900 dark:text-white">
                          {product.name}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-semibold text-indigo-700 dark:text-violet-400">
                            ${product.price.toFixed(2)}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-xs"
                          >
                          {t("add")}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sticky top-24"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Shipping
                    </span>
                    {shipping === 0 ? (
                      <span className="font-medium text-green-600 dark:text-green-400">
                        Free
                      </span>
                    ) : (
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${shipping.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Tax (8%)
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${tax.toFixed(2)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Discount
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        -${discount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <Separator className="my-2 bg-gray-200 dark:bg-gray-700" />

                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="font-bold text-xl text-indigo-700 dark:text-violet-400">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Promo Code Section */}
                <div className="mt-6">
                  <label
                    htmlFor="promo"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="promo"
                      type="text"
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                      className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                    <Button
                      onClick={applyPromoCode}
                      disabled={promoApplied || !promoCode}
                      variant={promoApplied ? "outline" : "default"}
                      className={
                        promoApplied
                          ? "border-green-500 text-green-600 dark:border-green-500 dark:text-green-400"
                          : ""
                      }
                    >
                      {promoApplied ? "Applied" : "Apply"}
                    </Button>
                  </div>
                  {promoApplied && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400"></span>
                      20% discount applied successfully!
                    </p>
                  )}
                  {!promoApplied && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Try code "UMETHA20" for 20% off your order
                    </p>
                  )}
                </div>

                {/* Benefits Section */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Truck className="h-4 w-4 text-indigo-600 dark:text-violet-400" />
                    <span>Free shipping on orders over $150</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <ShoppingBag className="h-4 w-4 text-indigo-600 dark:text-violet-400" />
                    <span>30-day easy returns</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Gift className="h-4 w-4 text-indigo-600 dark:text-violet-400" />
                    <span>Gift wrapping available at checkout</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="mt-8">
                  <Link href="/checkout">
                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-6 rounded-lg shadow-md hover:shadow-lg transition-all font-medium text-base">
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>

                  <div className="mt-4 flex items-center justify-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Secure checkout powered by Stripe
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          /* Empty Cart State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 max-w-md mx-auto"
          >
            <div className="bg-indigo-50 dark:bg-violet-900/20 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-indigo-600 dark:text-violet-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-6 px-8 rounded-full shadow-md hover:shadow-lg transition-all font-medium"
            >
              <Link href="/">Start Shopping</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}
