"use client";

import { useQuotationStrings } from "./i18n/QuotationLanguageContext";

export default function Page10_1Content() {
  const { page101: t } = useQuotationStrings();

  return (
    <div className="flex flex-col h-full px-4 pt-4">
      {/* Terms list (continued from previous page) */}
      <div className="space-y-4">
        {t.terms.map((term, idx) => (
          <div key={idx}>
            <h3 className="text-[13px] font-semibold text-[#123532] mb-1">
              {term.title}
            </h3>
            <p className="text-[11.5px] text-[#123532] leading-relaxed">
              {term.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
