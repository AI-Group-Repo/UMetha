import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSupabase } from "@/lib/server-auth";

const requestSchema = z.object({
  influencerId: z.string().uuid().optional(),
  buyerId: z.string().uuid().optional(),
});

export async function POST(req: Request) {
  try {
    const context = await getServerSupabase(req);
    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { supabase, user } = context;

    const payload = await req.json();
    const parsed = requestSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    let { buyerId, influencerId } = parsed.data;

    if (!buyerId && !influencerId) {
      return NextResponse.json(
        { error: "buyerId or influencerId is required" },
        { status: 400 }
      );
    }

    if (!buyerId) {
      buyerId = user.id;
    }

    if (!influencerId) {
      influencerId = user.id;
    }

    if (buyerId === influencerId) {
      return NextResponse.json(
        { error: "buyerId and influencerId must be different" },
        { status: 400 }
      );
    }

    if (user.id !== buyerId && user.id !== influencerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: existingConversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("buyer_id", buyerId)
      .eq("influencer_id", influencerId)
      .maybeSingle();

    if (existingConversation) {
      return NextResponse.json({ conversation: existingConversation });
    }

    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .insert({
        buyer_id: buyerId,
        influencer_id: influencerId,
        unread_buyer: 0,
        unread_influencer: 0,
        last_message: null,
        last_message_time: null,
      })
      .select("*")
      .single();

    if (conversationError) {
      console.error("Failed to create conversation", conversationError);
      return NextResponse.json(
        { error: "Unable to create conversation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error("create-conversation error", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

