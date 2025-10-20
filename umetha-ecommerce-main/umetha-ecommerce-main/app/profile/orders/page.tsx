"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Clock,
  ChevronDown,
  Search,
  Filter,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Download,
  Eye,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  TruckIcon,
  XCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import MainLayout from "@/components/main-layout";
import PageHeader from "@/components/page-header";

// Type definitions
type OrderStatus =
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  estimatedDelivery?: string;
}

// Status badge component
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const statusConfig = {
    processing: {
      color:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500",
      icon: <Clock className="h-3.5 w-3.5 mr-1" />,
    },
    shipped: {
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
      icon: <TruckIcon className="h-3.5 w-3.5 mr-1" />,
    },
    delivered: {
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
      icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
    },
    cancelled: {
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
      icon: <XCircle className="h-3.5 w-3.5 mr-1" />,
    },
    returned: {
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500",
      icon: <RefreshCw className="h-3.5 w-3.5 mr-1" />,
    },
  };

  return (
    <Badge
      variant="outline"
      className={`flex items-center ${statusConfig[status].color}`}
    >
      {statusConfig[status].icon}
      <span className="capitalize">{status}</span>
    </Badge>
  );
};

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: "ORD-39285",
    date: "2025-04-02",
    status: "delivered",
    total: 1249.98,
    items: [
      {
        id: "PROD-1",
        name: "Premium Leather Crossbody Bag",
        price: 699.99,
        quantity: 1,
        image: "/crossbag.webp",
        color: "Tan",
      },
      {
        id: "PROD-2",
        name: "Wireless Noise Cancelling Headphones",
        price: 549.99,
        quantity: 1,
        image: "/headphone.webp",
        color: "Black",
      },
    ],
    trackingNumber: "UPS-12345678901",
    shippingAddress: {
      name: "John Smith",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
    estimatedDelivery: "Delivered on April 5, 2025",
  },
  {
    id: "ORD-38976",
    date: "2025-03-28",
    status: "shipped",
    total: 1899.99,
    items: [
      {
        id: "PROD-3",
        name: "Ultra HD Smart TV 55-inch",
        price: 1899.99,
        quantity: 1,
        image: "/LG-TV.jpeg",
      },
    ],
    trackingNumber: "FEDEX-98765432109",
    shippingAddress: {
      name: "John Smith",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
    estimatedDelivery: "Expected delivery on April 12, 2025",
  },
  {
    id: "ORD-38542",
    date: "2025-03-15",
    status: "processing",
    total: 3499.99,
    items: [
      {
        id: "PROD-4",
        name: "Galaxy S25 Ultra Smartphone",
        price: 1499.99,
        quantity: 1,
        image: "/GalaxyS25Ultra.jpeg",
        color: "Phantom Black",
      },
      {
        id: "PROD-5",
        name: "MacBook Pro 14-inch",
        price: 1999.99,
        quantity: 1,
        image: "/macbook.jpeg",
      },
    ],
    shippingAddress: {
      name: "John Smith",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
    estimatedDelivery: "Processing - Est. delivery in 5-7 days",
  },
  {
    id: "ORD-37298",
    date: "2025-02-20",
    status: "cancelled",
    total: 499.95,
    items: [
      {
        id: "PROD-6",
        name: "Designer Silk Scarf",
        price: 499.95,
        quantity: 1,
        image: "/scarf.jpg",
        color: "Multicolor",
      },
    ],
    shippingAddress: {
      name: "John Smith",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Simulate fetching orders
  useEffect(() => {
    const fetchOrders = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setOrders(mockOrders);
        setIsLoading(false);
      }, 1000);
    };

    fetchOrders();
  }, []);

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handler for opening order details
  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const ordersContent = (
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
              My Orders
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            View and manage all your orders in one place
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by order ID or product"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 border-indigo-200 dark:border-violet-800/40 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 border-indigo-200 dark:border-violet-800/40 bg-white dark:bg-black/20 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Select defaultValue="newest">
              <SelectTrigger className="w-full sm:w-36 border-indigo-200 dark:border-violet-800/40 bg-white dark:bg-black/20 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Amount</SelectItem>
                <SelectItem value="lowest">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4 mt-2">
          {isLoading ? (
            // Loading skeletons
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="border border-indigo-100 dark:border-violet-800/30 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex flex-col gap-4 w-full">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Skeleton className="h-6 w-24" />
                          <Skeleton className="h-6 w-28" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex gap-3">
                            <Skeleton className="h-16 w-16 rounded-md" />
                            <div className="flex flex-col gap-2 flex-1">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-4 w-1/2" />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="h-9 w-28" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : filteredOrders.length > 0 ? (
            // Actual orders
            filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-indigo-100 dark:border-violet-800/30 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4 md:p-6">
                  <div className="flex flex-col gap-4">
                    {/* Order header */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-indigo-600 dark:text-violet-400" />
                        <h3 className="font-medium text-lg">{order.id}</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(order.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>

                    {/* Order items preview */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium line-clamp-2">
                              {item.name}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Qty: {item.quantity}{" "}
                              {item.color && `• ${item.color}`}{" "}
                              {item.size && `• Size ${item.size}`}
                            </span>
                            <span className="text-sm font-medium">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="flex items-center text-indigo-600 dark:text-violet-400 text-sm">
                          +{order.items.length - 2} more items
                        </div>
                      )}
                    </div>

                    {/* Order footer */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                      <div className="text-base font-semibold">
                        Total:{" "}
                        <span className="text-indigo-600 dark:text-violet-400">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleOrderClick(order)}
                        variant="outline"
                        className="border-indigo-200 dark:border-violet-800/50 bg-white/80 dark:bg-black/20 hover:bg-indigo-50 dark:hover:bg-violet-900/30 text-indigo-600 dark:text-violet-400"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            // No orders found
            <div className="text-center py-12 border border-dashed border-indigo-200 dark:border-violet-800/30 rounded-xl bg-indigo-50/50 dark:bg-violet-900/10">
              <Package className="h-12 w-12 mx-auto text-indigo-400 dark:text-violet-500 mb-3 opacity-80" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                No orders found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters or search term"
                  : "You haven't placed any orders yet"}
              </p>
              <Button
                variant="default"
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-violet-600 dark:hover:bg-violet-700 text-white"
              >
                Start Shopping
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-indigo-600 dark:text-violet-400" />
                Order {selectedOrder.id}
              </DialogTitle>
              <DialogDescription>
                Placed on{" "}
                {new Date(selectedOrder.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Order Status */}
              <div className="bg-indigo-50 dark:bg-violet-900/20 rounded-lg p-4">
                <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">
                  ORDER STATUS
                </h4>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={selectedOrder.status} />
                    {selectedOrder.estimatedDelivery && (
                      <span className="text-sm">
                        {selectedOrder.estimatedDelivery}
                      </span>
                    )}
                  </div>
                  {selectedOrder.trackingNumber &&
                    selectedOrder.status !== "cancelled" && (
                      <Button
                        variant="link"
                        size="sm"
                        className="text-indigo-600 dark:text-violet-400 p-0 h-auto"
                      >
                        Track Package ({selectedOrder.trackingNumber})
                      </Button>
                    )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-3">
                  ORDER ITEMS
                </h4>
                <div className="border border-indigo-100 dark:border-violet-800/30 rounded-lg overflow-hidden divide-y divide-indigo-100 dark:divide-violet-800/30">
                  {selectedOrder.items.map((item, index) => (
                    <div key={item.id} className="flex p-4 gap-4">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col flex-1 justify-between">
                        <div>
                          <h5 className="font-medium mb-1">{item.name}</h5>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                            {item.color && <span>Color: {item.color}</span>}
                            {item.size && <span>Size: {item.size}</span>}
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-medium">
                            ${item.price.toFixed(2)}
                          </span>
                          <div className="flex gap-2">
                            {selectedOrder.status === "delivered" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 text-xs border-indigo-200 dark:border-violet-800/50"
                                >
                                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                                  Return
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 text-xs border-indigo-200 dark:border-violet-800/50"
                                >
                                  <Star className="h-3.5 w-3.5 mr-1" />
                                  Review
                                </Button>
                              </>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs border-indigo-200 dark:border-violet-800/50"
                            >
                              Buy Again
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Shipping Information */}
                <div>
                  <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-3">
                    SHIPPING ADDRESS
                  </h4>
                  <div className="border border-indigo-100 dark:border-violet-800/30 rounded-lg p-4 bg-white dark:bg-gray-900">
                    <p className="font-medium">
                      {selectedOrder.shippingAddress.name}
                    </p>
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>
                      {selectedOrder.shippingAddress.city},{" "}
                      {selectedOrder.shippingAddress.state}{" "}
                      {selectedOrder.shippingAddress.zip}
                    </p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Payment Summary */}
                <div>
                  <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-3">
                    PAYMENT SUMMARY
                  </h4>
                  <div className="border border-indigo-100 dark:border-violet-800/30 rounded-lg p-4 bg-white dark:bg-gray-900">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>
                          $
                          {selectedOrder.items
                            .reduce(
                              (acc, item) => acc + item.price * item.quantity,
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${(selectedOrder.total * 0.08).toFixed(2)}</span>
                      </div>
                      <Separator className="my-2 bg-indigo-100 dark:bg-violet-800/30" />
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span className="text-indigo-600 dark:text-violet-400">
                          ${selectedOrder.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3">
              {selectedOrder.status === "processing" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/20 w-full sm:w-auto"
                    >
                      Cancel Order
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will cancel your
                        entire order.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Go Back</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700">
                        Yes, Cancel Order
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              <Button
                variant="outline"
                className="border-indigo-200 dark:border-violet-800/50 hover:bg-indigo-50 dark:hover:bg-violet-900/30 w-full sm:w-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>

              <Button
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-violet-600 dark:hover:bg-violet-700 text-white w-full sm:w-auto"
                onClick={() => setShowOrderDetails(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );

  return (
    <>
      <PageHeader
        title="My Orders"
        description="View and manage your purchase history"
        backgroundImage="/crossbag.webp"
      />
      <MainLayout hideShopCategory={true}>{ordersContent}</MainLayout>
    </>
  );
}
