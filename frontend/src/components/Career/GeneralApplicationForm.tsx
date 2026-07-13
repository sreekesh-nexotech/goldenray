"use client";

import React, { useState } from "react";
import { ChevronDown, UploadCloud, FileText, X } from "lucide-react";
import ConfirmationModal from "../common/ConfirmationModal";

const baseInput =
  "w-full bg-white border rounded-lg px-4 py-3 text-sm md:text-base text-[#121217] outline-none placeholder:text-gray-400";
const baseSelect =
  "w-full appearance-none bg-white border rounded-lg px-4 py-3 pr-10 text-sm md:text-base outline-none cursor-pointer";

// border / focus colour depends on whether the field has an error
const borderCls = (error?: string) =>
  error
    ? "border-red-400 focus:border-red-500"
    : "border-gray-200 focus:border-[#F7BA41]";

// Strip angle brackets so nothing script-like can survive, and drop leading
// whitespace as the user types. Full trimming happens at validation time.
const sanitize = (v: string) => v.replace(/[<>]/g, "").replace(/^\s+/, "");

// ─── Validation helpers ───────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(?:\+91[\s-]?)?[6-9]\d{9}$/;

const toUrl = (v: string): URL | null => {
  try {
    return new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
  } catch {
    return null;
  }
};
const isHttpUrl = (v: string) => {
  const u = toUrl(v);
  return !!u && (u.protocol === "http:" || u.protocol === "https:");
};
const isLinkedInUrl = (v: string) => {
  const u = toUrl(v);
  return !!u && /(^|\.)linkedin\.com$/i.test(u.hostname);
};

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXT = [".pdf", ".doc", ".docx"];
const validateFile = (f: File): string | null => {
  const name = f.name.toLowerCase();
  if (!ALLOWED_EXT.some((ext) => name.endsWith(ext)))
    return "Only PDF or Word documents are allowed.";
  if (f.size > MAX_FILE_BYTES) return "File must be under 10MB.";
  return null;
};

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

