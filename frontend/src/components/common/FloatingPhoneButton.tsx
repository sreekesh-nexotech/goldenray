// src/components/common/FloatingPhoneButton.tsx
"use client";

import React from "react";

const FloatingPhoneButton = () => {
  const phoneNumber = "6282922988";
  const telUrl = `tel:${phoneNumber}`;

  return (
    <a
      href={telUrl}
      title="Call us now"
      className="fixed bottom-20 right-6 md:bottom-6 md:left-6 md:right-auto z-40 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#FDB913] text-black font-semibold rounded-full hover:bg-[#E5A712] hover:scale-105 transition-all duration-200 cursor-pointer shadow-lg"
      aria-label="Call us now"
    >
      {/* Phone Icon SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 sm:h-7 sm:w-7"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
      </svg>
    </a>
  );
};

export default FloatingPhoneButton;
