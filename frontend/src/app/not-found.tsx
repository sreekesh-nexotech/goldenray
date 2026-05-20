import Link from "next/link";
import type { Metadata } from "next";
import { Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The page you're looking for doesn't exist. Explore Flarize solar solutions, projects, and tools instead.",
  robots: { index: false, follow: false },
};

const quickLinks = [
  { href: "/projects", label: "Our Projects" },
  { href: "/advanced-calculator", label: "Solar Calculator" },
  { href: "/solar-comparison", label: "Compare Panels" },
  { href: "/contactus", label: "Contact Us" },
];

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-xl w-full text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF3E8]">
          <Compass className="h-8 w-8 text-[#F7BA41]" strokeWidth={2.25} />
        </div>

        <p className="text-sm font-semibold tracking-wider uppercase text-[#074A4D] mb-3">
          Error 404
        </p>

        <h1 className="text-4xl md:text-5xl font-semibold text-[#123532] mb-4 leading-tight">
          Page not found
        </h1>

        <p className="text-base md:text-lg text-[#444444] leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
          Here are a few places you might try instead.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10">
          <Link
            href="/"
            className="px-8 py-3 bg-[#F7BA41] text-black font-semibold rounded-lg hover:bg-[#e6a73a] transition-colors duration-200 text-center"
          >
            Go to homepage
          </Link>
          <Link
            href="/contactus"
            className="px-8 py-3 border border-[#074A4D] text-[#074A4D] font-semibold rounded-lg hover:bg-[#074A4D] hover:text-white transition-colors duration-200 text-center"
          >
            Talk to us
          </Link>
        </div>

        <div className="border-t border-[#E5E5E5] pt-8">
          <p className="text-sm text-[#666666] mb-4">Or jump to:</p>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[#074A4D] font-medium hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
