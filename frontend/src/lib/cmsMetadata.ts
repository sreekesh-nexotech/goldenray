// src/lib/cmsMetadata.ts
//
// Merge the Studio's SEO block (§6.2, §6.7) over a page's shipped metadata.
//
// Every public page keeps the metadata it was built with as the fallback; the
// CMS row only overrides what a maintainer has actually filled in. So an empty
// SEO title in the Studio leaves the shipped title alone, a CMS outage leaves
// the whole page as shipped, and the site never renders a blank <title>.
//
// Usage in a page.tsx:
//
//   const BASE_METADATA: Metadata = { ... };
//   export const generateMetadata = () => withCmsSeo("/about", BASE_METADATA);
//
// The Studio's structured-data choice lands in the <body>, not <head>, so it
// is a component: render <CmsPageSchema route="/about" /> anywhere in the
// page. Both read the same cached fetch, so the page costs one CMS call.

import type { Metadata } from "next";
import { fetchPageContent } from "@/services/publicCmsService";

export async function withCmsSeo(route: string, base: Metadata): Promise<Metadata> {
  const content = await fetchPageContent(route);
  const seo = content?.seo;
  if (!seo) return base;

  const title = seo.title || base.title;
  const description = seo.description || base.description;
  const canonical = seo.canonical_url || base.alternates?.canonical;
  const ogImage = seo.og_image
    ? [{ url: seo.og_image.url, alt: seo.og_image.alt, width: seo.og_image.width ?? undefined, height: seo.og_image.height ?? undefined }]
    : undefined;

  return {
    ...base,
    title,
    description,
    openGraph: base.openGraph
      ? { ...base.openGraph, title: title as string, description: description as string, ...(ogImage && { images: ogImage }) }
      : ogImage
        ? { title: title as string, description: description as string, images: ogImage }
        : base.openGraph,
    twitter: base.twitter
      ? { ...base.twitter, title: title as string, description: description as string, ...(ogImage && { images: ogImage }) }
      : base.twitter,
    alternates: canonical ? { ...base.alternates, canonical } : base.alternates,
    // "Hide from search" is the one switch that must win over the shipped
    // value: a maintainer setting it expects the page to drop out of results.
    robots: seo.noindex ? { index: false, follow: true } : base.robots,
  };
}
