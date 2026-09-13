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
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  job_count: number;
  open_job_count: number;
  created_at: string;
  updated_at: string;
}

export interface PositionListItem {
  id: number;
  title: string;
  slug: string;
  department: number;
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
  og_image: number | null;
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
  };
  open_positions: PositionListItem[];
}

/* ── Departments ─────────────────────────────────────────────────────────── */

export function getDepartments(filters: { search?: string; is_active?: boolean } = {}): Promise<Paginated<Department>> {
  return studioRequest(`departments/${query(filters)}`);
}

export function createDepartment(body: { name: string; slug: string; description?: string }): Promise<Department> {
  return studioRequest("departments/", { method: "POST", body });
}

export function updateDepartment(id: number, body: Partial<Department>): Promise<Department> {
  return studioRequest(`departments/${id}/`, { method: "PATCH", body });
}

/** Refused with a 400 while any job still belongs to the department (§6.15). */
export function deleteDepartment(id: number): Promise<void> {
  return studioRequest(`departments/${id}/`, { method: "DELETE" });
}

/* ── Positions ───────────────────────────────────────────────────────────── */

export function getPositions(filters: PositionFilters = {}): Promise<Paginated<PositionListItem>> {
  return studioRequest(`job-positions/${query(filters)}`);
}

export function getPosition(id: number): Promise<Position> {
  return studioRequest(`job-positions/${id}/`);
}

export function createPosition(body: PositionWrite): Promise<Position> {
  return studioRequest("job-positions/", { method: "POST", body });
}

export function updatePosition(id: number, body: Partial<PositionWrite>): Promise<Position> {
  return studioRequest(`job-positions/${id}/`, { method: "PATCH", body });
}

export function publishPosition(id: number): Promise<Position> {
  return studioRequest(`job-positions/${id}/publish/`, { method: "POST" });
}

export function unpublishPosition(id: number): Promise<Position> {
  return studioRequest(`job-positions/${id}/unpublish/`, { method: "POST" });
}

export function closePosition(id: number): Promise<Position> {
  return studioRequest(`job-positions/${id}/close/`, { method: "POST" });
}

export function archivePosition(id: number): Promise<Position> {
  return studioRequest(`job-positions/${id}/archive/`, { method: "POST" });
}

export function previewPosition(id: number): Promise<PositionPreview> {
  return studioRequest(`job-positions/${id}/preview/`);
}

/* ── Overview ────────────────────────────────────────────────────────────── */

export function getCareersOverview(): Promise<CareersOverview> {
  return studioRequest("careers/overview/");
}
