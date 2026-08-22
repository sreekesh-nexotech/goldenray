// src/services/careerApplicationService.ts
import { API_BASE_URL } from "../config";
import { getStudioAccessToken, refreshStudioAccessToken } from "./studioService";

export interface JobApplicationData {
  // Which opening this application is for. Defaults to "UI/UX Designer".
  position?: string;

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
  fd.append("position", data.position ?? "UI/UX Designer");
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
}

/**
 * Every application submitted through the Careers forms, newest first (the
 * model orders by `-created_at`). Feeds the Content Studio → Career screen.
 */
export async function getCareerApplications(): Promise<CareerApplication[]> {
  const response = await fetch(`${API_BASE_URL}job-applications/`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const json = (await response.json()) as CareerApplication[];
  return Array.isArray(json) ? json : [];
}

/**
 * Permanently remove an application and its uploaded files.
 *
 * The backend gates DELETE on a Content Studio admin/editor token (verified
 * with the key shared with the CMS), so the same sign-in that opened the Studio
 * authorises this. A 401 gets one refresh-and-retry, matching emiConfigService.
 */
export async function deleteCareerApplication(id: number): Promise<void> {
  const send = (token: string | null) =>
    fetch(`${API_BASE_URL}job-applications/${id}/`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

  let response = await send(getStudioAccessToken());
  if (response.status === 401) {
    const fresh = await refreshStudioAccessToken();
    response = await send(fresh);
  }

  if (response.ok || response.status === 404) return; // 404 = already gone

  let detail = `Request failed (${response.status})`;
  try {
    const data = await response.json();
    if (typeof data?.detail === "string") detail = data.detail;
    else if (typeof data?.error === "string") detail = data.error;
  } catch {
    /* non-JSON body — keep the generic message */
  }
  throw new Error(detail);
}
