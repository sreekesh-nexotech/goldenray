// src/components/ContactUs/ContactForm.tsx
"use client";

import { useState, useRef } from "react";
import { submitContactForm } from "@/services/basicContactService";

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [propertyType, setPropertyType] = useState("Residential");
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
      setError(
        "Please enter a valid name with at least 3 alphabetic characters.",
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
        "Thank you for reaching out! We'll get back to you shortly.",
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
          "We already have your details! Our team will contact you soon.",
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

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-6 sm:p-8 md:p-10 lg:p-12">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate={true}
        className="space-y-4 sm:space-y-5"
        aria-label="Contact form"
      >
        <div>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#F7BA41] focus:border-transparent placeholder:text-gray-400"
            required
            pattern="[A-Za-z\s]{3,}"
            title="Please enter at least 3 alphabetic characters."
            aria-label="Your name"
          />
        </div>

        <div>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            placeholder="Phone number"
            className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#F7BA41] focus:border-transparent placeholder:text-gray-400"
            required
            pattern="[6-9]\d{9}"
            title="Please enter a valid 10-digit Indian mobile number."
            aria-label="Your phone number"
          />
        </div>

        <div>
          <input
            type="text"
            id="pin_code"
            name="pin_code"
            placeholder="Pin code"
            className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#F7BA41] focus:border-transparent placeholder:text-gray-400"
            pattern="\d{6}"
            title="Please enter a valid 6-digit pin code."
            aria-label="Your pin code"
          />
        </div>

        <div>
          <select
            id="property_type"
            name="property_type"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#F7BA41] focus:border-transparent text-gray-700 bg-white appearance-none cursor-pointer"
            aria-label="Property type"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem",
            }}
          >
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-[#F7BA41] hover:bg-[#e6a73a] text-[#272218] font-semibold px-6 py-3 sm:py-4 rounded-lg text-base md:text-xl leading-snug transition-colors duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label="Book now"
        >
          {isLoading ? "Booking..." : "Book now"}
        </button>
      </form>

      {error && (
        <p
          className="text-red-600 bg-red-50 p-3 sm:p-4 rounded-lg text-xs md:text-base font-normal leading-normal mt-4"
          role="alert"
        >
          {error}
        </p>
      )}
      {successMessage && (
        <p
          className="text-green-700 bg-green-50 p-3 sm:p-4 rounded-lg text-xs md:text-base font-normal leading-normal mt-4"
          role="status"
        >
          {successMessage}
        </p>
      )}
    </div>
  );
}
