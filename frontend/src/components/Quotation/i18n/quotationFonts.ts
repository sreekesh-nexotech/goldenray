import { Noto_Sans_Malayalam } from "next/font/google";
import type { QuotationLanguage } from "./quotationStrings";

/**
 * Malayalam needs its own webfont: the PDF is produced by rasterising the DOM,
 * so anything the browser cannot paint (missing glyphs, broken conjuncts) ends
 * up baked into the file.
 */
const notoSansMalayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** Font class for a quotation page; empty for English, which keeps the site font. */
export function quotationFontClass(language: QuotationLanguage): string {
  return language === "Malayalam" ? notoSansMalayalam.className : "";
}
