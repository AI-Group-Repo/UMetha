import { cookies } from "next/headers";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabaseClient";

export const getAccessTokenFromRequest = (req?: Request) => {
  const header = req?.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    return header.replace("Bearer ", "").trim();
  }

  const cookieStore = cookies();
  const authCookie = cookieStore
    .getAll()
    .find(
      (cookie) =>
        cookie.name.startsWith("sb-") && cookie.name.endsWith("-auth-token")
    );

  if (!authCookie) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(authCookie.value));
    return (
      parsed?.access_token ||
      parsed?.currentSession?.access_token ||
      parsed?.currentToken?.access_token ||
      null
    );
  } catch (error) {
    console.warn("Failed to parse Supabase auth cookie", error);
    return null;
  }
};

type ServerSupabaseContext = {
  supabase: SupabaseClient<any>;
  user: User;
  accessToken: string;
};

export const getServerSupabase = async (
  req: Request
): Promise<ServerSupabaseContext | null> => {
  const accessToken = getAccessTokenFromRequest(req);
  if (!accessToken) {
    return null;
  }

  const supabase = createSupabaseServerClient(accessToken);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    return null;
  }

  return {
    supabase: supabase as SupabaseClient<any>,
    user,
    accessToken,
  };
};

