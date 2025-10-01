// src/app/layout.tsx
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import '@/styles/globals.css';
import { DM_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import { Metadata } from 'next';
import IdleTimeoutPopup from '@/components/common/IdleTimoutPopup';
import ExitIntentPopup from '@/components/common/ExitIntentPopup';
import FloatingChatButton from '@/components/common/FloatingChatBoat';

// Configure DM Sans for headers
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

// Configure Switzer for body text (local font)
const switzer = localFont({
  src: [
    {
      path: '../../public/fonts/switzer/Switzer-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/switzer/Switzer-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/switzer/Switzer-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/switzer/Switzer-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/switzer/Switzer-Extrabold.woff2',
      weight: '800',
      style: 'normal',
    },
    // Italic variants
    {
      path: '../../public/fonts/switzer/Switzer-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/switzer/Switzer-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/switzer/Switzer-SemiboldItalic.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../../public/fonts/switzer/Switzer-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../public/fonts/switzer/Switzer-ExtraboldItalic.woff2',
      weight: '800',
      style: 'italic',
    },
  ],
  variable: '--font-switzer',
  display: 'swap',
});

// Metadata
export const metadata: Metadata = {
  title: {
    default: "Flarize - Solar Solutions",
    template: "%s | Flarize",
  },
  description: "Empowering sustainable energy with innovative solar solutions.",
  keywords: ["solar energy", "renewable energy", "Flarize"],
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
        type: "image/jpeg",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${switzer.variable}`}>
      <body className="font-switzer">
        <Header />
        {children}
        <Footer />

        <IdleTimeoutPopup />
        <ExitIntentPopup />
        <FloatingChatButton />
      </body>
    </html>
  );
}