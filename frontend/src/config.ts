const isDevelopment = process.env.NODE_ENV !== "production";
const defaultApiBaseUrl = isDevelopment
	? "http://127.0.0.1:8000/api/"
	: "https://flarize.com/api/";

export const API_BASE_URL: string =
	process.env.NEXT_PUBLIC_API_BASE_URL || defaultApiBaseUrl;

// Blog CMS delivery API (Strapi-compatible). Defaults: local CMS in dev,
// blog.flarize.com in prod (repoint via NEXT_PUBLIC_BLOG_API_BASE_URL).
const defaultBlogApiBaseUrl = isDevelopment
	? "http://127.0.0.1:8009/api"
	: "https://blog.flarize.com/api";
export const BLOG_API_BASE_URL: string =
	process.env.NEXT_PUBLIC_BLOG_API_BASE_URL || defaultBlogApiBaseUrl;
export const GTM_ID: string = "GTM-5H47L3GM";
export const GA_MEASUREMENT_ID: string = "G-GSXM0NLQ8W";

export const USE_MOCK_DATA = false; // Set to true to use mock data
