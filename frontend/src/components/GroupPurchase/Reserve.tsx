"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  CircleMinus,
  IndianRupee,
  PhoneCall,
  WalletMinimal,
} from "lucide-react";
import ConfirmationModal from "../common/ConfirmationModal";

const INFO_ITEMS = [
  {
    icon: (
      <div className="border-3 border-[#074A4D] p-1 rounded-full">
        <IndianRupee strokeWidth={2.5} color="#074A4D" width={18} height={18} />
      </div>
    ),
    title: "₹1,000 — Fully Refundable",
    desc: "If your group doesn’t form within 30 days, your ₹1,000 is refunded to your original payment method within 48 hours. No questions asked, no forms to fill.",
  },
  {
    icon: (
      <div className="p-1">
        <PhoneCall strokeWidth={2.5} color="#074A4D" />
      </div>
    ),
    title: "15-Minute Callback — Guaranteed",
    desc: "Our Kerala-based solar consultants call you within 15 minutes during business hours (8am–8pm, Mon–Sat). We confirm your spot, explain group status in your area, and answer any question.",
  },
  {
    icon: (
      <div className="p-1 ">
        <CircleMinus strokeWidth={2.5} color="#074A4D" />
      </div>
    ),
    title: "No Spam. One Call. Transparent Updates.",
    desc: "We call once to confirm. We update you when your group forms. Your number is never shared with other group members or third parties.",
  },
  {
    icon: (
      <div className="border-3 border-[#074A4D] p-1 rounded-full">
        <WalletMinimal
          strokeWidth={2.5}
          color="#074A4D"
          width={18}
          height={18}
        />
      </div>
    ),
    title: "EMI Starting at ₹2,000/month",
    desc: "Most families pay ₹3,000–5,000 EMI per month — less than their current KSEB electricity bill. We explain zero-cost EMI options on the callback. No ITR required for most financing schemes.",
  },
];

const ROLES = ["Group Coordinator", "Referral Partner"];

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

const ESTIMATES = ["5", "6", "7", "8", "9", "10", "10+"];

const BILL_RANGES = [
  "Below ₹2,000",
  "₹2,000 – ₹5,000",
  "₹5,000 – ₹10,000",
  "Above ₹10,000",
];

// ─── Validation & sanitization ────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(?:\+91[\s-]?)?[6-9]\d{9}$/;

// Strip angle brackets so nothing script-like survives, and drop leading
// whitespace as the user types. Full trimming happens at validation time.
const sanitize = (v: string) => v.replace(/[<>]/g, "").replace(/^\s+/, "");

// ─── Shared field styling ─────────────────────────────────────────────────────
const FIELD_BASE =
  "w-full rounded-lg border px-4 py-3.5 text-sm md:text-base outline-none focus:ring-2 focus:ring-[#0B4740]/30";
const borderCls = (error?: string) =>
  error ? "border-red-400" : "border-[#E5E7EB]";

