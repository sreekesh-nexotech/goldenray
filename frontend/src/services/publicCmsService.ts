// src/services/publicCmsService.ts
//
// Read-only delivery calls against the CMS's public API (the same host the
// blog reads from, see BLOG_API_BASE_URL). These are what make the Phase 1
// Studio modules visible on the website: FAQs (§6.4), Open Positions and job
// pages (§6.11), and the maintained page slots + SEO (§6.2, §6.16).
//
// Every function resolves to `null` on any failure rather than throwing. The
// callers all hold a built-in fallback (the copy the site shipped with), and a
// CMS outage must degrade to that copy, not to an error page.

import { BLOG_API_BASE_URL } from "../config";

const BASE = BLOG_API_BASE_URL.replace(/\/$/, "");

/** ISR window for server-side callers; client callers pass no-store. */
const REVALIDATE_SECONDS = 60;

async function getJson<T>(path: string, init: RequestInit = {}): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, init);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  FAQs                                                                       */
/* -------------------------------------------------------------------------- */

export interface PublicFaq {
  id: number;
  question: string;
  /** Plain text or light HTML, exactly as the editor stored it. */
  answer: string;
  section: string;
  category: string | null;
  order: number;
}

export interface PublicFaqResponse {
  data: PublicFaq[];
  meta: {
    page: { name: string; route: string };
    count: number;
    /** FAQPage JSON-LD built by the CMS from the same records, or null. */
    schema: Record<string, unknown> | null;
  };
}

/** Published FAQs for one page (and optionally one section), in display order. */
export function fetchPublicFaqs(route: string, section?: string): Promise<PublicFaqResponse | null> {
  const qs = new URLSearchParams({ page: route });
  if (section) qs.set("section", section);
  return getJson<PublicFaqResponse>(`/faqs?${qs.toString()}`, { cache: "no-store" });
}

/* -------------------------------------------------------------------------- */
/*  Careers                                                                    */
/* -------------------------------------------------------------------------- */

export interface PublicJobCard {
  id: number;
  slug: string;
  title: string;
  department: string | null;
  location: string;
  /** Display label, e.g. "Full-time". */
  employment_type: string;
  experience_required: string;
  application_deadline: string | null;
  published_at: string | null;
  is_open: boolean;
}

export interface PublicJobListResponse {
  data: PublicJobCard[];
  meta: {
    count: number;
    departments: { name: string; slug: string }[];
    accepting_general_applications: boolean;
    intro: string;
  };
}

export interface PublicJobDetail extends PublicJobCard {
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  application_instructions: string;
  seo: { title: string; description: string; canonical_url: string; noindex: boolean };
}

export interface PublicJobDetailResponse {
  data: PublicJobDetail;
  meta: { schema: Record<string, unknown> | null };
}

/** Open (published) positions — what the public Open Positions list shows. */
export function fetchPublicJobPositions(): Promise<PublicJobListResponse | null> {
  return getJson<PublicJobListResponse>("/job-positions", { cache: "no-store" });
}

/**
 * One posting by slug. Server-side callers get ISR; a closed posting comes
 * back with `is_open: false`, a draft/archived/unknown slug as null.
 */
export function fetchPublicJobPosition(slug: string): Promise<PublicJobDetailResponse | null> {
  return getJson<PublicJobDetailResponse>(`/job-positions/${encodeURIComponent(slug)}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
}

/* -------------------------------------------------------------------------- */
/*  Page maintenance (image slots, text slots, SEO)                            */
/* -------------------------------------------------------------------------- */

export interface PageImage {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
}

export interface PublicPageSeo {
  title: string;
  description: string;
  canonical_url: string;
  noindex: boolean;
  /** Social share image chosen in the Studio, or null to keep the shipped one. */
  og_image: PageImage | null;
  /** JSON-LD the CMS generated from the record (WebPage), or null. */
  schema: Record<string, unknown> | null;
}

export interface PublicPageContent {
  route: string;
  name: string;
  /** slot key → replaced image, or null when the shipped image still applies. */
  images: Record<string, PageImage | null>;
  /** slot key → corrected string; absent when nobody has overridden it. */
  text: Record<string, string>;
  seo: PublicPageSeo | null;
}

/** The maintained overrides for one route. Server-side; ISR'd. */
export async function fetchPageContent(route: string): Promise<PublicPageContent | null> {
  const res = await getJson<{ data: PublicPageContent }>(
    `/page-content?route=${encodeURIComponent(route)}`,
    { next: { revalidate: REVALIDATE_SECONDS } }
  );
  return res?.data ?? null;
}
