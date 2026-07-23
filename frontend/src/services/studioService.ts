// src/services/studioService.ts
//
// Client for the Content Studio admin API (see goldenray-backend/backend/cms/
// ADMIN_API.md). Base URL comes from ADMIN_API_BASE_URL; every URL keeps its
// trailing slash. Auth is a JWT access/refresh pair from `auth/login/`; the
// refresh token rotates on every `auth/refresh/`, so both tokens are re-saved
// each time.
//
// Tokens are stored in cookies rather than localStorage so the Next.js
// middleware (src/middleware.ts) can gate /studio routes server-side.

import { ADMIN_API_BASE_URL } from "@/config";

/* -------------------------------------------------------------------------- */
/*  Response shapes                                                            */
/* -------------------------------------------------------------------------- */

export interface StudioTokens {
  access: string;
  refresh: string;
}

export type StudioApiRole = "admin" | "editor" | "author";

/** GET auth/me/ */
export interface StudioMe {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: StudioApiRole;
  can_publish: boolean;
  can_edit_schema: boolean;
  is_staff: boolean;
  is_active: boolean;
  last_login: string | null;
  date_joined: string;
}

/** GET config/ */
export interface StudioConfig {
  environment: "development" | "production";
  site_url: string;
  blog_path: string;
  media_base_url: string;
  delivery_api_base: string;
}

/** GET dashboard/ — `counts` also feeds the sidebar badges. */
export interface StudioDashboardCounts {
  collections: number;
  entries: number;
  entries_draft: number;
  entries_published: number;
  templates: number;
  media_assets: number;
  authors: number;
  categories: number;
  tags: number;
  badges: number;
}

/** Slim entry row inside dashboard `recent_entries`. */
export interface StudioEntryListItem {
  id: number;
  document_id: string;
  collection: number;
  collection_uid: string;
  collection_name: string;
  template: number | null;
  template_slug: string | null;
  title: string;
  slug: string;
  excerpt: string;
  status: "draft" | "published";
  author_name: string | null;
  cover_url: string | null;
  is_featured: boolean;
  sort_order: number;
  published_on: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudioDashboard {
  counts: StudioDashboardCounts;
  recent_entries: StudioEntryListItem[];
}

/* -------------------------------------------------------------------------- */
/*  Errors                                                                     */
/* -------------------------------------------------------------------------- */

export class StudioApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "StudioApiError";
    this.status = status;
  }
}

/** True when the failure means "sign in again" rather than a plain error. */
export function isAuthError(err: unknown): boolean {
  return err instanceof StudioApiError && (err.status === 401 || err.status === 403);
}

/* -------------------------------------------------------------------------- */
/*  Token storage (cookies, readable by the middleware)                        */
/* -------------------------------------------------------------------------- */

export const STUDIO_ACCESS_COOKIE = "flz_studio_access";
export const STUDIO_REFRESH_COOKIE = "flz_studio_refresh";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days; real validity is server-side

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function saveTokens(tokens: StudioTokens) {
  writeCookie(STUDIO_ACCESS_COOKIE, tokens.access);
  writeCookie(STUDIO_REFRESH_COOKIE, tokens.refresh);
}

function clearTokens() {
  clearCookie(STUDIO_ACCESS_COOKIE);
  clearCookie(STUDIO_REFRESH_COOKIE);
}

/** Whether a session exists locally (server still validates every call). */
export function isAuthenticated(): boolean {
  return readCookie(STUDIO_REFRESH_COOKIE) !== null;
}

/* -------------------------------------------------------------------------- */
/*  Low-level request helpers                                                  */
/* -------------------------------------------------------------------------- */

async function request<T>(
  endpoint: string,
  init: { method?: string; body?: object; token?: string | null } = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (init.token) headers.Authorization = `Bearer ${init.token}`;

  const res = await fetch(`${ADMIN_API_BASE_URL}${endpoint}`, {
    method: init.method ?? "GET",
    headers,
    body: init.body ? JSON.stringify(init.body) : undefined,
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      // DRF errors: {"detail": "..."} or field maps like {"username": ["..."]}
      if (typeof data?.detail === "string") detail = data.detail;
      else if (data && typeof data === "object") {
        const first = Object.values(data)[0];
        if (Array.isArray(first) && typeof first[0] === "string") detail = first[0];
      }
    } catch {
      /* non-JSON body — keep the generic message */
    }
    throw new StudioApiError(res.status, detail);
  }

  return res.json() as Promise<T>;
}

/** POST auth/refresh/ with the stored (rotating) refresh token. */
async function refreshTokens(): Promise<string> {
  const refresh = readCookie(STUDIO_REFRESH_COOKIE);
  if (!refresh) throw new StudioApiError(401, "Not signed in");
  try {
    const tokens = await request<StudioTokens>("auth/refresh/", {
      method: "POST",
      body: { refresh },
    });
    saveTokens(tokens); // refresh rotates — always persist the new pair
    return tokens.access;
  } catch (err) {
    clearTokens(); // stale session; force a fresh sign-in
    throw err;
  }
}

/** Authenticated call: attaches the Bearer token, retries once after a 401. */
async function authRequest<T>(
  endpoint: string,
  init: { method?: string; body?: object } = {}
): Promise<T> {
  const access = readCookie(STUDIO_ACCESS_COOKIE);
  try {
    return await request<T>(endpoint, { ...init, token: access });
  } catch (err) {
    if (!(err instanceof StudioApiError) || err.status !== 401) throw err;
    const fresh = await refreshTokens();
    return request<T>(endpoint, { ...init, token: fresh });
  }
}

/* -------------------------------------------------------------------------- */
/*  Public API                                                                 */
/* -------------------------------------------------------------------------- */

/** POST auth/login/ — stores the token pair on success. */
export async function login(username: string, password: string): Promise<void> {
  const tokens = await request<StudioTokens>("auth/login/", {
    method: "POST",
    body: { username, password },
  });
  saveTokens(tokens);
}

/** No logout endpoint — just discard the tokens. */
export function logout(): void {
  clearTokens();
}

/** GET auth/me/ — the signed-in internal user + capability flags. */
export function getMe(): Promise<StudioMe> {
  return authRequest<StudioMe>("auth/me/");
}

/** GET config/ — static shell metadata (environment badge, preview links). */
export function getConfig(): Promise<StudioConfig> {
  return authRequest<StudioConfig>("config/");
}

/** GET dashboard/ — dashboard counts + recent entries (and sidebar badges). */
export function getDashboard(): Promise<StudioDashboard> {
  return authRequest<StudioDashboard>("dashboard/");
}
