import { NextRequest, NextResponse } from "next/server";
import { fetchTrendingClickBankProducts } from "@/lib/clickbank";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");

    // Fetch trending products from ClickBank
    const products = await fetchTrendingClickBankProducts(limit);

    // Fetch approved products from database
    const { data: approvedProducts, error } = await supabase
      .from("influencer_clickbank_products")
      .select("product_id, approved, approved_at")
      .eq("approved", true);

    if (error) {
      console.error("Error fetching approved products:", error);
    }

    const approvedIds = approvedProducts?.map((p) => p.product_id) || [];
    const pendingApprovals = products
      .filter((p) => !approvedIds.includes(p.id))
      .map((p) => p.id);

    return NextResponse.json({
      success: true,
      products,
      approvedProducts: approvedIds,
      pendingApprovals,
    });
  } catch (error: any) {
    console.error("Error in ClickBank products API:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

