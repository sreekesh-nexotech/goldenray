// src/services/adminService.ts
//
// Administration clients: Roles & Permissions matrix (§6.17), Settings (§6.18)
// and the SEO overview (§6.7). Small enough to share one file.

import {
  studioRequest,
  query,
  type Paginated,
  type StudioAction,
  type StudioModule,
  type StudioPermissionMap,
  type StudioScope,
  type StudioScopeMap,
} from "./studioService";
import type { SeoIssue, SeoStatus } from "./faqService";

/* ── Roles & permissions ─────────────────────────────────────────────────── */

export interface StudioRole {
  uid: string;
  name: string;
  slug: string;
  description: string;
  permissions: StudioPermissionMap;
  /** Record scope per module (`all`, `owned`, `assigned`, `office`, `self`). */
  scopes: StudioScopeMap;
  legacy_role: "admin" | "editor" | "author" | null;
  is_system: boolean;
  user_count: number;
  created_at: string;
  updated_at: string;
  version: number;
}

/** How many modules a role grants (the API no longer sends a count). */
export function roleModuleCount(role: StudioRole): number {
  return Object.keys(role.permissions ?? {}).length;
}

/**
 * GET roles/registry/ — the grid the Roles screen renders.
 *
 * Shaped differently from the old CMS registry: a group carries `key` + `label`
 * (not `title`), each module adds `scopes`, `default_scope`, `description` and
 * `permission_only`, and the payload gains top-level `scopes` and
 * `self_action_denied`.
 */
export interface PermissionRegistry {
  actions: { key: StudioAction; label: string }[];
  scopes: { key: StudioScope; label: string }[];
  groups: {
    key: string;
    label: string;
    modules: {
      key: StudioModule;
      label: string;
      actions: StudioAction[];
      scopes: StudioScope[];
      default_scope: StudioScope;
      description?: string;
      permission_only?: boolean;
    }[];
  }[];
  self_action_denied: { module: StudioModule; action: StudioAction }[];
}

export function getPermissionRegistry(): Promise<PermissionRegistry> {
  return studioRequest("roles/registry/");
}

export function getRoles(): Promise<Paginated<StudioRole>> {
  return studioRequest("roles/");
}

/** POST roles/ — `legacy_role` and `sort_order` are not accepted. */
export function createRole(
  body: Pick<StudioRole, "name" | "slug"> & Partial<Pick<StudioRole, "description" | "permissions" | "scopes">>,
): Promise<StudioRole> {
  return studioRequest("roles/", { method: "POST", body });
}

export function updateRole(
  uid: string,
  body: Partial<Pick<StudioRole, "name" | "description" | "permissions" | "scopes">> & { expected_version?: number },
): Promise<StudioRole> {
  return studioRequest(`roles/${uid}/`, { method: "PATCH", body });
}

/** Needs `roles.manage`; refused for system roles and roles still in use. */
export function deleteRole(uid: string): Promise<void> {
  return studioRequest(`roles/${uid}/`, { method: "DELETE" });
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

// The site settings singleton is the platform's company profile.
export function getSettings(): Promise<SiteSettings> {
  return studioRequest("company/profile/");
}

export function updateSettings(body: Partial<SiteSettings>): Promise<SiteSettings> {
  return studioRequest("company/profile/", { method: "PATCH", body });
}

/* ── SEO overview ────────────────────────────────────────────────────────── */

/** The platform also reports `blog` rows. */
export type SeoRecordKind = "page" | "faq" | "job" | "blog";

export interface SeoOverviewRow {
  kind: SeoRecordKind;
  uid: string;
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
  count: number;
  next: string | null;
  previous: string | null;
  /** Record types contributing to this overview. */
  kinds: string[];
}

export function getSeoOverview(filters: { kind?: SeoRecordKind | ""; seo_status?: SeoStatus | "" } = {}): Promise<SeoOverview> {
  return studioRequest(`seo/overview/${query(filters)}`);
}
