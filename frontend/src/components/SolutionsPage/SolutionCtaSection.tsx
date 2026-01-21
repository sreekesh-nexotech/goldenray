// src/components/SolutionsPage/SolutionCtaSection.tsx
"use client";
import { useState } from "react";
import { submitContactForm } from "@/services/basicContactService";

interface SolutionCtaSectionProps {
  title?: string;
  subtitle?: string;
}

export default function SolutionCtaSection({
  title = "Ready to go solar with us?",
  subtitle = "We're just a message away!",
}: SolutionCtaSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await submitContactForm({
        name: formData.name,
        phone_number: formData.phone,
      });
      setSubmitStatus("success");
      setFormData({ name: "", phone: "" });
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 bg-[#074A4D]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Text Content */}
          <div className="text-white text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
              {title}
            </h2>
            <p className="text-lg md:text-xl text-gray-300">{subtitle}</p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md flex flex-col gap-4"
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full px-5 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Mobile Number"
              required
              pattern="[0-9]{10}"
              className="w-full px-5 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-4 bg-[#F7BA41] text-[#272218] font-bold rounded-xl hover:bg-[#e6a832] transition-colors duration-300 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <p className="text-green-400 text-center">
                Thank you! We&apos;ll contact you soon.
              </p>
            )}
            {submitStatus === "error" && (
              <p className="text-red-400 text-center">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
