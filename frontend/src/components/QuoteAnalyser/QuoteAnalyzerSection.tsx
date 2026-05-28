"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";

type TabMode = "upload" | "manual";

const systemSizes = [
  "1 kW",
  "2 kW",
  "3 kW",
  "4 kW",
  "5 kW",
  "6 kW",
  "8 kW",
  "10 kW",
];

const includedItemsList = [
  "Solar Panels",
  "Inverter",
  "Mounting Structure",
  "Cabling",
  "Earthing",
  "Surge protection",
  "Net metering",
  "Subsidy filing",
  "WIFI Monitoring",
  "Warranty",
  "After-sales service",
  "Installation Labor",
];

const stats = [
  {
    value: "107+",
    label: "Quotes analyzed",
    labelClassName: "text-[#FF8A1E]",
    labelWidthClassName: "max-w-[11rem]",
  },
  {
    value: "30 s",
    label: "Analysis time",
    labelClassName: "text-[#FF8A1E]",
    labelWidthClassName: "max-w-[10rem]",
  },
  {
    value: "4.9 / 5",
    labelClassName: "text-[#111827]",
    labelWidthClassName: "max-w-[13rem] sm:max-w-[15rem] md:max-w-[16rem]",
  },
];

const QuoteAnalyzerSection = () => {
  const [activeTab, setActiveTab] = useState<TabMode>("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <section className="relative w-full bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Bigger stats row */}
        <div className="grid grid-cols-3 items-stretch py-12 sm:py-16 md:py-20">
          {stats.map((stat, index) => (
            <div
              key={stat.value}
              className={`flex flex-col items-center text-center px-3 sm:px-6 md:px-10 ${
                index < stats.length - 1 ? "border-r border-[#D8D8D8]" : ""
              }`}
            >
              <span className="text-[54px] leading-none font-semibold tracking-[-0.04em] text-[#111827] sm:text-[64px] md:text-[72px] lg:text-[78px]">
                {stat.value}
              </span>
              {index < 2 ? (
                <span
                  className={`mt-3 text-sm font-medium leading-[1.35] sm:mt-4 sm:text-base md:text-[18px] ${stat.labelClassName} ${stat.labelWidthClassName}`}
                >
                  {stat.label}
                </span>
              ) : (
                <span
                  className={`mt-3 max-w-[13rem] text-sm font-medium leading-[1.35] sm:mt-4 sm:max-w-[14rem] sm:text-base md:max-w-[16rem] md:text-[18px] ${stat.labelClassName}`}
                >
                  <span className="text-[#FF8A1E]">Trusted</span>{" "}
                  <span className="text-[#111827]">by thousands for</span>
                  <br />
                  <span className="text-[#111827]">solar solutions</span>
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Tabs + Card */}
        <div className="w-full max-w-4xl mx-auto pb-12 sm:pb-16">
          {/* Tabs */}
          <div className="grid grid-cols-2 rounded-t-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold transition-colors cursor-pointer ${
                activeTab === "upload"
                  ? "bg-[#074A4D] text-white"
                  : "bg-[#E5E7EB] text-[#4B5563]"
              }`}
            >
              Upload Quote
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("manual")}
              className={`py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold transition-colors cursor-pointer ${
                activeTab === "manual"
                  ? "bg-[#074A4D] text-white"
                  : "bg-[#E5E7EB] text-[#4B5563]"
              }`}
            >
              Enter Manually
            </button>
          </div>

          {/* Card content */}
          <div className="bg-[#F3F4F6] rounded-b-xl p-5 sm:p-8 text-left">
            {activeTab === "upload" ? (
              <>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl bg-white py-10 sm:py-14 flex flex-col items-center justify-center text-center px-4 transition-colors ${
                    dragActive ? "border-[#074A4D]" : "border-[#D1D5DB]"
                  }`}
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#E6F0F0] flex items-center justify-center mb-4">
                    <Image
                      src="/ep_upload-filled.png"
                      alt="Upload"
                      width={32}
                      height={32}
                      className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                    />
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-[#123532]">
                    Drag and drop your quote here
                  </p>
                  <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                    PDF, JPEG, PNG Supported, Max 10MB
                  </p>

                  {fileName && (
                    <p className="text-xs sm:text-sm text-[#074A4D] font-medium mt-3">
                      Selected: {fileName}
                    </p>
                  )}

                  <div className="flex flex-row gap-3 mt-6 w-full sm:w-auto justify-center">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg border border-[#D1D5DB] text-[#374151] text-xs sm:text-sm font-medium bg-white hover:bg-[#F9FAFB] cursor-pointer"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      Take Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg border border-[#D1D5DB] text-[#374151] text-xs sm:text-sm font-medium bg-white hover:bg-[#F9FAFB] cursor-pointer"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                        <polyline points="13 2 13 9 20 9" />
                      </svg>
                      Browse Files
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/jpeg,image/png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                <button
                  type="button"
                  className="w-full mt-6 bg-[#F7BA41] hover:bg-yellow-500 text-[#272218] font-semibold py-3 sm:py-4 rounded-xl text-sm sm:text-base md:text-lg cursor-pointer"
                >
                  Analyze My Quote
                </button>
              </>
            ) : (
              <ManualForm />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const ManualForm = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleCheck = (item: string) => {
    setChecked((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5"
    >
      <div>
        <label className="block text-xs sm:text-sm font-medium text-[#374151] mb-2">
          Company Name
        </label>
        <input
          type="text"
          placeholder="e.g kerala Solar Tech"
          className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#074A4D]"
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-[#374151] mb-2">
          System Size (kW)
        </label>
        <select
          defaultValue="3 kW"
          className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#074A4D]"
        >
          {systemSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-[#374151] mb-2">
          Quoted Price (₹)
        </label>
        <input
          type="text"
          placeholder="e.g 1800000"
          className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#074A4D]"
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-[#374151] mb-2">
          Panel Brand
        </label>
        <input
          type="text"
          placeholder="e.g Tata Power"
          className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#074A4D]"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-xs sm:text-sm font-medium text-[#374151] mb-2">
          Inverter Brand
        </label>
        <input
          type="text"
          placeholder="e.g Growatt"
          className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#074A4D]"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-xs sm:text-sm font-medium text-[#374151] mb-3">
          Included Items
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {includedItemsList.map((item) => (
            <label
              key={item}
              className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-3 cursor-pointer text-sm text-[#374151]"
            >
              <input
                type="checkbox"
                checked={!!checked[item]}
                onChange={() => toggleCheck(item)}
                className="w-4 h-4 accent-[#074A4D]"
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div className="md:col-span-2 mt-2">
        <button
          type="submit"
          className="w-full bg-[#F7BA41] hover:bg-yellow-500 text-[#272218] font-semibold py-3 sm:py-4 rounded-xl text-sm sm:text-base md:text-lg cursor-pointer"
        >
          Analyze My Quote
        </button>
      </div>
    </form>
  );
};

export default QuoteAnalyzerSection;
