// src/services/studioService.ts
//
// Client for the platform staff API (/api/v1/), reached through this app's own
// BFF at /fe-api/studio/ (see src/app/fe-api/studio/). Every URL keeps its
// trailing slash.
//
// No token is ever held in the browser: the BFF keeps the access/refresh pair
// in HttpOnly cookies, attaches `Authorization: Bearer` server-side, and does
// the one refresh-and-retry on a 401. So there is nothing here to read, save or
// rotate — a 401 reaching this file means the session is genuinely over.
//
// The sibling per-module services (faqService, pagesService, careersService,
// adminService) share this transport through `studioRequest`.

import { PUBLIC_API_BASE_URL, SITE_URL } from "@/config";

/** Everything goes through the BFF, which is same-origin. */
const STUDIO_API_BASE = "/fe-api/studio/proxy/";

/* -------------------------------------------------------------------------- */
/*  Response shapes                                                            */
/* -------------------------------------------------------------------------- */

export interface StudioTokens {
  access: string;
  refresh: string;
}

/**
 * Module keys from the platform's permission registry (`accounts/registry.py`).
 * The Studio only uses the website/careers/admin groups, but the registry also
 * covers product, sales and HR modules, so unknown keys must not break `can()`.
 *
 * Note there is no umbrella `careers` module: the careers screens are gated on
 * `job_positions`, `applications`, `departments` and `career_page`.
 */
export type StudioModule =
  // GENERAL
  | "dashboard"
  // WEBSITE
  | "pages" | "blogs" | "faqs" | "media" | "seo"
  | "products_public" | "reference_data" | "emi"
  // CAREERS
  | "job_positions" | "applications" | "departments" | "career_page"
  // SALES (the Studio reads leads and quotation content)
  | "leads" | "customers" | "quotations" | "quotation_content"
  // CONFIG (the BOM calculator screen)
  | "bom" | "packs" | "pricing"
  // ADMIN
  | "company" | "users" | "roles" | "settings" | "audit";

/** Every action verb in the registry (17), not just the six the CMS had. */
export type StudioAction =
  | "view" | "create" | "edit" | "publish" | "verify" | "archive" | "manage"
  | "approve" | "submit" | "lock" | "commit" | "issue" | "revise" | "assign"
  | "release" | "export" | "sync";

export type StudioPermissionMap = Partial<Record<StudioModule, StudioAction[]>>;

/** Record scope per module: `all`, `owned`, `assigned`, `office` or `self`. */
export type StudioScope = "all" | "owned" | "assigned" | "office" | "self";

export type StudioScopeMap = Partial<Record<StudioModule, StudioScope>>;

/** The signed-in user, as `GET auth/me/` returns them. */
export interface StudioMeUser {
  uid: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_e164: string | null;
  title: string | null;
  last_login_at: string | null;
  password_changed_at: string | null;
}

/** The user's role. Roles are data on the platform, not a fixed enum. */
export interface StudioMeRole {
  uid: string;
  slug: string;
  name: string;
  is_system: boolean;
}

/**
 * GET auth/me/ — nested, unlike the old CMS's flat payload. Nothing about
 * permissions is carried in the token; they come from here.
 */
export interface StudioMe {
  user: StudioMeUser;
  role: StudioMeRole | null;
  permissions: StudioPermissionMap;
  scopes: StudioScopeMap;
  session_uid: string | null;
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
  // Phase 1 (§6.1)
  faqs: number;
  faqs_draft: number;
  faqs_published: number;
  positions_active: number;
  positions_draft: number;
  departments: number;
  pages: number;
  pages_seo_issues: number;
}

/** One line of the dashboard's recent-activity feed. */
export interface StudioActivityItem {
  kind: "faq" | "job" | "blog";
  label: string;
  detail: string;
  href: string;
  actor: string | null;
  at: string;
}

/** The platform's entry lifecycle. */
export type StudioEntryStatus = "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";

/** Slim entry row for the list screen and the dashboard feed. */
export interface StudioEntryListItem {
  uid: string;
  /** Nested on read. */
  collection: { uid: string; api_uid: string; plural_name: string; path_prefix: string };
  template: { uid: string; slug: string; name: string } | null;
  title: string;
  slug: string;
  excerpt: string;
  status: StudioEntryStatus;
  author: { uid: string; name: string; slug: string } | null;
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
  recent_activity: StudioActivityItem[];
}

/**
 * `GET dashboard/` as the platform sends it: counters nested per registry
 * module, present only for modules the caller can `view` (and omitted entirely
 * when a counter's feature flag is off). Every lookup must therefore be
 * optional.
 */
