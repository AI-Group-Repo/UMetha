"use client";
import React, { useState, useEffect } from "react";
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
  Gift 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import MainLayout from "@/components/main-layout";
import { useTranslation } from 'react-i18next';


export default function CartPage() {
  const { t } = useTranslation();
  // Sample cart items data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: t('homepage.premium_slim_fit_jacket'),
      color: "Midnight Blue",
      size: "M",
      price: 89.99,
      originalPrice: 119.99,
      quantity: 1,
      image: "/product-jacket.webp",
      deliveryEstimate: "2-3 days"
    },
    {
      id: 2,
      name: t('homepage.signature_cotton_t_shirt'),
      color: "Heather Gray",
      size: "L",
      price: 34.99,
      originalPrice: 34.99,
      quantity: 2,
      image: "/product-tshirt.webp",
      deliveryEstimate: "1-2 days"
    },
    {
      id: 3,
      name: t('homepage.ultra_comfort_athletic_shoes'),
      color: "White/Purple",
      size: "10",
      price: 129.99,
      originalPrice: 159.99,
      quantity: 1,
      image: "/product-shoes.webp",
      deliveryEstimate: "3-5 days"
    }
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 150 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax - discount;

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    
    // Simulate loading state
    setTimeout(() => {
      setIsUpdating(false);
    }, 600);
  };

  // Remove item
  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
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
      name: t('homepage.premium_scarf'),
      price: 29.99,
      image: "/product-scarf.webp"
    },
    {
      id: 5,
      name: t('homepage.leather_belt'),
      price: 39.99,
      image: "/product-belt.webp"
    },
    {
      id: 6,
      name: t('homepage.designer_socks'),
      price: 12.99,
      image: "/product-socks.webp"
    }
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/" className="text-sm text-indigo-600 dark:text-violet-400 hover:underline flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              {t('homepage.continue_shopping')}
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('homepage.your_shopping_cart')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
                <AnimatePresence>
                  {cartItems.map((item) => (
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
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                          />
                          {item.originalPrice > item.price && (
                            <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                              {t('homepage.sale')}
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
                                <span>{item.color}</span> • <span>{t('homepage.size')}: {item.size}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-semibold text-indigo-700 dark:text-violet-400">
                                  ${item.price.toFixed(2)}
                                </span>
                                {item.originalPrice > item.price && (
                                  <span className="text-sm line-through text-gray-400 dark:text-gray-500">
                                    ${item.originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-2">
                                <Tag className="h-3 w-3" />
                                <span>{t('homepage.estimated_delivery')}: {item.deliveryEstimate}</span>
                              </div>
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="flex flex-row sm:flex-col items-center gap-4 sm:items-end mt-4 sm:mt-0">
                              <div className="flex items-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-l-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
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
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                                  onClick={() => removeItem(item.id)}
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
                  {t('homepage.recommended_for_you')}
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
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                            Add
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
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    {shipping === 0 ? (
                      <span className="font-medium text-green-600 dark:text-green-400">Free</span>
                    ) : (
                      <span className="font-medium text-gray-900 dark:text-white">${shipping.toFixed(2)}</span>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                    <span className="font-medium text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Discount</span>
                      <span className="font-medium text-green-600 dark:text-green-400">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator className="my-2 bg-gray-200 dark:bg-gray-700" />
                  
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-xl text-indigo-700 dark:text-violet-400">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Promo Code Section */}
                <div className="mt-6">
                  <label htmlFor="promo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                      className={promoApplied ? "border-green-500 text-green-600 dark:border-green-500 dark:text-green-400" : ""}
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
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-6 rounded-lg shadow-md hover:shadow-lg transition-all font-medium text-base">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-6 px-8 rounded-full shadow-md hover:shadow-lg transition-all font-medium"
            >
              <Link href="/">
                Start Shopping
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}