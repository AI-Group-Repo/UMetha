import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/server-auth";

export async function GET(req: Request) {
  try {
    const context = await getServerSupabase(req);
    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { supabase, user } = context;

    const {
      data: conversations,
      error: conversationsError,
    } = await supabase
      .from("conversations")
      .select("*")
      .order("last_message_time", { ascending: false });

    if (conversationsError) {
      console.error("Failed to load conversations", conversationsError);
      return NextResponse.json(
        { error: "Unable to fetch conversations" },
        { status: 500 }
      );
    }

    const profileIds = new Set<string>();
    (conversations || []).forEach((conversation) => {
      if (conversation.buyer_id) {
        profileIds.add(conversation.buyer_id);
      }
      if (conversation.influencer_id) {
        profileIds.add(conversation.influencer_id);
      }
    });

    let profileMap: Record<
      string,
      {
        id: string;
        full_name: string | null;
        username: string | null;
        avatar_url: string | null;
        role: string | null;
        last_seen_at: string | null;
    email: string | null;
      }
    > = {};

    if (profileIds.size > 0) {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(
          "id, full_name, username, avatar_url, role, last_seen_at, email"
        )
        .in("id", Array.from(profileIds));

      if (profilesError) {
        console.error("Failed to load profiles", profilesError);
      } else if (profiles) {
        profileMap = profiles.reduce<typeof profileMap>(
          (acc, profile) => ({
            ...acc,
            [profile.id]: profile,
          }),
          {}
        );
      }
    }

    const formatted = (conversations || []).map((conversation) => {
      const isBuyer = conversation.buyer_id === user.id;
      const counterpartId = isBuyer
        ? conversation.influencer_id
        : conversation.buyer_id;

      return {
        ...conversation,
        unread_count: isBuyer
          ? conversation.unread_buyer
          : conversation.unread_influencer,
        counterpart_profile: counterpartId
          ? profileMap[counterpartId]
          : null,
        self_profile: profileMap[user.id] ?? null,
      };
    });

    return NextResponse.json({ conversations: formatted });
  } catch (error) {
    console.error("get-conversations error", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