export interface PlatformDashboard {
  modules: Partial<Record<string, Record<string, number>>>;
}

/**
 * One row of `GET audit/`, which replaces the old `recent_activity`. Audit rows
 * have no id of their own — they are addressed by object and time.
 */
export interface PlatformAuditRow {
  at: string;
  action: string;
  actor: { uid: string; email: string; name: string } | null;
  actor_kind: string;
  object_type: string;
  object_uid: string | null;
  note: string | null;
}

/**
 * Map the nested platform counters onto the flat shape the screens use.
 *
 * Only three modules register counters today — `blogs`
 * (`entries_draft|review|published|archived|scheduled`), `faqs`
 * (`published|draft|archived`) and `pages` (`published|draft|unverified`). The
 * rest of `StudioDashboardCounts` has no platform counter, so those fields come
 * back 0; screens that need a real number should read the matching list
 * endpoint's `count` instead. Every lookup is optional because a module the
 * caller cannot `view` is absent entirely.
 */
export function flattenDashboardCounts(payload: PlatformDashboard): StudioDashboardCounts {
  const m = payload.modules ?? {};
  const n = (module: string, key: string): number => m[module]?.[key] ?? 0;
  // Total entries = every status bucket except the scheduled overlay, which
  // counts rows already included in another status.
  const entriesTotal = Object.entries(m.blogs ?? {})
    .filter(([key]) => key.startsWith("entries_") && key !== "entries_scheduled")
    .reduce((sum, [, value]) => sum + (value ?? 0), 0);

  return {
    collections: 0,
    entries: entriesTotal,
    entries_draft: n("blogs", "entries_draft"),
    entries_published: n("blogs", "entries_published"),
    templates: 0,
    media_assets: 0,
    authors: 0,
    categories: 0,
    tags: 0,
    badges: 0,
    faqs: n("faqs", "published") + n("faqs", "draft") + n("faqs", "archived"),
    faqs_draft: n("faqs", "draft"),
    faqs_published: n("faqs", "published"),
    positions_active: 0,
    positions_draft: 0,
    departments: 0,
    pages: n("pages", "published") + n("pages", "draft"),
    pages_seo_issues: n("pages", "unverified"),
  };
}

/** Shape an audit row like the old activity-feed item. */
export function toActivityItem(row: PlatformAuditRow): StudioActivityItem {
  const objectType = (row.object_type || "").toLowerCase();
  const kind: StudioActivityItem["kind"] = objectType.includes("faq")
    ? "faq"
    : objectType.includes("position") || objectType.includes("application")
      ? "job"
      : "blog";
  return {
    kind,
    label: row.action || "changed",
    detail: row.note || row.object_type || "",
    href: "",
    actor: row.actor?.name || null,
    at: row.at,
  };
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
  uid: string;
  api_uid: string;
  singular_name: string;
  plural_name: string;
  description: string;
  /** Public route prefix, e.g. "/blog". Required when creating. */
  path_prefix: string;
  is_active: boolean;
  entry_count: number;
  created_at: string;
  updated_at: string;
  version: number;
}

/* -------------------------------------------------------------------------- */
/*  Errors                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * The platform's error envelope: `{code, message, errors, error_codes}`.
 * `errors` is `{field: [messages]}` (nested for nested serializers), `{}` when
 * the failure is not a validation one.
 */
export interface StudioErrorEnvelope {
  code: string;
  message: string;
  errors: Record<string, unknown>;
  error_codes: string[];
}

/** Flatten `{field: [msg], nested: {field: [msg]}}` into a message list. */
function flattenErrorMessages(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(flattenErrorMessages);
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(flattenErrorMessages);
  }
  return [];
}

export class StudioApiError extends Error {
  status: number;
  /** Stable machine code: `validation_error`, `stale_version`, `media_in_use`, … */
  code: string;
  /** Every machine code the envelope carried. */
  errorCodes: string[];
  /** Per-field messages, as sent (`{field: [messages]}`). */
  fieldErrors: Record<string, unknown>;
  /** Flat list of every message, for screens that show a bullet list. */
  errors?: string[];
  /** Seconds to wait, from a 429's Retry-After header. */
  retryAfter: number | null;

  constructor(
    status: number,
    message: string,
    options: {
      code?: string;
      errorCodes?: string[];
      fieldErrors?: Record<string, unknown>;
      retryAfter?: number | null;
    } = {},
  ) {
    super(message);
    this.name = "StudioApiError";
    this.status = status;
    this.code = options.code ?? "error";
    this.errorCodes = options.errorCodes ?? [this.code];
    this.fieldErrors = options.fieldErrors ?? {};
    const flat = flattenErrorMessages(this.fieldErrors);
    this.errors = flat.length ? flat : undefined;
    this.retryAfter = options.retryAfter ?? null;
  }

