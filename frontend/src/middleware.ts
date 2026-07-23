// src/middleware.ts
//
// Auth gate for the Content Studio. Every /studio route except the sign-in
// screen requires a session cookie (set by studioService on login); visitors
// without one are bounced to /studio/login with the original destination in
// ?next=. The cookie's presence only gates routing — token validity is
// enforced by the admin API on every call.

import { NextResponse, type NextRequest } from "next/server";
import { STUDIO_REFRESH_COOKIE } from "@/services/studioService";

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
