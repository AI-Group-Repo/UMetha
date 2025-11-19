import axios from "axios";

// ClickBank API configuration
const CLICKBANK_API_KEY = process.env.CLICKBANK_API_KEY || "API-I6XY87IZVRHA3SK42ZLA1AQ981JUPPRGIEM7";
const CLICKBANK_BASE_URL = "https://api.clickbank.com/rest/1.3";

export interface ClickBankProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  gravity: number; // Popularity metric
  initialPrice: number;
  rebillPrice?: number;
  commission: number;
  commissionPercentage: number;
  vendorName: string;
  productUrl: string;
  affiliateLink: string;
  image?: string;
  popular: boolean;
  activated: Date;
}

export interface ClickBankProductListResponse {
  products: any[];
  totalCount: number;
}

/**
 * Fetch products from ClickBank Marketplace
 * @param category Optional category filter
 * @param page Page number for pagination
 * @param limit Number of products per page
 */
export async function fetchClickBankProducts(
  category?: string,
  page: number = 1,
  limit: number = 20
): Promise<ClickBankProduct[]> {
  try {
    console.log(`📦 Fetching ClickBank products...`);

    const params: any = {
      page,
      limit,
    };

    if (category) {
      params.cat = category;
    }

    // ClickBank Marketplace API endpoint
    const response = await axios.get(`${CLICKBANK_BASE_URL}/products`, {
      headers: {
        Authorization: CLICKBANK_API_KEY,
        Accept: "application/json",
      },
      params,
    });

    if (response.data && response.data.products) {
      const products: ClickBankProduct[] = response.data.products.map((product: any) => ({
        id: product.site || product.sku,
        title: product.title || product.name,
        description: product.description || "",
        category: product.category || "General",
        gravity: product.gravity || 0,
        initialPrice: parseFloat(product.initialPrice) || 0,
        rebillPrice: product.rebillPrice ? parseFloat(product.rebillPrice) : undefined,
        commission: parseFloat(product.commission) || 0,
        commissionPercentage: parseFloat(product.percent) || 0,
        vendorName: product.vendor || "",
        productUrl: product.url || "",
        affiliateLink: generateAffiliateLink(product.site),
        image: product.image || "/placeholder-product.png",
        popular: (product.gravity || 0) > 50,
        activated: new Date(product.activateDate || Date.now()),
      }));

      console.log(`✅ Fetched ${products.length} ClickBank products`);
      return products;
    }

    return [];
  } catch (error: any) {
    console.error("❌ Error fetching ClickBank products:", error.response?.data || error.message);
    
    // Return mock data for development if API fails
    if (process.env.NODE_ENV === "development") {
      console.log("⚠️ Using mock ClickBank data for development");
      return getMockClickBankProducts();
    }
    
    return [];
  }
}

/**
 * Generate affiliate link for a ClickBank product
 */
function generateAffiliateLink(productSku: string, affiliateId: string = "umetha"): string {
  return `https://${affiliateId}.${productSku}.hop.clickbank.net`;
}

/**
 * Fetch trending/popular ClickBank products (high gravity)
 */
export async function fetchTrendingClickBankProducts(limit: number = 10): Promise<ClickBankProduct[]> {
  try {
    console.log(`🔥 Fetching trending ClickBank products...`);

    const response = await axios.get(`${CLICKBANK_BASE_URL}/products`, {
      headers: {
        Authorization: CLICKBANK_API_KEY,
        Accept: "application/json",
      },
      params: {
        sort: "gravity",
        order: "desc",
        limit,
      },
    });

    if (response.data && response.data.products) {
      const products: ClickBankProduct[] = response.data.products.map((product: any) => ({
        id: product.site || product.sku,
        title: product.title || product.name,
        description: product.description || "",
        category: product.category || "General",
        gravity: product.gravity || 0,
        initialPrice: parseFloat(product.initialPrice) || 0,
        rebillPrice: product.rebillPrice ? parseFloat(product.rebillPrice) : undefined,
        commission: parseFloat(product.commission) || 0,
        commissionPercentage: parseFloat(product.percent) || 0,
        vendorName: product.vendor || "",
        productUrl: product.url || "",
        affiliateLink: generateAffiliateLink(product.site),
        image: product.image || "/placeholder-product.png",
        popular: true,
        activated: new Date(product.activateDate || Date.now()),
      }));

      console.log(`✅ Fetched ${products.length} trending ClickBank products`);
      return products;
    }

    return getMockClickBankProducts().slice(0, limit);
  } catch (error: any) {
    console.error("❌ Error fetching trending ClickBank products:", error.response?.data || error.message);
    return getMockClickBankProducts().slice(0, limit);
  }
}

