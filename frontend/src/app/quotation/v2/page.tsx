import type { Metadata } from "next";

import { QuotationV2Document } from "@/components/QuotationV2";

export const metadata: Metadata = {
  title: "Quotation | Flarize",
  // Review preview of the redesigned quotation with static sample data —
  // keep it out of search engines.
  robots: { index: false, follow: false },
};

export default function QuotationV2Page() {
  return <QuotationV2Document />;
}
