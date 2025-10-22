import type React from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "@/lib/polyfills";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/context/cart-context";
import { FollowedInfluencersProvider } from "@/context/followed-influencers-context";
import { Toaster } from "@/components/ui/toaster";
import { headers } from "next/headers";
import { AuthProvider } from "@/context/auth-context";
import { ProductModalProvider } from "@/context/product-modal-context";
import ProductTryOnModal from "@/components/product-tryon-modal";
import ClientI18nProvider from "@/components/client-i18n-provider";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UMetha - Premium Fashion & Lifestyle",
  description:
    "Shop the latest trends in fashion, accessories, and lifestyle products.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Removed unused preload to avoid console warning */}
      </head>
      <body className={geist.className}>
        <ClientI18nProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <CartProvider>
                <FollowedInfluencersProvider>
                  <ProductModalProvider>
                    {children}
                    <ProductTryOnModal />
                  </ProductModalProvider>
                </FollowedInfluencersProvider>
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </ClientI18nProvider>
        <Toaster />
      </body>
    </html>
  );
}
