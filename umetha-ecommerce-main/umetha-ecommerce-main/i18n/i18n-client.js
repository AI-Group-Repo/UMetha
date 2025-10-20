import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import languages metadata
import languagesData from './languages.json';

// Import translation files directly
import enTranslation from '../locales/en/translation.json';
import frTranslation from '../locales/fr/translation.json';
import esTranslation from '../locales/es/translation.json';
import deTranslation from '../locales/de/translation.json';
import itTranslation from '../locales/it/translation.json';
import ptTranslation from '../locales/pt/translation.json';
import ruTranslation from '../locales/ru/translation.json';
import jaTranslation from '../locales/ja/translation.json';
import koTranslation from '../locales/ko/translation.json';
import zhTranslation from '../locales/zh/translation.json';
import arTranslation from '../locales/ar/translation.json';
import hiTranslation from '../locales/hi/translation.json';
import bnTranslation from '../locales/bn/translation.json';
import elTranslation from '../locales/el/translation.json';

// Client-side i18n configuration with direct imports
const initClientI18n = () => {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      // Fallback language
      fallbackLng: 'en',
      
      // Debug mode in development
      debug: true,
      
      // Language detection configuration
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
        checkWhitelist: true,
      },

      // Resources configuration with direct imports
      resources: {
        en: { translation: enTranslation },
        fr: { translation: frTranslation },
        es: { translation: esTranslation },
        de: { translation: deTranslation },
        it: { translation: itTranslation },
        pt: { translation: ptTranslation },
        ru: { translation: ruTranslation },
        ja: { translation: jaTranslation },
        ko: { translation: koTranslation },
        zh: { translation: zhTranslation },
        ar: { translation: arTranslation },
        hi: { translation: hiTranslation },
        bn: { translation: bnTranslation },
        el: { translation: elTranslation },
      },

      // Supported languages
      supportedLngs: languagesData.languages.map(lang => lang.code),
      
      // Non-explicit fallback
      nonExplicitSupportedLngs: true,

      // Interpolation configuration
      interpolation: {
        escapeValue: false, // React already does escaping
      },

      // React configuration
      react: {
        useSuspense: false, // Disable suspense to prevent flicker
      },

      // Save missing translations
      saveMissing: false,
      missingKeyHandler: (lng, ns, key, fallbackValue) => {
        console.warn(`Missing translation for key "${key}" in language "${lng}"`);
      },

      // Namespace configuration
      defaultNS: 'translation',
      ns: ['translation'],
    });
};

// Initialize client-side i18n
initClientI18n();

// Add event listeners for debugging
i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
});

i18n.on('loaded', (loaded) => {
  console.log('Translations loaded:', loaded);
});

i18n.on('failedLoading', (lng, ns, msg) => {
  console.error('Failed to load translations:', lng, ns, msg);
});

// Export languages data for use in components
export const languages = languagesData.languages;

// Ensure i18n is ready before exporting
export default i18n;
