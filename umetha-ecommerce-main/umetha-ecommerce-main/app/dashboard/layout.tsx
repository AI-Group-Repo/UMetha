"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  LayoutDashboard,
  ShoppingCart,
  Users,
  Settings,
  HelpCircle,
  TrendingUp,
  Package,
  Store,
  Megaphone,
  Star,
  ShoppingBag,
  UserCircle,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Globe,
  DollarSign,
  Bell,
  Heart,
  Search,
  Calendar,
  FileText,
  Tag,
  MessageSquare,
  Zap,
  Truck,
  AlertCircle,
  Database,
  Layers,
  Map,
  CreditCard,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

// Removed the sidebar logic from DashboardLayout to avoid duplication
// The sidebar in AdminLayout will be retained for the admin dashboard
export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { user, userRole, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main content */}
      <div className="flex-1">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-950 shadow-sm border-b border-gray-200 dark:border-gray-800 h-16 fixed top-0 right-0 left-0 z-10">
          <div className="flex items-center justify-between h-full px-4">
            <div className="flex-1"></div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
                <HelpCircle className="h-5 w-5" />
              </button>
              <div className="border-l border-gray-200 dark:border-gray-800 h-6 mx-2"></div>
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2 hidden sm:block">
                  {user?.email}
                </span>
                <div className="h-8 w-8 rounded-full bg-indigo-600 dark:bg-indigo-800 flex items-center justify-center text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="pt-16 min-h-screen">
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
