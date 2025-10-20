"use client";
import React, { useState, useEffect, memo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Package,
  Menu,
  X,
  Sun,
  Moon,
  Clock,
  Ticket,
  Heart,
  HelpCircle,
  Settings,
  ShoppingBag,
  Facebook,
  Instagram,
  Twitter,
  CreditCard,
  Mail,
  Phone,
  ChevronDown,
  MapPin,
  Globe,
  Truck,
  Camera,
  Smartphone,
  ArrowRight,
  Check,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import SideNavigation from "./side-navigation";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Footer from "@/components/footer";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useCart } from "@/context/cart-context";
import FittingRoomSidebar from "@/components/fitting-room-sidebar";
import RoomVisualizerSidebar from "@/components/room-visualizer-sidebar";
import { ImageSearchDialog } from "./image-search-dialog";
import SearchSuggestions from "./search-suggestions";
import { useAuth } from "@/context/auth-context";
import LanguageSwitcher from "@/components/language-switcher";
import { useTranslation } from 'react-i18next';

// Removing the Language type and languages array as they're now imported from language-context.tsx

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface MainLayoutProps {
  children: React.ReactNode;
  hideShopCategory?: boolean;
  hideFittingRoom?: boolean;
  hideRoomVisualizer?: boolean;
}

export default function MainLayout({
  children,
  hideShopCategory = false,
  hideFittingRoom = false,
  hideRoomVisualizer = false,
}: MainLayoutProps) {
  // All useState hooks first
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  
  // All useRef hooks
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // All context hooks
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  
  // Safe translation hook with fallback
  const translation = useTranslation();
  const t = translation.t || ((key: string) => key);
  
  // Router hook
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = debounce(() => {
      setScrolled(window.scrollY > 20);
    }, 10);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // Add a function to handle sign out
  const handleSignOut = async () => {
    await signOut();
    router.push("/");

    // Show toast notification if you have one
    // toast({
    //   title: "Signed out successfully",
    //   description: "You have been signed out of your account.",
    // });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <header
        className={`fixed top-0 inset-x-0 z-50 bg-background/95 backdrop-blur-md shadow-md transition-all duration-300 ${
          scrolled ? "h-20" : "h-20"
        }`}
      >
        <div className="container mx-auto h-full px-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex flex-col items-center hover:opacity-90 transition text-center"
          >
            <Image
              src="/Logo.png"
              alt="UMetha Logo"
              width={160}
              height={40}
              priority={true}
              className="object-contain mb-5"
            />
            <p className="text-[0.6rem] font-bold uppercase tracking-wide bg-gradient-to-r from-purple-600 to-blue-950 text-transparent bg-clip-text -mt-12">
              BILLIONAIRE EXPERIENCE
            </p>
          </Link>

          <div className="flex-1 max-w-2xl hidden md:flex items-center relative mx-4">
            <motion.div
              initial={{ width: "100%" }}
              whileHover={{
                width: "102%",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              className="w-full relative"
            >
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder={t('search.placeholder')}
                  className="pl-12 pr-36 py-2 rounded-full border border-indigo-200 dark:border-violet-800/40 bg-white/90 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  ref={searchInputRef}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400 dark:text-violet-400" />

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-indigo-100 dark:bg-violet-900/40 hover:bg-indigo-200 dark:hover:bg-violet-800/60 transition-all group"
                        onClick={() => setIsImageSearchOpen(true)}
                      >
                        <Camera className="h-4 w-4 text-indigo-500 dark:text-violet-300" />
                        <span className="text-xs font-medium text-indigo-600 dark:text-violet-300">
                          {t('search.image')}
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-indigo-600 text-white dark:bg-violet-700"
                    >
                      <p>{t('search.upload_image_tooltip')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <button type="submit" className="sr-only" aria-label={t('common.search')}>
                  {t('common.search')}
                </button>
              </form>
            </motion.div>

            {/* Search Suggestions */}
            {showSuggestions && searchQuery.trim() && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 z-50 mt-2"
              >
                <SearchSuggestions
                  query={searchQuery}
                  onSelect={handleSuggestionSelect}
                  onClose={() => setShowSuggestions(false)}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            <motion.div whileHover={{ scale: 1.1 }} className="relative">
              <Link
                href="/cart"
                className="group relative flex items-center justify-center w-10 h-10 rounded-full border border-indigo-200 dark:border-violet-800/50 bg-white/80 dark:bg-black/20 hover:bg-indigo-50 dark:hover:bg-violet-900/30"
              >
                <ShoppingCart className="h-5 w-5 text-indigo-600 dark:text-violet-400 group-hover:text-indigo-700 dark:group-hover:text-violet-300 transition" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </motion.div>

            <div className="hidden md:flex items-center gap-3 relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex items-center justify-center w-10 h-10 rounded-full border border-indigo-200 dark:border-violet-800/50 bg-white/80 dark:bg-black/20 hover:bg-indigo-50 dark:hover:bg-violet-900/30"
                    >
                      <User className="h-5 w-5 text-indigo-600 dark:text-violet-400" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[280px] p-0 bg-white dark:bg-gray-900 border border-indigo-100 dark:border-violet-800/30 shadow-lg rounded-xl overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    <div className="text-center space-y-2">
                      <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          {user ? (
                            user.user_metadata?.avatar_url ? (
                              <img
                                src={user.user_metadata.avatar_url}
                                alt={user.user_metadata.full_name || user.email}
                                className="h-16 w-16 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-full bg-indigo-300 dark:bg-violet-700 flex items-center justify-center text-2xl font-bold text-white">
                                {(
                                  user.user_metadata?.full_name ||
                                  user.email ||
                                  ""
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )
                          ) : (
                            <User className="h-8 w-8 text-white" />
                          )}
                        </div>
                      </div>
                      <div>
                        {user ? (
                          <>
                            <h4 className="font-semibold">
                              {user.user_metadata?.full_name ||
                                user.email?.split("@")[0]}
                            </h4>
                            <p className="text-xs text-white/80">
                              {user.email}
                            </p>
                          </>
                        ) : (
                          <>
                            <h4 className="font-semibold">
                              {t('common.welcome')}
                            </h4>
                            <p className="text-xs text-white/80">
                              {t('common.access_account')}
                            </p>
                          </>
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-2 pt-1">
                        {!user ? (
                          <>
                            <Link href="/signin">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 text-xs font-medium bg-white text-indigo-700 hover:bg-white/90"
                              >
                                {t('common.sign_in')}
                              </Button>
                            </Link>
                            <Link href="/signup">
                              <Button
                                size="sm"
                                className="h-8 text-xs font-medium bg-indigo-800/40 hover:bg-indigo-800/60 text-white"
                              >
                                {t('common.sign_up')}
                              </Button>
                            </Link>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleSignOut}
                            className="h-8 text-xs font-medium bg-white text-indigo-700 hover:bg-white/90"
                          >
                            {t('common.sign_out')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Hamburger Button for Right Sidebar */}
            <motion.div whileHover={{ scale: 1.1 }} className="relative">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-200 dark:border-violet-800/50 bg-white/80 dark:bg-black/20 hover:bg-indigo-50 dark:hover:bg-violet-900/30"
                onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
              >
                <Menu
                  size={18}
                  className="text-indigo-600 dark:text-violet-400"
                />
                <span className="text-sm font-medium text-indigo-600 dark:text-violet-400">
                  {t('common.menu')}
                </span>
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
      {(!hideFittingRoom || !hideRoomVisualizer) && (
        <motion.aside
          key="sidebar"
          initial={false}
          animate={{
            width: 210,
          }}
          className="relative h-[calc(100vh-80px)] shrink-0 bg-background border-r z-40 hidden lg:block"
        >
          <div className="sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto">
            <div className="space-y-4 p-2">
              {!hideFittingRoom && <FittingRoomSidebar />}
              {!hideRoomVisualizer && <RoomVisualizerSidebar />}
            </div>
          </div>
        </motion.aside>
      )}

        <main className="flex-1 pt-[80px] max-w-[1400px] mx-auto">
          <motion.div
            className="p-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>

        {/* Right Sidebar */}
        <AnimatePresence>
          {isRightSidebarOpen && (
            <>
              {/* Background Blur Overlay */}
              <motion.div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsRightSidebarOpen(false)} // Close sidebar when clicking outside
              />

              {/* Sidebar Content */}
              <motion.div
                className="fixed top-20 right-0 h-full w-60 bg-background border-l z-50 p-2"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-2 border-b pb-2">
                  <h2 className="text-lg font-bold text-indigo-600 dark:text-violet-400">
                    {t('navigation.shopping_categories')}
                  </h2>
                  <button
                    onClick={() => setIsRightSidebarOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={t('common.close')}
                  >
                    <X size={20} />
                  </button>
                </div>
                <SideNavigation onClose={() => setIsRightSidebarOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <Footer />

      {/* Image Search Dialog */}
      <ImageSearchDialog
        isOpen={isImageSearchOpen}
        onClose={() => setIsImageSearchOpen(false)}
      />
    </div>
  );
}
