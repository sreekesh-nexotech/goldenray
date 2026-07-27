"use client";

import { createContext, useContext, useMemo } from "react";
import {
  getQuotationStrings,
  type QuotationLanguage,
  type QuotationStrings,
} from "./quotationStrings";

interface QuotationLanguageValue {
  language: QuotationLanguage;
  t: QuotationStrings;
}

const QuotationLanguageContext = createContext<QuotationLanguageValue>({
  language: "English",
  t: getQuotationStrings("English"),
});

export function QuotationLanguageProvider({
  language,
  children,
}: {
  language: QuotationLanguage;
  children: React.ReactNode;
}) {
  const value = useMemo(
    () => ({ language, t: getQuotationStrings(language) }),
    [language],
  );

  return (
    <QuotationLanguageContext.Provider value={value}>
      {children}
    </QuotationLanguageContext.Provider>
  );
}

/** Copy for the active quotation language. Defaults to English outside a provider. */
export function useQuotationStrings(): QuotationStrings {
  return useContext(QuotationLanguageContext).t;
}

/** The active quotation language, e.g. to pick a font stack. */
export function useQuotationLanguage(): QuotationLanguage {
  return useContext(QuotationLanguageContext).language;
}
