import { NextResponse } from "next/server";
import { logout } from "../session";

/**
 * POST → blacklists the refresh token on the platform and clears both cookies.
 * Always answers 204, even if the token was already dead: the local session is
 * gone either way, and the sign-in screen must never be blocked by a failed
 * sign-out.
 */

export const runtime = "nodejs";

export async function POST() {
  await logout();
  return new NextResponse(null, { status: 204 });
}
