import { Hanken_Grotesk, Inter, Poppins } from "next/font/google";

/**
 * Fonts for the redesigned quotation document. The page components reference
 * these via CSS variables (e.g. `var(--font-poppins)`), so the variable
 * classes below must be attached to the document wrapper.
 *
 * "Noto Sans Malayalam Condensed" (Onam-page headline) is served locally via
 * @font-face in quotation-v2.css — next/font cannot express its per-script
 * unicode-range subsets.
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

export const quotationV2FontVariables = [
  quotationPoppins.variable,
  quotationInter.variable,
  quotationHankenGrotesk.variable,
].join(" ");
