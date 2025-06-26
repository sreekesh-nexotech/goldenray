// golden-ray/frontend/src/components/BookingForm.tsx
"use client";

import React, { useState} from "react";
import { submitContactForm, ContactFormData } from "@/services/basicContactService";

export default function BookingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const scrollY = window.scrollY; // Preserve scroll position
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const mobileNumber = formData.get("mobileNumber") as string;

    // Client-side validation (in case HTML5 validation is bypassed)
    if (!name.match(/[A-Za-z\s]{3,}/)) {
      setError("Please enter a valid name with at least 3 alphabetic characters.");
      window.scrollTo(0, scrollY);
      return;
    }
    if (!mobileNumber.match(/[0-9\s\-+]{7,15}/)) {
      setError("Please enter a valid phone number (7-15 digits).");
      window.scrollTo(0, scrollY);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const data: ContactFormData = { name, mobileNumber };
      const response = await submitContactForm(data);
      setSuccessMessage(response.message);
      e.currentTarget.reset(); // Reset form on success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      window.scrollTo(0, scrollY); // Restore scroll position
    }
  };

  

  return (
    <div
      className="relative xl:min-h-screen bg-cover bg-no-repeat md:bg-center bg-center scroll-mt-10"
      style={{ backgroundImage: "url('/Image-1-3.png')" }}
      id="booking"
    >
      <div className="absolute inset-0 bg-black opacity-20"></div> {/* Overlay for better text readability */}

      <div className="relative z-10 xl:min-h-screen flex items-center justify-start py-20 md:px-12 px-4 sm:px-6 lg:px-8 xl:px-36">
        <div className="text-white max-w-xl text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-semibold leading-tight mb-4">
            Book your free consultation
          </h1>
          <p className="text-base sm:text-2xl mb-8">
            Get expert advice and find your ideal solar solution—no obligations, just savings!
          </p>

          {/* Form */}
          <form
            className="flex flex-col gap-4 w-full max-w-sm max-sm:max-w-full"
            onSubmit={handleSubmit}
            noValidate={false}
            aria-label="Book a free consultation"
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
                name="mobileNumber"
                placeholder="Mobile Number"
                className="px-4 py-3 rounded-xl text-black bg-white mb-3 focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
                required
                pattern="[0-9\s\-+]{7,15}"
                title="Please enter a valid phone number (7-15 digits)."
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
          </form>

          {/* Feedback Messages */}
          {error && (
            <p className=" text-red-500 text-sm mt-4 text-center md:text-left" role="alert">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="text-green-500 text-sm mt-4 text-center md:text-left" role="status">
              {successMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}