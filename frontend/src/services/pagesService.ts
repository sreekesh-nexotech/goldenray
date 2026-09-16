// src/services/pagesService.ts
//
// Website page maintenance (§6.2) — admin-api/pages/ on the CMS. There is no
// create or delete: pages are real routes the site ships, registered by
// `manage.py seed_pages`. The Studio maintains slots and SEO on what exists.

import { studioRequest, query, type Paginated } from "./studioService";
import type { SeoIssue, SeoStatus } from "./faqService";

export type PageStatus = "draft" | "published" | "archived";

export interface PageListItem {
  id: number;
  name: string;
  route: string;
  group: string;
  status: PageStatus;
  is_protected: boolean;
  seo_status: SeoStatus;
  image_slot_count: number;
  faq_count: number;
  sort_order: number;
  updated_at: string;
}

export interface PageImageSlot {
  id: number;
  key: string;
  label: string;
  guidance: string;
  order: number;
  asset: number | null;
  asset_url: string | null;
  asset_filename: string | null;
  asset_width: number | null;
  asset_height: number | null;
  alt_text: string;
  effective_alt: string;
  updated_at: string;
}

export type TextSlotKind = "short_text" | "long_text" | "url" | "email" | "phone";

export interface PageTextSlot {
  id: number;
  key: string;
  label: string;
  kind: TextSlotKind;
  guidance: string;
  value: string;
  max_length: number | null;
  order: number;
  updated_at: string;
}

export interface PageSeo {
  id: number;
  seo_title: string;
  meta_description: string;
  canonical_url: string;
  og_image: number | null;
  og_image_url: string | null;
  schema_type: string;
  schema_extra: Record<string, unknown>;
  noindex: boolean;
  seo_status: SeoStatus;
  seo_issues: SeoIssue[];
  updated_at: string;
}

export interface PageDetail {
  id: number;
  name: string;
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
}

export interface PagePreview {
  url: string;
  title: string;
  description: string;
  noindex: boolean;
  schema: Record<string, unknown> | null;
  seo_issues: SeoIssue[];
  image_slots: PageImageSlot[];
  text_slots: PageTextSlot[];
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

export function getPage(id: number, mount: PagesMount = "pages"): Promise<PageDetail> {
  return studioRequest(`${mount}/${id}/`);
}

export function updatePage(
  id: number,
  body: { status?: PageStatus; sort_order?: number },
  mount: PagesMount = "pages"
): Promise<PageDetail> {
  return studioRequest(`${mount}/${id}/`, { method: "PATCH", body });
}

export function updatePageSeo(id: number, body: Partial<PageSeo>, mount: PagesMount = "pages"): Promise<PageSeo> {
  return studioRequest(`${mount}/${id}/seo/`, { method: "PATCH", body });
}

export function updateImageSlot(
  pageId: number,
  slotId: number,
  body: { asset?: number | null; alt_text?: string },
  mount: PagesMount = "pages"
): Promise<PageImageSlot> {
  return studioRequest(`${mount}/${pageId}/image-slots/${slotId}/`, { method: "PATCH", body });
}

export function updateTextSlot(
  pageId: number,
  slotId: number,
  body: { value: string },
  mount: PagesMount = "pages"
): Promise<PageTextSlot> {
  return studioRequest(`${mount}/${pageId}/text-slots/${slotId}/`, { method: "PATCH", body });
}

export function previewPage(id: number, mount: PagesMount = "pages"): Promise<PagePreview> {
  return studioRequest(`${mount}/${id}/preview/`);
}
