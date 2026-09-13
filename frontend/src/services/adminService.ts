// src/services/adminService.ts
//
// Administration clients: Roles & Permissions matrix (§6.17), Settings (§6.18)
// and the SEO overview (§6.7). Small enough to share one file.

import { studioRequest, query, type Paginated, type StudioAction, type StudioModule, type StudioPermissionMap } from "./studioService";
import type { SeoIssue, SeoStatus } from "./faqService";

/* ── Roles & permissions ─────────────────────────────────────────────────── */

export interface StudioRole {
  id: number;
  name: string;
  slug: string;
  description: string;
  permissions: StudioPermissionMap;
  legacy_role: "admin" | "editor" | "author";
  is_system: boolean;
  sort_order: number;
  module_count: number;
  user_count: number;
  created_at: string;
  updated_at: string;
}

/** GET auth/permission-registry/ — the grid the Roles screen renders. */
export interface PermissionRegistry {
  actions: { key: StudioAction; label: string }[];
  groups: {
    title: string;
    modules: { key: StudioModule; label: string; actions: StudioAction[] }[];
  }[];
}

export function getPermissionRegistry(): Promise<PermissionRegistry> {
  return studioRequest("auth/permission-registry/");
}

export function getRoles(): Promise<Paginated<StudioRole>> {
  return studioRequest("auth/roles/");
}

export function createRole(body: Pick<StudioRole, "name" | "slug" | "description" | "permissions" | "legacy_role">): Promise<StudioRole> {
  return studioRequest("auth/roles/", { method: "POST", body });
}

export function updateRole(id: number, body: Partial<Pick<StudioRole, "name" | "description" | "permissions" | "legacy_role" | "sort_order">>): Promise<StudioRole> {
  return studioRequest(`auth/roles/${id}/`, { method: "PATCH", body });
}

/** Refused for system roles and for roles still assigned to users. */
export function deleteRole(id: number): Promise<void> {
  return studioRequest(`auth/roles/${id}/`, { method: "DELETE" });
}

/* ── Settings ────────────────────────────────────────────────────────────── */

export interface SiteSettings {
  company_name: string;
  company_email: string;
  company_phone: string;
  address_line: string;
  address_locality: string;
  address_region: string;
  postal_code: string;
  country_code: string;
  lead_notification_emails: string;
  application_notification_emails: string;
  notify_on_new_lead: boolean;
  notify_on_new_application: boolean;
  lead_recipients: string[];
  application_recipients: string[];
  default_meta_description: string;
  default_og_image: number | null;
  careers_accepting_general_applications: boolean;
  careers_intro: string;
  updated_at: string;
}

export function getSettings(): Promise<SiteSettings> {
  return studioRequest("settings/");
}

export function updateSettings(body: Partial<SiteSettings>): Promise<SiteSettings> {
  return studioRequest("settings/", { method: "PATCH", body });
}

/* ── SEO overview ────────────────────────────────────────────────────────── */

export type SeoRecordKind = "page" | "faq" | "job";

export interface SeoOverviewRow {
  kind: SeoRecordKind;
  id: number;
  label: string;
  path: string;
  record_status: string;
  seo_title: string;
  meta_description: string;
  schema_type: string;
  noindex: boolean;
  seo_status: SeoStatus;
  issues: SeoIssue[];
}

export interface SeoOverview {
  counts: { error: number; warning: number; ok: number };
  results: SeoOverviewRow[];
}

export function getSeoOverview(filters: { kind?: SeoRecordKind | ""; seo_status?: SeoStatus | "" } = {}): Promise<SeoOverview> {
  return studioRequest(`seo/overview/${query(filters)}`);
}
