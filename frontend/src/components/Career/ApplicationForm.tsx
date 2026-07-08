"use client";

import React, { useState } from "react";
import { ChevronDown, UploadCloud, FileText } from "lucide-react";

const inputClass =
  "w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm md:text-base text-[#121217] outline-none focus:border-[#F7BA41] placeholder:text-gray-400";

const selectClass =
  "w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm md:text-base text-gray-500 outline-none focus:border-[#F7BA41] cursor-pointer";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#121217] mb-2">
        {label}
        {required && <span className="text-[#123532]"> *</span>}
      </label>
      {children}
    </div>
  );
}

function Select({
  placeholder,
  options,
}: {
  placeholder: string;
  options: string[];
}) {
  return (
    <div className="relative">
      <select defaultValue="" className={selectClass}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-[#121217]">
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

function DropZone({
  title,
  required,
  heading,
}: {
  title: string;
  required?: boolean;
  heading: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-base font-semibold text-[#123532] mb-4">
        {title}
        {required && <span className="text-[#123532]"> *</span>}
      </h3>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-dashed border-gray-300 rounded-xl px-5 py-5">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#123532]">
            <UploadCloud className="w-5 h-5 text-white" />
          </span>
          <div>
            <p className="text-sm font-medium text-[#123532]">{heading}</p>
            <p className="text-xs text-gray-400">PDF, Docx (Max 10MB)</p>
          </div>
        </div>
        <label className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-[#123532] cursor-pointer hover:bg-gray-50 transition-colors">
          <FileText className="w-4 h-4" />
          Browse file
          <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
        </label>
      </div>
    </div>
  );
}

const experienceOptions = ["0–1 years", "1–3 years", "3–5 years", "5+ years"];
const salaryOptions = [
  "Below ₹3 LPA",
  "₹3–5 LPA",
  "₹5–8 LPA",
  "₹8–12 LPA",
  "₹12+ LPA",
];
const noticeOptions = [
  "Immediate",
  "15 days",
  "1 month",
  "2 months",
  "3 months",
];
const hearAboutOptions = [
  "LinkedIn",
  "Job Portal",
  "Referral",
  "Company Website",
  "Social Media",
  "Other",
];

export default function ApplicationForm() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <section className="pb-16 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="max-w-7xl mx-auto bg-[#F4F5F6] rounded-3xl p-4 sm:p-6 flex flex-col gap-5"
      >
        {/* Personal Information */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <h3 className="text-base md:text-lg font-semibold text-[#123532] mb-6">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <Field label="Full Name" required>
              <input className={inputClass} placeholder="Enter your name" />
            </Field>
            <Field label="Email Address" required>
              <input
                type="email"
                className={inputClass}
                placeholder="Enter email id"
              />
            </Field>
            <Field label="Mobile Number" required>
              <input
                type="tel"
                className={inputClass}
                placeholder="Select number"
              />
            </Field>
            <Field label="Current Location" required>
              <input
                className={inputClass}
                placeholder="Enter current location"
              />
            </Field>
            <Field label="LinkedIn Profile" required>
              <input className={inputClass} placeholder="Paste URL" />
            </Field>
            <Field label="Portfolio Website">
              <input className={inputClass} placeholder="Paste URL" />
            </Field>
          </div>
        </div>

        {/* Professional Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <h3 className="text-base md:text-lg font-semibold text-[#123532] mb-6">
            Professional Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <Field label="Current Company">
              <input
                className={inputClass}
                placeholder="Enter your current company"
              />
            </Field>
            <Field label="Current Role">
              <input
                className={inputClass}
                placeholder="Enter your current Role"
              />
            </Field>
            <Field label="Total Experience">
              <Select placeholder="Select experience" options={experienceOptions} />
            </Field>
            <Field label="Relevant Experience">
              <Select placeholder="Select experience" options={experienceOptions} />
            </Field>
            <Field label="Current Salary">
              <Select placeholder="Select current salary" options={salaryOptions} />
            </Field>
            <Field label="Expected Salary">
              <Select
                placeholder="Select expected salary"
                options={salaryOptions}
              />
            </Field>
            <Field label="Notice Period">
              <Select placeholder="Select notice period" options={noticeOptions} />
            </Field>
            <Field label="How did you hear about us?">
              <Select placeholder="Select" options={hearAboutOptions} />
            </Field>
          </div>
        </div>

        {/* Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <DropZone
            title="Resume / CV"
            required
            heading="Drag and drop your resume here"
          />
          <DropZone
            title="Portfolio PDF (Optional)"
            heading="Drag and drop your portfolio here"
          />
        </div>

        {/* Declaration */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <h3 className="text-base md:text-lg font-semibold text-[#123532] mb-4">
            Declaration
            <span className="text-[#123532]">*</span>
          </h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-4 h-4 accent-[#123532] cursor-pointer"
            />
            <span className="text-sm md:text-base text-[#444444]">
              I confirm that the information provided is accurate.
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!confirmed}
          className="w-full bg-[#F7BA41] hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-xl py-4 text-sm md:text-base font-semibold text-[#272218] cursor-pointer"
        >
          Submit Application
        </button>
      </form>
    </section>
  );
}
