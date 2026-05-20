"use client";

import React, { useState } from "react";
import {
  submitAffiliateApplication,
  AffiliateApplicationData,
} from "../../services/affiliateProgramService";

const PROFESSIONS = [
  "Real Estate Agent",
  "Builder / Developer",
  "Influencer / Content Creator",
  "Financial Advisor",
  "Freelancer / Gig Worker",
  "Society / RWA Representative",
  "Other",
];

const DISTRICTS = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIA_PHONE_REGEX = /^[6-9][0-9]{9}$/;

type FormState = Required<AffiliateApplicationData>;

const INITIAL_STATE: FormState = {
  full_name: "",
  phone: "",
  email: "",
  profession: "",
  district: "",
  website: "",
};

const normalizePhone = (raw: string): string => {
  let digits = raw.replace(/[\s\-()+]/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }
  return digits;
};

const Form = () => {
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errorMessage) setErrorMessage(null);
    if (successMessage) setSuccessMessage(null);
  };

  const validate = (): string | null => {
    if (!formData.full_name.trim()) return "Full name is required.";
    if (!INDIA_PHONE_REGEX.test(normalizePhone(formData.phone)))
      return "Enter a valid 10-digit Indian mobile number.";
    if (!EMAIL_REGEX.test(formData.email.trim()))
      return "Please enter a valid email address.";
    if (!formData.profession) return "Please select your profession.";
    if (!formData.district) return "Please select your district.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const payload: AffiliateApplicationData = {
        full_name: formData.full_name.trim(),
        phone: normalizePhone(formData.phone),
        email: formData.email.trim().toLowerCase(),
        profession: formData.profession,
        district: formData.district,
        website: formData.website,
      };
      const res = await submitAffiliateApplication(payload);
      setSuccessMessage(res?.message || "Message sent!");
      setFormData(INITIAL_STATE);
    } catch (err) {
      const apiError = err as { errorData?: { errors?: Record<string, string[]>; message?: string } };
      const fieldErrors = apiError?.errorData?.errors;
      if (fieldErrors) {
        const firstKey = Object.keys(fieldErrors)[0];
        const firstMsg = fieldErrors[firstKey]?.[0];
        setErrorMessage(firstMsg || "Submission failed. Please try again.");
      } else {
        setErrorMessage(
          apiError?.errorData?.message || "Submission failed. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="form"
      className="scroll-mt-10 relative py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24"
      style={{
        background:
          "radial-gradient(114.71% 114.71% at 50% 0%, #FFFFFF  0%, #F8F2E1 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-2 space-y-15">
        {/* Heading */}
        <h2 className="text-center text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
          Start Earning with Solar Today
        </h2>
        <p className="text-center text-sm md:text-xl font-normal leading-relaxed text-[#4B5563]">
          Before you apply, here are clear answers to the questions most
          potential partners ask. If you have a question not listed here,
          message us on WhatsApp and your partner manager will respond within a
          few hours.
        </p>

        {/* Contact Form */}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="max-w-2xl mx-auto bg-[#074A4D] rounded-2xl p-5 sm:p-6 "
        >
          <h3 className="hidden sm:block text-4xl md:text-5xl font-semibold leading-tight text-white text-center mb-1">
            Affiliate Application
          </h3>
          <p className="hidden sm:block text-sm md:text-xl font-normal leading-relaxed text-[#D4D4D4] text-center mb-5">
            Takes 2 minutes. Our partner team reviews and responds within 48
            hours.
          </p>

          <div className="bg-white rounded-2xl p-5 sm:p-6">
            {/* Honeypot — hidden from real users; bots that autofill will be rejected */}
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={handleChange}
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-10000px",
                width: "1px",
                height: "1px",
                opacity: 0,
              }}
            />
            {/* Full Name */}
            <div className="mb-4">
              <label
                htmlFor="full_name"
                className="block text-xs md:text-base font-medium leading-normal text-[#414651] mb-1.5"
              >
                Full Name
              </label>
              <input
                id="full_name"
                type="text"
                required
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm md:text-base text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#074A4D] focus:ring-1 focus:ring-[#074A4D]"
              />
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-xs md:text-base font-medium leading-normal text-[#414651] mb-1.5"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your number"
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm md:text-base text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#074A4D] focus:ring-1 focus:ring-[#074A4D]"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-xs md:text-base font-medium leading-normal text-[#414651] mb-1.5"
              >
                Email ID
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm md:text-base text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#074A4D] focus:ring-1 focus:ring-[#074A4D]"
              />
            </div>

            {/* Profession */}
            <div className="mb-4">
              <label
                htmlFor="profession"
                className="block text-xs md:text-base font-medium leading-normal text-[#414651] mb-1.5"
              >
                Your Profession
              </label>
              <select
                id="profession"
                required
                value={formData.profession}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm md:text-base text-[#111827] bg-white focus:outline-none focus:border-[#074A4D] focus:ring-1 focus:ring-[#074A4D] cursor-pointer"
              >
                <option value="" disabled className="text-[#9CA3AF]">
                  Select Your Profession
                </option>
                {PROFESSIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div className="mb-5">
              <label
                htmlFor="district"
                className="block text-xs md:text-base font-medium leading-normal text-[#414651] mb-1.5"
              >
                District / Area
              </label>
              <select
                id="district"
                required
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm md:text-base text-[#111827] bg-white focus:outline-none focus:border-[#074A4D] focus:ring-1 focus:ring-[#074A4D] cursor-pointer"
              >
                <option value="" disabled className="text-[#9CA3AF]">
                  Select Your District / Area
                </option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {errorMessage && (
              <p
                role="alert"
                className="mb-3 text-sm font-medium text-red-600"
              >
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p
                role="status"
                className="mb-3 text-sm font-medium text-green-700"
              >
                {successMessage}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#F7BA41] hover:bg-[#e5a51f] transition-colors duration-200 text-[#272218] font-semibold text-base md:text-xl leading-snug py-3 rounded-xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>

            {/* Divider */}
            <div className="text-center text-base md:text-xl font-normal leading-snug text-[#5B5B5B] my-3">
              or
            </div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/6282922988?text=Hi, I'd like to know more about Flarize solar solutions."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-[#074A4D] text-[#074A4D] hover:bg-[#F3F4F6] transition-colors duration-200 font-semibold text-base md:text-xl leading-snug py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Message us on WhatsApp
            </a>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Form;
