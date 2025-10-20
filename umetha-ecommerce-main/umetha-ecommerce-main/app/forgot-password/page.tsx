"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { AtSign, ArrowLeft, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/use-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) return;

    try {
      setIsLoading(true);

      const { error } = await resetPassword(email);

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for a password reset link",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Failed to send reset link",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-violet-50 dark:from-indigo-950 dark:to-violet-950 p-8">
      <Link href="/" className="mb-8 flex flex-col items-center">
        <Image
          src="/Logo.png"
          alt="UMetha Logo"
          width={180}
          height={45}
          priority={true}
          className="object-contain mb-2"
        />
        <p className="text-xs font-medium uppercase tracking-wide text-purple-500/80 dark:text-purple-400/80">
          BILLIONAIRE EXPERIENCES
        </p>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8"
      >
        {!isSubmitted ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Reset Your Password
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Enter your email address and we'll send you a link to reset your
                password
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <AtSign className="h-5 w-5 text-indigo-400" />
                </div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 py-6 bg-gray-50 dark:bg-gray-800 border-indigo-100 dark:border-violet-800/40 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={!email || isLoading}
                className="w-full py-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-full shadow-md hover:shadow-lg transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We've sent a password reset link to{" "}
              <span className="font-medium">{email}</span>. Please check your
              inbox and spam folder.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsSubmitted(false)}
              className="bg-transparent border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
            >
              Go back
            </Button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/signin"
            className="inline-flex items-center text-sm text-indigo-600 dark:text-violet-400 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
