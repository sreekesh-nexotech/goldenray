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

/** DRF page envelope (PAGE_SIZE 25) wrapping every list endpoint. */
export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** GET collections/ — `api_uid` is the public URL slug (/api/<api_uid>);
 *  treat it as fixed once live. */
export interface StudioCollection {
  id: number;
  api_uid: string;
  singular_name: string;
  plural_name: string;
  description: string;
  is_active: boolean;
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
  // FormData bodies (file uploads) set their own multipart boundary — never
  // force a Content-Type on them.
  const isForm = init.body instanceof FormData;
  const headers: Record<string, string> = isForm ? {} : { "Content-Type": "application/json" };
  if (init.token) headers.Authorization = `Bearer ${init.token}`;

  const res = await fetch(`${ADMIN_API_BASE_URL}${endpoint}`, {
    method: init.method ?? "GET",
    headers,
    body: isForm ? (init.body as FormData) : init.body ? JSON.stringify(init.body) : undefined,
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

  // DELETEs answer 204 No Content — there is no body to parse.
  if (res.status === 204) return undefined as T;
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

/** Slot type on a template attribute (mirrors the backend TextChoices). */
export type StudioSlotType =
  | "text"
  | "richtext_blocks"
  | "number"
  | "boolean"
  | "date"
  | "enum"
  | "url";

/** Image group on a template — `key` is the delivery contract, never rename it. */
export interface StudioTemplateImageGroup {
  id: number;
  template: number;
  key: string;
  label: string;
  repeatable: boolean;
  max_items: number | null;
  required: boolean;
  order: number;
}

/** Typed attribute slot on a template — rename `label`, never `key`. */
export interface StudioTemplateAttributeSlot {
  id: number;
  template: number;
  key: string;
  label: string;
  type: StudioSlotType;
  options: Record<string, unknown>;
  required: boolean;
  order: number;
}

/** GET templates/ — the entry editor's structure definition. */
export interface StudioTemplate {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  /** "used by N entries" badge — absent until the backend ships it. */
  entries_count?: number;
  image_groups: StudioTemplateImageGroup[];
  attribute_slots: StudioTemplateAttributeSlot[];
}

/** GET collections/ — readable by any signed-in user. */
export function getCollections(): Promise<Paginated<StudioCollection>> {
  return authRequest<Paginated<StudioCollection>>("collections/");
}

/** POST collections/ — admin (schema editor) only; 403 otherwise. */
export function createCollection(body: {
  api_uid: string;
  singular_name: string;
  plural_name: string;
  description?: string;
}): Promise<StudioCollection> {
  return authRequest<StudioCollection>("collections/", { method: "POST", body });
}

/* ── Templates (schema editing — writes are admin only) ──────────────────── */

/** GET templates/ — readable by any signed-in user. */
export function getTemplates(): Promise<Paginated<StudioTemplate>> {
  return authRequest<Paginated<StudioTemplate>>("templates/");
}

/** POST templates/{id}/duplicate/ — deep copy (template + groups + slots). */
export function duplicateTemplate(id: number): Promise<StudioTemplate> {
  return authRequest<StudioTemplate>(`templates/${id}/duplicate/`, { method: "POST" });
}

export function createImageGroup(
  body: Omit<StudioTemplateImageGroup, "id">
): Promise<StudioTemplateImageGroup> {
  return authRequest<StudioTemplateImageGroup>("template-image-groups/", { method: "POST", body });
}

export function patchImageGroup(
  id: number,
  body: Partial<Pick<StudioTemplateImageGroup, "label" | "required" | "repeatable" | "max_items" | "order">>
): Promise<StudioTemplateImageGroup> {
  return authRequest<StudioTemplateImageGroup>(`template-image-groups/${id}/`, { method: "PATCH", body });
}

export function deleteImageGroup(id: number): Promise<void> {
  return authRequest<void>(`template-image-groups/${id}/`, { method: "DELETE" });
}

export function createAttributeSlot(
  body: Omit<StudioTemplateAttributeSlot, "id">
): Promise<StudioTemplateAttributeSlot> {
  return authRequest<StudioTemplateAttributeSlot>("template-attribute-slots/", { method: "POST", body });
}

export function patchAttributeSlot(
  id: number,
  body: Partial<Pick<StudioTemplateAttributeSlot, "label" | "required" | "type" | "options" | "order">>
): Promise<StudioTemplateAttributeSlot> {
  return authRequest<StudioTemplateAttributeSlot>(`template-attribute-slots/${id}/`, { method: "PATCH", body });
}

export function deleteAttributeSlot(id: number): Promise<void> {
  return authRequest<void>(`template-attribute-slots/${id}/`, { method: "DELETE" });
}

/* ── Media library ───────────────────────────────────────────────────────── */

/** GET media-assets/ row. Always render `url` — CDN copy wins, local file is
 *  the fallback (resolved server-side). */
export interface StudioMediaAsset {
  id: number;
  file: string;
  collection: number | null;
  url: string | null;
  cdn_url: string | null;
  mime: string;
  size: number;
  width: number | null;
  height: number | null;
  alternative_text: string;
  caption: string;
  created_at: string;
}

/** GET media-assets/ — optional `collection` (id or api_uid) and `search`. */
export function getMediaAssets(params?: {
  collection?: number | string;
  search?: string;
}): Promise<Paginated<StudioMediaAsset>> {
  const qs = new URLSearchParams();
  if (params?.collection !== undefined && params.collection !== "") qs.set("collection", String(params.collection));
  if (params?.search) qs.set("search", params.search);
  const query = qs.toString();
  return authRequest<Paginated<StudioMediaAsset>>(`media-assets/${query ? `?${query}` : ""}`);
}

/** POST media-assets/ (multipart) — backend compresses to WebP + uploads to CDN. */
export function uploadMediaAsset(
  file: File,
  extra?: { collection?: number; alternative_text?: string; caption?: string }
): Promise<StudioMediaAsset> {
  const form = new FormData();
  form.append("file", file);
  if (extra?.collection !== undefined) form.append("collection", String(extra.collection));
  if (extra?.alternative_text) form.append("alternative_text", extra.alternative_text);
  if (extra?.caption) form.append("caption", extra.caption);
  return authRequest<StudioMediaAsset>("media-assets/", { method: "POST", body: form });
}

/** PATCH media-assets/{id}/ — metadata only; the file itself is immutable. */
export function patchMediaAsset(
  id: number,
  body: Partial<Pick<StudioMediaAsset, "alternative_text" | "caption" | "collection">>
): Promise<StudioMediaAsset> {
  return authRequest<StudioMediaAsset>(`media-assets/${id}/`, { method: "PATCH", body });
}

/** DELETE media-assets/{id}/ — also deletes from the CDN; entries using the
 *  image simply lose it, so always confirm first. */
export function deleteMediaAsset(id: number): Promise<void> {
  return authRequest<void>(`media-assets/${id}/`, { method: "DELETE" });
}

/* ── Taxonomy lookups (standard CRUD, any signed-in role) ────────────────── */

export interface StudioAuthor {
  id: number;
  name: string;
  bio: string | null;
  role: string | null;
}

export interface StudioCategory {
  id: number;
  name: string;
  slug: string | null;
}

export interface StudioTag {
  id: number;
  name: string;
}

export interface StudioBadge {
  id: number;
  label: string;
  color: string;
}

export function getAuthors(): Promise<Paginated<StudioAuthor>> {
  return authRequest<Paginated<StudioAuthor>>("authors/");
}

export function createAuthor(body: { name: string; bio?: string; role?: string }): Promise<StudioAuthor> {
  return authRequest<StudioAuthor>("authors/", { method: "POST", body });
}

export function getCategories(): Promise<Paginated<StudioCategory>> {
  return authRequest<Paginated<StudioCategory>>("categories/");
}

export function createCategory(body: { name: string; slug?: string }): Promise<StudioCategory> {
  return authRequest<StudioCategory>("categories/", { method: "POST", body });
}

export function getTags(): Promise<Paginated<StudioTag>> {
  return authRequest<Paginated<StudioTag>>("tags/");
}

export function createTag(body: { name: string }): Promise<StudioTag> {
  return authRequest<StudioTag>("tags/", { method: "POST", body });
}

export function getBadges(): Promise<Paginated<StudioBadge>> {
  return authRequest<Paginated<StudioBadge>>("badges/");
}

export function createBadge(body: { label: string; color?: string }): Promise<StudioBadge> {
  return authRequest<StudioBadge>("badges/", { method: "POST", body });
}

/* ── Users (Roles & access) — admin only, everyone else gets 403 ─────────── */

/** Rows from GET auth/users/ share the auth/me/ shape. */
export type StudioUser = StudioMe;

export function getUsers(): Promise<Paginated<StudioUser>> {
  return authRequest<Paginated<StudioUser>>("auth/users/");
}

/** POST auth/users/ — password is required on create. */
export function createUser(body: {
  username: string;
  password: string;
  role: StudioApiRole;
  email?: string;
  first_name?: string;
  last_name?: string;
}): Promise<StudioUser> {
  return authRequest<StudioUser>("auth/users/", { method: "POST", body });
}

/** PATCH auth/users/{id}/ — any fields; include `password` to reset it. */
export function patchUser(
  id: number,
  body: Partial<{
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: StudioApiRole;
    is_active: boolean;
    password: string;
  }>
): Promise<StudioUser> {
  return authRequest<StudioUser>(`auth/users/${id}/`, { method: "PATCH", body });
}

/** DELETE auth/users/{id}/ — deactivates (authorship history stays); the
 *  backend refuses self-deletion. */
export function deleteUser(id: number): Promise<void> {
  return authRequest<void>(`auth/users/${id}/`, { method: "DELETE" });
}
