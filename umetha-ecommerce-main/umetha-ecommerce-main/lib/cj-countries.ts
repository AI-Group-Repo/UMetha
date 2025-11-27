/**
 * CJ Dropshipping Supported Countries
 * Based on CJ Dropshipping API Documentation: https://developers.cjdropshipping.com/en/api/introduction.html
 * 
 * This list includes countries that CJ Dropshipping typically delivers to.
 * Source: CJ Dropshipping API - Appendix 3: Country Code
 */

export interface Country {
  code: string;
  name: string;
  continent: string;
}

export const CJ_SUPPORTED_COUNTRIES: Country[] = [
  // North America
  { code: "US", name: "United States", continent: "North America" },
  { code: "CA", name: "Canada", continent: "North America" },
  { code: "MX", name: "Mexico", continent: "North America" },

  // Europe
  { code: "GB", name: "United Kingdom", continent: "Europe" },
  { code: "DE", name: "Germany", continent: "Europe" },
  { code: "FR", name: "France", continent: "Europe" },
  { code: "IT", name: "Italy", continent: "Europe" },
  { code: "ES", name: "Spain", continent: "Europe" },
  { code: "NL", name: "Netherlands", continent: "Europe" },
  { code: "BE", name: "Belgium", continent: "Europe" },
  { code: "CH", name: "Switzerland", continent: "Europe" },
  { code: "AT", name: "Austria", continent: "Europe" },
  { code: "SE", name: "Sweden", continent: "Europe" },
  { code: "NO", name: "Norway", continent: "Europe" },
  { code: "DK", name: "Denmark", continent: "Europe" },
  { code: "FI", name: "Finland", continent: "Europe" },
  { code: "PL", name: "Poland", continent: "Europe" },
  { code: "CZ", name: "Czech Republic", continent: "Europe" },
  { code: "IE", name: "Ireland", continent: "Europe" },
  { code: "PT", name: "Portugal", continent: "Europe" },
  { code: "GR", name: "Greece", continent: "Europe" },
  { code: "HU", name: "Hungary", continent: "Europe" },
  { code: "RO", name: "Romania", continent: "Europe" },
  { code: "SK", name: "Slovakia", continent: "Europe" },
  { code: "BG", name: "Bulgaria", continent: "Europe" },
  { code: "HR", name: "Croatia", continent: "Europe" },
  { code: "SI", name: "Slovenia", continent: "Europe" },
  { code: "LT", name: "Lithuania", continent: "Europe" },
  { code: "LV", name: "Latvia", continent: "Europe" },
  { code: "EE", name: "Estonia", continent: "Europe" },
  { code: "LU", name: "Luxembourg", continent: "Europe" },
  { code: "MT", name: "Malta", continent: "Europe" },
  { code: "CY", name: "Cyprus", continent: "Europe" },

  // Asia-Pacific
  { code: "AU", name: "Australia", continent: "Asia-Pacific" },
  { code: "NZ", name: "New Zealand", continent: "Asia-Pacific" },
  { code: "JP", name: "Japan", continent: "Asia-Pacific" },
  { code: "CN", name: "China", continent: "Asia-Pacific" },
  { code: "HK", name: "Hong Kong", continent: "Asia-Pacific" },
  { code: "TW", name: "Taiwan", continent: "Asia-Pacific" },
  { code: "KR", name: "South Korea", continent: "Asia-Pacific" },
  { code: "SG", name: "Singapore", continent: "Asia-Pacific" },
  { code: "MY", name: "Malaysia", continent: "Asia-Pacific" },
  { code: "TH", name: "Thailand", continent: "Asia-Pacific" },
  { code: "VN", name: "Vietnam", continent: "Asia-Pacific" },
  { code: "PH", name: "Philippines", continent: "Asia-Pacific" },
  { code: "ID", name: "Indonesia", continent: "Asia-Pacific" },
  { code: "IN", name: "India", continent: "Asia-Pacific" },
  { code: "PK", name: "Pakistan", continent: "Asia-Pacific" },
  { code: "BD", name: "Bangladesh", continent: "Asia-Pacific" },
  { code: "LK", name: "Sri Lanka", continent: "Asia-Pacific" },
  { code: "NP", name: "Nepal", continent: "Asia-Pacific" },

  // Middle East
  { code: "AE", name: "United Arab Emirates", continent: "Middle East" },
  { code: "SA", name: "Saudi Arabia", continent: "Middle East" },
  { code: "IL", name: "Israel", continent: "Middle East" },
  { code: "TR", name: "Turkey", continent: "Middle East" },
  { code: "QA", name: "Qatar", continent: "Middle East" },
  { code: "KW", name: "Kuwait", continent: "Middle East" },
  { code: "BH", name: "Bahrain", continent: "Middle East" },
  { code: "OM", name: "Oman", continent: "Middle East" },
  { code: "JO", name: "Jordan", continent: "Middle East" },
  { code: "LB", name: "Lebanon", continent: "Middle East" },

  // South America
  { code: "BR", name: "Brazil", continent: "South America" },
  { code: "AR", name: "Argentina", continent: "South America" },
  { code: "CL", name: "Chile", continent: "South America" },
  { code: "CO", name: "Colombia", continent: "South America" },
  { code: "PE", name: "Peru", continent: "South America" },
  { code: "VE", name: "Venezuela", continent: "South America" },
  { code: "EC", name: "Ecuador", continent: "South America" },
  { code: "UY", name: "Uruguay", continent: "South America" },
  { code: "PY", name: "Paraguay", continent: "South America" },

  // Central America & Caribbean
  { code: "CR", name: "Costa Rica", continent: "Central America" },
  { code: "PA", name: "Panama", continent: "Central America" },
  { code: "GT", name: "Guatemala", continent: "Central America" },
  { code: "HN", name: "Honduras", continent: "Central America" },
  { code: "SV", name: "El Salvador", continent: "Central America" },
  { code: "NI", name: "Nicaragua", continent: "Central America" },
  { code: "DO", name: "Dominican Republic", continent: "Caribbean" },
  { code: "JM", name: "Jamaica", continent: "Caribbean" },
  { code: "TT", name: "Trinidad and Tobago", continent: "Caribbean" },
  { code: "BB", name: "Barbados", continent: "Caribbean" },

  // Africa
  { code: "ZA", name: "South Africa", continent: "Africa" },
  { code: "EG", name: "Egypt", continent: "Africa" },
  { code: "NG", name: "Nigeria", continent: "Africa" },
  { code: "KE", name: "Kenya", continent: "Africa" },
  { code: "MA", name: "Morocco", continent: "Africa" },
  { code: "TN", name: "Tunisia", continent: "Africa" },
  { code: "GH", name: "Ghana", continent: "Africa" },
  { code: "ET", name: "Ethiopia", continent: "Africa" },
  { code: "UG", name: "Uganda", continent: "Africa" },
  { code: "TZ", name: "Tanzania", continent: "Africa" },

  // Other regions
  { code: "IS", name: "Iceland", continent: "Europe" },
  { code: "RU", name: "Russia", continent: "Europe/Asia" },
  { code: "UA", name: "Ukraine", continent: "Europe" },
  { code: "BY", name: "Belarus", continent: "Europe" },
  { code: "KZ", name: "Kazakhstan", continent: "Asia" },
  { code: "GE", name: "Georgia", continent: "Asia" },
  { code: "AM", name: "Armenia", continent: "Asia" },
  { code: "AZ", name: "Azerbaijan", continent: "Asia" },
].sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name

/**
 * Get countries grouped by continent
 */
export function getCountriesByContinent(): Record<string, Country[]> {
  const grouped: Record<string, Country[]> = {};
  
  CJ_SUPPORTED_COUNTRIES.forEach((country) => {
    if (!grouped[country.continent]) {
      grouped[country.continent] = [];
    }
    grouped[country.continent].push(country);
  });
  
  return grouped;
}

/**
 * Find a country by code
 */
export function getCountryByCode(code: string): Country | undefined {
  return CJ_SUPPORTED_COUNTRIES.find(
    (country) => country.code.toUpperCase() === code.toUpperCase()
  );
}

/**
 * Find a country by name
 */
export function getCountryByName(name: string): Country | undefined {
  return CJ_SUPPORTED_COUNTRIES.find(
    (country) => country.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get all country names for dropdown
 */
export function getCountryNames(): string[] {
  return CJ_SUPPORTED_COUNTRIES.map((country) => country.name);
}

/**
 * Validate if a country is supported
 */
export function isCountrySupported(countryName: string): boolean {
  return CJ_SUPPORTED_COUNTRIES.some(
    (country) => country.name.toLowerCase() === countryName.toLowerCase()
  );
}

