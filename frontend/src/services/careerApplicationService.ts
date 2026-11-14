// src/services/careerApplicationService.ts
import { PUBLIC_API_BASE_URL } from "../config";
import { newIdempotencyKey } from "../utils/fetchApi";
import { StudioApiError, studioRequest, type Paginated } from "./studioService";

export interface JobApplicationData {
  // Which opening this application is for. Defaults to "General application"
  // — the general form sends no position, and a posting page sends its title.
  position?: string;
  // The posting answered, when there is one: its uid plus a snapshot of the
  // title and department at submission time.
  position_id?: string | null;
  position_title?: string;
  department_name?: string;

  // Personal information
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio_website?: string;

  // Professional details (all optional)
  current_company?: string;
  current_role?: string;
  total_experience?: string;
  relevant_experience?: string;
  current_salary?: string;
  expected_salary?: string;
  notice_period?: string;
  heard_about_us?: string;

  // General-application extras
  availability?: string;
  cover_note?: string;

  // Declaration checkbox — must be true.
  declaration_accepted: boolean;

  // Uploads
  resume: File;
  portfolio_file?: File | null;

  // Honeypot. Must be sent empty. Hidden field on the form; bots that
  // autofill it will fail validation server-side.
  website?: string;
}

export interface JobApplicationResponse {
  uid: string;
  display_position: string;
  created_at: string;
  message: string;
  // Error envelope of the platform API ({code, message, errors}).
  code?: string;
  errors?: Record<string, string[]>;
}

// This endpoint uploads files, so it must be sent as multipart/form-data.
// The shared `apiCall` / `fetchApi` helper sends JSON only, so we post the
// FormData directly here. We do NOT set Content-Type — the browser adds the
// multipart boundary automatically.
export async function submitJobApplication(
  data: JobApplicationData
): Promise<JobApplicationResponse> {
  const fd = new FormData();
  fd.append("position", data.position ?? "General application");
  if (data.position_id) {
    fd.append("position_id", String(data.position_id));
    fd.append("position_title", data.position_title ?? data.position ?? "");
    fd.append("department_name", data.department_name ?? "");
  } else if (data.department_name) {
    // General application: the applicant's area of interest.
    fd.append("department_name", data.department_name);
  }
  fd.append("full_name", data.full_name);
  fd.append("email", data.email);
  fd.append("phone", data.phone);
  fd.append("location", data.location);
  fd.append("linkedin", data.linkedin);
  if (data.portfolio_website) fd.append("portfolio_website", data.portfolio_website);

  // Optional professional details — only append if set.
  const optional: (keyof JobApplicationData)[] = [
    "current_company",
    "current_role",
    "total_experience",
    "relevant_experience",
    "current_salary",
    "expected_salary",
    "notice_period",
    "heard_about_us",
    "availability",
    "cover_note",
  ];
  for (const key of optional) {
    const value = data[key];
    if (value) fd.append(key, String(value));
  }

  fd.append("declaration_accepted", String(data.declaration_accepted));
  fd.append("resume", data.resume);
  if (data.portfolio_file) fd.append("portfolio_file", data.portfolio_file);
  fd.append("website", data.website ?? ""); // honeypot

  try {
    const response = await fetch(`${PUBLIC_API_BASE_URL}job-applications/`, {
      method: "POST",
      headers: { "Idempotency-Key": newIdempotencyKey() },
      body: fd,
    });

    const json = (await response.json().catch(() => ({}))) as JobApplicationResponse;

    if (!response.ok) {
      const error = new Error(
        json?.message || `HTTP error! Status: ${response.status}`
      ) as Error & { status: number; errorData: JobApplicationResponse };
      error.status = response.status;
      error.errorData = json;
      throw error;
    }

    return json;
  } catch (error) {
    console.error("Error submitting job application!", error);
    throw error;
  }
}

/**
 * A stored career application, as `GET careers/applications/` returns it.
 *
 * Note `position` changed meaning in the platform API: it used to be the
 * free-text job title, and is now the **posting's uid**. The human-readable
 * title is `position_label` (what the applicant typed) or `display_position`
 * (the posting's title when linked, else the label).
 */
