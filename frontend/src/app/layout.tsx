/* src/app/layout.tsx */
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import "@/styles/globals.css";

import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";

import IdleTimeoutPopup from "@/components/common/IdleTimoutPopup";
import ExitIntentPopup from "@/components/common/ExitIntentPopup";
import FloatingChatButton from "@/components/common/FloatingChatBoat";
import FloatingPhoneButton from "@/components/common/FloatingPhoneButton";

import PageTracker from "@/components/analytics/PageTracker";
import {  isGtmEnabled } from "@/utils/gtm";
import { GTM_ID } from "@/config";

/* -------------------- Fonts -------------------- */

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const switzer = localFont({
  src: [
    { path: "../../public/fonts/switzer/Switzer-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/switzer/Switzer-Medium.woff2", weight: "500" },
    { path: "../../public/fonts/switzer/Switzer-Semibold.woff2", weight: "600" },
    { path: "../../public/fonts/switzer/Switzer-Bold.woff2", weight: "700" },
    { path: "../../public/fonts/switzer/Switzer-Extrabold.woff2", weight: "800" },
    { path: "../../public/fonts/switzer/Switzer-Italic.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/switzer/Switzer-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../../public/fonts/switzer/Switzer-SemiboldItalic.woff2", weight: "600", style: "italic" },
    { path: "../../public/fonts/switzer/Switzer-BoldItalic.woff2", weight: "700", style: "italic" },
    { path: "../../public/fonts/switzer/Switzer-ExtraboldItalic.woff2", weight: "800", style: "italic" },
  ],
  variable: "--font-switzer",
  display: "swap",
});

/* -------------------- Metadata -------------------- */

export const metadata: Metadata = {
  title: {
    default: "Flarize - Solar Solutions",
    template: "%s | Flarize",
  },
  description: "Empowering sustainable energy with innovative solar solutions.",
  openGraph: {
    title: "Flarize | Solar Solutions",
    description: "Empowering sustainable energy with innovative solar solutions.",
    url: "https://flarize.com",
    siteName: "Flarize",
    images: [
      {
        url: "https://flarize.com/ogImg.jpg",
        width: 1600,
        height: 730,
        alt: "Flarize | Solar Solution",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flarize - Solar Solutions",
    description: "Empowering sustainable energy with innovative solar solutions.",
    images: ["https://flarize.com/ogImg.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* -------------------- Layout -------------------- */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${switzer.variable}`}>
      <head>
        <meta
          name="google-site-verification"
          content="yPvkA7y4qK17chMlAbn958D0Nfhe7AWGEAIzwGJ4Cec"
        />
        <meta name="apple-mobile-web-app-title" content="Flarize" />

        {/* Inline Google Tag Manager using next/script for GA compatibility */}
        {isGtmEnabled() && (
          <Script
            id="gtm"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){
                  w[l]=w[l]||[];
                  w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                  var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                  j.async=true;
                  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                  f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
        )}
      </head>

      <body className="font-switzer pt-16 md:pt-20">
        {/* Place noscript iframe immediately after <body> per Google instructions */}
        {isGtmEnabled() && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        {/* Tracks SPA navigation */}
        <Suspense fallback={null}>
          <PageTracker />
        </Suspense>

        <Header />
        {children}
        <Footer />

        <IdleTimeoutPopup />
        <ExitIntentPopup />
        <FloatingPhoneButton />
        <FloatingChatButton />
      </body>
    </html>
  );
}