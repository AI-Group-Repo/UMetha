"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  AtSign,
  Lock,
  EyeOff,
  Eye,
  ShieldCheck,
  ArrowRight,
  UserCog,
  ShoppingBag,
  Users,
  LineChart,
  Sparkles,
  Store,
  BarChart4,
  LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, UserRole } from "@/context/auth-context";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Demo test accounts
const TEST_ACCOUNTS = {
  admin: { email: "admin@umetha.com", password: "admin123" },
  seller: { email: "seller@umetha.com", password: "seller123" },
  influencer: { email: "influencer@umetha.com", password: "influencer123" },
};

const DashboardSignInPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<
    "admin" | "seller" | "influencer"
  >("admin");
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const forceSignIn = searchParams?.get("force") === "true";

  const {
    user,
    userRole,
    isLoading: authLoading,
    signInToDashboard,
    signOut,
    getUserRole,
  } = useAuth();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      // Store current user email for the dialog
      if (user.email) {
        setCurrentUserEmail(user.email);
      }

      if (!forceSignIn) {
        // Show dialog for all users, not just dev@umetha.com
        setShowSignInDialog(true);
      }
    }
  }, [user, userRole, authLoading, router, forceSignIn]);

  // Handle continuing with existing session
  const handleContinueWithSession = () => {
    console.log("Continuing with session, userRole:", userRole);

    // User is already authenticated, redirect to appropriate dashboard
    const dashboardPaths = {
      ADMIN: "/dashboard/admin",
      SELLER: "/dashboard/seller",
      INFLUENCER: "/dashboard/influencer",
    };

    if (userRole && userRole in dashboardPaths) {
      router.push(dashboardPaths[userRole]);
    } else {
      // If no specific role or unknown role, redirect to general dashboard
      router.push("/dashboard");
    }
  };

  // Handle signing out to sign in as a different user
  const handleSignOutForNewSignIn = async () => {
    await signOut();
    setForceSignIn(true);
    setShowSignInDialog(false);
    toast({
      title: "Signed out successfully",
      description: "You can now sign in as a different user",
    });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);

      try {
        // Convert role to uppercase for consistent role comparison in the system
        const targetRole = activeRole.toUpperCase() as UserRole;

        // Use the specialized dashboard sign in method
        const { error, hasAccess } = await signInToDashboard(
          email,
          password,
          targetRole
        );

        if (error) {
          throw error;
        }

        if (hasAccess) {
          // Success notification
          toast({
            title: "Sign in successful",
            description: `Welcome to the ${
              activeRole.charAt(0).toUpperCase() + activeRole.slice(1)
            } Dashboard!`,
          });

          // Determine which dashboard to go to based on the active tab
          const dashboardPath = `/dashboard/${activeRole}`;

          // Slight delay for toast visibility
          setTimeout(() => {
            router.push(dashboardPath);
          }, 500);
        } else {
          // Show insufficient permissions error
          toast({
            title: "Access Denied",
            description: `You don't have permissions to access the ${activeRole} dashboard.`,
            variant: "destructive",
          });

          // Sign the user out as they don't have correct access
          await signOut();
        }
      } catch (error: any) {
        console.error("Dashboard sign in error:", error);

        // Show error toast
        toast({
          title: "Sign in failed",
          description:
            error.message || "Please check your credentials and try again",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Sign out the current user and allow signing in as a different user
  const handleSignInAsDifferentUser = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setForceSignIn(true);
      setEmail("");
      setPassword("");
      toast({
        title: "Signed out",
        description: "You can now sign in as a different user.",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const useSelectedDemoAccount = () => {
    setEmail(TEST_ACCOUNTS[activeRole].email);
    setPassword(TEST_ACCOUNTS[activeRole].password);
  };

  const handleRoleTabChange = (value: "admin" | "seller" | "influencer") => {
    setActiveRole(value);
    setEmail("");
    setPassword("");
  };

  const handleSignOut = async () => {
    await signOut();
    // Reload the page with force=true to prevent immediate redirect
    window.location.href = "/dashboard-signin?force=true";
  };

  const handleContinueWithCurrentUser = () => {
    setShowSignInDialog(false);

    // Redirect to appropriate dashboard
    const dashboardPaths = {
      ADMIN: "/dashboard/admin",
      SELLER: "/dashboard/seller",
      INFLUENCER: "/dashboard/influencer",
    };

    if (userRole && userRole in dashboardPaths) {
      router.replace(dashboardPaths[userRole]);
    } else {
      router.replace("/dashboard");
    }
  };

  const roleData = {
    admin: {
      title: "Admin Dashboard",
      description: "Full control of the platform, users, and analytics.",
      icon: <BarChart4 className="h-8 w-8 text-blue-400" />,
      bgClass: "from-blue-600 to-indigo-700",
      image: "/Icon.png",
    },
    seller: {
      title: "Seller Dashboard",
      description: "Manage products, inventory, orders, and sales analytics.",
      icon: <Store className="h-8 w-8 text-green-500" />,
      bgClass: "from-emerald-600 to-teal-700",
      image: "/beauty-banner2.jpeg",
    },
    influencer: {
      title: "Influencer Dashboard",
      description: "Track your promotions, performance, and earnings.",
      icon: <Sparkles className="h-8 w-8 text-purple-500" />,
      bgClass: "from-violet-600 to-purple-700",
      image: "/fashion-slide2.png",
    },
  };

  // If already loading auth state or user is logged in, show loading or sign-in-as option
  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-950">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AlertDialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
        <AlertDialogContent className="bg-gray-900 border border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>You're Already Signed In</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              You're currently signed in as{" "}
              <span className="text-indigo-400 font-medium">
                {currentUserEmail}
              </span>
              . Would you like to continue with this account or sign in with a
              different account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleSignOut}
              className="bg-gray-800 hover:bg-gray-700 text-white border-0"
            >
              Sign in with a different account
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleContinueWithCurrentUser}
              className="bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
            >
              Continue with current account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex min-h-screen bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-950">
        <div className="w-full xl:w-1/2 flex flex-col items-center justify-center p-8 relative">
          <div className="absolute top-8 left-8">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/Logo.png"
                alt="UMetha Logo"
                width={120}
                height={30}
                priority={true}
                className="object-contain"
              />
              <span className="text-sm font-medium text-white">Dashboard</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full"
          >
            <div className="flex justify-center mb-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-indigo-900/30 backdrop-blur-sm"
              >
                {roleData[activeRole].icon}
              </motion.div>
            </div>

            <div className="text-center mb-6">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-3xl font-bold text-white mb-2"
              >
                {roleData[activeRole].title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-indigo-200"
              >
                {roleData[activeRole].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-2"
              >
                <Link
                  href="/signin"
                  className="text-sm font-medium text-indigo-300 hover:text-indigo-100 underline"
                >
                  Looking for regular sign in? Click here
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Tabs
                defaultValue="admin"
                value={activeRole}
                onValueChange={(val) => handleRoleTabChange(val as any)}
                className="mb-6"
              >
                <TabsList className="grid w-full grid-cols-3 bg-indigo-950/50 backdrop-blur-sm rounded-lg p-1">
                  <TabsTrigger
                    value="admin"
                    className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Admin
                  </TabsTrigger>
                  <TabsTrigger
                    value="seller"
                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Seller
                  </TabsTrigger>
                  <TabsTrigger
                    value="influencer"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Influencer
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Card className="border-0 bg-white/5 backdrop-blur-md shadow-xl shadow-black/10">
                <CardContent className="p-6">
                  <form onSubmit={handleSignIn} className="space-y-5">
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <AtSign className="h-5 w-5 text-indigo-400" />
                        </div>
                        <Input
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-12 py-6 bg-white/10 border-white/10 text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="h-5 w-5 text-indigo-400" />
                        </div>
                        <Input
                          type={passwordVisible ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-12 pr-12 py-6 bg-white/10 border-white/10 text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="rememberMe"
                          checked={rememberMe}
                          onCheckedChange={(checked) =>
                            setRememberMe(checked === true)
                          }
                          className="text-indigo-600 border-white/20 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                        />
                        <label
                          htmlFor="rememberMe"
                          className="text-sm text-indigo-200"
                        >
                          Remember me
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={useSelectedDemoAccount}
                        className="text-sm font-medium text-indigo-300 hover:text-indigo-200 hover:underline"
                      >
                        Use demo account
                      </button>
                    </div>

                    <Button
                      type="submit"
                      disabled={!email || !password || isLoading}
                      className={`w-full py-6 bg-gradient-to-r ${roleData[activeRole].bgClass} text-white rounded-lg shadow-lg hover:shadow-xl transition-all`}
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
                          <span>Signing In...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <span>
                            Sign In to{" "}
                            {activeRole.charAt(0).toUpperCase() +
                              activeRole.slice(1)}{" "}
                            Dashboard
                          </span>
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </div>
                      )}
                    </Button>

                    <div className="pt-2 text-center">
                      <p className="text-sm text-indigo-300">
                        Need access to the {activeRole} dashboard?{" "}
                        <Link
                          href="/contact"
                          className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                        >
                          Contact Support
                        </Link>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-indigo-300 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
                Back to main website
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="hidden xl:block xl:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={roleData[activeRole].image}
              alt={`${activeRole} dashboard preview`}
              layout="fill"
              objectFit="cover"
              className="transition-all duration-700"
            />
          </motion.div>

          <div className="absolute bottom-0 inset-x-0 p-10 z-20">
            <div className="bg-black/60 backdrop-blur-md rounded-xl p-8 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                {activeRole === "admin" ? (
                  <>
                    <ShieldCheck className="h-5 w-5 mr-2 text-blue-400" />
                    Complete platform control
                  </>
                ) : activeRole === "seller" ? (
                  <>
                    <LineChart className="h-5 w-5 mr-2 text-green-400" />
                    Grow your business with UMetha
                  </>
                ) : (
                  <>
                    <Users className="h-5 w-5 mr-2 text-purple-400" />
                    Monetize your influence
                  </>
                )}
              </h3>
              <p className="text-gray-300 mb-4">
                {activeRole === "admin" ? (
                  <>
                    Manage users, products, orders and analytics from a central
                    dashboard.
                  </>
                ) : activeRole === "seller" ? (
                  <>
                    Track inventory, fulfill orders, and analyze your sales
                    performance in real-time.
                  </>
                ) : (
                  <>
                    Connect with premium brands, create campaigns, and track
                    your performance metrics.
                  </>
                )}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="mt-1 mr-3 flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    <CheckIcon className="h-3 w-3" />
                  </div>
                  <p className="text-sm text-gray-200">
                    {activeRole === "admin" ? (
                      <>User management</>
                    ) : activeRole === "seller" ? (
                      <>Product management</>
                    ) : (
                      <>Brand partnerships</>
                    )}
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="mt-1 mr-3 flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    <CheckIcon className="h-3 w-3" />
                  </div>
                  <p className="text-sm text-gray-200">
                    {activeRole === "admin" ? (
                      <>Analytics</>
                    ) : activeRole === "seller" ? (
                      <>Order management</>
                    ) : (
                      <>Performance metrics</>
                    )}
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="mt-1 mr-3 flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    <CheckIcon className="h-3 w-3" />
                  </div>
                  <p className="text-sm text-gray-200">
                    {activeRole === "admin" ? (
                      <>System settings</>
                    ) : activeRole === "seller" ? (
                      <>Revenue tracking</>
                    ) : (
                      <>Campaign management</>
                    )}
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="mt-1 mr-3 flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    <CheckIcon className="h-3 w-3" />
                  </div>
                  <p className="text-sm text-gray-200">
                    {activeRole === "admin" ? (
                      <>Content management</>
                    ) : activeRole === "seller" ? (
                      <>Customer insights</>
                    ) : (
                      <>Earnings dashboard</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper icon component
const CheckIcon = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
};

export default DashboardSignInPage;
