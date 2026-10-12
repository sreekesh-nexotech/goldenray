import { NextResponse } from "next/server";
import {
  errorResponseBody,
  readAccessToken,
  refresh,
  staffUrl,
} from "../../session";

/**
 * Authenticated passthrough from the Studio to the platform staff API.
 *
 *   /fe-api/studio/proxy/content/entries/?status=DRAFT
 *       → /api/v1/content/entries/?status=DRAFT   + Authorization: Bearer …
 *
 * The browser never sees a token: the access token is read from its HttpOnly
 * cookie here, and a 401 triggers exactly one refresh-and-retry. Because this
 * is the only place that rotates, two open tabs can no longer replay a rotated
 * refresh token and get the whole session revoked.
 *
 * The body is streamed through as-is so multipart uploads (media/upload/) keep
 * their boundary; only hop-by-hop and auth headers are dropped.
 */

export const runtime = "nodejs";
// Large media uploads need more than the default.
export const maxDuration = 120;

// Headers we must not copy from the browser: the upstream Authorization is
// ours to set, Host/Cookie belong to this origin, and the length/encoding are
// recomputed by fetch for the forwarded body.
const STRIPPED_REQUEST_HEADERS = new Set([
  "authorization",
  "cookie",
  "host",
  "connection",
  "content-length",
  "transfer-encoding",
  "accept-encoding",
]);

// Headers we must not copy back: the upstream's encoding/length no longer match
// the body we return, and it must never set cookies on this origin.
const STRIPPED_RESPONSE_HEADERS = new Set([
  "content-encoding",
  "content-length",
  "transfer-encoding",
  "connection",
  "set-cookie",
]);

function forwardHeaders(request: Request): Headers {
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!STRIPPED_REQUEST_HEADERS.has(key.toLowerCase())) headers.set(key, value);
  });
  return headers;
}

function upstreamPath(request: Request, segments: string[]): string {
  // Next has already decoded each segment; re-encode so a slug or key with a
  // space or '#' survives, but keep the segments themselves intact (uids and
  // slot keys are plain, and `encodeURIComponent` would escape nothing in them).
  const path = segments.filter(Boolean).map(encodeURIComponent).join("/");
  // Every versioned platform path ends in a slash; preserve the query string.
  const { search } = new URL(request.url);
  return `${path}/${search}`;
}

async function handle(request: Request, segments: string[]): Promise<Response> {
  const url = staffUrl(upstreamPath(request, segments));
  const headers = forwardHeaders(request);
  const method = request.method.toUpperCase();

  // Buffer the body once so the retry after a refresh can send it again.
  // GET/HEAD have none.
  const body = method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();

  const send = (token: string | null) => {
    const outbound = new Headers(headers);
    if (token) outbound.set("Authorization", `Bearer ${token}`);
    return fetch(url, {
      method,
      headers: outbound,
      body: body === undefined || body.byteLength === 0 ? undefined : body,
      cache: "no-store",
      redirect: "manual",
    });
  };

  try {
    let token = await readAccessToken();
    let res = await send(token);

    if (res.status === 401) {
      // Either the 15-minute access token expired or there was none; rotate
      // once and retry. A failure here throws and is reported below, which is
      // what sends the Studio to the sign-in screen.
      token = await refresh();
      res = await send(token);
    }

    const responseHeaders = new Headers();
    res.headers.forEach((value, key) => {
      if (!STRIPPED_RESPONSE_HEADERS.has(key.toLowerCase())) responseHeaders.set(key, value);
    });

    // 204/205/304 must not carry a body.
    if (res.status === 204 || res.status === 205 || res.status === 304) {
      return new NextResponse(null, { status: res.status, headers: responseHeaders });
    }
    return new NextResponse(res.body, { status: res.status, headers: responseHeaders });
  } catch (err) {
    const { status, body: errorBody, retryAfter } = errorResponseBody(err);
    const res = NextResponse.json(errorBody, { status });
    if (retryAfter) res.headers.set("Retry-After", retryAfter);
    return res;
  }
}

type Context = { params: Promise<{ path: string[] }> };

async function route(request: Request, context: Context) {
  const { path } = await context.params;
  return handle(request, path ?? []);
}

export const GET = route;
export const POST = route;
export const PATCH = route;
export const PUT = route;
export const DELETE = route;
