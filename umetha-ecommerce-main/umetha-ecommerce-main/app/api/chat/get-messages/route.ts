import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/server-auth";

export async function GET(req: Request) {
  try {
    const context = await getServerSupabase(req);
    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { supabase, user } = context;
    const url = new URL(req.url);
    const conversationId = url.searchParams.get("conversationId");
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const before = url.searchParams.get("before");

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId is required" },
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

    let messageQuery = supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (before) {
      messageQuery = messageQuery.lt("created_at", before);
    }

    const { data: messages, error: messagesError } = await messageQuery;

    if (messagesError) {
      console.error("Failed to load messages", messagesError);
      return NextResponse.json(
        { error: "Unable to fetch messages" },
        { status: 500 }
      );
    }

    const unreadField =
      conversation.buyer_id === user.id
        ? "unread_buyer"
        : "unread_influencer";

    await supabase
      .from("conversations")
      .update({ [unreadField]: 0 })
      .eq("id", conversationId);

    await supabase
      .from("profiles")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", user.id);

    return NextResponse.json({ messages, conversation });
  } catch (error) {
    console.error("get-messages error", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}


