"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Package,
  Store,
  TrendingUp,
  Check,
  Sparkles,
  Zap,
  DollarSign,
  ShoppingCart,
  Boxes,
  BarChart3,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface BusinessModel {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  color: string;
  gradient: string;
}

const businessModels: BusinessModel[] = [
  {
    id: "ai_dropshipping",
    title: "AI Dropshipping",
    description: "Automatically source and sell products from CJ Dropshipping with zero inventory",
    icon: <Package className="h-8 w-8" />,
    features: [
      "Auto-import products from CJ Dropshipping",
      "No inventory management needed",
      "Automated order fulfillment",
      "Multiple payment options (PayPal, Coinbase, Apple Pay, Card)",
      "Real-time stock updates",
      "Product displayed in card format",
    ],
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "direct_marketplace",
    title: "Direct Marketplace",
    description: "Full control - Add, manage, and sell your own products directly",
    icon: <Store className="h-8 w-8" />,
    features: [
      "Add your own products",
      "Full inventory control",
      "Edit, update, and delete products",
      "Automatic stock updates on sales",
      "Manage shipping and couriers",
      "Complete e-commerce workflow",
    ],
    color: "text-purple-500",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "affiliate_marketing",
    title: "Affiliate Marketing",
    description: "Earn commissions by promoting ClickBank products automatically",
    icon: <TrendingUp className="h-8 w-8" />,
    features: [
      "Auto-sync ClickBank products every 24 hours",
      "Approve products to display",
      "Automatic affiliate link generation",
      "Commission tracking",
      "Minimal effort required",
      "ClickBank Marketplace integration",
    ],
    color: "text-green-500",
    gradient: "from-green-500 to-emerald-500",
  },
];

export default function InfluencerOnboardingPage() {
  const router = useRouter();
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"selection" | "confirmation">("selection");

  useEffect(() => {
    // Only influencers can access this page
    if (userRole && userRole !== "INFLUENCER") {
      router.push("/dashboard");
    }
  }, [userRole, router]);

  const toggleModel = (modelId: string) => {
    setSelectedModels((prev) => {
      if (prev.includes(modelId)) {
        return prev.filter((id) => id !== modelId);
      } else if (prev.length < 2) {
        return [...prev, modelId];
      } else {
        toast({
          title: "Maximum Selection Reached",
          description: "You can only select up to 2 business models",
          variant: "destructive",
        });
        return prev;
      }
    });
  };

  const canProceed = selectedModels.length >= 1 && selectedModels.length <= 2;

  const handleContinue = () => {
    if (!canProceed) {
      toast({
        title: "Selection Required",
        description: "Please select 1 or 2 business models to continue",
        variant: "destructive",
      });
      return;
    }
    setStep("confirmation");
  };

  const handleBack = () => {
    setStep("selection");
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Get the mock user ID from cookie if it exists (for test accounts)
      const getCookieValue = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
        return null;
      };

      const mockUserId = getCookieValue("mock-user-id");
      const userId = mockUserId || user.id;
      const isDemoAccount = user.email?.includes("@umetha.com");

      console.log("Saving business models for user:", userId, "Models:", selectedModels);

      // For demo accounts, use localStorage as primary storage and skip Supabase (schema may not exist)
      if (isDemoAccount) {
        const { updateDemoBusinessModels } = await import("@/lib/demo-account-storage");
        updateDemoBusinessModels(selectedModels, user.email);
        console.log("✅ Saved demo business models locally. Skipping Supabase sync for demo accounts.");
      } else {
        // For real accounts, Supabase is required
        // @ts-ignore - Supabase type issue with profiles table
        const { error } = await supabase
          .from("profiles")
          // @ts-ignore
          .update({
            business_models: selectedModels,
            onboarding_completed: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (error) throw error;
      }

      toast({
        title: "Success!",
        description: "Your influencer store is now set up",
      });

      console.log("✅ Business models saved successfully!");

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard/influencer");
      }, 1000);
    } catch (error: any) {
      console.error("Error saving business models:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "confirmation") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                  <Check className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-2">Confirm Your Selection</h1>
              <p className="text-gray-600 dark:text-gray-400">
                You've selected {selectedModels.length} business {selectedModels.length === 1 ? "model" : "models"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {businessModels
                .filter((model) => selectedModels.includes(model.id))
                .map((model) => (
                  <Card key={model.id} className="border-2 border-indigo-200">
                    <CardHeader>
                      <div className={`mb-2 ${model.color}`}>{model.icon}</div>
                      <CardTitle>{model.title}</CardTitle>
                      <CardDescription>{model.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {model.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleBack}
                disabled={isLoading}
              >
                Go Back
              </Button>
              <Button
                size="lg"
                onClick={handleComplete}
                disabled={isLoading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 rounded-full border-t-2 border-b-2 border-white" />
                    Setting Up...
                  </div>
                ) : (
                  <>
                    Complete Setup
                    <Sparkles className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Choose Your Business Model
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              Select 1 or 2 ways to monetize your influence
            </p>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="text-sm">
                {selectedModels.length} / 2 selected
              </Badge>
              {canProceed && (
                <Badge className="bg-green-500">
                  <Check className="h-3 w-3 mr-1" />
                  Ready to proceed
                </Badge>
              )}
            </div>
          </div>

          {/* Business Model Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {businessModels.map((model, index) => {
              const isSelected = selectedModels.includes(model.id);
              const isDisabled = !isSelected && selectedModels.length >= 2;

              return (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      isSelected
                        ? "border-2 border-indigo-500 shadow-lg scale-105"
                        : isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-102"
                    }`}
                    onClick={() => !isDisabled && toggleModel(model.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className={`${model.color}`}>{model.icon}</div>
                        {isSelected && (
                          <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <CardTitle className="mt-4">{model.title}</CardTitle>
                      <CardDescription>{model.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {model.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Zap className={`h-4 w-4 ${model.color} mt-0.5 flex-shrink-0`} />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!canProceed}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-6 text-lg"
            >
              Continue
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              💡 Tip: You can change your business models later in settings
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/**
     // Save to localStorage for demo account
        updateDemoBusinessModels(selectedModels);
        
        // Try to save to Supabase too, but don't fail if it errors
        try {
          // @ts-ignore - Supabase type issue with profiles table
          await supabase
            .from("profiles")
            // @ts-ignore
            .upsert({
              id: userId,
              email: user.email,
              role: "INFLUENCER",
              business_models: selectedModels,
              onboarding_completed: true,
              updated_at: new Date().toISOString(),
            });
          console.log("✅ Also saved to Supabase");
        } catch (dbError) {
          console.log("⚠️ Supabase save failed, but localStorage saved successfully:", dbError);
        }
 */
