// golden-ray/frontend/src/components/ui/Footer.tsx
"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Linkedin, Facebook, Instagram, Youtube } from "lucide-react";

import { submitContactForm } from "@/services/basicContactService";
import { allLocations } from "@/data/locations";
import FlarizeLogo from "../../../public/logoFooter.png";

const companyLinks = [
  { label: "Affiliate Program", href: "/affiliate-programs" },
  { label: "How Flarize Works", href: "/how-flarize-works" },
  { label: "Our Projects", href: "/projects" },
  { label: "Contact Us", href: "/contactus" },
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/career" },
];

const resourceLinks = [
  { label: "Solar Warranty", href: "/solar-warranty" },
  { label: "Government Subsidies", href: "/subsidy" },
  { label: "FAQs", href: "/faq" },
  { label: "Blogs", href: "/blog" },
  // NOTE: no dedicated /newsletters route exists yet — placeholder href.
  { label: "Newsletters", href: "#" },
];

const legalLinks = [
  // NOTE: no dedicated cookie/legal-policy pages exist yet — placeholder hrefs.
  { label: "Cookie Policy", href: "#" },
  { label: "Legal Policy", href: "#" },
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
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col">
      <h3 className="mb-5 text-base font-medium text-[#9CA3AF]">{title}</h3>
      <ul className="flex flex-col gap-4">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-base text-[#1F2430] transition-colors duration-300 hover:text-[#074A4D]"
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const scrollY = window.scrollY;
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      window.scrollTo(0, scrollY);
      return;
    }

    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const phone_number = formData.get("phone_number") as string;

    if (!name.match(/^[A-Za-z\s]{3,}$/)) {
      setError("Please enter a valid name with at least 3 alphabetic characters.");
      setSuccessMessage(null);
      window.scrollTo(0, scrollY);
      return;
    }

    if (!phone_number.match(/^[6-9]\d{9}$/)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      setSuccessMessage(null);
      window.scrollTo(0, scrollY);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await submitContactForm({ name, phone_number });
      setSuccessMessage(
        "Thank you! Your request has been submitted. We'll be in touch shortly!",
      );
      formRef.current?.reset();
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes(
          'HTTP error! Status: 400, Message: {"phone_number":["lead collection home with this phone number already exists."]}',
        )
      ) {
        setSuccessMessage("We already have your details! Our team will contact you soon.");
        formRef.current?.reset();
      } else {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(`Failed to submit: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
      window.scrollTo(0, scrollY);
    }
  };

  return (
    <>
      {/* Guideline [1]: Converted px to rem (45px -> 2.8125rem) */}
      <section id="footer" className="scroll-mt-[2.8125rem]" />

      <footer className="w-full overflow-hidden rounded-t-3xl bg-[#074A4D] px-[clamp(1rem,4vw,3.5rem)] pb-8 pt-[clamp(2.5rem,6vw,5rem)]">
        {/* ---------- CTA: heading + booking form ---------- */}
        <div className="relative mx-auto max-w-7xl">
          {/* Subtle grid overlay, fades toward the bottom */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "76px 76px",
              maskImage:
                "linear-gradient(to bottom, black 30%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 30%, transparent 100%)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-10 pb-[clamp(2.5rem,5vw,4rem)] text-center lg:flex-row lg:items-start lg:justify-between lg:text-left">
            {/* Heading */}
            <div className="max-w-xl">
              <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.05] text-white">
                Ready to go solar with us?
              </h2>
              <p className="mt-4 text-lg text-white/80 lg:text-xl">
                We&rsquo;re just a message away!
              </p>
            </div>

            {/* Booking form */}
            <div className="w-full max-w-md lg:w-[27rem] lg:flex-shrink-0">
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
                aria-label="Book a free consultation"
                className="flex flex-col gap-5"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  pattern="[A-Za-z\s]{3,}"
                  title="Please enter at least 3 alphabetic characters."
                  aria-label="Your name"
                  className="w-full rounded-xl bg-white px-5 py-4 text-base text-[#1F2430] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
                />
                <input
                  type="tel"
                  name="phone_number"
                  placeholder="Mobile Number"
                  required
                  pattern="[6-9]\d{9}"
                  title="Please enter a valid 10-digit Indian mobile number (e.g., 9876543210)."
                  aria-label="Your mobile number"
                  className="w-full rounded-xl bg-white px-5 py-4 text-base text-[#1F2430] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  aria-label="Book consultation"
                  className={`mt-2 rounded-xl bg-[#F7BA41] px-12 py-4 text-base font-semibold text-[#1F2430] transition-colors duration-300 hover:bg-[#e8a92f] lg:w-fit ${
                    isLoading ? "cursor-not-allowed opacity-60" : ""
                  }`}
                >
                  {isLoading ? "Submitting..." : "Book Now"}
                </button>
              </form>

              {error && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl bg-[#f9e6e6] px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </p>
              )}
              {successMessage && (
                <p
                  role="status"
                  className="mt-4 rounded-xl bg-[#E6F9E6] px-4 py-3 text-sm text-green-700"
                >
                  {successMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ---------- White footer card ---------- */}
        <div className="mx-auto mt-2 max-w-7xl rounded-3xl bg-white px-[clamp(1.5rem,4vw,3.5rem)] py-[clamp(2.5rem,4vw,3.5rem)]">
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
            {/* Brand block */}
            <div className="flex max-w-md flex-col">
              <div className="w-[clamp(8.5rem,12vw,11rem)]">
                <Image
                  src={FlarizeLogo}
                  alt="Golden Ray"
                  priority={false}
                  sizes="(max-width: 768px) 150px, 176px"
                  className="h-auto w-full"
                />
              </div>

              <p className="mt-6 max-w-sm text-base leading-relaxed text-[#4B5563]">
                Golden Ray is a company working to bring accessible energy to
                everyone. Our mission is to empower people to be in charge of
                their own power
              </p>

              {/* Social icons */}
              <div className="mt-7 flex gap-3">
                {socialLinks.map(({ label, href, Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-[#074A4D]/40 text-[#074A4D] transition-colors duration-300 hover:bg-[#074A4D] hover:text-white"
                  >
                    <Icon size={17} strokeWidth={1.75} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Link columns */}
            <div className="flex flex-col gap-10 sm:flex-row sm:gap-14 lg:gap-20">
              <LinkColumn title="Company" links={companyLinks} />
              <LinkColumn title="Resources" links={resourceLinks} />
              <LinkColumn title="Legal" links={legalLinks} />
            </div>
          </div>
        </div>

        {/* ---------- Our Locations ---------- */}
        <div className="mx-auto mt-10 max-w-7xl rounded-2xl  bg-white/5 px-[clamp(1.5rem,4vw,3.5rem)] py-[clamp(1.5rem,3vw,2.5rem)]">
          <h3 className="text-2xl md:text-4xl font-semibold text-[#F3F4F6]">Our Locations</h3>
          <div className="mt-6 flex flex-wrap gap-x-12 gap-y-4">
            {allLocations.map((location) => (
              <Link
                key={location.name}
                href={location.href}
                className="text-base md:text-[22px] text-white transition-colors duration-300 hover:text-[#F7BA41]"
              >
                Solar Services In {location.name}
              </Link>
            ))}
          </div>
        </div>

        {/* ---------- Copyright ---------- */}
        <div className="mx-auto mt-8 max-w-7xl">
          <p className="text-center text-sm text-white/60">
            © 2025 Goldenray All rights reserved
          </p>
        </div>
      </footer>
    </>
  );
}