export interface CareerApplication {
  uid: string;
  /** The linked posting's uid, or null for a general application. */
  position: string | null;
  /** Free text the applicant entered. */
  position_label: string;

  name: string;
  email: string;
  phone_e164: string;
  location: string;
  linkedin: string;
  portfolio_website: string;

  current_company: string;
  current_role: string;
  total_experience: string;
  relevant_experience: string;
  current_salary: string;
  expected_salary: string;
  notice_period: string;
  heard_about_us: string;
  /** General application only. Absent on rows from before the column existed. */
  availability?: string;
  cover_letter?: string;

  /** File metadata only — the bytes come from a signed download link. */
  resume: StoredFile | null;
  portfolio: StoredFile | null;
  has_resume: boolean;
  has_portfolio: boolean;

  declaration_accepted: boolean;
  /** ISO-8601 UTC timestamp of when the application was submitted. */
  created_at: string;

  /** Snapshot of the posting's title at submission; empty for general applications. */
  position_title: string;
  /** Snapshot of the posting's department at submission. */
  department_name: string;
  /** `position_title` when set, else the free-text `position_label`. */
  display_position: string;
  status: ApplicationStatus;
  status_changed_at: string | null;
  /** Who is handling it, when someone has been assigned. */
  assignee: { uid: string; name: string } | null;
  /** How the application arrived. */
  source: "WEBSITE" | "IMPORT";
  archived: boolean;
  /** Set when retired from the queue; the record is never deleted. */
  archived_at: string | null;
  updated_at: string;
  version: number;
}

/** An uploaded file's metadata; download it through applicationFileLink(). */
export interface StoredFile {
  filename: string;
  mime_type: string;
  size_bytes: number;
}

/** A signed, short-lived download URL — it carries no Authorization header. */
export interface ApplicationFileLink {
  url: string;
  expires_at: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
}

/**
 * The platform's hiring pipeline. This is a different state machine from the
 * old CMS's, not just a re-casing: `reviewing` became SCREENING, `selected`
 * split into OFFERED and HIRED, and WITHDRAWN is new.
 */
export type ApplicationStatus =
  | "NEW"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFERED"
  | "HIRED"
  | "REJECTED"
  | "WITHDRAWN";

export const APPLICATION_STATUSES: { key: ApplicationStatus; label: string }[] = [
  { key: "NEW", label: "New" },
  { key: "SCREENING", label: "Screening" },
  { key: "INTERVIEW", label: "Interview" },
  { key: "OFFERED", label: "Offered" },
  { key: "HIRED", label: "Hired" },
  { key: "REJECTED", label: "Rejected" },
  { key: "WITHDRAWN", label: "Withdrawn" },
];

export interface ApplicationNote {
  uid: string;
  /** The author's uid; `author_name` is the display string. */
  author: string | null;
  author_name: string;
  body: string;
  created_at: string;
}

export interface ApplicationEvent {
  /** Timeline rows have no id of their own. */
  kind: "RECEIVED" | "STATUS" | "ASSIGNED" | "ASSIGNEE" | "ARCHIVED" | "RESTORED" | "NOTE";
  kind_label: string;
  from_status: string;
  to_status: string;
  detail: string;
  actor: string | null;
  actor_name: string;
  created_at: string;
}

/** GET job-applications/{id}/ — the application plus notes and timeline. */
export interface CareerApplicationDetail extends CareerApplication {
  notes: ApplicationNote[];
  events: ApplicationEvent[];
  /** Statuses this one may move to from where it is now. */
  allowed_transitions: ApplicationStatus[];
}

/* -------------------------------------------------------------------------- */
/*  Studio calls — the platform staff API, through the Studio's BFF             */
/* -------------------------------------------------------------------------- */
//
// These need the `applications` module. They share studioService's transport,
// so the session, refresh and error envelope are the same as everywhere else.

