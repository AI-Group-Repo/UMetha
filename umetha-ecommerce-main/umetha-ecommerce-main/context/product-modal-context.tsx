"use client";

import React, { createContext, useContext, useState } from 'react';

interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  images: string[];
  category?: {
    name: string;
    slug: string;
  };
  stock: number;
}

interface ProductModalContextType {
  isOpen: boolean;
  selectedProduct: Product | null;
  openModal: (product: Product) => void;
  closeModal: () => void;
}

const ProductModalContext = createContext<ProductModalContextType | undefined>(undefined);

export function ProductModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedProduct(null);
  };

  return (
    <ProductModalContext.Provider
      value={{
        isOpen,
        selectedProduct,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ProductModalContext.Provider>
  );
}

export function useProductModal() {
  const context = useContext(ProductModalContext);
  if (context === undefined) {
    throw new Error('useProductModal must be used within a ProductModalProvider');
  }
  return context;
}
