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
import { cookies } from "next/headers";
import { AuthProvider } from "@/context/auth-context";
import { ProductModalProvider } from "@/context/product-modal-context";
import ProductTryOnModal from "@/components/product-tryon-modal";
import ClientI18nProvider from "@/components/client-i18n-provider";

const geist = Geist({ subsets: ["latin"] });

// Helper function to get translations for metadata
async function getMetadataTranslations(): Promise<{ title: string; description: string }> {
  const headersList = await headers();
  const cookieStore = await cookies();
  
  // Try to get language from cookie first, then from Accept-Language header
  const langCookie = cookieStore.get("i18nextLng");
  const acceptLanguage = headersList.get("accept-language");
  
  let lang = "en"; // default to English
  
  if (langCookie?.value) {
    lang = langCookie.value.split("-")[0]; // Extract base language code
  } else if (acceptLanguage) {
    // Parse Accept-Language header to get preferred language
    const preferredLang = acceptLanguage.split(",")[0]?.split("-")[0];
    if (preferredLang) {
      lang = preferredLang;
    }
  }
  
  // Load translation file
  try {
    // Dynamic import based on language
    const translation = await import(`@/locales/${lang}/translation.json`);
    
    // JSON imports return the object as default export
    const trans = translation.default || translation;
    
    return {
      title: trans["metadata.title"] || "UMetha - Premium Fashion & Lifestyle",
      description: trans["metadata.description"] || "Shop the latest trends in fashion, accessories, and lifestyle products."
    };
  } catch (error) {
    // Fallback to English if translation file doesn't exist
    const enTranslation = await import("@/locales/en/translation.json");
    const enTrans = enTranslation.default || enTranslation;
    return {
      title: enTrans["metadata.title"] || "UMetha - Premium Fashion & Lifestyle",
      description: enTrans["metadata.description"] || "Shop the latest trends in fashion, accessories, and lifestyle products."
    };
  }
}

// Generate metadata dynamically based on user's language
export async function generateMetadata(): Promise<Metadata> {
  const translations = await getMetadataTranslations();
  
  return {
    title: translations.title,
    description: translations.description,
    generator: "v0.dev",
  };
}

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