  /** First message for `field`, if the server flagged it. */
  fieldError(field: string): string | undefined {
    return flattenErrorMessages(this.fieldErrors[field])[0];
  }
}

/** A write refused because the row changed since it was read (HTTP 409). */
export function isStaleVersion(err: unknown): boolean {
  return err instanceof StudioApiError && err.code === "stale_version";
}

/**
 * A 409 that is not a version clash: the row is referenced by something live
 * (`media_in_use`, `category_in_use`, `department_in_use`,
 * `position_has_applications`). The blocking records are in `fieldErrors`.
 */
export function isInUseConflict(err: unknown): boolean {
  return err instanceof StudioApiError && err.status === 409 && err.code !== "stale_version";
}

/** True when the failure means "sign in again" rather than a plain error. */
export function isAuthError(err: unknown): boolean {
  return err instanceof StudioApiError && (err.status === 401 || err.status === 403);
}

/**
 * True only when the session itself is gone (401 after a failed refresh). A
 * 403 is a permission gap on one screen, not a reason to sign the user out.
 */
export function isSessionExpired(err: unknown): boolean {
  return err instanceof StudioApiError && err.status === 401;
}
/* -------------------------------------------------------------------------- */
/*  Session (held server-side by the BFF)                                      */
/* -------------------------------------------------------------------------- */
//
// The tokens live in HttpOnly cookies that only /fe-api/studio/* can read, so
// there is nothing to store, decode or rotate here. `src/middleware.ts` gates
// /studio on the same cookie server-side.

/**
 * The session is over: go to the sign-in screen, keeping the current page in
 * ?next= so signing in lands the user back where they were. A full navigation
 * (not the router) so no screen keeps stale state or keeps firing requests.
 */
export function endStudioSession(): void {
  if (typeof window === "undefined") return;
  const { pathname, search } = window.location;
  if (!pathname.startsWith("/studio") || pathname === "/studio/login") return;
  const next = pathname === "/studio" ? "" : `?next=${encodeURIComponent(pathname + search)}`;
  window.location.replace(`/studio/login${next}`);
}

/* -------------------------------------------------------------------------- */
/*  Low-level request helpers                                                  */
/* -------------------------------------------------------------------------- */

/** Parse the platform's error envelope off a failed response. */
async function toApiError(res: Response): Promise<StudioApiError> {
  let envelope: Partial<StudioErrorEnvelope> = {};
  try {
    envelope = (await res.json()) as Partial<StudioErrorEnvelope>;
  } catch {
    /* non-JSON body (a proxy error page, say) — fall back to the status */
  }
  const retryHeader = res.headers.get("Retry-After");
  const retryAfter = retryHeader && /^\d+$/.test(retryHeader) ? Number(retryHeader) : null;
  return new StudioApiError(res.status, envelope.message || `Request failed (${res.status})`, {
    code: envelope.code,
    errorCodes: envelope.error_codes,
    fieldErrors: envelope.errors ?? {},
    retryAfter,
  });
}

/**
 * One call to the staff API through the BFF. FormData bodies (media uploads)
 * set their own multipart boundary — never force a Content-Type on them.
 */
