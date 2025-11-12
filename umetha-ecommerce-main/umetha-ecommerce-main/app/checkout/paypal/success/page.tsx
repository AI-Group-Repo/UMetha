"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import MainLayout from "@/components/main-layout";
import Link from "next/link";

export default function PayPalSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handlePayment = async () => {
      try {
        // Get order ID from URL or sessionStorage
        const paypalOrderId = searchParams.get("token") || sessionStorage.getItem("paypal_order_id");
        
        if (!paypalOrderId) {
          setStatus("error");
          setErrorMessage("No PayPal order ID found");
          return;
        }

        setOrderId(paypalOrderId);

        // Capture the PayPal order
        const response = await fetch("/api/checkout/paypal/capture-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: paypalOrderId,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to capture PayPal payment");
        }

        // Payment successful
        setStatus("success");

        // Get order data from sessionStorage
        const orderDataStr = sessionStorage.getItem("paypal_order_data");
        if (orderDataStr) {
          const orderData = JSON.parse(orderDataStr);
          
          // Create order record in database
          try {
            const createOrderResponse = await fetch("/api/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                paypal_order_id: paypalOrderId,
                total_amount: orderData.total,
                payment_method: "paypal",
                payment_status: "paid",
                items: orderData.items,
                shipping_address: orderData.formData,
                status: "processing",
              }),
            });

            if (createOrderResponse.ok) {
              const orderResponse = await createOrderResponse.json();
              if (orderResponse.id) {
                setOrderId(orderResponse.id);
              }
            }
          } catch (err) {
            console.error("Failed to create order record:", err);
            // Continue even if order creation fails
          }

          // Clear sessionStorage
          sessionStorage.removeItem("paypal_order_id");
          sessionStorage.removeItem("paypal_order_data");
        }

        toast({
          title: "Payment Successful!",
          description: "Your order has been placed successfully.",
        });

      } catch (error: any) {
        console.error("PayPal payment error:", error);
        setStatus("error");
        setErrorMessage(error.message || "Failed to process PayPal payment");
        
        toast({
          title: "Payment Failed",
          description: error.message || "Failed to process PayPal payment. Please try again.",
          variant: "destructive",
        });
      }
    };

    handlePayment();
  }, [searchParams, toast]);

  return (
    <MainLayout hideShopCategory={true} hideFittingRoom={true}>
      <div className="max-w-2xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 text-center"
        >
          {status === "loading" && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <Loader2 className="h-16 w-16 text-indigo-600 dark:text-violet-400 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Processing Your Payment
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we confirm your PayPal payment...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </motion.div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Payment Successful!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Your PayPal payment has been processed successfully.
                {orderId && (
                  <span className="block mt-2">
                    Order ID: <strong className="text-indigo-600 dark:text-violet-400">{orderId}</strong>
                  </span>
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={() => router.push(`/orders/${orderId || ""}`)}
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white"
                >
                  View Order
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="border-indigo-200 text-indigo-600 dark:border-violet-900/40 dark:text-violet-400"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Payment Failed
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {errorMessage || "There was an error processing your PayPal payment."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={() => router.push("/checkout")}
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => router.push("/cart")}
                  variant="outline"
                  className="border-indigo-200 text-indigo-600 dark:border-violet-900/40 dark:text-violet-400"
                >
                  Back to Cart
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-indigo-600 dark:text-violet-400 hover:underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}

