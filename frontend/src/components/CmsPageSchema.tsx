// src/components/CmsPageSchema.tsx
//
// Emits the JSON-LD the Studio generated for a maintained page (§6.2, §6.7).
// Server component: it shares the ISR'd /api/page-content fetch with
// `withCmsSeo`, so adding it to a page costs no extra CMS round-trip. Renders
// nothing when the maintainer picked "No structured data" or the CMS is down.

import JsonLD from "@/components/JsonLD";
import { fetchPageContent } from "@/services/publicCmsService";

export default async function CmsPageSchema({ route }: { route: string }) {
  const content = await fetchPageContent(route);
  const schema = content?.seo?.schema;
  if (!schema) return null;
  return <JsonLD data={schema} />;
}