/**
 * Get ClickBank categories
 */
export async function fetchClickBankCategories(): Promise<string[]> {
  try {
    const response = await axios.get(`${CLICKBANK_BASE_URL}/categories`, {
      headers: {
        Authorization: CLICKBANK_API_KEY,
        Accept: "application/json",
      },
    });

    if (response.data && response.data.categories) {
      return response.data.categories.map((cat: any) => cat.name);
    }

    return getDefaultCategories();
  } catch (error) {
    console.error("❌ Error fetching ClickBank categories:", error);
    return getDefaultCategories();
  }
}

/**
 * Default categories if API fails
 */
function getDefaultCategories(): string[] {
  return [
    "Business & Investing",
    "Computers & Internet",
    "Education",
    "Fiction",
    "Games",
    "Green Products",
    "Health & Fitness",
    "Home & Garden",
    "Languages",
    "Marketing & Ads",
    "Parenting & Families",
    "Self-Help",
    "Software & Services",
    "Spirituality, New Age & Alternative Beliefs",
    "Sports",
    "Travel",
  ];
}

/**
 * Mock data for development
 */
function getMockClickBankProducts(): ClickBankProduct[] {
  return [
    {
      id: "weight-loss-system",
      title: "Ultimate Weight Loss System",
      description: "Transform your body with our scientifically proven weight loss program. Includes meal plans, workout routines, and expert coaching.",
      category: "Health & Fitness",
      gravity: 125.5,
      initialPrice: 47.00,
      commission: 32.90,
      commissionPercentage: 70,
      vendorName: "FitLife Pro",
      productUrl: "https://example.com/weight-loss",
      affiliateLink: "https://umetha.weightloss.hop.clickbank.net",
      image: "/fashion-slide2.png",
      popular: true,
      activated: new Date("2024-01-01"),
    },
    {
      id: "digital-marketing-course",
      title: "Digital Marketing Mastery 2025",
      description: "Learn cutting-edge digital marketing strategies. Boost your online presence and generate leads like never before.",
      category: "Marketing & Ads",
      gravity: 98.3,
      initialPrice: 197.00,
      commission: 137.90,
      commissionPercentage: 70,
      vendorName: "Marketing Wizards",
      productUrl: "https://example.com/digital-marketing",
      affiliateLink: "https://umetha.digmarketing.hop.clickbank.net",
      image: "/beauty-banner2.jpeg",
      popular: true,
      activated: new Date("2024-02-15"),
    },
    {
      id: "meditation-app",
      title: "Zen Mind Meditation App",
      description: "Find inner peace with guided meditations, breathing exercises, and mindfulness practices. Over 1000+ sessions available.",
      category: "Self-Help",
      gravity: 76.8,
      initialPrice: 29.99,
      rebillPrice: 9.99,
      commission: 20.99,
      commissionPercentage: 70,
      vendorName: "Zen Studios",
      productUrl: "https://example.com/meditation",
      affiliateLink: "https://umetha.zenmind.hop.clickbank.net",
      image: "/Icon.png",
      popular: true,
      activated: new Date("2024-03-10"),
    },
    {
      id: "woodworking-plans",
      title: "16,000 Woodworking Plans",
      description: "Complete collection of woodworking projects for all skill levels. Includes step-by-step instructions and diagrams.",
      category: "Home & Garden",
      gravity: 89.2,
      initialPrice: 67.00,
      commission: 46.90,
      commissionPercentage: 70,
      vendorName: "Crafters Paradise",
      productUrl: "https://example.com/woodworking",
      affiliateLink: "https://umetha.woodplans.hop.clickbank.net",
      image: "/Logo.png",
      popular: true,
      activated: new Date("2024-01-20"),
    },
    {
      id: "language-learning",
      title: "Speak Any Language in 30 Days",
      description: "Revolutionary language learning method. Become conversationally fluent in any language within 30 days.",
      category: "Languages",
      gravity: 112.4,
      initialPrice: 97.00,
      commission: 67.90,
      commissionPercentage: 70,
      vendorName: "Polyglot Academy",
      productUrl: "https://example.com/language",
      affiliateLink: "https://umetha.languagemaster.hop.clickbank.net",
      image: "/fashion-slide2.png",
      popular: true,
      activated: new Date("2024-02-01"),
    },
  ];
}

/**
 * Validate ClickBank API key
 */
export async function validateClickBankApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await axios.get(`${CLICKBANK_BASE_URL}/products`, {
      headers: {
        Authorization: apiKey,
        Accept: "application/json",
      },
      params: {
        limit: 1,
      },
    });

    return response.status === 200;
  } catch (error) {
    console.error("❌ Invalid ClickBank API key");
    return false;
  }
}

