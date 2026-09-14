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

import type { Metadata } from "next";
import { fetchPageContent } from "@/services/publicCmsService";

export async function withCmsSeo(route: string, base: Metadata): Promise<Metadata> {
  const content = await fetchPageContent(route);
  const seo = content?.seo;
  if (!seo) return base;

  const title = seo.title || base.title;
  const description = seo.description || base.description;
  const canonical = seo.canonical_url || base.alternates?.canonical;

  return {
    ...base,
    title,
    description,
    openGraph: base.openGraph
      ? { ...base.openGraph, title: title as string, description: description as string }
      : base.openGraph,
    twitter: base.twitter
      ? { ...base.twitter, title: title as string, description: description as string }
      : base.twitter,
    alternates: canonical ? { ...base.alternates, canonical } : base.alternates,
    // "Hide from search" is the one switch that must win over the shipped
    // value: a maintainer setting it expects the page to drop out of results.
    robots: seo.noindex ? { index: false, follow: true } : base.robots,
  };
}