async function request<T>(
  endpoint: string,
  init: { method?: string; body?: object } = {},
): Promise<T> {
  const isForm = init.body instanceof FormData;
  const headers: Record<string, string> = isForm ? {} : { "Content-Type": "application/json" };

  let res: Response;
  try {
    res = await fetch(`${STUDIO_API_BASE}${endpoint}`, {
      method: init.method ?? "GET",
      headers,
      body: isForm ? (init.body as FormData) : init.body ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new StudioApiError(0, "Can’t reach the server — check your connection and try again.", {
      code: "network_error",
    });
  }

  if (!res.ok) throw await toApiError(res);
  // DELETEs and some actions answer 204 No Content — there is no body to parse.
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/**
 * Authenticated call. The BFF owns the token and already did the one
 * refresh-and-retry, so a 401 here means the session is genuinely gone.
 */
async function authRequest<T>(
  endpoint: string,
  init: { method?: string; body?: object } = {},
): Promise<T> {
  try {
    return await request<T>(endpoint, init);
  } catch (err) {
    if (err instanceof StudioApiError && err.status === 401) endStudioSession();
    throw err;
  }
}

/**
 * The same authenticated call, for the per-module services (faqService,
 * pagesService, careersService, adminService). They live in their own files so
 * this one stops growing, but they share this transport and its session.
 */
export const studioRequest = authRequest;

/** Build `?a=1&b=2` from a filter object, skipping empty values. */
export function query(params: object): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params) as [string, unknown][]) {
    if (v === undefined || v === null || v === "" || v === false) continue;
    qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

/* -------------------------------------------------------------------------- */
/*  Public API                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Sign in. The BFF calls `/api/v1/auth/login/` and keeps the token pair in
 * HttpOnly cookies, returning only the `me` payload.
 *
 * The platform signs in by **e-mail** (the old CMS used a username). Distinct
 * failures worth surfacing: 401 `invalid_credentials`, 403
 * `password_reset_required` (every migrated CMS account starts this way), and
 * 429 `login_locked` with `retryAfter` seconds.
 */
export async function login(email: string, password: string): Promise<StudioMe> {
  let res: Response;
  try {
    res = await fetch("/fe-api/studio/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    throw new StudioApiError(0, "Can’t reach the server — check your connection and try again.", {
      code: "network_error",
    });
  }
  if (!res.ok) throw await toApiError(res);
  const { me } = (await res.json()) as { me: StudioMe };
  return me;
}

/** Sign out: blacklists the refresh token on the platform, clears the cookies. */
export async function logout(): Promise<void> {
  try {
    await fetch("/fe-api/studio/logout", { method: "POST", cache: "no-store" });
  } catch {
    /* the cookies are cleared server-side on any reachable call; ignore */
  }
}

/** GET auth/me/ — the signed-in user, their role, permissions and scopes. */
export function getMe(): Promise<StudioMe> {
  return authRequest<StudioMe>("auth/me/");
}

/**
 * Shell metadata. The platform has no staff `config/` endpoint — the only
 * `config/` route belongs to the device-agent surface — and all five fields are
 * deployment constants, so they are assembled here rather than fetched.
 */
export function getConfig(): StudioConfig {
  return {
    environment: process.env.NODE_ENV === "production" ? "production" : "development",
    site_url: SITE_URL,
    blog_path: "/blog",
    media_base_url: "",
    delivery_api_base: `${PUBLIC_API_BASE_URL}content`,
  };
}

/**
 * Dashboard counters. The platform returns `{modules: {<module>: {<counter>:
 * n}}}` — nested per registry module, and only for modules the caller may
 * `view`, so every counter is optional. `flattenDashboardCounts` maps it onto
 * the flat shape the screens and sidebar badges use.
 */
export async function getDashboard(): Promise<StudioDashboard> {
  const [counters, entries, activity] = await Promise.all([
    authRequest<PlatformDashboard>("dashboard/"),
    // `recent_entries` and `recent_activity` no longer come from the dashboard.
    authRequest<Paginated<StudioEntryListItem>>("content/entries/?ordering=-updated_at&page_size=8").catch(
      () => ({ count: 0, next: null, previous: null, results: [] as StudioEntryListItem[] }),
    ),
    authRequest<Paginated<PlatformAuditRow>>("audit/?page_size=8").catch(
      () => ({ count: 0, next: null, previous: null, results: [] as PlatformAuditRow[] }),
    ),
  ]);
  return {
    counts: flattenDashboardCounts(counters),
    recent_entries: entries.results,
    recent_activity: activity.results.map(toActivityItem),
  };
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

/**
 * Image group on a template — `key` is the delivery contract, never rename it.
 * The parent template is in the URL, not the payload.
 */
export interface StudioTemplateImageGroup {
  uid: string;
  key: string;
  label: string;
  repeatable: boolean;
  max_items: number | null;
  required: boolean;
  /** Ordering within the template (was `order` on the CMS). */
  position: number;
  version: number;
}

/** Typed attribute slot on a template — rename `label`, never `key`. */
export interface StudioTemplateAttributeSlot {
  uid: string;
  key: string;
  label: string;
  type: StudioSlotType;
  options: Record<string, unknown>;
  required: boolean;
  position: number;
  version: number;
}

/** GET templates/ — the entry editor's structure definition. */
export interface StudioTemplate {
  uid: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  /** "used by N entries" badge. */
  entry_count: number;
  image_groups: StudioTemplateImageGroup[];
  attribute_slots: StudioTemplateAttributeSlot[];
}

/** GET collections/ — readable by any signed-in user. */
export function getCollections(): Promise<Paginated<StudioCollection>> {
  return authRequest<Paginated<StudioCollection>>("content/collections/");
}

/** POST collections/ — admin (schema editor) only; 403 otherwise. */
export function createCollection(body: {
  api_uid: string;
  singular_name: string;
  plural_name: string;
  /** Required by the platform — the collection's public route prefix. */
  path_prefix: string;
  description?: string;
}): Promise<StudioCollection> {
  return authRequest<StudioCollection>("content/collections/", { method: "POST", body });
}

/* ── Templates (schema editing — writes are admin only) ──────────────────── */

/** GET templates/ — readable by any signed-in user. */
export function getTemplates(): Promise<Paginated<StudioTemplate>> {
  return authRequest<Paginated<StudioTemplate>>("content/templates/");
}

/** POST templates/ — create a new (empty) template; admin (schema editor) only. */
export function createTemplate(body: {
  name: string;
  slug: string;
  description?: string;
}): Promise<StudioTemplate> {
  return authRequest<StudioTemplate>("content/templates/", { method: "POST", body });
}

/** POST templates/{id}/duplicate/ — deep copy (template + groups + slots). */
/** POST content/templates/{uid}/duplicate/ — `slug` is required. */
export function duplicateTemplate(uid: string, body: { slug: string; name?: string }): Promise<StudioTemplate> {
  return authRequest<StudioTemplate>(`content/templates/${uid}/duplicate/`, { method: "POST", body });
}

// Template children are nested under their template:
//   content/templates/<template_uid>/image-groups/[<uid>/]
//   content/templates/<template_uid>/attribute-slots/[<uid>/]

export function createImageGroup(
  templateUid: string,
  body: Omit<StudioTemplateImageGroup, "uid" | "version">,
): Promise<StudioTemplateImageGroup> {
  return authRequest<StudioTemplateImageGroup>(`content/templates/${templateUid}/image-groups/`, { method: "POST", body });
}

export function patchImageGroup(
  templateUid: string,
  uid: string,
  body: Partial<Pick<StudioTemplateImageGroup, "label" | "required" | "repeatable" | "max_items" | "position">> & {
    expected_version?: number;
  },
): Promise<StudioTemplateImageGroup> {
  return authRequest<StudioTemplateImageGroup>(`content/templates/${templateUid}/image-groups/${uid}/`, { method: "PATCH", body });
}

export function deleteImageGroup(templateUid: string, uid: string): Promise<void> {
  return authRequest<void>(`content/templates/${templateUid}/image-groups/${uid}/`, { method: "DELETE" });
}

export function createAttributeSlot(
  templateUid: string,
  body: Omit<StudioTemplateAttributeSlot, "uid" | "version">,
): Promise<StudioTemplateAttributeSlot> {
  return authRequest<StudioTemplateAttributeSlot>(`content/templates/${templateUid}/attribute-slots/`, { method: "POST", body });
}

export function patchAttributeSlot(
  templateUid: string,
  uid: string,
  body: Partial<Pick<StudioTemplateAttributeSlot, "label" | "required" | "type" | "options" | "position">> & {
    expected_version?: number;
  },
): Promise<StudioTemplateAttributeSlot> {
  return authRequest<StudioTemplateAttributeSlot>(`content/templates/${templateUid}/attribute-slots/${uid}/`, { method: "PATCH", body });
}

export function deleteAttributeSlot(templateUid: string, uid: string): Promise<void> {
  return authRequest<void>(`content/templates/${templateUid}/attribute-slots/${uid}/`, { method: "DELETE" });
}

/* ── Entries list + workflow actions ─────────────────────────────────────── */

/** GET entries/ — lightweight rows; open the entry for body content. */
export function getEntries(params?: {
  /** Collection uid or api_uid. */
  collection?: string;
  status?: StudioEntryStatus;
  category?: string;
  tag?: string;
  template?: string;
  author?: string;
  search?: string;
  /** Whitelisted: title, slug, status, sort_order, created_at, updated_at,
   *  published_on, published_at — prefix with "-" for descending. */
  ordering?: string;
  page?: number;
}): Promise<Paginated<StudioEntryListItem>> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v !== undefined && v !== "") qs.set(k, String(v));
  }
  const query = qs.toString();
  return authRequest<Paginated<StudioEntryListItem>>(`content/entries/${query ? `?${query}` : ""}`);
}

