/**
 * Demo Account Storage
 * Stores demo account data in localStorage for testing when Supabase has issues
 */

export interface DemoInfluencerProfile {
  id: string;
  email: string;
  role: string;
  businessModels: string[];
  onboardingCompleted: boolean;
  storeSettings?: any;
  products?: any[]; // Direct marketplace products
  cjApprovedProducts?: any[]; // CJ Dropshipping approved products
  clickbankApprovals?: string[];
}

const STORAGE_KEY = "demo_influencer_profiles";
const LEGACY_STORAGE_KEY = "demo_influencer_profile"; // Backwards compatibility
const DEFAULT_EMAIL = "influencer@umetha.com";

const PRECONFIGURED_PROFILE_OVERRIDES: Record<
  string,
  Partial<DemoInfluencerProfile>
> = {
  [DEFAULT_EMAIL]: {
    businessModels: ["ai_dropshipping"],
    onboardingCompleted: true,
  },
};

const sanitizeEmailKey = (email?: string | null) =>
  (email?.toLowerCase() || DEFAULT_EMAIL).trim();

const buildProfileId = (emailKey: string) =>
  `demo-${emailKey.replace(/[^a-z0-9]/g, "-")}-id`;

const createDefaultProfile = (email?: string | null): DemoInfluencerProfile => {
  const emailKey = sanitizeEmailKey(email);
  return {
    id: buildProfileId(emailKey),
    email: emailKey,
    role: "INFLUENCER",
    businessModels: [],
    onboardingCompleted: false,
    products: [],
    cjApprovedProducts: [],
    clickbankApprovals: [],
    ...PRECONFIGURED_PROFILE_OVERRIDES[emailKey],
  };
};

const readProfiles = (): Record<string, DemoInfluencerProfile> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }

    // Attempt to migrate legacy single-profile storage
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const legacyProfile = JSON.parse(legacy);
      const normalized = sanitizeEmailKey(legacyProfile?.email);
      const migrated = { [normalized]: legacyProfile };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return migrated;
    }
  } catch (error) {
    console.error("❌ Error reading demo profiles:", error);
  }

  return {};
};

const persistProfiles = (profiles: Record<string, DemoInfluencerProfile>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.error("❌ Error saving demo profiles:", error);
  }
};

const loadOrCreateProfile = (email?: string | null): DemoInfluencerProfile => {
  const key = sanitizeEmailKey(email);
  const profiles = readProfiles();

  if (!profiles[key]) {
    profiles[key] = createDefaultProfile(email);
    persistProfiles(profiles);
  }

  return profiles[key];
};

/**
 * Save demo account profile to localStorage
 */
export function saveDemoProfile(profile: DemoInfluencerProfile): void {
  try {
    const profiles = readProfiles();
    const key = sanitizeEmailKey(profile.email);
    profiles[key] = profile;
    persistProfiles(profiles);
    console.log("✅ Demo profile saved to localStorage:", profile);
  } catch (error) {
    console.error("❌ Error saving demo profile:", error);
  }
}

/**
 * Load demo account profile from localStorage
 */
export function loadDemoProfile(
  email?: string | null
): DemoInfluencerProfile | null {
  try {
    const profile = loadOrCreateProfile(email);
    console.log("✅ Demo profile loaded from localStorage:", profile);
    return profile;
  } catch (error) {
    console.error("❌ Error loading demo profile:", error);
    return null;
  }
}

/**
 * Update business models for demo account
 */
export function updateDemoBusinessModels(
  businessModels: string[],
  email?: string | null
): void {
  const profile = loadOrCreateProfile(email);
  profile.businessModels = businessModels;
  profile.onboardingCompleted = businessModels.length > 0;
  saveDemoProfile(profile);
}

/**
 * Check if onboarding is completed for demo account
 */
export function isDemoOnboardingCompleted(
  email?: string | null
): boolean {
  const profile = loadOrCreateProfile(email);
  return profile?.onboardingCompleted || false;
}

