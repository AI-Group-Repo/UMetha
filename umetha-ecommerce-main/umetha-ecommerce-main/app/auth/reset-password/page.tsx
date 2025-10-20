"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lock, EyeOff, Eye, ShieldCheck, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from 'react-i18next';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { updatePassword } = useAuth();
  const { toast } = useToast();

  // Check if passwords match whenever either one changes
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(newPassword === confirmPassword);
    }
  }, [newPassword, confirmPassword]);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    // Simple password strength checker
    let strength = 0;
    if (value.length > 6) strength += 1;
    if (value.length > 10) strength += 1;
    if (/[A-Z]/.test(value)) strength += 1;
    if (/[0-9]/.test(value)) strength += 1;
    if (/[^A-Za-z0-9]/.test(value)) strength += 1;

    setPasswordStrength(strength);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await updatePassword(newPassword);

      if (error) throw error;

      toast({
        title: t("password_updated"),
        description: "Your password has been successfully updated",
      });

      setIsComplete(true);
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: t("password_update_failed"),
        description:
          error.message || "There was a problem updating your password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-emerald-500",
  ];

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
        {!isComplete ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t("reset_your_password")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t("enter_your_new_password_below")}
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-indigo-400" />
                  </div>
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    placeholder={t("new_password")}
                    value={newPassword}
                    onChange={handlePasswordChange}
                    className="pl-12 pr-12 py-6 bg-gray-50 dark:bg-gray-800 border-indigo-100 dark:border-violet-800/40 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {passwordVisible ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-indigo-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-indigo-500" />
                    )}
                  </button>
                </div>

                {/* Password strength meter */}
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <div
                        key={index}
                        className={`h-1 flex-1 rounded-full ${
                          index < passwordStrength
                            ? strengthColors[index]
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {passwordStrength === 0 && "Enter a password"}
                    {passwordStrength === 1 && "Weak password"}
                    {passwordStrength === 2 && "Fair password"}
                    {passwordStrength === 3 && "Good password"}
                    {passwordStrength === 4 && "Strong password"}
                    {passwordStrength === 5 && "Very strong password"}
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-indigo-400" />
                  </div>
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-12 pr-12 py-6 bg-gray-50 dark:bg-gray-800 border-indigo-100 dark:border-violet-800/40 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500 ${
                      !passwordsMatch && confirmPassword ? "border-red-500" : ""
                    }`}
                    required
                  />
                </div>
                {!passwordsMatch && confirmPassword && (
                  <p className="text-sm text-red-500">Passwords don't match</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={
                  !newPassword ||
                  !confirmPassword ||
                  !passwordsMatch ||
                  passwordStrength < 3 ||
                  isLoading
                }
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
                    <span>Updating Password...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>Update Password</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <ShieldCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Password Updated
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your password has been successfully updated. You can now sign in
              with your new password.
            </p>
            <Button
              onClick={() => router.push("/signin")}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white"
            >
              Go to Sign In
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