/**
 * POST content/entries/{uid}/<action>/ — each returns the **full entry detail**
 * (the CMS returned a stub). A failed publish is a 400 whose field errors carry
 * the reasons.
 */
function entryAction(uid: string, action: string, expectedVersion?: number): Promise<StudioEntryDetail> {
  return authRequest<StudioEntryDetail>(`content/entries/${uid}/${action}/`, {
    method: "POST",
    body: expectedVersion === undefined ? {} : { expected_version: expectedVersion },
  });
}

export const publishEntry = (uid: string, expectedVersion?: number) => entryAction(uid, "publish", expectedVersion);
export const unpublishEntry = (uid: string, expectedVersion?: number) => entryAction(uid, "unpublish", expectedVersion);
export const submitEntry = (uid: string, expectedVersion?: number) => entryAction(uid, "submit", expectedVersion);
export const archiveEntry = (uid: string, expectedVersion?: number) => entryAction(uid, "archive", expectedVersion);
export const restoreEntry = (uid: string, expectedVersion?: number) => entryAction(uid, "restore", expectedVersion);
export const verifyEntry = (uid: string, expectedVersion?: number) => entryAction(uid, "verify", expectedVersion);

/** POST content/entries/{uid}/duplicate/ → 201 with the new draft. */
export function duplicateEntry(uid: string): Promise<StudioEntryDetail> {
  return authRequest<StudioEntryDetail>(`content/entries/${uid}/duplicate/`, { method: "POST" });
}