/**
 * Get demo business models
 */
export function getDemoBusinessModels(email?: string | null): string[] {
  const profile = loadOrCreateProfile(email);
  return profile?.businessModels || [];
}

/**
 * Reset demo account (for testing)
 */
export function resetDemoAccount(email?: string | null): void {
  if (!email) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    console.log("✅ All demo accounts reset");
    return;
  }

  const profiles = readProfiles();
  const key = sanitizeEmailKey(email);
  if (profiles[key]) {
    delete profiles[key];
    persistProfiles(profiles);
  }
  console.log(`✅ Demo account reset for ${key}`);
}

/**
 * Check if user is using demo account
 */
export function isDemoAccount(email: string | null | undefined): boolean {
  return !!email && email.endsWith("@umetha.com");
}

/**
 * Initialize demo profile if it doesn't exist
 */
export function initializeDemoProfile(
  email?: string | null
): DemoInfluencerProfile {
  return loadOrCreateProfile(email);
}

/**
 * Add product for demo account (Direct Marketplace)
 */
export function addDemoProduct(product: any, email?: string | null): void {
  const profile = loadOrCreateProfile(email);
  profile.products = profile.products || [];
  profile.products.push({
    ...product,
    id: `demo-product-${Date.now()}`,
    createdAt: new Date().toISOString(),
  });
  saveDemoProfile(profile);
}

/**
 * Get demo products
 */
export function getDemoProducts(email?: string | null): any[] {
  const profile = loadOrCreateProfile(email);
  return profile?.products || [];
}

/**
 * Approve ClickBank product for demo account
 */
export function approveDemoClickBankProduct(
  productId: string,
  email?: string | null
): void {
  const profile = loadOrCreateProfile(email);
  profile.clickbankApprovals = profile.clickbankApprovals || [];
  if (!profile.clickbankApprovals.includes(productId)) {
    profile.clickbankApprovals.push(productId);
    saveDemoProfile(profile);
  }
}

/**
 * Get demo ClickBank approvals
 */
export function getDemoClickBankApprovals(
  email?: string | null
): string[] {
  const profile = loadOrCreateProfile(email);
  return profile?.clickbankApprovals || [];
}

/**
 * Add approved CJ product for demo account
 */
export function addDemoCJProduct(
  product: any,
  email?: string | null
): void {
  const profile = loadOrCreateProfile(email);
  profile.cjApprovedProducts = profile.cjApprovedProducts || [];

  const approvedProduct = {
    id: `cj-${product.pid || Date.now()}`,
    pid: product.pid,
    name: product.productNameEn || product.productName,
    productNameEn: product.productNameEn || product.productName,
    description:
      product.description || "Premium quality product from CJ Dropshipping",
    price: product.sellPrice,
    sellPrice: product.sellPrice,
    productImage: product.productImage,
    stock: product.productStock || 100,
    productStock: product.productStock || 100,
    source: "cj_dropshipping",
    createdAt: new Date().toISOString(),
  };

  const exists = profile.cjApprovedProducts.some(
    (p: any) => p.pid === product.pid
  );
  if (!exists) {
    profile.cjApprovedProducts.push(approvedProduct);
    saveDemoProfile(profile);
    console.log("✅ CJ product approved and saved to localStorage:", approvedProduct);
  }
}

/**
 * Get demo CJ approved products
 */
export function getDemoCJApprovals(email?: string | null): any[] {
  const profile = loadOrCreateProfile(email);
  return profile?.cjApprovedProducts || [];
}

/**
 * Remove CJ approved product for demo account
 */
export function removeDemoCJProduct(
  productId: string,
  email?: string | null
): void {
  const profile = loadOrCreateProfile(email);
  if (profile.cjApprovedProducts) {
    profile.cjApprovedProducts = profile.cjApprovedProducts.filter(
      (p: any) => p.id !== productId && p.pid !== productId
    );
    saveDemoProfile(profile);
    console.log("✅ CJ product removed from localStorage");
  }
}

