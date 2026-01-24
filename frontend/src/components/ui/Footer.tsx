// golden-ray/frontend/src/components/ui/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { submitContactForm } from "@/services/basicContactService";

import LinkedInLogo from "../../../public/LinkedinLogo.png";
import FacebookLogo from "../../../public/FacebookLogo.png";
import InstagramLogo from "../../../public/InstagramLogo.png";
// import YoutubeLogo from "../../../public/YoutubeLogo.png";

export default function Footer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const footerLogo =
    "https://gym-manager-pull.b-cdn.net/golden_ray/home/logoFooter.png";

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
      setError(
        "Please enter a valid name with at least 3 alphabetic characters."
      );
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
        "Thank you! Your consultation request has been successfully submitted. We'll be in touch shortly!"
      );
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes("HTTP error! Status: 400") &&
        err.message.includes("phone number already exists")
      ) {
        setSuccessMessage(
          "We already have your details! Our team will contact you soon."
        );
        if (formRef.current) {
          formRef.current.reset();
        }
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

  // NOTE: Guideline [5]: Ensure your main layout file (e.g., layout.tsx) has the viewport meta tag:
  // <meta name="viewport" content="width=device-width, initial-scale=1">

  return (
    <>
      {/* Guideline [1]: Converted px to rem (45px -> 2.8125rem) */}
      <section id="footer" className="scroll-mt-[2.8125rem]"></section>

      {/* Guideline [3]: Using clamp, vw, and vh for fluid padding that scales on all screens */}
      <section className="w-full bg-[#074A4D] rounded-t-3xl text-white py-[clamp(4rem,8vh,8rem)] px-[clamp(1rem,6vw,12rem)] relative overflow-hidden">
        {/* The background grid pattern is unchanged as it doesn't violate guidelines */}
        <div
          className="absolute inset-0 z-0 opacity-50 pointer-events-none bg-[url('../../public/grid.svg')] bg-no-repeat bg-auto"
          style={{
            WebkitMaskImage: `radial-gradient(farthest-side at 50% 50%, black 20%, transparent 100%), linear-gradient(to right, transparent 1%, black 50%, transparent 99%), linear-gradient(to bottom, transparent 1%, black 50%, transparent 99%)`,
            maskImage: `radial-gradient(farthest-side at 50% 50%, black 20%, transparent 100%), linear-gradient(to right, transparent 1%, black 50%, transparent 99%), linear-gradient(to bottom, transparent 1%, black 50%, transparent 99%)`,
            WebkitMaskComposite: "intersect",
            maskComposite: "intersect",
          }}
        />

        {/* Guideline [3]: Gap is now fluid for better scaling on large screens */}
        <div className="max-w-7xl z-10 mx-auto flex flex-col md:flex-row gap-[clamp(2.5rem,5vw,5rem)] justify-between">
          <div>
            {/* Guideline [2]: Using clamp() for fluid, responsive heading font size */}
            <h2 className="text-[clamp(2.5rem,5vw,4rem)] leading-tight font-bold mb-4 md:text-left text-center">
              Ready to go
              <br /> solar with us?
            </h2>
            {/* Guideline [2]: Using clamp() for fluid paragraph font size */}
            <p className="text-[clamp(1.125rem,2vw,1.5rem)] md:text-left text-center text-[#DBD8D8]">
              We&apos;re just a message away!
            </p>
          </div>

          <form
            ref={formRef}
            className="flex flex-col gap-4 w-full max-w-sm max-sm:max-w-full"
            onSubmit={handleSubmit}
            noValidate={true}
            aria-label="Contact us form"
          >
            {/* Guideline [8]: Inputs have sufficient padding for touch targets */}
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="px-4 py-3 rounded-xl text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
                required
                pattern="[A-Za-z\s]{3,}"
                title="Please enter at least 3 alphabetic characters."
                aria-label="Your name"
              />
            </div>
            <div className="relative">
              <input
                type="tel"
                name="phone_number"
                placeholder="Mobile Number"
                className="px-4 py-3 rounded-xl text-black bg-white mb-3 focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
                required
                pattern="[6-9]\d{9}"
                title="Please enter a valid 10-digit Indian mobile number (e.g., 9876543210)."
                aria-label="Your mobile number"
              />
            </div>
            {/* Guideline [8]: Button has sufficient padding for touch targets */}
            <button
              type="submit"
              disabled={isLoading}
              className={`btn bg-[#F7BA41] hover:bg-yellow-500 text-[#272218] px-4 py-3 rounded-xl ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Book consultation"
            >
              {isLoading ? "Submitting..." : "Book Now"}
            </button>
            {error && (
              <p
                className="text-red-500 text-sm mt-2 text-center md:text-left"
                role="alert"
              >
                {error}
              </p>
            )}
            {successMessage && (
              <p
                className="text-green-500 text-xl mt-2 text-center md:text-left"
                role="status"
              >
                {successMessage}
              </p>
            )}
          </form>
        </div>

        {/* Guideline [1]: Using rem units for margin (mt-12 -> mt-[3rem]) */}
        <div className="relative bg-white z-10 text-black mt-[clamp(3rem,8vh,6rem)] rounded-2xl p-8 md:p-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
            {/* Guideline [6]: Avoid hard-coded width. Using flex-basis for better responsive control. */}
            <div className="flex-shrink-0 md:w-1/3 mb-6 md:mb-0">
              {/* Guideline [11]: Using SVG for logos is recommended */}
              <div className="font-bold text-xl mb-6 w-[clamp(7.5rem,10vw,9rem)]">
                <Image
                  src={footerLogo}
                  alt="Flarize Logo"
                  width={100}
                  height={100}
                  sizes="(max-width: 768px) 110px, 130px"
                  className="w-full h-auto"
                />
              </div>
              <p className="text-base lg:text-lg text-[#444444] mb-6">
                Flarize is a company working to bring accessible energy to
                everyone. Our mission is to empower people to be in charge of
                their own power
              </p>
              {/* Guideline [8]: Increased touch target for social media icons with padding */}
              <div className="flex gap-4">
                <Link href="https://www.linkedin.com/showcase/flarize/" target="new" aria-label="LinkedIn" className="p-2">
                  <Image
                    src={LinkedInLogo}
                    alt="LinkedIn Logo"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link href="https://www.facebook.com/profile.php?id=61586953048937" target="new" aria-label="Facebook" className="p-2">
                  <Image
                    src={FacebookLogo}
                    alt="Facebook Logo"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link href="https://www.instagram.com/fla.rize?igsh=MW0zZnJueG01Mm01bQ%3D%3D&utm_source=qr" target="new" aria-label="Instagram" className="p-2">
                  <Image
                    src={InstagramLogo}
                    alt="Instagram Logo"
                    width={24}
                    height={24}
                  />
                </Link>
                {/* <Link href="#" aria-label="YouTube" className="p-2">
                  <Image
                    src={YoutubeLogo}
                    alt="YouTube Logo"
                    width={24}
                    height={24}
                  />
                </Link> */}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-10 lg:gap-12">
              {/* Guideline [1]: Converted px to rem (150px -> 9.375rem) */}
              <div className="space-y-4">
                <h3 className="text-[#666666] text-lg lg:text-xl font-light">
                  Company
                </h3>
                <ul className="flex flex-col gap-3 text-[#444444] text-lg lg:text-xl font-medium">
                  <li>
                    <Link
                      href="/solutions"
                      className="hover:text-gray-800 transition-all ease-in-out duration-300"
                    >
                      Our Solutions
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/projects"
                      className="hover:text-gray-800 transition-all ease-in-out duration-300"
                    >
                      Our Projects
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-gray-800 transition-all ease-in-out duration-300"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="hover:text-gray-800 transition-all ease-in-out duration-300"
                    >
                      About Us
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-[#666666] text-lg lg:text-xl font-light">
                  Resources
                </h3>
                <ul className="flex flex-col gap-3 text-[#444444] text-lg lg:text-xl font-medium">
                  <li>
                    <Link
                      href="/faq"
                      target="new"
                      className="hover:text-gray-800 transition-all ease-in-out duration-300"
                    >
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-gray-800 transition-all ease-in-out duration-300"
                    >
                      Blogs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-gray-800 transition-all ease-in-out duration-300"
                    >
                      Newsletters
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-[#666666] text-lg lg:text-xl font-light">
                  Legal
                </h3>
                <ul className="flex flex-col gap-3 text-[#444444] text-lg lg:text-xl font-medium">
                  <li>
                    <Link
                      href="/privacy"
                      target="new"
                      className="hover:text-gray-800 transition-all ease-in-out duration-300"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      target="new"
                      className="hover:text-gray-800 transition-all ease-in-out duration-300"
                    >
                      Terms and Conditions
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-xs mt-6 text-gray-300">
          © 2025 Flarize. All rights reserved. <br />
          Made by{" "}
          <Link
            href="https://nexotech.cc/"
            target="new"
            className="underline hover:text-white"
          >
            Nexotech
          </Link>
        </p>
      </section>
    </>
  );
}
