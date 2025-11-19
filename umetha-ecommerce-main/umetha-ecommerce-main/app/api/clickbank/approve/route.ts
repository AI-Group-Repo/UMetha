import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    // In production, verify the user is authenticated and is an influencer
    // For now, we'll use a mock user ID
    const mockUserId = "influencer-user-id";

    // Save approval to database
    const { data, error } = await supabase
      .from("influencer_clickbank_products")
      .insert({
        influencer_id: mockUserId,
        product_id: productId,
        approved: true,
        approved_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // If already exists, update it
      if (error.code === "23505") {
        const { data: updateData, error: updateError } = await supabase
          .from("influencer_clickbank_products")
          .update({
            approved: true,
            approved_at: new Date().toISOString(),
          })
          .eq("influencer_id", mockUserId)
          .eq("product_id", productId)
          .select()
          .single();

        if (updateError) throw updateError;
        
        return NextResponse.json({
          success: true,
          data: updateData,
        });
      }
      
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("Error in ClickBank approve API:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

