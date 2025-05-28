// src/app/layout.tsx
import Header from '@/components/ui/Header';
import '@/styles/globals.css';
import Footer from '@/components/ui/Footer';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

//meta data for better SEO
export const metadata = {
  title: 'GoldenRay - Sustainable Solar Energy Solutions',
  description:
    'GoldenRay provides custom solar energy solutions for homes, businesses, and industries. Save on energy bills and embrace sustainability with our expert solar installations.',
  keywords: ['solar energy', 'renewable energy', 'solar solutions', 'sustainable energy', 'GoldenRay', 'solar panels'],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'GoldenRay - Sustainable Solar Energy Solutions',
    description:
      'Discover custom solar solutions with GoldenRay. Save money and power your future with sustainable energy for homes and businesses.',
    url: 'https://www.goldenray.com', // Replace with your actual domain
    siteName: 'GoldenRay',
    images: [
      {
        url: '/heroImg.png', // Path to a default social sharing image in public/
        width: 1200,
        height: 630,
        alt: 'GoldenRay Solar Solutions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GoldenRay - Sustainable Solar Energy Solutions',
    description:
      'Join the solar revolution with GoldenRay’s custom energy solutions for homes and businesses.',
    images: ['/heroImg.png'], // Path to a Twitter card image
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Switzer:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}