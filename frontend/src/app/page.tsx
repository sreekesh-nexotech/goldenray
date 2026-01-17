import Main from "@/components/Home/home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Flarize - Solar Energy Solutions in Kerala | Residential & Commercial Solar Installation",
  description:
    "Flarize provides reliable and sustainable solar energy solutions for homes and businesses in Kerala. Get expert solar panel installation, maintenance, and support for long-term savings.",
  openGraph: {
    title: "Flarize - Solar Energy Solutions in Kerala",
    description:
      "Empowering sustainable energy with innovative solar solutions for homes and businesses in Kerala.",
    url: "https://flarize.com",
    siteName: "Flarize",
    images: [
      {
        url: "/heroImg.png",
        width: 1200,
        height: 630,
        alt: "Flarize Solar Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flarize - Solar Energy Solutions in Kerala",
    description:
      "Empowering sustainable energy with innovative solar solutions.",
    images: ["/heroImg.png"],
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

export default function Home() {
  return (
    <section>
      <Main />
    </section>
  );
}