/**
 * The application queue, newest first. Archived rows are left out unless asked
 * for. Feeds Careers → Applications.
 *
 * The platform paginates this list; the old endpoint returned a bare array.
 */
export async function getCareerApplications(
  opts: { includeArchived?: boolean } = {},
): Promise<CareerApplication[]> {
  const qs = opts.includeArchived ? "?include_archived=true&page_size=200" : "?page_size=200";
  const page = await studioRequest<Paginated<CareerApplication>>(`careers/applications/${qs}`);
  return page.results;
}

export function getCareerApplication(uid: string): Promise<CareerApplicationDetail> {
  return studioRequest(`careers/applications/${uid}/`);
}

/** Move an application along the pipeline; the backend refuses illegal jumps. */
export function setApplicationStatus(
  uid: string,
  status: ApplicationStatus,
  note = "",
  expectedVersion?: number,
): Promise<CareerApplicationDetail> {
  return studioRequest(`careers/applications/${uid}/status/`, {
    method: "POST",
    body: { status, ...(note ? { note } : {}), ...(expectedVersion === undefined ? {} : { expected_version: expectedVersion }) },
  });
}

/**
 * Link a general application to a posting and/or set who is handling it. The
 * posting's title and department are snapshotted server-side, so only uids are
 * sent. At least one of `position` / `assignee` is required.
 */
export function assignApplication(
  uid: string,
  body: { position?: string; assignee?: string | null; expected_version?: number },
): Promise<CareerApplicationDetail> {
  return studioRequest(`careers/applications/${uid}/assign/`, { method: "POST", body });
}

/** Adds one internal note and returns **that note**, not the application. */
export function addApplicationNote(uid: string, body: string): Promise<ApplicationNote> {
  return studioRequest(`careers/applications/${uid}/notes/`, { method: "POST", body: { body } });
}

/** The full note history (the detail payload carries only the newest 100). */
export async function getApplicationNotes(uid: string): Promise<ApplicationNote[]> {
  const page = await studioRequest<Paginated<ApplicationNote>>(`careers/applications/${uid}/notes/`);
  return page.results;
}

/** The timeline. Cursor-paginated, so the envelope carries no `count`. */
export async function getApplicationEvents(uid: string): Promise<ApplicationEvent[]> {
  const page = await studioRequest<{ results: ApplicationEvent[] }>(`careers/applications/${uid}/events/`);
  return page.results;
}

export function restoreApplication(uid: string, expectedVersion?: number): Promise<CareerApplicationDetail> {
  return studioRequest(`careers/applications/${uid}/restore/`, {
    method: "POST",
    body: expectedVersion === undefined ? {} : { expected_version: expectedVersion },
  });
}

/**
 * Retire an application from the queue. The backend archives rather than
 * deletes: the row, files, notes and timeline all survive and can be restored.
 */
export async function archiveCareerApplication(uid: string, expectedVersion?: number): Promise<void> {
  const qs = expectedVersion === undefined ? "" : `?expected_version=${expectedVersion}`;
  try {
    await studioRequest<void>(`careers/applications/${uid}/${qs}`, { method: "DELETE" });
  } catch (err) {
    // 404 = already gone, which is the state the caller wanted.
    if (err instanceof StudioApiError && err.status === 404) return;
    throw err;
  }
}

/** @deprecated use archiveCareerApplication — the backend never hard-deletes. */
export const deleteCareerApplication = archiveCareerApplication;

/** A short-lived signed URL for a resume / portfolio. */
export function applicationFileLink(uid: string, kind: "resume" | "portfolio"): Promise<ApplicationFileLink> {
  return studioRequest(`careers/applications/${uid}/download/${kind}/`);
}

/**
 * Download a resume / portfolio. The platform hands back a pre-signed URL that
 * needs no Authorization header, so the browser can fetch it directly — no
 * blob round-trip.
 */
export async function downloadApplicationFile(uid: string, kind: "resume" | "portfolio"): Promise<void> {
  const link = await applicationFileLink(uid, kind);
  const a = document.createElement("a");
  a.href = link.url;
  a.download = link.filename || `${kind}-${uid}`;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
