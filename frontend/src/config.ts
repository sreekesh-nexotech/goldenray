const isDevelopment = process.env.NODE_ENV !== "production";
const defaultApiBaseUrl = "http://62.171.151.149:47063/api/";

export const API_BASE_URL: string =
	process.env.NEXT_PUBLIC_API_BASE_URL || defaultApiBaseUrl;

// New platform backend: the anonymous website API (calculators, EMI, BOM quote,
// leads, catalog, content). Every path under it ends in a slash. Override with
// NEXT_PUBLIC_PUBLIC_API_BASE_URL (dev needs the backend's CORS_ALLOWED_ORIGINS
// to list the site origin).
const defaultPublicApiBaseUrl = "http://62.171.151.149:47063/api/public/v1/";
export const PUBLIC_API_BASE_URL: string =
	process.env.NEXT_PUBLIC_PUBLIC_API_BASE_URL || defaultPublicApiBaseUrl;

// New platform backend: the authenticated staff API (RS256 JWT, module.action
// RBAC). Used by the Studio's BOM calculator, which keeps its own session
// separate from the CMS sign-in. Override with NEXT_PUBLIC_STAFF_API_BASE_URL.
const defaultStaffApiBaseUrl = "http://62.171.151.149:47063/api/v1/";
export const STAFF_API_BASE_URL: string =
	process.env.NEXT_PUBLIC_STAFF_API_BASE_URL || defaultStaffApiBaseUrl;

// Blog CMS delivery API (Strapi-compatible). The prod CMS is proxied under
// flarize.com/studio-api (nginx → CMS container); the blog reads /api there.
// Dev uses the local CMS. Override with NEXT_PUBLIC_BLOG_API_BASE_URL if needed.
const defaultBlogApiBaseUrl = isDevelopment
	? "http://127.0.0.1:8009/api"
	: "https://flarize.com/studio-api/api";
export const BLOG_API_BASE_URL: string =
	process.env.NEXT_PUBLIC_BLOG_API_BASE_URL || defaultBlogApiBaseUrl;

// The Content Studio's authoring API used to be the Django CMS at
// /studio-api/admin-api/. It now runs on the platform staff API (/api/v1/),
// reached server-side through the BFF in src/app/fe-api/studio/, so there is no
// browser-facing admin base URL any more. See STAFF_API_BASE_URL above.

// Canonical production origin. Every absolute URL the site emits — canonical
// tags, Open Graph, JSON-LD, sitemap — must be built from this constant so the
// www/non-www split can never reappear. flarize.com is the canonical host;
// www.flarize.com permanently redirects to it at the edge, so emitting a www
// URL anywhere means pointing Google at a redirect.
export const SITE_URL: string =
	process.env.NEXT_PUBLIC_SITE_URL || "https://flarize.com";

export const GTM_ID: string = "GTM-5H47L3GM";
export const GA_MEASUREMENT_ID: string = "G-GSXM0NLQ8W";

export const USE_MOCK_DATA = false; // Set to true to use mock data
