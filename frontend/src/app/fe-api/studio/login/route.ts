import { NextResponse } from "next/server";
import { errorResponseBody, fetchMe, login } from "../session";

/**
 * POST {email, password} → signs in against /api/v1/auth/login/ and stores the
 * token pair in HttpOnly cookies. The browser gets only the `me` payload, never
 * a token.
 *
 * The platform signs in by e-mail (the old CMS used a username), and adds
 * `password_reset_required` (403) and `login_locked` (429, with Retry-After) to
 * the plain `invalid_credentials` (401) — all passed through so the sign-in
 * screen can tell them apart.
 */

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: { email?: unknown; password?: unknown };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json(
      { code: "validation_error", message: "Expected a JSON body.", errors: {}, error_codes: ["validation_error"] },
      { status: 400 },
    );
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  if (!email || !password) {
    return NextResponse.json(
      {
        code: "validation_error",
        message: "Enter your e-mail address and password.",
        errors: {
          ...(email ? {} : { email: ["This field is required."] }),
          ...(password ? {} : { password: ["This field is required."] }),
        },
        error_codes: ["validation_error"],
      },
      { status: 400 },
    );
  }

  try {
    await login(email, password);
    return NextResponse.json({ me: await fetchMe() });
  } catch (err) {
    const { status, body, retryAfter } = errorResponseBody(err);
    const res = NextResponse.json(body, { status });
    if (retryAfter) res.headers.set("Retry-After", retryAfter);
    return res;
  }
}
