import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { getSupabaseEnv } from "@/lib/supabaseClient";

const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

type ProfileRow = {
  id: string;
  full_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  business_models?: string[] | null;
  bio?: string | null;
  store_theme?: Record<string, unknown> | null;
};

type ProductRow = {
  id: string;
  influencer_id: string;
};

const STORE_TYPE_LABELS: Record<string, string> = {
  ai_dropshipping: "AI Drop Shipping",
  direct_marketplace: "Direct Marketing",
  affiliate_marketing: "Affiliate Marketing",
};

const normalizeStoreType = (models?: string[] | null) => {
  if (!models || models.length === 0) {
    return "Direct Marketing";
  }

  for (const model of models) {
    const normalized = model.toLowerCase();
    if (normalized.includes("ai")) {
      return STORE_TYPE_LABELS.ai_dropshipping;
    }
    if (normalized.includes("affiliate")) {
      return STORE_TYPE_LABELS.affiliate_marketing;
    }
    if (normalized.includes("direct")) {
      return STORE_TYPE_LABELS.direct_marketplace;
    }
    if (STORE_TYPE_LABELS[model]) {
      return STORE_TYPE_LABELS[model];
    }
  }

  return STORE_TYPE_LABELS.direct_marketplace;
};

export async function GET() {
  try {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select(
        "id, full_name, username, avatar_url, business_models, bio, store_theme"
      )
      .ilike("role", "influencer");

    if (profilesError) {
      console.error("Failed to load influencer profiles", profilesError);
      return NextResponse.json(
        { error: "Unable to fetch influencers" },
        { status: 500 }
      );
    }

    const { data: products, error: productsError } = await supabase
      .from("influencer_products")
      .select("id, influencer_id")
      .eq("status", "active");

    if (productsError) {
      console.error("Failed to load influencer products", productsError);
    }

    const productRows = (products ?? []) as ProductRow[];
    const productCountMap =
      productRows.reduce<Record<string, number>>((acc, product) => {
        const key = product.influencer_id;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}) ?? {};

    const profileRows = (profiles ?? []) as ProfileRow[];
    const influencers = profileRows.map((profile) => ({
      id: profile.id,
      name:
        profile.full_name ||
        profile.username ||
        "Influencer storefront",
      avatar_url: profile.avatar_url,
      store_type: normalizeStoreType(profile.business_models),
      business_models: profile.business_models ?? [],
      product_count: productCountMap[profile.id] || 0,
      bio: profile.bio,
      store_theme: profile.store_theme,
    }));

    return NextResponse.json({ influencers });
  } catch (error) {
    console.error("Unexpected error fetching influencers", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

