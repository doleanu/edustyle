import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The apex domain (barberiaeduardostyle.es) and the www subdomain were both
// attached as production domains in Vercel with no redirect between them —
// Google was crawling and indexing every page twice (once per host), which
// showed up in Search Console as "Duplicate without user-selected canonical"
// despite correct per-page canonical/hreflang tags. Canonical tags alone
// don't stop Google from crawling both hosts; a real redirect does.
// `business.siteUrl` (and every canonical tag) already points at the www
// host, so that's the one we keep — apex 308-redirects to it, preserving
// path and query string.
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  if (host === "barberiaeduardostyle.es") {
    const url = new URL(request.url);
    url.host = "www.barberiaeduardostyle.es";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets and image optimization, which
     * never need the host redirect and would just add latency.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
