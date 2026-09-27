import { renderQuotationPdf } from "@/lib/renderQuotationPdf";

/**
 * POST the customer's quotation data → the Malayalam quotation as a PDF.
 * `?variant=accounting` returns the Studio's short copy (pages 1, 5, 7, 8).
 *
 * A route of its own because it loads the separate /quotation/v2-malayalam
 * page (its own component tree); the rendering is shared with the English
 * route in renderQuotationPdf.
 */

export const runtime = "nodejs";
// Chrome needs longer than the default for a cold page compile in dev.
export const maxDuration = 120;

export function POST(request: Request) {
  return renderQuotationPdf(request, { path: "/quotation/v2-malayalam", label: "Malayalam quotation" });
}
