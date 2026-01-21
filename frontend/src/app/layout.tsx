// src/app/layout.tsx
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import "@/styles/globals.css";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import { Metadata } from "next";
import IdleTimeoutPopup from "@/components/common/IdleTimoutPopup";
import ExitIntentPopup from "@/components/common/ExitIntentPopup";
import FloatingChatButton from "@/components/common/FloatingChatBoat";
import FloatingPhoneButton from "@/components/common/FloatingPhoneButton";
import Script from "next/script";

// Configure DM Sans for headers
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Configure Switzer for body text (local font)
const switzer = localFont({
  src: [
    {
      path: "../../public/fonts/switzer/Switzer-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/switzer/Switzer-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/switzer/Switzer-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/switzer/Switzer-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/switzer/Switzer-Extrabold.woff2",
      weight: "800",
      style: "normal",
    },
    // Italic variants
    {
      path: "../../public/fonts/switzer/Switzer-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/switzer/Switzer-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/switzer/Switzer-SemiboldItalic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/fonts/switzer/Switzer-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/switzer/Switzer-ExtraboldItalic.woff2",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-switzer",
  display: "swap",
});

// Metadata
export const metadata: Metadata = {
  title: {
    default: "Flarize - Solar Solutions",
    template: "%s | Flarize",
  },
  description: "Empowering sustainable energy with innovative solar solutions.",
  openGraph: {
    title: "Flarize | Solar Solutions",
    description:
      "Empowering sustainable energy with innovative solar solutions.",
    url: "https://flarize.com",
    siteName: "Flarize",
    images: [
      {
        url: "https://flarize.com/ogImg.jpg",
        width: 1600,
        height: 730,
        alt: "Flarize | Solar Solution",
        type: "image/jpeg",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flarize - Solar Solutions",
    description:
      "Empowering sustainable energy with innovative solar solutions.",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${switzer.variable}`}>
      <head>
        {/* Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="yPvkA7y4qK17chMlAbn958D0Nfhe7AWGEAIzwGJ4Cec"
        />

        <meta name="apple-mobile-web-app-title" content="Flarize" />
      </head>
      <body className="font-switzer">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5H47L3GM"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {/* Google Tag Manager - Using Next.js Script for better loading */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5H47L3GM');`,
          }}
        />

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
