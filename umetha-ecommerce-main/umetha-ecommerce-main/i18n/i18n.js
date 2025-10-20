import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import languages metadata
import languagesData from './languages.json';

// Basic i18n configuration that works on both server and client
const initI18n = () => {
  i18n
    .use(initReactI18next)
    .init({
      // Fallback language
      fallbackLng: 'en',
      
      // Debug mode in development
      debug: process.env.NODE_ENV === 'development',

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

      // Namespace configuration
      defaultNS: 'translation',
      ns: ['translation'],

      // Preload translations for SSR
      resources: {
        en: {
          translation: require('../locales/en/translation.json')
        },
        es: {
          translation: require('../locales/es/translation.json')
        }
      }
    });
};

// Initialize i18n
initI18n();

// Export languages data for use in components
export const languages = languagesData.languages;

export default i18n;