/** Soft delete; frees the slug. `expected_version` rides the query string. */
export function deleteEntry(uid: string, expectedVersion?: number): Promise<void> {
  const qs = expectedVersion === undefined ? "" : `?expected_version=${expectedVersion}`;
  return authRequest<void>(`content/entries/${uid}/${qs}`, { method: "DELETE" });
}

/* ── Single entry (full read + write) ────────────────────────────────────── */

export interface EntryContentBlock {
  uid?: string;
  kind?: string;
  component: string;
  /** The block payload (was `body` on the CMS). */
  data: unknown[];
  /** Ordering within the entry (was `order`). */
  position: number;
}

export interface EntryImageRow {
  uid?: string;
  group_key: string;
  position: number;
  /** Nested media reference on read; send `media_asset_uid` on write. */
  media_asset: StudioMediaAsset | null;
  alt?: string;
  url?: string | null;
  external_url?: string;
}

export interface EntryAttributeValueRow {
  /** Attribute values have no identity of their own. */
  slot_key: string;
  value: unknown;
}

export interface EntrySeo {
  /** Was `meta_title` on the CMS. */
  seo_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: StudioMediaAsset | null;
  schema_type: string | null;
  schema_extra: Record<string, unknown> | null;
  noindex: boolean;
  seo_status: string | null;
  issues: { code: string; message: string }[];
}

/** What a write sends for the SEO block (uids, not nested objects). */
export interface EntrySeoInput {
  seo_title?: string | null;
  meta_description?: string | null;
  canonical_url?: string | null;
  keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image_uid?: string | null;
  schema_type?: string | null;
  schema_extra?: Record<string, unknown> | null;
  noindex?: boolean;
}

/** Image rows on write reference the asset by uid. */
export interface EntryImageInput {
  group_key: string;
  position: number;
  media_asset_uid?: string | null;
  alt?: string;
  external_url?: string;
}

/** GET entries/{id}/ — the full authoring shape (nested objects on read). */
export interface StudioEntryDetail {
  uid: string;
  /** Nested on read; write with `collection_uid`. */
  collection: { uid: string; api_uid: string; plural_name: string; path_prefix: string };
  template: { uid: string; slug: string; name: string } | null;
  title: string;
  slug: string;
  excerpt: string;
  summary: unknown[];
  introduction: unknown[];
  read_time: number | null;
  warning: string | null;
  insights: string | null;
  status: StudioEntryStatus;
  published_on: string | null;
  published_at: string | null;
  scheduled_for: string | null;
  archived_at: string | null;
  verified_at: string | null;
  locale: string | null;
  path: string | null;
  author: { uid: string; name: string; slug: string } | null;
  categories: StudioCategory[];
  tags: StudioTag[];
  badges: StudioBadge[];
  content_blocks: EntryContentBlock[];
  images: EntryImageRow[];
  attribute_values: EntryAttributeValueRow[];
  seo: EntrySeo | null;
  created_at: string;
  updated_at: string;
  version: number;
}

/** Write payload — uids for relations; children are replace-all on PATCH. */
export interface EntryWritePayload {
  collection_uid: string;
  template_uid?: string | null;
  title: string;
  slug: string;
  excerpt?: string;
  summary?: unknown[];
  introduction?: unknown[];
  read_time?: number | null;
  warning?: string | null;
  insights?: string | null;
  published_on?: string | null;
  author_uid?: string | null;
  category_uids?: string[];
  tag_uids?: string[];
  badge_uids?: string[];
  is_featured?: boolean;
  sort_order?: number;
  locale?: string;
  cover_image_uid?: string | null;
  content_blocks?: EntryContentBlock[];
  images?: EntryImageInput[];
  attribute_values?: EntryAttributeValueRow[];
  seo?: EntrySeoInput | null;
}

