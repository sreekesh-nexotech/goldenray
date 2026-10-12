// src/services/faqService.ts
//
// FAQ module client (§6.4, §6.5) — admin-api/faqs/ and admin-api/faq-categories/
// on the CMS. Shares the Studio session via studioRequest.

import { studioRequest, query, type Paginated } from "./studioService";

export type FaqStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type SeoStatus = "ok" | "warning" | "error";

export interface SeoIssue {
  level: "error" | "warning";
  field: string;
  message: string;
}

export interface FaqCategory {
  uid: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  faq_count: number;
}

/** GET faqs/ row — exactly the §6.4 columns. */
export interface FaqListItem {
  uid: string;
  version: number;
  question: string;
  page: { uid: string; slug: string; route: string; title: string; status: string } | null;
  section: string;
  category: { uid: string; name: string; slug: string; is_active: boolean } | null;
  status: FaqStatus;
  sort_order: number;
  seo_status: SeoStatus;
  updated_by: { uid: string; full_name: string } | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/** GET faqs/{id}/ — the editor shape. */
export interface Faq extends FaqListItem {
  answer: string;
  seo_title: string;
  meta_description: string;
  canonical_url: string;
  og_image: { uid: string; url: string | null; alternative_text: string } | null;
  schema_type: string;
  schema_extra: Record<string, unknown>;
  noindex: boolean;
  seo_issues: SeoIssue[];
  /** What would block publishing right now; empty means Publish is allowed. */
  publish_errors: string[];
  archived_at: string | null;
  created_by: { uid: string; full_name: string } | null;
}

export interface FaqWrite {
  question: string;
  answer?: string;
  /** The page's uid — same key name as the CMS, but a uid now. Optional: a
   *  draft FAQ need not be attached to a page yet. */
  page?: string | null;
  section?: string;
  /** The category's uid. */
  category?: string | null;
  sort_order?: number;
  seo_title?: string;
  meta_description?: string;
  canonical_url?: string;
  schema_type?: string;
  noindex?: boolean;
}

export interface FaqFilters {
  search?: string;
  /** Filter by page uid (the CMS called this `page_id`). */
  page_uid?: string | "";
  route?: string;
  section?: string;
  /** Category uid. */
  category?: string | "";
  verified?: boolean;
  status?: FaqStatus | "";
  updated_after?: string;
  ordering?: string;
  include_archived?: boolean;
  page?: number;
}

export interface FaqPreview {
  question: string;
  answer: string;
  /** Free-form on the platform (a JSON field, not a typed pair). */
  page: Record<string, unknown> | null;
  section: string;
  position: number;
  url: string;
  schema: Record<string, unknown> | null;
  seo_issues: SeoIssue[];
  /** Platform additions. */
  status: FaqStatus;
  publish_errors: string[];
  seo_status: SeoStatus;
}

export function getFaqs(filters: FaqFilters = {}): Promise<Paginated<FaqListItem>> {
  return studioRequest(`faqs/${query(filters)}`);
}

export function getFaq(uid: string): Promise<Faq> {
  return studioRequest(`faqs/${uid}/`);
}

export function createFaq(body: FaqWrite): Promise<Faq> {
  return studioRequest("faqs/", { method: "POST", body });
}

export function updateFaq(uid: string, body: Partial<FaqWrite>): Promise<Faq> {
  return studioRequest(`faqs/${uid}/`, { method: "PATCH", body });
}

export function publishFaq(uid: string, expectedVersion?: number): Promise<Faq> {
  return studioRequest(`faqs/${uid}/publish/`, {
    method: "POST",
    body: expectedVersion === undefined ? {} : { expected_version: expectedVersion },
  });
}

export function unpublishFaq(uid: string, expectedVersion?: number): Promise<Faq> {
  return studioRequest(`faqs/${uid}/unpublish/`, {
    method: "POST",
    body: expectedVersion === undefined ? {} : { expected_version: expectedVersion },
  });
}

export function archiveFaq(uid: string, expectedVersion?: number): Promise<Faq> {
  return studioRequest(`faqs/${uid}/archive/`, {
    method: "POST",
    body: expectedVersion === undefined ? {} : { expected_version: expectedVersion },
  });
}

export function restoreFaq(uid: string, expectedVersion?: number): Promise<Faq> {
  return studioRequest(`faqs/${uid}/restore/`, {
    method: "POST",
    body: expectedVersion === undefined ? {} : { expected_version: expectedVersion },
  });
}

export function previewFaq(uid: string): Promise<FaqPreview> {
  return studioRequest(`faqs/${uid}/preview/`);
}

/** Renumber one page/section atomically — the order given wins. */
/**
 * Renumber one page/section atomically. `page` is the page's uid and `order` is
 * the FAQ uids in their new order (max 500, no duplicates). Returns a bare
 * array, not a page envelope.
 */
export function reorderFaqs(page: string, section: string, order: string[]): Promise<FaqListItem[]> {
  return studioRequest("faqs/reorder/", { method: "POST", body: { page, section, order } });
}

export function getFaqCategories(): Promise<Paginated<FaqCategory>> {
  return studioRequest("faq-categories/");
}

export function createFaqCategory(body: { name: string; slug: string; description?: string }): Promise<FaqCategory> {
  return studioRequest("faq-categories/", { method: "POST", body });
}

export function updateFaqCategory(uid: string, body: Partial<FaqCategory>): Promise<FaqCategory> {
  return studioRequest(`faq-categories/${uid}/`, { method: "PATCH", body });
}

export function deleteFaqCategory(uid: string): Promise<void> {
  return studioRequest(`faq-categories/${uid}/`, { method: "DELETE" });
}
