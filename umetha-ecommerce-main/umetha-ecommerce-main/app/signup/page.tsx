"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  AtSign,
  Lock,
  EyeOff,
  Eye,
  User,
  ArrowRight,
  CheckCircle,
  Globe,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/use-toast";

const SignUpPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState({ firstName: "", lastName: "" });

  const [step, setStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const router = useRouter();
  const { signUp, signInWithSocial } = useAuth();
  const { toast } = useToast();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    // Simple password strength checker
    let strength = 0;
    if (value.length > 6) strength += 1;
    if (value.length > 10) strength += 1;
    if (/[A-Z]/.test(value)) strength += 1;
    if (/[0-9]/.test(value)) strength += 1;
    if (/[^A-Za-z0-9]/.test(value)) strength += 1;

    setPasswordStrength(strength);
  };

  const handleContinue = () => {
    if (step === 1 && email && password && passwordStrength >= 3) {
      setStep(2);
    }
  };

  const handleSignUp = async () => {
    if (step === 2 && email && password && name.firstName && name.lastName) {
      try {
        setIsLoading(true);

        // Create user with Supabase
        const { data, error } = await signUp(email, password, {
          first_name: name.firstName,
          last_name: name.lastName,
          full_name: `${name.firstName} ${name.lastName}`,
        });

        if (error) throw error;

        // Handle successful registration
        toast({
          title: "Account created successfully",
          description:
            "Welcome to UMetha! Please check your email to verify your account.",
        });

        // After successful registration, send the user to the homepage
        // where they can start browsing immediately
        router.push("/");
      } catch (error) {
        console.error("Sign up error:", error);

        const errorMessage = error instanceof Error ? error.message : "An error occurred during registration";
        toast({
          title: "Registration failed",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSocialSignIn = async (provider: "google" | "facebook") => {
    try {
      setSocialLoading(provider);
      const { error } = await signInWithSocial(provider);

      if (error) {
        throw error;
      }
      // The redirect is handled by Supabase and our OAuth callback page
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      toast({
        title: "Sign up failed",
        description: `Could not sign up with ${
          provider.charAt(0).toUpperCase() + provider.slice(1)
        }`,
        variant: "destructive",
      });
      setSocialLoading(null);
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
    <div className="flex min-h-screen bg-gradient-to-b from-indigo-50 to-violet-50 dark:from-indigo-950 dark:to-violet-950">
      {/* Left panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <Link href="/" className="mb-8 flex flex-col items-center">
          <Image
            src="/Logo.png"
            alt="UMetha Logo"
            width={200}
            height={50}
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
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Join UMetha to discover fashion that fits your style
            </p>
          </div>

          {step === 1 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="space-y-4 mb-6">
                {/* First Name */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-5 w-5 text-indigo-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="First Name"
                    value={name.firstName}
                    onChange={(e) =>
                      setName({ ...name, firstName: e.target.value })
                    }
                    className="pl-12 py-6 bg-gray-50 dark:bg-gray-800 border-indigo-100 dark:border-violet-800/40 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500"
                  />
                </div>

                {/* Last Name */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-5 w-5 text-indigo-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Last Name"
                    value={name.lastName}
                    onChange={(e) =>
                      setName({ ...name, lastName: e.target.value })
                    }
                    className="pl-12 py-6 bg-gray-50 dark:bg-gray-800 border-indigo-100 dark:border-violet-800/40 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500"
                  />
                </div>
                {/* Email */}
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
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-indigo-400" />
                  </div>
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Create Password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="pl-12 pr-12 py-6 bg-gray-50 dark:bg-gray-800 border-indigo-100 dark:border-violet-800/40 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500"
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
              </div>

              <Button
                onClick={handleContinue}
                disabled={!email || password.length < 6 || passwordStrength < 3}
                className="w-full py-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-full shadow-md hover:shadow-lg transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-5 w-5 text-indigo-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={`${name.firstName} ${name.lastName}`}
                    readOnly
                    className="pl-12 py-6 bg-gray-50 dark:bg-gray-800 border-indigo-100 dark:border-violet-800/40 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500"
                  />
                </div>

                <div className="flex space-x-2 px-2 py-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 items-center">
                  <Globe className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                  <div className="text-xs text-indigo-800 dark:text-indigo-300">
                    By signing up, you agree to our{" "}
                    <Link
                      href="/terms-and-conditions"
                      className="underline font-medium"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy-policy"
                      className="underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSignUp}
                disabled={isLoading}
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
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>Create Account</span>
                    <CheckCircle className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>
            </motion.div>
          )}

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialSignIn("google")}
              disabled={socialLoading !== null}
              className="py-3 px-4 flex justify-center items-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all"
            >
              {socialLoading === "google" ? (
                <svg
                  className="animate-spin h-5 w-5 text-gray-500"
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
              ) : (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={() => handleSocialSignIn("facebook")}
              disabled={socialLoading !== null}
              className="py-3 px-4 flex justify-center items-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all"
            >
              {socialLoading === "facebook" ? (
                <svg
                  className="animate-spin h-5 w-5 text-gray-500"
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
              ) : (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    fill="#1877F2"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-indigo-600 dark:text-violet-400 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>

        <div className="flex justify-center mt-8 space-x-6">
          <button className="text-gray-500 hover:text-indigo-600 dark:hover:text-violet-400">
            <Globe className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Right panel - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-indigo-100 dark:bg-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/30 z-10"></div>

        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          <div className="relative w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200"
              alt="Fashion showcase"
              layout="fill"
              objectFit="cover"
              priority={true}
              className="transform scale-105 hover:scale-100 transition-transform duration-700"
            />
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 p-12 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="bg-white/95 dark:bg-gray-900/95 p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300 mb-4">
                Experience the Perfect Fit
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Join thousands of fashion enthusiasts who use our 3D fitting
                room to ensure the perfect fit before buying. Create your
                account today to start your personalized shopping journey.
              </p>
              <div className="flex space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-violet-500 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-white"></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Join <span className="font-semibold">2,500+</span> members
                  already shopping smarter
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
