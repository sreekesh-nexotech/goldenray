// src/services/pagesService.ts
//
// Website page maintenance (§6.2) — admin-api/pages/ on the CMS. There is no
// create or delete: pages are real routes the site ships, registered by
// `manage.py seed_pages`. The Studio maintains slots and SEO on what exists.

import { studioRequest, query, type Paginated } from "./studioService";
import type { SeoIssue, SeoStatus } from "./faqService";

export type PageStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface PageListItem {
  uid: string;
  /** Was `name` on the CMS. */
  title: string;
  slug: string;
  route: string;
  group: string;
  status: PageStatus;
  is_protected: boolean;
  seo_status: SeoStatus;
  image_slot_count: number;
  text_slot_count: number;
  faq_count: number;
  sort_order: number;
  updated_at: string;
  verified_at: string | null;
  version: number;
}

export interface PageImageSlot {
  uid: string;
  key: string;
  label: string;
  guidance: string;
  /** Was `order`. */
  sort_order: number;
  /** Nested media reference; the five flat `asset_*` fields are gone. */
  asset: {
    uid: string;
    kind: string;
    visibility: string;
    url: string | null;
    alternative_text: string;
    width: number | null;
    height: number | null;
    mime_type: string;
  } | null;
  external_url: string | null;
  /** Was `alt_text`. */
  alt: string;
  effective_alt: string;
  updated_at: string;
  version: number;
}

export type TextSlotKind = "short_text" | "long_text" | "url" | "email" | "phone";

export interface PageTextSlot {
  uid: string;
  key: string;
  label: string;
  kind: TextSlotKind;
  guidance: string;
  value: string;
  max_length: number | null;
  sort_order: number;
  updated_at: string;
  version: number;
}

export interface PageSeo {
  /** Null until the first edit creates the row. */
  uid: string | null;
  seo_title: string;
  meta_description: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: { uid: string; url: string | null; alternative_text: string } | null;
  schema_type: string;
  schema_extra: Record<string, unknown>;
  noindex: boolean;
  seo_status: SeoStatus;
  seo_issues: SeoIssue[];
  updated_at: string;
  version: number;
}

/** What a SEO write accepts (uids, not nested objects). */
export interface PageSeoInput {
  seo_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string | null;
  schema_type?: string;
  schema_extra?: Record<string, unknown>;
  noindex?: boolean;
  expected_version?: number;
}

export interface PageDetail {
  uid: string;
  title: string;
  slug: string;
  route: string;
  description: string;
  group: string;
  status: PageStatus;
  is_protected: boolean;
  sort_order: number;
  seo: PageSeo | null;
  image_slots: PageImageSlot[];
  text_slots: PageTextSlot[];
  faq_count: number;
  created_at: string;
  updated_at: string;
  verified_at: string | null;
  version: number;
}

export interface PagePreview {
  url: string;
  status: PageStatus;
  title: string;
  description: string;
  noindex: boolean;
  schema: Record<string, unknown> | null;
  seo_status: SeoStatus;
  seo_issues: SeoIssue[];
  /** The public payload's data; the CMS split this into slot arrays. */
  content: Record<string, unknown> | null;
}

/**
 * Which API mount to talk to. `pages/` needs the `pages` module; `career-page/`
 * is the same surface pinned to /career and granted by `career_page` (§6.16),
 * so the Career/HR role can maintain that one page without general website
 * access. Every call below takes the mount so one screen serves both.
 */
export type PagesMount = "pages" | "career-page";

export function getPages(
  filters: { search?: string; status?: string; group?: string } = {},
  mount: PagesMount = "pages"
): Promise<Paginated<PageListItem>> {
  return studioRequest(`${mount}/${query(filters)}`);
}

export function getPage(uid: string, mount: PagesMount = "pages"): Promise<PageDetail> {
  return studioRequest(`${mount}/${uid}/`);
}

/**
 * PATCH {mount}/{uid}/ — the platform accepts **only** `sort_order` here.
 * `status` moves through the workflow actions below.
 */
export function updatePage(
  uid: string,
  body: { sort_order?: number; expected_version?: number },
  mount: PagesMount = "pages"
): Promise<PageDetail> {
  return studioRequest(`${mount}/${uid}/`, { method: "PATCH", body });
}

export function updatePageSeo(uid: string, body: PageSeoInput, mount: PagesMount = "pages"): Promise<PageSeo> {
  return studioRequest(`${mount}/${uid}/seo/`, { method: "PATCH", body });
}

/** Slots are addressed by their **key**, not an id. */
export function updateImageSlot(
  pageUid: string,
  slotKey: string,
  body: { asset?: string | null; alt?: string; external_url?: string | null; expected_version?: number },
  mount: PagesMount = "pages"
): Promise<PageImageSlot> {
  return studioRequest(`${mount}/${pageUid}/image-slots/${slotKey}/`, { method: "PATCH", body });
}

export function updateTextSlot(
  pageUid: string,
  slotKey: string,
  body: { value: string; expected_version?: number },
  mount: PagesMount = "pages"
): Promise<PageTextSlot> {
  return studioRequest(`${mount}/${pageUid}/text-slots/${slotKey}/`, { method: "PATCH", body });
}

export function previewPage(uid: string, mount: PagesMount = "pages"): Promise<PagePreview> {
  return studioRequest(`${mount}/${uid}/preview/`);
}

/**
 * Publication workflow. `pages/` has all five; `career-page/` mounts only
 * publish and unpublish.
 */
function pageAction(mount: PagesMount, uid: string, action: string, expectedVersion?: number): Promise<PageDetail> {
  return studioRequest(`${mount}/${uid}/${action}/`, {
    method: "POST",
    body: expectedVersion === undefined ? {} : { expected_version: expectedVersion },
  });
}

export const publishPage = (uid: string, expectedVersion?: number, mount: PagesMount = "pages") =>
  pageAction(mount, uid, "publish", expectedVersion);
export const unpublishPage = (uid: string, expectedVersion?: number, mount: PagesMount = "pages") =>
  pageAction(mount, uid, "unpublish", expectedVersion);
export const archivePage = (uid: string, expectedVersion?: number) => pageAction("pages", uid, "archive", expectedVersion);
export const restorePage = (uid: string, expectedVersion?: number) => pageAction("pages", uid, "restore", expectedVersion);
export const verifyPage = (uid: string, expectedVersion?: number) => pageAction("pages", uid, "verify", expectedVersion);
