"use client";

import React from "react";

// Define a type for the service items
type ServiceItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
};

// ServiceItem component to render each individual service
export default function ServiceItem({
  icon,
  title,
  description,
  bgColor,
}: ServiceItemProps) {
  return (
    <div
      className="flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl min-h-[280px] sm:min-h-[300px] md:min-h-[280px] lg:min-h-[240px] xl:min-h-[240px] 2xl:min-h-[300px] transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
      style={{ backgroundColor: bgColor }}
    >
      {/* Icon container with circular background */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 rounded-full flex items-center justify-center mb-4 sm:mb-6 bg-white/40 flex-shrink-0">
        {icon}
      </div>
      {/* Service title */}
      <h3 className="text-gray-900 text-base sm:text-lg xl:text-xl 2xl:text-2xl font-semibold mb-2 sm:mb-3 leading-tight min-h-[48px] sm:min-h-[56px] xl:min-h-[64px] 2xl:min-h-[72px] flex items-center">
        {title}
      </h3>
      {/* Service description */}
      <p className="text-gray-600 text-xs sm:text-sm xl:text-sm 2xl:text-lg leading-relaxed">
        {description}
      </p>
    </div>
  );
}
