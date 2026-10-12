// src/app/fe-api/studio/session.ts
//
// Server-side session for the Content Studio (plan Step 1).
//
// The Studio talks to the platform staff API (/api/v1/), which authenticates
// with `Authorization: Bearer` only — it has no cookie or session auth, and
// `CORS_ALLOW_CREDENTIALS` is False, so a browser cookie can never reach it
// cross-origin. The refresh token therefore lives in an HttpOnly cookie that
// only these route handlers can read, and the access token is kept beside it
// in a second HttpOnly cookie. Nothing is readable from `document.cookie`.
//
// Keeping the pair server-side also fixes a real hazard: the backend rotates
// refresh tokens with replay detection, and reusing a rotated token past a
// 30-second grace revokes the whole session. Two browser tabs each holding
// their own copy is exactly that pattern. One holder, one rotation.

import { cookies } from "next/headers";
import { STAFF_API_BASE_URL } from "@/config";

/** HttpOnly, so the middleware can gate /studio but scripts cannot read it. */
export const STUDIO_REFRESH_COOKIE = "flz_studio_rt";
export const STUDIO_ACCESS_COOKIE = "flz_studio_at";

// The refresh token's real validity is 7 days (SIMPLE_JWT REFRESH_TOKEN_LIFETIME),
// capped at 30 days absolute per session. The cookie outliving the token by a
// little is harmless — the server rejects it and we clear up.
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;
// Access tokens live 15 minutes; allow a small margin and let 401 drive refresh.
const ACCESS_MAX_AGE = 60 * 20;

export interface TokenPair {
  access: string;
  refresh: string;
}

/** `{code, message, errors, error_codes}` — the platform's error envelope. */
export interface ApiErrorBody {
  code?: string;
  message?: string;
  errors?: Record<string, unknown>;
  error_codes?: string[];
}

export class StudioSessionError extends Error {
  status: number;
  code: string;
  body: ApiErrorBody;
  retryAfter: string | null;

  constructor(status: number, body: ApiErrorBody, retryAfter: string | null = null) {
    super(body.message || `Request failed (${status})`);
    this.status = status;
    this.code = body.code ?? "error";
    this.body = body;
    this.retryAfter = retryAfter;
  }
}

/** Absolute URL on the staff API for a path like `content/entries/`. */
export function staffUrl(path: string): string {
  return `${STAFF_API_BASE_URL}${path.replace(/^\/+/, "")}`;
}

async function readBody(res: Response): Promise<ApiErrorBody> {
  try {
    return (await res.json()) as ApiErrorBody;
  } catch {
    return {};
  }
}

/** Throw a StudioSessionError unless the response is ok. */
async function assertOk(res: Response): Promise<Response> {
  if (res.ok) return res;
  throw new StudioSessionError(res.status, await readBody(res), res.headers.get("Retry-After"));
}

const secureCookies = process.env.NODE_ENV === "production";

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: secureCookies,
    path: "/",
    maxAge,
  };
}

export async function storeTokens(tokens: TokenPair): Promise<void> {
  const jar = await cookies();
  jar.set(STUDIO_REFRESH_COOKIE, tokens.refresh, cookieOptions(REFRESH_MAX_AGE));
  jar.set(STUDIO_ACCESS_COOKIE, tokens.access, cookieOptions(ACCESS_MAX_AGE));
}

export async function clearTokens(): Promise<void> {
  const jar = await cookies();
  jar.set(STUDIO_REFRESH_COOKIE, "", cookieOptions(0));
  jar.set(STUDIO_ACCESS_COOKIE, "", cookieOptions(0));
}

export async function readRefreshToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(STUDIO_REFRESH_COOKIE)?.value || null;
}

export async function readAccessToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(STUDIO_ACCESS_COOKIE)?.value || null;
}

/** POST auth/login/ — the platform signs in by **e-mail**, not username. */
export async function login(email: string, password: string): Promise<TokenPair> {
  const res = await fetch(staffUrl("auth/login/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  const tokens = (await (await assertOk(res)).json()) as TokenPair;
  await storeTokens(tokens);
  return tokens;
}

/**
 * POST auth/refresh/ — rotates the pair (the old refresh token stops working).
 * Only ever called from this module, so one rotation happens at a time per
 * request; the browser never holds a copy that could be replayed.
 */
export async function refresh(): Promise<string> {
  const current = await readRefreshToken();
  if (!current) {
    throw new StudioSessionError(401, { code: "not_authenticated", message: "Your session has expired — please sign in again." });
  }
  const res = await fetch(staffUrl("auth/refresh/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: current }),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await readBody(res);
    // A definite rejection ends the session; a 5xx or network blip does not.
    if (res.status === 400 || res.status === 401 || res.status === 403) {
      await clearTokens();
    }
    throw new StudioSessionError(res.status, body, res.headers.get("Retry-After"));
  }
  const tokens = (await res.json()) as TokenPair;
  await storeTokens(tokens);
  return tokens.access;
}

/** POST auth/logout/ — blacklists the refresh token, then drops the cookies. */
export async function logout(): Promise<void> {
  const current = await readRefreshToken();
  if (current) {
    try {
      await fetch(staffUrl("auth/logout/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: current }),
        cache: "no-store",
      });
    } catch {
      // Already expired or unreachable — the cookies still go.
    }
  }
  await clearTokens();
}

/** GET auth/me/ with the current access token, refreshing once on a 401. */
export async function fetchMe(): Promise<unknown> {
  const send = (token: string) =>
    fetch(staffUrl("auth/me/"), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

  let token = await readAccessToken();
  let res = token ? await send(token) : null;
  if (!res || res.status === 401) {
    token = await refresh();
    res = await send(token);
  }
  return (await (await assertOk(res)).json()) as unknown;
}

/** The JSON body for a thrown error, shaped like the platform's envelope. */
export function errorResponseBody(err: unknown): { status: number; body: ApiErrorBody; retryAfter: string | null } {
  if (err instanceof StudioSessionError) {
    return {
      status: err.status,
      body: {
        code: err.code,
        message: err.message,
        errors: err.body.errors ?? {},
        error_codes: err.body.error_codes ?? [err.code],
      },
      retryAfter: err.retryAfter,
    };
  }
  return {
    status: 502,
    body: {
      code: "upstream_unreachable",
      message: "Can’t reach the server — check your connection and try again.",
      errors: {},
      error_codes: ["upstream_unreachable"],
    },
    retryAfter: null,
  };
}
