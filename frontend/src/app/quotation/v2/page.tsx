import type { Metadata } from "next";

import QuotationV2View from "./QuotationV2View";

export const metadata: Metadata = {
  title: "Quotation | Flarize",
  // A customer's quotation — keep it out of search engines.
  robots: { index: false, follow: false },
};

export default function QuotationV2Page() {
  return <QuotationV2View />;
}
