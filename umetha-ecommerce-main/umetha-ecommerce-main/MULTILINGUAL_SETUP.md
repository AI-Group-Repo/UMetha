# Multilingual Setup Guide

This project now supports 30 languages with full i18n integration using react-i18next, i18next-http-backend, and i18next-browser-languagedetector.

## 🌍 Supported Languages

### 10 Most Spoken Languages
1. **English** (en) - English 🇺🇸
2. **Chinese** (zh) - 中文 🇨🇳
3. **Hindi** (hi) - हिन्दी 🇮🇳
4. **Spanish** (es) - Español 🇪🇸
5. **French** (fr) - Français 🇫🇷
6. **Arabic** (ar) - العربية 🇸🇦 (RTL)
7. **Bengali** (bn) - বাংলা 🇧🇩
8. **Portuguese** (pt) - Português 🇵🇹
9. **Russian** (ru) - Русский 🇷🇺
10. **Urdu** (ur) - اردو 🇵🇰 (RTL)

### 20 Additional Globally Spoken Languages
11. **Indonesian** (id) - Bahasa Indonesia 🇮🇩
12. **German** (de) - Deutsch 🇩🇪
13. **Japanese** (ja) - 日本語 🇯🇵
14. **Swahili** (sw) - Kiswahili 🇰🇪
15. **Turkish** (tr) - Türkçe 🇹🇷
16. **Italian** (it) - Italiano 🇮🇹
17. **Korean** (ko) - 한국어 🇰🇷
18. **Vietnamese** (vi) - Tiếng Việt 🇻🇳
19. **Polish** (pl) - Polski 🇵🇱
20. **Thai** (th) - ไทย 🇹🇭
21. **Dutch** (nl) - Nederlands 🇳🇱
22. **Persian** (fa) - فارسی 🇮🇷 (RTL)
23. **Filipino** (tl) - Filipino 🇵🇭
24. **Tamil** (ta) - தமிழ் 🇮🇳
25. **Punjabi** (pa) - ਪੰਜਾਬੀ 🇮🇳
26. **Malay** (ms) - Bahasa Melayu 🇲🇾
27. **Ukrainian** (uk) - Українська 🇺🇦
28. **Hebrew** (he) - עברית 🇮🇱 (RTL)
29. **Greek** (el) - Ελληνικά 🇬🇷
30. **Burmese** (my) - မြန်မာ 🇲🇲

## 📁 File Structure

```
├── i18n/
│   ├── i18n.js              # Main i18n configuration
│   └── languages.json       # Language metadata
├── locales/
│   ├── en/translation.json  # English translations
│   ├── zh/translation.json  # Chinese translations
│   ├── hi/translation.json  # Hindi translations
│   ├── es/translation.json  # Spanish translations
│   ├── fr/translation.json  # French translations
│   ├── ar/translation.json  # Arabic translations
│   ├── bn/translation.json  # Bengali translations
│   ├── pt/translation.json  # Portuguese translations
│   ├── ru/translation.json  # Russian translations
│   ├── ur/translation.json  # Urdu translations
│   ├── id/translation.json  # Indonesian translations
│   ├── de/translation.json  # German translations
│   ├── ja/translation.json  # Japanese translations
│   ├── sw/translation.json  # Swahili translations
│   ├── tr/translation.json  # Turkish translations
│   ├── it/translation.json  # Italian translations
│   ├── ko/translation.json  # Korean translations
│   ├── vi/translation.json  # Vietnamese translations
│   ├── pl/translation.json  # Polish translations
│   ├── th/translation.json  # Thai translations
│   ├── nl/translation.json  # Dutch translations
│   ├── fa/translation.json  # Persian translations
│   ├── tl/translation.json  # Filipino translations
│   ├── ta/translation.json  # Tamil translations
│   ├── pa/translation.json  # Punjabi translations
│   ├── ms/translation.json  # Malay translations
│   ├── uk/translation.json  # Ukrainian translations
│   ├── he/translation.json  # Hebrew translations
│   ├── el/translation.json  # Greek translations
│   └── my/translation.json  # Burmese translations
└── components/
    └── language-switcher.tsx # Language selector component
```

## 🚀 Features

### ✅ Implemented Features

1. **Dynamic Language Loading**: Uses i18next-http-backend to load translation files dynamically
2. **Automatic Language Detection**: Detects browser language and user preferences
3. **RTL Support**: Full right-to-left support for Arabic, Hebrew, Persian, and Urdu
4. **Search Functionality**: Search through 30 languages in the language selector
5. **Native Language Names**: Displays languages in their native scripts
6. **Fallback System**: Falls back to English if translation is missing
7. **Local Storage**: Saves user language preference
8. **Missing Key Detection**: Logs missing translations in development

### 🔧 Configuration

The i18n setup is configured in `i18n/i18n.js` with:

