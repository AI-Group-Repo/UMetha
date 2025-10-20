"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader, ArrowRight, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslation } from 'react-i18next';

interface SuggestionsProps {
  query: string;
  onSelect: (suggestion: string) => void;
  className?: string;
  onClose?: () => void;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  images?: string[];
  category?: {
    name: string;
  };
}

export default function SearchSuggestions({
  query,
  onSelect,
  className = "",
  onClose,
}: SuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [popularSearches] = useState([
    "Nike Shoes",
    "Wireless Headphones",
    "Designer Handbags",
    "Smart Watches",
    "Bluetooth Speakers",
    "Smart Home Devices",
    "Smart Phones",
    "Smart TVs",
    "Smart Watches",
    "Smart Home Devices",
    "Smart Home Devices",
    "T-Shirts",
    "Jeans",
    "Dresses",
    "Shoes",
    "Bags",
    "Watches",
    "Jewelry",
    "Sunglasses",
    "Hats",
    "Gloves",
    "Scarves",
    "Belts",
    "Wallets",
    "Jewelry",
    "Sunglasses",
    "Hats",
    "Gloves",
    "Scarves",
    "Belts",
    "Wallets",
    "Jewelry",
    "Sunglasses",
    "Hats",
    "Gloves",
    "Scarves",
    "Belts",
    "Wallets",
    "Jewelry",
    "Sunglasses",
    "Hats",
    "Gloves",
    "Scarves",
    "Belts",
    "Wallets",
    "Jewelry",
    "Sunglasses",
    "Hats",
    "Gloves",
    "Scarves",
    "Belts",
    "Wallets",
    "Jewelry",
    "Sunglasses",
    "Hats",
    "Gloves",
    "Scarves",
    "Belts",
    "Wallets",
    "Jewelry",
    "Sunglasses",
    "Hats",
    "Gloves",
    "Scarves",
    "Belts",
    "Wallets",
    "Jewelry",
    "Sunglasses",
    "Laptops",
    "Desktops",
    "Printers",
    "Scanners",
    "Projectors",
    "Speakers",
    "Microphones",
    "Headphones",
    ,
  ]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 1) {
        setSuggestions([]);
        setCategories([]);
        return;
      }

      setLoading(true);
      try {
        // Use regular search for now
        const response = await fetch(
          `/api/search/products?q=${query}&limit=8&source=prisma`
        );
        const data = await response.json();

        if (data.status === "success") {
          setSuggestions(data.data.products || []);
        } else {
          setSuggestions([]);
        }

        // Also fetch category suggestions
        const categoriesResponse = await fetch(`/api/categories?q=${query}&limit=3`);
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.status === "success") {
          setCategories(categoriesData.data.categories || []);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search to avoid too many requests - reduced delay for better UX
    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    onSelect(suggestion);
    if (onClose) onClose();
  };

  // Handle product click
  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
    if (onClose) onClose();
  };

  // Handle view all results
  const handleViewAllResults = () => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
    if (onClose) onClose();
  };

  // Handle category click
  const handleCategoryClick = (categoryName: string) => {
    router.push(`/search?q=${encodeURIComponent(categoryName)}&category=${encodeURIComponent(categoryName)}`);
    if (onClose) onClose();
  };

  if (query.trim().length < 2) {
    return (
      <div
        className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg ${className} p-4`}
      >
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          {t("search.popular_searches")}
        </h4>
        <div className="space-y-2">
          {popularSearches.map((item) => (
            <button
              key={item}
              onClick={() => handleSuggestionClick(item)}
              className="flex items-center gap-2 w-full text-left p-2 hover:bg-indigo-50 dark:hover:bg-violet-900/20 rounded-md text-sm transition-colors"
            >
              <Search
                size={16}
                className="text-indigo-500 dark:text-violet-400"
              />
              <span>{item}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg ${className} p-4`}
    >
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader
            size={20}
            className="animate-spin text-indigo-500 dark:text-violet-400"
          />
        </div>
      ) : (
        <>
          {(suggestions.length > 0 || categories.length > 0) ? (
            <>
              {/* Category Suggestions */}
              {categories.length > 0 && (
                <>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    {t("search.categories")}
                  </h4>
                  <div className="space-y-2 mb-4">
                    {categories.map((category) => (
                      <button
                        key={category.id || category.name}
                        onClick={() => handleCategoryClick(category.name)}
                        className="flex items-center gap-2 w-full text-left p-2 hover:bg-indigo-50 dark:hover:bg-violet-900/20 rounded-md text-sm transition-colors"
                      >
                        <Search
                          size={16}
                          className="text-indigo-500 dark:text-violet-400"
                        />
                        <span>{category.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Product Suggestions */}
              {suggestions.length > 0 && (
                <>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    {t("search.product_suggestions")}
                  </h4>
                  <div className="space-y-2 mb-4">
                    {suggestions.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="flex items-center gap-3 w-full text-left p-2 hover:bg-indigo-50 dark:hover:bg-violet-900/20 rounded-md transition-colors"
                      >
                        <div className="relative w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                            />
                          ) : product.images && product.images.length > 0 ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Search size={16} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {product.category?.name || ""}
                            <span className="ml-2 font-medium text-indigo-600 dark:text-violet-400">
                              ${product.price.toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button
                onClick={handleViewAllResults}
                className="w-full text-center text-sm text-indigo-600 dark:text-violet-400 font-medium hover:text-indigo-700 dark:hover:text-violet-300 flex items-center justify-center gap-1 p-2"
              >
                {t("search.view_all_results")}
                <ArrowRight size={14} />
              </button>
            </>
          ) : (
            <div className="py-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("search.no_suggestions_found")} &quot;{query}&quot;
              </p>
              <button
                onClick={handleViewAllResults}
                className="w-full text-center text-sm text-indigo-600 dark:text-violet-400 font-medium hover:text-indigo-700 dark:hover:text-violet-300 flex items-center justify-center gap-1 p-2 mt-2"
              >
                {t("search.search_for")} &quot;{query}&quot;
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
