"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Check,
  Users,
  TrendingUp,
  DollarSign,
  BarChart,
  ShoppingBag,
  Star,
  Twitter,
  Instagram,
  Youtube,
  Smartphone,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/main-layout";
import ParallaxCard from "@/components/ui/parallax-card";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { HoverCard } from "@/components/ui/hover-card";
import { useSocialValidation } from "@/hooks/use-social-validation";

export default function JoinInfluencerHub() {
  const [step, setStep] = useState(0); // 0 for landing view
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  
  // Social media validation hook
  const {
    validateUsername,
    getValidationState,
    clearValidation,
    getTotalFollowers,
    formatFollowerCount,
  } = useSocialValidation();

  const successStories = [
    {
      name: "Sarah Johnson",
      handle: "@sarahstyle",
      growth: "800%",
      revenue: "$50K/month",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      quote:
        "Joining UMetha was the best decision for my fashion career. My engagement grew by 800% in just 6 months!",
    },
    {
      name: "Michael Chen",
      handle: "@michellifestyle",
      growth: "1200%",
      revenue: "$75K/month",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
      quote:
        "From 10K to 500K followers, and now making 6-figures monthly through my UMetha storefront.",
    },
    {
      name: "Emma Davis",
      handle: "@emmabeauty",
      growth: "950%",
      revenue: "$40K/month",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04",
      quote:
        "The platform's analytics and tools helped me understand my audience better and grow my beauty brand.",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Create Your Store",
      description:
        "Set up your personalized storefront under the UMetha marketplace with your own branding and style.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    },
    {
      step: "2",
      title: "List Your Products",
      description:
        "Add your fashion items, set prices, and manage inventory with our easy-to-use dashboard.",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04",
    },
    {
      step: "3",
      title: "Earn Revenue",
      description:
        "Earn up to 90% commission on every sale. UMetha only takes a small percentage to maintain the platform.",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e",
    },
  ];

  const benefits = [
    {
      icon: Users,
      title: "Global Reach",
      description:
        "Connect with millions of fashion enthusiasts worldwide through our marketplace.",
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03",
    },
    {
      icon: DollarSign,
      title: "90% Revenue Share",
      description:
        "Keep up to 90% of your sales revenue, with transparent pricing and instant payouts.",
      image: "https://images.unsplash.com/photo-1565799516791-1356d85ba506",
    },
    {
      icon: ShoppingBag,
      title: "Custom Storefront",
      description:
        "Get your own branded storefront with advanced analytics and marketing tools.",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
    },
    {
      icon: BarChart,
      title: "15.8% Engagement Rate",
      description:
        "Our influencers achieve 5x higher engagement than industry average.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    },
  ];

  const requirementsCategories = [
    {
      title: "Audience & Engagement",
      items: [
        "10K+ followers on any major platform",
        "Minimum 5% engagement rate",
        "Active posting schedule (3+ posts/week)",
      ],
      icon: Users,
      color: "from-purple-500 to-indigo-500",
    },
    {
      title: "Content Quality",
      items: [
        "High-quality visual content",
        "Consistent brand aesthetics",
        "Professional photography standards",
      ],
      icon: Star,
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "Niche Expertise",
      items: [
        "Fashion, beauty, or lifestyle focus",
        "Authentic brand voice",
        "Engaged community management",
      ],
      icon: Sparkles,
      color: "from-amber-500 to-orange-500",
    },
  ];

  const totalSteps = 2;
  const progress = ((step - 1) / totalSteps) * 100;

  const formCategories = [
    "Fashion",
    "Beauty",
    "Lifestyle",
    "Fitness",
    "Travel",
    "Food",
    "Technology",
    "Art & Design",
    "Music",
    "Entertainment",
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    instagram: "",
    youtube: "",
    twitter: "",
    tiktok: "",
    category: "",
    followers: "",
    story: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Debounced validation for social media usernames
  const [validationTimeouts, setValidationTimeouts] = useState<Record<string, NodeJS.Timeout>>({});

  const handleSocialMediaChange = useCallback(async (platform: string, value: string) => {
    // Clear existing timeout
    if (validationTimeouts[platform]) {
      clearTimeout(validationTimeouts[platform]);
    }

    // Update form data immediately
    setFormData((prev) => ({
      ...prev,
      [platform]: value,
    }));

    // Clear validation if input is empty
    if (!value.trim()) {
      clearValidation(platform);
      return;
    }

    // Basic username validation before API call
    const cleanValue = value.replace('@', '').trim();
    if (cleanValue.length < 2) {
      // Don't validate usernames that are too short
      return;
    }

    // Set new timeout for validation
    const timeout = setTimeout(async () => {
      await validateUsername(platform, cleanValue);
    }, 1000); // 1 second delay

    setValidationTimeouts(prev => ({
      ...prev,
      [platform]: timeout
    }));
  }, [validateUsername, clearValidation, validationTimeouts]);

  // Update total followers when validation states change
  useEffect(() => {
    const totalFollowers = getTotalFollowers();
    if (totalFollowers > 0) {
      setFormData(prev => ({
        ...prev,
        followers: totalFollowers.toString()
      }));
    }
  }, [getTotalFollowers]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(validationTimeouts).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [validationTimeouts]);

  // Check if all social media accounts are valid
  const hasValidSocialMedia = useCallback(() => {
    const socialPlatforms = ['instagram', 'youtube', 'twitter', 'tiktok'];
    const hasAnySocialMedia = socialPlatforms.some(platform => formData[platform as keyof typeof formData].trim());
    
    if (!hasAnySocialMedia) return false;
    
    // Check if all filled social media accounts are valid
    return socialPlatforms.every(platform => {
      const value = formData[platform as keyof typeof formData].trim();
      if (!value) return true; // Empty is valid
      const validationState = getValidationState(platform);
      return validationState.isValid;
    });
  }, [formData, getValidationState]);

  const handleSubmit = async () => {
    if (!hasValidSocialMedia()) {
      return; // Don't submit if social media validation fails
    }
    setStep(3);
  };

  // Social Media Input Component with validation
  const SocialMediaInput = ({ 
    platform, 
    icon: Icon, 
    placeholder, 
    value, 
    onChange 
  }: {
    platform: string;
    icon: React.ComponentType<{ className?: string }>;
    placeholder: string;
    value: string;
    onChange: (platform: string, value: string) => void;
  }) => {
    const validationState = getValidationState(platform);
    const cleanValue = value.replace('@', '').trim();
    const hasValue = cleanValue.length > 0;
    const isTooShort = hasValue && cleanValue.length < 2;
    
    return (
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          name={platform}
          value={value}
          onChange={(e) => onChange(platform, e.target.value)}
          placeholder={placeholder}
          className={`pl-10 pr-10 transition-all focus:ring-2 focus:ring-purple-600 ${
            validationState.isValid 
              ? 'border-green-500 focus:border-green-500' 
              : validationState.error 
              ? 'border-red-500 focus:border-red-500' 
              : isTooShort
              ? 'border-amber-500 focus:border-amber-500'
              : ''
          }`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {validationState.isValidating && (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          )}
          {validationState.isValid && !validationState.isValidating && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          {validationState.error && !validationState.isValidating && (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          {isTooShort && !validationState.isValidating && !validationState.error && (
            <AlertCircle className="h-4 w-4 text-amber-500" />
          )}
        </div>
        {validationState.error && (
          <p className="text-xs text-red-500 mt-1">
            {validationState.error.includes('not found') || validationState.error.includes('does not exist')
              ? `@${cleanValue} does not exist on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`
              : validationState.error
            }
          </p>
        )}
        {isTooShort && !validationState.error && (
          <p className="text-xs text-amber-600 mt-1">
            Username must be at least 2 characters long
          </p>
        )}
        {validationState.isValid && validationState.data && (
          <p className="text-xs text-green-600 mt-1">
            {validationState.data.followers 
              ? `${formatFollowerCount(validationState.data.followers)} followers`
              : validationState.data.subscribers 
              ? `${formatFollowerCount(validationState.data.subscribers)} subscribers`
              : 'Valid account'
            }
            {validationState.data.verified && ' • Verified'}
          </p>
        )}
      </div>
    );
  };

  return (
    <MainLayout hideFittingRoom hideRoomVisualizer>
      <SmoothScroll />
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <ParallaxCard>
          <motion.div
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              style={{ opacity }}
              className="relative h-[80vh] flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000"
                  alt="Influencer Marketing"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 to-black/80" />
              </div>
              <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="mb-6 bg-white/20 text-white border-white/20 backdrop-blur-sm">
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    Join Our Creator Network
                  </Badge>
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                    Turn Your Influence Into Income
                  </h1>
                  <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                    Join UMetha's exclusive influencer marketplace and start
                    monetizing your fashion influence today
                  </p>
                  <Button
                    size="lg"
                    className="bg-white text-purple-900 hover:bg-white/90"
                    onClick={() => setStep(1)}
                  >
                    Start Application
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
            </motion.div>
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-2 w-2 bg-white/20 rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </ParallaxCard>

        {/* How UMetha Works */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                How UMetha Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Create your own fashion empire with UMetha's powerful platform
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorks.map((item, index) => (
                <HoverCard key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform" />
                    <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl">
                      <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0" />
                        <div className="absolute bottom-4 left-4">
                          <span className="text-4xl font-bold text-white">
                            {item.step}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                </HoverCard>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories Carousel */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              Creator Success Stories
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <HoverCard key={index}>
                  <motion.div
                    className="relative group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ y: -10 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform" />
                    <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-16 w-16 rounded-full overflow-hidden">
                          <Image
                            src={story.image}
                            alt={story.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {story.name}
                          </h3>
                          <p className="text-purple-600 dark:text-purple-400">
                            {story.handle}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        "{story.quote}"
                      </p>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div>
                          <p className="text-sm text-gray-500">Growth</p>
                          <p className="text-2xl font-bold text-purple-600">
                            {story.growth}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Revenue</p>
                          <p className="text-2xl font-bold text-indigo-600">
                            {story.revenue}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </HoverCard>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Requirements Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div className="text-center mb-16">
              <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Join Our Elite Network
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Creator Requirements
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {requirementsCategories.map((category, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-10 rounded-2xl blur-xl group-hover:opacity-20 transition-opacity`}
                  />
                  <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
                    <category.icon className="h-10 w-10 text-purple-600 dark:text-purple-400 mb-6" />
                    <h3 className="text-xl font-bold mb-4">{category.title}</h3>
                    <ul className="space-y-4">
                      {category.items.map((item, itemIndex) => (
                        <motion.li
                          key={itemIndex}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: index * 0.1 + itemIndex * 0.1,
                          }}
                        >
                          <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300">
                            {item}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "500+", label: "Active Influencers" },
              { number: "$2.5M", label: "Monthly Sales" },
              { number: "25%", label: "Commission Rate" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20"
              >
                <h3 className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enhanced Application Form Modal */}
        {step > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden"
            >
              {/* Form Header */}
              <div className="relative p-6 pb-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setStep(0)}
                >
                  ×
                </Button>
                {/* Progress Bar */}
                {step < 3 && (
                  <div className="mb-8">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">
                        Application Progress
                      </span>
                      <span className="text-sm font-medium">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-600 to-indigo-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
                {/* Step Indicators */}
                {step < 3 && (
                  <div className="flex justify-center mb-8">
                    {[1, 2].map((stepNumber) => (
                      <motion.div
                        key={stepNumber}
                        className={`flex items-center ${
                          stepNumber === 2 ? "" : "flex-1"
                        }`}
                      >
                        <motion.div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step >= stepNumber
                              ? "bg-purple-600 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {step > stepNumber ? "✓" : stepNumber}
                        </motion.div>
                        {stepNumber === 1 && (
                          <div className="flex-1 h-0.5 mx-4 bg-gray-100 dark:bg-gray-800">
                            <motion.div
                              className="h-full bg-purple-600"
                              initial={{ width: 0 }}
                              animate={{ width: step > 1 ? "100%" : 0 }}
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-6 pt-0">
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-semibold">
                      Tell us about yourself
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      Start your journey as a UMetha influencer
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          First Name
                        </label>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Enter your first name"
                          className="transition-all focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Enter your last name"
                          className="transition-all focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Email Address
                      </label>
                      <Input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        type="email"
                        placeholder="you@example.com"
                        className="transition-all focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-sm font-medium">
                        Social Media Presence
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Enter your social media usernames to automatically validate and fetch follower counts
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SocialMediaInput
                          platform="instagram"
                          icon={Instagram}
                          placeholder="Instagram username"
                          value={formData.instagram}
                          onChange={handleSocialMediaChange}
                        />
                        <SocialMediaInput
                          platform="youtube"
                          icon={Youtube}
                          placeholder="YouTube channel"
                          value={formData.youtube}
                          onChange={handleSocialMediaChange}
                        />
                        <SocialMediaInput
                          platform="twitter"
                          icon={Twitter}
                          placeholder="Twitter handle"
                          value={formData.twitter}
                          onChange={handleSocialMediaChange}
                        />
                        <SocialMediaInput
                          platform="tiktok"
                          icon={Smartphone}
                          placeholder="TikTok username"
                          value={formData.tiktok}
                          onChange={handleSocialMediaChange}
                        />
                      </div>
                    </div>
                    <motion.div className="pt-6" whileHover={{ scale: 1.01 }}>
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setStep(2)}
                        disabled={!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !hasValidSocialMedia()}
                      >
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      {(!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) && (
                        <p className="text-xs text-red-500 text-center mt-2">
                          Please fill in all required fields to continue
                        </p>
                      )}
                      {formData.firstName.trim() && formData.lastName.trim() && formData.email.trim() && !hasValidSocialMedia() && (
                        <p className="text-xs text-red-500 text-center mt-2">
                          Please add and validate at least one social media account to continue
                        </p>
                      )}
                    </motion.div>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-semibold">
                      Additional Details
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      Help us understand your influence better
                    </p>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Primary Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 focus:ring-2 focus:ring-purple-600"
                      >
                        <option value="">
                          Select your main content category
                        </option>
                        {formCategories.map((category) => (
                          <option key={category} value={category.toLowerCase()}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Total Followers
                      </label>
                      <Input
                        name="followers"
                        value={formData.followers}
                        onChange={handleInputChange}
                        placeholder="Combined followers across all platforms"
                        className="transition-all focus:ring-2 focus:ring-purple-600"
                        readOnly
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        This field is automatically calculated from your validated social media accounts
                      </p>
                      {getTotalFollowers() === 0 && (
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          ⚠️ Please add at least one valid social media account to continue
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Tell Your Story
                      </label>
                      <Textarea
                        name="story"
                        value={formData.story}
                        onChange={handleInputChange}
                        placeholder="Share your journey, your niche, and what makes you unique..."
                        className="min-h-[120px] transition-all focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div className="pt-6 space-y-4">
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSubmit}
                        disabled={!hasValidSocialMedia() || !formData.category || !formData.story.trim()}
                      >
                        Submit Application
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      {!hasValidSocialMedia() && (
                        <p className="text-xs text-red-500 text-center">
                          Please add and validate at least one social media account to submit your application
                        </p>
                      )}
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                    </div>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      className="mb-8"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                    >
                      <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <Check className="h-10 w-10 text-white" />
                      </div>
                    </motion.div>
                    <h2 className="text-2xl font-bold mb-4">
                      Application Submitted!
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                      Thank you for your interest in joining UMetha. We'll
                      review your application and get back to you within 2-3
                      business days.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() =>
                          (window.location.href = "/category/influencerhub")
                        }
                      >
                        Return to Marketplace
                      </Button>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-indigo-600"
                        onClick={() => setStep(0)}
                      >
                        Close
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* CTA Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Ready to Start?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join our community of successful fashion influencers and start
              growing your business
            </p>
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-white/90"
              onClick={() => setStep(1)}
            >
              Apply Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}