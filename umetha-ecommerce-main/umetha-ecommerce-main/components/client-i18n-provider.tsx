"use client";

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

interface ClientI18nProviderProps {
  children: React.ReactNode;
}

export default function ClientI18nProvider({ children }: ClientI18nProviderProps) {
  
  const [isClient, setIsClient] = useState(false);
  const [i18n, setI18n] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import client-side i18n only on client side
    import('@/i18n/i18n-client').then((module) => {
      const i18nInstance = module.default;
      setI18n(i18nInstance);
      
      // Wait for i18n to be ready
      if (i18nInstance.isInitialized) {
        setIsReady(true);
      } else {
        i18nInstance.on('initialized', () => {
          setIsReady(true);
        });
      }
    });
  }, []);

  // Don't render anything on the server side or until i18n is ready
  if (!isClient || !i18n || !isReady) {
    return <>{children}</>;
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
