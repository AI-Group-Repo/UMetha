"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { languages } from '@/i18n/i18n-client';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Filter languages based on search term
  const filteredLanguages = languages.filter(lang =>
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageChange = (languageCode: string) => {
    if (isClient) {
      i18n.changeLanguage(languageCode);
      localStorage.setItem('i18nextLng', languageCode);
      setIsOpen(false);
      
      // Update document direction for RTL languages
      const isRTL = ["ar", "he", "fa", "ur"].includes(languageCode);
      if (isRTL) {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = languageCode;
      } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = languageCode;
      }
    }
  };

  if (!isClient) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
        <Globe className="w-4 h-4" />
        <span className="text-lg">🇺🇸</span>
        <span className="hidden sm:block">English</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        aria-label={t('common.language')}
      >
        <Globe className="w-4 h-4" />
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:block">{currentLanguage.nativeName}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 z-20 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-hidden">
            {/* Search input */}
            <div className="p-3 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            {/* Language list */}
            <div className="py-1 max-h-64 overflow-y-auto">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors ${
                      i18n.language === language.code ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{language.flag}</span>
                      <div className="flex flex-col">
                        <span className="font-medium">{language.nativeName}</span>
                        <span className="text-xs text-gray-500">{language.code.toUpperCase()}</span>
                      </div>
                    </div>
                    {i18n.language === language.code && (
                      <Check className="w-4 h-4 text-indigo-600" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500 text-center">
                  No languages found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
