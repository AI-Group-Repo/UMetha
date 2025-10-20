"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Search,
  HelpCircle,
  Phone,
  Mail,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Clock,
  FileQuestion,
  Package,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  User,
  Check,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import MainLayout from "@/components/main-layout";
import PageHeader from "@/components/page-header";

// Common FAQs
const commonQuestions = [
  {
    id: "account-1",
    question: "How do I reset my password?",
    answer:
      "To reset your password, click on 'Forgot Password' on the login page. Enter your email address and follow the instructions sent to your email to create a new password.",
  },
  {
    id: "account-2",
    question: "How do I update my personal information?",
    answer:
      "You can update your personal information by navigating to Account Settings in your profile menu. From there, you can edit your name, email, phone number, and other details.",
  },
  {
    id: "account-3",
    question: "Can I have multiple shipping addresses?",
    answer:
      "Yes, you can save multiple shipping addresses in your account. Go to 'Saved Addresses' in your profile menu to add, edit, or remove addresses.",
  },
  {
    id: "orders-1",
    question: "How do I track my order?",
    answer:
      "To track your order, go to 'My Orders' in your profile menu. Find the order you want to track and click on 'Track Package'. You'll see the current status and location of your package.",
  },
  {
    id: "orders-2",
    question: "Can I cancel my order after placing it?",
    answer:
      "Orders can be cancelled within 1 hour of placing them if they haven't entered the processing stage. Go to 'My Orders', select the order you want to cancel, and click on the 'Cancel Order' button if it's still available.",
  },
  {
    id: "orders-3",
    question: "What should I do if my order arrives damaged?",
    answer:
      "If your order arrives damaged, please take photos of the damaged items and packaging. Contact our customer support team within 48 hours of delivery with your order number and photos, and we'll resolve the issue promptly.",
  },
  {
    id: "returns-1",
    question: "What is the return policy?",
    answer:
      "Our standard return policy allows returns within 30 days of delivery for most items in new, unused condition with original packaging. Some categories like electronics and beauty products may have different policies.",
  },
  {
    id: "returns-2",
    question: "How do I initiate a return?",
    answer:
      "To initiate a return, go to 'My Orders' in your profile menu, select the order containing the item you want to return, and click on 'Return Item'. Follow the instructions to complete the return process.",
  },
  {
    id: "returns-3",
    question: "How long does it take to process a refund?",
    answer:
      "Once we receive your returned item, it typically takes 3-5 business days to inspect and process the return. After processing, refunds usually take 5-10 business days to appear in your account, depending on your payment method.",
  },
  {
    id: "payment-1",
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit and debit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and select cryptocurrencies including Bitcoin and Ethereum.",
  },
  {
    id: "payment-2",
    question: "Is it safe to save my payment information?",
    answer:
      "Yes, all payment information is encrypted and stored securely following industry-standard PCI DSS compliance. We never store your full credit card details on our servers.",
  },
  {
    id: "payment-3",
    question: "How do I use a coupon code?",
    answer:
      "To use a coupon code, add items to your cart and proceed to checkout. On the payment page, you'll find a field labeled 'Apply Coupon'. Enter your code and click 'Apply' to see the discount reflected in your total.",
  },
];

// Help Categories
const helpCategories = [
  {
    id: "account",
    title: "Account & Profile",
    icon: <User className="h-5 w-5" />,
    description: "Manage your account, privacy, and security settings",
    topics: [
      "Account setup",
      "Password reset",
      "Profile management",
      "Privacy settings",
    ],
  },
  {
    id: "orders",
    title: "Orders & Tracking",
    icon: <Package className="h-5 w-5" />,
    description: "Track packages and manage your orders",
    topics: [
      "Order status",
      "Shipment tracking",
      "Order modification",
      "Delivery issues",
    ],
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    icon: <RefreshCw className="h-5 w-5" />,
    description: "Process returns and check refund status",
    topics: [
      "Return policy",
      "Return process",
      "Refund timeline",
      "Return shipping",
    ],
  },
  {
    id: "payment",
    title: "Payment & Billing",
    icon: <CreditCard className="h-5 w-5" />,
    description: "Payment methods, invoices, and billing issues",
    topics: [
      "Payment options",
      "Billing address",
      "Invoice requests",
      "Payment issues",
    ],
  },
  {
    id: "shipping",
    title: "Shipping & Delivery",
    icon: <Truck className="h-5 w-5" />,
    description: "Delivery options, times, and shipping policies",
    topics: [
      "Shipping methods",
      "Delivery timeframes",
      "International shipping",
      "Shipping restrictions",
    ],
  },
  {
    id: "security",
    title: "Security & Privacy",
    icon: <ShieldCheck className="h-5 w-5" />,
    description: "Account security and privacy concerns",
    topics: [
      "Account security",
      "Data privacy",
      "Suspicious activity",
      "Information requests",
    ],
  },
];

