"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export type Language = {
  code: string;
  name: string;
  flag: string;
  native: string;
};

type LanguageContextType = {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<string, string>;
  t: (key: string) => string;
  isLoading: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Map of country codes to language codes
const countryToLanguageMap: Record<string, string> = {
  US: "en", // United States -> English
  GB: "en", // United Kingdom -> English
  CA: "en", // Canada -> English (could be fr for some regions)
  AU: "en", // Australia -> English
  NZ: "en", // New Zealand -> English
  ES: "es", // Spain -> Spanish
  MX: "es", // Mexico -> Spanish
  AR: "es", // Argentina -> Spanish
  CO: "es", // Colombia -> Spanish
  FR: "fr", // France -> French
  BE: "fr", // Belgium -> French (could be nl for some regions)
  CH: "fr", // Switzerland -> French (could be de/it for some regions)
  DE: "de", // Germany -> German
  AT: "de", // Austria -> German
  IT: "it", // Italy -> Italian
  PT: "pt", // Portugal -> Portuguese
  BR: "pt", // Brazil -> Portuguese
  RU: "ru", // Russia -> Russian
  JP: "ja", // Japan -> Japanese
  KR: "ko", // South Korea -> Korean
  CN: "zh", // China -> Chinese
  TW: "zh", // Taiwan -> Chinese
  SA: "ar", // Saudi Arabia -> Arabic
  AE: "ar", // UAE -> Arabic
  EG: "ar", // Egypt -> Arabic
  IN: "hi", // India -> Hindi (could be en for some regions)
  BD: "bn", // Bangladesh -> Bengali
  PK: "ur", // Pakistan -> Urdu
  ID: "id", // Indonesia -> Indonesian
  MY: "ms", // Malaysia -> Malay
  KE: "sw", // Kenya -> Swahili
  TZ: "sw", // Tanzania -> Swahili
  NG: "en", // Nigeria -> English (could be yo/ha for some regions)
  ZA: "en", // South Africa -> English (could be af for some regions)
  ET: "am", // Ethiopia -> Amharic
  TR: "tr", // Turkey -> Turkish
  VN: "vi", // Vietnam -> Vietnamese
  TH: "th", // Thailand -> Thai
  IR: "fa", // Iran -> Persian
  PL: "pl", // Poland -> Polish
  NL: "nl", // Netherlands -> Dutch
  RO: "ro", // Romania -> Romanian
  GR: "el", // Greece -> Greek
  UA: "uk", // Ukraine -> Ukrainian
  CZ: "cs", // Czech Republic -> Czech
  HU: "hu", // Hungary -> Hungarian
  SE: "sv", // Sweden -> Swedish
  DK: "da", // Denmark -> Danish
  FI: "fi", // Finland -> Finnish
  NO: "no", // Norway -> Norwegian
  IL: "he", // Israel -> Hebrew
  BG: "bg", // Bulgaria -> Bulgarian
  HR: "hr", // Croatia -> Croatian
  RS: "sr", // Serbia -> Serbian
  SK: "sk", // Slovakia -> Slovak
  SI: "sl", // Slovenia -> Slovenian
  EE: "et", // Estonia -> Estonian
  LV: "lv", // Latvia -> Latvian
  LT: "lt", // Lithuania -> Lithuanian
  IE: "ga", // Ireland -> Irish (could be en for most)
  PH: "tl", // Philippines -> Tagalog
  MM: "my", // Myanmar -> Burmese
  KH: "km", // Cambodia -> Khmer
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>({
    code: "en",
    name: "English",
    flag: "🇺🇸",
    native: "English",
  });
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Make loadTranslations a useCallback to prevent recreation on each render
  const loadTranslations = useCallback(async (langCode: string) => {
    setIsLoading(true);
    try {
      console.log(`Loading translations for: ${langCode}`);

      // Using a cache-busting query parameter to prevent browser caching
      const timestamp = new Date().getTime();
      const response = await fetch(
        `/locales/${langCode}/translation.json?v=${timestamp}`
      );

      if (response.ok) {
        const translationData = await response.json();
        setTranslations(translationData);
        console.log(
          `Loaded translations for ${langCode}:`,
          Object.keys(translationData).length
        );
        console.log(
          "Sample translations:",
          Object.entries(translationData).slice(0, 3)
        );
        return;
      } else {
        console.error(
          `Failed to load translations for ${langCode}. Status: ${response.status}`
        );
      }

      // If requested language isn't available, try English
      if (langCode !== "en") {
        console.warn(
          `No translation file found for ${langCode}, using English as fallback`
        );
        const enResponse = await fetch(`/translations/en.json?v=${timestamp}`);
        if (enResponse.ok) {
          const enData = await enResponse.json();
          setTranslations(enData);
          console.log("Using English fallback translations");
          return;
        } else {
          console.error(
            `Failed to load English fallback translations. Status: ${enResponse.status}`
          );
        }
      }

      // If we still don't have translations, use a minimal set of defaults
      console.warn("Failed to load any translations, using defaults");
      const defaultTranslations = {
        "search.placeholder": "Search for products, brands...",
        "search.image": "Search with image",
        "nav.categories": "Shopping Categories",
        "common.explore": "Explore Now",
        "account.welcome": "Welcome!",
        "account.signin": "Sign In",
        "account.signup": "Sign Up",
      };
      setTranslations(defaultTranslations);
    } catch (error) {
      console.error(`Failed to load translations for ${langCode}`, error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setLanguage = useCallback(
    (lang: Language) => {
      console.log(`Setting language to ${lang.name} (${lang.code})`);
      setCurrentLanguage(lang);
      localStorage.setItem("preferred-language", lang.code);
      loadTranslations(lang.code);
      document.documentElement.lang = lang.code;

      // Update the HTML dir attribute for RTL languages
      const isRTL = ["ar", "he", "fa", "ur"].includes(lang.code);
      document.documentElement.dir = isRTL ? "rtl" : "ltr";

      // Add/remove RTL class for styling purposes
      if (isRTL) {
        document.documentElement.classList.add("rtl");
      } else {
        document.documentElement.classList.remove("rtl");
      }

      // Dispatch a custom event that components can listen for
      const event = new CustomEvent("languageChanged", { detail: lang.code });
      window.dispatchEvent(event);

      // Force a re-render of React components that might not be listening to context changes
      // This is a hack but can help in some edge cases
      if (typeof window !== "undefined") {
        const htmlElement = document.documentElement;
        const currentClass = htmlElement.className;
        htmlElement.className = currentClass + " lang-changed";
        setTimeout(() => {
          htmlElement.className = currentClass;
        }, 100);
      }
    },
    [loadTranslations]
  );

  const t = useCallback(
    (key: string): string => {
      const translation = translations[key];
      if (!translation) {
        console.warn(
          `Missing translation key: ${key} for language: ${currentLanguage.code}`
        );
        return key;
      }
      return translation;
    },
    [translations, currentLanguage.code]
  );

  // Detect user's country and set language on initial load
  useEffect(() => {
    const detectUserLanguage = async () => {
      setIsLoading(true);
      try {
        // First check localStorage for saved preference
        const savedLang = localStorage.getItem("preferred-language");
        if (savedLang) {
          const lang = languages.find((l) => l.code === savedLang);
          if (lang) {
            setCurrentLanguage(lang);
            await loadTranslations(lang.code);
            return; // Exit early if we found a saved language preference
          }
        }

        // If no saved preference, try to auto-detect based on IP
        try {
          // Use a geolocation API to detect the user's country
          const response = await fetch("https://ipapi.co/json/");
          const data = await response.json();
          const countryCode = data.country_code;

          if (countryCode) {
            console.log(`Detected country: ${countryCode}`);
            const detectedLanguageCode =
              countryToLanguageMap[countryCode] || "en";
            const detectedLanguage = languages.find(
              (l) => l.code === detectedLanguageCode
            );

            if (detectedLanguage) {
              console.log(
                `Auto-selecting language: ${detectedLanguage.name} based on country: ${countryCode}`
              );
              setCurrentLanguage(detectedLanguage);
              await loadTranslations(detectedLanguage.code);
              return;
            }
          }
        } catch (error) {
          console.warn("Failed to auto-detect country:", error);
        }

        // If geolocation API fails or no mapping exists, try browser language
        const browserLang = navigator.language.split("-")[0];
        const langFromBrowser = languages.find((l) => l.code === browserLang);

        if (langFromBrowser) {
          console.log(`Using browser language: ${langFromBrowser.name}`);
          setCurrentLanguage(langFromBrowser);
          await loadTranslations(langFromBrowser.code);
          return;
        }

        // Fall back to English if all else fails
        console.log("Falling back to English");
        const englishLang = languages.find((l) => l.code === "en") || {
          code: "en",
          name: "English",
          flag: "🇺🇸",
          native: "English",
        };
        setCurrentLanguage(englishLang);
        await loadTranslations("en");
      } catch (error) {
        console.error("Error in language detection:", error);
        // Ensure English is loaded if all else fails
        loadTranslations("en");
      } finally {
        setIsLoading(false);
      }
    };

    detectUserLanguage();
  }, [loadTranslations]); // Empty dependency array ensures this runs only once on mount

  return (
    <LanguageContext.Provider
      value={{ currentLanguage, setLanguage, translations, t, isLoading }}
    >
      {isLoading && Object.keys(translations).length === 0 ? (
        // Show a minimal loading indicator only on initial load
        <div style={{ display: "none" }}>Loading translations...</div>
      ) : (
        children
      )}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸", native: "English" },
  { code: "es", name: "Español", flag: "🇪🇸", native: "Español" },
  { code: "fr", name: "Français", flag: "🇫🇷", native: "Français" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", native: "Deutsch" },
  { code: "it", name: "Italiano", flag: "🇮🇹", native: "Italiano" },
  { code: "pt", name: "Português", flag: "🇵🇹", native: "Português" },
  { code: "ru", name: "Русский", flag: "🇷🇺", native: "Русский" },
  { code: "ja", name: "日本語", flag: "🇯🇵", native: "日本語" },
  { code: "ko", name: "한국어", flag: "🇰🇷", native: "한국어" },
  { code: "zh", name: "中文", flag: "🇨🇳", native: "中文" },
  { code: "ar", name: "العربية", flag: "🇸🇦", native: "العربية" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳", native: "हिन्दी" },
  { code: "bn", name: "বাংলা", flag: "🇧🇩", native: "বাংলা" },
  { code: "pa", name: "ਪੰਜਾਬੀ", flag: "🇵🇰", native: "ਪੰਜਾਬੀ" },
  { code: "ur", name: "اردو", flag: "🇵🇰", native: "اردو" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩", native: "Bahasa Indonesia" },
  { code: "ms", name: "Bahasa Melayu", flag: "🇲🇾", native: "Bahasa Melayu" },
  { code: "sw", name: "Kiswahili", flag: "🇰🇪", native: "Kiswahili" },
  { code: "yo", name: "Èdè Yorùbá", flag: "🇳🇬", native: "Èdè Yorùbá" },
  { code: "ha", name: "هَوُسَ", flag: "🇳🇬", native: "هَوُسَ" },
  { code: "am", name: "አማርኛ", flag: "🇪🇹", native: "አማርኛ" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷", native: "Türkçe" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳", native: "Tiếng Việt" },
  { code: "th", name: "ไทย", flag: "🇹🇭", native: "ไทย" },
  { code: "fa", name: "فارسی", flag: "🇮🇷", native: "فارسی" },
  { code: "pl", name: "Polski", flag: "🇵🇱", native: "Polski" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱", native: "Nederlands" },
  { code: "ro", name: "Română", flag: "🇷🇴", native: "Română" },
  { code: "el", name: "Ελληνικά", flag: "🇬🇷", native: "Ελληνικά" },
  { code: "uk", name: "Українська", flag: "🇺🇦", native: "Українська" },
  { code: "cs", name: "Čeština", flag: "🇨🇿", native: "Čeština" },
  { code: "hu", name: "Magyar", flag: "🇭🇺", native: "Magyar" },
  { code: "sv", name: "Svenska", flag: "🇸🇪", native: "Svenska" },
  { code: "da", name: "Dansk", flag: "🇩🇰", native: "Dansk" },
  { code: "fi", name: "Suomi", flag: "🇫🇮", native: "Suomi" },
  { code: "no", name: "Norsk", flag: "🇳🇴", native: "Norsk" },
  { code: "he", name: "עברית", flag: "🇮🇱", native: "עברית" },
  { code: "bg", name: "Български", flag: "🇧🇬", native: "Български" },
  { code: "hr", name: "Hrvatski", flag: "🇭🇷", native: "Hrvatski" },
  { code: "sr", name: "Српски", flag: "🇷🇸", native: "Српски" },
  { code: "sk", name: "Slovenčina", flag: "🇸🇰", native: "Slovenčina" },
  { code: "sl", name: "Slovenščina", flag: "🇸🇮", native: "Slovenščina" },
  { code: "et", name: "Eesti", flag: "🇪🇪", native: "Eesti" },
  { code: "lv", name: "Latviešu", flag: "🇱🇻", native: "Latviešu" },
  { code: "lt", name: "Lietuvių", flag: "🇱🇹", native: "Lietuvių" },
  { code: "ga", name: "Gaeilge", flag: "🇮🇪", native: "Gaeilge" },
  { code: "af", name: "Afrikaans", flag: "🇿🇦", native: "Afrikaans" },
  { code: "tl", name: "Tagalog", flag: "🇵🇭", native: "Tagalog" },
  { code: "my", name: "မြန်မာ", flag: "🇲🇲", native: "မြန်မာ" },
  { code: "km", name: "ភាសាខ្មែរ", flag: "🇰🇭", native: "ភាសាខ្មែរ" },
];
