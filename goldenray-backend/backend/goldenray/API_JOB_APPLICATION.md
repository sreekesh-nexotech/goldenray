# Careers - Job Application API Documentation

> Base URL: `/api/`

---

## Table of Contents

1. [Job Application](#1-job-application)

---

## Authentication & Permissions

| Role | Auth | Description |
|------|------|-------------|
| **Public** | None | No auth required. Rate limited to 5 requests/min per IP |

---

## 1. Job Application

**Base:** `/api/job-applications/`
**Auth:** Public (no auth)
**Content-Type:** `multipart/form-data` (the form uploads files)

Powers the Careers page application form. Currently serves the **UI/UX Designer**
opening; the same endpoint serves future positions via the `position` field.

> ⚠️ This is **not** a JSON endpoint. Send `multipart/form-data` (a `FormData`
> object). Do **not** set the `Content-Type` header manually — let the browser
> add it so the multipart boundary is included.

### Create Application
```
POST /api/job-applications/
Content-Type: multipart/form-data
```

**Request Body:**

_Personal information_

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `full_name` | string | Yes | Max 255 chars |
| `email` | string | Yes | Valid email; stored lower-cased |
| `phone` | string | Yes | Indian mobile. `+91`, spaces, dashes accepted; stored as 10 digits |
| `location` | string | Yes | Current location |
| `linkedin` | string | Yes | Must be a `linkedin.com` URL. `https://` added if missing |
| `portfolio_website` | string | No | Any URL; `https://` added if missing |

_Professional details (all optional)_

| Field | Type | Required | Allowed values |
|-------|------|----------|----------------|
| `current_company` | string | No | Free text |
| `current_role` | string | No | Free text |
| `total_experience` | string | No | `0–1 years`, `1–3 years`, `3–5 years`, `5+ years` |
| `relevant_experience` | string | No | Same as `total_experience` |
| `current_salary` | string | No | `Below ₹3 LPA`, `₹3–5 LPA`, `₹5–8 LPA`, `₹8–12 LPA`, `₹12+ LPA` |
| `expected_salary` | string | No | Same as `current_salary` |
| `notice_period` | string | No | `Immediate`, `15 days`, `1 month`, `2 months`, `3 months` |
| `heard_about_us` | string | No | `LinkedIn`, `Job Portal`, `Referral`, `Company Website`, `Social Media`, `Other` |

_Uploads_

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `resume` | file | Yes | `.pdf`, `.doc`, `.docx` — max 10 MB |
| `portfolio_file` | file | No | `.pdf`, `.doc`, `.docx` — max 10 MB |

_Declaration & anti-spam_

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `declaration_accepted` | boolean | Yes | Must be `true` — maps to the consent checkbox |
| `position` | string | No | Default: `"UI/UX Designer"` |
| `website` | string | No | **Honeypot** — keep hidden/empty. If filled, submission is rejected |

> The dropdown values use an **en-dash (`–`, U+2013)**, not a hyphen. Send the
> option strings exactly as listed above so they match on the backend.

**Response:** `201 Created`
```json
{
  "message": "Application received. Our team will get in touch if there's a fit.",
  "status": "success",
  "data": {
    "id": 12,
    "position": "UI/UX Designer",
    "full_name": "Asha Menon",
    "email": "asha@example.com",
    "phone": "9847012345",
    "location": "Kochi",
    "linkedin": "https://www.linkedin.com/in/asha",
    "portfolio_website": "",
    "current_company": "",
    "current_role": "",
    "total_experience": "1–3 years",
    "relevant_experience": "",
    "current_salary": "",
    "expected_salary": "",
    "notice_period": "1 month",
    "heard_about_us": "",
    "resume": "/media/job_applications/resumes/resume_ab12.pdf",
    "portfolio_file": null,
    "declaration_accepted": true,
    "created_at": "2026-07-17T18:30:00+05:30"
  }
}
```

**Error Responses:**
```json
// 400 - Validation failed. `errors` is keyed by field name; each value is an
// array of messages. Show the message under the matching field.
{
  "message": "Validation failed",
  "status": "error",
  "errors": {
    "full_name": ["This field may not be blank."],
    "email": ["Enter a valid email address."],
    "phone": ["Enter a valid 10-digit Indian mobile number."],
    "location": ["This field may not be blank."],
    "linkedin": ["Enter a valid LinkedIn URL (e.g. linkedin.com/in/username)."],
    "resume": ["Only PDF or Word documents are allowed."],
    "declaration_accepted": ["Please accept the declaration to continue."]
  }
}

// 429 - Too many submissions (more than 5/min from the same IP)
{ "detail": "Request was throttled. Expected available in 60 seconds." }
```

Other validation messages you may receive:
- `resume` / `portfolio_file`: `"Only PDF or Word documents are allowed."`, `"File must be under 10MB."`, `"No file was submitted."`

---

## Frontend Example (`fetch` + `FormData`)

```ts
import { API_BASE_URL } from "@/config";

async function submitJobApplication(form: {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio_website?: string;
  current_company?: string;
  current_role?: string;
  total_experience?: string;
  relevant_experience?: string;
  current_salary?: string;
  expected_salary?: string;
  notice_period?: string;
  heard_about_us?: string;
  declaration_accepted: boolean;
  resume: File;
  portfolio_file?: File | null;
}) {
  const fd = new FormData();
  fd.append("position", "UI/UX Designer");
  fd.append("full_name", form.full_name);
  fd.append("email", form.email);
  fd.append("phone", form.phone);
  fd.append("location", form.location);
  fd.append("linkedin", form.linkedin);
  if (form.portfolio_website) fd.append("portfolio_website", form.portfolio_website);

  // optional professional details — only append if set
  for (const key of [
    "current_company", "current_role", "total_experience",
    "relevant_experience", "current_salary", "expected_salary",
    "notice_period", "heard_about_us",
  ] as const) {
    const v = form[key];
    if (v) fd.append(key, v);
  }

  fd.append("declaration_accepted", String(form.declaration_accepted)); // "true"
  fd.append("resume", form.resume);
  if (form.portfolio_file) fd.append("portfolio_file", form.portfolio_file);
  fd.append("website", ""); // honeypot — keep hidden and empty in the UI

  // NOTE: do NOT set Content-Type manually; the browser adds the multipart boundary.
  const res = await fetch(`${API_BASE_URL}job-applications/`, {
    method: "POST",
    body: fd,
  });

  const data = await res.json();
  if (!res.ok) {
    // data.errors is keyed by field name (see 400 example above)
    throw Object.assign(new Error(data.message || "Submission failed"), {
      status: res.status,
      errorData: data,
    });
  }
  return data; // { message, status: "success", data: {...} }
}
```

> The shared `apiCall` / `fetchApi` helper sends JSON only, so it can't be used
> here. Post the `FormData` directly with `fetch` as shown above.

---

## cURL (quick test)

```bash
curl -X POST http://127.0.0.1:8000/api/job-applications/ \
  -F "full_name=Asha Menon" \
  -F "email=asha@example.com" \
  -F "phone=+91 98470 12345" \
  -F "location=Kochi" \
  -F "linkedin=linkedin.com/in/asha" \
  -F "total_experience=1–3 years" \
  -F "notice_period=1 month" \
  -F "declaration_accepted=true" \
  -F "resume=@/path/to/resume.pdf;type=application/pdf"
```

---

## Base URLs

| Env | Base | Full URL |
|-----|------|----------|
| Local | `http://127.0.0.1:8000/api/` | `http://127.0.0.1:8000/api/job-applications/` |
| Production | `https://flarize.com/api/` | `https://flarize.com/api/job-applications/` |
