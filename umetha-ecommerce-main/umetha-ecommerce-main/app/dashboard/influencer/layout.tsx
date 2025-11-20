"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  DollarSign,
  Users,
  FileText,
  Store,
  Settings,
  User,
} from "lucide-react";

export default function InfluencerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    {
      value: "/dashboard/influencer",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      value: "/dashboard/influencer/products",
      label: "Products",
      icon: Package,
    },
    {
      value: "/dashboard/influencer/store",
      label: "Store",
      icon: Store,
    },
    {
      value: "/dashboard/influencer/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      value: "/dashboard/influencer/earnings",
      label: "Earnings",
      icon: DollarSign,
    },
    {
      value: "/dashboard/influencer/customers",
      label: "Customers",
      icon: Users,
    },
    {
      value: "/dashboard/influencer/content",
      label: "Content",
      icon: FileText,
    },
    {
      value: "/dashboard/influencer/profile",
      label: "Profile",
      icon: User,
    },
    {
      value: "/dashboard/influencer/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const getCurrentTab = () => {
    // Match exact path or find the closest match
    const exactMatch = tabs.find((tab) => tab.value === pathname);
    if (exactMatch) return exactMatch.value;

    // Check if pathname starts with any tab value
    const partialMatch = tabs.find((tab) => 
      pathname.startsWith(tab.value) && tab.value !== "/dashboard/influencer"
    );
    return partialMatch?.value || "/dashboard/influencer";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <Tabs value={getCurrentTab()} onValueChange={(value) => router.push(value)}>
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap h-auto p-1 bg-gray-100 dark:bg-gray-800">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = getCurrentTab() === tab.value;
                
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 whitespace-nowrap min-w-fit
                      transition-all duration-200
                      ${isActive 
                        ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Page Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}

