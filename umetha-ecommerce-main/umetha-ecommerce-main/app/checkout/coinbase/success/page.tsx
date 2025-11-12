"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import MainLayout from "@/components/main-layout";
import Link from "next/link";

export default function CoinbaseSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handlePayment = async () => {
      try {
        // Get charge ID from URL or sessionStorage
        const queryReference = searchParams.get("reference");
        const storedReference = typeof window !== "undefined" ? sessionStorage.getItem("coinbase_payment_reference") : null;
        const coinbaseReference = queryReference || storedReference;
        
        if (!coinbaseReference) {
          setStatus("error");
          setErrorMessage("No Coinbase payment reference found");
          return;
        }

        setPaymentReference(coinbaseReference);

        // Get order data from sessionStorage
        const orderDataStr = sessionStorage.getItem("coinbase_order_data");
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
                coinbase_reference: coinbaseReference,
                total_amount: orderData.total,
                payment_method: "coinbase",
                payment_status: "paid",
                items: orderData.items,
                shipping_address: orderData.formData,
                status: "processing",
              }),
            });

            if (createOrderResponse.ok) {
              const orderResponse = await createOrderResponse.json();
              if (orderResponse.id) {
                setPaymentReference(orderResponse.id);
              }
            }
          } catch (err) {
            console.error("Failed to create order record:", err);
            // Continue even if order creation fails
          }

          // Clear sessionStorage
          sessionStorage.removeItem("coinbase_payment_reference");
          sessionStorage.removeItem("coinbase_order_data");
        }

        // Payment successful
        setStatus("success");

        toast({
          title: "Payment Successful!",
          description: "Your cryptocurrency payment has been processed successfully.",
        });

      } catch (error: any) {
        console.error("Coinbase payment error:", error);
        setStatus("error");
        setErrorMessage(error.message || "Failed to process Coinbase payment");
        
        toast({
          title: "Payment Failed",
          description: error.message || "Failed to process Coinbase payment. Please try again.",
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
                Please wait while we confirm your cryptocurrency payment...
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
                Your cryptocurrency payment has been processed successfully.
                {paymentReference && (
                  <span className="block mt-2">
                    Reference: <strong className="text-indigo-600 dark:text-violet-400">{paymentReference}</strong>
                  </span>
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={() => router.push(`/orders/${paymentReference || ""}`)}
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
                {errorMessage || "There was an error processing your cryptocurrency payment."}
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

