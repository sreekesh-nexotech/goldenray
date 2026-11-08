import type { QuotationV2Data } from "@/components/QuotationV2/quotationV2Data";
import type { CommercialCopy, CommercialLanguage } from "../copy";

/** Both residential data builders produce this shape; the figures are theirs. */
export type CommercialData = QuotationV2Data;

export interface CommercialPageProps {
  data: CommercialData;
  copy: CommercialCopy;
  language: CommercialLanguage;
}
