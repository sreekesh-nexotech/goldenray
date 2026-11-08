// Pages 7 and 8 — terms and conditions. The clauses are the residential ones.
import type { TermsClause } from "@/components/QuotationV2/TermsPageLayout";
import { CLAUSES as ENGLISH_ONE } from "@/components/QuotationV2/pages/Page10Terms";
import { CLAUSES as ENGLISH_TWO } from "@/components/QuotationV2/pages/Page11Terms2";
import { CLAUSES as MALAYALAM_ONE } from "@/components/QuotationV2Malayalam/pages/Page10Terms";
import { CLAUSES as MALAYALAM_TWO } from "@/components/QuotationV2Malayalam/pages/Page11Terms2";
import { CommercialPage, INK, text } from "../shared";
import type { CommercialPageProps } from "./types";

function Clauses({ clauses, title }: { clauses: TermsClause[]; title?: string }) {
  return (
    <CommercialPage>
      <div style={{ padding: "0 102px 0 104px", display: "flex", flexDirection: "column", gap: 13 }}>
        {title && <div style={text(42, 700, INK, { lineHeight: "56px", marginBottom: 2 })}>{title}</div>}
        {clauses.map((clause) => (
          <div key={clause.title}>
            <div style={text(25, 500, INK, { lineHeight: "36px" })}>{clause.title} :</div>
            <div style={text(21, 400, INK, { lineHeight: "32px", marginTop: 3 })}>{clause.body}</div>
          </div>
        ))}
      </div>
    </CommercialPage>
  );
}

export function TermsPageOne({ copy, language }: CommercialPageProps) {
  return <Clauses title={copy.terms.title} clauses={language === "Malayalam" ? MALAYALAM_ONE : ENGLISH_ONE} />;
}

export function TermsPageTwo({ language }: CommercialPageProps) {
  return <Clauses clauses={language === "Malayalam" ? MALAYALAM_TWO : ENGLISH_TWO} />;
}
