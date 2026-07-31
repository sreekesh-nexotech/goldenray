import type { Metadata } from "next";

import QuotationV2MalayalamView from "./QuotationV2MalayalamView";

export const metadata: Metadata = {
  title: "Quotation | Flarize",
  // A customer's quotation — keep it out of search engines.
  robots: { index: false, follow: false },
};

export default function QuotationV2MalayalamPage() {
  return <QuotationV2MalayalamView />;
}
