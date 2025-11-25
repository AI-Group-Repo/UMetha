import type { NextRequest } from "next/server";

/**
 * Resolves a stable base URL for building absolute links.
 * Priority:
 * 1) Request origin (for route handlers)
 * 2) NEXT_PUBLIC_BASE_URL (set to your stable domain, e.g., https://u-metha.vercel.app)
 * 3) VERCEL_URL (provided by Vercel, requires https:// prefix)
 * 4) http://localhost:3000 (dev fallback)
 */
export function getBaseUrl(req?: NextRequest): string {
	const originFromReq = (() => {
		try {
			// nextUrl.origin is reliable in Next.js route handlers on Vercel
			return (req as any)?.nextUrl?.origin as string | undefined;
		} catch {
			return undefined;
		}
	})();

	if (originFromReq && typeof originFromReq === "string") {
		return originFromReq;
	}

	const envBase = process.env.NEXT_PUBLIC_BASE_URL;
	if (envBase && typeof envBase === "string" && envBase.trim().length > 0) {
		return envBase.trim().replace(/\/$/, "");
	}

	const vercelHost = process.env.VERCEL_URL;
	if (vercelHost && typeof vercelHost === "string" && vercelHost.trim().length > 0) {
		// VERCEL_URL is host-only without protocol
		return `https://${vercelHost.trim().replace(/\/$/, "")}`;
	}

	return "http://localhost:3000";
}


