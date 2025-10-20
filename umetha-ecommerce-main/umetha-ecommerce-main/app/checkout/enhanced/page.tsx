"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  CreditCard,
  ArrowRight,
  Truck,
  Gift,
  Shield,
  Check,
  AlertCircle,
  ChevronsRight,
  Calendar,
  MapPin,
  X,
  User,
  Phone,
  Mail,
  Wallet,
  Coins,
  Smartphone,
  Globe,
  Lock,
  Star,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import MainLayout from "@/components/main-layout";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  type: 'card' | 'crypto' | 'digital' | 'bank';
  fees?: string;
  processingTime?: string;
  available: boolean;
  popular?: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'coinbase-card',
    name: 'Coinbase Virtual Card',
    description: 'Pay with your Coinbase balance or crypto',
    icon: Coins,
    type: 'crypto',
    fees: '0%',
    processingTime: 'Instant',
    available: true,
    popular: true,
  },
  {
    id: 'coinbase-wallet',
    name: 'Coinbase Wallet',
    description: 'Connect your Coinbase Wallet for crypto payments',
    icon: Wallet,
    type: 'crypto',
    fees: '0.5%',
    processingTime: '1-2 min',
    available: true,
    popular: true,
  },
  {
    id: 'credit-card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, American Express',
    icon: CreditCard,
    type: 'card',
    fees: '2.9% + $0.30',
    processingTime: 'Instant',
    available: true,
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pay with your PayPal account',
    icon: Globe,
    type: 'digital',
    fees: '2.9% + $0.30',
    processingTime: 'Instant',
    available: true,
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    description: 'Pay with Touch ID or Face ID',
    icon: Smartphone,
    type: 'digital',
    fees: '2.9% + $0.30',
    processingTime: 'Instant',
    available: true,
  },
  {
    id: 'google-pay',
    name: 'Google Pay',
    description: 'Pay with your Google account',
    icon: Smartphone,
    type: 'digital',
    fees: '2.9% + $0.30',
    processingTime: 'Instant',
    available: true,
  },
  {
    id: 'bank-transfer',
    name: 'Bank Transfer',
    description: 'Direct bank transfer (ACH)',
    icon: CreditCard,
    type: 'bank',
    fees: '0%',
    processingTime: '1-3 days',
    available: true,
  },
  {
    id: 'crypto-direct',
    name: 'Direct Crypto',
    description: 'Pay with Bitcoin, Ethereum, or other crypto',
    icon: Coins,
    type: 'crypto',
    fees: '1%',
    processingTime: '10-30 min',
    available: true,
  },
];