// Support channels
const supportChannels = [
  {
    title: "Live Chat",
    icon: <MessageSquare className="h-6 w-6" />,
    description: "Chat with our support team in real-time",
    availability: "Mon-Fri, 9am-9pm EST",
    buttonText: "Start Chat",
    buttonAction: "/live-chat",
    isLive: true,
  },
  {
    title: "Email Support",
    icon: <Mail className="h-6 w-6" />,
    description: "Send us an email and we'll respond within 24 hours",
    availability: "24/7, response within 24 hours",
    buttonText: "Email Us",
    buttonAction: "mailto:support@umetha.com",
  },
  {
    title: "Phone Support",
    icon: <Phone className="h-6 w-6" />,
    description: "Call our dedicated customer service team",
    availability: "Mon-Fri, 8am-8pm EST",
    buttonText: "Call Now",
    buttonAction: "tel:+15551234567",
  },
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("help");

  // Filter FAQs based on search term
  const filteredQuestions = searchTerm
    ? commonQuestions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : commonQuestions;

  // Group FAQs by category
  const categorizedQuestions = filteredQuestions.reduce((acc, question) => {
    const category = question.id.split("-")[0];
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(question);
    return acc;
  }, {});

  const mainContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex flex-col gap-8">
        {/* Page header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="text-indigo-600 dark:text-violet-400 hover:text-indigo-700 dark:hover:text-violet-300"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Help Center
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Find answers, guides, and support for all your questions
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 py-6 text-lg rounded-xl border-indigo-200 dark:border-violet-800/40 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500 shadow-md"
          />
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="help"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto bg-indigo-100/50 dark:bg-violet-900/20">
            <TabsTrigger
              value="help"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white dark:data-[state=active]:bg-violet-600"
            >
              Help Topics
            </TabsTrigger>
            <TabsTrigger
              value="faq"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white dark:data-[state=active]:bg-violet-600"
            >
              FAQs
            </TabsTrigger>
            <TabsTrigger
              value="support"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white dark:data-[state=active]:bg-violet-600"
            >
              Contact Us
            </TabsTrigger>
          </TabsList>

          {/* Help Topics Tab */}
          <TabsContent value="help" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpCategories.map((category) => (
                <Card
                  key={category.id}
                  className="overflow-hidden border border-indigo-100 dark:border-violet-800/30 bg-white dark:bg-gray-900"
                >
                  <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-violet-700 dark:to-indigo-800 text-white p-4 flex items-center gap-3">
                    <div className="bg-white/20 rounded-lg p-2">
                      {category.icon}
                    </div>
                    <CardTitle className="text-lg font-semibold">
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {category.description}
                    </p>

                    <div className="space-y-2">
                      {category.topics.map((topic, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm"
                        >
                          <ChevronRight className="h-4 w-4 text-indigo-500 dark:text-violet-400" />
                          <span className="text-gray-800 dark:text-gray-200">
                            {topic}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-end">
                    <Button
                      variant="link"
                      className="text-indigo-600 dark:text-violet-400 p-0 h-auto flex items-center"
                    >
                      <span>View guides</span>
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* User Guides Section */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Popular User Guides
                </h2>
                <Button
                  variant="outline"
                  className="border-indigo-200 dark:border-violet-800/50 text-indigo-600 dark:text-violet-400"
                >
                  View All Guides
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  {
                    title: "Getting Started with Your Account",
                    description:
                      "Learn how to set up your account and personalize your experience",
                    icon: <User />,
                    readTime: "5 min read",
                  },
                  {
                    title: "Managing Orders & Returns",
                    description:
                      "Everything you need to know about tracking orders and processing returns",
                    icon: <Package />,
                    readTime: "7 min read",
                  },
                  {
                    title: "Security & Privacy Settings",
                    description:
                      "How to keep your account secure and manage your privacy preferences",
                    icon: <ShieldCheck />,
                    readTime: "6 min read",
                  },
                ].map((guide, i) => (
                  <div
                    key={i}
                    className="border border-indigo-100 dark:border-violet-800/30 rounded-lg p-5 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-100 dark:bg-violet-900/30 p-2.5 rounded-lg">
                        {guide.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {guide.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-violet-300 dark:border-violet-800/40 flex items-center gap-1"
                          >
                            <Clock className="h-3 w-3" />
                            {guide.readTime}
                          </Badge>
                          <Button
                            variant="ghost"
                            className="text-xs h-8 text-indigo-600 dark:text-violet-400"
                          >
                            Read Guide →
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="mt-6">
            {searchTerm && filteredQuestions.length === 0 ? (
              <div className="text-center py-10">
                <FileQuestion className="mx-auto h-16 w-16 text-indigo-300 dark:text-violet-700" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                  No results found
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Try adjusting your search terms or browse all FAQs below.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.keys(categorizedQuestions).length > 0 ? (
                  Object.entries(categorizedQuestions).map(
                    ([category, questions]) => {
                      // Map category ID to proper display name
                      const categoryInfo = helpCategories.find(
                        (c) => c.id === category
                      );
                      return (
                        <div key={category} className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 dark:bg-violet-900/20 p-2 rounded-lg">
                              {categoryInfo?.icon}
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                              {categoryInfo?.title || category}
                            </h2>
                          </div>

                          <Accordion
                            type="single"
                            collapsible
                            className="space-y-2"
                          >
                            {questions.map((q) => (
                              <AccordionItem
                                key={q.id}
                                value={q.id}
                                className="border border-indigo-100 dark:border-violet-800/30 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm"
                              >
                                <AccordionTrigger className="px-6 py-4 hover:bg-indigo-50 dark:hover:bg-violet-900/20 text-left font-medium text-gray-900 dark:text-gray-100">
                                  {q.question}
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-4 pt-1 text-gray-600 dark:text-gray-300">
                                  {q.answer}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </div>
                      );
                    }
                  )
                ) : (
                  <div className="text-center py-10">
                    <FileQuestion className="mx-auto h-16 w-16 text-indigo-300 dark:text-violet-700" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                      No FAQs available
                    </h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      Please check back later or contact support for assistance.
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Contact Support Tab */}
          <TabsContent value="support" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {supportChannels.map((channel, i) => (
                <Card
                  key={i}
                  className="border border-indigo-100 dark:border-violet-800/30 bg-white dark:bg-gray-900 overflow-hidden flex flex-col"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="bg-indigo-100 dark:bg-violet-900/20 p-2.5 rounded-lg">
                        {channel.icon}
                      </div>
                      {channel.isLive && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/40"
                        >
                          <span className="flex h-2 w-2 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                          Live Now
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {channel.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      {channel.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3 pt-0 flex-1">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{channel.availability}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-violet-600 dark:hover:bg-violet-700 text-white"
                      asChild
                    >
                      <Link href={channel.buttonAction}>
                        {channel.buttonText}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Contact Form */}
            <div className="mt-8 border border-indigo-100 dark:border-violet-800/30 rounded-xl p-6 bg-white dark:bg-gray-900">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Send us a message
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Fill out the form and our team will get back to you within
                    24 hours.
                  </p>

                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 dark:bg-violet-900/20 p-2 rounded-lg">
                        <Mail className="h-5 w-5 text-indigo-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Email
                        </p>
                        <a
                          href="mailto:support@umetha.com"
                          className="text-indigo-600 dark:text-violet-400 hover:underline"
                        >
                          support@umetha.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 dark:bg-violet-900/20 p-2 rounded-lg">
                        <Phone className="h-5 w-5 text-indigo-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Phone
                        </p>
                        <a
                          href="tel:+15551234567"
                          className="text-indigo-600 dark:text-violet-400 hover:underline"
                        >
                          +1 (555) 123-4567
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 dark:bg-violet-900/20 p-2 rounded-lg">
                        <Clock className="h-5 w-5 text-indigo-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Hours
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          Mon-Fri: 8am-8pm EST
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Full Name
                        </label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          className="border-indigo-200 dark:border-violet-800/40 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Email Address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          className="border-indigo-200 dark:border-violet-800/40 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Subject
                      </label>
                      <Input
                        id="subject"
                        placeholder="How can we help you?"
                        className="border-indigo-200 dark:border-violet-800/40 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder="Please describe your issue in detail..."
                        className="w-full rounded-md border border-indigo-200 dark:border-violet-800/40 bg-white dark:bg-black/20 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500"
                      ></textarea>
                    </div>

                    <div className="text-right">
                      <Button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 dark:bg-violet-600 dark:hover:bg-violet-700 text-white"
                      >
                        Send Message
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );

  return (
    <>
      <PageHeader
        title="Help & Support"
        description="Get the assistance you need with our support resources"
        backgroundImage="/headphone.webp"
      />
      <MainLayout hideShopCategory={true}>{mainContent}</MainLayout>
    </>
  );
}
