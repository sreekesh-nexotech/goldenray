// golden-ray/frontend/src/components/Home/Booking.tsx
"use client";

import React, { useState, useRef } from "react";
import { submitContactForm} from "@/services/basicContactService";

export default function BookingForm() {
  const bgImg = "https://gym-manager-pull.b-cdn.net/golden_ray/home/Image-1-3.png";
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
     if (err instanceof Error && err.message.includes('HTTP error! Status: 400, Message: {"phone_number":["lead collection home with this phone number already exists."]}')) {
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
    <div
      className="relative xl:min-h-screen bg-cover bg-no-repeat md:bg-center bg-center scroll-mt-10"
      style={{ backgroundImage: `url('${bgImg}')` }}
      id="booking"
    >
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative z-10 xl:min-h-screen flex items-center justify-start py-20 md:px-12 px-4 sm:px-6 lg:px-8 xl:px-36">
        <div className="text-white max-w-xl text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-semibold leading-tight mb-4">
            Book your free consultation
          </h1>
          <p className="text-base sm:text-2xl mb-8">
            Get expert advice and find your ideal solar solution—no obligations, just savings!
          </p>
          <form
            ref={formRef}
            className="flex flex-col gap-4 w-full max-w-sm max-sm:max-w-full"
            onSubmit={handleSubmit}
            noValidate={true} 
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
          </form>
          {error && (
            <p className="text-red-500 bg-[#f9e6e6] p-5 rounded-2xl text-sm mt-4 text-center md:text-left w-full lg:w-2/3" role="alert">
              {error}
            </p>
          )}
          {successMessage && (
            <p className=" text-green-500 bg-[#E6F9E6] p-5 rounded-2xl text-sm mt-4 text-center md:text-left w-full lg:w-2/3" role="status">
              <div className="flex items-center gap-1 mb-2 ">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                  <path fill="#c8e6c9" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#4caf50" d="M34.586,14.586l-13.57,13.586l-5.602-5.586l-2.828,2.828l8.434,8.414l16.395-16.414L34.586,14.586z"></path>
                </svg>
                <span className="font-bold text-base ">Thank You</span>
              </div>
              {successMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}