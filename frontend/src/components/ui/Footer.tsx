// golden-ray/frontend/src/components/ui/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import {
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  MapPin,
  Mail,
} from "lucide-react";

import FlarizeLogo from "../../../public/logo_header.png";

const companyLinks = [
  { label: "Affiliate Program", href: "/affiliate-programs" },
  { label: "How Flarize Works", href: "/how-flarize-works" },
  { label: "Our Projects", href: "/projects" },
  { label: "Service Locations", href: "/locations" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contactus" },
  { label: "About Us", href: "/about" },
];

const resourceLinks = [
  { label: "Solar Warranty", href: "#" },
  { label: "Government Subsidies", href: "#" },
  { label: "FAQs", href: "/faq" },
  { label: "Blogs", href: "/blog" },
  { label: "Newsletters", href: "#" },
];

const legalLinks = [
  { label: "Cookie Policy", href: "#" },
  { label: "Legal Policy", href: "#" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/flarize-technologies-pvt-ltd/posts/?feedView=all",
    Icon: Linkedin,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61586953048937",
    Icon: Facebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/flarize.technologies?igsh=MW0zZnJueG01Mm01bQ%3D%3D&utm_source=qr",
    Icon: Instagram,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@FlarizeSolarinstallation",
    Icon: Youtube,
  },
];

function LinkColumn({
  title,
  links,
  divider = false,
}: {
  title: string;
  links: { label: string; href: string }[];
  divider?: boolean;
}) {
  return (
    <div
      className={
        divider ? "sm:border-l sm:border-[#E3E2DC] sm:pl-12 lg:pl-20" : ""
      }
    >
      <div className="mb-6">
        <h3 className="text-[#1B2A4E] text-lg lg:text-xl font-bold">{title}</h3>
        <div className="mt-1.5 h-[0.1875rem] w-8 rounded-full bg-[#F7BA41]" />
      </div>
      <ul className="flex flex-col gap-5 text-[#555555] text-base lg:text-lg">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="hover:text-[#074A4D] transition-all ease-in-out duration-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <>
      {/* Guideline [1]: Converted px to rem (45px -> 2.8125rem) */}
      <section id="footer" className="scroll-mt-[2.8125rem]"></section>

      {/* Dark teal frame around the light footer card */}
      <section className="w-full bg-[#074A4D] rounded-t-3xl px-[clamp(1rem,4vw,3rem)] py-[clamp(1rem,4vw,3rem)]">
        <div className="bg-[#F6F5F1] rounded-3xl px-[clamp(1.5rem,4vw,4rem)] py-[clamp(2.5rem,5vw,4rem)]">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12">
            {/* Left: brand, tagline, social, contact card */}
            <div className="flex-shrink-0 lg:w-1/3">
              <div className="w-[clamp(8rem,12vw,10.5rem)]">
                <Image
                  src={FlarizeLogo}
                  alt="Flarize Logo"
                  width={210}
                  height={56}
                  sizes="(max-width: 768px) 130px, 168px"
                  className="w-full h-auto"
                />
                <p className="text-[#6B7280] text-[0.7rem] tracking-wide text-right -mt-1">
                  Elevate Your Everyday
                </p>
              </div>

              <p className="text-base text-[#555555] mt-6 max-w-xs">
                Reliable solar energy solutions designed for a sustainable
                future.
              </p>

              {/* Social icons */}
              <div className="flex gap-3 mt-6">
                {socialLinks.map(({ label, href, Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    target="new"
                    aria-label={label}
                    className="text-[#074A4D] hover:text-[#F7BA41] transition-colors duration-300"
                  >
                    <Icon size={22} strokeWidth={1.75} />
                  </Link>
                ))}
              </div>

              {/* Contact card */}
              <div className="mt-8 max-w-xs rounded-2xl border border-[#E3E2DC] bg-[#F1F0EB] p-5">
                <div className="flex gap-3 text-[#555555]">
                  <MapPin
                    size={20}
                    strokeWidth={1.75}
                    className="text-[#074A4D] flex-shrink-0 mt-0.5"
                  />
                  <address className="not-italic text-sm leading-relaxed">
                    1st Floor, Tharath Building
                    <br />
                    Kalappura, Alappuzha – 688007
                    <br />
                    Kerala, India
                  </address>
                </div>
                <hr className="my-4 border-[#E3E2DC]" />
                <div className="flex items-center gap-3 text-[#555555]">
                  <Mail
                    size={20}
                    strokeWidth={1.75}
                    className="text-[#074A4D] flex-shrink-0"
                  />
                  <Link
                    href="mailto:Info@flarize.com"
                    className="text-sm hover:text-[#074A4D] transition-colors duration-300"
                  >
                    Info@flarize.com
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: link columns */}
            <div className="flex flex-col sm:flex-row gap-10 sm:gap-12 lg:gap-20">
              <LinkColumn title="Company" links={companyLinks} />
              <LinkColumn title="Resources" links={resourceLinks} divider />
              <LinkColumn title="Legal" links={legalLinks} divider />
            </div>
          </div>

          {/* Copyright */}
          <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#E3E2DC]">
            <p className="text-center text-sm text-[#777777]">
              © 2024 Flarize Energy Solutions Pvt. Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