function FieldLabel({
  htmlFor,
  label,
  required,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-[#111827]"
    >
      {label}
      {required && <span className="text-[#111827]"> *</span>}
    </label>
  );
}

function InputField({
  id,
  label,
  placeholder,
  type = "text",
  required,
  value,
  onChange,
  error,
  maxLength,
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  maxLength?: number;
}) {
  return (
    <div id={`field-${id}`} className="scroll-mt-24">
      <FieldLabel htmlFor={id} label={label} required={required} />
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${FIELD_BASE} ${borderCls(error)} text-[#123532] placeholder:text-[#9CA3AF]`}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SelectField({
  id,
  label,
  placeholder,
  options,
  required,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  placeholder: string;
  options: string[];
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div id={`field-${id}`} className="scroll-mt-24">
      <FieldLabel htmlFor={id} label={label} required={required} />
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${FIELD_BASE} ${borderCls(error)} appearance-none bg-white pr-11 ${
            value ? "text-[#123532]" : "text-[#9CA3AF]"
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="text-[#123532]">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

type FormState = {
  name: string;
  phone: string;
  email: string;
  role: string;
  district: string;
  locality: string;
  estimate: string;
  bill: string;
  groupName: string;
};

const INITIAL: FormState = {
  name: "",
  phone: "",
  email: "",
  role: "",
  district: "",
  locality: "",
  estimate: "",
  bill: "",
  groupName: "",
};

// Top-to-bottom order for jumping to the first invalid field.
const FIELD_ORDER = ["name", "phone", "email", "role", "district", "locality"];

const Reserve = () => {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: sanitize(value) }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};

    if (!form.name.trim()) e.name = "Name is required.";

    const phone = form.phone.trim().replace(/\s+/g, "");
    if (!phone) e.phone = "Phone number is required.";
    else if (!PHONE_RE.test(phone))
      e.phone = "Enter a valid 10-digit Indian mobile number.";

    const email = form.email.trim();
    if (!email) e.email = "Email is required.";
    else if (!EMAIL_RE.test(email))
      e.email = "Enter a valid email address (e.g. name@example.com).";

    if (!form.role) e.role = "Please select your role.";
    if (!form.district) e.district = "Please select your district.";
    if (!form.locality.trim())
      e.locality = "Locality / area name is required.";

    return e;
  };

  const focusFirstError = (errs: Record<string, string>) => {
    const firstKey = FIELD_ORDER.find((k) => errs[k]);
    if (!firstKey) return;
    const el = document.getElementById(`field-${firstKey}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.querySelector<HTMLElement>("input, select")?.focus({
      preventScroll: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      focusFirstError(errs);
      return;
    }
    // No backend yet — surface the confirmation. When wired up, POST the
    // trimmed `form` values here and only show the modal on success.
    setSubmitted(true);
    setForm(INITIAL);
    setErrors({});
  };

  const handleCancel = () => {
    setForm(INITIAL);
    setErrors({});
  };

  return (
    <section
      id="reserve"
      className="scroll-mt-15 relative z-10 container mx-auto px-4 py-10 md:py-20 xl:py-16 max-w-7xl flex flex-col xl:flex-row items-stretch gap-10 md:gap-16"
    >
      {/* Left Info Section */}
      <div className="flex-1 w-full xl:max-w-xl flex flex-col">
        <h2 className="text-[#123532] text-4xl md:text-5xl font-semibold leading-tight text-left mb-3 sm:mb-4">
          Reserve Your Group Solar Spot in Kerala
        </h2>
        <p className="text-[#6B7280] text-sm md:text-xl font-normal leading-relaxed text-left mb-8 sm:mb-10 ">
          We&apos;ll call you within 15 minutes during business hours to confirm
          your spot, explain group status in your area, and answer any questions
          — no pressure.
        </p>

        <div className="flex flex-col gap-6">
          {INFO_ITEMS.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="shrink-0 bg-[#16A34A1A] p-2 rounded-lg">
                {item.icon}
              </div>
              <div>
                <div className="text-[#123532] text-base md:text-lg font-medium leading-snug mb-1">
                  {item.title}
                </div>
                <div className="text-[#757575] text-xs md:text-sm font-light leading-normal">
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Form Section — teal frame around a white card */}
      <div className="flex-1 w-full max-w-2xl bg-[#0B4740] rounded-3xl p-2.5 md:p-3 flex">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex w-full flex-col rounded-2xl bg-white px-6 py-8 md:px-8 md:py-10"
        >
          <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
            <InputField
              id="name"
              label="Name"
              placeholder="Enter your name"
              required
              value={form.name}
              onChange={update("name")}
              error={errors.name}
              maxLength={80}
            />
            <InputField
              id="phone"
              label="Phone Number"
              placeholder="Enter your number"
              type="tel"
              required
              value={form.phone}
              onChange={update("phone")}
              error={errors.phone}
              maxLength={15}
            />
            <InputField
              id="email"
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              required
              value={form.email}
              onChange={update("email")}
              error={errors.email}
              maxLength={120}
            />
            <SelectField
              id="role"
              label="Role Selection"
              placeholder="Select your role"
              options={ROLES}
              required
              value={form.role}
              onChange={update("role")}
              error={errors.role}
            />
            <SelectField
              id="district"
              label="District"
              placeholder="Select your district"
              options={DISTRICTS}
              required
              value={form.district}
              onChange={update("district")}
              error={errors.district}
            />
            <InputField
              id="locality"
              label="Locality / Area Name"
              placeholder="Enter your Locality / Area"
              required
              value={form.locality}
              onChange={update("locality")}
              error={errors.locality}
              maxLength={80}
            />
            <SelectField
              id="estimate"
              label="Interested Family Estimate"
              placeholder="Select Estimate"
              options={ESTIMATES}
              value={form.estimate}
              onChange={update("estimate")}
            />
            <SelectField
              id="bill"
              label="Your Monthly Electricity Bill"
              placeholder="Select bill range"
              options={BILL_RANGES}
              value={form.bill}
              onChange={update("bill")}
            />
            <div className="sm:col-span-2">
              <InputField
                id="group-name"
                label="Group Name (Optional)"
                placeholder="eg. Alappuzha solar group"
                value={form.groupName}
                onChange={update("groupName")}
                maxLength={80}
              />
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <p className="mt-5 text-center text-sm font-medium text-red-500">
              Please fix the highlighted{" "}
              {Object.keys(errors).length === 1 ? "field" : "fields"} above
              before submitting.
            </p>
          )}

          {/* Actions */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full rounded-lg border border-[#123532]/25 px-6 py-3.5 text-base font-semibold text-[#123532] transition-colors hover:bg-[#123532]/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-lg bg-[#F7BA41] px-6 py-3.5 text-base font-semibold text-[#123532] transition-colors hover:bg-yellow-500"
            >
              Submit Group Request
            </button>
          </div>
        </form>
      </div>

      <ConfirmationModal
        open={submitted}
        onClose={() => setSubmitted(false)}
        title="Group Purchase Request Received"
        description={
          <p>
            Excellent! Flarize has initiated your neighborhood solar suitability
            report. Our regional engineering leads will evaluate local grid
            constraints and reach out to you within{" "}
            <span className="font-semibold text-[#123532]">12–24 hours</span>.
          </p>
        }
        secondaryLabel="Explore solar savings"
        secondaryHref="/advanced-calculator"
        actionLabel="Go back to home"
        actionHref="/"
        footer={
          <>
            Wondering what comes next?{" "}
            <Link
              href="/how-flarize-works"
              className="font-semibold text-[#123532] hover:underline"
            >
              See how Flarize works
            </Link>
          </>
        }
      />
    </section>
  );
};

export default Reserve;