export function getEntry(uid: string): Promise<StudioEntryDetail> {
  return authRequest<StudioEntryDetail>(`content/entries/${uid}/`);
}

export function createEntry(body: EntryWritePayload): Promise<StudioEntryDetail> {
  return authRequest<StudioEntryDetail>("content/entries/", { method: "POST", body });
}

/** PATCH entries/{id}/ — omit a children key to leave it untouched; include it
 *  to replace the whole set. */
export function updateEntry(uid: string, body: Partial<EntryWritePayload>): Promise<StudioEntryDetail> {
  return authRequest<StudioEntryDetail>(`content/entries/${uid}/`, { method: "PATCH", body });
}

/** GET entries/check-slug/?collection=&slug= → availability + a suggestion. */
/**
 * GET content/entries/check-slug/ — `collection` takes a uid **or** an api_uid,
 * and `exclude` is the entry being edited so its own slug does not clash.
 */
export function checkSlug(
  collection: string,
  slug: string,
  exclude?: string,
): Promise<{ slug: string; available: boolean; suggestion: string; valid: boolean; error: string | null }> {
  const qs = new URLSearchParams({ collection, slug });
  if (exclude) qs.set("exclude", exclude);
  return authRequest(`content/entries/check-slug/?${qs.toString()}`);
}

/* ── Media library ───────────────────────────────────────────────────────── */

/** GET media-assets/ row. Always render `url` — CDN copy wins, local file is
 *  the fallback (resolved server-side). */
export interface StudioMediaAsset {
  uid: string;
  /** Resolved CDN URL — null for private files (use media/<uid>/signed-url/). */
  url: string | null;
  thumbnail_url: string | null;
  visibility: "PUBLIC" | "PRIVATE";
  kind: "IMAGE" | "DOCUMENT" | "SIGNATURE" | "RESUME" | "PHOTO";
  /** Flat string folder; the old per-collection scoping is gone. */
  folder: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  alternative_text: string;
  caption: string;
  checksum_sha256: string;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
  version: number;
}

/** GET media/ — a flat library; filter by exact `folder` or `search`. */
export function getMediaAssets(params?: {
  folder?: string;
  search?: string;
}): Promise<Paginated<StudioMediaAsset>> {
  const qs = new URLSearchParams();
  if (params?.folder) qs.set("folder", params.folder);
  if (params?.search) qs.set("search", params.search);
  const query = qs.toString();
  return authRequest<Paginated<StudioMediaAsset>>(`media/${query ? `?${query}` : ""}`);
}

/**
 * POST media/upload/ (multipart). `visibility` and `kind` are **required** by
 * the platform; Studio images are public images. The type is sniffed from the
 * content, and limits are enforced server-side (an oversized body is a 413).
 */
export function uploadMediaAsset(
  file: File,
  extra?: {
    visibility?: StudioMediaAsset["visibility"];
    kind?: StudioMediaAsset["kind"];
    folder?: string;
    alternative_text?: string;
    caption?: string;
  },
): Promise<StudioMediaAsset> {
  const form = new FormData();
  form.append("file", file);
  form.append("visibility", extra?.visibility ?? "PUBLIC");
  form.append("kind", extra?.kind ?? "IMAGE");
  if (extra?.folder) form.append("folder", extra.folder);
  if (extra?.alternative_text) form.append("alternative_text", extra.alternative_text);
  if (extra?.caption) form.append("caption", extra.caption);
  return authRequest<StudioMediaAsset>("media/upload/", { method: "POST", body: form });
}

/** PATCH media/{uid}/ — alt text and caption only; the file is immutable. */
export function patchMediaAsset(
  uid: string,
  body: Partial<Pick<StudioMediaAsset, "alternative_text" | "caption">> & { expected_version?: number },
): Promise<StudioMediaAsset> {
  return authRequest<StudioMediaAsset>(`media/${uid}/`, { method: "PATCH", body });
}

/**
 * DELETE media/{uid}/ — refused with 409 `media_in_use` while a live record
 * still references the asset; the blocking rows come back in the envelope's
 * `errors`. (The old CMS deleted regardless and let entries lose the image.)
 */
export function deleteMediaAsset(uid: string): Promise<void> {
  return authRequest<void>(`media/${uid}/`, { method: "DELETE" });
}

/** A 10-minute signed URL for a private file; public files return their CDN URL. */
export function mediaSignedUrl(uid: string): Promise<{ url: string; thumbnail_url: string | null; expires_at: string | null }> {
  return authRequest(`media/${uid}/signed-url/`);
}

/* ── Taxonomy lookups (standard CRUD, any signed-in role) ────────────────── */

