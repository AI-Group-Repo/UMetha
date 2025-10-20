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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import MainLayout from "@/components/main-layout";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const { user, supabase } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState("shipping");
  const [showOrderSummary, setShowOrderSummary] = useState(false);
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
    paymentMethod: "credit-card",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
    paypalEmail: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error when field is being edited
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = (step) => {
    const errors = {};
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
      // Only validate card details if credit card is selected
      if (formData.paymentMethod === "credit-card") {
        if (!formData.cardNumber) errors.cardNumber = "Card number is required";
        else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, "")))
          errors.cardNumber = "Invalid card number";
        if (!formData.cardName) errors.cardName = "Name on card is required";
        if (!formData.cardExpiry) errors.cardExpiry = "Expiry date is required";
        else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry))
          errors.cardExpiry = "Use MM/YY format";
        if (!formData.cardCvc) errors.cardCvc = "CVC is required";
        else if (!/^\d{3,4}$/.test(formData.cardCvc))
          errors.cardCvc = "Invalid CVC";
      } else if (formData.paymentMethod === "paypal") {
        if (!formData.paypalEmail) errors.paypalEmail = "PayPal email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.paypalEmail))
          errors.paypalEmail = "PayPal email is invalid";
      }
      // Apple Pay doesn't require additional validation as it uses the device's built-in validation
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setFormData({ ...formData, cardNumber: formattedValue });
    if (formErrors.cardNumber) {
      setFormErrors({ ...formErrors, cardNumber: "" });
    }
  };

  const handleExpiryChange = (e) => {
    let { value } = e.target;
    value = value.replace(/\D/g, "");

    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }

    setFormData({ ...formData, cardExpiry: value });
    if (formErrors.cardExpiry) {
      setFormErrors({ ...formErrors, cardExpiry: "" });
    }
  };

  const handleContinue = () => {
    if (validateForm(activeStep)) {
      if (activeStep === "shipping") {
        setActiveStep("payment");
      } else if (activeStep === "payment") {
        handleSubmitOrder();
      }
    }
  };

  const handleBack = () => {
    if (activeStep === "payment") {
      setActiveStep("shipping");
    }
  };

  useEffect(() => {
    async function loadUserProfile() {
      if (!user) return;
      
      try {
        // Fetch profile data from Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        // Pre-fill the form with user profile data
        if (data) {
          setFormData(prevData => ({
            ...prevData,
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            email: user.email || '',
            phone: data.phone_number || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            postalCode: data.postal_code || '',
            country: data.country || 'United States',
          }));
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    }
    
    loadUserProfile();
  }, [user, supabase]);

  const handleSubmitOrder = () => {
    if (!validateForm("payment")) return;

    setIsProcessing(true);
    
    // Save shipping address to user profile if they want to save the information
    if (formData.saveInfo && user) {
      supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode,
          country: formData.country,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .then(({ error }) => {
          if (error) {
            console.error('Error saving address to profile:', error);
          }
        });
    }
    
    // Create order record in Supabase
    const createOrder = async () => {
      if (!user) return;
      
      try {
        // Create the order in your orders table
        const { data, error } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            total_amount: total,
            shipping_address: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              postalCode: formData.postalCode,
              country: formData.country,
            },
            payment_method: formData.paymentMethod,
            order_items: items.map(item => ({
              product_id: item.id,
              quantity: item.quantity,
              price: item.price
            })),
            status: 'processing',
            payment_status: 'paid',
            created_at: new Date().toISOString()
          })
          .select()
          .single();
          
        if (error) throw error;
        
        return data.id;
      } catch (error) {
        console.error('Error creating order:', error);
        return null;
      }
    };

    // Process payment based on selected payment method
    const processPayment = async () => {
      // In a real application, you would integrate with actual payment processors here
      // For now, we'll simulate successful payments for all methods
      
      let paymentSuccess = true;
      let paymentError = null;
      
      switch (formData.paymentMethod) {
        case 'credit-card':
          // Simulate credit card processing
          console.log('Processing credit card payment with:', {
            cardNumber: formData.cardNumber.replace(/\s/g, '').slice(-4), // Only log last 4 digits for security
            cardName: formData.cardName,
            expiry: formData.cardExpiry
          });
          break;
          
        case 'paypal':
          // Simulate PayPal processing
          console.log('Processing PayPal payment with email:', formData.paypalEmail);
          break;
          
        case 'apple-pay':
          // Simulate Apple Pay processing
          console.log('Processing Apple Pay payment');
          break;
          
        default:
          paymentSuccess = false;
          paymentError = 'Invalid payment method';
      }
      
      return { success: paymentSuccess, error: paymentError };
    };

    // Execute payment and order creation
    (async () => {
      try {
        // Process payment
        const paymentResult = await processPayment();
        
        if (!paymentResult.success) {
          throw new Error(paymentResult.error || 'Payment failed');
        }
        
        // Once payment is successful, create order
        let orderId;
        
        if (user) {
          // Try to create a real order record
          try {
            orderId = await createOrder();
          } catch (err) {
            console.error('Failed to create order record:', err);
            // Fallback to random order ID
            orderId = Math.random().toString(36).substring(2, 15);
          }
        } else {
          // For non-authenticated users, generate a random order ID
          orderId = Math.random().toString(36).substring(2, 15);
        }
        
        setIsProcessing(false);
        
        toast({
          title: "Order placed successfully!",
          description: "Redirecting you to order tracking...",
          variant: "success",
        });
        
        // Redirect to the order confirmation page
        router.push(`/orders/${orderId}`);
        
      } catch (error) {
        console.error('Error during checkout:', error);
        setIsProcessing(false);
        
        toast({
          title: "Payment failed",
          description: error.message || "Please try again or use a different payment method.",
          variant: "destructive",
        });
      }
    })();
  };

  const shippingMethods = [
    {
      id: "standard",
      name: "Standard Shipping",
      price: 4.99,
      description: "Delivery in 3-5 business days",
      icon: Truck,
    },
    {
      id: "express",
      name: "Express Shipping",
      price: 14.99,
      description: "Delivery in 1-2 business days",
      icon: ChevronsRight,
    },
    {
      id: "pickup",
      name: "Store Pickup",
      price: 0,
      description: "Ready for pickup in 24 hours",
      icon: MapPin,
    },
  ];

  const paymentMethods = [
    { 
      id: "credit-card", 
      name: "Credit Card", 
      icon: CreditCard,
      description: "Pay with Visa, Mastercard, or American Express"
    },
    { 
      id: "paypal", 
      name: "PayPal", 
      logo: "/paypal.svg",
      description: "Fast, secure payment with your PayPal account"
    },
    { 
      id: "apple-pay", 
      name: "Apple Pay", 
      logo: "/applepay.svg",
      description: "Quick checkout with Apple Pay"
    },
  ];

  return (
    <MainLayout hideShopCategory={true} hideFittingRoom={true}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/cart"
              className="text-sm text-indigo-600 dark:text-violet-400 hover:underline flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Cart
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Checkout
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Complete your purchase securely
          </p>
        </div>

        {/* Checkout Steps */}
        <div className="hidden md:flex items-center justify-center mb-8">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {["shipping", "payment", "confirmation"].map((step, index) => (
              <React.Fragment key={step}>
                <div className={`flex items-center ${index > 0 ? "ml-2" : ""}`}>
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      activeStep === step
                        ? "bg-indigo-600 text-white"
                        : ["shipping", "payment"].includes(activeStep) &&
                          index <
                            ["shipping", "payment"].indexOf(activeStep) + 1
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {["shipping", "payment"].includes(activeStep) &&
                    index < ["shipping", "payment"].indexOf(activeStep) + 1 ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      activeStep === step
                        ? "text-indigo-600 dark:text-violet-400"
                        : ["shipping", "payment"].includes(activeStep) &&
                          index <
                            ["shipping", "payment"].indexOf(activeStep) + 1
                        ? "text-green-500 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </span>
                </div>
                {index < 2 && (
                  <div className="mx-4 w-20 h-0.5 bg-gray-200 dark:bg-gray-700">
                    <motion.div
                      className="h-full bg-indigo-600 dark:bg-violet-400"
                      initial={{ width: "0%" }}
                      animate={{
                        width:
                          index === 0 && activeStep === "shipping"
                            ? "50%"
                            : index === 0 &&
                              ["payment", "confirmation"].includes(activeStep)
                            ? "100%"
                            : index === 1 && activeStep === "payment"
                            ? "50%"
                            : index === 1 && activeStep === "confirmation"
                            ? "100%"
                            : "0%",
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeStep === "shipping" && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Shipping Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`mt-1 ${
                          formErrors.firstName ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`mt-1 ${
                          formErrors.lastName ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.lastName}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`pl-10 ${
                            formErrors.email ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative mt-1">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`mt-1 ${
                          formErrors.address ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.address}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`mt-1 ${
                          formErrors.city ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.city}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className={`mt-1 ${
                            formErrors.postalCode ? "border-red-500" : ""
                          }`}
                        />
                        {formErrors.postalCode && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.postalCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator className="my-8" />

                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Shipping Method
                  </h3>

                  <RadioGroup
                    name="shippingMethod"
                    value={formData.shippingMethod}
                    onValueChange={(value) =>
                      setFormData({ ...formData, shippingMethod: value })
                    }
                    className="grid gap-4"
                  >
                    {shippingMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <motion.div
                          key={method.id}
                          whileHover={{ scale: 1.01 }}
                          className={`relative flex items-center space-x-4 rounded-lg border p-4 ${
                            formData.shippingMethod === method.id
                              ? "border-indigo-600 dark:border-violet-500 bg-indigo-50 dark:bg-violet-900/10"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <RadioGroupItem
                            value={method.id}
                            id={`shipping-${method.id}`}
                            className="absolute right-4"
                          />
                          <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-violet-900/20 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-indigo-600 dark:text-violet-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <Label
                                htmlFor={`shipping-${method.id}`}
                                className="text-base font-medium cursor-pointer"
                              >
                                {method.name}
                              </Label>
                              <span className="text-sm font-semibold text-indigo-700 dark:text-violet-400">
                                {method.price === 0
                                  ? "Free"
                                  : `$${method.price.toFixed(2)}`}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {method.description}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </RadioGroup>

                  <div className="mt-8 flex justify-end">
                    <Button
                      onClick={handleContinue}
                      className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-6 px-6 rounded-lg shadow-md hover:shadow-lg transition-all font-medium text-base"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {activeStep === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Payment Information
                  </h2>

                  <RadioGroup
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onValueChange={(value) =>
                      setFormData({ ...formData, paymentMethod: value })
                    }
                    className="grid gap-4 mb-6"
                  >
                    {paymentMethods.map((method) => (
                      <motion.div
                        key={method.id}
                        whileHover={{ scale: 1.01 }}
                        className={`relative flex items-center space-x-4 rounded-lg border p-4 ${
                          formData.paymentMethod === method.id
                            ? "border-indigo-600 dark:border-violet-500 bg-indigo-50 dark:bg-violet-900/10"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <RadioGroupItem
                          value={method.id}
                          id={`payment-${method.id}`}
                          className="absolute right-4"
                        />
                        <div className="h-10 w-14 flex items-center justify-center">
                          {method.logo ? (
                            <Image
                              src={method.logo}
                              alt={method.name}
                              width={56}
                              height={40}
                              className="h-8 w-auto"
                            />
                          ) : (
                            <method.icon className="h-6 w-6 text-indigo-600 dark:text-violet-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <Label
                            htmlFor={`payment-${method.id}`}
                            className="text-base font-medium cursor-pointer"
                          >
                            {method.name}
                          </Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {method.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </RadioGroup>

                  {/* Payment Methods Section */}
                  {formData.paymentMethod === "credit-card" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      <div className="md:col-span-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative mt-1">
                          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className={`pl-10 ${
                              formErrors.cardNumber ? "border-red-500" : ""
                            }`}
                          />
                          {["visa", "mastercard", "amex"].map((card) => (
                            <Image
                              key={card}
                              src={`/${card}.svg`}
                              alt={card}
                              width={32}
                              height={20}
                              className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-auto opacity-40 ${
                                formData.cardNumber.startsWith("4")
                                  ? card === "visa"
                                    ? "opacity-100"
                                    : "opacity-20"
                                  : formData.cardNumber.startsWith("5")
                                  ? card === "mastercard"
                                    ? "opacity-100"
                                    : "opacity-20"
                                  : formData.cardNumber.startsWith("3")
                                  ? card === "amex"
                                    ? "opacity-100"
                                    : "opacity-20"
                                  : ""
                              }`}
                            />
                          ))}
                        </div>
                        {formErrors.cardNumber && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.cardNumber}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="cardName"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleChange}
                            className={`pl-10 ${
                              formErrors.cardName ? "border-red-500" : ""
                            }`}
                          />
                        </div>
                        {formErrors.cardName && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.cardName}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="cardExpiry">Expiry Date</Label>
                        <div className="relative mt-1">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="cardExpiry"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            className={`pl-10 ${
                              formErrors.cardExpiry ? "border-red-500" : ""
                            }`}
                          />
                        </div>
                        {formErrors.cardExpiry && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.cardExpiry}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="cardCvc">CVC</Label>
                        <div className="relative mt-1">
                          <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="cardCvc"
                            name="cardCvc"
                            value={formData.cardCvc}
                            onChange={handleChange}
                            maxLength={4}
                            className={`pl-10 ${
                              formErrors.cardCvc ? "border-red-500" : ""
                            }`}
                          />
                        </div>
                        {formErrors.cardCvc && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.cardCvc}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {formData.paymentMethod === "paypal" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 gap-6"
                    >
                      <div>
                        <Label htmlFor="paypalEmail">PayPal Email</Label>
                        <div className="relative mt-1">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="paypalEmail"
                            name="paypalEmail"
                            type="email"
                            value={formData.paypalEmail}
                            onChange={handleChange}
                            placeholder="your-email@example.com"
                            className={`pl-10 ${
                              formErrors.paypalEmail ? "border-red-500" : ""
                            }`}
                          />
                        </div>
                        {formErrors.paypalEmail && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.paypalEmail}
                          </p>
                        )}
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                            <Image 
                              src="/paypal.svg" 
                              alt="PayPal" 
                              width={24} 
                              height={24} 
                              className="h-5 w-auto" 
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                              PayPal Checkout
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              You'll be securely redirected to complete your payment
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {formData.paymentMethod === "apple-pay" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 gap-6"
                    >
                      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg flex flex-col items-center justify-center">
                        <div className="mb-4">
                          <Image 
                            src="/applepay.svg" 
                            alt="Apple Pay" 
                            width={80} 
                            height={32} 
                            className="h-10 w-auto" 
                          />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                          Click 'Complete Purchase' to pay with Apple Pay.
                          <br />Your device will prompt you to confirm the payment.
                        </p>
                        <Button
                          onClick={() => console.log('Apple Pay button clicked - would trigger native dialog')}
                          variant="outline"
                          className="border-black dark:border-white bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all rounded-full py-2 px-8"
                        >
                          <span className="text-sm font-medium">Set up Apple Pay</span>
                        </Button>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                          This is a simulation. In production, the Apple Pay sheet would appear automatically.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Billing same as shipping checkbox */}
                  <div className="mt-6 flex items-center">
                    <input
                      type="checkbox"
                      id="billing-same"
                      checked={true}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="billing-same"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Billing address same as shipping
                    </label>
                  </div>

                  {/* Payment Methods */}
                  <div className="border-t border-indigo-100 dark:border-violet-900/30 mt-8 pt-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <p className="text-sm text-indigo-600 dark:text-violet-400">
                        Secure Payment Options
                      </p>
                      <div className="flex items-center gap-3">
                        {[
                          { id: "visa", src: "/visa.svg" },
                          { id: "mastercard", src: "/mastercard.svg" },
                          { id: "paypal", src: "/paypal.svg" },
                          { id: "bitcoin", src: "/bitcoin.svg" },
                        ].map((payment) => (
                          <motion.div
                            key={payment.id}
                            whileHover={{ y: -2 }}
                            className="bg-white dark:bg-indigo-900/40 p-3 rounded-lg"
                          >
                            <Image
                              src={payment.src}
                              alt={`Pay with ${payment.id}`}
                              width={48}
                              height={32}
                              className="h-8 w-auto"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="border-indigo-200 text-indigo-600 dark:border-violet-900/40 dark:text-violet-400"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back to Shipping
                    </Button>
                    <Button
                      onClick={handleContinue}
                      disabled={isProcessing}
                      className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-6 px-6 rounded-lg shadow-md hover:shadow-lg transition-all font-medium text-base relative"
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <motion.div
                            className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span>Complete Purchase</span>
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </div>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Subtotal
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Shipping
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${shippingCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Tax</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-indigo-600 dark:text-violet-400">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <Gift className="h-5 w-5 text-indigo-500" />
                  <span>Free gift wrapping on orders over $50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
