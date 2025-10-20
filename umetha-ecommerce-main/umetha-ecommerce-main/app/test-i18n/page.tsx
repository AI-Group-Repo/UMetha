"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/language-switcher';

export default function TestI18nPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {t('welcome')}
            </h1>
            <LanguageSwitcher />
          </div>
          
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                {t('description')}
              </h2>
              <p className="text-blue-700">
                This page demonstrates the multilingual support with 30 languages.
                Try switching languages using the dropdown above!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  Common Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                    {t('common.addToCart')}
                  </button>
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                    {t('common.checkout')}
                  </button>
                  <button className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                    {t('common.search')}
                  </button>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">
                  Navigation
                </h3>
                <div className="space-y-2">
                  <div className="text-purple-700">{t('common.home')}</div>
                  <div className="text-purple-700">{t('common.about')}</div>
                  <div className="text-purple-700">{t('common.contact')}</div>
                  <div className="text-purple-700">{t('common.profile')}</div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                Language Information
              </h3>
              <p className="text-yellow-700">
                Current language: <strong>{t('common.language')}</strong>
              </p>
              <p className="text-yellow-700 text-sm mt-2">
                This setup includes 30 languages with automatic detection, 
                RTL support for Arabic, Hebrew, Persian, and Urdu, 
                and dynamic loading of translation files.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
