// src/middleware.ts
//
// Auth gate for the Content Studio. Every /studio route except the sign-in
// screen requires a session cookie (set by the BFF's login handler); visitors
// without one are bounced to /studio/login with the original destination in
// ?next=. The cookie's presence only gates routing — token validity is
// enforced by the staff API on every call.
//
// The cookie is HttpOnly, so only the middleware and the /fe-api/studio route
// handlers can read it; nothing in the browser can.

import { NextResponse, type NextRequest } from "next/server";

// Inlined rather than imported from the route handlers: middleware runs on the
// edge runtime and must not pull in `next/headers` or the staff-API client.
const STUDIO_REFRESH_COOKIE = "flz_studio_rt";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed = Boolean(req.cookies.get(STUDIO_REFRESH_COOKIE)?.value);
  const isLogin = pathname === "/studio/login";

  if (!authed && !isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/studio/login";
    url.search = pathname === "/studio" ? "" : `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  if (authed && isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/studio/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio/:path*"],
};
