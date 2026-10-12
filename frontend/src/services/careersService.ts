// src/services/careersService.ts
//
// Careers module client (§6.10–§6.15) — departments, job positions and the
// overview on the CMS admin API. Applications stay on the main goldenray
// backend (see careerApplicationService); the two are joined client-side by
// the position id snapshotted onto each application.

import { studioRequest, query, type Paginated } from "./studioService";
import type { SeoIssue, SeoStatus } from "./faqService";

export type PositionStatus = "draft" | "published" | "closed" | "archived";
export type EmploymentType = "full_time" | "part_time" | "contract" | "internship" | "temporary";

export const EMPLOYMENT_TYPES: { key: EmploymentType; label: string }[] = [
  { key: "full_time", label: "Full-time" },
  { key: "part_time", label: "Part-time" },
  { key: "contract", label: "Contract" },
  { key: "internship", label: "Internship" },
  { key: "temporary", label: "Temporary" },
];

export interface Department {
  uid: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  job_count: number;
  open_job_count: number;
  created_at: string;
  updated_at: string;
  version: number;
}

export interface PositionListItem {
  uid: string;
  title: string;
  slug: string;
  /** The department's uid (a plain string here, not a nested object). */
  department: string;
  department_name: string;
  location: string;
  employment_type: EmploymentType;
  employment_type_label: string;
  status: PositionStatus;
  sort_order: number;
  application_count: number;
  seo_status: SeoStatus;
  application_deadline: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  /** Platform additions. */
  opens_on: string | null;
  openings: number;
  version: number;
}

export interface Position extends PositionListItem {
  experience_required: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  application_instructions: string;
  seo_title: string;
  meta_description: string;
  canonical_url: string;
  /** Nested media reference on read; a uid on write. */
  og_image: { uid: string; url: string | null; alternative_text: string } | null;
  og_title: string;
  og_description: string;
  schema_type: string;
  schema_extra: Record<string, unknown>;
  noindex: boolean;
  seo_issues: SeoIssue[];
  publish_errors: string[];
  public_url: string;
  closed_at: string | null;
}

export interface PositionWrite {
  title: string;
  slug: string;
  department: number;
  location: string;
  employment_type: EmploymentType;
  experience_required?: string;
  description?: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
  application_instructions?: string;
  application_deadline?: string | null;
  seo_title?: string;
  meta_description?: string;
  canonical_url?: string;
  schema_type?: string;
  noindex?: boolean;
}

export interface PositionFilters {
  search?: string;
  department?: number | "";
  location?: string;
  employment_type?: EmploymentType | "";
  status?: PositionStatus | "";
  include_archived?: boolean;
  page?: number;
}

export interface PositionPreview {
  url: string;
  title: string;
  description: string;
  department: string | null;
  location: string;
  employment_type: string;
  schema: Record<string, unknown> | null;
  seo_issues: SeoIssue[];
  publish_errors: string[];
}

export interface CareersOverview {
  counts: {
    active_positions: number;
    draft_positions: number;
    closed_positions: number;
    departments: number;
    /** Present only when the caller may view applications. */
    applications_total?: number;
    applications_new?: number;
  };
  open_positions: PositionListItem[];
}

/* ── Departments ─────────────────────────────────────────────────────────── */

export function getDepartments(filters: { search?: string; is_active?: boolean } = {}): Promise<Paginated<Department>> {
  return studioRequest(`careers/departments/${query(filters)}`);
}

export function createDepartment(body: { name: string; slug?: string; description?: string }): Promise<Department> {
  return studioRequest("careers/departments/", { method: "POST", body });
}

export function updateDepartment(uid: string, body: Partial<Department>): Promise<Department> {
  return studioRequest(`careers/departments/${uid}/`, { method: "PATCH", body });
}

/** 409 `department_in_use` while any job still belongs to the department. */
export function deleteDepartment(uid: string): Promise<void> {
  return studioRequest(`careers/departments/${uid}/`, { method: "DELETE" });
}

/* ── Positions ───────────────────────────────────────────────────────────── */

export function getPositions(filters: PositionFilters = {}): Promise<Paginated<PositionListItem>> {
  return studioRequest(`careers/positions/${query(filters)}`);
}

export function getPosition(uid: string): Promise<Position> {
  return studioRequest(`careers/positions/${uid}/`);
}

export function createPosition(body: PositionWrite): Promise<Position> {
  return studioRequest("careers/positions/", { method: "POST", body });
}

export function updatePosition(uid: string, body: Partial<PositionWrite>): Promise<Position> {
  return studioRequest(`careers/positions/${uid}/`, { method: "PATCH", body });
}

export function publishPosition(uid: string, expectedVersion?: number): Promise<Position> {
  return studioRequest(`careers/positions/${uid}/publish/`, {
    method: "POST",
    body: expectedVersion === undefined ? {} : { expected_version: expectedVersion },
  });
}

export function unpublishPosition(uid: string, expectedVersion?: number): Promise<Position> {
  return studioRequest(`careers/positions/${uid}/unpublish/`, {
    method: "POST",
    body: expectedVersion === undefined ? {} : { expected_version: expectedVersion },
  });
}

export function closePosition(uid: string, expectedVersion?: number): Promise<Position> {
  return studioRequest(`careers/positions/${uid}/close/`, {
    method: "POST",
    body: expectedVersion === undefined ? {} : { expected_version: expectedVersion },
  });
}

export function archivePosition(uid: string, expectedVersion?: number): Promise<Position> {
  return studioRequest(`careers/positions/${uid}/archive/`, {
    method: "POST",
    body: expectedVersion === undefined ? {} : { expected_version: expectedVersion },
  });
}

export function previewPosition(uid: string): Promise<PositionPreview> {
  return studioRequest(`careers/positions/${uid}/preview/`);
}

/* ── Overview ────────────────────────────────────────────────────────────── */

export function getCareersOverview(): Promise<CareersOverview> {
  return studioRequest("careers/overview/");
}
