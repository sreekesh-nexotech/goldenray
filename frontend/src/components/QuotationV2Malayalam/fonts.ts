import { Hanken_Grotesk, Inter, Noto_Sans_Malayalam, Poppins } from "next/font/google";

/**
 * Fonts for the Malayalam quotation document.
 *
 * The page components carry the same `var(--font-poppins)` / `var(--font-inter)`
 * / `var(--font-hanken-grotesk)` inline styles as the English pages (copied
 * verbatim, not hand-edited per span). Rather than touching every one of those
 * inline styles, `quotation-v2.css` redefines those three custom properties to
 * resolve to Noto Sans Malayalam wherever this document's `.quotation-v2-ml`
 * class wraps them, so every existing font reference repaints in the Malayalam
 * font without a single page component knowing about it.
 */
export const quotationPoppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const quotationInter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const quotationHankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

export const quotationNotoMalayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-malayalam",
  display: "swap",
});

export const quotationV2MLFontVariables = [
  quotationPoppins.variable,
  quotationInter.variable,
  quotationHankenGrotesk.variable,
  quotationNotoMalayalam.variable,
].join(" ");
