// src/services/careerApplicationService.ts
import { API_BASE_URL } from "../config";
import { getStudioAccessToken, refreshStudioAccessToken } from "./studioService";

export interface JobApplicationData {
  // Which opening this application is for. Defaults to "General application"
  // — the general form sends no position, and a posting page sends its title.
  position?: string;
  // The Studio posting answered, when there is one (§6.14): its CMS id plus a
  // snapshot of the title and department at submission time.
  position_id?: number | null;
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
  message: string;
  status: "success" | "error";
  data?: {
    id: number;
    created_at: string;
    [key: string]: unknown;
  };
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
    const response = await fetch(`${API_BASE_URL}job-applications/`, {
      method: "POST",
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

/** A stored career application as returned by GET job-applications/. */
export interface CareerApplication {
  id: number;
  position: string;

  full_name: string;
  email: string;
  phone: string;
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
  cover_note?: string;

  /**
   * Raw MEDIA_URL location of the upload. Only reachable while Django runs with
   * DEBUG on — in production /media/ is not proxied to the backend, so this
   * 404s. Prefer `resume_download_url`.
   */
  resume: string | null;
  /** Raw MEDIA_URL location of the optional portfolio upload. See `resume`. */
  portfolio_file: string | null;

  /** /api/ download route that streams the resume as an attachment. */
  resume_download_url: string | null;
  /** /api/ download route for the optional portfolio file. */
  portfolio_download_url: string | null;

  declaration_accepted: boolean;
  /** ISO-8601 UTC timestamp of when the application was submitted. */
  created_at: string;

  // ── Phase 1 workflow (§6.13, §6.14) ──────────────────────────────────────
  /** CMS job position id this answered, if any (no FK — different database). */
  position_id: number | null;
  /** Snapshot of the posting's title at submission; empty for general applications. */
  position_title: string;
  /** Snapshot of the posting's department at submission. */
  department_name: string;
  /** `position_title` when set, else the free-text `position`. */
  display_position: string;
  status: ApplicationStatus;
  status_changed_at: string | null;
  /** Set when retired from the queue; the record is never deleted. */
  archived_at: string | null;
}

export type ApplicationStatus = "new" | "reviewing" | "interview" | "selected" | "rejected";

export const APPLICATION_STATUSES: { key: ApplicationStatus; label: string }[] = [
  { key: "new", label: "New" },
  { key: "reviewing", label: "Reviewing" },
  { key: "interview", label: "Interview" },
  { key: "selected", label: "Selected" },
  { key: "rejected", label: "Rejected" },
];

export interface ApplicationNote {
  id: number;
  author: string;
  body: string;
  created_at: string;
}

export interface ApplicationEvent {
  id: number;
  kind: "received" | "status" | "assigned" | "archived" | "restored" | "note";
  kind_label: string;
  from_status: string;
  to_status: string;
  detail: string;
  actor: string;
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
/*  Studio calls — authorised with the Content Studio session                   */
/* -------------------------------------------------------------------------- */
//
// The backend verifies the Studio token with the key shared with the CMS and
// reads the `modules` claim, so the same sign-in that opened the Studio
// authorises these. A 401 gets one refresh-and-retry, matching emiConfigService.

async function studioFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const send = (token: string | null) =>
    fetch(`${API_BASE_URL}${path}`, {
      ...init,
      cache: "no-store",
      headers: { ...(init.headers as Record<string, string> | undefined), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
  let response = await send(getStudioAccessToken());
  if (response.status === 401) {
    const fresh = await refreshStudioAccessToken();
    response = await send(fresh);
  }
  return response;
}

async function failure(response: Response): Promise<Error> {
  let detail = `Request failed (${response.status})`;
  try {
    const data = await response.json();
    if (typeof data?.detail === "string") detail = data.detail;
    else if (typeof data?.error === "string") detail = data.error;
    else if (data && typeof data === "object") {
      const first = Object.values(data)[0];
      if (Array.isArray(first) && typeof first[0] === "string") detail = first[0];
    }
  } catch {
    /* non-JSON body — keep the generic message */
  }
  return new Error(detail);
}

async function studioJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await studioFetch(path, init);
  if (!response.ok) throw await failure(response);
  return (await response.json()) as T;
}

function jsonInit(method: string, body: object): RequestInit {
  return { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

/**
 * The application queue, newest first (the model orders by `-created_at`).
 * Archived rows are left out unless asked for. Feeds Careers → Applications.
 */
export async function getCareerApplications(opts: { includeArchived?: boolean } = {}): Promise<CareerApplication[]> {
  const qs = opts.includeArchived ? "?include_archived=1" : "";
  const json = await studioJson<CareerApplication[]>(`job-applications/${qs}`);
  return Array.isArray(json) ? json : [];
}

export function getCareerApplication(id: number): Promise<CareerApplicationDetail> {
  return studioJson(`job-applications/${id}/`);
}

/** Move an application along the §6.13 workflow; the backend refuses illegal jumps. */
export function setApplicationStatus(id: number, status: ApplicationStatus, note = ""): Promise<CareerApplicationDetail> {
  return studioJson(`job-applications/${id}/status/`, jsonInit("POST", { status, note }));
}

/** Link a general application to a posting, keeping the original submission (§6.14). */
export function assignApplication(id: number, body: { position_id: number; position_title: string; department_name?: string }): Promise<CareerApplicationDetail> {
  return studioJson(`job-applications/${id}/assign/`, jsonInit("POST", body));
}

export function addApplicationNote(id: number, body: string): Promise<CareerApplicationDetail> {
  return studioJson(`job-applications/${id}/notes/`, jsonInit("POST", { body }));
}

export function restoreApplication(id: number): Promise<CareerApplicationDetail> {
  return studioJson(`job-applications/${id}/restore/`, { method: "POST" });
}

/**
 * Retire an application from the queue. The backend archives rather than
 * deletes (§6.13): the row, files, notes and timeline all survive and the
 * record can be restored.
 */
export async function archiveCareerApplication(id: number): Promise<void> {
  const response = await studioFetch(`job-applications/${id}/`, { method: "DELETE" });
  if (response.ok || response.status === 404) return; // 404 = already gone
  throw await failure(response);
}

/** @deprecated use archiveCareerApplication — the backend no longer hard-deletes. */
export const deleteCareerApplication = archiveCareerApplication;

/**
 * Download a resume / portfolio. The file route needs the Studio token, which
 * a plain `<a href>` cannot send, so the bytes are fetched and handed to the
 * browser as a blob with the server's candidate-named filename.
 */
export async function downloadApplicationFile(id: number, kind: "resume" | "portfolio"): Promise<void> {
  const response = await studioFetch(`job-applications/${id}/download/${kind}/`);
  if (!response.ok) throw await failure(response);
  const disposition = response.headers.get("Content-Disposition") || "";
  const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  const filename = match ? decodeURIComponent(match[1]) : `${kind}-${id}`;
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
