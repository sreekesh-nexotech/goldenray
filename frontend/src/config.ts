const isDevelopment = process.env.NODE_ENV !== "production";
const defaultApiBaseUrl = isDevelopment
	? "http://127.0.0.1:8000/api/"
	: "https://flarize.com/api/";

export const API_BASE_URL: string =
	process.env.NEXT_PUBLIC_API_BASE_URL || defaultApiBaseUrl;

// Blog CMS delivery API (Strapi-compatible). The prod CMS is proxied under
// flarize.com/studio-api (nginx → CMS container); the blog reads /api there.
// Dev uses the local CMS. Override with NEXT_PUBLIC_BLOG_API_BASE_URL if needed.
const defaultBlogApiBaseUrl = isDevelopment
	? "http://127.0.0.1:8009/api"
	: "https://flarize.com/studio-api/api";
export const BLOG_API_BASE_URL: string =
	process.env.NEXT_PUBLIC_BLOG_API_BASE_URL || defaultBlogApiBaseUrl;

// Content Studio admin API (JWT auth + authoring) — the same Django CMS that
// serves the blog delivery API, proxied at flarize.com/studio-api/admin-api in
// prod. Override with NEXT_PUBLIC_ADMIN_API_BASE_URL if needed.
const defaultAdminApiBaseUrl = isDevelopment
	? "http://127.0.0.1:8009/admin-api/"
	: "https://flarize.com/studio-api/admin-api/";
export const ADMIN_API_BASE_URL: string =
	process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL || defaultAdminApiBaseUrl;
export const GTM_ID: string = "GTM-5H47L3GM";
export const GA_MEASUREMENT_ID: string = "G-GSXM0NLQ8W";

export const USE_MOCK_DATA = false; // Set to true to use mock data