// ─── Presentational pieces ────────────────────────────────────────────────────
function Field({
  name,
  label,
  required,
  error,
  children,
}: {
  name?: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={name ? `field-${name}` : undefined} className="scroll-mt-24">
      <label className="block text-sm font-medium text-[#121217] mb-2">
        {label}
        {required && <span className="text-[#123532]"> *</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Select({
  value,
  onChange,
  placeholder,
  options,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
  error?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseSelect} ${borderCls(error)} ${
          value ? "text-[#121217]" : "text-gray-500"
        }`}
      >
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
  name,
  title,
  required,
  heading,
  accept = ".pdf,.doc,.docx",
  file,
  onSelect,
  error,
}: {
  name?: string;
  title: string;
  required?: boolean;
  heading: string;
  accept?: string;
  file: File | null;
  onSelect: (file: File | null) => void;
  error?: string;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      id={name ? `field-${name}` : undefined}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 scroll-mt-24"
    >
      <h3 className="text-base font-semibold text-[#123532] mb-4">
        {title}
        {required && <span className="text-[#123532]"> *</span>}
      </h3>

      {file ? (
        // ── Selected-file state ──
        <div className="flex items-center justify-between gap-4 rounded-xl border border-[#123532]/15 bg-[#123532]/[0.04] px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#123532]">
              <FileText className="w-5 h-5 text-white" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#123532]">
                {file.name}
              </p>
              <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelect(null)}
            aria-label={`Remove ${file.name}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-[#123532]/10 hover:text-[#123532]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        // ── Empty / drop state ──
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const dropped = e.dataTransfer.files?.[0];
            if (dropped) onSelect(dropped);
          }}
          className={`flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-dashed px-5 py-5 cursor-pointer transition-colors ${
            dragging
              ? "border-[#F7BA41] bg-[#FEF9EE]"
              : error
                ? "border-red-400"
                : "border-gray-300 hover:border-[#F7BA41]"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#123532]">
              <UploadCloud className="w-5 h-5 text-white" />
            </span>
            <div>
              <p className="text-sm font-medium text-[#123532]">{heading}</p>
              <p className="text-xs text-gray-400">PDF, Docx (Max 10MB)</p>
            </div>
          </div>
          <span className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-[#123532] hover:bg-gray-50 transition-colors">
            <FileText className="w-4 h-4" />
            Browse file
          </span>
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
          />
        </label>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}

const experienceOptions = ["0–1 years", "1–3 years", "3–5 years", "5+ years"];
const noticeOptions = [
  "Immediate",
  "15 days",
  "1 month",
  "2 months",
  "3 months",
];
const availabilityOptions = ["Full-time", "Part-time", "Contract", "Internship"];
const interestOptions = [
  "Engineering",
  "Product",
  "Design",
  "Operations",
  "Sales & Marketing",
  "Customer Support",
];

type FormState = {
  fullName: string;
  email: string;
  mobile: string;
  location: string;
  linkedin: string;
  portfolio: string;
  interest: string;
  currentRole: string;
  experience: string;
  availability: string;
  notice: string;
  why: string;
};

const INITIAL: FormState = {
  fullName: "",
  email: "",
  mobile: "",
  location: "",
  linkedin: "",
  portfolio: "",
  interest: "",
  currentRole: "",
  experience: "",
  availability: "",
  notice: "",
  why: "",
};

export default function GeneralApplicationForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [resume, setResume] = useState<File | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const clearError = (key: string) =>
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const update = (key: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: sanitize(value) }));
    clearError(key);
  };

  const selectFile =
    (setter: (f: File | null) => void, key: string) => (file: File | null) => {
      setter(file);
      const err = file ? validateFile(file) : null;
      setErrors((prev) => {
        const next = { ...prev };
        if (err) next[key] = err;
        else delete next[key];
        return next;
      });
    };

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};

    if (!form.fullName.trim()) e.fullName = "Full name is required.";

    const email = form.email.trim();
    if (!email) e.email = "Email is required.";
    else if (!EMAIL_RE.test(email))
      e.email = "Enter a valid email address (e.g. name@example.com).";

    const mobile = form.mobile.trim().replace(/\s+/g, "");
    if (!mobile) e.mobile = "Mobile number is required.";
    else if (!PHONE_RE.test(mobile))
      e.mobile = "Enter a valid 10-digit Indian mobile number.";

    if (!form.location.trim()) e.location = "Current location is required.";

    const linkedin = form.linkedin.trim();
    if (!linkedin) e.linkedin = "LinkedIn profile is required.";
    else if (!isLinkedInUrl(linkedin))
      e.linkedin = "Enter a valid LinkedIn URL (e.g. linkedin.com/in/username).";

    const portfolio = form.portfolio.trim();
    if (portfolio && !isHttpUrl(portfolio))
      e.portfolio = "Enter a valid URL starting with http:// or https://.";

    if (!resume) e.resume = "Please upload your resume.";
    else {
      const fe = validateFile(resume);
      if (fe) e.resume = fe;
    }
    if (portfolioFile) {
      const fe = validateFile(portfolioFile);
      if (fe) e.portfolioFile = fe;
    }

    if (!confirmed) e.confirmed = "Please accept the declaration to continue.";

    return e;
  };

  // Top-to-bottom order used to jump to the first invalid field.
  const FIELD_ORDER = [
    "fullName",
    "email",
    "mobile",
    "location",
    "linkedin",
    "portfolio",
    "resume",
    "portfolioFile",
    "confirmed",
  ];

  const focusFirstError = (errs: Record<string, string>) => {
    const firstKey = FIELD_ORDER.find((k) => errs[k]);
    if (!firstKey) return;
    const el = document.getElementById(`field-${firstKey}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    const focusable = el?.querySelector<HTMLElement>(
      "input, select, textarea",
    );
    focusable?.focus({ preventScroll: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      focusFirstError(errs);
      return;
    }
    // No backend yet — surface the confirmation. When wired up, send the
    // trimmed `form` values + files here and only show the modal on success.
    setSubmitted(true);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-semibold leading-tight text-[#123532] mb-10 whitespace-normal lg:whitespace-nowrap">
          General Application Form
        </h2>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-[#F4F5F6] rounded-3xl p-4 sm:p-6 flex flex-col gap-5"
        >
          {/* Personal Information */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h3 className="text-base md:text-lg font-semibold text-[#123532] mb-6">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <Field
                name="fullName"
                label="Full Name"
                required
                error={errors.fullName}
              >
                <input
                  className={`${baseInput} ${borderCls(errors.fullName)}`}
                  placeholder="Enter your name"
                  maxLength={80}
                  value={form.fullName}
                  onChange={(e) => update("fullName")(e.target.value)}
                />
              </Field>
              <Field
                name="email"
                label="Email Address"
                required
                error={errors.email}
              >
                <input
                  type="email"
                  inputMode="email"
                  className={`${baseInput} ${borderCls(errors.email)}`}
                  placeholder="Enter email id"
                  maxLength={120}
                  value={form.email}
                  onChange={(e) => update("email")(e.target.value)}
                />
              </Field>
              <Field
                name="mobile"
                label="Mobile Number"
                required
                error={errors.mobile}
              >
                <input
                  type="tel"
                  inputMode="tel"
                  className={`${baseInput} ${borderCls(errors.mobile)}`}
                  placeholder="Enter number"
                  maxLength={15}
                  value={form.mobile}
                  onChange={(e) => update("mobile")(e.target.value)}
                />
              </Field>
              <Field
                name="location"
                label="Current Location"
                required
                error={errors.location}
              >
                <input
                  className={`${baseInput} ${borderCls(errors.location)}`}
                  placeholder="Enter current location"
                  maxLength={80}
                  value={form.location}
                  onChange={(e) => update("location")(e.target.value)}
                />
              </Field>
              <Field
                name="linkedin"
                label="LinkedIn Profile"
                required
                error={errors.linkedin}
              >
                <input
                  type="url"
                  inputMode="url"
                  className={`${baseInput} ${borderCls(errors.linkedin)}`}
                  placeholder="Paste URL"
                  maxLength={200}
                  value={form.linkedin}
                  onChange={(e) => update("linkedin")(e.target.value)}
                />
              </Field>
              <Field
                name="portfolio"
                label="Portfolio Website"
                error={errors.portfolio}
              >
                <input
                  type="url"
                  inputMode="url"
                  className={`${baseInput} ${borderCls(errors.portfolio)}`}
                  placeholder="Paste URL"
                  maxLength={200}
                  value={form.portfolio}
                  onChange={(e) => update("portfolio")(e.target.value)}
                />
              </Field>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h3 className="text-base md:text-lg font-semibold text-[#123532] mb-6">
              Professional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <Field label="Area of Interest">
                <Select
                  value={form.interest}
                  onChange={update("interest")}
                  placeholder="Select area of interest"
                  options={interestOptions}
                />
              </Field>
              <Field label="Current Role">
                <input
                  className={`${baseInput} ${borderCls()}`}
                  placeholder="Enter your current Role"
                  maxLength={80}
                  value={form.currentRole}
                  onChange={(e) => update("currentRole")(e.target.value)}
                />
              </Field>
              <Field label="Years of Experience">
                <Select
                  value={form.experience}
                  onChange={update("experience")}
                  placeholder="Select"
                  options={experienceOptions}
                />
              </Field>
              <Field label="Availability">
                <Select
                  value={form.availability}
                  onChange={update("availability")}
                  placeholder="Select availability"
                  options={availabilityOptions}
                />
              </Field>
              <Field label="Notice Period">
                <Select
                  value={form.notice}
                  onChange={update("notice")}
                  placeholder="Select notice period"
                  options={noticeOptions}
                />
              </Field>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h3 className="text-base md:text-lg font-semibold text-[#123532] mb-6">
              Additional Information
            </h3>
            <Field label="Why do you want to join Flarize?">
              <textarea
                rows={5}
                className={`${baseInput} ${borderCls()} resize-none`}
                placeholder="Tell us about your background, interests, and the type of work you'd like to do at Flarize."
                maxLength={1500}
                value={form.why}
                onChange={(e) => update("why")(e.target.value)}
              />
            </Field>
          </div>

          {/* Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <DropZone
              name="resume"
              title="Resume / CV"
              required
              heading="Drag and drop your resume here"
              file={resume}
              onSelect={selectFile(setResume, "resume")}
              error={errors.resume}
            />
            <DropZone
              name="portfolioFile"
              title="Portfolio PDF (Optional)"
              heading="Drag and drop your portfolio here"
              file={portfolioFile}
              onSelect={selectFile(setPortfolioFile, "portfolioFile")}
              error={errors.portfolioFile}
            />
          </div>

          {/* Declaration */}
          <div
            id="field-confirmed"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 scroll-mt-24"
          >
            <h3 className="text-base md:text-lg font-semibold text-[#123532] mb-4">
              Declaration
              <span className="text-[#123532]">*</span>
            </h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => {
                  setConfirmed(e.target.checked);
                  if (e.target.checked) clearError("confirmed");
                }}
                className="w-4 h-4 accent-[#123532] cursor-pointer"
              />
              <span className="text-sm md:text-base text-[#444444]">
                I consent to Flarize storing my information for future job
                applications.
              </span>
            </label>
            {errors.confirmed && (
              <p className="mt-2 text-xs text-red-500">{errors.confirmed}</p>
            )}
          </div>

          {/* Submit */}
          {Object.keys(errors).length > 0 && (
            <p className="text-center text-sm font-medium text-red-500">
              Please fix the highlighted{" "}
              {Object.keys(errors).length === 1 ? "field" : "fields"} above
              before submitting.
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-[#F7BA41] hover:bg-yellow-500 transition-colors rounded-xl py-4 text-sm md:text-base font-semibold text-[#272218] cursor-pointer"
          >
            Submit Application
          </button>
        </form>
      </div>

      <ConfirmationModal
        open={submitted}
        onClose={() => setSubmitted(false)}
        title="Application Received."
        description={
          <>
            <p>Thank you for your interest in joining Flarize.</p>
            <p>
              Your profile has been added to our talent pool. If a role matching
              your skills becomes available, our hiring team will get in touch.
            </p>
          </>
        }
        actionLabel="Explore More Opportunities"
        actionHref="/career"
      />
    </section>
  );
}
