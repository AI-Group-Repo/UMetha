"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Camera,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import Footer from "@/components/footer";
import SideNavigation from "./side-navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import FittingRoomSidebar from "@/components/fitting-room-sidebar";
import RoomVisualizerSidebar from "@/components/room-visualizer-sidebar";
import { ImageSearchDialog } from "./image-search-dialog";
import SearchSuggestions from "./search-suggestions";
import LanguageSwitcher from "@/components/language-switcher";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  // Handle search
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

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-white dark:from-gray-950 dark:to-black text-foreground overflow-x-hidden">
      {/* Header */}
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-md border-b border-indigo-100 dark:border-gray-800",
          scrolled ? "bg-white/90 shadow-md dark:bg-gray-900/80" : "bg-transparent"
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-3 md:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/Logo.png"
              alt="UMetha Logo"
              width={140}
              height={40}
              className="object-contain transition-transform group-hover:scale-105"
              priority
            />
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hidden sm:block">
              Billionaire Experience
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 mx-6 relative">
            <motion.form
              onSubmit={handleSearch}
              whileHover={{ scale: 1.02 }}
              className="relative w-full"
            >
              <Input
                type="text"
                placeholder={t("search.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                ref={searchInputRef}
                className="pl-11 pr-36 py-2 rounded-full border border-indigo-200 dark:border-violet-800/40 bg-white/90 dark:bg-black/30 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400 dark:text-violet-400" />

              {/* Image Search Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-violet-900/40 hover:bg-indigo-200 dark:hover:bg-violet-800/60 transition-all"
                      onClick={() => setIsImageSearchOpen(true)}
                    >
                      <Camera className="h-4 w-4 text-indigo-600 dark:text-violet-300" />
                      <span className="text-xs font-medium text-indigo-600 dark:text-violet-300">
                        {t("search.image")}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-indigo-600 text-white dark:bg-violet-700">
                    Upload an image to search
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.form>

            {/* Suggestions */}
            {showSuggestions && searchQuery.trim() && (
              <div ref={suggestionsRef} className="absolute top-full left-0 right-0 mt-2 z-50">
                <SearchSuggestions
                  query={searchQuery}
                  onSelect={handleSuggestionSelect}
                  onClose={() => setShowSuggestions(false)}
                />
              </div>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3 md:gap-4">
            <LanguageSwitcher />

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <Link
                href="/cart"
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/70 dark:bg-black/30 border border-indigo-100 dark:border-violet-800/30 hover:shadow-md transition-all"
              >
                <ShoppingCart className="h-5 w-5 text-indigo-600 dark:text-violet-400" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </motion.div>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 rounded-full border border-indigo-100 dark:border-violet-800/30 bg-white/70 dark:bg-black/30 hover:shadow-md transition-all"
                  >
                    <User className="h-5 w-5 text-indigo-600 dark:text-violet-400" />
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-64 p-0 rounded-xl border border-indigo-100 dark:border-violet-800/30 bg-white dark:bg-gray-900 shadow-lg overflow-hidden"
              >
                <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-center">
                  {user ? (
                    <>
                      <div className="text-lg font-semibold">
                        {user.user_metadata?.full_name || user.email}
                      </div>
                      <Button
                        size="sm"
                        onClick={handleSignOut}
                        className="mt-3 bg-white text-indigo-600 hover:bg-white/90"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm opacity-80">Welcome</p>
                      <div className="flex justify-center gap-2 mt-2">
                        <Link href="/signin">
                          <Button size="sm" className="bg-white text-indigo-600 hover:bg-white/90">
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/signup">
                          <Button size="sm" variant="secondary" className="bg-indigo-800/40 hover:bg-indigo-800/60 text-white">
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Menu Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-100 dark:border-violet-800/30 bg-white/70 dark:bg-black/30 hover:shadow-md transition-all"
            >
              <Menu size={18} className="text-indigo-600 dark:text-violet-400" />
              <span className="text-sm font-medium text-indigo-600 dark:text-violet-400">Menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {!hideFittingRoom && (
          <motion.aside
            initial={false}
            animate={{ width: 220 }}
            className="hidden lg:block h-[calc(100vh-80px)] bg-white/70 dark:bg-gray-900/40 border-r border-indigo-100 dark:border-violet-800/30"
          >
            <div className="p-3 sticky top-[80px] overflow-y-auto">
              <FittingRoomSidebar />
              {!hideRoomVisualizer && <div className="mt-4"><RoomVisualizerSidebar /></div>}
            </div>
          </motion.aside>
        )}

        <main className="flex-1 pt-[80px] max-w-[1400px] mx-auto px-4 md:px-8">
          <motion.div
            className="py-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>

        {/* Right Sidebar */}
        <AnimatePresence>
          {isRightSidebarOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsRightSidebarOpen(false)}
              />
              <motion.div
                className="fixed top-20 right-0 h-full w-64 bg-white dark:bg-gray-900 border-l border-indigo-100 dark:border-violet-800/30 z-50 p-4"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-indigo-600 dark:text-violet-400">
                    Categories
                  </h2>
                  <button
                    onClick={() => setIsRightSidebarOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
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

      {/* Image Search Modal */}
      <ImageSearchDialog isOpen={isImageSearchOpen} onClose={() => setIsImageSearchOpen(false)} />
    </div>
  );
}
