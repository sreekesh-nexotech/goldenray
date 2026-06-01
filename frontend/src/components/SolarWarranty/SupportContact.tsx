"use client";

import React, { useState } from "react";
import Link from "next/link";
import { submitWarrantyServiceRequest } from "../../services/warrantyServiceRequestService";

const issueTypes = [
  "Low Generation",
  "Inverter Fault",
  "Panel Damage",
  "KSEB / Net Metering",
  "Warranty Claim",
  "Other",
];

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const PhoneIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"
      stroke="#DC2626"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const WhatsAppCircle = ({ size = 28 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="16" cy="16" r="16" fill="#25D366" />
    <path
      d="M21.7 18.6c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2.1-1.5.3-.7.3-1.4.2-1.5 0-.2-.3-.3-.6-.4Z"
      fill="#fff"
    />
  </svg>
);

const EmailIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <rect x="2" y="5" width="20" height="14" rx="2" fill="#0EA5E9" />
    <path
      d="m4 8 8 5 8-5"
      stroke="#fff"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2.4" stroke="#fff" strokeWidth="1.4" />
  </svg>
);

const SupportContact = () => {
  const [issue, setIssue] = useState("Low Generation");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [feedback, setFeedback] = useState<string>("");

  const resetForm = () => {
    setFullName("");
    setPhone("");
    setDescription("");
    setIssue("Low Generation");
    setWebsite("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitStatus === "submitting") return;

    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setSubmitStatus("error");
      setFeedback("Please enter your full name.");
      return;
    }
    const phoneDigits = trimmedPhone.replace(/[\s\-()+]/g, "");
    const normalizedPhone =
      phoneDigits.length === 12 && phoneDigits.startsWith("91")
        ? phoneDigits.slice(2)
        : phoneDigits;
    if (!/^[6-9][0-9]{9}$/.test(normalizedPhone)) {
      setSubmitStatus("error");
      setFeedback("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    setSubmitStatus("submitting");
    setFeedback("");

    try {
      const response = await submitWarrantyServiceRequest({
        full_name: trimmedName,
        phone: normalizedPhone,
        issue_type: issue,
        description: description.trim(),
        website,
      });
      setSubmitStatus("success");
      setFeedback(
        response.message ||
          "Service request received. Our team will contact you shortly."
      );
      resetForm();
    } catch (err) {
      const error = err as {
        errorData?: { message?: string; errors?: Record<string, string[]> };
        message?: string;
      };
      const fieldError = error.errorData?.errors
        ? Object.values(error.errorData.errors)[0]?.[0]
        : undefined;
      setSubmitStatus("error");
      setFeedback(
        fieldError ||
          error.errorData?.message ||
          error.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full bg-white py-12 sm:py-16 md:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
        {/* Left */}
        <div className="flex flex-col h-full">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
            We&apos;re Here
            <br />
            When You Need Us
          </h2>
          <p className="text-sm md:text-base text-[#4B5563] leading-relaxed mb-8 max-w-md">
            Our service team is staffed 7 days a week for warranty, maintenance,
            and technical queries.
          </p>

          <div className="flex flex-col gap-4 flex-1">
            <div className="rounded-2xl bg-[#FBF3E2] px-5 sm:px-6 py-5 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                <PhoneIcon />
                <p className="text-xs sm:text-sm tracking-widest font-semibold text-[#111827]">
                  WARRANTY HOTLINE
                </p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#111827]">
                9995010043
              </p>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                Mon-Sat 7AM-8PM
              </p>
            </div>

            <div className="rounded-2xl bg-[#FBF3E2] px-5 sm:px-6 py-5 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                <WhatsAppCircle />
                <p className="text-xs sm:text-sm tracking-widest font-semibold text-[#111827]">
                  WHATSAPP SUPPORT
                </p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#111827]">
                9995010043
              </p>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                Under 1 min response
              </p>
            </div>

            <div className="rounded-2xl bg-[#FBF3E2] px-5 sm:px-6 py-5 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                <EmailIcon />
                <p className="text-xs sm:text-sm tracking-widest font-semibold text-[#111827]">
                  EMAIL
                </p>
              </div>
              <p className="text-lg sm:text-xl font-bold text-[#111827]">
                service@flarize.com
              </p>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                Within 4 business hours
              </p>
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="rounded-2xl bg-[#0E3A3A] p-3 sm:p-4 h-full">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl p-5 sm:p-7 h-full flex flex-col gap-5"
          >
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#074A4D]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your number"
                required
                inputMode="tel"
                className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#074A4D]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Issue Type
              </label>
              <select
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#074A4D]"
              >
                {issueTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Description (Optional)
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the problem..."
                className="w-full flex-1 min-h-28 border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#074A4D] resize-none"
              />
            </div>

            {/* Honeypot — kept visually hidden but reachable to bots */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-10000px",
                width: "1px",
                height: "1px",
                overflow: "hidden",
              }}
            >
              <label>
                Website
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </label>
            </div>

            {submitStatus === "error" && feedback && (
              <p role="alert" className="text-sm text-red-600">
                {feedback}
              </p>
            )}

            <button
              type="submit"
              disabled={submitStatus === "submitting"}
              className="w-full bg-[#F7BA41] hover:bg-yellow-500 text-[#272218] font-semibold py-3 sm:py-4 rounded-xl text-sm sm:text-base md:text-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitStatus === "submitting"
                ? "Submitting..."
                : "Request Service Call"}
            </button>

            <p className="text-center text-sm text-[#6B7280]">or</p>

            <a
              href="https://wa.me/919995010043"
              className="w-full flex items-center justify-center gap-2 border-2 border-[#0E3A3A] text-[#0E3A3A] font-semibold py-3 sm:py-4 rounded-xl text-sm sm:text-base md:text-lg hover:bg-[#F3F4F6]"
            >
              <WhatsAppCircle size={24} />
              Message us on WhatsApp
            </a>
          </form>
        </div>
      </div>

      {submitStatus === "success" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="warranty-success-title"
          className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-md bg-black/10"
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md px-8 py-10 text-center">
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-[#0E3A3A] flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m5 12.5 4.5 4.5L19 7"
                  stroke="#fff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3
              id="warranty-success-title"
              className="text-2xl sm:text-3xl font-semibold text-[#123532] leading-tight mb-3"
            >
              Thanks! We&apos;ve
              <br />
              received your request.
            </h3>
            <p className="text-sm sm:text-base text-[#6B7280] mb-8">
              Our team will get back to you within 24 hours
            </p>
            <Link
              href="/"
              className="block w-full bg-[#F7BA41] hover:bg-yellow-500 text-[#272218] font-semibold py-3 sm:py-4 rounded-xl text-sm sm:text-base md:text-lg"
            >
              Go back to home
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default SupportContact;
