import { Poppins } from "next/font/google";

import { quotationV2MLFontVariables } from "@/components/QuotationV2Malayalam/fonts";

/**
 * The residential Malayalam fonts, plus Poppins under a name of its own so the
 * stylesheet can stack it in front of Noto Sans Malayalam (a variable cannot be
 * redefined in terms of itself).
 */
const commercialLatin = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-commercial-latin",
  display: "swap",
});

export const quotationCommercialFontVariables = `${quotationV2MLFontVariables} ${commercialLatin.variable}`;