export default function EnhancedCheckoutPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const { user, supabase } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState("shipping");
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    saveInfo: true,
    shippingMethod: "standard",
    paymentMethod: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
    paypalEmail: "",
    coinbaseWallet: "",
    cryptoAddress: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [cryptoRates, setCryptoRates] = useState({
    btc: 0,
    eth: 0,
    usdc: 1,
  });

  // Calculate totals
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingCost =
    formData.shippingMethod === "express"
      ? 14.99
      : formData.shippingMethod === "standard"
      ? 4.99
      : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  // Fetch crypto rates (mock data)
  useEffect(() => {
    // In a real app, you would fetch live crypto rates
    setCryptoRates({
      btc: 45000,
      eth: 3000,
      usdc: 1,
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error when field is being edited
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = (step: string) => {
    const errors: Record<string, string> = {};
    if (step === "shipping") {
      if (!formData.firstName) errors.firstName = "First name is required";
      if (!formData.lastName) errors.lastName = "Last name is required";
      if (!formData.email) errors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        errors.email = "Email is invalid";
      if (!formData.address) errors.address = "Address is required";
      if (!formData.city) errors.city = "City is required";
      if (!formData.postalCode) errors.postalCode = "Postal code is required";
    } else if (step === "payment") {
      if (!selectedPaymentMethod) errors.paymentMethod = "Please select a payment method";
      
      if (selectedPaymentMethod === 'credit-card') {
        if (!formData.cardNumber) errors.cardNumber = "Card number is required";
        if (!formData.cardName) errors.cardName = "Cardholder name is required";
        if (!formData.cardExpiry) errors.cardExpiry = "Expiry date is required";
        if (!formData.cardCvc) errors.cardCvc = "CVC is required";
      } else if (selectedPaymentMethod === 'paypal') {
        if (!formData.paypalEmail) errors.paypalEmail = "PayPal email is required";
      } else if (selectedPaymentMethod === 'coinbase-wallet') {
        if (!formData.coinbaseWallet) errors.coinbaseWallet = "Coinbase wallet address is required";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === "shipping") {
      if (validateForm("shipping")) {
        setActiveStep("payment");
      }
    } else if (activeStep === "payment") {
      if (validateForm("payment")) {
        setActiveStep("review");
      }
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Order Placed!",
        description: "Your order has been successfully placed.",
      });
      
      // Clear cart and redirect
      router.push("/orders");
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getCryptoAmount = (crypto: string) => {
    const rate = cryptoRates[crypto as keyof typeof cryptoRates];
    return rate > 0 ? (total / rate).toFixed(6) : '0.000000';
  };

  const PaymentMethodCard = ({ method }: { method: PaymentMethod }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={`cursor-pointer transition-all ${
          selectedPaymentMethod === method.id
            ? 'ring-2 ring-primary border-primary'
            : 'hover:border-gray-300'
        } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => method.available && setSelectedPaymentMethod(method.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                method.type === 'crypto' ? 'bg-orange-100 text-orange-600' :
                method.type === 'digital' ? 'bg-blue-100 text-blue-600' :
                method.type === 'bank' ? 'bg-green-100 text-green-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                <method.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold">{method.name}</h3>
                  {method.popular && (
                    <Badge variant="secondary" className="text-xs">Popular</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{method.description}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-gray-500">Fee: {method.fees}</span>
                  <span className="text-xs text-gray-500">Time: {method.processingTime}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              {selectedPaymentMethod === method.id ? (
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-4">Add some items to your cart to proceed to checkout</p>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/cart">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-2">Complete your purchase securely</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Steps */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    {[
                      { id: "shipping", label: "Shipping", icon: Truck },
                      { id: "payment", label: "Payment", icon: CreditCard },
                      { id: "review", label: "Review", icon: Check },
                    ].map((step, index) => (
                      <div key={step.id} className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          activeStep === step.id
                            ? 'bg-primary text-white'
                            : index < ['shipping', 'payment', 'review'].indexOf(activeStep)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {index < ['shipping', 'payment', 'review'].indexOf(activeStep) ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <step.icon className="h-5 w-5" />
                          )}
                        </div>
                        <span className={`ml-2 font-medium ${
                          activeStep === step.id ? 'text-primary' : 'text-gray-600'
                        }`}>
                          {step.label}
                        </span>
                        {index < 2 && (
                          <ChevronsRight className="h-4 w-4 mx-4 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              {activeStep === "shipping" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={formErrors.firstName ? 'border-red-500' : ''}
                        />
                        {formErrors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={formErrors.lastName ? 'border-red-500' : ''}
                        />
                        {formErrors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={formErrors.email ? 'border-red-500' : ''}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={formErrors.address ? 'border-red-500' : ''}
                      />
                      {formErrors.address && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={formErrors.city ? 'border-red-500' : ''}
                        />
                        {formErrors.city && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className={formErrors.postalCode ? 'border-red-500' : ''}
                        />
                        {formErrors.postalCode && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.postalCode}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="saveInfo"
                        name="saveInfo"
                        checked={formData.saveInfo}
                        onChange={handleChange}
                        className="rounded"
                      />
                      <Label htmlFor="saveInfo">Save this information for next time</Label>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Methods */}
              {activeStep === "payment" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paymentMethods.map((method) => (
                        <PaymentMethodCard key={method.id} method={method} />
                      ))}
                    </div>

                    {/* Payment Method Details */}
                    {selectedPaymentMethod === 'credit-card' && (
                      <Card className="mt-4">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-4">Card Details</h3>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="cardNumber">Card Number *</Label>
                              <Input
                                id="cardNumber"
                                name="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                className={formErrors.cardNumber ? 'border-red-500' : ''}
                              />
                              {formErrors.cardNumber && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.cardNumber}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="cardName">Cardholder Name *</Label>
                              <Input
                                id="cardName"
                                name="cardName"
                                placeholder="John Doe"
                                value={formData.cardName}
                                onChange={handleChange}
                                className={formErrors.cardName ? 'border-red-500' : ''}
                              />
                              {formErrors.cardName && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.cardName}</p>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="cardExpiry">Expiry Date *</Label>
                                <Input
                                  id="cardExpiry"
                                  name="cardExpiry"
                                  placeholder="MM/YY"
                                  value={formData.cardExpiry}
                                  onChange={handleChange}
                                  className={formErrors.cardExpiry ? 'border-red-500' : ''}
                                />
                                {formErrors.cardExpiry && (
                                  <p className="text-red-500 text-sm mt-1">{formErrors.cardExpiry}</p>
                                )}
                              </div>
                              <div>
                                <Label htmlFor="cardCvc">CVC *</Label>
                                <Input
                                  id="cardCvc"
                                  name="cardCvc"
                                  placeholder="123"
                                  value={formData.cardCvc}
                                  onChange={handleChange}
                                  className={formErrors.cardCvc ? 'border-red-500' : ''}
                                />
                                {formErrors.cardCvc && (
                                  <p className="text-red-500 text-sm mt-1">{formErrors.cardCvc}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {selectedPaymentMethod === 'coinbase-wallet' && (
                      <Card className="mt-4">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-4">Coinbase Wallet</h3>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="coinbaseWallet">Wallet Address *</Label>
                              <Input
                                id="coinbaseWallet"
                                name="coinbaseWallet"
                                placeholder="0x..."
                                value={formData.coinbaseWallet}
                                onChange={handleChange}
                                className={formErrors.coinbaseWallet ? 'border-red-500' : ''}
                              />
                              {formErrors.coinbaseWallet && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.coinbaseWallet}</p>
                              )}
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg">
                              <h4 className="font-medium text-orange-900 mb-2">Crypto Payment Amounts</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Bitcoin (BTC):</span>
                                  <span className="font-mono">{getCryptoAmount('btc')} BTC</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Ethereum (ETH):</span>
                                  <span className="font-mono">{getCryptoAmount('eth')} ETH</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>USDC:</span>
                                  <span className="font-mono">{total.toFixed(2)} USDC</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {formErrors.paymentMethod && (
                      <p className="text-red-500 text-sm">{formErrors.paymentMethod}</p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Review Order */}
              {activeStep === "review" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Check className="h-5 w-5 mr-2" />
                      Review Your Order
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Shipping Information</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                        <p>{formData.address}</p>
                        <p>{formData.city}, {formData.state} {formData.postalCode}</p>
                        <p>{formData.email}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold">Payment Method</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium">
                          {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {paymentMethods.find(m => m.id === selectedPaymentMethod)?.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (activeStep === "payment") setActiveStep("shipping");
                    else if (activeStep === "review") setActiveStep("payment");
                  }}
                  disabled={activeStep === "shipping"}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={activeStep === "review" ? handlePlaceOrder : handleNext}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : activeStep === "review" ? (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Place Order
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="relative w-16 h-16">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span>Secure checkout with 256-bit SSL encryption</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
