"use client";

import React, { useState, useEffect } from 'react';
import { ProductGrid } from '@/components/product-card';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category?: {
    name: string;
    slug: string;
  };
  stock: number;
  translations?: {
    name: string;
    description: string;
    language: string;
  }[];
}

export default function ProductsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        language,
        limit: '24',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory && { categoryId: selectedCategory })
      });

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products || []);
      } else {
        throw new Error(data.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [language, searchQuery, selectedCategory]);

  const handleAddToCart = (productId: string) => {
    // TODO: Implement add to cart functionality
    toast({
      title: "Added to Cart",
      description: "Product has been added to your cart.",
    });
  };

  const handleAddToWishlist = (productId: string) => {
    // TODO: Implement add to wishlist functionality
    toast({
      title: "Added to Wishlist",
      description: "Product has been added to your wishlist.",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {language === 'en' ? 'Our Products' : 
             language === 'es' ? 'Nuestros Productos' :
             language === 'fr' ? 'Nos Produits' :
             language === 'de' ? 'Unsere Produkte' :
             language === 'zh' ? '我们的产品' :
             language === 'hi' ? 'हमारे उत्पाद' :
             language === 'ar' ? 'منتجاتنا' :
             'Our Products'}
          </h1>
          <p className="text-gray-600 text-lg">
            {language === 'en' ? 'Discover amazing products at great prices' :
             language === 'es' ? 'Descubre productos increíbles a precios excelentes' :
             language === 'fr' ? 'Découvrez des produits incroyables à des prix formidables' :
             language === 'de' ? 'Entdecken Sie erstaunliche Produkte zu großartigen Preisen' :
             language === 'zh' ? '以优惠的价格发现令人惊叹的产品' :
             language === 'hi' ? 'बेहतरीन कीमतों पर अद्भुत उत्पादों की खोज करें' :
             language === 'ar' ? 'اكتشف منتجات مذهلة بأسعار رائعة' :
             'Discover amazing products at great prices'}
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder={language === 'en' ? 'Search products...' :
                             language === 'es' ? 'Buscar productos...' :
                             language === 'fr' ? 'Rechercher des produits...' :
                             language === 'de' ? 'Produkte suchen...' :
                             language === 'zh' ? '搜索产品...' :
                             language === 'hi' ? 'उत्पाद खोजें...' :
                             language === 'ar' ? 'البحث عن المنتجات...' :
                             'Search products...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={language === 'en' ? 'All Categories' :
                                        language === 'es' ? 'Todas las Categorías' :
                                        language === 'fr' ? 'Toutes les Catégories' :
                                        language === 'de' ? 'Alle Kategorien' :
                                        language === 'zh' ? '所有类别' :
                                        language === 'hi' ? 'सभी श्रेणियां' :
                                        language === 'ar' ? 'جميع الفئات' :
                                        'All Categories'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{language === 'en' ? 'All Categories' :
                                     language === 'es' ? 'Todas las Categorías' :
                                     language === 'fr' ? 'Toutes les Catégories' :
                                     language === 'de' ? 'Alle Kategorien' :
                                     language === 'zh' ? '所有类别' :
                                     language === 'hi' ? 'सभी श्रेणियां' :
                                     language === 'ar' ? 'جميع الفئات' :
                                     'All Categories'}</SelectItem>
                {/* Add more categories as needed */}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={language === 'en' ? 'Sort by' :
                                        language === 'es' ? 'Ordenar por' :
                                        language === 'fr' ? 'Trier par' :
                                        language === 'de' ? 'Sortieren nach' :
                                        language === 'zh' ? '排序方式' :
                                        language === 'hi' ? 'क्रमबद्ध करें' :
                                        language === 'ar' ? 'ترتيب حسب' :
                                        'Sort by'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">{language === 'en' ? 'Name' :
                                        language === 'es' ? 'Nombre' :
                                        language === 'fr' ? 'Nom' :
                                        language === 'de' ? 'Name' :
                                        language === 'zh' ? '名称' :
                                        language === 'hi' ? 'नाम' :
                                        language === 'ar' ? 'الاسم' :
                                        'Name'}</SelectItem>
                <SelectItem value="price">{language === 'en' ? 'Price' :
                                          language === 'es' ? 'Precio' :
                                          language === 'fr' ? 'Prix' :
                                          language === 'de' ? 'Preis' :
                                          language === 'zh' ? '价格' :
                                          language === 'hi' ? 'कीमत' :
                                          language === 'ar' ? 'السعر' :
                                          'Price'}</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <ProductGrid
            products={products}
            language={language}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            className={viewMode === 'list' ? 'grid-cols-1 max-w-4xl mx-auto' : ''}
          />
        )}
      </div>
    </main>
  );
}
