"use client";
import {
  DollarSign,
  ShoppingBag,
  Users,
  BarChart2,
  Settings,
  Star,
  Truck,
  MessageSquare,
  Home,
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  PieChart,
  LayoutDashboard,
  Shield,
  CircleUser,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      items: [
        {
          name: "Overview",
          href: "/dashboard/admin",
          icon: LayoutDashboard,
        },
        {
          name: "Analytics",
          href: "/dashboard/admin/analytics",
          icon: PieChart,
        },
        {
          name: "Command Center",
          href: "/dashboard/admin/management",
          icon: Settings,
        },
      ],
    },
    {
      name: "Management",
      items: [
        { name: "Users", href: "/dashboard/admin/users", icon: Users },
        {
          name: "Products",
          href: "/dashboard/admin/products",
          icon: ShoppingBag,
        },
        { name: "Orders", href: "/dashboard/admin/orders", icon: DollarSign },
        { name: "Logistics", href: "/dashboard/admin/logistics", icon: Truck },
      ],
    },
    {
      name: "Partnerships",
      items: [
        {
          name: "Influencers",
          href: "/dashboard/admin/influencers",
          icon: Star,
        },
        { name: "Sellers", href: "/dashboard/admin/sellers", icon: CircleUser },
      ],
    },
    {
      name: "Marketing",
      items: [
        {
          name: "Campaigns",
          href: "/dashboard/admin/campaigns",
          icon: MessageSquare,
        },
        {
          name: "Calendar",
          href: "/dashboard/admin/calendar",
          icon: Calendar,
        },
      ],
    },
    {
      name: "Configuration",
      items: [
        {
          name: "Settings",
          href: "/dashboard/admin/settings",
          icon: Settings,
        },
        {
          name: "Security",
          href: "/dashboard/admin/security",
          icon: Shield,
        },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300 ease-in-out flex flex-col",
          sidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800 justify-between">
          <div className="flex items-center">
            <Image
              src="/Logo.png"
              alt="UMetha Logo"
              width={40}
              height={40}
              className="rounded"
            />
            {!sidebarCollapsed && (
              <h1 className="ml-3 text-xl font-bold text-indigo-600 dark:text-indigo-400">
                UMetha Control
              </h1>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className={cn("px-4 py-2", !sidebarCollapsed && "mb-2")}>
          {!sidebarCollapsed ? (
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input placeholder="Search..." className="pl-8" />
            </div>
          ) : (
            <Button variant="ghost" size="icon" className="w-full h-10">
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>

        <nav
          className={cn(
            "flex-1 overflow-auto p-4",
            sidebarCollapsed ? "space-y-4" : "space-y-6"
          )}
        >
          {navigation.map((section) => (
            <div key={section.name} className="space-y-2">
              {!sidebarCollapsed && (
                <h3 className="px-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {section.name}
                </h3>
              )}
              <div
                className={cn(
                  "space-y-1",
                  sidebarCollapsed && "flex flex-col items-center"
                )}
              >
                {section.items.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    size={sidebarCollapsed ? "icon" : "default"}
                    className={cn(
                      "w-full",
                      sidebarCollapsed ? "h-10 w-10 p-0" : "justify-start"
                    )}
                    asChild
                  >
                    <Link
                      href={item.href}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <item.icon
                        className={cn("h-4 w-4", !sidebarCollapsed && "mr-2")}
                      />
                      {!sidebarCollapsed && item.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            variant="outline"
            size={sidebarCollapsed ? "icon" : "default"}
            className={cn(
              "w-full",
              sidebarCollapsed ? "h-10 w-10 p-0" : "justify-start"
            )}
            asChild
          >
            <Link
              href="/"
              title={sidebarCollapsed ? "Return to Website" : undefined}
            >
              <Home className={cn("h-4 w-4", !sidebarCollapsed && "mr-2")} />
              {!sidebarCollapsed && "Return to Website"}
            </Link>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center px-6 sticky top-0 z-10">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              UMetha Control Center
            </h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                A
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-950">
          {children}
        </main>
      </div>
    </div>
  );
}
