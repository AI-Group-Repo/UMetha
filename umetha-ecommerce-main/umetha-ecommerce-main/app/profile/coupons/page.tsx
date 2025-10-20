"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Ticket,
  ArrowLeft,
  Copy,
  Clock,
  Search,
  ShoppingBag,
  Filter,
  Check,
  CheckCircle2,
  X,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import MainLayout from "@/components/main-layout";
import PageHeader from "@/components/page-header";

// Types
type CouponStatus = "active" | "used" | "expired";
type CouponType = "percentage" | "fixed" | "shipping" | "bogo";

interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minSpend?: number;
  maxDiscount?: number;
  validFrom: Date;
  validUntil: Date;
  description: string;
  status: CouponStatus;
  usageLimit?: number;
  usageCount?: number;
  termsAndConditions: string[];
  category?: string;
  image?: string;
  isExclusive: boolean;
}

// Mock data
const mockCoupons: Coupon[] = [
  {
    id: "COUPON-001",
    code: "WELCOME25",
    type: "percentage",
    value: 25,
    minSpend: 100,
    validFrom: new Date(2025, 2, 1),
    validUntil: new Date(2025, 4, 15),
    description: "25% off your first purchase",
    status: "active",
    usageLimit: 1,
    usageCount: 0,
    termsAndConditions: [
      "Valid for new customers only",
      "Cannot be combined with other offers",
      "Excludes sale items",
      "Minimum spend of $100",
    ],
    isExclusive: true,
    image: "/crossbag.webp",
  },
  {
    id: "COUPON-002",
    code: "SPRING2025",
    type: "percentage",
    value: 15,
    minSpend: 50,
    validFrom: new Date(2025, 2, 1),
    validUntil: new Date(2025, 4, 30),
    description: "Spring collection discount",
    status: "active",
    termsAndConditions: [
      "Valid on all spring collection items",
      "Cannot be combined with other offers",
      "Minimum spend of $50",
    ],
    category: "Seasonal",
    isExclusive: false,
    image: "/fashion-slide2.png",
  },
  {
    id: "COUPON-003",
    code: "FREESHIP",
    type: "shipping",
    value: 100,
    minSpend: 75,
    validFrom: new Date(2025, 0, 1),
    validUntil: new Date(2025, 11, 31),
    description: "Free shipping on orders over $75",
    status: "active",
    termsAndConditions: [
      "Valid for standard shipping only",
      "Minimum spend of $75",
      "Domestic orders only",
    ],
    isExclusive: false,
  },
  {
    id: "COUPON-004",
    code: "TECHWEEK",
    type: "fixed",
    value: 50,
    minSpend: 200,
    validFrom: new Date(2025, 3, 1),
    validUntil: new Date(2025, 3, 20),
    description: "$50 off electronics over $200",
    status: "active",
    termsAndConditions: [
      "Valid on electronics category only",
      "Minimum spend of $200",
      "One use per customer",
    ],
    category: "Electronics",
    isExclusive: false,
    image: "/LG-TV.jpeg",
  },
  {
    id: "COUPON-005",
    code: "BOGO50",
    type: "bogo",
    value: 50,
    validFrom: new Date(2025, 3, 1),
    validUntil: new Date(2025, 3, 15),
    description: "Buy one, get one 50% off",
    status: "active",
    termsAndConditions: [
      "Buy one item at full price, get second item of equal or lesser value at 50% off",
      "Valid on select categories",
      "Cannot be combined with other offers",
    ],
    category: "Fashion",
    isExclusive: true,
    image: "/handbag1.jpg",
  },
  {
    id: "COUPON-006",
    code: "SUMMER20",
    type: "percentage",
    value: 20,
    minSpend: 80,
    validFrom: new Date(2025, 0, 1),
    validUntil: new Date(2025, 2, 31),
    description: "20% off your purchase",
    status: "expired",
    termsAndConditions: [
      "Valid on all items",
      "Minimum spend of $80",
      "Cannot be combined with other offers",
    ],
    isExclusive: false,
  },
  {
    id: "COUPON-007",
    code: "FLASH15",
    type: "percentage",
    value: 15,
    validFrom: new Date(2025, 1, 1),
    validUntil: new Date(2025, 1, 3),
    description: "Flash sale discount",
    status: "expired",
    termsAndConditions: [
      "Valid for 48 hours only",
      "No minimum spend",
      "Cannot be combined with other offers",
    ],
    category: "Limited Time",
    isExclusive: false,
  },
  {
    id: "COUPON-008",
    code: "LOYALTY50",
    type: "fixed",
    value: 50,
    minSpend: 150,
    validFrom: new Date(2025, 2, 15),
    validUntil: new Date(2025, 5, 15),
    description: "$50 off for loyal customers",
    status: "active",
    usageLimit: 1,
    usageCount: 0,
    termsAndConditions: [
      "For customers with 3+ previous orders",
      "Minimum spend of $150",
      "One use per customer",
    ],
    isExclusive: true,
    image: "/macbook.jpeg",
  },
];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCopiedDialog, setShowCopiedDialog] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");

  // Simulate fetching coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setCoupons(mockCoupons);
        setIsLoading(false);
      }, 1000);
    };

    fetchCoupons();
  }, []);

  // Copy coupon code to clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setShowCopiedDialog(true);

    // Hide dialog after 2 seconds
    setTimeout(() => {
      setShowCopiedDialog(false);
    }, 2000);
  };

  // Check if a coupon is expiring soon (within 7 days)
  const isExpiringSoon = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays >= 0 && diffDays <= 7;
  };

  // Format date to display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate days remaining until expiration
  const getDaysRemaining = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays;
  };

  // Filter coupons based on tab, search, and category
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesStatus = activeTab === "all" || coupon.status === activeTab;
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      (coupon.category &&
        coupon.category.toLowerCase() === categoryFilter.toLowerCase());

    return matchesStatus && matchesSearch && matchesCategory;
  });

  // Get counts for tabs
  const activeCouponsCount = coupons.filter(
    (c) => c.status === "active"
  ).length;
  const usedCouponsCount = coupons.filter((c) => c.status === "used").length;
  const expiredCouponsCount = coupons.filter(
    (c) => c.status === "expired"
  ).length;

  // Get unique categories from coupons
  const categories = Array.from(
    new Set(
      coupons
        .filter((coupon) => coupon.category)
        .map((coupon) => coupon.category)
    )
  );

  // Render the coupon value based on type
  const renderCouponValue = (coupon: Coupon) => {
    switch (coupon.type) {
      case "percentage":
        return `${coupon.value}% OFF`;
      case "fixed":
        return `$${coupon.value} OFF`;
      case "shipping":
        return "FREE SHIPPING";
      case "bogo":
        return `BUY 1 GET 1 ${coupon.value}% OFF`;
      default:
        return "";
    }
  };

  const mainContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex flex-col gap-6">
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
              My Coupons
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your discount coupons and special offers
          </p>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="active"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="bg-indigo-100/50 dark:bg-violet-900/20">
              <TabsTrigger
                value="active"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white dark:data-[state=active]:bg-violet-600"
              >
                Active ({activeCouponsCount})
              </TabsTrigger>
              <TabsTrigger
                value="used"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white dark:data-[state=active]:bg-violet-600"
              >
                Used ({usedCouponsCount})
              </TabsTrigger>
              <TabsTrigger
                value="expired"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white dark:data-[state=active]:bg-violet-600"
              >
                Expired ({expiredCouponsCount})
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white dark:data-[state=active]:bg-violet-600"
              >
                All ({coupons.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search coupons"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 border-indigo-200 dark:border-violet-800/40 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-44 border-indigo-200 dark:border-violet-800/40 bg-white dark:bg-black/20 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category?.toLowerCase() || ""}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tab content */}
          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              // Loading skeletons
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-gray-900 rounded-xl border border-indigo-100 dark:border-violet-800/30 overflow-hidden"
                    >
                      <div className="h-36 relative bg-indigo-50 dark:bg-violet-900/20">
                        <Skeleton className="h-full w-full" />
                      </div>
                      <div className="p-5 space-y-4">
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-7 w-1/3" />
                          <Skeleton className="h-10 w-24 rounded-md" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex justify-between items-center pt-2">
                          <Skeleton className="h-5 w-28" />
                          <Skeleton className="h-9 w-28 rounded-md" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : filteredCoupons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCoupons.map((coupon) => (
                  <motion.div
                    key={coupon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`
                      relative overflow-hidden rounded-xl border
                      ${
                        coupon.status === "active"
                          ? "bg-white dark:bg-gray-900 border-indigo-100 dark:border-violet-800/30"
                          : ""
                      }
                      ${
                        coupon.status === "used"
                          ? "bg-gray-50 dark:bg-gray-900/70 border-gray-200 dark:border-gray-800"
                          : ""
                      }
                      ${
                        coupon.status === "expired"
                          ? "bg-gray-50 dark:bg-gray-900/70 border-gray-200 dark:border-gray-800"
                          : ""
                      }
                    `}
                  >
                    {/* Coupon Header with Image */}
                    <div
                      className={`
                        relative h-36 bg-gradient-to-r 
                        ${
                          coupon.status === "active"
                            ? "from-indigo-500 to-violet-500"
                            : "from-gray-500 to-gray-600"
                        } 
                        overflow-hidden
                      `}
                    >
                      {coupon.image && (
                        <Image
                          src={coupon.image}
                          alt={coupon.description}
                          fill
                          className="object-cover opacity-30 mix-blend-overlay"
                        />
                      )}

                      {/* Diagonal Pattern */}
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 10px, transparent 10px, transparent 20px)",
                        }}
                      ></div>

                      {/* Coupon Value */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <h3 className="text-3xl font-bold tracking-tight">
                            {renderCouponValue(coupon)}
                          </h3>
                          {coupon.minSpend && (
                            <p className="text-sm font-medium text-white/80 mt-1">
                              Min. spend ${coupon.minSpend}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      {coupon.status === "used" && (
                        <Badge
                          variant="outline"
                          className="absolute top-3 right-3 bg-white text-gray-700 border-gray-200"
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Used
                        </Badge>
                      )}

                      {coupon.status === "expired" && (
                        <Badge
                          variant="outline"
                          className="absolute top-3 right-3 bg-white text-red-700 border-red-200"
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Expired
                        </Badge>
                      )}

                      {/* Exclusive Badge */}
                      {coupon.isExclusive && coupon.status === "active" && (
                        <Badge className="absolute top-3 left-3 bg-amber-500 text-white border-amber-600">
                          Exclusive
                        </Badge>
                      )}
                    </div>

                    {/* Coupon Body */}
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                            {coupon.description}
                          </h3>
                          {coupon.category && (
                            <Badge
                              variant="outline"
                              className="mt-2 bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800/50"
                            >
                              {coupon.category}
                            </Badge>
                          )}
                        </div>

                        {coupon.usageLimit && coupon.status === "active" && (
                          <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Usage
                            </p>
                            <p className="text-sm font-medium text-indigo-600 dark:text-violet-400">
                              {coupon.usageCount} / {coupon.usageLimit}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Coupon Code */}
                      <div
                        className={`
                          flex items-center justify-between p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/30
                          ${coupon.status !== "active" ? "opacity-70" : ""}
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-md">
                            <Ticket className="h-4 w-4 text-indigo-600 dark:text-violet-400" />
                          </div>
                          <div className="font-mono font-medium tracking-wider text-indigo-700 dark:text-violet-300">
                            {coupon.code}
                          </div>
                        </div>

                        {coupon.status === "active" && (
                          <Button
                            size="sm"
                            onClick={() => handleCopyCode(coupon.code)}
                            variant="secondary"
                            className="h-8 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-violet-900/50 dark:hover:bg-violet-900 dark:text-violet-300 border-none"
                          >
                            <Copy className="h-3.5 w-3.5 mr-1.5" />
                            Copy
                          </Button>
                        )}
                      </div>

                      {/* Validity Period */}
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1.5" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {coupon.status === "expired" ? (
                              `Expired on ${formatDate(coupon.validUntil)}`
                            ) : coupon.status === "active" &&
                              isExpiringSoon(coupon.validUntil) ? (
                              <span className="text-amber-600 dark:text-amber-500">
                                Expires in {getDaysRemaining(coupon.validUntil)}{" "}
                                days
                              </span>
                            ) : (
                              `Valid until ${formatDate(coupon.validUntil)}`
                            )}
                          </span>
                        </div>

                        {/* Call to action button */}
                        {coupon.status === "active" && (
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-violet-600 dark:hover:bg-violet-700 text-white"
                          >
                            <ShoppingBag className="h-4 w-4 mr-1.5" />
                            Shop Now
                          </Button>
                        )}
                      </div>

                      {/* Terms and Conditions Accordion */}
                      <Accordion type="single" collapsible className="pt-2">
                        <AccordionItem
                          value="terms"
                          className="border-t border-indigo-100 dark:border-violet-800/30"
                        >
                          <AccordionTrigger className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-violet-400 py-3">
                            Terms & Conditions
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 pl-4 list-disc">
                              {coupon.termsAndConditions.map((term, idx) => (
                                <li key={idx}>{term}</li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              // No coupons found
              <div className="text-center py-16 border border-dashed border-indigo-200 dark:border-violet-800/30 rounded-xl bg-indigo-50/50 dark:bg-violet-900/10">
                <Ticket className="h-12 w-12 mx-auto text-indigo-400 dark:text-violet-500 mb-3 opacity-80" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                  No coupons found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                  {searchTerm || categoryFilter !== "all"
                    ? "Try adjusting your filters or search term"
                    : activeTab === "active"
                    ? "You don't have any active coupons right now"
                    : activeTab === "used"
                    ? "You haven't used any coupons yet"
                    : activeTab === "expired"
                    ? "You don't have any expired coupons"
                    : "No coupons available"}
                </p>
                <Link href="/">
                  <Button
                    variant="default"
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-violet-600 dark:hover:bg-violet-700 text-white"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Code Copied Dialog */}
      <Dialog open={showCopiedDialog} onOpenChange={setShowCopiedDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Code Copied!
            </DialogTitle>
            <DialogDescription>
              Use code{" "}
              <span className="font-mono font-medium">{copiedCode}</span> at
              checkout
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </motion.div>
  );

  return (
    <>
      <PageHeader
        title="My Coupons & Offers"
        description="Exclusive discounts and special offers just for you"
        backgroundImage="/fashion-slide2.png"
      />
      <MainLayout hideShopCategory={true}>{mainContent}</MainLayout>
    </>
  );
}
