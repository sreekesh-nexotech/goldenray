import { renderQuotationPdf } from "@/lib/renderQuotationPdf";

/**
 * POST the customer's quotation data → the English quotation as a PDF.
 * `?variant=accounting` returns the Studio's short copy (pages 1, 5, 7, 8).
 * Chrome renders the real /quotation/v2 page; see renderQuotationPdf.
 */

export const runtime = "nodejs";
// Chrome needs longer than the default for a cold page compile in dev.
export const maxDuration = 120;

export function POST(request: Request) {
  return renderQuotationPdf(request, { path: "/quotation/v2", label: "Quotation" });
}
