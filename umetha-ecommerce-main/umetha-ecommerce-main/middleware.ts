import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Helper function to determine if a route requires authentication
function isProtectedRoute(path: string): boolean {
  const protectedPaths = [
    "/dashboard",
    "/orders",
    "/profile",
    "/api/dashboard",
    "/api/orders",
  ];

  // Specifically exclude dev-access from protected routes
  if (path === "/dev-access" || path.startsWith("/dev-access/")) {
    return false;
  }

  return protectedPaths.some((prefix) => path.startsWith(prefix));
}

// Helper to determine what dashboard path a user should be redirected to based on their role
function getDashboardPathForRole(role: string): string {
  const normalizedRole = (role || "").toUpperCase();
  switch (normalizedRole) {
    case "ADMIN":
      return "/dashboard/admin";
    case "INFLUENCER":
      return "/dashboard/influencer";
    case "SELLER":
      return "/dashboard/seller";
    case "USER":
      return "/"; // Regular users should go to homepage, not a dashboard
    default:
      return "/dashboard-signin"; // If role unknown, send to dashboard signin
  }
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  console.log(`[Middleware] Processing request for path: ${path}`);

  // CRITICAL: Always allow dev-access page without any auth checks
  if (path === "/dev-access" || path.startsWith("/dev-access/")) {
    console.log("[Middleware] Dev access page detected - bypassing all checks");
    return NextResponse.next();
  }

  // Check for dev bypass cookie which allows dashboard access for development
  const devBypass = req.cookies.get("dashboard-dev-bypass")?.value;
  if (devBypass === "true" && path.startsWith("/dashboard")) {
    console.log(
      "[Middleware] Dev bypass cookie detected - allowing dashboard access"
    );
    return NextResponse.next();
  }

  // Special handling for checkout - allow without authentication
  if (path.startsWith("/checkout")) {
    return NextResponse.next();
  }

  // Get the Supabase token from cookies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  // Skip middleware if no Supabase credentials are available (dev environment fallback)
  if (!supabaseUrl || !supabaseKey) {
    console.warn(
      "Supabase credentials not available, skipping auth middleware"
    );
    return NextResponse.next();
  }

  // Create a Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  // Get the access token from the cookie - Supabase uses project-specific cookie names
  // The format is: sb-{project-ref}-auth-token
  let refreshToken: string | undefined;
  let accessToken: string | undefined;
  
  // Try to find Supabase auth cookies (they include the project ref)
  req.cookies.getAll().forEach(cookie => {
    if (cookie.name.includes('auth-token') && cookie.name.startsWith('sb-')) {
      try {
        const tokenData = JSON.parse(cookie.value);
        if (tokenData.refresh_token) refreshToken = tokenData.refresh_token;
        if (tokenData.access_token) accessToken = tokenData.access_token;
      } catch (e) {
        // Not JSON, might be different format
      }
    }
  });

  // Check for temporary role (user impersonation)
  const tempRole = req.cookies.get("temp_role")?.value;
  const originalRole = req.cookies.get("original_role")?.value;

  console.log(
    `[Middleware] Auth tokens present: ${!!refreshToken && !!accessToken}`
  );

  // Check for mock user session (test accounts) - they don't have Supabase tokens
  const hasMockSession = req.cookies.getAll().some(cookie => 
    cookie.name.startsWith('mock-user-') || cookie.name === 'test-account-session'
  );

  // No tokens means user is not authenticated (unless they have a mock session)
  if (!refreshToken && !accessToken && !hasMockSession) {
    console.log(
      `[Middleware] No auth tokens found, isProtectedRoute: ${isProtectedRoute(
        path
      )}`
    );

    // If trying to access dashboard-signin without tokens, allow it
    if (path === "/dashboard-signin" || path === "/dashboard-signin/") {
      return NextResponse.next();
    }

    // Redirect to signin for protected routes
    if (isProtectedRoute(path)) {
      console.log(`[Middleware] Redirecting to signin due to missing tokens`);
      // Redirect to dashboard-signin specifically for dashboard access
      if (path.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/dashboard-signin", req.url));
      }
      // Direct to regular signin for other protected routes
      return NextResponse.redirect(new URL("/signin", req.url));
    }
    return NextResponse.next();
  }

  try {
    // For mock sessions, we skip Supabase auth and just allow access
    if (hasMockSession && (!refreshToken || !accessToken)) {
      console.log(`[Middleware] Using mock session for test account`);
      // Just allow the request through - test accounts don't need Supabase validation
      return NextResponse.next();
    }

    // Set the access token for the Supabase client (only if we have real tokens)
    if (refreshToken && accessToken) {
      await supabase.auth.setSession({
        refresh_token: refreshToken,
        access_token: accessToken,
      });
    } else {
      // No tokens and no mock session - this shouldn't happen at this point
      console.warn(`[Middleware] Reached token validation without tokens or mock session`);
      return NextResponse.next();
    }

    // Get the user session
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(`[Middleware] Auth error:`, error);
      if (isProtectedRoute(path)) {
        // Clear invalid auth cookies
        const response = NextResponse.redirect(new URL("/signin", req.url));
        response.cookies.delete("sb-refresh-token");
        response.cookies.delete("sb-access-token");
        response.cookies.delete("temp_role");
        response.cookies.delete("original_role");
        response.cookies.delete("test-account-session");
        response.cookies.delete("mock-user-email");
        response.cookies.delete("mock-user-role");
        return response;
      }
      return NextResponse.next();
    }

    console.log(`[Middleware] User authenticated: ${user.email}`);

    // If user is authenticated and trying to access /signin
    // redirect them to their appropriate dashboard
    if (path === "/signin" || path === "/signin/") {
      // Fetch profile from profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error(`[Middleware] Failed to fetch profile:`, profileError);
        // Still allow signin page access if we can't determine role
        return NextResponse.next();
      }

      // Use temporary role if it exists, otherwise use the profile role
      let effectiveRole = tempRole || (profile?.role || "USER").toUpperCase();
      const dashboardPath = getDashboardPathForRole(effectiveRole);

      console.log(
        `[Middleware] User already signed in, redirecting to: ${dashboardPath}`
      );
      return NextResponse.redirect(new URL(dashboardPath, req.url));
    }

    // For dashboard-signin, we'll allow access even when signed in
    // This allows users to switch to different dashboard roles if needed
    if (path === "/dashboard-signin" || path === "/dashboard-signin/") {
      console.log(
        `[Middleware] Allowing access to dashboard-signin for authenticated user`
      );
      return NextResponse.next();
    }

    // Check role for dashboard routes
    if (path.startsWith("/dashboard")) {
      console.log(
        `[Middleware] Checking dashboard access for user: ${user.email}`
      );

      // Fetch profile from profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error(`[Middleware] Failed to fetch profile:`, profileError);
        return NextResponse.redirect(new URL("/dashboard-signin", req.url));
      }

      // Use temporary role if it exists, otherwise use the profile role
      let effectiveRole = tempRole || (profile?.role || "USER").toUpperCase();

      console.log(
        `[Middleware] User effectiveRole: ${effectiveRole} (${
          tempRole ? "temporary" : "permanent"
        })`
      );

      // Check for specific dashboard paths against the user's role
      if (path.startsWith("/dashboard/admin") && effectiveRole !== "ADMIN") {
        console.log(`[Middleware] Unauthorized access to admin dashboard`);
        return NextResponse.redirect(
          new URL(getDashboardPathForRole(effectiveRole), req.url)
        );
      }

      if (
        path.startsWith("/dashboard/influencer") &&
        effectiveRole !== "INFLUENCER" &&
        effectiveRole !== "ADMIN"
      ) {
        console.log(`[Middleware] Unauthorized access to influencer dashboard`);
        return NextResponse.redirect(
          new URL(getDashboardPathForRole(effectiveRole), req.url)
        );
      }

      if (
        path.startsWith("/dashboard/seller") &&
        effectiveRole !== "SELLER" &&
        effectiveRole !== "ADMIN"
      ) {
        console.log(`[Middleware] Unauthorized access to seller dashboard`);
        return NextResponse.redirect(
          new URL(getDashboardPathForRole(effectiveRole), req.url)
        );
      }

      // If at root dashboard, redirect to appropriate role dashboard
      if (path === "/dashboard" || path === "/dashboard/") {
        const dashboardPath = getDashboardPathForRole(effectiveRole);

        console.log(
          `[Middleware] Redirecting to role dashboard: ${dashboardPath}`
        );
        return NextResponse.redirect(new URL(dashboardPath, req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error(`[Middleware] Error processing request:`, error);
    if (isProtectedRoute(path)) {
      // Clear potentially corrupted auth cookies
      const response = NextResponse.redirect(new URL("/signin", req.url));
      response.cookies.delete("sb-refresh-token");
      response.cookies.delete("sb-access-token");
      response.cookies.delete("test-account-session");
      response.cookies.delete("mock-user-email");
      response.cookies.delete("mock-user-role");
      return response;
    }
    return NextResponse.next();
  }
}

// Specify the paths this middleware should run on
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/api/dashboard/:path*",
    "/api/orders/:path*",
    "/checkout/:path*",
    "/signin",
    "/signin/",
    "/dashboard-signin",
    "/dashboard-signin/",
  ],
};
