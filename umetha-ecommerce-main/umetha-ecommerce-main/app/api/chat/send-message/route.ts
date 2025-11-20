import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSupabase } from "@/lib/server-auth";

const payloadSchema = z.object({
  conversationId: z.string().uuid(),
  text: z.string().trim().max(5000).optional(),
  imageUrl: z.string().url().optional(),
});

export async function POST(req: Request) {
  try {
    const context = await getServerSupabase(req);
    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { supabase, user } = context;
    const payload = await req.json();
    const parsed = payloadSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { conversationId, text, imageUrl } = parsed.data;

    if (!text && !imageUrl) {
      return NextResponse.json(
        { error: "Message text or imageUrl is required" },
        { status: 400 }
      );
    }

    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .maybeSingle();

    if (conversationError || !conversation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const isParticipant =
      conversation.buyer_id === user.id ||
      conversation.influencer_id === user.id;

    if (!isParticipant) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        text: text || null,
        image_url: imageUrl || null,
      })
      .select("*")
      .single();

    if (messageError || !message) {
      console.error("Failed to insert message", messageError);
      return NextResponse.json(
        { error: "Unable to send message" },
        { status: 500 }
      );
    }

    const preview =
      text?.trim() || (imageUrl ? "📷 Photo" : "New message");
    const isBuyerSender = conversation.buyer_id === user.id;

    const updatePayload: Record<string, any> = {
      last_message: preview,
      last_message_time: message.created_at,
    };

    if (isBuyerSender) {
      updatePayload.unread_influencer =
        (conversation.unread_influencer || 0) + 1;
      updatePayload.unread_buyer = 0;
    } else {
      updatePayload.unread_buyer = (conversation.unread_buyer || 0) + 1;
      updatePayload.unread_influencer = 0;
    }

    const { error: updateError } = await supabase
      .from("conversations")
      .update(updatePayload)
      .eq("id", conversationId);

    if (updateError) {
      console.error("Failed to update conversation", updateError);
    }

    await supabase
      .from("profiles")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", user.id);

    return NextResponse.json({ message });
  } catch (error) {
    console.error("send-message error", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}


