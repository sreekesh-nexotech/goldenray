"use client";

import { useQuotationStrings } from "./i18n/QuotationLanguageContext";

export default function Page10Content() {
  const { page10: t } = useQuotationStrings();

  return (
    <div className="flex flex-col h-full px-4">
      {/* Title */}
      <div className="mt-4 mb-5">
        <h1 className="text-[24px] font-bold text-[#1a1a1a] leading-tight">
          {t.title}
        </h1>
      </div>

      {/* Terms list */}
      <div className="space-y-4">
        {t.terms.map((term, idx) => (
          <div key={idx}>
            <h3 className="text-[12px] font-semibold text-[#123532] mb-1">
              {term.title}
            </h3>
            <p className="text-[10.5px] text-[#123532] leading-relaxed">
              {term.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