- **Backend**: i18next-http-backend for dynamic loading
- **Detection**: i18next-browser-languagedetector for automatic detection
- **React Integration**: react-i18next for React components
- **Fallback Language**: English (en)
- **Supported Languages**: All 30 languages from languages.json
- **RTL Support**: Automatic document direction switching
- **Missing Key Handler**: Development logging

### 🎨 Language Selector

The `LanguageSwitcher` component includes:

- **Search Bar**: Filter through 30 languages
- **Native Names**: Shows both native and English names
- **Flag Icons**: Visual country flags for each language
- **RTL Detection**: Automatically switches document direction
- **Responsive Design**: Works on mobile and desktop
- **Keyboard Navigation**: Full keyboard accessibility

## 📖 Usage

### Basic Translation

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
      <button>{t('common.addToCart')}</button>
    </div>
  );
}
```

### Language Switching

```tsx
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <select onChange={(e) => changeLanguage(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
      {/* ... more options */}
    </select>
  );
}
```

### Adding New Translations

1. Add the language to `i18n/languages.json`
2. Create a new folder in `locales/[language-code]/`
3. Add `translation.json` with the translations
4. The system will automatically detect and load the new language

### Translation File Structure

Each `translation.json` file should follow this structure:

```json
{
  "welcome": "Welcome message",
  "description": "Description text",
  "addToCart": "Add to Cart",
  "checkout": "Checkout",
  "common": {
    "home": "Home",
    "about": "About",
    "contact": "Contact",
    "login": "Login",
    "signup": "Sign Up",
    "logout": "Logout",
    "search": "Search",
    "cart": "Cart",
    "wishlist": "Wishlist",
    "profile": "Profile",
    "settings": "Settings",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add",
    "remove": "Remove",
    "clear": "Clear",
    "clear_all": "Clear All",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "warning": "Warning",
    "info": "Information",
    "yes": "Yes",
    "no": "No",
    "ok": "OK",
    "close": "Close",
    "back": "Back",
    "next": "Next",
    "previous": "Previous",
    "submit": "Submit",
    "reset": "Reset",
    "confirm": "Confirm",
    "select": "Select",
    "choose": "Choose",
    "view": "View",
    "show": "Show",
    "hide": "Hide",
    "more": "More",
    "less": "Less",
    "all": "All",
    "none": "None",
    "other": "Other",
    "menu": "MENU",
    "language": "Language",
    "currency": "Currency",
    "price": "Price",
    "total": "Total",
    "subtotal": "Subtotal",
    "tax": "Tax",
    "shipping": "Shipping",
    "discount": "Discount",
    "free": "Free",
    "new": "New",
    "sale": "Sale",
    "featured": "Featured",
    "popular": "Popular",
    "best_seller": "Best Seller",
    "trending": "Trending",
    "recommended": "Recommended",
    "recent": "Recent",
    "latest": "Latest",
    "top_rated": "Top Rated",
    "on_sale": "On Sale",
    "out_of_stock": "Out of Stock",
    "in_stock": "In Stock",
    "limited_edition": "Limited Edition",
    "exclusive": "Exclusive",
    "premium": "Premium",
    "standard": "Standard",
    "basic": "Basic",
    "advanced": "Advanced",
    "pro": "Pro",
    "enterprise": "Enterprise",
    "explore": "Explore Now",
    "welcome": "Welcome!",
    "sign_in": "Sign In",
    "sign_up": "Sign Up",
    "sign_out": "Sign Out",
    "access_account": "Access your account",
    "flash_deals": "Flash Deals"
  }
}
```

## 🧪 Testing

Visit `/test-i18n` to test the multilingual functionality:

- Switch between all 30 languages
- Test RTL support for Arabic, Hebrew, Persian, and Urdu
- Verify search functionality
- Check automatic language detection
- Test responsive design

## 🔧 Dependencies

The following packages are required:

```json
{
  "i18next": "^25.6.0",
  "react-i18next": "^16.0.1",
  "i18next-browser-languagedetector": "^8.2.0",
  "i18next-http-backend": "^1.6.0"
}
```

## 🌟 Best Practices

1. **Always use translation keys** instead of hardcoded strings
2. **Group related translations** in nested objects
3. **Use descriptive key names** that are easy to understand
4. **Test with multiple languages** to ensure proper display
5. **Consider text length** as some languages require more space
6. **Use RTL-aware CSS** for right-to-left languages
7. **Provide fallbacks** for missing translations
8. **Keep translations consistent** across the application

## 🚀 Next Steps

1. **Add more translation keys** as needed for your application
2. **Implement pluralization** for complex grammar rules
3. **Add date/time formatting** for different locales
4. **Implement number formatting** for different regions
5. **Add currency formatting** for international markets
6. **Consider professional translation** for production use
7. **Implement translation management** for easier maintenance

## 📞 Support

For questions or issues with the multilingual setup, please refer to:

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [i18next-http-backend Documentation](https://github.com/i18next/i18next-http-backend)
- [i18next-browser-languagedetector Documentation](https://github.com/i18next/i18next-browser-languagedetector)
