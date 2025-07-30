// golden-ray/frontend/src/components/ui/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { submitContactForm} from "@/services/basicContactService";
import footerLogo from "../../../public/logo_header.png";
import LinkedInLogo from "../../../public/LinkedinLogo.png";
import FacebookLogo from "../../../public/FacebookLogo.png";
import InstagramLogo from "../../../public/InstagramLogo.png";
import YoutubeLogo from "../../../public/YoutubeLogo.png";

export default function Footer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const scrollY = window.scrollY;
    const form = e.currentTarget;

    // Ensure the form is valid according to HTML5 constraints before custom validation
    if (!form.checkValidity()) {
      form.reportValidity();
      window.scrollTo(0, scrollY);
      return;
    }

    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const phone_number = formData.get("phone_number") as string;

    // Client-side validation for name (at least 3 alphabetic characters)
    if (!name.match(/^[A-Za-z\s]{3,}$/)) {
      setError("Please enter a valid name with at least 3 alphabetic characters.");
      setSuccessMessage(null); // Clear success message if there's a new error
      window.scrollTo(0, scrollY);
      return;
    }

    // Client-side validation for Indian mobile numbers (10 digits, starts with 6, 7, 8, or 9)
    if (!phone_number.match(/^[6-9]\d{9}$/)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      setSuccessMessage(null); // Clear success message if there's a new error
      window.scrollTo(0, scrollY);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Destructure 'message' directly, no need for a 'response' variable here
      await submitContactForm({ name, phone_number });
      setSuccessMessage("Thank you! Your consultation request has been successfully submitted. We'll be in touch shortly!");
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('HTTP error! Status: 400') && err.message.includes('phone number already exists')) {
        setSuccessMessage("We already have your details! Our team will contact you soon.");
        if (formRef.current) {
          formRef.current.reset();
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(`Failed to submit: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
      window.scrollTo(0, scrollY);
    }
  };

  return (
    <>
      <section id="footer" className="scroll-mt-[45px]"></section>
      <section className="w-full bg-[#074A4D] rounded-t-3xl text-white py-16 px-4 sm:px-8 md:px-12 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-50 pointer-events-none
            bg-[url('../../public/grid.svg')]
            bg-no-repeat
            bg-auto"
          style={{
            WebkitMaskImage: `
              radial-gradient(farthest-side at 50% 50%, black 20%, transparent 100%),
              linear-gradient(to right, transparent 1%, black 50%, transparent 99%),
              linear-gradient(to bottom, transparent 1%, black 50%, transparent 99%)
            `,
            maskImage: `
              radial-gradient(farthest-side at 50% 50%, black 20%, transparent 100%),
              linear-gradient(to right, transparent 1%, black 50%, transparent 99%),
              linear-gradient(to bottom, transparent 1%, black 50%, transparent 99%)
            `,
            WebkitMaskComposite: "intersect",
            maskComposite: "intersect",
          }}
        />
        <div className="max-w-7xl z-10 mx-auto flex flex-col md:flex-row gap-10 justify-between">
          <div>
            <h2 className="lg:text-[64px]/15 text-[40px]/9 md:text-left text-center font-bold mb-4">
              Ready to go<br /> solar with us?
            </h2>
            <p className="lg:text-2xl text-xl md:text-left text-center text-[#DBD8D8]">
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
                pattern="[6-9]\d{9}" // Updated pattern for Indian mobile numbers
                title="Please enter a valid 10-digit Indian mobile number (e.g., 9876543210)."
                aria-label="Your mobile number"
              />
            </div>
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
              <p className="text-red-500 text-sm mt-2 text-center md:text-left" role="alert">
                {error}
              </p>
            )}
            {successMessage && (
              <p className="text-green-500 text-sm mt-2 text-center md:text-left" role="status">
                {successMessage}
              </p>
            )}
          </form>
        </div>
        <div className="relative bg-white z-10 text-black mt-12 rounded-2xl p-6 sm:p-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between">
            <div className="w-full md:w-1/3 max-w-md mb-6 md:mb-0">
              <div className="font-bold text-xl mb-2">
                <Image src={footerLogo} alt="Flarize Logo" width={120} height={40} />
              </div>
              <p className="text-sm text-[#444444] mb-4 md:mb-30">
                Flarize is a company working to bring accessible energy to everyone. Our mission is to empower people to be in charge of their own power
              </p>
              <div className="flex gap-4">
                <Link href="#" aria-label="LinkedIn">
                  <Image src={LinkedInLogo} alt="LinkedIn Logo" width={24} height={24} />
                </Link>
                <Link href="#" aria-label="Facebook">
                  <Image src={FacebookLogo} alt="Facebook Logo" width={24} height={24} />
                </Link>
                <Link href="#" aria-label="Instagram">
                  <Image src={InstagramLogo} alt="Instagram Logo" width={24} height={24} />
                </Link>
                <Link href="#" aria-label="YouTube">
                  <Image src={YoutubeLogo} alt="YouTube Logo" width={24} height={24} />
                </Link>
              </div>
            </div>
            <div className="flex flex-col md:flex-row flex-wrap gap-10 md:justify-end">
              <div className="min-w-[150px] space-y-3">
                <h1 className="text-[#666666] text-base font-light">Company</h1>
                <ul className="flex flex-col gap-5 text-[#444444] text-base font-medium">
                  <li>
                    <Link href="/solutions" className="hover:text-gray-800 transition-all ease-in-out duration-300">
                      Our Solutions
                    </Link>
                  </li>
                  <li>
                    <Link href="/projects" className="hover:text-gray-800 transition-all ease-in-out duration-300">
                      Our Projects
                    </Link>
                  </li>
                  <li>
                    <Link href="/resources" className="hover:text-gray-800 transition-all ease-in-out duration-300">
                      Resources
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-gray-800 transition-all ease-in-out duration-300">
                      About Us
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="min-w-[150px] space-y-3">
                <h1 className="text-[#666666] text-base font-light">Resources</h1>
                <ul className="flex flex-col gap-5 text-[#444444] text-base font-medium">
                  <li>
                    <Link href="/faq" target="new" className="hover:text-gray-800 transition-all ease-in-out duration-300">
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-gray-800 transition-all ease-in-out duration-300">
                      Blogs
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-gray-800 transition-all ease-in-out duration-300">
                      Newsletters
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="min-w-[150px] space-y-3">
                <h1 className="text-[#666666] text-base font-light">Legal</h1>
                <ul className="flex flex-col gap-5 text-[#444444] text-base font-medium">
                  <li>
                    <Link href="/privacy" target="new" className="hover:text-gray-800 transition-all ease-in-out duration-300">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" target="new" className="hover:text-gray-800 transition-all ease-in-out duration-300">
                      Terms and Conditions
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-xs mt-6 text-gray-300">
          © 2025 GoldenRay. All rights reserved. <br />
          Made by <Link href="https://nexotech.cc/" target="new">Nexotech</Link>
        </p>
      </section>
    </>
  );
}