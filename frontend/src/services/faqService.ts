// src/services/faqService.ts
//
// FAQ module client (§6.4, §6.5) — admin-api/faqs/ and admin-api/faq-categories/
// on the CMS. Shares the Studio session via studioRequest.

import { studioRequest, query, type Paginated } from "./studioService";

export type FaqStatus = "draft" | "published" | "archived";
export type SeoStatus = "ok" | "warning" | "error";

export interface SeoIssue {
  level: "error" | "warning";
  field: string;
  message: string;
}

export interface FaqCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  faq_count: number;
}

/** GET faqs/ row — exactly the §6.4 columns. */
export interface FaqListItem {
  id: number;
  question: string;
  page: number;
  page_name: string;
  page_route: string;
  section: string;
  category: number | null;
  category_name: string | null;
  status: FaqStatus;
  display_order: number;
  seo_status: SeoStatus;
  updated_by_name: string | null;
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
  og_image: number | null;
  schema_type: string;
  schema_extra: Record<string, unknown>;
  noindex: boolean;
  seo_issues: SeoIssue[];
  /** What would block publishing right now; empty means Publish is allowed. */
  publish_errors: string[];
  archived_at: string | null;
  created_by_name: string | null;
}

export interface FaqWrite {
  question: string;
  answer: string;
  page: number;
  section?: string;
  category?: number | null;
  display_order?: number;
  seo_title?: string;
  meta_description?: string;
  canonical_url?: string;
  schema_type?: string;
  noindex?: boolean;
}

export interface FaqFilters {
  search?: string;
  page_id?: number | "";
  section?: string;
  category?: number | "";
  status?: FaqStatus | "";
  updated_after?: string;
  ordering?: string;
  include_archived?: boolean;
  page?: number;
}

export interface FaqPreview {
  question: string;
  answer: string;
  page: { name: string; route: string };
  section: string;
  position: number;
  url: string;
  schema: Record<string, unknown> | null;
  seo_issues: SeoIssue[];
}

export function getFaqs(filters: FaqFilters = {}): Promise<Paginated<FaqListItem>> {
  return studioRequest(`faqs/${query(filters)}`);
}

export function getFaq(id: number): Promise<Faq> {
  return studioRequest(`faqs/${id}/`);
}

export function createFaq(body: FaqWrite): Promise<Faq> {
  return studioRequest("faqs/", { method: "POST", body });
}

export function updateFaq(id: number, body: Partial<FaqWrite>): Promise<Faq> {
  return studioRequest(`faqs/${id}/`, { method: "PATCH", body });
}

export function publishFaq(id: number): Promise<Faq> {
  return studioRequest(`faqs/${id}/publish/`, { method: "POST" });
}

export function unpublishFaq(id: number): Promise<Faq> {
  return studioRequest(`faqs/${id}/unpublish/`, { method: "POST" });
}

export function archiveFaq(id: number): Promise<Faq> {
  return studioRequest(`faqs/${id}/archive/`, { method: "POST" });
}

export function restoreFaq(id: number): Promise<Faq> {
  return studioRequest(`faqs/${id}/restore/`, { method: "POST" });
}

export function previewFaq(id: number): Promise<FaqPreview> {
  return studioRequest(`faqs/${id}/preview/`);
}

/** Renumber one page/section atomically — the order given wins. */
export function reorderFaqs(page: number, section: string, order: number[]): Promise<FaqListItem[]> {
  return studioRequest("faqs/reorder/", { method: "POST", body: { page, section, order } });
}

export function getFaqCategories(): Promise<Paginated<FaqCategory>> {
  return studioRequest("faq-categories/");
}

export function createFaqCategory(body: { name: string; slug: string; description?: string }): Promise<FaqCategory> {
  return studioRequest("faq-categories/", { method: "POST", body });
}

export function updateFaqCategory(id: number, body: Partial<FaqCategory>): Promise<FaqCategory> {
  return studioRequest(`faq-categories/${id}/`, { method: "PATCH", body });
}

export function deleteFaqCategory(id: number): Promise<void> {
  return studioRequest(`faq-categories/${id}/`, { method: "DELETE" });
}