export interface StudioAuthor {
  uid: string;
  name: string;
  slug: string;
  bio: string | null;
  role: string | null;
  entry_count: number;
  version: number;
}

export interface StudioCategory {
  uid: string;
  name: string;
  slug: string | null;
  entry_count: number;
  version: number;
}

export interface StudioTag {
  uid: string;
  name: string;
  /** New on the platform. */
  slug: string;
  entry_count: number;
  version: number;
}

export interface StudioBadge {
  uid: string;
  /** Was `label` on the CMS; the public delivery payload still says `label`. */
  name: string;
  slug: string;
  color: string;
  entry_count: number;
  version: number;
}

export function getAuthors(): Promise<Paginated<StudioAuthor>> {
  return authRequest<Paginated<StudioAuthor>>("content/authors/");
}

export function createAuthor(body: { name: string; bio?: string; role?: string }): Promise<StudioAuthor> {
  return authRequest<StudioAuthor>("content/authors/", { method: "POST", body });
}

export function getCategories(): Promise<Paginated<StudioCategory>> {
  return authRequest<Paginated<StudioCategory>>("content/categories/");
}

export function createCategory(body: { name: string; slug?: string }): Promise<StudioCategory> {
  return authRequest<StudioCategory>("content/categories/", { method: "POST", body });
}

export function getTags(): Promise<Paginated<StudioTag>> {
  return authRequest<Paginated<StudioTag>>("content/tags/");
}

export function createTag(body: { name: string }): Promise<StudioTag> {
  return authRequest<StudioTag>("content/tags/", { method: "POST", body });
}

export function getBadges(): Promise<Paginated<StudioBadge>> {
  return authRequest<Paginated<StudioBadge>>("content/badges/");
}

export function createBadge(body: { name: string; color?: string }): Promise<StudioBadge> {
  return authRequest<StudioBadge>("content/badges/", { method: "POST", body });
}

/* ── Users (Roles & access) — needs the `users` module ───────────────── */

/**
 * A row from `GET users/`. Unlike the old CMS this is NOT the `auth/me/` shape:
 * there is no `username` (e-mail is the login), the role is a nested object
 * rather than a numeric `access_role`, and permissions are not included — only
 * `auth/me/` carries grants, so a per-user matrix must join against `roles/`.
 */
export interface StudioUser {
  uid: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_e164: string | null;
  title: string | null;
  role: { uid: string; slug: string; name: string } | null;
  is_active: boolean;
  must_reset_password: boolean;
  last_login_at: string | null;
  password_changed_at: string | null;
  created_at: string;
  updated_at: string;
  version: number;
}

export function getUsers(): Promise<Paginated<StudioUser>> {
  return authRequest<Paginated<StudioUser>>("users/");
}

/**
 * POST users/ — creates the account **without** a password and e-mails an
 * invitation link, so no password is sent. `role` is the role's uid.
 */
export function createUser(body: {
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
  phone_e164?: string;
  title?: string;
}): Promise<StudioUser> {
  return authRequest<StudioUser>("users/", { method: "POST", body });
}

/**
 * PATCH users/{uid}/ — `is_active` is read-only here (use deactivate /
 * reactivate) and there is no password field (use forceUserReset). Changing
 * `email` or `role` needs `users.manage`.
 */
export function patchUser(
  uid: string,
  body: Partial<{
    email: string;
    first_name: string;
    last_name: string;
    phone_e164: string;
    title: string;
    /** The role's uid. */
    role: string;
    expected_version: number;
  }>,
): Promise<StudioUser> {
  return authRequest<StudioUser>(`users/${uid}/`, { method: "PATCH", body });
}

/** POST users/{uid}/deactivate/ — replaces the old DELETE. */
export function deactivateUser(uid: string, expectedVersion?: number): Promise<StudioUser> {
  return authRequest<StudioUser>(`users/${uid}/deactivate/`, {
    method: "POST",
    body: expectedVersion === undefined ? {} : { expected_version: expectedVersion },
  });
}

export function reactivateUser(uid: string, expectedVersion?: number): Promise<StudioUser> {
  return authRequest<StudioUser>(`users/${uid}/reactivate/`, {
    method: "POST",
    body: expectedVersion === undefined ? {} : { expected_version: expectedVersion },
  });
}

/** POST users/{uid}/force-reset/ — replaces PATCH-ing a new password in. */
export function forceUserReset(uid: string, expectedVersion?: number): Promise<StudioUser> {
  return authRequest<StudioUser>(`users/${uid}/force-reset/`, {
    method: "POST",
    body: expectedVersion === undefined ? {} : { expected_version: expectedVersion },
  });
}
